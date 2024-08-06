
'use client'

import { useContext } from 'react'
import { ThemeContext } from './contexts/ThemeContext'
import Quiz from './components/Quiz'
import ThemeToggle from './components/ThemeToggle'

export default function Home() {
  const { isDarkMode } = useContext(ThemeContext)

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-200`}>
      <ThemeToggle />

      <main className="container mx-auto px-4 py-12">
        <h1 className={`text-4xl font-bold mb-8 text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Vocab Quiz App
        </h1>
        <Quiz />
      </main>
    </div>
  )
}