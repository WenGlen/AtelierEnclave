import './css/index.scss'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import About from './pages/About'
import Booking from './pages/Booking'
import Contact from './pages/Contact'
import StyleTest from './pages/StyleTest'
import ScrollToTop from '@/components/ui/ScrollToTop'
import MainLayout from "@/layouts/MainLayout"




const basename = import.meta.env.PROD ? '/AtelierEnclave' : ''

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <Routes >
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="course/:id" element={<CourseDetail />} />
          <Route path="about" element={<About />} />
          <Route path="booking" element={<Booking />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        {/* 測試頁面：不在 MainLayout 中，不會顯示 Header 和 Footer */}
        <Route path="/style-test" element={<StyleTest />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
