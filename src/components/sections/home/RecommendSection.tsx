import { useState } from "react"
import RecommendModal from "./RecommendModal"

interface RecommendSectionProps {
  questions: any[] // 之後可改型別
}

export default function RecommendSection({ questions }: RecommendSectionProps) {
  const [open, setOpen] = useState(false)

  return (
    <section className="w-full py-24">
      <div className="max-w-screen-lg h-[400px] mx-auto flex-col-center-center">

        <h2>找出最適合你的課程</h2>
        <p className="text-muted text-center">
          通過幾個簡單問題，我們會推薦最適合你的體驗課。
        </p>

        <button
          onClick={() => setOpen(true)}
          className="mt-12 w-[300px]  px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
        >
          開始找課
        </button>

        {open && (
          <RecommendModal
            questions={questions}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    </section>
  )
}
