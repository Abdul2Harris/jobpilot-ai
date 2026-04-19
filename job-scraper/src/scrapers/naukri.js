// src/scrapers/naukri.js
import { chromium } from "playwright-extra";
import { JobSchema } from "../models/job.js";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

// Naukri detects headless browsers via navigator.webdriver flag. We need to hide it. so we use stealhplugin
chromium.use(StealthPlugin());

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getPlaceholder = (placeholders, type) =>
  placeholders.find((p) => p.type === type)?.label || null;

async function scrapeNaukri(keyword, pages = 3) {
  const allJobs = [];
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled", // hides automation
    ],
  }); // if headless: false, browser window opens

  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 800 },
      locale: "en-IN",
      extraHTTPHeaders: {
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      },
    }); // A browser context is like a fresh browser profile. It has: cookies, local storage, user agent, session

    const page = await context.newPage(); // This creates a new browser tab. Equivalent to: Chrome → open new tab

    // Intercept the API response automatically
    // Browser handles nkparam + cookies by itself
    page.on("response", async (response) => {
      // console.log("response:", response);
      const url = response.url();
      if (url.includes("/jobapi/v3/search") && response.status() === 200) {
        try {
          const data = await response.json();
          const jobList = data?.jobDetails || [];

          // console.log("jobList:", jobList);

          if (jobList.length === 0) {
            console.log(`Naukri: No more jobs at page ${page}`);
          }

          for (const job of jobList) {
            const placeholders = job.placeholders || ''
            const jobUrl = `https://www.naukri.com${job.jdURL || ""}`;

            const rawJob = {
              job_id: job.jobId || jobUrl || null,
              title: job.title || "",
              company: job.companyName || "",
              experience: getPlaceholder(placeholders, "experience"), // ← finds by type
              location: getPlaceholder(placeholders, "location"), // ← never breaks
              salary: getPlaceholder(placeholders, "salary"), // ← order independent
              skills:
                typeof job.tagsAndSkills === "string"
                  ? job.tagsAndSkills
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean)
                  : Array.isArray(job.tagsAndSkills)
                    ? job.tagsAndSkills.map((s) => s.label || s)
                    : [],
              description: job.jobDescription || "",
              url: jobUrl,
              company_url: null,
              source: "naukri",
              posted_date: job.footerPlaceholderLabel || null,
              remote: job.remote || false,
              scraped_at: new Date().toISOString(),
            };

            const result = JobSchema.safeParse(rawJob);

            if (!result.success) {
              console.log(
                "❌ Invalid job skipped:",
                JSON.stringify(result.error.errors, null, 2),
              );
              continue;
            }

            allJobs.push(result.data);
          }

          console.log(`✅ Naukri captured ${jobList.length} jobs`);
        } catch (e) {
          console.log("⚠️ Could not parse response:", e.message);
        }
      }
    });

    // Page 1 — direct search URL
    const searchUrl = `https://www.naukri.com/${keyword.replace(/ /g, "-")}-jobs?k=${encodeURIComponent(keyword)}`;

    console.log(`🌐 Navigating to: ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: "networkidle", timeout: 60000 });
    await sleep(3000); // Wait 3 seconds between pages — be polite!

    // Pages 2+ — click next page button
    for (let p = 2; p <= pages; p++) {
      try {
        const nextBtn = page
          .locator("a.styles_btn-secondary__2AsIP, [class*='next']")
          .last();
        const isVisible = await nextBtn.isVisible();

        if (!isVisible) {
          console.log("No more pages");
          break;
        }

        await nextBtn.click();
        await page.waitForLoadState("networkidle");
        await sleep(2000);
        console.log(`📄 Navigated to page ${p}`);
      } catch (e) {
        console.log(`⚠️ Could not go to page ${p}:`, e.message);
        break;
      }
    }
  } catch (e) {
    console.error("❌ Naukri scraper error:", e.message);
  } finally {
    await browser.close();
  }

  return allJobs;
}

export { scrapeNaukri };
