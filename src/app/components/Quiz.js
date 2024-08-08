// app/components/Quiz.js
'use client'

import { useState, useEffect, useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'
import { vocabularies } from '../data/vocabularies'
import useSound from 'use-sound'

export default function Quiz() {
  const [currentWords, setCurrentWords] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [answerOptions, setAnswerOptions] = useState([])

  const { isDarkMode } = useContext(ThemeContext)

  const [playCorrect] = useSound('/sounds/correct.mp3')
  const [playIncorrect] = useSound('/sounds/incorrect.mp3')

  useEffect(() => {
    startNewQuiz()
  }, [])

  const startNewQuiz = () => {
    setIsLoading(true)
    const shuffled = [...vocabularies].sort(() => 0.5 - Math.random())
    setCurrentWords(shuffled.slice(0, 20))
    setCurrentWordIndex(0)
    setScore(0)
    setQuizFinished(false)
    setWrongAnswers([])
    setIsLoading(false)
  }

  const getCurrentWord = () => currentWords[currentWordIndex]

  useEffect(() => {
    if (getCurrentWord()) {
      setAnswerOptions(getAnswerOptions())
    }
  }, [currentWordIndex, currentWords])

  const getAnswerOptions = () => {
    if (!getCurrentWord()) return []
    
    const correctAnswer = getCurrentWord().definition
    const otherAnswers = vocabularies
      .filter(vocab => vocab.id !== getCurrentWord().id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(vocab => vocab.definition)
    
    return [...otherAnswers, correctAnswer]
      .sort(() => 0.5 - Math.random())
      .map((answer, index) => ({
        label: ['A', 'B', 'C', 'D'][index],
        text: answer,
        correct: answer === correctAnswer,
        selected: false
      }))
  }

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1)
      playCorrect()
    } else {
      setWrongAnswers([...wrongAnswers, getCurrentWord()])
      playIncorrect()
    }
    
    setTimeout(() => {
      if (currentWordIndex < currentWords.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1)
      } else {
        setQuizFinished(true)
      }
    }, 1000)
  }

  const practiceMissedWords = () => {
    setCurrentWords(wrongAnswers)
    setCurrentWordIndex(0)
    setScore(0)
    setQuizFinished(false)
    setWrongAnswers([])
  }

  if (isLoading) {
    return (
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}  shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 transition-colors duration-200 flex flex-col items-center justify-center`}>
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        <p>Loading quiz...</p>
      </div>
    )
  }

  if (quizFinished) {
    return (
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 transition-colors duration-200`}>
        <h2 className="text-3xl font-bold mb-4">Quiz Finished!</h2>
        <p className="mb-4 text-xl">Your score: {score}/{currentWords.length}</p>
        <div className="flex flex-wrap gap-4">
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            onClick={startNewQuiz}
          >
            Start New Quiz
          </button>
          {wrongAnswers.length > 0 && (
            <button 
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
              onClick={practiceMissedWords}
            >
              Practice Missed Words
            </button>
          )}
        </div>
      </div>
    )
  }

  const currentWord = getCurrentWord()

  if (!currentWord) {
    return (
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 transition-colors duration-200`}>
        <p>No words available. Please start a new quiz.</p>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 mt-4"
          onClick={startNewQuiz}
        >
          Start New Quiz
        </button>
      </div>
    )
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 transition-colors duration-200`}>
      <h2 className="text-3xl font-bold mb-6">{currentWord.word}</h2>
      <div className="space-y-3">
        {answerOptions.map((option, index) => (
          <button 
            key={index}
            className={`flex items-center w-full text-white font-bold py-3 px-4 rounded-lg text-left transition-all duration-200
              ${option.selected && option.correct ? 'bg-green-500 hover:bg-green-700' : ''}
              ${option.selected && !option.correct ? 'bg-red-500 hover:bg-red-700' : ''}
              ${!option.selected ? 'bg-blue-500 hover:bg-blue-700' : ''}
            `}
            onClick={() => {
              if (!answerOptions.some(opt => opt.selected)) {
                handleAnswer(option.correct)
                setAnswerOptions(answerOptions.map(opt => 
                  opt.label === option.label ? {...opt, selected: true} : opt
                ))
              }
            }}
            disabled={answerOptions.some(opt => opt.selected)}
          >
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full border-2 border-white mr-3 mt-1">
      <span className="font-semibold">{option.label}</span>
    </div>
    <span className="flex-grow">{option.text}</span>
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <p className="text-lg font-semibold">Score: {score}/{currentWordIndex + 1}</p>
        <p className="text-lg">Question {currentWordIndex + 1} of {currentWords.length}</p>
      </div>
    </div>
  )
}