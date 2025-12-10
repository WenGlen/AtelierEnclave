interface TestimonialItem {
  name: string;
  course: string;
  avatar: string;
  comment: string;
}

interface TestimonialsSectionProps {
  testimonials?: TestimonialItem[];
}

export default function TestimonialsSection({ testimonials = [] }: TestimonialsSectionProps) {
  
    return (
      <section className="w-full pt-24 pb-8">
        <div className="max-w-screen-lg mx-auto flex-col-center gap-12">
  
          {/* 區塊標題 */}
          <div className="w-full text-center">
            <h2>我們的學員真心話</h2>
            <p className="text-muted">真實體驗，帶來真實的療癒</p>
          </div>
  
          {/* 卡片群組 */}
          <div className="w-full grid gap-12
                          md:grid-cols-3 md:gap-12">
  
            {testimonials.map((item, idx) => (
              <div key={idx} className="w-full">
  
                {/* ========== 手機版：對話氣泡 ========== */}
                <div  className={`md:hidden w-full flex gap-4 px-4
                                ${idx % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>

                    {/* 文字氣泡 + 尾巴 */}
                    <div className={`relative max-w-[75%] bg-card p-4 rounded-2xl shadow-sm`}> 
                        <p className="text-base leading-relaxed mb-2">
                        {item.comment}
                        </p>
                        <p className="text-sm text-muted">{item.course}</p>

                        {idx % 2 === 0 ? (
                        <div className="absolute bottom-8 -right-2 w-4 h-4 bg-card skew-x-[-45deg]"/>  // 左邊 bubble → 尾巴在右下
                        ) : (
                        <div className="absolute bottom-8 -left-2 w-4 h-4 bg-card skew-x-[45deg]"/>    // 右邊 bubble → 尾巴在左下
                        )}
                    </div>

                    {/* Avatar + Name（跟隨方向）*/}
                    <div className="flex-col-end-center  w-[25%]">
                        <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-14 h-14 rounded-full object-cover shadow"
                        />
                        <p className="text-base font-semibold">{item.name}</p>
                    </div>
                </div>

  
                {/* ========== 桌機版：正常卡片 ========== */}
                <div
                  className="hidden md:flex md:flex-col gap-4
                             p-6 bg-card rounded-2xl shadow-sm"
                >
                  {/* 文字在上 */}
                  <p className="text-base leading-relaxed min-h-32">{item.comment}</p>
  
                  {/* avatar 在下 */}
                  <div className="flex-row-start-center gap-4 pt-2">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-lg font-semibold">{item.name}</p>
                      <p className="text-sm text-muted">{item.course}</p>
                    </div>
                  </div>
                </div>
  
              </div>
            ))}
  
          </div>
        </div>
      </section>
    )
  }
  