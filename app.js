document.addEventListener("DOMContentLoaded", () => {
    const gridDisplay = document.querySelector(".g2048");
    const scoreDisplay = document.querySelector("#score");
    const resultDisplay = document.querySelector("#result");
    const width = 4;
    let squares = [];

    //Create a playing board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.innerHTML = 0;
            gridDisplay.appendChild(square);
            squares.push(square);
        }
        generate();
        generate();
        moveLeft();
    }
    createBoard();

    //generate a number randomly
    function generate() {
        randomNumber = Math.floor(Math.random() * squares.length);
        if (squares[randomNumber].innerHTML == 0) {
            squares[randomNumber].innerHTML = 2;
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

    function combineRow() {
        for (let i = 0; i < 15; ++i) {
            if (squares[i].innerHTML === squares[i + 1].innerHTML) {
                let combinedTotal =
                    parseInt(squares[i].innerHTML) +
                    parseInt(squares[i + 1].innerHTML);
                updateTile(i, combinedTotal);
                updateTile(i + 1, 0);
            }
        }
    }
    function combineColumn() {
        for (let i = 0; i < 12; ++i) {
            if (squares[i].innerHTML === squares[i + width].innerHTML) {
                let combinedTotal =
                    parseInt(squares[i].innerHTML) +
                    parseInt(squares[i + width].innerHTML);
                updateTile(i, combinedTotal);
                updateTile(i + width, 0);
            }
        }
    }

    //assign keys
    function contorl(e) {
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


    //Events
    document.addEventListener("keyup", contorl);

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
