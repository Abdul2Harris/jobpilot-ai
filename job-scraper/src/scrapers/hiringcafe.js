// src/scrapers/hiringcafe.js
import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { JobSchema } from "../models/job.js";

chromium.use(StealthPlugin());

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Build the search filter object (decoded from their ?s= param)
function buildSearchParams(keyword) {
  return {
    locations: [
      {
        formatted_address: "India",
        types: ["country"],
        geometry: { location: { lat: "13.0895", lon: "80.2739" } },
        id: "user_country",
        address_components: [
          { long_name: "India", short_name: "IN", types: ["country"] }
        ],
        options: { flexible_regions: ["anywhere_in_continent", "anywhere_in_world"] }
      }
    ],
    workplaceTypes: ["Remote", "Hybrid", "Onsite"],
    searchQuery: keyword,
    commitmentTypes: ["Full Time", "Part Time", "Contract", "Internship"],
    seniority_level: ["Entry Level", "Mid Level", "Senior Level"],
    sortBy: "default",
    dateFetchedPastNDays: 121,
    hiddenCompanies: [],
    user: null,
  };
}

async function scrapeHiringCafe(keyword, pages = 3) {
  const allJobs = [];
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-blink-features=AutomationControlled"],
  });

  try {
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 800 },
    });

    const page = await context.newPage();

    // First visit homepage to get cookies set
    await page.goto("https://hiring.cafe", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await sleep(3000);

    // Now make API calls directly using page.evaluate (runs inside browser context)
    for (let pageNum = 0; pageNum < pages; pageNum++) {
      try {
        const searchParams = buildSearchParams(keyword);
        const encodedS = encodeURIComponent(JSON.stringify(searchParams));
        const apiUrl = `https://hiring.cafe/api/search-jobs?s=${encodedS}&size=40&page=${pageNum}`;

        // Use browser's fetch (has cookies + proper headers automatically)
        const data = await page.evaluate(async (url) => {
          const res = await fetch(url, {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(30000),
          });
          return res.json();
        }, apiUrl);

        const results = data?.results || [];

        if (results.length === 0) {
          console.log(`⚠️ HiringCafe: no results on page ${pageNum}`);
          break;
        }

        for (const job of results) {
          const processed = job.v5_processed_job_data || {};
          const enriched = job.enriched_company_data || {};
          const jobInfo = job.job_information || {};

          // Build salary string
          const minSal = processed.yearly_min_compensation;
          const maxSal = processed.yearly_max_compensation;
          const salary = minSal && maxSal
            ? `${minSal} - ${maxSal} ${processed.listed_compensation_currency || ""}`.trim()
            : null;

          const rawJob = {
            job_id: job.id || null,
            title: jobInfo.title || processed.core_job_title || "",
            company: processed.company_name || enriched.name || "",
            experience: processed.min_industry_and_role_yoe
              ? `${processed.min_industry_and_role_yoe} years`
              : null,
            location: processed.formatted_workplace_location || null,
            salary,
            skills: processed.technical_tools || [],
            description: jobInfo.description || "",
            url: job.apply_url || "",
            company_url: enriched.homepage_uri
              ? `https://${enriched.homepage_uri}`
              : null,
            source: "hiringcafe",
            posted_date: processed.estimated_publish_date || null,
            remote: processed.workplace_type === "Remote",
            scraped_at: new Date().toISOString(),
          };

          const result = JobSchema.safeParse(rawJob);

          if (!result.success) {
            console.log("❌ Invalid job skipped:", JSON.stringify(result.error.errors, null, 2));
            continue;
          }

          allJobs.push(result.data);
        }

        console.log(`✅ HiringCafe page ${pageNum}: ${results.length} jobs`);
        await sleep(2000);

      } catch (error) {
        console.error(`❌ HiringCafe error on page ${pageNum}:`, error.message);
        break;
      }
    }

  } catch (error) {
    console.error("❌ HiringCafe browser error:", error.message);
  } finally {
    await browser.close();
  }

  return allJobs;
}

export { scrapeHiringCafe };
