import { createQueryKeys } from "@lukemorales/query-key-factory";
import { GET } from "@/lib/client";
import type { IApplication } from "./contract";

export const applicationQueries = createQueryKeys("applications", {
  list: {
    queryKey: null,
    queryFn: (): Promise<IApplication[]> =>
      GET({ url: "/applications" }),
  },
});