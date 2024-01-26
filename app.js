
var canvas = new fabric.Canvas('canvas', {
    selection: true,
    isDrawingMode:false
});
var $ = function(id){return document.querySelector(id)};
ctx = canvas.getContext("2d", { willReadFrequently: true });

var fillColor = $("#fill-color"),
    bucketFillBtn = $("#bucket-btn"),
    bucketstrokeBtn = $("#bucket-btn2"),
    sizeSlider = $("#size-slider"),
    clearCanvas = $("#clear-canvas"),
    colorPicker = $("#color-picker"),
    remove= $("#remove"),
    drawingShadowOffset = $('#size-slider2'),
    drawingShadowWidth = $('#size-slider1'),
    group = $('#group'),
    ungroup = $('#ungroup'),
    multiselect = $('#multiselect'),
    discard = $('#discard'),
    unselectable_Obj = $('#unselectable'),
    selectable_Obj = $('#selectable'),
    duplicate = $("#duplicate"),
    saveImg = $(".save-img"),
    toolBtns = document.querySelectorAll(".tool"),
    colorBtns = document.querySelectorAll(".colors .option");
// themeMode = $("#theme-mode"),



var isDrawing = false;
var rectangle,circle,triangle,
    brushWidth = 3,
    shadowBluer = 0,
    shadowX = 0,
    shadowY = 0,
    selectedTool = "brush",
    selectedColor = "#000";

// --------------------------------



// ------------------------------
unselectable_Obj.onclick = function (){
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
        // Toggle the selectable property
        activeObject.selectable = !activeObject.selectable;

        // If selectable is set to false, also deselect the object
        if (!activeObject.selectable) {
            canvas.discardActiveObject();
        }

        // Render the canvas
        canvas.renderAll();

    }
}

selectable_Obj.onclick = function (){
    var activeObject = canvas.getObjects();


    // Toggle the selectable property
    activeObject.forEach((obj) =>{
        obj.set({
            selectable: true
        })
    })

    // If selectable is set to false, also deselect the object

    canvas.discardActiveObject();
    // Render the canvas
    canvas.renderAll();
    var sel = new fabric.ActiveSelection(canvas.getObjects(), {
        canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();

}
discard.onclick = function (){
    canvas.discardActiveObject();
    canvas.requestRenderAll();
}

multiselect.onclick = function() {
    canvas.discardActiveObject();
    var sel = new fabric.ActiveSelection(canvas.getObjects(), {
        canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
}

group.onclick = function() {
    if (!canvas.getActiveObject()) {
        return;
    }
    if (canvas.getActiveObject().type !== 'activeSelection') {
        return;
    }
    canvas.getActiveObject().toGroup();
    canvas.requestRenderAll();
}

ungroup.onclick = function() {
    if (!canvas.getActiveObject()) {
        return;
    }
    if (canvas.getActiveObject().type !== 'group') {
        return;
    }
    canvas.getActiveObject().toActiveSelection();
    canvas.requestRenderAll();
}
// themeMode.onclick = function (){
//     document.body.classList.toggle("dark-mode");
//
// }

duplicate.onclick = function (){
    canvas.getActiveObject().clone(function(cloned) {
        _clipboard = cloned;
    });

    _clipboard.clone(function(clonedObj) {
        canvas.discardActiveObject();
        clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            evented: true,
        });
        if (clonedObj.type === 'activeSelection') {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = canvas;
            clonedObj.forEachObject(function(obj) {
                canvas.add(obj);
            });
            // this should solve the unselectability
            clonedObj.setCoords();
        } else {
            canvas.add(clonedObj);
        }
        _clipboard.top += 10;
        _clipboard.left += 10;
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
    });
}


toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;

        if (selectedTool === 'text') {
            canvas.isDrawingMode = false;
            canvas.off('path:created');
        }
    });
});

sizeSlider.onchange = function() {
    canvas.freeDrawingBrush.width = parseInt(this.value) || 3;
    brushWidth = parseInt(sizeSlider.value) || 3;
};
drawingShadowWidth.onchange = function() {
    canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0;
    shadowBluer = parseInt(this.value, 10)||0;

};
drawingShadowOffset.onchange = function() {
    canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0;
    canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0;
    shadowX =parseInt(this.value, 10) || 0;
    shadowY =parseInt(this.value, 10) || 0;

};

colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});


clearCanvas.onclick = function() { canvas.clear() }
remove.onclick = function() {
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        canvas.renderAll();
    }
}
bucketFillBtn.onclick= function (){
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
        activeObject.set({ fill: selectedColor }); // Set the fill color
        canvas.renderAll();
    }
}
bucketstrokeBtn.onclick= function (){
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
        activeObject.set({ stroke: selectedColor }); // Set the fill color
        canvas.renderAll();
    }
}
bucketFillBtn.ondblclick = function () {
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
        activeObject.set({ fill: 'transparent' }); // Fill with transparent color
        canvas.renderAll();
    }
}
// bucketstrokeBtn.ondblclick = function () {
//     const activeObject = canvas.getActiveObject();
//
//     if (activeObject) {
//         activeObject.set({ stroke: 'transparent' }); // Fill with transparent color
//         canvas.renderAll();
//     }
// }
// remove.onclick = function ()  {
//     const newThemeColor = "#423f3f"; // Change this to your desired theme color
//
//     // Set the background color of the canvas
//     canvas.setBackgroundColor(newThemeColor, canvas.renderAll.bind(canvas));
// }



