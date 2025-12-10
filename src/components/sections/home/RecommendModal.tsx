import { useEffect, useState } from "react"

interface QuestionItem {
  number: number
  question: string
  ['option-1']: string
  ['option-2']: string
  ['option-3']?: string
  ['option-4']?: string
  Notes?: string
}

interface RecommendModalProps {
  questions: QuestionItem[]
  onClose: () => void
}

export default function RecommendModal({ questions, onClose }: RecommendModalProps) {
  const [index, setIndex] = useState(0)
  const q = questions[index]

  // 打開時禁止滾動
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  const handleSelect = () => {
    if (index < questions.length - 1) {
      setIndex(prev => prev + 1)
    } else {
      // TODO: 完成推薦結果流程
      onClose()
    }
  }

  const options = [
    q["option-1"],
    q["option-2"],
    q["option-3"],
    q["option-4"],
  ].filter(Boolean)

  return (
    <div className="fixed inset-0 z-50">

      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal 內容 */}
      <div
        className="
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-full h-full bg-background p-6 overflow-y-auto
          md:w-[520px] md:h-auto md:rounded-lg md:shadow-lg md:p-8
        "
      >
        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-xl text-muted hover:text-primary-hover"
        >
          ✕
        </button>

        {/* 問題編號 */}
        <p className="text-emphasized text-sm mb-2">
          問題 {q.number} / {questions.length}
        </p>

        {/* 題目 */}
        <h3 className="text-2xl font-bold mb-6">
          {q.question}
        </h3>

        {/* 選項 */}
        <div className="flex-col-center gap-3">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={handleSelect}
              className="w-full text-left px-5 py-3 rounded-md bg-card border border-border hover:border-primary-hover transition-all"
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Notes */}
        {q.Notes && (
          <p className="text-sm text-muted mt-4">
            {q.Notes}
          </p>
        )}
      </div>
    </div>
  )
}
