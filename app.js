const canvas = new fabric.Canvas('canvas', {
    selection: true,
    isDrawingMode:false
});

const $ = function(id){return document.querySelector(id)};
ctx = canvas.getContext("2d", { willReadFrequently: true });

canvas.selectionColor='transparent';
canvas.selectionBorderColor="transparent";

const  fillColor = $("#fill-color"),
    bucketFillBtn = $("#bucket-btn"),
    bucketStrokeBtn = $("#bucket-btn2"),
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
    clip = $("#clip"),
    saveImg = $("#save-img"),
    intersectionCheckbox = $('#intersection'),
    themeMode = $("#theme-mode"),
    board =document.querySelector(".drawing-board"),
    toolBtns = document.querySelectorAll(".tool"),
    colorBtns = document.querySelectorAll(".colors .option");

canvas.setWidth(board.clientWidth);
canvas.setHeight(board.clientHeight);

let isDrawing = false;
let rectangle,circle,triangle,star,polygon,line
    brushWidth = 5,
    shadowBluer = 0,
    shadowX = 0,
    shadowY = 0,
    selectedTool = "rectangle",
    selectedColor = "#000";

// class of shape
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

    };

    drawCircle = (e,pointer) =>{
        circle = new fabric.Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 0,
            fill: 'transparent',
            stroke: selectedColor,
            strokeWidth: brushWidth,
            selectable: true,
            hasControls: true,
            hasBorders: true,
        });

        if(fillColor.checked){
            circle.set({
                fill:selectedColor,
                strokeWidth: brushWidth,
                stroke: selectedColor,
            });
        }
    };
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
    drawStar = (pointer, starPoint) => {

        if (!star) {
            // Draw the star only if it doesn't exist
            star = new fabric.Polygon(this.getStarPoints(pointer.x, pointer.y,starPoint), {
                left: pointer.x,
                top: pointer.y,
                fill: 'transparent',
                strokeWidth: brushWidth,
                stroke: selectedColor,
                selectable: true,
                hasControls: true,
                hasBorders: true,
                angle: starPoint === 2? 90: 0

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
    drawPolygon = (pointer,polygonPoints) => {
        let rotation = polygonPoints === 4 ? 45: polygonPoints=== 5? 121.9 :0;
        if (!polygon) {
            polygon = new fabric.Polygon(this.getPolygonPoints(pointer.x, pointer.y, polygonPoints), {
                left: pointer.x,
                top: pointer.y,
                fill: 'transparent',
                strokeWidth: brushWidth,
                stroke: selectedColor,
                selectable: true,
                hasControls: true,
                hasBorders: true,
                angle: rotation
            });
            if (fillColor.checked) {
                polygon.set({
                    fill:selectedColor,
                    strokeWidth: brushWidth,
                    stroke: selectedColor,
                });
            }

            canvas.add(polygon);
        }


    };
    drawLine = (pointer,points) => {
        line = new fabric.Line(points, {
            strokeWidth: 2, // Width of the line
            stroke: 'black' // Color of the line
        });
        canvas.add(line);

    }
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

    pen = ()=>{

        canvas.contextContainer.globalAlpha = 1;
        // canvas.freeDrawingBrush.color = tool ==="eraser"? '#fff': "#C72C2CFF"
        canvas.freeDrawingBrush.color = selectedColor;
        canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            color: selectedColor,
            offsetX: shadowX,
            offsetY: shadowY,
            blur: shadowBluer
        });
        canvas.isDrawingMode = true;
        canvas.renderAll();

    };
    brush = () => {
        const opacity = 0.3;

        // Set the opacity of the freeDrawingBrush
        canvas.freeDrawingBrush.color = new fabric.Color(selectedColor).setAlpha(opacity).toRgba();
        canvas.freeDrawingBrush.width = brushWidth;

        // Set the shadow with opacity
        canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            color: new fabric.Color(selectedColor).setAlpha(opacity).toRgba(),
            offsetX: shadowX,
            offsetY: shadowY,
            blur: shadowBluer
        });

        // Set the opacity of the context used by the canvas
        canvas.contextContainer.globalAlpha = opacity;
        canvas.isDrawingMode = true;
        canvas.renderAll();

        // Reset the globalAlpha to 1
        canvas.contextContainer.globalAlpha = 1;
    };
    eraser = () => {
        canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
        canvas.freeDrawingBrush.width = 10;
        canvas.isDrawingMode = true;
    };
    undo = () => {
        canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
        canvas.freeDrawingBrush.width = 10;
        canvas.freeDrawingBrush.inverted = true;
        canvas.isDrawingMode = true;
        
    };
    spray = () => {
        canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
        canvas.freeDrawingBrush.width = 25;
        canvas.freeDrawingBrush.color = selectedColor;
        canvas.isDrawingMode = true;
    };
    getStarPoints = (x, y,starPoints) => {
        const outerRadius = 30;
        const innerRadius = 15;
        const numPoints = starPoints;
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
    getPolygonPoints = (x, y, polygonPoints) => {
        const radius = 15;
        const angleIncrement = (2 * Math.PI) / polygonPoints;
        const points = [];

        for (let i = 0; i < polygonPoints; i++) {
            const angle = i * angleIncrement;
            const pointX = x + radius * Math.cos(angle);
            const pointY = y + radius * Math.sin(angle);
            points.push({ x: pointX, y: pointY });
        }

        return points;

    };


}
// Create a new instance of the Shapes class
const shape = new Shapes();

