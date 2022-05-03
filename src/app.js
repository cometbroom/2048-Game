import { createBoard } from "./components/board.js";
import { setupEvents } from "./components/controls.js";

/*

*/
//Add method to load event
document.addEventListener("DOMContentLoaded", () => {
  const gridDisplay = document.querySelector(".g2048");
  const scoreDisplay = document.querySelector("#score");

  //Create a playing board
  createBoard(gridDisplay, scoreDisplay);
  setupEvents();
});
