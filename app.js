//Prototype method additions

//Taken from https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
// Warn if overriding existing method
if (Array.prototype.equals)
    console.warn(
        "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."
    );
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array) return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length) return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i])) return false;
        } else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

/*

*/
//Add method to load event
document.addEventListener("DOMContentLoaded", () => {
    const gridDisplay = document.querySelector(".g2048");
    const scoreDisplay = document.querySelector("#score");
    const resultDisplay = document.querySelector(".message");
    const docStyle = getComputedStyle(document.documentElement);
    let textColorVar = docStyle.getPropertyValue("--text-color");
    const width = 4;
    let squares = [];
    let score = 0;

    //Create a playing board
    function createBoard() {
        //Loop over 16 and create tiles.
        for (let i = 0; i < width * width; i++) {
            //Create new square element
            let square = document.createElement("div");
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
    }
    createBoard();

    //Tool functions
    /*

    */
    //Function to hide the zeros in our board and unhide the new numbers.
    //called in our generete()
    function hideZeros() {
        for (let i = 0; i < 16; ++i) {
            //Find the value of innerhtml of square
            let valueInner = parseInt(squares[i].innerHTML);
            if (valueInner === 0) {
                squares[i].style.color = "white";
                squares[i].style.backgroundColor = "white";
            } else if (valueInner > 0) {
                //If number set to black.
                let colors = setColor(valueInner);
                squares[i].style.color = colors.txt;
                squares[i].style.backgroundColor = colors.bg;
            }
        }
    }
    //set color of square according to number
    function setColor(value) {
        let colorBg = "";
        let textColor = "black";
        // from 29 to 4
        let hue = 35;
        let saturation = 100;
        //4/4 4/8 * hue
        if (value === 2) {
            colorBg = "white";
        } else if (value > 2) {
            colorBg = `hsl(${
                hue - Math.ceil(Math.log(value) * 3)
            }, ${saturation}%, 52%)`;
            textColor = "white";
        }
        return { bg: colorBg, txt: textColor };
    }

    //generate a number randomly
    function generate() {
        //Generate a random number from 0 to 16 non-inclusive.
        randomNumber = Math.floor(Math.random() * squares.length);
        if (squares[randomNumber].innerHTML == 0) {
            squares[randomNumber].innerHTML = 2;
            hideZeros();
            //Check if player lost
            loseCondition();
        } else generate();
    }

    //Update square with indexes (indexold) with a new column/row.
    function updateTiles(indexOld, tilesNew) {
        squares[indexOld[0]].innerHTML = tilesNew[0];
        squares[indexOld[1]].innerHTML = tilesNew[1];
        squares[indexOld[2]].innerHTML = tilesNew[2];
        squares[indexOld[3]].innerHTML = tilesNew[3];
    }
    //Update only one tile.
    function updateTile(indexOld, tileNew) {
        squares[indexOld].innerHTML = tileNew;
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

    //Row and column parser
    /*

    */
    //get the rows by having the expression on the first tile only.
    function getRows() {
        //Rows array to push every one of 4 rows to.
        let rows = [];

        //iterate over all squares
        for (let i = 0; i < 16; ++i) {
            /*
            - We need only the first column index
            - Then only add index by one to get the rest of the row
            */
            if (i % 4 === 0) {
                let valueOne = squares[i].innerHTML;
                let valueTwo = squares[i + 1].innerHTML;
                let valueThree = squares[i + 2].innerHTML;
                let valueFour = squares[i + 3].innerHTML;
                //Have the row member as int for logic.
                let row = [
                    parseInt(valueOne),
                    parseInt(valueTwo),
                    parseInt(valueThree),
                    parseInt(valueFour),
                ];
                rows.push(row);
            }
        }
        return rows;
    }
    //Same as getRows() but here we only take the first row and get the rest of column with width.
    function getCols() {
        let cols = [];

        for (let i = 0; i < 4; ++i) {
            let valueOne = squares[i].innerHTML;
            let valueTwo = squares[i + width].innerHTML;
            let valueThree = squares[i + width * 2].innerHTML;
            let valueFour = squares[i + width * 3].innerHTML;
            let column = [
                parseInt(valueOne),
                parseInt(valueTwo),
                parseInt(valueThree),
                parseInt(valueFour),
            ];
            cols.push(column);
        }
        return cols;
    }

    //Move functions
    /*

    */
    //swipe right
    function moveRight() {
        //Get our rows (They are 4)
        let rows = getRows();
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
            if (newRow.equals(rows[i]) === false) {
                isMoved = true;
            }

            //Times 4 to help i also represent first square of rows accordingly as pos.
            let pos = i * 4;
            //take the first and the rest of the row squares with arithmetic and add the newrow to them.
            updateTiles([pos, pos + 1, pos + 2, pos + 3], newRow);
        }
        return isMoved;
    }
    function moveLeft() {
        let rows = getRows();
        let isMoved = false;

        for (let i = 0; i < rows.length; ++i) {
            let fandz = filteredAndZeros(rows[i]);
            //same as right just swap zeros and filtered numbers array.
            let newRow = fandz.filtered.concat(fandz.zeros);
            if (newRow.equals(rows[i]) === false) {
                isMoved = true;
            }

            let pos = i * 4;
            updateTiles([pos, pos + 1, pos + 2, pos + 3], newRow);
        }
        return isMoved;
    }
    //almost the same but get columns instead
    function moveDown() {
        let cols = getCols();
        let isMoved = false;

        for (let i = 0; i < cols.length; ++i) {
            let fAndZ = filteredAndZeros(cols[i]);
            //zeros before numbers give impression of a down move
            let newColumn = fAndZ.zeros.concat(fAndZ.filtered);
            //same as side moves but use width to update the rest of columns instead.
            if (newColumn.equals(cols[i]) === false) {
                isMoved = true;
            }
            updateTiles(
                [i, i + width, i + width * 2, i + width * 3],
                newColumn
            );
        }
        return isMoved;
    }
    function moveUp() {
        let cols = getCols();
        let isMoved = false;

        for (let i = 0; i < cols.length; ++i) {
            let fAndZ = filteredAndZeros(cols[i]);
            //Swap zeros and filtered numbers array.
            let newColumn = fAndZ.filtered.concat(fAndZ.zeros);
            if (newColumn.equals(cols[i]) === false) {
                isMoved = true;
            }
            updateTiles(
                [i, i + width, i + width * 2, i + width * 3],
                newColumn
            );
        }
        return isMoved;
    }

    //Combine functions
    /*

    */
    //combine the rows
    function combineRow() {
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
                }
                //Get a variable representing combined value of our 2 identical squares
                let combinedTotal =
                    parseInt(squares[i].innerHTML) +
                    parseInt(squares[i + 1].innerHTML);
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
    function combineColumn() {
        let combinedSquares = [];
        let isCombined = false;
        //Here we loop to the 3rd column as we get the last using arithmetic index.
        for (let i = 0; i < 12; ++i) {
            //For the rest it is the same as combine row.
            if (squares[i].innerHTML === squares[i + width].innerHTML) {
                if (squares[i].innerHTML != 0) {
                    isCombined = true;
                }
                let combinedTotal =
                    parseInt(squares[i].innerHTML) +
                    parseInt(squares[i + width].innerHTML);
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

    //Win Logic
    /*

    */
    //check for the number 2048
    function winCondition(combinedArray) {
        //Check all squares that we combined.
        for (let i = 0; i < combinedArray.length; ++i) {
            if (combinedArray[i] === 2048) {
                resultDisplay.innerHTML = "You Win!";
                resultDisplay.style.opacity = "0.8";
                resultDisplay.style.width = "80%";
                resultDisplay.style.height = "80%";
                document.removeEventListener("keyup", control);
            }
        }
    }
    //check for game over
    function loseCondition() {
        //Create array of innerhtml's in squares
        let inners = squares.map((x) => x.innerHTML);
        //Check if all of those inners don't have 0.
        if (inners.includes("0") === false) {
            resultDisplay.innerHTML = "You Lose!";
            //Display our message block.
            resultDisplay.style.display = "flex";
            //take away event listener to stop playing the game.
            document.removeEventListener("keyup", control);
        }
    }

    //Key event handling
    /*

    */
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
    //Add keyup event listener linked to control method.
    document.addEventListener("keyup", control);

    //Key functions
    /*

    */
    function keyRight() {
        //Move right first to get alike number next to one another
        //Combine alike numbers
        let [isMoved, isCombined] = [moveRight(), combineRow()];
        console.log(isMoved, isCombined);
        //Set them in the correct spot
        moveRight();
        // generate one new number.
        // IF our array is moved on first move function
        if (isMoved === true || isCombined === true) {
            generate();
        }
    }
    function keyLeft() {
        let [isMoved, isCombined] = [moveLeft(), combineRow()];
        moveLeft();
        if (isMoved === true || isCombined === true) {
            generate();
        }
    }
    function keyUp() {
        let [isMoved, isCombined] = [moveUp(), combineColumn()];
        moveUp();
        if (isMoved === true || isCombined === true) {
            generate();
        }
    }
    function keyDown() {
        let [isMoved, isCombined] = [moveDown(), combineColumn()];
        moveDown();
        if (isMoved === true || isCombined === true) {
            generate();
        }
    }
});
