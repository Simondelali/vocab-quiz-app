// app/layout.js
import { ThemeProvider } from './contexts/ThemeContext'
import './globals.css'

export const metadata = {
  title: 'Vocab Quiz App',
  description: 'SAT Vocabulary Quiz App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ThemeProvider>
        <body>{children}</body>
      </ThemeProvider>
    </html>
  )
}