// Example of usage (you can bind this function to a button click or any other event)


saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
});

const drawText = (event, pointer) => {
    const text = new fabric.IText('Your Text Here', {
        left: pointer.x,
        top: pointer.y,
        fill: selectedColor,
        fontSize: 20,
        selectable: true,
        hasControls: true,
        hasBorders: true,
    });

    canvas.add(text);
};

const pen = ()=>{
    // canvas.freeDrawingBrush.color = tool ==="eraser"? '#fff': "#C72C2CFF"
    canvas.freeDrawingBrush.color = selectedColor;
    canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        color: selectedColor,  // Shadow color
        offsetX: shadowX,  // Horizontal offset
        offsetY: shadowY,  // Vertical offset
        blur: shadowBluer       // Blur radius
    });
    canvas.isDrawingMode = true;
    canvas.renderAll();

}

const drawRect = (e,pointer,points) => {
    rectangle = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        originX: 'left',
        originY: 'top',
        width: pointer.x - points[0],
        height: pointer.y - points[1],
        fill: 'transparent',
        strokeWidth: brushWidth,
        stroke: selectedColor,
        selectable: true,
        hasControls: true,
        hasBorders: true
    });
    if(fillColor.checked){
        rectangle.set({
            fill:selectedColor,
            strokeWidth: brushWidth,
            stroke: selectedColor,
        });
    }

}

const drawCircle = (e,pointer) =>{
    circle = new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 0,
        fill: 'transparent',
        stroke: selectedColor, // Circle fill color
        strokeWidth: brushWidth,
        selectable: true, // Make the object selectable
        hasControls: true, // Show controls (handles) when selected
        hasBorders: true // Show borders when selected
    });

    if(fillColor.checked){
        circle.set({
            fill:selectedColor,
            strokeWidth: brushWidth,
            stroke: selectedColor,
        });
    }
}
const drawTriangle = (e, pointer,points) => {
    triangle = new fabric.Triangle({
        left: pointer.x,
        top: pointer.y,
        width: pointer.x - points[0],
        height: pointer.y - points[1],
        fill: 'transparent',
        strokeWidth: brushWidth,
        stroke: selectedColor,
        selectable: true,
        hasControls: true,
        hasBorders: true
    });

    if (fillColor.checked) {
        triangle.set({
            fill:selectedColor,
            strokeWidth: brushWidth,
            stroke: selectedColor,
        });
    }

};




const startDraw = (event) => {
    if (canvas.getActiveObject()) {
        // If an object is selected, don't start drawing
        return;
    }

    isDrawing = true;
    var pointer = canvas.getPointer(event.e);
    var points = [pointer.x, pointer.y, pointer.x, pointer.y];

    if (selectedTool !== "brush" ) {
        canvas.isDrawingMode = false;
        canvas.off('path:created');
    }

    if(selectedTool === "rectangle"){
        drawRect(event,pointer,points);
        canvas.add(rectangle);
    }else if(selectedTool === "circle"){
        drawCircle(event,pointer);
        canvas.add(circle);
    }else if(selectedTool === "triangle"){
        drawTriangle(event,pointer,points);
        canvas.add(triangle);
    }else if(selectedTool === "brush" ){
        pen();
    }
    canvas.renderAll(); // Force a redraw
}


const drawing = (event) =>{
    if (!isDrawing) return;
    var pointer = canvas.getPointer(event.e);

    if(selectedTool === "rectangle"){
        rectangle.set({ width: pointer.x - rectangle.left, height: pointer.y - rectangle.top });
    }else if(selectedTool === "circle"){
        var dx = pointer.x - circle.left;
        var dy = pointer.y - circle.top;
        var radius = Math.sqrt(dx * dx + dy * dy);
        circle.set({ radius: radius });
    }else if (selectedTool === "triangle") {
        triangle.set({
            width: pointer.x - triangle.left,
            height: pointer.y - triangle.top,
        });
    }

    canvas.renderAll();

}



canvas.on('mouse:dblclick', (event) => {
    if (selectedTool === 'text') {
        const pointer = canvas.getPointer(event.e);
        drawText(event, pointer);
        canvas.renderAll();
    }
});
// Event listener for mouse down
canvas.on('mouse:down', startDraw);

// Event listener for mouse move
canvas.on('mouse:move', drawing);

// Event listener for mouse up
canvas.on('mouse:up', function () {
    isDrawing = false;
});

