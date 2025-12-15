import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import PhotosSection from "../components/sections/common/PhotosSection"
import UpcomingSessionsSection from "@/components/sections/common/UpcomingSessionsSection"
import Noise_StackingUneven from "@/layouts/Noise_StackingUneven"

import { API_BASE_URL } from "@/config/api"

interface CourseDetail {
  courseID: string
  courseName: string
  teacherName: string
  duration: string
  price: number
  seats: string
  type: string
  pageBanner: string
  courseIntro: string
  teacherIntro: string
  teacherAvatar: string
  photo1: string
  photo2: string
  photo3: string
  photo4: string
  photo5: string
  courseFeatures: string
  courseAudience: string
  important: string
}

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

export default function CourseDetail() {
  const { id } = useParams()
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
  const [sessions, setSessions] = useState<SessionItem[]>([]);

  useEffect(() => {
    if (!id) return;
    
    fetch(API_BASE_URL + `/api/course/${id}`)
      .then((res) => res.json())
      .then((data) => {
        //console.log("課程詳細資料：", data);
        setCourseDetail(data);
      })
      .catch((err) => {
        console.error("取得 courseDetail 失敗：", err);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    
    fetch(API_BASE_URL + `/api/sessions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        //console.log("課堂詳細資料：", data);
        setSessions(data);
      })
      .catch((err) => {
        console.error("取得 courseDetail 失敗：", err);
      });
  }, [id]);

  // 自動滾到最上方（保險，避免 header 還沒跑 ScrollToTop）
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // 構建照片數組（過濾空值）
  const photos = courseDetail
    ? [courseDetail.photo1, courseDetail.photo2, courseDetail.photo3, courseDetail.photo4, courseDetail.photo5]
        .filter((photo) => photo && photo.trim() !== "")
    : [];

  if (!courseDetail) {
    return <div className="w-full flex justify-center items-center min-h-screen">載入中...</div>;
  }

  return (
    <div className="w-full">
      <Noise_StackingUneven>

      {/* ========== 4.3.1 Banner（66vh） ========== */}
      <section className="banner-section relative w-full h-[66vh] overflow-hidden">
        <img
          src={courseDetail.pageBanner ?? ""}
          alt={courseDetail.courseName ?? ""}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full flex z-10">
          <div className="flex-1 bg-panel-75"/>
          <div className="w-full max-w-screen-lg">
            <div className="py-4 px-8 bg-panel-75 rounded-tr-xl w-fit">
              <h1 className="m-0 font-bold text-emphasized 
                             whitespace-pre-line text-3xl leading-relaxed
                             md:whitespace-normal md:text-4xl">
                {courseDetail.courseName}
              </h1>
            </div>
          </div>
          <div className="flex-1 h-full "/>
        </div>

      </section>

      {/* ===== 包覆所有內容 ===== */}
      <div className="flex-col-center gap-24 py-12">

        {/* ========== 4.3.2 課程介紹（左右排版） ========== */}
        <section className="w-full flex flex-col gap-12
                            md:flex-row md:items-center md:gap-16">

          {/* 左欄：文字敘述 */}
          <div className="w-full md:w-2/3 flex-col-start-start gap-6 p-6
                          md:border-l-[2px] md:border-primary">

              <p className="text-muted whitespace-pre-line">{courseDetail.courseIntro}</p>

          </div>

          {/* 右欄：資訊卡片 */}
          <div className="w-full md:w-1/3">

            <div className="bg-card-50 rounded-lg shadow-md 
                            p-6 flex-col-start gap-6 text-sm text-muted">

              {/* 價格、時長 */}
              <div className="flex-col-start gap-2">
                <p>費用：NT$ {courseDetail.price}</p>
                <p>時長：約 {courseDetail.duration}</p>
                {courseDetail.seats && (<p>人數：{courseDetail.seats}</p>)}
              </div>

              {/* CTA */}
              <button
                className="w-full py-1 rounded-sm
                           bg-primary text-white font-semibold
                           hover:bg-primary-hover transition-colors"
                onClick={() => {
                  window.location.href = `/booking?id=${courseDetail.courseID}`
                }}
              >
                預約這堂課
              </button>
            </div>

          </div>
        </section>

        {/* ========== 4.3.4 講師介紹與合適對象 ========== */}
        <section className="max-w-screen-sm mx-auto p-6">

          <div className="flex-row-between-center gap-8 ">
            <img
              src={courseDetail.teacherAvatar}
              alt={courseDetail.teacherName}
              className="w-36 h-48 rounded-full object-cover"
            />
            <div className="flex-col-start-start gap-8">
              <p className="font-bold text-emphasized">{courseDetail.teacherName} 老師</p>
              <p className="text-muted whitespace-pre-line">{courseDetail.teacherIntro} </p>
            </div>
          </div>

          <div className={`relative w-full mt-12 bg-card-75 px-12 py-4 rounded-xl shadow-sm text-sm text-muted`}> 
              <p className="mb-2">本課程很適合：</p>
              <div 
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: courseDetail.courseAudience }}
              />
              <div className="absolute -top-4 left-16 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent border-b-card -z-10"/> 
          </div>

        </section>


        {/* ========== 4.3.3 作品展示（無文字、16:9） ========== */}
        {photos.length > 0 && (
          <section className="w-full">
            <PhotosSection
              items={photos.map((img) => ({ img }))}
              sectionTitle={undefined}
              sectionSubTitle={undefined}
            />
          </section>
        )}

        {/* ========== 4.3.5 課程資訊（純文字） ========== */}
        <section className="w-full  max-w-screen-sm flex-col-start-center gap-12 p-6">

          {/* 內容重點 bullet list */}
          {courseDetail.courseFeatures && (
            <div className="w-full flex-col-start-start gap-3">
              <h2 className="text-xl font-bold">課程特色</h2>
              <div 
                className="leading-relaxed text-muted md:px-12"
                dangerouslySetInnerHTML={{ __html: courseDetail.courseFeatures }}
              />
            </div>
          )}


          {/* 重點提醒 */}
          {courseDetail.important && (
            <div className="w-full bg-panel-50 rounded-md p-4 md:px-12">
              <p className="text-muted mb-2 font-bold">課程提醒</p>
              <div 
                className="leading-relaxed text-muted"
                dangerouslySetInnerHTML={{ __html: courseDetail.important }}
              />
            </div>
          )}

        </section>

      </div>
      
      {/* ========== 4.3.6 近期可報名課程（simple） ========== */}
      <UpcomingSessionsSection
        simple
        sectionTitle="近期可報名時段"
        items={sessions}
      />
      
      </Noise_StackingUneven>
    </div>
  )
}