//FUNCTIONS
//---------
const clipping = () =>{
    
    fabric.Object.prototype.transparentCorners = false;
    canvas.preserveObjectStacking = true;

    

    fabric.Image.fromURL('img/img.png', function(img) {
        var scalar = 1, abort;
        var path = 'M 230 230 A 45 45, 0, 1, 1, 275 275 L 275 230 Z';
        var shell = new fabric.Path(path, {
            fill: '',
            stroke: selectedColor,
            strokeWidth: 3,
            scaleX: 2,
            scaleY: 2,
            lockScalingX: true,
            lockScalingY: true,
            lockSkewingX: true,
            lockSkewingY: true,
            originX: 'center',
            originY: 'center',
        });

       
        var clipPath = new fabric.Path(path, {
            absolutePositioned: true,
            originX: 'center',
            originY: 'center',
            scaleX: 2,
            scaleY: 2
        });

        

        img.scale(2).set({
            left: 200,
            top: 180,
            clipPath: clipPath
        });
        
        shell.on('moving', ({ e, transform, pointer }) => {
            //  only because they are absolutePositioned
            clipPath.setPositionByOrigin(shell.getCenterPoint(), 'center', 'center');
            img.set('dirty', true);
        });
        shell.on('rotating', () => {
            clipPath.set({ angle: shell.angle });
            img.set('dirty', true);
        });
        shell.on('selected', () => {
            abort();
        });
        shell.on('deselected', () => {
            scalar = 1;
        });
        img.clipPath = clipPath;
        canvas.add(img, shell);
        canvas.add(drct,shell);
        canvas.setActiveObject(img);
        
    });

}
// Function to start drawing (when the mouse button is pressed)
const startDraw = (event) => {
    if (canvas.getActiveObject()) {
        // If an object is selected, don't start drawing
        return;
    }

    isDrawing = true;
    // Get the pointer coordinates
    var pointer = canvas.getPointer(event.e);
    // Create an array with the pointer coordinates
    var points = [pointer.x, pointer.y, pointer.x, pointer.y];

    // Draw the selected shape
    if(selectedTool === "rectangle"){
        shape.drawRect(event,pointer,points);
        canvas.add(rectangle);
    }else if(selectedTool === "circle"){
        shape.drawCircle(event,pointer);
        canvas.add(circle);
    }else if(selectedTool === "triangle"){
        shape.drawTriangle(event,pointer,points);
        canvas.add(triangle);
    }else if(selectedTool === "line" ){
        shape.drawLine(pointer,points);
    }else if(selectedTool === "pen" ){
        shape.pen();
    }else if(selectedTool === "brush" ){
        shape.brush();
    }else if(selectedTool === "text" ){
        // shape.drawText(event,pointer);
    }else if(selectedTool === "eraser"){
        shape.eraser();
    }else if(selectedTool === "undo"){
        shape.undo();
    }else if(selectedTool === "spray"){
        shape.spray();
    }
    canvas.renderAll(); // Force a redraw
}

