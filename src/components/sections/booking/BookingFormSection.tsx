import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "react-router-dom"


// ===== Session 型別（會從外部資料餵入）=====
export interface SessionItem {
  sessionId: number
  sessionName: string
  teacherName: string
  date: string
  startTime: string
  remainingSeats: number
  price?: number  // 價格為可選，因為 API 可能不返回
}

// ===== BookingForm Props =====
interface BookingFormProps {
  sessions: SessionItem[]          // 預約頁會傳入「全部近期課程」
  selectedSessionId?: number | null  // 外部傳入的選中課程 ID
  

}

export default function BookingFormSection({ sessions, selectedSessionId: externalSelectedSessionId }: BookingFormProps) {
  // 解析 URL ?id=301
  const [searchParams] = useSearchParams()
  const urlSessionId = searchParams.get("id")
  type ModalStatus = "none" | "loading" | "success" | "error"
  const [modalStatus, setModalStatus] = useState<ModalStatus>("none")

  // 內部 state：僅在沒有外部 prop 時使用（例如從 URL 進入）
  const [internalSelectedSessionId, setInternalSelectedSessionId] = useState<number | null>(
    urlSessionId ? Number(urlSessionId) : null
  )
  // 優先使用外部傳入的 selectedSessionId，否則使用內部 state
  const selectedSessionId = externalSelectedSessionId ?? internalSelectedSessionId
  // 根據 ID 找出該堂課的資料
  const selectedSession = sessions.find(s => s.sessionId === selectedSessionId) || null

  // 表單區塊 ref，用於滾動
  const formRef = useRef<HTMLDivElement>(null)

  // 確保 sessions 數據已加載且找到對應的 session 後才滾動，避免在數據加載前滾動導致位置錯誤
  useEffect(() => {
    if (selectedSessionId && selectedSession && formRef.current && sessions.length > 0) {
      // 使用 setTimeout 確保 DOM 已完全渲染（UpcomingSessionsSection 已渲染完成）
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [selectedSessionId, selectedSession, sessions.length])

  // ===== 當外部 selectedSessionId 改變時，同步內部 state（用於 URL 參數的情況）=====
  useEffect(() => {
    if (externalSelectedSessionId !== undefined) {
      // 外部有傳入時，不需要內部 state
      return
    }
    // 如果外部沒有傳入，且 URL 有參數，則使用 URL 參數
    if (urlSessionId) {
      setInternalSelectedSessionId(Number(urlSessionId))
    }
  }, [externalSelectedSessionId, urlSessionId])


// =====表單欄位狀態 =====
const [studentName, setStudentName] = useState("")
const [studentEmail, setStudentEmail] = useState("")
const [contactValue, setContactValue] = useState("")
const [studentNumber, setStudentNumber] = useState(1)
const [bookingNote, setBookingNote] = useState("")
const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)

// ===== email 驗證 regex =====
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ===== 計算費用 =====
const price = selectedSession?.price ?? 0
const total = price * studentNumber

// ===== Modal 相關效果 =====
useEffect(() => {
  if (modalStatus !== "none") {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = ""
  }
}, [modalStatus])

useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === "Escape" && modalStatus !== "loading") {
      setModalStatus("none")
    }
  }
  window.addEventListener("keydown", handler)
  return () => window.removeEventListener("keydown", handler)
}, [modalStatus])

