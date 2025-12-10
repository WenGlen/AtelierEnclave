import React, { useState } from "react"

interface TeacherItem {
  id: number
  name: string
  title?: string
  avatar: string
  intro: string
  words?: string
}

interface TeachersSectionProps {
  sectionTitle?: string
  sectionSubTitle?: string
  items: TeacherItem[]
}

export default function TeachersSection({
  sectionTitle,
  sectionSubTitle,
  items
}: TeachersSectionProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherItem | null>(null)

  const handleCardClick = (teacher: TeacherItem) => {
    setSelectedTeacher(teacher)
  }

  const handleCloseModal = () => {
    setSelectedTeacher(null)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal()
    }
  }

  return (
    <section className="w-full py-24">
      <div className="max-w-screen-lg mx-auto flex-col-center gap-12">

        {/* 區塊標題（可選） */}
        {sectionTitle && (
          <div className="w-full text-center">
            <h2>{sectionTitle}</h2>
            {sectionSubTitle && (
              <p className="text-muted mt-1">{sectionSubTitle}</p>
            )}
          </div>
        )}

        {/* ====== 卡片群組：手機一欄、桌機三欄 ====== */}
        <div className="w-full grid gap-12 justify-center
                        md:grid-cols-3 md:gap-8">

          {items.map((t) => (
            <div
              key={t.id}
              onClick={() => handleCardClick(t)}
              className="w-full bg-card rounded-lg shadow-sm
                         p-6 flex-col-start-center gap-4
                         max-w-[320px] md:max-w-none
                         hover:bg-card-hover transition-colors cursor-pointer"
            >

              {/* 講師照片 - 直式 4:3 */}
              <div className="w-full aspect-[3/4] overflow-hidden rounded-md">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 講師資訊 - 只顯示名稱和稱謂 */}
              <div className="w-full flex flex-col items-start gap-1">
                <p className="text-xl font-bold text-emphasized">{t.name}</p>
                {t.title && (
                  <p className="text-base text-muted">{t.title}</p>
                )}
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* ====== 彈窗 Modal ====== */}
      {selectedTeacher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <div
            className="relative w-full max-w-4xl bg-panel rounded-lg shadow-xl overflow-hidden
                       max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 關閉按鈕 */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center
                         bg-white/90 rounded-full hover:bg-white transition-colors
                         text-textDefaultColor hover:text-primary-strong"
              aria-label="關閉"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* 彈窗內容：手機垂直排列，桌機左右排列 */}
            <div className="flex flex-col md:flex-row">
              {/* 左側：文字資訊 */}
              <div className="w-full  md:w-1/2 p-8 flex flex-col items-start gap-6">
              
                <div className="w-full h-full flex-col-between gap-2">
                  <div>
                    <h3 className="text-2xl font-bold text-emphasized">
                      {selectedTeacher.name}
                    </h3>
                    {selectedTeacher.title && (
                      <p className="text-muted mb-4">{selectedTeacher.title}</p>
                    )}
                    {selectedTeacher.intro && (
                        <p className="leading-relaxed whitespace-pre-line"> {selectedTeacher.intro}</p>
                    )}

                  </div>
                  <div className="shadow-drop-lg hidden md:block">
                    <div className="relative w-full  bg-card-75 px-8 py-4 rounded-lg text-sm text-muted"> 
                      <p className="leading-relaxed">{selectedTeacher.words }</p>
                      <div className="absolute bottom-4 -right-4 w-0 h-0 border-t-[8px] border-b-[8px] border-l-[16px] border-t-transparent border-b-transparent border-l-card-75 "/> 
                    </div>
                  </div>

                </div>

              </div>




              {/* 右側：講師照片 */}
              <div className="w-full md:w-1/2 p-8 flex-col-center-center">
                <div className="w-full max-w-sm aspect-[3/4] overflow-hidden rounded-md">
                  <img
                    src={selectedTeacher.avatar}
                    alt={selectedTeacher.name}
                    className="w-full h-full object-cover"
                  />

                </div>
                <div className="shadow-drop-lg block md:hidden mt-8">
                    <div className="relative w-full max-w-sm bg-card-75 px-8 py-4 rounded-lg text-sm text-muted"> 
                      <p className="leading-relaxed">{selectedTeacher.words }</p>
                      <div className="absolute -top-4 left-8 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-t-transparent border-r-transparent border-b-card-75 "/> 
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
