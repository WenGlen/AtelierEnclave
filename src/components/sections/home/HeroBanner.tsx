import { useEffect, useState, useRef } from "react"
import logo from "@/img/AtelierEnclave.png"
import logoCN from "@/img/療癒秘境.png"

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

interface HeroBannerProps {
  heroSlides?: HeroSlide[];
}

export default function HeroBanner({ heroSlides = [] }: HeroBannerProps) {
  const [current, setCurrent] = useState(0)
  const heroSectionRef = useRef<HTMLElement>(null)

  const goPrev = () =>
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)

  const goNext = () =>
    setCurrent((prev) => (prev + 1) % heroSlides.length)

  // 向下滾動，讓 hero section 底部剛好離開畫面
  const scrollToNext = () => {
    if (heroSectionRef.current) {
      const heroRect = heroSectionRef.current.getBoundingClientRect()
      const heroBottom = heroRect.bottom + window.scrollY
      
      window.scrollTo({
        top: heroBottom,
        behavior: 'smooth'
      })
    }
  }

  // 自動播放（6 秒）
  useEffect(() => {
    if (heroSlides.length === 0) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  // 如果沒有資料，不渲染內容
  if (!heroSlides || heroSlides.length === 0 || !heroSlides[current]) {
    return null
  }

  return (
    <section ref={heroSectionRef} id="hero-section" className="banner-section relative w-full h-screen overflow-hidden">

  {/* ====== 背景輪播區（左右推動） ====== */}
  <div
    className="absolute inset-0 flex w-full h-full transition-transform duration-700"
    style={{ transform: `translateX(-${current * 100}%)` }}
  >
    {heroSlides.map((slide) => (
      <div
        key={slide.id}
        className="w-full h-full shrink-0 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${slide.image})` }}
      >
        <div className="absolute inset-0 bg-black/10" />
      </div>
    ))}
  </div>

  {/* ====== 內容區 ====== */}
  <div className="relative z-10 w-full h-full flex-col-center-center">

    <div className="w-full h-full flex-col-end-center pointer-events-none"> 
        {/* 主標（置中＋靠上） */}
        <div className="w-[80%] mb-8 text-white 
                        md:absolute md:left-1/2 md:-translate-x-1/2  md:top-[10%] md:-translate-y-[25%]   md:max-w-screen-xl">
            <h1 className="sr-only">療癒秘境 Atelier Enclave｜官方網站</h1>
            <img src={logo} alt="logo" className="w-96 h-auto drop-shadow" />
            <div className="flex-row-start-center mt-4">
              <p className="text-white/90 text-lg md:text-2xl">
                  讓心靈慢下來的
              </p>
              <img src={logoCN} alt="logo" className="h-6 md:h-8 opacity-90" />
            </div>
        </div>

        {/* 資訊卡片（mobile 貼右下角，桌機才拉開距離） */}
        <div className=" bg-background-50 backdrop-blur-md shadow-lg px-6
                             w-full         rounded-t-md                          pb-20    text-end
                        md:absolute md:bottom-16 md:right-0  md:w-[400px]  md:rounded-l-md  md:rounded-tr-none   md:pb-4  md:text-start">
        <h2 className="text-end md:text-start text-textDefaultColor text-lg font-bold mb-2">
            {heroSlides[current].title}
        </h2>
        <p className="text-sm leading-relaxed ">
            {heroSlides[current].subtitle}
        </p>
        </div>
    </div>
  </div>
  {/* ====== 左右切換按鈕（桌機版限定） ====== */}
  <div className="hidden md:block absolute inset-0 z-20 pointer-events-none"> 
    <button
        onClick={goPrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-white/80 pointer-events-auto cursor-pointer"
    >
        ‹
    </button>

    <button 
        onClick={goNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-white/80 pointer-events-auto cursor-pointer"
    >
        ›
    </button>
  </div>

  {/* ====== 左下角的圓點（不是置中） ====== */}
  <div className="absolute bottom-8 left-8 flex gap-2 z-20">
    {heroSlides.map((_, idx) => (
      <button
        key={idx}
        onClick={() => setCurrent(idx)}
        className={`w-2 h-2 rounded-full transition-all ${
          current === idx ? "bg-white" : "bg-white/40"
        }`}
      />
    ))}
  </div>

  {/* ====== 中下方向下箭頭 ====== */}
  <button
    onClick={scrollToNext}
    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/90 hover:text-white cursor-pointer"
    aria-label="向下滾動"
  >
    <svg
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l8 8 8-8" />
    </svg>
  </button>
</section>


  )
}
