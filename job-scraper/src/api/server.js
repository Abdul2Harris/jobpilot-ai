import express from "express";
import cors from "cors";
import { scrapeNaukri } from "../scrapers/naukri.js";
import { scrapeInternshala } from "../scrapers/internshala.js";

const app = express();
app.use(express.json());
app.use(cors());

// ─── Health Check ───────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Main Scrape Endpoint (n8n calls this) ──────────────────
app.post("/scrape", async (req, res) => {
  const {
    keyword = "software engineer",
    pages = 1,
    sources = ["naukri", "internshala"],
  } = req.body;
  

  console.log(`🔍 Scraping "${keyword}" from: ${sources.join(", ")}`);

  const SOURCE_LIMITS = { naukri: 20, internshala: 10 };

  try {
    // Run all scrapers in parallel, tracking which result belongs to which source
    const tasks = [];
    const activeSources = [];
    if (sources.includes("naukri")) { tasks.push(scrapeNaukri(keyword, pages)); activeSources.push("naukri"); }
    if (sources.includes("internshala")) { tasks.push(scrapeInternshala(keyword, pages)); activeSources.push("internshala"); }
    // if (sources.includes("wellfound")) { tasks.push(scrapeWellfound(keyword, pages)); activeSources.push("wellfound"); }

    const results = await Promise.allSettled(tasks);
    // console.log("results:", results);

    // Cap each source to its own limit before merging
    const allJobs = results.flatMap((r, i) => {
      if (r.status !== "fulfilled") return [];
      const limit = SOURCE_LIMITS[activeSources[i]] ?? 10;
      return r.value.slice(0, limit);
    });

    // Deduplicate by URL
    const seen = new Set();
    const jobsToSendn8n = allJobs.filter((job) => {
      if (seen.has(job.url)) return false;
      seen.add(job.url);
      return true;
    });

    console.log(`✅ Total unique jobs: ${jobsToSendn8n.length} (naukri ≤20, internshala ≤10)`);

    res.json({
      success: true,
      keyword,
      total: jobsToSendn8n.length,
      jobs: jobsToSendn8n,
    });
  } catch (error) {
    console.error("❌ Scrape error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Scrpe Testing
app.post("/scrape/test", async (req, res) => {
  const { keyword = "software engineer" } = req.body;

  // Scrape only 1 page from naukri
  const jobs = await scrapeNaukri(keyword, 1);

  // Send only first 5
  const testJobs = jobs.slice(0, 5);

  res.json({
    success: true,
    keyword,
    total: testJobs.length,
    jobs: testJobs,
  });
});


export default app 
