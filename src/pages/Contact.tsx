import Noise_StackingUneven from "@/layouts/Noise_StackingUneven"
import PageBanner from "@/components/sections/common/PageBanner"
import ContactFormSection from "@/components/sections/contact/ContactFormSection"

export default function Contact() {
  return (
    <div>
      <Noise_StackingUneven>

        <PageBanner title="聯絡我們" 
                    img="https://i.meee.com.tw/nA6uumS.png" />

        <ContactFormSection />

      </Noise_StackingUneven>
    </div>
  )
}
