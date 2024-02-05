
const canvas = new fabric.Canvas('canvas', {
    selection: true,
    isDrawingMode:false
});
const $ = function(id){return document.querySelector(id)};
ctx = canvas.getContext("2d", { willReadFrequently: true });

const  fillColor = $("#fill-color"),
    bucketFillBtn = $("#bucket-btn"),
    bucketstrokeBtn = $("#bucket-btn2"),
    sizeSlider = $("#size-slider"),
    clearCanvas = $("#clear-canvas"),
    colorPicker = $("#color-picker"),
    drawingShadowOffset = $('#size-slider2'),
    drawingShadowWidth = $('#size-slider1'),
    group_obj = $('#group'),
    ungroup_obj = $('#ungroup'),
    multiselect_obj = $('#multiselect'),
    discard_obj = $('#discard'),
    remove_obj= $("#remove"),
    unselectable_Obj = $('#unselectable'),
    selectable_Obj = $('#selectable'),
    duplicate_obj = $("#duplicate"),
    saveImg = $("#save-img"),
    intersectionCheckbox = $('#intersection'),
    themeMode = $("#theme-mode"),
    toolBtns = document.querySelectorAll(".tool"),
    colorBtns = document.querySelectorAll(".colors .option");


let isDrawing = false;
let rectangle,circle,triangle,star,
    brushWidth = 3,
    shadowBluer = 0,
    shadowX = 0,
    shadowY = 0,
    selectedTool = "rectangle",
    selectedColor = "#000";

