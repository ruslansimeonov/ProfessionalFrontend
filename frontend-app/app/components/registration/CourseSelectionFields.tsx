import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Typography, 
  CircularProgress 
} from '@mui/material';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { RegistrationFormData, Course, City } from '../../hooks/useCourseRegistration';

interface SelectionFieldsProps {
  register: UseFormRegister<RegistrationFormData>;
  errors: FieldErrors<RegistrationFormData>;
  courses: Course[];
  cities: City[];
  loading: {
    courses: boolean;
    cities: boolean;
    submission?: boolean;
  };
}

export default function CourseSelectionFields({ 
  register, 
  errors, 
  courses, 
  cities, 
  loading 
}: SelectionFieldsProps) {
  return (
    <>
      {/* Course Select */}
      <FormControl
        fullWidth
        margin="normal"
        error={!!errors.courseId}
        disabled={loading.courses}
      >
        <InputLabel id="course-label">Изберете курс</InputLabel>
        <Select
          labelId="course-label"
          label="Изберете курс"
          defaultValue=""
          {...register("courseId", { required: "Изберете курс" })}
        >
          {loading.courses ? (
            <MenuItem disabled>
              <CircularProgress size={20} sx={{ mr: 2 }} />
              Зареждане...
            </MenuItem>
          ) : (
            courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.courseName} ({course.courseType})
              </MenuItem>
            ))
          )}
        </Select>
        {errors.courseId && (
          <Typography color="error" variant="caption">
            {errors.courseId.message}
          </Typography>
        )}
      </FormControl>

      {/* Nearest City Select */}
      <FormControl
        fullWidth
        margin="normal"
        error={!!errors.cityId}
        disabled={loading.cities}
      >
        <InputLabel id="city-label">Най-близък град</InputLabel>
        <Select
          labelId="city-label"
          label="Най-близък град"
          defaultValue=""
          {...register("cityId", { required: "Моля, изберете град" })}
        >
          {loading.cities ? (
            <MenuItem disabled>
              <CircularProgress size={20} sx={{ mr: 2 }} />
              Зареждане...
            </MenuItem>
          ) : (
            cities.map((city) => (
              <MenuItem key={city.id} value={city.id}>
                {city.cityName}
              </MenuItem>
            ))
          )}
        </Select>
        {errors.cityId && (
          <Typography color="error" variant="caption">
            {errors.cityId.message}
          </Typography>
        )}
      </FormControl>
    </>
  );
}