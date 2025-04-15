import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import { User } from "@/app/utils/types/types";
import { UserTableRow } from "./UserTableRow";

interface UsersTableProps {
  users: User[];
  total: number;
  page: number;
  rowsPerPage: number;
  loading: boolean;
  showCompany?: boolean;
  onViewUser: (id: number) => void;
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
    };
    pagination?: {
      rowsPerPage: string;
      displayedRows?: (paginationInfo: {
        from: number;
        to: number;
        count: number;
      }) => string;
    };

    showCompanyColumn: boolean;
  };
}

export function UsersTable({
  users,
  total,
  page,
  rowsPerPage,
  showCompany = false,
  onViewUser,
  onPageChange,
  onRowsPerPageChange,
  labels,
}: UsersTableProps) {
  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
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
                onViewUser={onViewUser}
                showCompany={showCompany}
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
