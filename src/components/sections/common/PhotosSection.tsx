import { useState, useRef, useEffect } from "react"

interface PhotoItem {
  img: string
  label?: string
}

interface PhotosSectionProps {
  sectionTitle?: string
  sectionSubTitle?: string
  titleOnPhoto?: string
  items: PhotoItem[]
}

export default function PhotosSection({ items, sectionTitle, sectionSubTitle, titleOnPhoto }: PhotosSectionProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const startXRef = useRef<number | null>(null)
  const startYRef = useRef<number | null>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  // 當 items 變化時，確保 current 不會超出範圍
  useEffect(() => {
    if (items && items.length > 0) {
      if (current >= items.length) {
        setCurrent(0)
      }
    }
  }, [items, current])

  // 動畫完成後重置direction
  useEffect(() => {
    if (direction !== null) {
      const timer = setTimeout(() => {
        setDirection(null)
      }, 400) // 動畫時長
      return () => clearTimeout(timer)
    }
  }, [direction, current])

  // 觸控滑動判定
  useEffect(() => {
    const imageContainer = imageRef.current
    if (!imageContainer) return

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        startXRef.current = e.touches[0].clientX
        startYRef.current = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!startXRef.current || !startYRef.current) return
      
      const diffX = Math.abs(e.touches[0].clientX - startXRef.current)
      const diffY = Math.abs(e.touches[0].clientY - startYRef.current)
      
      // 水平滑動時阻止預設行為
      if (diffX > diffY && diffX > 10) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startXRef.current) return

      const diff = e.changedTouches[0].clientX - startXRef.current
      
      if (Math.abs(diff) > 50) {
        if (!items || items.length === 0) return
        if (diff > 0) {
          setDirection('right')
          setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1))
        } else {
          setDirection('left')
          setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1))
        }
      }

      startXRef.current = null
      startYRef.current = null
    }

    imageContainer.addEventListener('touchstart', handleTouchStart, { passive: false })
    imageContainer.addEventListener('touchmove', handleTouchMove, { passive: false })
    imageContainer.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      imageContainer.removeEventListener('touchstart', handleTouchStart)
      imageContainer.removeEventListener('touchmove', handleTouchMove)
      imageContainer.removeEventListener('touchend', handleTouchEnd)
    }
  }, [items])

  const goPrev = () => {
    if (!items || items.length === 0) return
    setDirection('right')
    setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1))
  }

  const goNext = () => {
    if (!items || items.length === 0) return
    setDirection('left')
    setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1))
  }

  const goToIndex = (idx: number) => {
    if (!items || items.length === 0) return
    setDirection(idx > current ? 'left' : 'right')
    setCurrent(idx)
  }

  // 如果 items 為空或沒有資料，不渲染內容
  if (!items || items.length === 0 || !items[current]) {
    return null
  }

  return (
    <section className="w-full">
      <div className="max-w-screen-lg mx-auto flex-col-center gap-8">

        {/* 區塊標題：若未填不顯示 */}
        {sectionTitle && (
          <h2 > {sectionTitle} </h2>
        )}
        {sectionSubTitle && (
            <p className="text-center text-emphasized">{sectionSubTitle}</p>
        )}


        {/* 主 Slider 區域 */}
        <div className="w-full flex-col-center gap-4">

          {/* 主影像（4:3） */}
          <div 
              ref={imageRef}
              className="relative w-full h-[240px] overflow-hidden rounded-md 
                          md:h-[360px] lg:h-[420px]"
              style={{ touchAction: 'pan-x' }}
          >
              {/* 圖片容器 - 使用動畫 */}
              <div 
                key={current}
                className={`absolute inset-0 w-full h-full ${
                  direction === 'left' 
                    ? 'animate-slide-in-left' 
                    : direction === 'right' 
                    ? 'animate-slide-in-right' 
                    : ''
                }`}
              >
                <img
                  src={items[current].img}
                  alt={`photo-${current}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 圖片標籤（左下） */}
              {items[current].label && (
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-card-50 text-sm rounded-md pointer-events-none z-10">
                  {items[current].label}
                  </div>
              )}

              {/* 圖片標題（右上，與左下標籤對稱） */}
              {titleOnPhoto && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-card-50 font-bold text-sm text-emphasized rounded-bl-md pointer-events-none z-10">
                  {titleOnPhoto}
                  </div>
              )}
          </div>

          {/* ===== 控制區域：圓點指示器 + 左右按鈕 ===== */}
          <div className=" relative w-full flex-row-center-center gap-4">
            {/* 左側按鈕 */}
            <button
              onClick={goPrev}
              className="text-2xl text-emphasized hover:text-primary-hover transition-colors"
              aria-label="上一張"
            >
              ‹
            </button>

            {/* 圓點指示器 */}
            <div className="flex gap-2 md:hidden">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all translate-y-1/2
                  ${current === idx ? "bg-primary-strong" : "bg-border"}`}
                  aria-label={`切換到第 ${idx + 1} 張圖片`}
                />
              ))}
            </div>

            {/* 下方縮圖（桌機限定） */}
            <div className="hidden md:flex gap-4 justify-center">
              {items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => goToIndex(idx)}
                  className={`w-24 h-16 rounded-md overflow-hidden border 
                              ${current === idx ? "border-primary-strong" : "border-border"} 
                              hover:border-primary-hover transition-colors`}
                >
                  <img
                    src={item.img}
                    alt={`thumb-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* 右側按鈕 */}
            <button
              onClick={goNext}
              className="text-2xl text-emphasized hover:text-primary-hover transition-colors"
              aria-label="下一張"
            >
              ›
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
