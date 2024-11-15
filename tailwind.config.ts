import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: { Pretendard: ['Pretendard', 'sans-serif'] },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          50: '#F5F1FE',
          100: '#E4D9FD',
          200: '#C2A8FA',
          300: '#A078F7',
          400: '#7F4AF4',
          500: '#5C18F1',
          600: '#470CCA',
          700: '#36099A',
          800: '#25066A',
          900: '#14043A',
          1000: '#03010A'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        warning: {
          50: '#FB6362',
          100: '#18C1FE',
          200: '#63D793'
        },
        Grey: {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#DCDCDC',
          300: '#C2C2C2',
          400: '#A8A8A8',
          500: '#5C5C5C',
          600: '#8F8F8F',
          700: '#757575',
          800: '#424242',
          900: '#2A2A2A',
          1000: '#0F0F0F'
        },
        boxShadow: {
          'custom-light': '0px 4px 4px 0px rgba(0, 0, 0, 0.05)'
        },
        static: { black: '#000', white: '#FFF' },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      font: {
        headingL: 'font-pretendard text-black font-bold text-2xl leading-11 tracking-tight'
      }
    },
    screens: {
      mobile: { max: '480px' },
      mobile_row: { max: '768px' },
      tablet: { max: '1024px' },
      desktop: { max: '1280px' }
    }
  }
};
export default config;
