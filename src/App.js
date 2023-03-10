import './App.css';
import React, {useState, useEffect} from 'react';

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

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=5&type=multiple')
    .then((response) => response.json())
    .then((data) => setAllQuestions(data.results));
    setIsShuffled(false)
  }, [])

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
    if (answer === allQuestions[currentQuestion].correct_answer) {
      setSelectedAnswer(true)
    } else {
      setSelectedAnswer(false)
    }
  }

  function next() {
    setSelectedAnswerIndex(null)

    setResult((prev) => selectedAnswer ?
    {
      ...prev, correctAnswers: prev.correctAnswers + 1
    }
    :
    {...prev, wrongAnswers: prev.wrongAnswers + 1})

    if (currentQuestion !== allQuestions.length - 1) {
      setCurrentQuestion(prevValue => prevValue + 1)
      setIsShuffled(false)
    }else {
      setShowResult(true)
    }
  }

  function addZero(number) {
    return `0${number}`
  }

  function reset() {
    window.location.reload()
  }

  if ( quizStart && !isShuffled) {
    setShuffledAnswers(shuffle(allQuestions[currentQuestion].incorrect_answers.concat(allQuestions[currentQuestion].correct_answer)))
    setIsShuffled(true)
  }


  return (
    <div className="App">
      {!quizStart && (
        <div className='quiz-start'>
          <div className='quiz-start-under'>
            <h1>Quiz</h1>
            <button onClick={() => setQuizStart(true)}>Start</button>
          </div>
        </div>
      )}
    { quizStart && !showResult &&  (
      <div className='body-container'>
        <div className='main-container'>
          <div className='question-number'>
            <span>{addZero(currentQuestion + 1)}</span>
            <span>/</span>
            <span>{addZero(allQuestions.length)}</span>
          </div>
          <div className='questions-answers'>
            <h2>{htmlDecode(allQuestions[currentQuestion].question)}</h2>
            <div className='answers'>
              {shuffledAnswers.map((answer, index) => (
                <p key={answer} onClick={() => onSelect(answer, index)} className={selectedAnswerIndex === index ? "selected-answer answer" : "answer"}>{htmlDecode(answer)}</p>
              ))}
            </div>
            </div>
          <button disabled={selectedAnswerIndex === null ? "disabled" : ""} onClick={next}>{currentQuestion === allQuestions.length -1 ? "Finish" : "Next"}</button>
        </div>
      </div>
    )}
    {showResult && (
      <div className='body-container'>
        <div className='main-container'>
          <div className='answers-results'>
            <p>Correct Answers: {result.correctAnswers}</p>
            <p>Wrong Answers: {result.wrongAnswers}</p>
          </div>

            {allQuestions.map(question =>(
              <div className='answers-card'>
                <p className='answer-question'>{htmlDecode(question.question)}</p>
                <p className='answer-answer'>{htmlDecode(question.correct_answer)}</p>
              </div>
            ))}

          <button onClick={reset}>Reset</button>
        </div>
      </div>
    )}
    </div>
  );
}

export default App;
