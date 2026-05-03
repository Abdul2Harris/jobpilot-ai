import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { authQueries } from "./auth/queries";
import { jobQueries } from "./jobs/queries";
import { applicationQueries } from "./applications/queries";

export const queries = mergeQueryKeys(
    authQueries,
    jobQueries,
    applicationQueries,
)