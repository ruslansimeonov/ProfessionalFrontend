import { TableRow, TableCell, Box, Chip, Button, Tooltip } from "@mui/material";
import {
  Person as PersonIcon,
  School as SchoolIcon,
  VisibilityOutlined as ViewIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import { User } from "@/app/utils/types/types";
import { formatDate, getFullName } from "@/app/utils/formatUtils";

interface UserTableRowProps {
  user: User;
  onViewUser: (id: number) => void;
  showCompany?: boolean;
  labels?: {
    view?: string;
    notEnrolled?: string;
  };
}

export function UserTableRow({
  user,
  onViewUser,
  showCompany = false,
  labels = {
    view: "View",
    notEnrolled: "Not enrolled",
  },
}: UserTableRowProps) {
  return (
    <TableRow
      hover
      sx={{
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "action.hover",
        },
      }}
    >
      {/* Name Cell */}
      <TableCell
        component="th"
        scope="row"
        onClick={() => onViewUser(user.details.id)}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PersonIcon sx={{ mr: 1, color: "primary.main", fontSize: 20 }} />
          {getFullName(user)}
        </Box>
      </TableCell>

      {/* EGN Cell */}
      <TableCell onClick={() => onViewUser(user.details.id)}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <BadgeIcon sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
          {user.details.EGN || "-"}
        </Box>
      </TableCell>

      {/* Course Cell */}
      <TableCell onClick={() => onViewUser(user.details.id)}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SchoolIcon sx={{ mr: 1, color: "info.main", fontSize: 20 }} />
          <Chip
            label={
              user.enrolledCourses?.[0]?.course?.courseName ||
              labels.notEnrolled
            }
            size="small"
            color={
              user.enrolledCourses?.[0]?.course?.courseName
                ? "primary"
                : "default"
            }
            variant={
              user.enrolledCourses?.[0]?.course?.courseName
                ? "filled"
                : "outlined"
            }
          />
        </Box>
      </TableCell>

      {/* Company Cell (optional) */}
      {showCompany && (
        <TableCell onClick={() => onViewUser(user.details.id)}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <BusinessIcon
              sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
            />
            {user.company?.companyName || "-"}
          </Box>
        </TableCell>
      )}

      {/* Date Cell */}
      <TableCell onClick={() => onViewUser(user.details.id)}>
        {formatDate(user.details.createdAt)}
      </TableCell>

      {/* Actions Cell */}
      <TableCell align="center">
        <Tooltip title={labels.view}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ViewIcon />}
            onClick={() => onViewUser(user.details.id)}
          >
            {labels.view}
          </Button>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
