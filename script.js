const inputColor = document.querySelector("#color");
const inputBgColor = document.querySelector("#bgcolor");
const btnEraser = document.querySelector("#btn-eraser");
const btnRainbow = document.querySelector("#btn-rainbow");
const btnShading = document.querySelector("#btn-shading");
const btnLighten = document.querySelector("#btn-lighten");
const btnEyeDropper = document.querySelector("#btn-eyedropper");
const rangeCanvasSize = document.querySelector("#canvas-size");
const btnRangeValue = document.querySelector("#range-value");
const btnClear = document.querySelector("#btn-clear");
const btnExport = document.querySelector("#btn-export");
const btnGrid = document.querySelector("#grid-toggle");
const canvas = document.querySelector(".canvas");
const tools = document.querySelector(".tools");
const body = document.querySelector("body");

newCanvas();
btnRangeValue.textContent = `${rangeCanvasSize.value}x${rangeCanvasSize.value}`;

// generate new canvas
function newCanvas() {
    canvas.innerHTML = "";
    for (let i = 0; i < rangeCanvasSize.value ** 2; i++) {
        let pixel = document.createElement("div");
        pixel.classList.add("pixel");
        pixel.setAttribute("draggable", "false");
        pixel.style.width = `${100 / rangeCanvasSize.value}%`;
        pixel.addEventListener("dragstart", e => e.preventDefault());
        canvas.appendChild(pixel);
        changeBgColor();
    }
}

// change background color
function changeBgColor() {
    for (let i = 0; i < canvas.children.length; i++) {
        let pixel = canvas.children[i];
        if (pixel.id != "brushed") {
            pixel.style.backgroundColor = inputBgColor.value;
        }
    }
}

rangeCanvasSize.addEventListener("input", () => {
    btnRangeValue.textContent = `${rangeCanvasSize.value}x${rangeCanvasSize.value}`
});

// set canvas size
btnRangeValue.addEventListener("click", () => {
    newCanvas();
});

// toogle grid lines
let gridState = false;
btnGrid.addEventListener("click", () => {
    if (gridState === true) {
        for (let i = 0; i < canvas.children.length; i++) {
            canvas.children[i].style.border = "none";
        }
        gridState = false;
    }
    else {
        for (let i = 0; i < canvas.children.length; i++) {
            canvas.children[i].style.border = "0.1px solid rgba(139, 150, 160, 0.4)";
        }
        gridState = true;
    }
});

// bgcolor input
inputBgColor.addEventListener("input", () => {
    changeBgColor();
});

// clears canvas
btnClear.addEventListener("click", () => {
    for (let i = 0; i < canvas.children.length; i++) {
        let pixel = canvas.children[i];
        pixel.style.backgroundColor = inputBgColor.value;
        pixel.removeAttribute("id", "brushed");
    }
});

// saves canvas as png
btnExport.addEventListener("click", () => {
    html2canvas(canvas).then(newCanvas => {
        const link = document.createElement("a");
        link.download = "my-drawing.png";
        link.href = newCanvas.toDataURL();
        link.click();
    });
});

// resets all buttons
function toolStateReset() {
    for (let i = 0; i < tools.children.length; i++) {
        let tool = tools.children[i];
        if (tool.tagName === "BUTTON" && tool.classList.contains("on")) {
            tool.classList.remove("on");
        }
    }
}

// handles all individual tool toggles
for (let i = 0; i < tools.children.length; i++) {
    let btn = tools.children[i];
    if (btn.tagName === "BUTTON") {
        btn.addEventListener("click", () => {
            if (btn.classList.contains("on")) {
                btn.classList.remove("on");
                console.log(`${btn.textContent} off`);
            } else {
                toolStateReset();
                btn.classList.add("on");
                console.log(`${btn.textContent} on`);
            }
        });
    }
}

function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g);
    if (!result || result.length < 3) {
        return "#000000";
    }
    else {
        const r = parseInt(result[0]).toString(16).padStart(2, "0");
        const g = parseInt(result[1]).toString(16).padStart(2, "0");
        const b = parseInt(result[2]).toString(16).padStart(2, "0");

        return `#${r}${g}${b}`;
    }
}

function shadePixel(rgb) {
    const result = rgb.match(/\d+/g).map(Number);
    if (btnShading.classList.contains("on")) {
        for (let i = 0; i < 3; i++) {
            if (result[i] - 10 != 0) {
                result[i] -= 10;
            }
            else {
                result[i] -= 255 - result[i];
            }
        }
    } else if (btnLighten.classList.contains("on")) {
        for (let i = 0; i < 3; i++) {
            if (result[i] + 10 != 0) {
                result[i] += 10;
            }
            else {
                result[i] += 255 - result[i];
            }
        }
    }

    const r = result[0];
    const g = result[1];
    const b = result[2];

    return `rgb(${r}, ${g}, ${b})`;
}



let isPainting = false;

function paintPixel(pixel) {
    //eraser state
    if (btnEraser.classList.contains("on")) {
        pixel.style.backgroundColor = inputBgColor.value;
        pixel.removeAttribute("id", "brushed");
    }
    // rainbow state
    else if (btnRainbow.classList.contains("on")) {
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        pixel.setAttribute("id", "brushed");
        pixel.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }
    // dropper state
    else if (btnEyeDropper.classList.contains("on")) {
        console.log(pixel.style.backgroundColor);
        const computedColor = window.getComputedStyle(pixel).backgroundColor;
        inputColor.value = rgbToHex(computedColor);
    }
    // shading state
    else if (btnShading.classList.contains("on")
        || btnLighten.classList.contains("on")) {
        if (pixel.id === "brushed") {
            pixel.style.backgroundColor = shadePixel(pixel.style.backgroundColor);
        }
    }
    // brush state
    else {
        pixel.style.backgroundColor = inputColor.value;
        pixel.setAttribute("id", "brushed");
    }
}
canvas.addEventListener("mousedown", (event) => {
    isPainting = true;
    paintPixel(event.target);
});
canvas.addEventListener("mouseover", (event) => {
    if (isPainting) {
        paintPixel(event.target);
    }
});
body.addEventListener("mouseup", () => {
    isPainting = false;
});
