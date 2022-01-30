document.addEventListener("DOMContentLoaded", () => {
    const gridDisplay = document.querySelector(".g2048");
    const scoreDisplay = document.querySelector("#score");
    const resultDisplay = document.querySelector(".message");
    const width = 4;
    let squares = [];
    let score = 0;

    //Create a playing board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            let square = document.createElement("div");
            square.classList.add("square");
            let j = i + 1;
            let colStart = (i % 4) + 1;
            let colEnd = (i % 4) + 2;
            let rowStart = Math.ceil((i + 1) / 4);
            let rowEnd = Math.ceil((i + 1) / 4) + 1;
            square.style.gridArea = `${rowStart}/${colStart}/${rowEnd}/${colEnd}`;
            square.innerHTML = 0;

            gridDisplay.appendChild(square);
            squares.push(square);
        }
        generate();
        generate();
    }
    createBoard();

    function hideZeros() {
        for (let i = 0; i < 16; ++i) {
            let valueInner = parseInt(squares[i].innerHTML);
            if (valueInner === 0) {
                squares[i].style.color = "white";
            } else if (valueInner > 0) {
                squares[i].style.color = "black";
            }
        }
    }

    //generate a number randomly
    function generate() {
        randomNumber = Math.floor(Math.random() * squares.length);
        if (squares[randomNumber].innerHTML == 0) {
            squares[randomNumber].innerHTML = 2;
            hideZeros();
            loseCondition();
        } else generate();
    }

    function updateTiles(indexOld, tilesNew) {
        squares[indexOld[0]].innerHTML = tilesNew[0];
        squares[indexOld[1]].innerHTML = tilesNew[1];
        squares[indexOld[2]].innerHTML = tilesNew[2];
        squares[indexOld[3]].innerHTML = tilesNew[3];
    }
    function updateTile(indexOld, tileNew) {
        squares[indexOld].innerHTML = tileNew;
    }

    function filteredAndZeros(tilesDir) {
        let filteredTiles = tilesDir.filter((num) => num);
        let missing = 4 - filteredTiles.length;
        let zeros = Array(missing).fill(0);

        return {
            filtered: filteredTiles,
            zeros: zeros,
        };
    }

    //get the rows by having the expression on the first tile only.
    function getRows() {
        let rows = [];

        for (let i = 0; i < 16; ++i) {
            if (i % 4 === 0) {
                let valueOne = squares[i].innerHTML;
                let valueTwo = squares[i + 1].innerHTML;
                let valueThree = squares[i + 2].innerHTML;
                let valueFour = squares[i + 3].innerHTML;
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

    //swipe right
    function moveRight() {
        let rows = getRows();

        for (let i = 0; i < rows.length; ++i) {
            let filteredRow = rows[i].filter((num) => num);
            let missing = 4 - filteredRow.length;
            let zeros = Array(missing).fill(0);
            let newRow = zeros.concat(filteredRow);

            let pos = i * 4;
            squares[pos].innerHTML = newRow[0];
            squares[pos + 1].innerHTML = newRow[1];
            squares[pos + 2].innerHTML = newRow[2];
            squares[pos + 3].innerHTML = newRow[3];
        }
    }
    function moveLeft() {
        let rows = getRows();

        for (let i = 0; i < rows.length; ++i) {
            let filteredRow = rows[i].filter((num) => num);
            let missing = 4 - filteredRow.length;
            let zeros = Array(missing).fill(0);
            let newRow = filteredRow.concat(zeros);

            let pos = i * 4;
            squares[pos].innerHTML = newRow[0];
            squares[pos + 1].innerHTML = newRow[1];
            squares[pos + 2].innerHTML = newRow[2];
            squares[pos + 3].innerHTML = newRow[3];
        }
    }
    function moveDown() {
        let cols = getCols();

        for (let i = 0; i < cols.length; ++i) {
            let fAndZ = filteredAndZeros(cols[i]);
            let newColumn = fAndZ.zeros.concat(fAndZ.filtered);
            updateTiles(
                [i, i + width, i + width * 2, i + width * 3],
                newColumn
            );
        }
    }
    function moveUp() {
        let cols = getCols();

        for (let i = 0; i < cols.length; ++i) {
            let fAndZ = filteredAndZeros(cols[i]);
            let newColumn = fAndZ.filtered.concat(fAndZ.zeros);
            updateTiles(
                [i, i + width, i + width * 2, i + width * 3],
                newColumn
            );
        }
    }

    //Combine functions

    //combine the rows
    function combineRow() {
        for (let i = 0; i < 15; ++i) {
            if (squares[i].innerHTML === squares[i + 1].innerHTML) {
                let combinedTotal =
                    parseInt(squares[i].innerHTML) +
                    parseInt(squares[i + 1].innerHTML);
                updateTile(i, combinedTotal);
                updateTile(i + 1, 0);
                score += combinedTotal;
                scoreDisplay.innerHTML = score;
            }
        }
        winCondition();
    }
    //combine the columns
    function combineColumn() {
        for (let i = 0; i < 12; ++i) {
            if (squares[i].innerHTML === squares[i + width].innerHTML) {
                let combinedTotal =
                    parseInt(squares[i].innerHTML) +
                    parseInt(squares[i + width].innerHTML);
                updateTile(i, combinedTotal);
                updateTile(i + width, 0);
                score += combinedTotal;
                scoreDisplay.innerHTML = score;
            }
        }
        winCondition();
    }

    //assign keys
    function control(e) {
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

    //Logic
    //check for the number 2048
    function winCondition() {
        for (let i = 0; i < squares.length; ++i) {
            if (squares[i].innerHTML == 2048) {
                resultDisplay.innerHTML = "You Win!";
                resultDisplay.style.display = "flex";
                document.removeEventListener("keyup", control);
            }
        }
    }
    //check for game over
    function loseCondition() {
        let inners = squares.map((x) => x.innerHTML);
        if (inners.includes("0") === false) {
            resultDisplay.innerHTML = "You Lose!";
            resultDisplay.style.display = "flex";
            document.removeEventListener("keyup", control);
        }
    }

    //Events
    document.addEventListener("keyup", control);

    function keyRight() {
        moveRight();
        combineRow();
        moveRight();
        generate();
    }
    function keyLeft() {
        moveLeft();
        combineRow();
        moveLeft();
        generate();
    }
    function keyUp() {
        moveUp();
        combineColumn();
        moveUp();
        generate();
    }
    function keyDown() {
        moveDown();
        combineColumn();
        moveDown();
        generate();
    }
});
