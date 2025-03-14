import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  Box,
  Grid,
  Chip,
} from "@mui/material";
import {
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocalAtm as PriceIcon,
} from "@mui/icons-material";
import { EnrolledCourse } from "../utils/types/types";

interface EnrolledCoursesProps {
  courses: EnrolledCourse[];
}

const EnrolledCoursesCard: React.FC<EnrolledCoursesProps> = ({ courses }) => {
  // Format date to be more readable
  const formatDate = (dateString: Date | string): string => {
    return new Date(dateString).toLocaleDateString("bg-BG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format price to include currency
  const formatPrice = (price: string | null): string => {
    return price ? `${price} BGN` : "N/A";
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", mb: 2 }}
      >
        <SchoolIcon sx={{ mr: 1 }} />
        Enrolled Courses
      </Typography>

      {courses?.length > 0 ? (
        <List>
          {courses.map((enrollment) => {
            // Get course details from the nested course object
            const course = enrollment.course || {};

            return (
              <ListItem
                key={enrollment.courseId}
                sx={{
                  borderLeft: "4px solid",
                  borderColor: "primary.main",
                  pl: 2,
                  mb: 1.5,
                  backgroundColor: "background.paper",
                  borderRadius: "0 4px 4px 0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {course.courseName || "Untitled Course"}
                      </Typography>
                      <Chip
                        label={course.courseType || "Training"}
                        size="small"
                        color="primary"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CalendarIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Enrolled on {formatDate(enrollment.enrolledAt)}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TimeIcon
                          fontSize="small"
                          sx={{ mr: 0.5, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {course.courseHours || 0} hours
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PriceIcon
                          fontSize="small"
                          sx={{ mr: 0.5, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {formatPrice(course.coursePrice)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {course.courseDetails && (
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        {course.courseDetails.length > 80
                          ? `${course.courseDetails.substring(0, 80)}...`
                          : course.courseDetails}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography color="text.secondary">
            You are not enrolled in any courses yet.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default EnrolledCoursesCard;