// --------------------------------
// Functions
class Shapes{
    drawRect = (e,pointer,points) => {
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

    drawCircle = (e,pointer) =>{
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
    drawTriangle = (e, pointer,points) => {
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
    drawText = (event, pointer) => {
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
    drawStar = (event, pointer) => {
        if (!star) {
            // Draw the star only if it doesn't exist
            star = new fabric.Polygon(this.getStarPoints(pointer.x, pointer.y), {
                left: pointer.x,
                top: pointer.y,
                fill: 'transparent',
                strokeWidth: brushWidth,
                stroke: selectedColor,
                selectable: true,
                hasControls: true,
                hasBorders: true
            });
            if (fillColor.checked) {
                star.set({
                    fill:selectedColor,
                    strokeWidth: brushWidth,
                    stroke: selectedColor,
                });
            }

            canvas.add(star);
        }

    };

    pen = ()=>{
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
    brush = () => {
        const opacity = 0.5; // Set the desired opacity value (between 0 and 1)

        // Set the opacity of the freeDrawingBrush
        canvas.freeDrawingBrush.color = new fabric.Color(selectedColor).setAlpha(opacity).toRgba();

        // Set the shadow with opacity
        canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            color: new fabric.Color(selectedColor).setAlpha(opacity).toRgba(),
            offsetX: shadowX,
            offsetY: shadowY,
            blur: shadowBluer
        });

        // Set the opacity of the context used by the canvas
        canvas.contextContainer.globalAlpha = opacity;

        // Enable drawing mode
        canvas.isDrawingMode = true;

        // Render the canvas
        canvas.renderAll();
    };
    getStarPoints = (x, y) => {
        const outerRadius = 30;
        const innerRadius = 15;
        const numPoints = 5;
        const angleIncrement = (2 * Math.PI) / (numPoints * 2);
        const points = [];

        for (let i = 0; i < numPoints * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = i * angleIncrement;
            const pointX = x + radius * Math.cos(angle);
            const pointY = y + radius * Math.sin(angle);
            points.push({ x: pointX, y: pointY });
        }

        return points;

    }


}

const shape = new Shapes();

const startDraw = (event) => {
    if (canvas.getActiveObject()) {
        // If an object is selected, don't start drawing
        return;
    }

    isDrawing = true;
    var pointer = canvas.getPointer(event.e);
    var points = [pointer.x, pointer.y, pointer.x, pointer.y];

    if(selectedTool === "rectangle"){
        shape.drawRect(event,pointer,points);
        canvas.add(rectangle);
    }else if(selectedTool === "circle"){
        shape.drawCircle(event,pointer);
        canvas.add(circle);
    }else if(selectedTool === "triangle"){
        shape.drawTriangle(event,pointer,points);
        canvas.add(triangle);
    }else if(selectedTool === "brush" ){
        shape.pen();
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
    }else if (selectedTool === "star") {
        shape.drawStar(event,pointer);
        const deltaX = pointer.x - star.left;
        const deltaY = pointer.y - star.top;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        // Update the size of the star based on the distance from the initial position
        const scaleFactor = distance / 30; // Adjust the scale factor as needed
        star.scaleX = scaleFactor;
        star.scaleY = scaleFactor;
    }

    canvas.renderAll();

}



const removeSelectedObject = () => {
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        canvas.renderAll();
    }
};

const unselectable = () => {
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

const selectable = () => {
    let activeObject = canvas.getObjects();


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

const discard = () => {
    canvas.discardActiveObject();
    canvas.requestRenderAll();
}
const multiSelect = () => {
    canvas.discardActiveObject();
    var sel = new fabric.ActiveSelection(canvas.getObjects(), {
        canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
}

const group = () => {
    if (!canvas.getActiveObject()) {
        return;
    }
    if (canvas.getActiveObject().type !== 'activeSelection') {
        return;
    }
    canvas.getActiveObject().toGroup();
    canvas.requestRenderAll();
}
const ungroup = () => {
    if (!canvas.getActiveObject()) {
        return;
    }
    if (canvas.getActiveObject().type !== 'group') {
        return;
    }
    canvas.getActiveObject().toActiveSelection();
    canvas.requestRenderAll();
}

const copy = () => {
    if (canvas.getActiveObject()) {
        canvas.getActiveObject().clone(function(cloned) {
            _clipboard = cloned;
        });
    }
}
const paste = () => {
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
const save = () =>{
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
}
const checkInterSection = () =>{
    if (intersectionCheckbox.checked) {
        canvas.on({
            'object:moving': interSection,
            'object:scaling': interSection,
            'object:rotating': interSection,
        });
    } else {
        // Disable intersection handling
        canvas.off('object:moving', interSection);
        canvas.off('object:scaling', interSection);
        canvas.off('object:rotating', interSection);

        // Reset opacity for all objects
        canvas.forEachObject(function(obj) {
            obj.set('opacity', 1);
        });
    }
}
// Function for handling intersection
const interSection = (options) => {
    options.target.setCoords();
    canvas.forEachObject(function(obj) {
        if (obj === options.target) return;
        obj.set('opacity', options.target.intersectsWithObject(obj) ? 0.5 : 1);
    });
}
const changeTheme = () => {
    document.body.classList.toggle("dark-mode");

}
// forEach() buttons
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

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color button
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});


// ------------------------------



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





// Event listener for remove button click



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

// Event listener for Ctrl+ key combination
document.onkeydown = (e) => {
    const activeObject = canvas.getActiveObject();
    if (e.key === 'Backspace' && canvas.getActiveObject()) {
        removeSelectedObject();
        e.preventDefault();
    }else if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'c':
            case 'C':
                e.preventDefault();
                copy();
                break;
            case 'v':
            case 'V':
                e.preventDefault();
                paste();
                break;
            case 'x':
            case 'X':
                e.preventDefault();
                copy();
                removeSelectedObject();
                break;
        }
    } else if (activeObject) {
        const moveDistance = 5;

        switch (e.key) {
            case 'ArrowUp':
                activeObject.set('top', activeObject.top - moveDistance);
                break;
            case 'ArrowDown':
                activeObject.set('top', activeObject.top + moveDistance);
                break;
            case 'ArrowLeft':
                activeObject.set('left', activeObject.left - moveDistance);
                break;
            case 'ArrowRight':
                activeObject.set('left', activeObject.left + moveDistance);
                break;
        }

        // Update the canvas after moving the object
        canvas.renderAll();
    }
}


// Event listener for intersection checkbox change
intersectionCheckbox.onchange = () => checkInterSection();


// Event listener for canvas mouse events

canvas.on('mouse:down', startDraw);

canvas.on('mouse:move', drawing);

canvas.on('mouse:up', function () {
    isDrawing = false;
    star = null;
});
canvas.on('mouse:dblclick', (event) => {
    if (selectedTool === 'text') {
        const pointer = canvas.getPointer(event.e);
        shape.drawText(event, pointer);
        canvas.renderAll();
    }
});


// Event listener for buttons click

themeMode.onclick =  () => changeTheme();

selectable_Obj.onclick = () => selectable();

unselectable_Obj.onclick = () => unselectable;

group_obj.onclick = () => group();

ungroup_obj.onclick = () => ungroup();

multiselect_obj.onclick = () => multiSelect();

discard_obj.onclick = () => discard();

remove_obj.onclick = () => removeSelectedObject();

duplicate_obj.onclick = () => {
    copy();
    paste();
};

saveImg.onclick = () => save();

clearCanvas.onclick = () => canvas.clear();





//TODO: fix eraser
//TODO: add some shapes
//TODO: finish themes
//TODO: add brush
