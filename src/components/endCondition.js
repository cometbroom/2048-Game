import { canCombine } from "./board.js";
import { clearEvents } from "./controls.js";

const resultDisplay = document.querySelector(".message");

//check for the number 2048
export const winCondition = function (combinedArray) {
  //Check all squares that we combined.
  for (let i = 0; i < combinedArray.length; ++i) {
    if (combinedArray[i] === 2048) {
      messageBoxAppear("You WIN!");
      clearEvents();
    }
  }
};
//check for game over
export const loseCondition = function (squares) {
  //Create array of innerhtml's in squares
  let inners = squares.map((x) => x.innerHTML);
  //Check if all of those inners don't have 0.
  if (inners.includes("0") === false && canCombine() === false) {
    messageBoxAppear("You LOSE!");
    //take away event listener to stop playing the game.
    clearEvents();
  }
};

function messageBoxAppear(msg) {
  resultDisplay.innerHTML = msg;
  resultDisplay.style.opacity = "0.8";
  resultDisplay.style.width = "80%";
  resultDisplay.style.height = "80%";
}
