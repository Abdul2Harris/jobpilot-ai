// src/tests/testNaukri.js
import { scrapeNaukri } from "../scrapers/naukri.js";

console.log("🔍 Testing Naukri scraper...")

const jobs = await scrapeNaukri("software engineer", 1);

console.log("Jobs found:", jobs.length);
console.log("\n📋 First job sample:")
console.log(JSON.stringify(jobs[0], null, 2))
