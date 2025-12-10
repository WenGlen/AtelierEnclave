import { NavLink } from "react-router-dom"

interface NavItemProps {
  to: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function NavItem({ to, children, className = "", onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `${isActive 
          ? "font-bold text-primary-strong hover:text-primary-strong"
          : "text-textDefaultColor hover:text-primary-hover"} 
         ${className}`.trim()
      }
    >
      {children}
    </NavLink>
  )
}


