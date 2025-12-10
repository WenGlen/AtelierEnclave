import { useState, useEffect } from "react";
import PageBanner from "@/components/sections/common/PageBanner"
import IntroSection from "@/components/sections/common/IntroSection";
import PhotosSection from "@/components/sections/common/PhotosSection";
import TeachersSection from "@/components/sections/about/TeachersSection"
import Noise_StackingUneven from "@/layouts/Noise_StackingUneven"
import { API_BASE_URL } from "@/config/api"

interface TeacherApiItem {
  teacherID: string;
  teacherName: string;
  title: string;
  avatar: string;
  intro: string;
  words: string;
}



export const aboutIntro = [
  {
    title: "用手作，重新與自己相遇",
    desc: "在療癒秘境，我們相信每一次慢下來的創作，都是在和自己的心靈對話。無論是每畫一筆線條、每編織一個繩結，或一次的顏料揮灑，都能讓你在過程中安定情緒，重新找回日常裡的呼吸節奏。",
    img: "https://i.meee.com.tw/3ZVHczc.png"
  },
  {
    title: "不只是課程，是一段被細心包裹的體驗",
    desc: "我們精心打造溫暖的空間，並邀請風格獨特的老師帶領每一堂體驗課。在這裡，你不需要擁有任何經驗，只需要放鬆、享受、並讓自己被美好包圍。每個作品都是你當下的心情，也是值得珍藏的生活片段。",
    img: "https://i.meee.com.tw/k6YuVjd.png"
  }
]

export const photoMock = [
    {
      img: "https://i.meee.com.tw/oRjBwJJ.png",
      label: "手作材料桌"
    },
    {
      img: "https://i.meee.com.tw/v2HuOWD.png",
      label: "工藝作桌"
    },
    {
      img: "https://i.meee.com.tw/F7R9MIa.png",
      label: "海洋風教室"
    },
    {
      img: "https://i.meee.com.tw/OKBfBDL.png",
      label: "秘境大廳"
    }
  ]
  


export default function About() {
  const [teachers, setTeachers] = useState<{ id: number; name: string; title: string; avatar: string; intro: string; words?: string }[]>([]);

  useEffect(() => {
    fetch(API_BASE_URL + "/api/teachers")
      .then((res) => res.json())
      .then((data: TeacherApiItem[]) => {
        //console.log("老師資料：", data);
        // 將 API 資料映射為 TeachersSection 需要的格式
        const mappedTeachers = data
          .filter((item: TeacherApiItem) => item.teacherName && item.teacherName.trim() !== "")
          .map((item: TeacherApiItem, index: number) => ({
            id: index + 1, // 使用索引作為 id
            name: item.teacherName,
            title: item.title || "",
            avatar: item.avatar || "",
            intro: item.intro ? item.intro.replace(/<br\/>/g, '\n') : "", // 將 <br/> 轉換為換行符
            words: item.words ? item.words.replace(/<br\/>/g, '\n') : undefined, // 將 <br/> 轉換為換行符
          }));
        setTeachers(mappedTeachers);
      })
      .catch((err) => {
        console.error("取得老師資料失敗：", err);
      });
  }, []);

  return (
    <div>
      <Noise_StackingUneven>
        <PageBanner
          title="關於療癒秘境"
          subtitle="一個讓心靈慢下來的空間，透過手作和創意重新找回生活的節奏。"
          img="https://i.meee.com.tw/rvFptYj.png"
        />

        <IntroSection sectionTitle="品牌介紹" items={aboutIntro} />


        <TeachersSection
          sectionTitle="師資團隊"
          sectionSubTitle="每位老師都擁有獨特風格與教學理念"
          items={teachers}
        />

        {/* 教室環境照片 */}
        <PhotosSection sectionTitle="教室環境" items={photoMock} />

        <div className="w-full h-24"></div>
      </Noise_StackingUneven>

    </div>
  )
}
