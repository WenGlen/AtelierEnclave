import { useState, useEffect } from "react";
import CourseListSection from "@/components/sections/courses/CourseListSection";
import PageBanner from "@/components/sections/common/PageBanner";
import BookingCTASection from "@/components/sections/courses/BookingCTASection";
import Noise_StackingUneven from "@/layouts/Noise_StackingUneven";
import { API_BASE_URL } from "@/config/api";



export default function Courses() {

  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    fetch(API_BASE_URL + "/api/courses")
      .then((res) => res.json())
      .then((data) => {
        //console.log("課程列表：", data);
        setCourseList(data);
      })
      .catch((err) => {
        console.error("取得 course list 失敗：", err);
      });
  }, []);
  return (
    <div>
      <Noise_StackingUneven>

        <PageBanner
          title="課程介紹"
          subtitle="探索我們精心設計的課程，找到適合您的創作體驗"
          img="https://i.meee.com.tw/qb6HLNK.png"
        />

        <CourseListSection courses={courseList}/>

        {/* Booking CTA */}
        <section>
          <BookingCTASection
            title="預約報名"
            subTitle="找到適合您的課程，開始您的創作之旅"
            buttonText="前往預約"
            buttonTo="/booking"
          />
          {/* Placeholder：一段文字 + 按鈕 */}
        </section>

      </Noise_StackingUneven>
    </div>
  )
}
