import { sleep } from "../tools/time.js";

export const animations = {
  fadein: "fadeIn 0.3s forwards",
};

export async function animateTiles(indexOld, direction, squares) {
  if (direction === "") {
    return;
  }
  let selectArray = [];
  switch (direction) {
    case "up":
      selectArray = [1, 2, 3];
      break;
    case "down":
      selectArray = [0, 1, 2];
      break;
    case "left":
      selectArray = [1, 2, 3];
      break;
    case "right":
      selectArray = [0, 1, 2];
      break;
  }
  squares[
    indexOld[selectArray[0]]
  ].style.animation = `move${direction} 0.2s forwards`;
  squares[
    indexOld[selectArray[1]]
  ].style.animation = `move${direction} 0.2s forwards`;
  squares[
    indexOld[selectArray[2]]
  ].style.animation = `move${direction} 0.2s forwards`;
  await sleep(200).then(() => {
    squares[indexOld[selectArray[0]]].style.animation = "none";
    squares[indexOld[selectArray[1]]].style.animation = "none";
    squares[indexOld[selectArray[2]]].style.animation = "none";
  });
}
