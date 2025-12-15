import { useState, useEffect } from "react"
import { useLocation, useSearchParams } from "react-router-dom"

import Noise_StackingUneven from "@/layouts/Noise_StackingUneven"

import PageBanner from "@/components/sections/common/PageBanner"
import UpcomingSessionsSection from "@/components/sections/common/UpcomingSessionsSection"
import BookingFormSection from "@/components/sections/booking/BookingFormSection"

import { API_BASE_URL } from "@/config/api"


// 组件期望的数据类型（API 已返回此格式）
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


const important =`
<ul>
  <li>聯絡資訊請填寫完整，本資料僅供聯絡使用，不會外流或用於其他商業用途</li>
  <li>填寫報名訊息不保證預約成功，需待繳費成功並經確認後才算成功預約</li>
  <li>繳費後請以email、LINE、電話通知匯款末五碼，我們將儘速為您確認</li>
  <li>若有特殊狀況無法出席，一週前可退款80% ，一週內退款50% ，當天恕不接受退款</li>
  <li>網站僅會顯示30天內的課程，若想預約之後的課程，請直接聯絡我們</li>
</ul>
`

export default function Booking() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [sessions, setSessions] = useState<SessionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(API_BASE_URL + "/api/sessions")
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data: SessionItem[] = await response.json()
        setSessions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "获取课程数据失败")
        console.error("Error fetching sessions:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  // 當從外部頁面跳轉過來時（URL 有 ?id=xxx），等待數據加載完成後再設置 selectedSessionId
  useEffect(() => {
    const urlSessionId = searchParams.get("id")
    if (urlSessionId && !loading && sessions.length > 0) {
      const sessionId = Number(urlSessionId)
      // 確認該 sessionId 存在於 sessions 中
      const sessionExists = sessions.some(s => s.sessionId === sessionId)
      if (sessionExists) {
        setSelectedSessionId(sessionId)
      }
    }
  }, [searchParams, loading, sessions])

  useEffect(() => {
    if (location.state?.scrollToForm) {
      const el = document.getElementById("booking-form")
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" })
        }, 150)
      }
    }
  }, [location])

  return (
    
    <div>
      <Noise_StackingUneven>
        <PageBanner
            title="報名體驗課"
            subtitle="找到適合您的課程，開始您的創作之旅"
            img="https://i.meee.com.tw/vASrZJZ.png"
          />

        {loading && (
          <div className="w-full py-24 text-center">
            <p className="text-muted">載入中...</p>
          </div>
        )}

        {error && (
          <div className="w-full py-24 text-center">
            <p className="text-error">錯誤：{error}</p>
          </div>
        )}

        {!loading && !error && (
          <UpcomingSessionsSection
            sectionTitle="目前可報名課程"
            sectionSubTitle="歡迎使用篩選器，找到適合您的課程"
            items={sessions}
            onPickSession={(id) => setSelectedSessionId(id)}
          />
        )}

        <section>
        <BookingFormSection
          sessions={sessions}
          selectedSessionId={selectedSessionId}
          apiBaseUrl={API_BASE_URL}
        />
        </section>

        <section className="mb-12">
          <div className="w-fit mx-auto bg-panel-50 rounded-md p-4 md:px-12">
            <p className="text-muted mb-2 font-bold">報名提醒</p>
            <div 
              className="leading-relaxed text-muted"
              dangerouslySetInnerHTML={{ __html: important }}
            />
            <ul>
              <li className="text-emphasized">這個網站僅供示意，請不要以為真的有這些課程</li>
            </ul>
          </div>
        </section>

      </Noise_StackingUneven>
    </div>
  )
}
