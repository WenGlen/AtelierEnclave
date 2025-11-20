import { useState, useEffect } from 'react';
import coursesData from '../data/courses.json';

interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
  price?: number;
  duration?: string;
  level?: string;
  [key: string]: unknown;
}

const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // In a real app, this would be an API call
      setCourses(coursesData as Course[]);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load courses');
      setLoading(false);
    }
  }, []);

  const getCourseById = (id: string): Course | undefined => {
    return courses.find((course) => course.id === id);
  };

  const getCoursesByLevel = (level: string): Course[] => {
    return courses.filter((course) => course.level === level);
  };

  return {
    courses,
    loading,
    error,
    getCourseById,
    getCoursesByLevel,
  };
};

export default useCourses;

