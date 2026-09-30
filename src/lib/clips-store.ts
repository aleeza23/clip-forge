import { ClipJob } from "@/types/clips";

declare global {
  // eslint-disable-next-line no-var
  var __clipsJobStore: Map<string, ClipJob> | undefined;
}

const jobs = globalThis.__clipsJobStore || new Map<string, ClipJob>();
if (process.env.NODE_ENV !== "production") {
  globalThis.__clipsJobStore = jobs;
}

export const clipsStore = {
  createJob(job: ClipJob): void {
    jobs.set(job.id, job);
  },

  getJob(id: string): ClipJob | undefined {
    return jobs.get(id);
  },

  updateJob(id: string, updates: Partial<ClipJob>): ClipJob | undefined {
    const existing = jobs.get(id);
    if (!existing) return undefined;
    const updated: ClipJob = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    jobs.set(id, updated);
    return updated;
  },

  deleteJob(id: string): boolean {
    return jobs.delete(id);
  },
};
