interface IntroItem {
    title: string;
    desc: string;
    img: string;
  }
  
  interface IntroSectionProps {
    sectionTitle?: string;
    sectionSubTitle?: string;
    items: IntroItem[];
    footerText?: string;
  }
  
  export default function IntroSection({ items, sectionTitle, sectionSubTitle, footerText }: IntroSectionProps) {
    return (
        <section className="w-full py-24">

        <div className="mx-auto flex-col-center gap-16">
  
          {sectionTitle && (
            <h2>{sectionTitle}</h2>
          )}
          {sectionSubTitle && (
            <p>{sectionSubTitle}</p>
          )}

          {items.map((item, idx) => {
            const isReverse = idx % 2 === 1;
  
            return (
              <div
                key={idx}
                className={`w-full flex-col-center gap-4
                            md:flex md:flex-row md:items-center md:gap-12
                            ${isReverse ? "md:flex-row-reverse" : ""}`}
              >
                {/* 圖片 */}
                <div className="w-full h-[180px] overflow-hidden rounded-md
                                md:w-1/3">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
  
                {/* 文字 */}
                <div className="w-full
                                md:w-2/3">
                  <h3 className="text-2xl font-bold mb-3">
                    {item.title}
                  </h3>
                  <p className="text-base leading-relaxed text-muted">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* 引導文字 */}
          {footerText && (
            <div className="text-center text-lg text-emphasized">
                <p className="w-full ">
                {footerText}
                </p>
                <p className="rotate-90">
                   〉
                </p>
            </div>
          )}
  
        </div>
      </section>
    );
  }
  