// Function to draw the selected shape (when the mouse is moved)
const drawing = (event) =>{
    if (!isDrawing) return;
    var pointer = canvas.getPointer(event.e);

    // Update the shape based on the pointer coordinates
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
    }else if (selectedTool === "star" || selectedTool === "chrisMassStar" || selectedTool === "octaStar" || selectedTool === "diamond") {
        let starPoints = checkStarType(selectedTool);
        shape.drawStar(pointer,starPoints);

        if(star) {
            const deltaX = pointer.x - star.left;
            const deltaY = pointer.y - star.top;
            const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

            const scaleFactor = distance / 30;
            star.scaleX = scaleFactor;
            star.scaleY = scaleFactor;
        }

    }else if (selectedTool === "hexagon" || selectedTool === "pentagon" || selectedTool === "octagon" || selectedTool === "square") {
        let polygonPoints = checkPolygonType( selectedTool);
        shape.drawPolygon(pointer, polygonPoints);

        if(polygon){
            const deltaX = pointer.x - polygon.left;
            const deltaY = pointer.y - polygon.top;
            const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

            const scaleFactor = distance / 30;
            polygon.scaleX = scaleFactor;
            polygon.scaleY = scaleFactor;
        }

    }else if (selectedTool === "line") {
        if (!isDrawing) return;
        line.set({ x2: pointer.x, y2: pointer.y });
    }
    canvas.renderAll();
}

const checkStarType = (selectedTool) => {
    let starPoints;
    if(selectedTool === "diamond"){
        starPoints = 2;
    }else if(selectedTool === "star"){
        starPoints = 5;
    }else if(selectedTool === "chrisMassStar"){
        starPoints = 4;
    }else if(selectedTool === "octaStar"){
        starPoints = 8;
    }
    return starPoints;
}
const checkPolygonType = (selectedTool) =>{
    let polyPoints;
    if(selectedTool === "square"){
        polyPoints = 4;
    }else if(selectedTool === "pentagon"){
        polyPoints = 5;
    }else if(selectedTool === "hexagon"){
        polyPoints = 6;
    }else if(selectedTool === "octagon"){
        polyPoints = 8;
    }
    return polyPoints;
}

// Function to remove the selected object (delete from the canvas)
const removeSelectedObject = () => {
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
        canvas.remove(activeObject);
        canvas.discardActiveObject();
        canvas.renderAll();
    }
};

// Function to set selectable property to false
const unselectable = () => {
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
        activeObject.selectable = !activeObject.selectable;
        if (!activeObject.selectable) {
            canvas.discardActiveObject();
        }
        canvas.renderAll();
    }
}

