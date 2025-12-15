import { useState, useEffect } from "react"
import { API_BASE_URL } from "@/config/api"

type ModalStatus = "none" | "loading" | "success" | "error"

export default function ContactFormSection() {
  // ===== 表單欄位 =====
  const [visitorName, setVisitorName] = useState("")
  const [visitorEmail, setVisitorEmail] = useState("")
  const [contactMethod, setContactMethod] = useState("")
  const [message, setMessage] = useState("")

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false)
  const [modalStatus, setModalStatus] = useState<ModalStatus>("none")
  const [contactID, setContactID] = useState<number | null>(null)
  const [sendTime, setSendTime] = useState<string>("")

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // ===== 送出處理 =====
  const handleSubmit = async () => {
    setHasAttemptedSubmit(true)

    // 基本驗證
    if (!visitorName.trim()) return
    if (!visitorEmail.trim() || !emailRegex.test(visitorEmail)) return
    if (!message.trim()) return

    setModalStatus("loading")

    try {
      const requestBody = {
        senderName: visitorName,
        senderEmail: visitorEmail,
        senderContact: contactMethod,
        senderContent: message
      }

      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      })

      let data;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseErr) {
        console.error("無法解析回應:", parseErr);
        throw new Error("伺服器回應格式錯誤");
      }

      if (!res.ok) {
        const errorMessage = data.error || data.details || `HTTP ${res.status}: ${res.statusText}`;
        console.error("API 錯誤:", errorMessage);
        throw new Error(errorMessage);
      }

      if (data.success !== true && !data.contactID) {
        throw new Error("伺服器回應格式異常，請確認資料是否已成功寫入");
      }

      if (data.contactID) {
        setContactID(data.contactID);
      }
      if (data.sendTime) {
        setSendTime(data.sendTime);
      }

      setModalStatus("success")
    } catch (err) {
      console.error("Contact submit error:", err);
      setModalStatus("error")
    }
  }

  // ===== Modal：鎖定背景滾動 =====
  useEffect(() => {
    if (modalStatus !== "none") document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""
  }, [modalStatus])

  // ===== Modal：ESC 關閉（Loading 不能關）=====
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalStatus !== "loading") {
        setModalStatus("none")
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [modalStatus])

  return (
    <section className="w-full"> 
        <div className="flex-col-start-center md:flex-row-start-center gap-6 md:gap-12 py-12">

            {/* ========= 聯絡資訊 ========= */}
            <div className="w-[90%] md:max-w-[320px] flex-col-start bg-card-50 rounded-md shadow-md 
                            px-8 py-4 text-muted text-sm leading-relaxed">
                <p>Email：AtelierEnclave@gmail.com</p>
                <p>LINE：@AtelierEnclave</p>
                <p>Phone：02-2222-2222</p>
                <p>Address：新北市新北區新北路222號</p>
            </div>

            {/* ========= 表單本體 ========= */}
            <div className="w-[90%] md:max-w-[480px] bg-panel-75 rounded-lg shadow-md flex-col-start gap-6 p-6 text-sm">
                <p className="text-muted">
                若您有特殊需求或想回饋建議，歡迎填寫表單與我們聯繫。
                </p>

                {/* 姓名 */}
                <div className="flex-col-start w-full">
                <label>您的姓名 <span className="text-accent-red">*</span></label>
                <input type="text" value={visitorName}
                        placeholder="請填寫您的姓名"
                        onChange={(e) => setVisitorName(e.target.value)}/>
                {hasAttemptedSubmit && !visitorName.trim() && (
                    <p className="pl-2 text-xs text-accent-red mt-1">請填寫姓名</p>
                )}
                </div>

                {/* Email */}
                <div className="flex-col-start w-full">
                <label>Email <span className="text-accent-red">*</span></label>
                <input type="email" value={visitorEmail}
                        placeholder="請填寫 Email"
                        onChange={(e) => setVisitorEmail(e.target.value)}/>
                {hasAttemptedSubmit &&
                    (!visitorEmail.trim() || !emailRegex.test(visitorEmail)) && (
                    <p className="pl-2 text-xs text-accent-red mt-1">
                        請填寫有效的 Email
                    </p>
                    )}
                </div>

                {/* 聯絡方式 */}
                <div className="flex-col-start w-full">
                <label>其他聯絡方式 <span className="text-xs text-muted">（選填）</span></label>
                <input type="text" value={contactMethod}
                        placeholder="請填寫手機、LINE、FB 擇一"
                        onChange={(e) => setContactMethod(e.target.value)}/>
                </div>

                {/* 訊息內容 */}
                <div className="flex-col-start w-full">
                <label>訊息內容 <span className="text-accent-red">*</span></label>
                <textarea className="h-48"  value={message}
                            placeholder="請描述您想詢問的內容，例如課程問題、合作洽談等"
                            onChange={(e) => setMessage(e.target.value)}/>
                {hasAttemptedSubmit && !message.trim() && (
                    <p className="pl-2 text-xs text-accent-red mt-1">
                    請填寫您的訊息內容
                    </p>
                )}
                </div>

                {/* 送出按鈕 */}
                <button
                onClick={handleSubmit}
                className="mt-4 w-full bg-primary-strong text-white py-2 rounded-md text-lg font-bold hover:bg-primary-hover transition-colors"
                >
                送出表單
                </button>
            </div>

            {/* ========= Modal（成功 / 失敗 / loading）========= */}
            {modalStatus !== "none" && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex-col-center-center z-[100]">
                <div className="bg-panel w-[90%] max-w-[360px] rounded-lg shadow-lg p-8 flex-col-center gap-4">

                {/* Loading */}
                {modalStatus === "loading" && (
                    <div className="flex-col-center-center gap-4">
                    <div className="animate-spin h-10 w-10 border-4 border-primary-75 border-t-transparent rounded-full" />
                    <p className="text-muted">資料送出中…請稍候</p>
                    </div>
                )}

                {/* Success */}
                {modalStatus === "success" && (
                    <>
                    <h3 className="text-center text-emphasized">已收到你的訊息！</h3>
                    
                    {(contactID || sendTime) && (
                      <div className="w-full bg-card-75 rounded-md p-3 text-center text-sm">
                        {contactID && (
                          <p className="mb-1">
                            發信編號：<span className="text-emphasized font-bold">#{contactID}</span>
                          </p>
                        )}
                        {sendTime && (
                          <p className="text-muted text-xs">
                            發信時間：{sendTime}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <p className="text-sm text-muted text-center leading-relaxed">
                        我們會在 1–2 個工作天內回覆，
                        <br />若你想快速詢問，也可私訊 LINE。
                    </p>
                    <button
                        onClick={() => setModalStatus("none")}
                        className="w-full mt-2 bg-primary-strong text-white py-2 rounded-md font-bold hover:bg-primary-hover transition-colors"
                    >
                        確認
                    </button>
                    </>
                )}

                {/* Error */}
                {modalStatus === "error" && (
                    <>
                    <h3 className="text-xl font-bold text-red-500">送出失敗</h3>
                    <p className="text-center text-sm text-muted leading-relaxed">
                        系統似乎遇到問題，
                        <br />請重新操作或直接聯絡我們協助處理。
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
        </div>
    </section>
  )
}
