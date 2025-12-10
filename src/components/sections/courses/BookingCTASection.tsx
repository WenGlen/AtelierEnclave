import { Link } from "react-router-dom"

interface BookingCTAProps {
  title?: string
  subTitle?: string
  buttonText?: string
  buttonTo?: string
}

export default function BookingCTASection({
  title = "找到喜歡的課程了嗎？",
  subTitle = "預約屬於你的療癒時光，開始放慢腳步。",
  buttonText = "前往預約",
  buttonTo = "/booking",
}: BookingCTAProps) {
  return (
    <section className="w-full py-24">
      <div className="max-w-screen-lg mx-auto flex-col-center gap-8">

        {/* 內容外框 */}
        <div className="
          w-full bg-panel-75 rounded-lg shadow-sm 
          px-8 py-4
          flex-row-between-center gap-4
        ">
          
          <div className="w-full text-muted">
          <p className="text-xl font-bold mb-2">{title}</p>
          <p className="">{subTitle}</p>
          </div>

          {/* CTA 按鈕 */}
          <Link
            to={buttonTo}
            className="w-1/3 min-w-24 h-12 flex-col-center-center
              rounded-md bg-primary
              text-white font-semibold
              hover:bg-primary-hover
            "
          >
            {buttonText}
          </Link>
        </div>

      </div>
    </section>
  )
}
