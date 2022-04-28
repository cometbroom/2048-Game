//Row and column parser

import { width } from "../components/board.js";

//get the rows by having the expression on the first tile only.
export function getRows(squares) {
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
export function getCols(squares) {
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
