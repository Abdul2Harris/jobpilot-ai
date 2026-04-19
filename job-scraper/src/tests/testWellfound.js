import { scrapeWellfound } from "../scrapers/wellfound.js";

const jobs = await scrapeWellfound("software engineer", 1);

console.log("Jobs found:", jobs.length);
console.log(jobs); // show jobs

test();
