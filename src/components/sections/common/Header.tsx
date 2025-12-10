import { useEffect, useLayoutEffect, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import NavItem from "../../ui/NavItem"
import { API_BASE_URL } from "@/config/api"

interface Course {
  courseID: string
  courseName: string
}

interface NavItem {
  to: string
  label: string
  isDropdown?: boolean
}

const navItems: NavItem[] = [
  { to: "/courses", label: "課程介紹", isDropdown: true },
  { to: "/about", label: "關於療癒秘境" },
  { to: "/booking", label: "預約報名" },
  { to: "/contact", label: "聯絡我們" },
]

export default function Header() {
  const [showHeader, setShowHeader] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasHero, setHasHero] = useState(false)
  const [heroHeight, setHeroHeight] = useState(0)
  const [courses, setCourses] = useState<Course[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0 })

  const location = useLocation()

  // 獲取課程列表
  useEffect(() => {
    fetch(API_BASE_URL + "/api/courseDropdown")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data)
      })
      .catch((err) => {
        console.error("取得課程列表失敗：", err)
      })
  }, [])

  /* ========= ① DOM 建立後，偵測是否存在 hero ========= */
  useLayoutEffect(() => {
    const checkHero = () => {
      const hero = document.querySelector("#hero-section")

      if (hero) {
        const height = hero.clientHeight
        // 確保 hero 有實際高度（避免在內容載入前誤判）
        if (height > 0) {
          setHasHero(true)
          setHeroHeight(height)
          // 初始狀態：如果滾動位置小於 hero 高度的一半，隱藏 header
          setShowHeader(window.scrollY > height * 0.5)
        }
        // 如果高度為 0，ResizeObserver 會處理後續的高度變化
      } else {
        setHasHero(false)
        setShowHeader(true)
      }
    }

    // 立即檢查一次
    checkHero()

    // 如果 hero 可能延遲載入，也設置一個延遲檢查（最多檢查幾次）
    const timeoutId1 = setTimeout(checkHero, 100)
    const timeoutId2 = setTimeout(checkHero, 300)
    const timeoutId3 = setTimeout(checkHero, 600)

    return () => {
      clearTimeout(timeoutId1)
      clearTimeout(timeoutId2)
      clearTimeout(timeoutId3)
    }
  }, [location.pathname])

  /* ========= ② 監聽 hero 高度變化（處理動態內容載入） ========= */
  useEffect(() => {
    const hero = document.querySelector("#hero-section")
    if (!hero) return

    // 使用 ResizeObserver 監聽 hero 高度變化
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.contentRect.height
        if (height > 0) {
          setHasHero(true)
          setHeroHeight(height)
          // 更新 header 顯示狀態
          setShowHeader(window.scrollY > height * 0.5)
        }
      }
    })

    resizeObserver.observe(hero)

    return () => {
      resizeObserver.disconnect()
    }
  }, [location.pathname])

  /* ========= ③ 只有首頁 hero 才要監聽滾動 ========= */
  useEffect(() => {
    if (!hasHero) return

    const handleScroll = () => {
      const s = window.scrollY
      setShowHeader(s > heroHeight * 0.5)
    }

    // 初始檢查一次
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hasHero, heroHeight])

  /* ========= ④ 點擊切頁後，自動收手機選單 ========= */
  useEffect(() => {
    setMenuOpen(false)
    setMobileDropdownOpen(false)
  }, [location.pathname])

  /* ========= ⑤ 動畫 class ========= */
  const headerClass = `fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
    showHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
  }`

  return (
    <header className={headerClass}>
      <div className="w-full bg-panel-75 backdrop-blur-md shadow-sm relative">

        <div className="max-w-screen-lg mx-auto p-4 flex-row-between-center">

          {/* Logo */}
          <Link to="/" className="text-lg font-bold hover:text-primary-strong">
            Atelier Enclave
          </Link>

          {/* 桌機版 */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              if (item.isDropdown) {
                return (
                  <div
                    key={item.to}
                    className="relative h-full flex items-center -my-4 py-4"
                    onMouseEnter={(e) => {
                      // 獲取 NavItem 文字的位置
                      const navItem = e.currentTarget.querySelector('a')
                      const bgContainer = e.currentTarget.closest('header')?.querySelector('.bg-panel-75')?.getBoundingClientRect()
                      if (navItem && bgContainer) {
                        const navItemRect = navItem.getBoundingClientRect()
                        // 下拉菜單內容有 px-8 (32px)，所以需要減去這個 padding 讓文字對齊
                        setDropdownPosition({ left: navItemRect.left - bgContainer.left - 32 })
                      }
                      setDropdownOpen(true)
                    }}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <NavItem to={item.to}>{item.label}</NavItem>
                  </div>
                )
              }
              return (
                <NavItem key={item.to} to={item.to}>
                  {item.label}
                </NavItem>
              )
            })}
          </nav>

          {/* 手機漢堡 */}
          <button
            className="md:hidden text-2xl text-primary-75"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* 下拉選單（定位在 header 底部） */}
        {dropdownOpen && courses.length > 0 && (
          <div
            className="absolute top-full left-0 z-50 hidden md:block"
            style={{ left: `${dropdownPosition.left}px` }}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <div className="bg-panel-75 backdrop-blur-md shadow-lg rounded-b-md min-w-[280px] py-4">
              {courses.map((course) => (
                <Link
                  key={course.courseID}
                  to={`/course/${course.courseID}`}
                  className="block px-8 py-2 text-textDefaultColor hover:bg-panel-50 hover:text-primary-hover transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  {course.courseName}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 手機 Drawer */}
        {menuOpen && (
          <div className="md:hidden w-full p-8 flex-col-start-end gap-4 shadow-lg text-xl">
            {/* 首頁連結（僅手機版） */}
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-primary-strong"
                  : "text-textDefaultColor hover:text-primary-hover"
              }
            >
              首頁
            </NavLink>
            {navItems.map((item) => {
              if (item.isDropdown) {
                return (
                  <div key={item.to} className="w-full">
                    <button
                      onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                      className={`w-full flex items-center justify-end gap-2 ${
                        location.pathname.startsWith("/course") || location.pathname === "/courses"
                          ? "font-bold text-primary-strong"
                          : "text-textDefaultColor hover:text-primary-hover"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-sm">{mobileDropdownOpen ? "▼" : "▶"}</span> 
                    </button>
                    {mobileDropdownOpen && courses.length > 0 && (
                      <div className="-mx-2 mt-2 flex-col-start gap-2 text-base bg-card-25 p-4 rounded-md min-w-[280px]">
                        <NavLink
                          to="/courses"
                          onClick={() => {
                            setMenuOpen(false)
                            setMobileDropdownOpen(false)
                          }}
                          className={({ isActive }) =>
                            isActive
                              ? "font-bold text-primary-strong"
                              : "text-textDefaultColor hover:text-primary-hover"
                          }
                        >
                          全部課程
                        </NavLink>
                        {courses.map((course) => (
                          <NavLink
                            key={course.courseID}
                            to={`/course/${course.courseID}`}
                            onClick={() => {
                              setMenuOpen(false)
                              setMobileDropdownOpen(false)
                            }}
                            className={({ isActive }) =>
                              isActive
                                ? "font-bold text-primary-strong"
                                : "text-textDefaultColor hover:text-primary-hover"
                            }
                          >
                            {course.courseName}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold text-primary-strong"
                      : "text-textDefaultColor hover:text-primary-hover"
                  }
                >
                  {item.label}
                </NavLink>
              )
            })}
          </div>
        )}

      </div>
    </header>
  )
}
