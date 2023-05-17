import { useState, useEffect } from "react";
import "./App.css";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti/";

function App() {
  const [dice, setDice] = useState(generateDice());
  const [tenzies, setTenzies] = useState(false);
  const [rolls, setRolls] = useState(0);
  const [bestScore, setBestScore] = useState(
    () => localStorage.getItem("bestScore") || Infinity
  );
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  function generateDie() {
    return { value: Math.ceil(Math.random() * 6), isHeld: false, id: nanoid() };
  }

  function generateDice() {
    const diceArr = [];
    for (let i = 0; i < 10; i += 1) diceArr.push(generateDie());
    return diceArr;
  }

  const rollDice = () => {
    if (tenzies) {
      setTenzies(false);
      setDice(generateDice());
      setRolls(0);
    } else {
      setDice((prevState) =>
        prevState.map((die) => {
          return die.isHeld ? die : generateDie();
        })
      );
      setRolls((prevState) => prevState + 1);
    }
  };

  const holdDie = (dieID) =>
    setDice((prevState) =>
      prevState.map((die) => {
        return die.id === dieID ? { ...die, isHeld: !die.isHeld } : die;
      })
    );

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDie={() => holdDie(die.id)}
    />
  ));

  function checkWinCondition() {
    const result = dice.every((item) => {
      if (item.value === dice[0].value && item.isHeld) return true;
    });
    return result;
  }

  useEffect(() => {
    if (checkWinCondition()) setTenzies(true);
  }, [dice]);

  useEffect(() => {
    if (rolls > 0 && rolls < bestScore) {
      localStorage.setItem("bestScore", rolls);
      setBestScore(localStorage.getItem("bestScore"));
    }
  }, [tenzies]);

  useEffect(() => {
    const getWindowSize = () =>
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    window.addEventListener("resize", getWindowSize);
    return () => window.removeEventListener("resize", getWindowSize);
  }, []);

  return (
    <>
      {tenzies && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      <div className="rolls">
        <h3>
          Rolls: <span>{rolls}</span>
        </h3>
        <h3>
          Best Score: <span>{bestScore}</span>
        </h3>
      </div>
    </>
  );
}

export default App;
