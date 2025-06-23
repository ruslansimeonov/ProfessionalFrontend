import type { AppRouter } from "../../../ProfesionalBackend/src/trpc/router";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

// Export all types from backend
export type {
  GroupOutput,
  GroupWithCompany,
  UserWithDetails,
  GroupCapacity,
  GroupInvitationOutput,
  AddUsersToGroupResponse,
  GroupUsersWithDocumentStatusResponse,
  GroupAvailableUsersResponse,
  GroupDeleteResponse,
  PaginationInput,
  CreateGroupInput,
  UpdateGroupStatusInput,
  DocumentStatusSummary,
  UserOutput,
  CompanyOutput,
  RoleOutput,
} from "../../../ProfesionalBackend/src/trpc/schemas/shared";

// Router inference
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// Specific route types for easier use
export type GroupsRouter = {
  getAll: {
    input: RouterInputs["groups"]["getAll"];
    output: RouterOutputs["groups"]["getAll"];
  };
  getById: {
    input: RouterInputs["groups"]["getById"];
    output: RouterOutputs["groups"]["getById"];
  };
  create: {
    input: RouterInputs["groups"]["create"];
    output: RouterOutputs["groups"]["create"];
  };
  update: {
    input: RouterInputs["groups"]["update"];
    output: RouterOutputs["groups"]["update"];
  };
  delete: {
    input: RouterInputs["groups"]["delete"];
    output: RouterOutputs["groups"]["delete"];
  };
  addUsers: {
    input: RouterInputs["groups"]["addUsers"];
    output: RouterOutputs["groups"]["addUsers"];
  };
  getAvailableUsers: {
    input: RouterInputs["groups"]["getAvailableUsers"];
    output: RouterOutputs["groups"]["getAvailableUsers"];
  };
  getUsersWithDocumentStatus: {
    input: RouterInputs["groups"]["getUsersWithDocumentStatus"];
    output: RouterOutputs["groups"]["getUsersWithDocumentStatus"];
  };
  getInvitations: {
    input: RouterInputs["groups"]["getInvitations"];
    output: RouterOutputs["groups"]["getInvitations"];
  };
  createInvitation: {
    input: RouterInputs["groups"]["createInvitation"];
    output: RouterOutputs["groups"]["createInvitation"];
  };
  deactivateInvitation: {
    input: RouterInputs["groups"]["deactivateInvitation"];
    output: RouterOutputs["groups"]["deactivateInvitation"];
  };
  getCapacity: {
    input: RouterInputs["groups"]["getCapacity"];
    output: RouterOutputs["groups"]["getCapacity"];
  };
  updateStatus: {
    input: RouterInputs["groups"]["updateStatus"];
    output: RouterOutputs["groups"]["updateStatus"];
  };
};

// Helper types
export type GroupsGetAllOutput = RouterOutputs["groups"]["getAll"];
export type GroupsGetByIdOutput = RouterOutputs["groups"]["getById"];
export type GroupsCreateInput = RouterInputs["groups"]["create"];
export type GroupsCreateOutput = RouterOutputs["groups"]["create"];
export type GroupsUpdateInput = RouterInputs["groups"]["update"];
export type GroupsDeleteOutput = RouterOutputs["groups"]["delete"];
