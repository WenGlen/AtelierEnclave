/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary 顏色系列
        primary: {
          DEFAULT: 'var(--color-primary)',
          strong: 'var(--color-primary-strong)',
          hover: 'var(--color-primary-hover)',
          '10': 'var(--color-primary-10)',
          '25': 'var(--color-primary-25)',
          '50': 'var(--color-primary-50)',
          '75': 'var(--color-primary-75)',
          '90': 'var(--color-primary-90)',
        },
        // Secondary 顏色系列
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          strong: 'var(--color-secondary-strong)',
          hover: 'var(--color-secondary-hover)',
          '10': 'var(--color-secondary-10)',
          '25': 'var(--color-secondary-25)',
          '50': 'var(--color-secondary-50)',
          '75': 'var(--color-secondary-75)',
          '90': 'var(--color-secondary-90)',
        },
        // Background 顏色系列
        background: {
          DEFAULT: 'var(--color-bg)',
          '10': 'var(--color-bg-10)',
          '25': 'var(--color-bg-25)',
          '50': 'var(--color-bg-50)',
          '75': 'var(--color-bg-75)',
          '90': 'var(--color-bg-90)',
        },
        panel: {
          DEFAULT: 'var(--color-panel)',
          '10': 'var(--color-panel-10)',
          '25': 'var(--color-panel-25)',
          '50': 'var(--color-panel-50)',
          '75': 'var(--color-panel-75)',
          '90': 'var(--color-panel-90)',
        },
        card: {
          DEFAULT: 'var(--color-card)',
          hover: 'var(--color-card-hover)',
          '10': 'var(--color-card-10)',
          '25': 'var(--color-card-25)',
          '50': 'var(--color-card-50)',
          '75': 'var(--color-card-75)',
          '90': 'var(--color-card-90)',
        },
        // Text 顏色系列
        textDefaultColor: 'var(--color-text-default)',
        muted: 'var(--color-text-muted)',
        sub: 'var(--color-text-sub)',
        light: 'var(--color-text-light)',
        emphasized: 'var(--color-text-emphasized)',
        // Border 顏色系列
        border: {
          DEFAULT: 'var(--color-border)',
          '10': 'var(--color-border-10)',
          '25': 'var(--color-border-25)',
          '50': 'var(--color-border-50)',
          '75': 'var(--color-border-75)',
          '90': 'var(--color-border-90)',
        },
        // 其他顏色
        accent: {
          yellow: 'var(--color-accent-yellow)',
          purple: 'var(--color-accent-purple)',
          red: 'var(--color-accent-red)',
        },
        link: {
          DEFAULT: 'var(--color-link)',
          hover: 'var(--color-link-hover)',
        },

      },
      screens: {
        '2xs': '375px',
        'xs': '480px', 
        'smx': '640px', // 考量自訂參數 xs 的層級較高，sm 等預設值共用時會無法作用，故自訂 smx 參數，下方邏輯相同
        'mdx': '768px',   
        'lgx': '1024px',  
        'xlx': '1280px',  
        '2xlx': '1536px', 

        'md+': '840px',  // 特殊情況使用
       },
      borderRadius: {
        card: 'var(--card-radius)',
      },
      padding: {
        'card-m': 'var(--card-padding-m)',
        'card-l': 'var(--card-padding-l)',
      },
      fontSize: {
        xs: "0.875rem",     // 原本 sm
        sm: "1rem",         // 原本 base
        base: "1.125rem",   // 原本 lg
        lg: "1.25rem",      // 原本 xl
        xl: "1.5rem",       // 原本 2xl
        "2xl": "1.75rem",   // 原本 3xl
        "3xl": "2rem",
        "4xl": "2.5rem",
        "5xl": "3rem",
      },
      boxShadow: {
        'drop-sm': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'drop-md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'drop-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'drop-xl': '0 20px 25px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
}

