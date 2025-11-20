interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
  price?: number;
  duration?: string;
  level?: string;
}

interface CardCourseProps {
  course: Course;
  onClick?: () => void;
}

const CardCourse = ({ course, onClick }: CardCourseProps) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {course.image && (
        <div className="w-full h-48 bg-gray-200 overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          {course.duration && <span>{course.duration}</span>}
          {course.level && <span className="px-2 py-1 bg-gray-100 rounded">{course.level}</span>}
        </div>
        {course.price !== undefined && (
          <div className="mt-4">
            <span className="text-2xl font-bold text-blue-600">${course.price}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardCourse;

