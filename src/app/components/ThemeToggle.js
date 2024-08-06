'use client'

import { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext)

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  )
}