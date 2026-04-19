// src/scrapers/wellfound.js
// Uses Playwright because Wellfound needs JS to render
import chromium from "playwright";
import { JobSchema } from "../models/job.js";

async function scrapeWellfound(keyword, pages = 2) {
  const allJobs = [];
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    });

    const page = await context.newPage();

    // Intercept GraphQL API calls made by the website
    // This captures the response automatically
    page.on("response", async (response) => {
      if (
        response.url().includes("/graphql") &&
        response.request().method() === "POST"
      ) {
        try {
          const json = await response.json();
          const startups = json?.data?.jobListings?.startups || [];

          for (const startup of startups) {
            for (const listing of startup.jobListings || []) {
              const rawJob = {
                job_id: listing.id || listing.slug || null,
                title: listing.title || "",
                company: startup.name || "",
                location: (listing.locationNames || []).join(", "),
                salary: listing.salary || null,
                skills: (listing.skills || []).map(s => s.name),
                description: startup.highConcept || "",
                url: `https://wellfound.com/jobs/${listing.slug}`,
                company_url: startup.website || null,
                source: "wellfound",
                posted_date: listing.createdAt || null,
                remote: listing.remote || false,
              };

              const result = JobSchema.safeParse(rawJob);

              if (!result.success) {
                console.log("Invalid job skipped:", result.error.errors);
                return;
              }

              allJobs.push(result.data);
            }
          }
        } catch (err) {
          console.error("GraphQL parsing error:", err.message);
        }
      }
    });

    // Navigate to jobs page — triggers GraphQL calls automatically
    for (let pageNum = 1; pageNum <= pages; pageNum++) {
      await page.goto(
        `https://wellfound.com/jobs?q=${encodeURIComponent(keyword)}&page=${pageNum}`,
        { waitUntil: "networkidle" },
      );

      await page.waitForTimeout(3000); // Let all requests complete
    }

    console.log(`✅ Wellfound: ${allJobs.length} jobs`);
  } catch (error) {
    console.error("❌ Wellfound error:", error.message);
  } finally {
    await browser.close(); // Always close browser!
  }

  return allJobs;
}

export { scrapeWellfound }
