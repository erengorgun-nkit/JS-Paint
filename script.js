const inputColor = document.querySelector("#color");
const inputBgColor = document.querySelector("#bgcolor");
const btnEraser = document.querySelector("#btn-eraser");
const btnRainbow = document.querySelector("#btn-rainbow");
const btnShading = document.querySelector("#btn-shading");
const btnLighten = document.querySelector("#btn-lighten");
const btnEyeDropper = document.querySelector("#btn-eyedropper");
const rangeCanvasSize = document.querySelector("#canvas-size");
const txtRangeValue = document.querySelector("#range-value");
const btnClear = document.querySelector("#btn-clear");
const btnExport = document.querySelector("#btn-export");
const btnGrid = document.querySelector("#grid-toggle");
const canvas = document.querySelector(".canvas");

newCanvas();

// generate new canvas
function newCanvas() {
    canvas.innerHTML = "";
    for (let i = 0; i < rangeCanvasSize.value ** 2; i++) {
        let pixel = document.createElement("div");
        pixel.classList.add("pixel");
        pixel.style.width = `${100 / rangeCanvasSize.value}%`;
        pixel.style.border = "1px solid rgb(144, 159, 173)";
        canvas.appendChild(pixel);
        changeBgColor();
    }
    txtRangeValue.textContent =
        `${rangeCanvasSize.value}x${rangeCanvasSize.value}`;
}

// set canvas size
rangeCanvasSize.addEventListener("input", () => {
    newCanvas();
});

// toogle grid lines
let gridState = true;
btnGrid.addEventListener("click", () => {
    if (gridState == true) {
        for (let i = 0; i < canvas.children.length; i++) {
            canvas.children[i].style.border = "none";
        }
        gridState = false;
    }
    else {
        for (let i = 0; i < canvas.children.length; i++) {
            canvas.children[i].style.border = "1px solid rgb(218, 224, 230)";
        }
        gridState = true;
    }
});

// change background color
function changeBgColor() {
    for (let i = 0; i < canvas.children.length; i++) {
        let pixel = canvas.children[i];
        if (pixel.id != "brushed") {
            pixel.style.backgroundColor = inputBgColor.value;
        }
    }
}

inputBgColor.addEventListener("input", () => {
    changeBgColor();
});