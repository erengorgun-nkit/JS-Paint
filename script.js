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

newCanvas();
btnRangeValue.textContent = `${rangeCanvasSize.value}x${rangeCanvasSize.value}`;

// generate new canvas
function newCanvas() {
    canvas.innerHTML = "";
    for (let i = 0; i < rangeCanvasSize.value ** 2; i++) {
        let pixel = document.createElement("div");
        pixel.classList.add("pixel");
        pixel.style.width = `${100 / rangeCanvasSize.value}%`;
        canvas.appendChild(pixel);
        changeBgColor();
    }
}

rangeCanvasSize.addEventListener("input", () => {
    btnRangeValue.textContent = `${rangeCanvasSize.value}x${rangeCanvasSize.value}`
});

inputBgColor.addEventListener("input", () => {
    changeBgColor();
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
            canvas.children[i].style.border = "1px solid rgb(144, 159, 173)";
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

// clears canvas
btnClear.addEventListener("click", () => {
    for (let i = 0; i < canvas.children.length; i++) {
        canvas.children[i].style.backgroundColor = inputBgColor.value;
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




let isPainting = false;

canvas.addEventListener("click", (event) => {
    // eyedropper state
    if (btnEyeDropper.classList.contains("on")) {
        isPainting = false;
        inputColor.value = event.target.style.backgroundColor;
    }
});
canvas.addEventListener("mousedown", () => {
    isPainting = true;
});
canvas.addEventListener("mouseover",  (event) => {
    let target = event.target;
    if (isPainting === true) {
        // eraser state
        if (btnEraser.classList.contains("on")) {
            target.style.backgroundColor = inputBgColor.value;
            target.removeAttribute("id", "brushed");
        }
        // brush state
        else{
            target.style.backgroundColor = inputColor.value;
            target.setAttribute("id", "brushed");
        }
    }
});
canvas.addEventListener("mouseup", () => {
    isPainting = false;
});