import { getCols, getRows } from "../tools/2dData.js";
import { hideZeros } from "../tools/colorTools.js";
import { arrayEquals } from "../tools/compare.js";
import { animateTiles, animations } from "./animation.js";
import { loseCondition, winCondition } from "./endCondition.js";
import { sounds } from "./sounds.js";

let squares = [];
let score = 0;
let scoreDisplay;
let gridDisplay;
export const width = 4;

export const createBoard = function (gridEl, scoreEl) {
  scoreDisplay = scoreEl;
  gridDisplay = gridEl;
  //Loop over 16 and create tiles.
  for (let i = 0; i < width * width; i++) {
    //Create new square element
    const square = document.createElement("div");
    square.classList.add("square");
    //Have square be put on the proper grid locations
    let colStart = (i % 4) + 1;
    let colEnd = (i % 4) + 2;
    let rowStart = Math.ceil((i + 1) / 4);
    let rowEnd = Math.ceil((i + 1) / 4) + 1;
    square.style.gridArea = `${rowStart}/${colStart}/${rowEnd}/${colEnd}`;
    //Populate it with 0's for our logic later.
    square.innerHTML = 0;
    //Append it to our grid div
    gridDisplay.appendChild(square);
    squares.push(square);
  }
  generate();
  generate();
  return { generate, squares, score };
};

//generate a number randomly
export function generate() {
  //Generate a random number from 0 to 16 non-inclusive.
  let randomNumber = Math.floor(Math.random() * squares.length);
  if (squares[randomNumber].innerHTML == 0) {
    let options = [2, 4];
    let randomIndex = Math.round(Math.random());
    squares[randomNumber].style.animation = animations.fadein;
    squares[randomNumber].innerHTML = options[randomIndex];
    hideZeros(squares);
    //Check if player lost
    loseCondition(squares);
  } else generate();
}

//Move functions
//swipe right
export function moveRight(shouldAnimate = false) {
  //Get our rows (They are 4)
  let rows = getRows(squares);
  let isMoved = false;

  //Iterate our rows
  for (let i = 0; i < rows.length; ++i) {
    //Get the filtered row with numbers and the zeros row
    let fandz = filteredAndZeros(rows[i]);
    //Add zeros row before numbers row to make for move right logic.
    let newRow = fandz.zeros.concat(fandz.filtered);
    /*
            - Check if array is moved by:
            - Checking if our new array is the same as the one before
            - The we use the boolean to decide whether to generate or not.
            */
    if (arrayEquals(newRow, rows[i]) === false) {
      isMoved = true;
      if (canCombineDirection("row") === false) {
        sounds.snap.play();
      }
    }

    //Times 4 to help i also represent first square of rows accordingly as pos.
    let pos = i * 4;
    //take the first and the rest of the row squares with arithmetic and add the newrow to them.
    if (shouldAnimate === true) {
      updateTiles([pos, pos + 1, pos + 2, pos + 3], newRow, "right");
    } else {
      updateTiles([pos, pos + 1, pos + 2, pos + 3], newRow, "");
    }
  }
  return isMoved;
}
export function moveLeft(shouldAnimate = false) {
  let rows = getRows(squares);
  let isMoved = false;

  for (let i = 0; i < rows.length; ++i) {
    let fandz = filteredAndZeros(rows[i]);
    //same as right just swap zeros and filtered numbers array.
    let newRow = fandz.filtered.concat(fandz.zeros);
    if (arrayEquals(newRow, rows[i]) === false) {
      isMoved = true;
      if (canCombineDirection("row") === false) {
        sounds.snap.play();
      }
    }

    let pos = i * 4;
    if (shouldAnimate === true) {
      updateTiles([pos, pos + 1, pos + 2, pos + 3], newRow, "left");
    } else {
      updateTiles([pos, pos + 1, pos + 2, pos + 3], newRow, "");
    }
  }
  return isMoved;
}
//almost the same but get columns instead
export function moveDown(shouldAnimate = false) {
  let cols = getCols(squares);
  let isMoved = false;

  for (let i = 0; i < cols.length; ++i) {
    let fAndZ = filteredAndZeros(cols[i]);
    //zeros before numbers give impression of a down move
    let newColumn = fAndZ.zeros.concat(fAndZ.filtered);
    //same as side moves but use width to update the rest of columns instead.
    if (arrayEquals(newColumn, cols[i]) === false) {
      isMoved = true;
      if (canCombineDirection("column") === false) {
        sounds.snap.play();
      }
    }
    let directionAnim = "";
    if (shouldAnimate === true) {
      directionAnim = "down";
    }
    updateTiles(
      [i, i + width, i + width * 2, i + width * 3],
      newColumn,
      directionAnim
    );
  }
  return isMoved;
}
export function moveUp(shouldAnimate = false) {
  let cols = getCols(squares);
  let isMoved = false;

  for (let i = 0; i < cols.length; ++i) {
    let fAndZ = filteredAndZeros(cols[i]);
    //Swap zeros and filtered numbers array.
    let newColumn = fAndZ.filtered.concat(fAndZ.zeros);
    if (arrayEquals(newColumn, cols[i]) === false) {
      isMoved = true;
      if (canCombineDirection("column") === false) {
        sounds.snap.play();
      }
    }
    let directionAnim = "";
    if (shouldAnimate === true) {
      directionAnim = "up";
    }
    updateTiles(
      [i, i + width, i + width * 2, i + width * 3],
      newColumn,
      directionAnim
    );
  }
  return isMoved;
}

