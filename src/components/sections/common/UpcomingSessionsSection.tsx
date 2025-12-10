import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"


import { useScrollToBookingForm } from "@/hooks/useScrollToBookingForm"


interface SessionItem {
  sessionId: number
  sessionName: string
  date: string
  startTime: string
  teacherName: string
  remainingSeats: number
  isHoliday: string
  type: string
  price: number

}

interface UpcomingSessionsSectionProps {
  items: SessionItem[]
  sectionTitle?: string
  sectionSubTitle?: string
  simple?: boolean

  /** 若父層傳入此方法 → 點擊課程時不跳頁，而是交給父層 */
  onPickSession?: (sessionId: number) => void
}

export default function UpcomingSessionsSection({
  items,
  sectionTitle,
  sectionSubTitle,
  simple = false,
  onPickSession,
}: UpcomingSessionsSectionProps) {
  const navigate = useNavigate()

  /*  設定狀態：篩選器 / 分頁：simple 模式不會顯示篩選器與分頁器，但會使用相同邏輯 */
  const [selectedCourseType, setSelectedCourseType] = useState<string>("全部")
  const [selectedDayType, setSelectedDayType] = useState<string>("全部")
  const [page, setPage] = useState(1)

  const itemsPerPage = 5

  /* 建立課程篩選按鈕清單（去除重複）*/
  const courseOptions = useMemo(() => {
    const set = new Set<string>()
    items.forEach((i) => set.add(i.type || ""))
    return ["全部", ...Array.from(set)]
  }, [items])

  /* 篩選邏輯：simple = true 時跳過篩選 */
  const filtered = useMemo(() => {
    if (simple) return items // simple 模式直接使用傳入資料

    return items.filter((item) => {
      const courseOK =
        selectedCourseType === "全部" || 
        item.type === selectedCourseType

      const dayOK =
        selectedDayType === "全部" ||
        item.isHoliday === selectedDayType

      return courseOK && dayOK
    })
  }, [items, selectedCourseType, selectedDayType, simple])

  /* 分頁邏輯：simple = true 不使用分頁 */
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const paginated = simple
    ? filtered // simple 模式直接顯示所有結果
    : filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const goPrevPage = () => {
    if (page > 1) setPage(page - 1)
  }
  const goNextPage = () => {
    if (page < totalPages) setPage(page + 1)
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-screen-lg mx-auto flex-col-center gap-12">

        <div className="w-full flex-col-center-center">
          {sectionTitle && (
              <h2>{sectionTitle}</h2>
          )}
          {sectionSubTitle && (
            <p className="w-full text-center text-muted">{sectionSubTitle}</p>
          )}
        </div>

        {!simple && ( // simple 模式不顯示篩選器
          <div className="w-full flex-col-center-center gap-2">

            {/* 課程類別 */}
            <div className="flex flex-wrap justify-center gap-3">
              {courseOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSelectedCourseType(opt)
                    setPage(1) // 重置分頁
                  }}
                  className={`px-4 py-1 rounded-md text-sm font-bold transition-colors shadow-sm
                    ${
                      selectedCourseType === opt
                        ? "bg-primary-strong text-white "
                        : "bg-card "
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="w-full flex-row-center-center gap-2">
              <div className="w-36 h-px bg-primary-50"/>
              <p className="text-primary-75">&</p>
              <div className="w-36 h-px bg-primary-50"/>
            </div>

            {/* 平日 / 假日 */}
            <div className="flex flex-wrap justify-center gap-3">
              {["全部", "平日", "假日"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSelectedDayType(opt)
                    setPage(1)
                  }}
                  className={`px-4 py-1 rounded-md text-sm font-bold transition-colors shadow-sm
                    ${
                      selectedDayType === opt
                        ? "bg-primary-strong text-white "
                        : "bg-card "
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 清單結果：simple 與 full 共用 */}
        <div className="w-full flex-col-center-center gap-4">

          {/* 沒結果時 */}
          {filtered.length === 0 && (
            <p className="text-muted py-8 text-center">
              目前無符合條件的課程
            </p>
          )}

          {/* 結果列表（共用） */}
          {filtered.length > 0 &&
            paginated.map((item) => (
          <button
            key={item.sessionId}
            onClick={() => {
              if (onPickSession) {onPickSession(item.sessionId)}     // booking 頁內點擊 → 更新課程(交給父層管理，這裡不跳頁)
              else {navigate(`/booking?id=${item.sessionId}`)}  // 其他頁點擊 → 跳轉
            }}
            className="group w-full bg-card rounded-md shadow-drop-sm
                      px-8 py-4 text-sm 
                      max-w-[400px] md:max-w-screen-md
                      transition-colors  hover:bg-card-hover "
              >
                <div className="w-full flex flex-col md:flex-row justify-between items-center gap-2">
                  <p className="font-semibold text-emphasized text-lg">
                    {item.sessionName}
                  </p>

                  <div className="flex-row-between px-0 
                                   max-w-[400px]  gap-1
                                md:w-[47%] md:max-w-none md:ml-16">
                    <div className="min-w-[95px] text-left text-xs md:text-sm md:w-[95px] md:text-right">
                      <p>{item.teacherName} 老師</p>
                    </div>

                    <div className="min-w-[160px] flex-row-center text-emphasized font-bold gap-1">
                      <p>{item.date}</p>
                      <p>{item.startTime}</p>
                    </div>

                    <p className="min-w-[50px] text-righ text-xs md:text-sm ">剩 {item.remainingSeats} 位</p>
                  </div>
                </div>
              </button>
            ))}
        </div>


        {!simple && filtered.length > 0 && ( // simple 模式、無結果時不顯示分頁器
          <div className="flex-row-center-center gap-4 ">
            <button
              onClick={goPrevPage}
              disabled={page === 1}
              className="px-4 py-2 text-sm rounded-md bg-card shadow-sm disabled:opacity-40"
            >
              上一頁
            </button>

            <span className="text-sm text-emphasized">
              第 {page} / {totalPages} 頁
            </span>

            <button
              onClick={goNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm rounded-md bg-card shadow-sm disabled:opacity-40"
            >
              下一頁
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
