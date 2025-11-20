interface Teacher {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  image?: string;
  specialties?: string[];
}

interface CardTeacherProps {
  teacher: Teacher;
  onClick?: () => void;
}

const CardTeacher = ({ teacher, onClick }: CardTeacherProps) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {teacher.image && (
        <div className="w-full h-64 bg-gray-200 overflow-hidden">
          <img
            src={teacher.image}
            alt={teacher.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-1">{teacher.name}</h3>
        {teacher.title && (
          <p className="text-gray-600 mb-3">{teacher.title}</p>
        )}
        {teacher.bio && (
          <p className="text-gray-700 mb-4 line-clamp-3">{teacher.bio}</p>
        )}
        {teacher.specialties && teacher.specialties.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {teacher.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
              >
                {specialty}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardTeacher;

