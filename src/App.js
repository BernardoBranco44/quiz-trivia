import './App.css';
import React, {useState, useEffect} from 'react';
import Menu from "./components/Menu"
import Question from "./components/Question"
import { nanoid } from 'nanoid'


function App() {
  const [quizStart, setQuizStart] = useState(false)
  const [allQuestions, setAllQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState()
  const [result, setResult] = useState({
    correctAnswers: 0,
    wrongAnswers: 0
  })
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null)
  const [isShuffled, setIsShuffled] = useState(false)
  const [shuffledAnswers, setShuffledAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)

  console.log(allQuestions)


  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=5&type=multiple')
    .then((response) => response.json())
    .then((data) => setAllQuestions(data.results));
    console.log("fire")
  }, [showResult])

  // useEffect(() => {
  //   setShuffled(shuffle(allQuestions[currentQuestion].incorrect_answers.concat(allQuestions[currentQuestion].correct_answer)))
  // }, [allQuestions])

  function htmlDecode(input) {
    let doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }

  function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
      }
      return array
  }

  function onSelect(answer, index) {
    setSelectedAnswerIndex(index)
    if (answer === currentQuestion.correct_answer) {
      setSelectedAnswer(true)
    } else {
      setSelectedAnswer(false)
    }
  }

  function next() {
    setSelectedAnswerIndex(null)
    setIsShuffled(false)

    setResult((prev) => selectedAnswer ?
    {
      ...prev, correctAnswers: prev.correctAnswers + 1
    }
    :
    {...prev, wrongAnswers: prev.wrongAnswers + 1})
    if (currentQuestion !== allQuestions.length - 1) {
      setCurrentQuestion(prevValue => prevValue + 1)
    }else {
      setCurrentQuestion(0)
      setShowResult(true)
    }
  }

  function addZero(number) {
    return `0${number}`
  }

  function reset() {
    setShowResult(false)
    setResult({
      correctAnswers: 0,
      wrongAnswers: 0
    })
  }


  if ( quizStart && !isShuffled) {
    setShuffledAnswers(shuffle(allQuestions[currentQuestion].incorrect_answers.concat(allQuestions[currentQuestion].correct_answer)))
    setIsShuffled(true)
  }


  return (
    <div className="App">
      {!quizStart && (
        <div>
          <h1>Quiz</h1>
          <button onClick={() => setQuizStart(true)}>Start</button>
          </div>
      )}
    { quizStart && !showResult &&  (
      <div>
        <span>{addZero(currentQuestion + 1)}</span>
        <span>/</span>
        <span>{addZero(allQuestions.length)}</span>
      <h2>{htmlDecode(allQuestions[currentQuestion].question)}</h2>
      <ul>
        {shuffledAnswers.map((answer, index) => (
          <li key={answer} onClick={() => onSelect(answer, index)} className={selectedAnswerIndex === index ? "selected-answer" : ""}>{htmlDecode(answer)}</li>
        ))}
      </ul>
      <button disabled={selectedAnswerIndex === null ? "disabled" : ""} onClick={next}>{currentQuestion === allQuestions.length -1 ? "Finish" : "Next"}</button>
    </div>
    )}
    {showResult && (
      <div>
        <p>Correct Answers: {result.correctAnswers}</p>
        <p>Wrong Answers: {result.wrongAnswers}</p>
        <button onClick={reset}>Reset</button>
      </div>
    )}
    </div>
  );
}

export default App;
