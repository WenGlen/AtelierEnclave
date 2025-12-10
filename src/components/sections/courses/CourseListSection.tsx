import { Link } from "react-router-dom"

interface CourseItem {
  courseID: string
  courseName: string
  teacherID: string
  thumbnail: string
  "intro-simple": string
  "intro-full": string
  duration: string
  price: number
}

interface CourseListSectionProps {
  sectionTitle?: string;
  courses: CourseItem[]
  simple?: boolean // true = 首頁簡易版 
}

export default function CourseListSection({ sectionTitle, courses, simple = false }: CourseListSectionProps) {
  return (
    <section className="w-full py-24 px-16 md:px-0">
        {sectionTitle && (
            <h2 className="my-12">{sectionTitle}</h2>
        )}
        <div className={`max-w-screen-lg mx-auto grid  gap-8
                            grid-cols-1  
                         sm:grid-cols-2  sm:px-8
                         md:grid-cols-3  
                         ${simple ? "lg:grid-cols-4" : ""}`}>
        
        {courses.map((course) => (
            <Link 
                key={course.courseID}
                to={`/course/${course.courseID}`}
                className="group w-full flex-col-start rounded-md shadow-sm bg-card overflow-hidden
                        hover:shadow-lg transition-shadow"
            >
                {/* 圖片 */}
                <div className={`w-full overflow-hidden
                                ${simple ? "h-[120px]" : "h-[180px]"}`}>
                <img 
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full h-full object-cover"
                />
                </div>

                {/* 文字區 */}
                <div className="p-4 flex-col-start gap-2">

                {/* 課程名稱 */}
                <h3 className="text-lg font-bold whitespace-pre-line">
                    {course.courseName}
                </h3>

                {/* 老師姓名（兩種模式都顯示） */}
                <p className="text-sm text-muted">
                    {course.teacherID}
                </p>

                {/* intro：依模式切換 */}
                {simple ? (
                    <p className="text-sm leading-relaxed text-muted">
                    {course["intro-simple"]}
                    </p>
                ) : (
                    <p className="text-sm leading-relaxed text-muted">
                    {course["intro-full"]}
                    </p>
                )}

                {/* 完整模式：顯示時長 + 價格 */}
                {!simple && (
                    <div className="pt-2 flex-col-start-end gap-1 whitespace-pre-line">
                    <p className="text-sm text-primary-strong"> 約 {course.duration}</p>
                    <p className="text-sm text-primary-strong">
                        NT$ {course.price}
                    </p>
                    </div>
                )}

                {/* 點擊看更多（右下角） */}
                <div className="pt-4 w-full flex-row-end-center">
                    <span className="text-xs text-textDefaultColor 
                                    group-hover:text-primary-hover transition-colors">
                    點擊看更多 ›
                    </span>
                </div>

                </div>

            </Link>
            ))}

      </div>
    </section>
  )
}
