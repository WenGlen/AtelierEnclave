import { useState, useEffect } from "react";
import HeroBanner from "@/components/sections/home/HeroBanner";
import IntroSection from "@/components/sections/common/IntroSection";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";
import CourseListSection from "@/components/sections/courses/CourseListSection";
import PhotosSection from "@/components/sections/common/PhotosSection"
import UpcomingSessionsSection from "@/components/sections/common/UpcomingSessionsSection"
//import RecommendSection from "@/components/sections/home/RecommendSection"
import Noise_StackingUneven from "@/layouts/Noise_StackingUneven"
import { API_BASE_URL } from "@/config/api"

interface WorkItem {
  number: string;
  photo: string;
  label: string;
}

interface StudentItem {
  number: string;
  name: string;
  avatar: string;
  testimonial: string;
  participation: string;
}

interface HeroItem {
  number: string;
  banner: string;
  title: string;
  subTitle: string;
}

interface HomeApiResponse {
  hero: HeroItem[];
  work: WorkItem[];
  student: StudentItem[];
}

// 组件期望的课程数据类型（API 已返回此格式）
interface SessionItem {
  sessionId: number
  sessionName: string
  date: string
  startTime: string
  teacherName: string
  remainingSeats: number
  isHoliday: string
  type: string
  price: number
}

const introItems = [
  {
    title: "多元風格的療癒體驗",
    desc: "從繪畫、編織到黏土，每位講師都有不同風格，讓每次到訪都有新鮮感。",
    img: "https://i.meee.com.tw/1vrsqbc.png",
  },
  {
    title: "溫暖而放鬆的空間",
    desc: "整個空間以柔和色調與清新氣味營造平靜氛圍，讓人一走進來就慢下來。",
    img: "https://i.meee.com.tw/v2HuOWD.png",
  },
  {
    title: "每月更新全新課程",
    desc: "課程內容會依照季節或主題不斷更新，讓回訪的學員都有不同體驗。",
    img: "https://i.meee.com.tw/6uS5NFl.png",
  },
];


export const dummyQuestions = [
  {
    number: 1,
    question: "你現在想來體驗課的原因是什麼？",
    "option-1": "想放鬆、紓壓一下",
    "option-2": "想學一些新的技能",
    "option-3": "想要有美美的作品帶回家",
    "option-4": "",
    Notes: "",
  },
  {
    number: 2,
    question: "你比較偏好哪種類型的老師？",
    "option-1": "溫柔耐心型",
    "option-2": "有趣聊天型",
    "option-3": "嚴謹教學型",
    "option-4": "氣質文青型",
    Notes: "",
  },
  {
    number: 3,
    question: "你偏好課程的風格是？",
    "option-1": "療癒放鬆，一邊做一邊聊天",
    "option-2": "專心創作，享受安靜的過程",
    "option-3": "快速入門，輕鬆上手",
    "option-4": "",
    Notes: "",
  },
  {
    number: 4,
    question: "你比較在意作品的哪一方面？",
    "option-1": "細節質感",
    "option-2": "實用性",
    "option-3": "過程體驗",
    "option-4": "",
    Notes: "（這題之後可以影響排序強度）",
  },
  {
    number: 5,
    question: "你比較常能上課的時段是？",
    "option-1": "平日晚間",
    "option-2": "假日上午",
    "option-3": "假日下午",
    "option-4": "",
    Notes: "",
  },
]


export default function Home() {

  const [courseList, setCourseList] = useState([]);
  const [heroSlides, setHeroSlides] = useState<{ id: number; title: string; subtitle: string; image: string }[]>([]);
  const [workPhotos, setWorkPhotos] = useState<{ img: string; label: string }[]>([]);
  const [testimonials, setTestimonials] = useState<{ name: string; course: string; avatar: string; comment: string }[]>([]);
  const [sessions, setSessions] = useState<SessionItem[]>([]);

  useEffect(() => {
    fetch(API_BASE_URL + "/api/courses")
      .then((res) => res.json())
      .then((data) => {
        //console.log("課程列表：", data);
        setCourseList(data);
      })
      .catch((err) => {
        console.error("取得 courselist 失敗：", err);
      });
  }, []);

  useEffect(() => {
    fetch(API_BASE_URL + "/api/home")
      .then((res) => res.json())
      .then((data: HomeApiResponse) => {
        //console.log("首頁資料：", data);
        
        // 將 hero 陣列映射為 HeroBanner 需要的格式，並過濾掉空的資料
        const mappedHero = data.hero
          .filter((item: HeroItem) => item.banner && item.banner.trim() !== "" && item.title && item.title.trim() !== "")
          .map((item: HeroItem) => ({
            id: parseInt(item.number) || 0,
            title: item.title,
            subtitle: item.subTitle || "",
            image: item.banner,
          }));
        setHeroSlides(mappedHero);

        // 將 work 陣列映射為 PhotosSection 需要的格式，並過濾掉空的 photo
        const mappedWork = data.work
          .filter((item: WorkItem) => item.photo && item.photo.trim() !== "")
          .map((item: WorkItem) => ({
            img: item.photo,
            label: item.label || "",
          }));
        setWorkPhotos(mappedWork);

        // 將 student 陣列映射為 TestimonialsSection 需要的格式，並過濾掉空的資料
        const mappedTestimonials = data.student
          .filter((item: StudentItem) => item.name && item.name.trim() !== "" && item.testimonial && item.testimonial.trim() !== "")
          .map((item: StudentItem) => ({
            name: item.name,
            course: item.participation || "",
            avatar: item.avatar || "",
            comment: item.testimonial,
          }));
        setTestimonials(mappedTestimonials);
      })
      .catch((err) => {
        console.error("取得首頁資料失敗：", err);
      });
  }, []);

  // 获取课程数据（后端已返回正确格式）
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(API_BASE_URL + "/api/sessions/home");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: SessionItem[] = await response.json();
        setSessions(data);
      } catch (err) {
        console.error("取得課程資料失敗：", err);
      }
    };

    fetchSessions();
  }, []);

  return (
    <div>
      <Noise_StackingUneven>
        <h1 className="sr-only">療癒秘境 Atelier Enclave｜官方網站</h1>
        <HeroBanner heroSlides={heroSlides} />

        <IntroSection sectionTitle="歡迎來到療癒秘境" items={introItems} />

        <TestimonialsSection testimonials={testimonials} />

        <PhotosSection titleOnPhoto="欣賞學員的精彩作品" items={workPhotos} />

        <CourseListSection sectionTitle="找喜歡的課程" courses={courseList} simple/>

        <UpcomingSessionsSection sectionTitle="近期可報名課程" items={sessions} simple/>

        {/*<RecommendSection questions={dummyQuestions} />*/}
        <div className="h-24"/>
      </Noise_StackingUneven>

    </div>
  )
}
