//Function to hide the zeros in our board and unhide the new numbers.
//called in our generete()
export const hideZeros = function (elements) {
  for (let i = 0; i < elements.length; ++i) {
    //Find the value of innerhtml of square
    let valueInner = parseInt(elements[i].innerHTML);
    if (valueInner === 0) {
      elements[i].style.color = "white";
      elements[i].style.backgroundColor = "white";
    } else if (valueInner > 0) {
      //If number set to black.
      let colors = setColor(valueInner);
      elements[i].style.color = colors.txt;
      elements[i].style.backgroundColor = colors.bg;
    }
  }
};

//set color of square according to number
function setColor(value) {
  let colorBg = "";
  let textColor = "black";
  // from 29 to 4
  const hue = 35;
  const saturation = 100;
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