// ===== 送出按鈕動作（後續串接 Google Sheet 用）=====
const handleSubmit = async () => {
  setHasAttemptedSubmit(true)
  
  // 驗證表單
  if (!studentName.trim()) return
  if (!studentEmail.trim() || !emailRegex.test(studentEmail)) return
  if (!contactValue.trim()) return
  if (!selectedSession) return
  if (studentNumber < 1) return
  if (studentNumber > selectedSession.remainingSeats) return
  
  setModalStatus("loading")

  try {
    // 這裡等你之後串 Google Sheet API
    await new Promise(res => setTimeout(res, 1500)) // 假裝送出成功
    setModalStatus("success")
  } catch (err) {
    setModalStatus("error")
  }
}


  return (
    <section className="w-full " ref={formRef}>

      <div className="flex-col-center gap-12">
        
        {/* ========= 標題與引導文字 ========= */}
        <div className="w-full text-center">
          <h2>預約你的體驗課</h2>
          <p className="text-muted">
            請選擇想報名的課程並填寫資料，<br className="block md:hidden" />我們將會與你聯繫完成預約。
          </p>
        </div>

        <div className="w-full flex-col-start md:flex-row gap-8 md:px-8 pb-24"> 
            {/* ========= 課程卡片(桌機消失，手機上方) ========= */}
            <div className="block md:hidden text-muted"> 
              <h3 className="mb-4 text-sm">報名課程</h3>
              <div className="w-full min-h-48 bg-card-75 rounded-md shadow-md p-6 flex-col-center-center">
                {/* 尚未選擇課程 */}
                {!selectedSession && (
                  <p className={hasAttemptedSubmit ? "text-accent-red" : ""}>
                    尚未選擇課程，請從上方列表點選想預約的場次。
                  </p>
                )}

                {/* 已選課程的呈現 */}
                {selectedSession && (
                  <div className="w-full flex-col-center gap-1">
                    <p className="text-lg font-bold text-emphasized">{selectedSession.sessionName}</p>
                    <p className=" mb-2">{selectedSession.teacherName} 老師</p>
                    <p className="text-lg font-bold text-emphasized">{selectedSession.date}　{selectedSession.startTime}</p>
                    <p >剩餘名額：{selectedSession.remainingSeats} 位</p>
                    <p >單人費用：{price ? `NT$ ${price}` : "—"}</p>

                    {/* 轉往資料格式（預先對應你給的 booking 欄位名稱） */}
                    {/* bookingID 會由 Google Sheet 自動生成，不在這裡處理 */}
                    <input type="hidden" name="sessionID" value={selectedSession.sessionId} />
                  </div>
                )}
              </div>
            </div>

          {/* ========= 報名資料填寫區(桌機左欄，手機中間) ========= */}
          <div className="w-full bg-panel-75 rounded-lg shadow-lg flex-col-start gap-6 p-6 text-sm">

            {/* 姓名 */}
            <div className="flex-col-start w-full">
              <label>姓名 <span className="text-accent-red">*</span></label>
              <input type="text" value={studentName}
                     placeholder="請填寫您的姓名"
                     onChange={(e) => setStudentName(e.target.value)}/>
              {hasAttemptedSubmit && !studentName.trim() && (
                <p className="pl-2 text-xs text-accent-red mt-1">請填寫姓名</p>
              )}
            </div>

            {/* Email */}
            <div className="flex-col-start w-full">
              <label>Email <span className="text-accent-red">*</span></label>
              <input type="email" value={studentEmail}
                     placeholder="請填寫您的信箱"
                     onChange={(e) => setStudentEmail(e.target.value)}/>
              {hasAttemptedSubmit && (!studentEmail.trim() || !emailRegex.test(studentEmail)) && (
                <p className="pl-2 text-xs text-accent-red mt-1">請填寫有效的 Email</p>
              )}
            </div>

            {/* 聯絡方式 */}
            <div className="flex-col-start w-full">
              <label >主要聯絡方式 <span className="text-accent-red">*</span></label>
              <input type="text" value={contactValue}
                     placeholder="請填寫手機、LINE、FB 擇一"
                     onChange={(e) => setContactValue(e.target.value)}/>
              {hasAttemptedSubmit && !contactValue.trim() && (
                <p className="pl-2 text-xs text-accent-red mt-1">請填寫聯絡資訊</p>
              )}
            </div>

            {/* 報名人數 */}
            <div className="flex-col-start w-full">
              <label >報名人數 <span className="text-accent-red">*</span></label>
              <input type="number" min={1} max={selectedSession?.remainingSeats ?? 10}
                     value={studentNumber}
                     onChange={(e) => setStudentNumber(Number(e.target.value))}/>
              {hasAttemptedSubmit && studentNumber < 1 && (
                <p className="pl-2 text-xs text-accent-red mt-1">至少需報名 1 位</p>
              )}
              {hasAttemptedSubmit && selectedSession && studentNumber > selectedSession.remainingSeats && (
                <p className="pl-2 text-xs text-accent-red mt-1">超過剩餘名額</p>
              )}
            </div>

            {/* 備註 */}
            <div className="flex-col-start w-full">
              <label>備註<span className="text-xs text-muted">（選填）</span></label>
              <textarea className="h-24" value={bookingNote}
                        placeholder="可填寫特殊需求或想備註給老師的話"
                        onChange={(e) => setBookingNote(e.target.value)}/>
            </div>

          </div>
          
          <div className="w-full flex-col-between gap-2 text-sm text-muted">
            {/* ========= 課程卡片(桌機右欄，手機消失) ========= */}
            <div className="hidden md:block"> 
              <h3 className="mb-4 text-sm">報名課程</h3>
              <div className="w-full min-h-48 bg-card-75 rounded-md shadow-md px-4 py-2 flex-col-center-center">
                {/* 尚未選擇課程 */}
                {!selectedSession && (
                  <p className={hasAttemptedSubmit ? "text-accent-red" : ""}>
                    尚未選擇課程，請從上方列表點選想預約的場次。
                  </p>
                )}

                {/* 已選課程的呈現 */}
                {selectedSession && (
                  <div className="w-full flex-col-center gap-1 p-4">
                    <p className="text-lg font-bold text-emphasized">{selectedSession.sessionName}</p>
                    <p className=" mb-2">{selectedSession.teacherName} 老師</p>
                    <p className="text-lg font-bold text-emphasized">{selectedSession.date}　{selectedSession.startTime}</p>
                    <p >剩餘名額：{selectedSession.remainingSeats} 位</p>
                    <p >單人費用：{price ? `NT$ ${price}` : "—"}</p>

                    {/* 轉往資料格式（預先對應你給的 booking 欄位名稱） */}
                    {/* bookingID 會由 Google Sheet 自動生成，不在這裡處理 */}
                    <input type="hidden" name="sessionID" value={selectedSession.sessionId} />
                  </div>
                )}
              </div>
            </div>

            {/* ========= 費用結算(桌機中間，手機下方) ========= */}
            <div> 
              <h3 className="mb-4 text-sm">報名費用</h3>
              <div className="w-full bg-card-75 rounded-md shadow-md p-6 flex-col-start gap-3">
                
                {!selectedSession && (
                  <p>請先選擇課程</p>
                )}

                {selectedSession && (
                  <div className="w-full px-2 flex-col-center items-start md:items-end ">
                    <p>人數：{studentNumber} 位</p>
                    <p>總金額：<span className="text-lg font-bold  text-emphasized">{price ? `NT$ ${total}` : "—"}</span></p>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  className="mt-2 w-full bg-primary-strong text-white py-2 rounded-md text-lg font-bold hover:bg-primary-hover transition-colors"
                >
                  送出報名
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>


      {/* ========================= */}
      {/* 全域彈窗（Loading / Success / Error） */}
      {/* ========================= */}
      {modalStatus !== "none" && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex-col-center-center z-[100]"
          onClick={(e) => e.stopPropagation()} // 禁止背景點擊
        >
          <div className="bg-panel w-[90%] max-w-[360px] rounded-lg shadow-lg p-8 flex-col-center gap-4">

            {/* ===== Loading ===== */}
            {modalStatus === "loading" && (
              <div className="flex-col-center-center gap-4">
                <div className="animate-spin h-10 w-10 border-4 border-primary-75 border-t-transparent rounded-full"/>
                <p className="text-muted">資料送出中…請稍候</p>
              </div>
            )}

            {/* ===== Success ===== */}
            {modalStatus === "success" && (
              <div className="flex-col-center gap-4">
                <h3 className="text-center text-emphasized">已送出報名！</h3>
                <div className="text-sm text-muted text-center leading-relaxed">
                  已收到您的報名資料。
                  <br/>請在 24 小時內完成匯款，
                  <br/>並私訊我們提供 <span className="text-emphasized font-bold">姓名</span> 與 <span className="text-emphasized font-bold">末五碼</span>。
                  <br/>我們會盡快為你確認預約狀況。
                </div>

                <div className="w-full bg-card-75 rounded-md p-3 text-center text-sm">
                  戶名：療癒秘境  
                  <br/>銀行：999 療癒銀行  
                  <br/>帳號：9999-9999-9999
                </div>

                <button
                  onClick={() => setModalStatus("none")}
                  className="w-full mt-2 bg-primary-strong text-white py-2 rounded-md font-bold hover:bg-primary-hover transition-colors"
                >
                  確認
                </button>
              </div>
            )}

            {/* ===== Error ===== */}
            {modalStatus === "error" && (
              <>
                <h3 className="text-xl font-bold text-red-500">送出失敗</h3>
                <p className="text-center text-sm text-muted leading-relaxed">
                  系統似乎遇到問題，請重新操作或直接聯絡我們協助預約。
                </p>

                <button
                  onClick={() => setModalStatus("none")}
                  className="w-full mt-2 bg-primary-strong text-white py-2 rounded-md font-bold hover:bg-primary-hover transition-colors"
                >
                  我知道了
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </section>
  )
}
