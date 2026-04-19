// src/tests/testNaukri.js
import { scrapeHiringCafe } from "../scrapers/hiringcafe.js";

console.log("🔍 Testing Hiringcafe scraper...")

const jobs = await scrapeHiringCafe("software engineer", 1);

console.log("Jobs found:", jobs.length);
console.log("\n📋 First job sample:")
console.log(JSON.stringify(jobs[0], null, 2))