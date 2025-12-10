interface PageBannerProps {
    title: string
    subtitle?: string
    img: string   // Unsplash 連結或本地圖片
  }
  
  export default function PageBanner({ title, subtitle, img }: PageBannerProps) {
    return (
      <section className="banner-section relative w-full
                             h-[40vh]
                          md:h-[33vh]">
  
        {/* 背景圖 */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover"
          />
  
          {/* 淺遮罩（提升文字可讀性） */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
  
        {/* 文字內容 */}
        <div className="relative z-10 w-full max-w-screen-lg mx-auto h-full flex-col-end
                        px-8 pb-8 text-white">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          {subtitle && (
            <p className="text-lg text-panel-75">{subtitle}</p>
          )}
        </div>
  
      </section>
    )
  }
  