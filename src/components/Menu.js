import React from "react";

export default function Menu(props) {
  return (
    <div>
      <h1>Quizzical</h1>
      <button onClick={props.startQuiz}>Start quiz</button>
    </div>
  )
}
