import type { AppRouter } from "../../../ProfesionalBackend/src/trpc/router";
import { createTRPCReact } from "@trpc/react-query";
export const trpc = createTRPCReact<AppRouter>();
