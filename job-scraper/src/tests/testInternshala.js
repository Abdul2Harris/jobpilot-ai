// src/tests/testInternshala.js
import { scrapeInternshala } from "../scrapers/internshala.js";

console.log("🔍 Testing Internshala scraper...");

// Test single category, 1 page first
const jobs = await scrapeInternshala("software-development", 1);

console.log(`\n✅ Jobs found: ${jobs.length}`);
console.log("\n📋 First job sample:");
console.log(JSON.stringify(jobs[0], null, 2));