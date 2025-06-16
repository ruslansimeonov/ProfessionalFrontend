import {
  TableRow,
  TableCell,
  Box,
  Chip,
  Button,
  Tooltip,
  Checkbox,
} from "@mui/material";
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
  selectable?: boolean; // Add selectable prop
  isSelected?: boolean; // Add isSelected prop
  onUserSelect?: (userId: number) => void; // Add onUserSelect prop
  labels?: {
    view?: string;
    notEnrolled?: string;
  };
}

export function UserTableRow({
  user,
  onViewUser,
  showCompany = false,
  selectable = false,
  isSelected = false,
  onUserSelect,
  labels = {
    view: "View",
    notEnrolled: "Not enrolled",
  },
}: UserTableRowProps) {
  // Get the latest enrolled course
  const latestEnrolledCourse =
    user.enrolledCourses && user.enrolledCourses.length > 0
      ? user.enrolledCourses.sort(
          (a, b) =>
            new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
        )[0]
      : null;

  const handleSelectChange = () => {
    if (onUserSelect) {
      onUserSelect(user.details.id);
    }
  };

  return (
    <TableRow
      hover
      sx={{
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "action.hover",
        },
        ...(isSelected && {
          backgroundColor: "action.selected",
        }),
      }}
    >
      {/* Selection Checkbox */}
      {selectable && (
        <TableCell padding="checkbox">
          <Checkbox
            checked={isSelected}
            onChange={handleSelectChange}
            color="primary"
          />
        </TableCell>
      )}

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
              latestEnrolledCourse?.course.courseName || labels.notEnrolled
            }
            size="small"
            color={latestEnrolledCourse ? "primary" : "default"}
            variant={latestEnrolledCourse ? "filled" : "outlined"}
          />
          {/* Optional: Show count if multiple courses */}
          {user.enrolledCourses && user.enrolledCourses.length > 1 && (
            <Chip
              label={`+${user.enrolledCourses.length - 1}`}
              size="small"
              variant="outlined"
              sx={{ ml: 1, fontSize: "0.7rem" }}
            />
          )}
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
