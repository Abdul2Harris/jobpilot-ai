import { createQueryKeys } from "@lukemorales/query-key-factory";
import { IProfile } from "./contract";
import { GET } from "@/lib/client";

export const authQueries = createQueryKeys("auth", {
  profile: {
    queryKey: null,
    queryFn: (): Promise<IProfile> => GET({ url: "/auth/profile" }),
  },
});