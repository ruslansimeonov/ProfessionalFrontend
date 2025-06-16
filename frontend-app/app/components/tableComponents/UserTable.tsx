import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Box,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { User } from "@/app/utils/types/types";
import { UserTableRow } from "./UserTableRow";

interface UsersTableProps {
  users: User[];
  total: number;
  page: number;
  rowsPerPage: number;
  loading?: boolean;
  showCompany?: boolean;
  selectable?: boolean;
  selectedUsers?: number[];
  showDocumentStatus?: boolean;
  documentStatusLoading?: boolean;
  onUserSelect?: (userId: number) => void;
  onViewUser?: (id: number) => void;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  labels?: {
    columns?: {
      name: string;
      idNumber: string;
      course: string;
      company?: string;
      registrationDate: string;
      actions: string;
      documentStatus?: string;
    };
    pagination?: {
      rowsPerPage: string;
      displayedRows?: (paginationInfo: {
        from: number;
        to: number;
        count: number;
      }) => string;
    };
  };
}

export function UsersTable({
  users,
  total,
  page,
  rowsPerPage,
  showCompany = false,
  selectable = false,
  selectedUsers = [],
  showDocumentStatus = false,
  documentStatusLoading = false,
  onUserSelect,
  onViewUser,
  onPageChange,
  onRowsPerPageChange,
  labels,
}: UsersTableProps) {
  // Handle select all functionality
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onUserSelect) return;

    if (event.target.checked) {
      users.forEach((user) => onUserSelect(user.details.id));
    } else {
      users.forEach((user) => {
        if (selectedUsers.includes(user.details.id)) {
          onUserSelect(user.details.id);
        }
      });
    }
  };

  const allCurrentPageSelected =
    users.length > 0 &&
    users.every((user) => selectedUsers.includes(user.details.id));

  const someCurrentPageSelected = users.some((user) =>
    selectedUsers.includes(user.details.id)
  );

  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {/* Select All Checkbox */}
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      someCurrentPageSelected && !allCurrentPageSelected
                    }
                    checked={allCurrentPageSelected}
                    onChange={handleSelectAll}
                    color="primary"
                  />
                </TableCell>
              )}

              {/* Document Status Column */}
              {showDocumentStatus && (
                <TableCell align="center" sx={{ width: 60 }}>
                  <Tooltip
                    title={labels?.columns?.documentStatus || "Document Status"}
                  >
                    <Box sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>
                      Docs
                    </Box>
                  </Tooltip>
                </TableCell>
              )}

              <TableCell sx={{ fontWeight: "bold" }}>
                {labels?.columns?.name}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                {labels?.columns?.idNumber}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                {labels?.columns?.course}
              </TableCell>
              {showCompany && (
                <TableCell sx={{ fontWeight: "bold" }}>
                  {labels?.columns?.company}
                </TableCell>
              )}
              <TableCell sx={{ fontWeight: "bold" }}>
                {labels?.columns?.registrationDate}
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                {labels?.columns?.actions}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <UserTableRow
                key={user.details.id}
                user={user}
                onViewUser={onViewUser || (() => {})}
                showCompany={showCompany}
                selectable={selectable}
                isSelected={selectedUsers.includes(user.details.id)}
                onUserSelect={onUserSelect}
                showDocumentStatus={showDocumentStatus}
                documentStatusLoading={documentStatusLoading}
                labels={{
                  view: "View",
                  notEnrolled: "Not enrolled",
                }}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage={labels?.pagination?.rowsPerPage}
        labelDisplayedRows={labels?.pagination?.displayedRows}
      />
    </>
  );
}
