//Key event handling
/*

    */

import {
  combineColumn,
  combineRow,
  generate,
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
} from "./board.js";
import { sounds } from "./sounds.js";

//assign keys
function control(e) {
  //Key codes found through key code info.
  switch (e.keyCode) {
    case 37:
      keyLeft();
      break;
    case 38:
      keyUp();
      break;
    case 39:
      keyRight();
      break;
    case 40:
      keyDown();
      break;
    default:
      break;
  }
}

//Touch functionality
/*
 */
//Register our x and y location
let xDown = null;
let yDown = null;

function getTouches(e) {
  return e.touches;
}
//Called when touch is started
function handleTouchStart(e) {
  //register touch begin in the earlier declared variables
  const touchBegin = getTouches(e)[0];
  xDown = touchBegin.clientX;
  yDown = touchBegin.clientY;
}

function handleTouchMove(e) {
  //If any of the touches are null, return, fail safe.
  if (!xDown || !yDown) {
    return;
  }
  //register location after move
  let xUp = e.touches[0].clientX;
  let yUp = e.touches[0].clientY;

  //Take out the difference of the locations
  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;

  //Determine with negatives the difference in x or y
  //to determine horizontal or vertical direction
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    //After determining horizontal, positive x is left
    if (xDiff > 0) {
      keyLeft();
    } else {
      //negative x is right
      keyRight();
    }
  } else {
    //after determining vertical
    //positive y is up
    if (yDiff > 0) {
      keyUp();
    } else {
      //negative y is down.
      keyDown();
    }
  }
  //reset to be able to register changes correctly again.
  xDown = null;
  yDown = null;
}

export const setupEvents = () => {
  //Add keyup event listener linked to control method.
  document.addEventListener("keyup", control);
  //Connect our events to the functions while making sure bubble propagation.
  document.addEventListener("touchstart", handleTouchStart, false);
  document.addEventListener("touchmove", handleTouchMove, false);
};

export const clearEvents = () => {
  //Add keyup event listener linked to control method.
  document.removeEventListener("keyup", control);
  //Connect our events to the functions while making sure bubble propagation.
  document.removeEventListener("touchstart", handleTouchStart, false);
  document.removeEventListener("touchmove", handleTouchMove, false);
};

//Key functions
function keyRight() {
  //Move right first to get alike number next to one another
  //Combine alike numbers
  let [isMoved, isCombined] = [moveRight(), combineRow()];
  //Set them in the correct spot
  moveRight(true);
  // generate one new number.
  // IF our array is moved on first move function
  if (isMoved === true || isCombined === true) {
    generate();
  } else {
    sounds.blocked.play();
  }
}
function keyLeft() {
  let [isMoved, isCombined] = [moveLeft(), combineRow()];
  moveLeft(true);
  if (isMoved === true || isCombined === true) {
    generate();
  } else {
    sounds.blocked.play();
  }
}
function keyUp() {
  let [isMoved, isCombined] = [moveUp(), combineColumn()];
  moveUp(true);
  if (isMoved === true || isCombined === true) {
    generate();
  } else {
    sounds.blocked.play();
  }
}
function keyDown() {
  let [isMoved, isCombined] = [moveDown(), combineColumn()];
  moveDown(true);
  if (isMoved === true || isCombined === true) {
    generate();
  } else {
    sounds.blocked.play();
  }
}