// Function to set selectable property to true
const selectable = () => {
    let activeObject = canvas.getObjects();
    activeObject.forEach((obj) =>{
        obj.set({
            selectable: true
        })
    })
    canvas.discardActiveObject();
    canvas.renderAll();
    var sel = new fabric.ActiveSelection(canvas.getObjects(), {
        canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
}

// Function to discard  the active object (unselect)
const discard = () => {
    canvas.discardActiveObject();
    canvas.requestRenderAll();
}

// Function to select multiple objects
const multiSelect = () => {
    canvas.discardActiveObject();
    var sel = new fabric.ActiveSelection(canvas.getObjects(), {
        canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
}

// Function to group the selected objects ( to a single object)
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

// Function to ungroup the selected objects
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

// Function to copy the selected object
const copy = () => {
    if (canvas.getActiveObject()) {
        canvas.getActiveObject().clone(function(cloned) {
            _clipboard = cloned;
        });
    }
}

// Function to paste the copied object
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

// Function to save the canvas as image
const save = () =>{
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
}

// Function to check intersection of objects
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

// Function to change theme
const changeTheme = () => {
    document.body.classList.toggle("theme-toggle");

}

// CLICK EVENT LISTENERS
//----------------------

// Event listener for tool button click
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;

        if (selectedTool === 'text') {
            canvas.isDrawingMode = false;
        } else if (selectedTool === 'undo') {
            canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
            canvas.freeDrawingBrush.width = 10;
            canvas.freeDrawingBrush.inverted = true;
            canvas.isDrawingMode = true;
        }else if (selectedTool === 'spray') {
            canvas.freeDrawingBrush = new fabric.SprayBrush(canvas);
            canvas.freeDrawingBrush.width = 25;
            canvas.isDrawingMode = true;
        }else if (selectedTool === 'eraser') {
            canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
        } else if (selectedTool === 'brush'|| selectedTool === 'pen') {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }else {
            canvas.isDrawingMode = false;
        }

        // If brush is selected, set the maximum value of the size slider
        if (selectedTool === 'brush') {
            brushWidth = 28;
            sizeSlider.value = 28;
        } else {
            brushWidth = 5;
            sizeSlider.value = 5;
        }
    });
});

// Event listener for color button click
colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

// Event listener for fill color button click (fill with color)
bucketFillBtn.onclick= function (){
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
        activeObject.set({ fill: selectedColor }); // Set the fill color
        canvas.renderAll();
    }
}

// Event listener for fill color button double click (Fill with transparent color)
bucketFillBtn.ondblclick = function () {
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
        activeObject.set({fill: 'transparent'});
        canvas.renderAll();
    }
}

// Event listener for stroke color button click (stroke with color)
bucketStrokeBtn.onclick= function (){
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
        activeObject.set({ stroke: selectedColor }); // Set the fill color
        canvas.renderAll();
    }
}

// Event listener for buttons click
themeMode.onclick =  () => changeTheme();

selectable_Obj.onclick = () => selectable();

unselectable_Obj.onclick = () => unselectable();

group_obj.onclick = () => group();

ungroup_obj.onclick = () => ungroup();

multiselect_obj.onclick = () => multiSelect();

discard_obj.onclick = () => discard();

remove_obj.onclick = () => removeSelectedObject();

duplicate_obj.onclick = () => {
    copy();
    paste();
};
clip.onclick=() =>{
    clipping();
    
}

saveImg.onclick = () => save();

clearCanvas.onclick = () => canvas.clear();


// ONCHANGE EVENT LISTENERS
// ------------------------

// Event listener for size slider change
sizeSlider.onchange = function() {
    canvas.freeDrawingBrush.width = parseInt(this.value) || 3;
    brushWidth = parseInt(sizeSlider.value) || 5;
};

// Event listener for shadow bluer slider change
drawingShadowWidth.onchange = function() {
    canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0;
    shadowBluer = parseInt(this.value, 10)||0;

};

// Event listener for shadow offset slider change
drawingShadowOffset.onchange = function() {
    canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0;
    canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0;
    shadowX =parseInt(this.value, 10) || 0;
    shadowY =parseInt(this.value, 10) || 0;

};

// Event listener for color picker change
colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

// Event listener for intersection checkbox change
intersectionCheckbox.onchange = () => checkInterSection();


//KEYDOWN EVENT LISTENERS
//-----------------------

// Event listener for Ctrl+ key combination
document.onkeydown = (e) => {
    const activeObject = canvas.getActiveObject();
    if (e.key === 'Backspace' && canvas.getActiveObject() && !(activeObject instanceof fabric.IText && activeObject.isEditing)) {
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

        canvas.renderAll();
    }
}

// Event listener for canvas mouse events
canvas.on('mouse:down', startDraw);

canvas.on('mouse:move', drawing);

canvas.on('mouse:up', function () {
    isDrawing = false;
    star = null;
    polygon = null;
});

canvas.on('mouse:dblclick', (event) => {
    if (selectedTool === 'text') {
        const pointer = canvas.getPointer(event.e);
        shape.drawText(event, pointer);
        canvas.renderAll();
    }
});

