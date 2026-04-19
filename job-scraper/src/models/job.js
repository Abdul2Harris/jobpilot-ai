import { z } from "zod";

const JobSchema = z.object({
  job_id: z.string().optional().nullable(),
  title: z.string(),
  company: z.string(),
  experience: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  salary: z.string().optional().nullable(),
  skills: z.array(z.string()).default([]),
  description: z.string().optional().nullable(),
  url: z.string().url(),
  company_url: z.string().url().optional().nullable(),  // ← allow null
  source: z.string(),
  posted_date: z.string().optional().nullable(),
  remote: z.boolean().default(false),
  scraped_at: z.string().default(() => new Date().toISOString()),
});

export { JobSchema };