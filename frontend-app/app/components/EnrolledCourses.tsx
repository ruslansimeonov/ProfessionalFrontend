import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
import { EnrolledCourse } from "../utils/types";

interface EnrolledCoursesProps {
  courses: EnrolledCourse[];
}

const EnrolledCoursesCard: React.FC<EnrolledCoursesProps> = ({ courses }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ display: "flex", alignItems: "center" }}
      >
        <SchoolIcon sx={{ mr: 1 }} />
        Enrolled Courses
      </Typography>

      {courses?.length > 0 ? (
        <List>
          {courses.map((course) => (
            <ListItem
              key={course.courseId}
              sx={{
                borderLeft: "4px solid",
                borderColor: "info.light",
                pl: 2,
                mb: 1,
                backgroundColor: "background.default",
                borderRadius: "0 4px 4px 0",
              }}
            >
              <ListItemIcon>
                <SchoolIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={course.courseName}
                secondary={`Enrolled: ${new Date(
                  course.enrolledAt
                ).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="textSecondary">
          You are not enrolled in any courses yet.
        </Typography>
      )}
    </Paper>
  );
};

export default EnrolledCoursesCard;
