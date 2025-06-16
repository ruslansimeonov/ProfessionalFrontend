import {
  TableRow,
  TableCell,
  Box,
  Chip,
  Button,
  Tooltip,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  School as SchoolIcon,
  VisibilityOutlined as ViewIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon,
  CheckCircle as CheckIcon,
  Cancel as XIcon,
} from "@mui/icons-material";
import { User, Document } from "@/app/utils/types/types";
import { formatDate, getFullName } from "@/app/utils/formatUtils";

interface UserTableRowProps {
  user: User;
  onViewUser: (id: number) => void;
  showCompany?: boolean;
  selectable?: boolean;
  isSelected?: boolean;
  onUserSelect?: (userId: number) => void;
  showDocumentStatus?: boolean;
  documentStatusLoading?: boolean;
  labels?: {
    view?: string;
    notEnrolled?: string;
  };
}

// Function to calculate overall document status from user's documents
const calculateDocumentStatus = (
  documents: Document[] = []
): "complete" | "incomplete" | "unknown" => {
  if (!documents || documents.length === 0) {
    return "incomplete"; // Changed from "unknown" to "incomplete"
  }

  // Check if any documents have status
  const documentsWithStatus = documents.filter((doc) => doc.documentStatus);

  if (documentsWithStatus.length === 0) {
    return "incomplete"; // Changed from "unknown" to "incomplete"
  }

  // If any document is incomplete, overall status is incomplete
  const hasIncomplete = documentsWithStatus.some(
    (doc) => doc.documentStatus === "incomplete"
  );
  if (hasIncomplete) {
    return "incomplete";
  }

  // If all documents with status are complete, overall status is complete
  const allComplete = documentsWithStatus.every(
    (doc) => doc.documentStatus === "complete"
  );
  if (allComplete) {
    return "complete";
  }

  // Default to incomplete if mixed or unclear
  return "incomplete"; // Changed from "unknown" to "incomplete"
};

// Document status indicator component
const DocumentStatusIndicator = ({
  status,
  loading,
  documents = [],
}: {
  status?: "complete" | "incomplete" | "unknown";
  loading?: boolean;
  documents?: Document[];
}) => {
  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress size={16} />
      </Box>
    );
  }

  // Calculate status from documents if not provided
  const actualStatus = status || calculateDocumentStatus(documents);

  // Count documents for tooltip
  const totalDocs = documents.length;
  const completeDocs = documents.filter(
    (doc) => doc.documentStatus === "complete"
  ).length;
  const incompleteDocs = documents.filter(
    (doc) => doc.documentStatus === "incomplete" || !doc.documentStatus
  ).length;

  const tooltipText =
    totalDocs > 0
      ? `Documents: ${completeDocs} complete, ${incompleteDocs} incomplete/missing (${totalDocs} total)`
      : "No documents uploaded";

  switch (actualStatus) {
    case "complete":
      return (
        <Tooltip title={tooltipText}>
          <CheckIcon sx={{ color: "success.main", fontSize: 20 }} />
        </Tooltip>
      );
    case "incomplete":
    case "unknown": // Treat unknown as incomplete
    default:
      return (
        <Tooltip title={tooltipText}>
          <XIcon sx={{ color: "error.main", fontSize: 20 }} />
        </Tooltip>
      );
  }
};

export function UserTableRow({
  user,
  onViewUser,
  showCompany = false,
  selectable = false,
  isSelected = false,
  onUserSelect,
  showDocumentStatus = false,
  documentStatusLoading = false,
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

  // Calculate document status for row background color
  const documentStatus = showDocumentStatus
    ? calculateDocumentStatus(user.documents || [])
    : null;

  // Define row background colors based on document status
  const getRowBackgroundColor = () => {
    if (!showDocumentStatus || documentStatusLoading) {
      return {}; // No special background
    }

    switch (documentStatus) {
      case "complete":
        return {
          backgroundColor: "success.light",
          "&:hover": {
            backgroundColor: "success.main",
            opacity: 0.4,
          },
        };
      case "incomplete":
      case "unknown":
      default:
        return {
          backgroundColor: "error.light",
          "&:hover": {
            backgroundColor: "error.main",
            opacity: 0.4,
          },
        };
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
        // Apply document status background colors
        ...getRowBackgroundColor(),
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

      {/* Document Status Cell - Updated to use documents array */}
      {showDocumentStatus && (
        <TableCell align="center">
          <DocumentStatusIndicator
            documents={user.documents || []}
            loading={documentStatusLoading}
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