//Take a column/row, return number of zeros and filtered. see below
function filteredAndZeros(tilesDir) {
  //Filter array according to if they contain numbers > 0.
  let filteredTiles = tilesDir.filter((num) => num);
  //Find how many zeros there are by subtracting our filtered array length
  //from 4 which is our usual array length.
  let missing = 4 - filteredTiles.length;
  //Create a new array filled with 0's for the number of zeros that exist
  //So we can later put left/right/up/down of filtered array
  //according to the move direction.
  let zeros = Array(missing).fill(0);

  //Return object to process further according to move direction.
  return {
    filtered: filteredTiles,
    zeros: zeros,
  };
}
//Combine functions
//combine the rows
export function combineRow() {
  //Make an array of all the combined values to check for win condition
  let combinedSquares = [];
  let isCombined = false;
  //Loop through 14 as the last square is added by arithmetic index.
  for (let i = 0; i < 15; ++i) {
    //Only combine if the squares are equal
    if (squares[i].innerHTML === squares[i + 1].innerHTML) {
      //when if evaluates, that means we have combined a value
      if (squares[i].innerHTML != 0) {
        isCombined = true;
        sounds.combined.play();
      }
      //Get a variable representing combined value of our 2 identical squares
      let combinedTotal =
        parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
      //update the first tile at index with the total
      updateTile(i, combinedTotal);
      /*
                - update the second tile after it with 0
                - the logic is that after combining, move function is called again
                    so the combined square will be in the correct place afterwards.
                */
      combinedSquares.push(combinedTotal);
      updateTile(i + 1, 0);
      score += combinedTotal;
      scoreDisplay.innerHTML = score;
    }
  }
  //Checking win condition immediately after where you could get 2048
  winCondition(combinedSquares);
  return isCombined;
}
//combine the columns
export function combineColumn() {
  let combinedSquares = [];
  let isCombined = false;
  //Here we loop to the 3rd column as we get the last using arithmetic index.
  for (let i = 0; i < 12; ++i) {
    //For the rest it is the same as combine row.
    if (squares[i].innerHTML === squares[i + width].innerHTML) {
      let combinedTotal =
        parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML);
      if (squares[i].innerHTML != 0) {
        isCombined = true;
        sounds.combined.play();
      }
      updateTile(i, combinedTotal);
      combinedSquares.push(combinedTotal);
      updateTile(i + width, 0);
      score += combinedTotal;
      scoreDisplay.innerHTML = score;
    }
  }
  winCondition(combinedSquares);
  return isCombined;
}

//Update square with indexes (indexold) with a new column/row.
function updateTiles(indexOld, tilesNew, direction) {
  squares[indexOld[0]].innerHTML = tilesNew[0];
  squares[indexOld[1]].innerHTML = tilesNew[1];
  squares[indexOld[2]].innerHTML = tilesNew[2];
  squares[indexOld[3]].innerHTML = tilesNew[3];
  animateTiles(indexOld, direction, squares);
}
//Update only one tile.
function updateTile(indexOld, tileNew) {
  squares[indexOld].innerHTML = tileNew;
}

//see if we can combine
export function canCombine() {
  let rows = getRows(squares);
  let cols = getCols(squares);
  let canCombine = false;

  //if any of the rows has duplicates can combine becomes true
  for (let i = 0; i < rows.length; ++i) {
    if (checkIfDuplicateExists(rows[i])) {
      canCombine = true;
    }
  }
  for (let j = 0; j < cols.length; ++j) {
    if (checkIfDuplicateExists(cols[j])) {
      canCombine = true;
    }
  }
  return canCombine;
}
//check for duplicate by filtering adjacent duplicated and
//cross-checking with length.
function checkIfDuplicateExists(arr) {
  let result = arr.filter((i, idx) => arr[idx - 1] !== i);
  return result.length !== arr.length;
}

function canCombineDirection(direction) {
  let array;
  switch (direction) {
    case "row":
      array = getRows(squares);
      break;
    case "column":
      array = getCols(squares);
      break;
  }
  let canCombine = false;
  //if any of the rows has duplicates can combine becomes true
  for (let i = 0; i < array.length; ++i) {
    let arrayp = array[i].filter((x) => x !== 0);

    if (checkIfDuplicateExists(arrayp)) {
      canCombine = true;
    }
  }
  return canCombine;
}
