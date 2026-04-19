// src/scrapers/internshala.js
import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";
import { JobSchema } from "../models/job.js";

chromium.use(StealthPlugin());

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Tech categories on internshala — we scrape all of these
const TECH_CATEGORIES = [
  "software-development",
  "web-development",
  "backend-development",
  "full-stack-development",
  "data-science",
  "machine-learning",
  "artificial-intelligence",
  "android-app-development",
  "ios-app-development",
  "devops",
  "cloud-computing",
  "cyber-security",
];

async function scrapeInternshala(category = "software-development", pages = 3) {
  const allJobs = [];

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  try {
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 800 },
    });

    const page = await context.newPage();

    for (let pageNum = 1; pageNum <= pages; pageNum++) {
      try {
        const url = pageNum === 1
          ? `https://internshala.com/jobs/${category}-jobs/`
          : `https://internshala.com/jobs/${category}-jobs/page-${pageNum}/`;

        console.log(`🌐 Scraping: ${url}`);

        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });

        // Wait for job cards to appear
        await page.waitForSelector(".individual_internship", {
          timeout: 15000,
        }).catch(() => console.log("⚠️ Timeout waiting for job cards"));

        await sleep(2000);

        // Get full page HTML and pass to Cheerio
        const html = await page.content();
        const $ = cheerio.load(html);

        const jobCards = $(".individual_internship[employment_type='job']");
        console.log(`📋 Found ${jobCards.length} job cards on page ${pageNum}`);

        jobCards.each((_, card) => {
          try {
            const $card = $(card);

            // Extract job_id from id attribute
            const cardId = $card.attr("id") || "";
            const job_id = cardId.replace("individual_internship_", "") || null;

            // Extract URL
            const relativeUrl = $card.find(".job-title-href").attr("href") || "";
            const jobUrl = relativeUrl
              ? `https://internshala.com${relativeUrl}`
              : "";

            if (!jobUrl) return; // skip if no URL

            // Extract title
            const title = $card.find(".job-title-href").text().trim();

            // Extract company
            const company = $card.find(".company-name").first().text().trim();

            // Extract locations — can be multiple
            const locationParts = [];
            $card.find(".locations span a").each((_, el) => {
              locationParts.push($(el).text().trim());
            });
            const location = locationParts.join(", ") || null;

            // Extract salary — use desktop version
            const salaryRaw = $card.find(".row-1-item .desktop").text().trim();
            const salary = salaryRaw || null;

            // Extract experience — find briefcase icon's parent div
            let experience = null;
            $card.find(".row-1-item").each((_, item) => {
              const hasIcon = $(item).find(".ic-16-briefcase").length > 0;
              if (hasIcon) {
                experience = $(item).find("span").text().trim() || null;
              }
            });

            // Extract description
            const description = $card.find(".about_job .text").text().trim() || null;

            // Extract skills
            const skills = [];
            $card.find(".job_skill").each((_, el) => {
              const skill = $(el).text().trim();
              if (skill) skills.push(skill);
            });

            // Extract posted date
            const posted_date = $card.find(".status-inactive span").text().trim() || null;

            const rawJob = {
              job_id,
              title,
              company,
              location,
              salary,
              experience,
              skills,
              description,
              url: jobUrl,
              company_url: null,
              source: "internshala",
              posted_date,
              remote: false,
              scraped_at: new Date().toISOString(),
            };

            const result = JobSchema.safeParse(rawJob);

            if (!result.success) {
              console.log("❌ Invalid job skipped:", JSON.stringify(result.error.errors, null, 2));
              return;
            }

            allJobs.push(result.data);

          } catch (e) {
            console.log("⚠️ Error parsing job card:", e.message);
          }
        });

        console.log(`✅ Internshala page ${pageNum}: ${allJobs.length} total jobs so far`);
        await sleep(2000);

      } catch (error) {
        console.error(`❌ Internshala error on page ${pageNum}:`, error.message);
        break;
      }
    }

  } catch (error) {
    console.error("❌ Internshala browser error:", error.message);
  } finally {
    await browser.close();
  }

  return allJobs;
}

// Scrape multiple tech categories at once
async function scrapeInternshalaAllTech(pages = 2) {
  const allJobs = [];
  const seen = new Set();

  for (const category of TECH_CATEGORIES) {
    console.log(`\n🔍 Category: ${category}`);
    const jobs = await scrapeInternshala(category, pages);

    // Deduplicate by URL
    for (const job of jobs) {
      if (!seen.has(job.url)) {
        seen.add(job.url);
        allJobs.push(job);
      }
    }

    await sleep(3000); // wait between categories
  }

  return allJobs;
}

export { scrapeInternshala, scrapeInternshalaAllTech };