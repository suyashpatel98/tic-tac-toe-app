import React, { useState } from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import "./index.css";

function Square({ value, onClick }) {

  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}


function Restart({ onClick }) {

  return (
    <button className="restart" onClick={onClick}>
      Play again
    </button>
  );
}

function Game() {
  const [ squares, setSquares ] = useState(Array(9).fill(null));
  const [ isXNext, setIsXNext ] = useState(false);
  const winner = calculateWinner(squares);


  function renderRestartButton() {
    return (
      <Restart
        onClick={() => {
          setSquares(Array(9).fill(null));
          setIsXNext(false);
        }}
      />
    );
  }

  function getStatus() {
    if (winner) {
      return "Winner: " + winner;
    } else if (isBoardFull(squares)) {
      return "Draw!";
    } else {
      return "Next player: " + (isXNext ? "X" : "O");
    }
  }


  function renderSquare(i) {
    return <Square
      value={squares[i]}
      onClick={() => {
        if (squares[i] != null || winner != null) {
          return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = isXNext ? "X" : "O";
        setSquares(nextSquares);
        var isBoardFull = true;
        for (var j = 0; j < nextSquares.length; j++) {
          if(nextSquares[j] == null) isBoardFull = false
        }
        if(isBoardFull) return;
        if (winner == null) {
          axios.post(`http://localhost:8080/state`, { "data" : nextSquares })
            .then(res => {
              const nextSquares = squares.slice();
              for (var i = 0; i < nextSquares.length; i++) {
                if (res.data[i] != null) {
                  nextSquares[i] = res.data[i];
                }
              }
              setSquares(nextSquares);
            })
        }
      }}
      />;
  }

  return (
    <div className="container">
      <div className="game">
        <div className="game-board">
          <div className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
        </div>
        <div className="game-info">{getStatus()}</div>
        <div className="restart-button">{renderRestartButton()}</div>
      </div>
    </div>
  );
}

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const possibleLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  // go over all possibly winning lines and check if they consist of only X's/only O's
  for (let i = 0; i < possibleLines.length; i++) {
    const [a, b, c] = possibleLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isBoardFull(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] == null) {
      return false;
    }
  }
  return true;
}
