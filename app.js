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
    function combineRow() {
        for (let i = 0; i < 15; ++i) {
            let [leftSquare, rightSquare] = [
                squares[i].innerHTML,
                squares[i + 1].innerHTML,
            ];
            if (leftSquare === rightSquare) {
                let combinedTotal =
                    parseInt(leftSquare) + parseInt(rightSquare);
                squares[i].innerHTML = combinedTotal;
                squares[i + 1].innerHTML = 0;
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
});
