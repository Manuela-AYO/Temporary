webstrate.on("loaded", function(webstrateId) {
    var slideShow;
    var slidesStructure = document.getElementById("slidesStructure");
    var slidesNotes = document.getElementById("slidesNotes");
    var newBlock = document.getElementById("newSlide");
    var styleTitle = document.getElementById("activateTitle");
    var styleSubtitle = document.getElementById("activateSubtitle");
    var activeSlideNote = slidesStructure.getElementsByClassName("active")[0];
    let currentZIndex = 1, fontSize=16, brushColor = "#000", brushThickness = 2;
    var activeSlideInMain, isDrawing=false, isDrawingMode=false;
    var titleStyle = false;
    var iframe = document.getElementById("main");
    var currentDrawing = null, currentPath = null, path;
    var offsetX, offsetY;

    // create list node
    function createListNode(outlineDiv, outline, nodeProperty) {
        if(!outline) {
            outline = document.createElement("ol");
            outline.className = "listTitles";
            outlineDiv.appendChild(outline);
        }

        // add text content
        var listItem = document.createElement("li");
        var paragraph = document.createElement("p");
        paragraph.classList.add(activeSlideInMain.classList[0]);
        paragraph.classList.add(nodeProperty.classList[nodeProperty.classList.length-1]);
        if(outline.id == "outline") {
            paragraph.addEventListener("click", (event) => {
                const slideClass = event.target.classList[0];
                const slide = document.getElementById("slides").querySelector(slideClass);
                document.getElementById("active").removeAttribute("id");
                slide.id = "active";
                showActiveSlide();
            });
        }
        paragraph.textContent = nodeProperty.textContent;
        listItem.appendChild(paragraph);
        outline.appendChild(listItem);
    }

    // create outline item
    function createElementInOutline(textBox) {
        var outlineDiv = document.getElementById("outline");
        outlineDiv.hidden = true;
        var outline = outlineDiv.querySelector(".listTitles");
        createListNode(outlineDiv, outline, textBox);
        createElementInNote(textBox);
        outlineDiv.removeAttribute("hidden");
    }

    // create the outline item in note
    function createElementInNote(textBox) {
        slidesNotes.hidden = true;
        var outline = slidesNotes.querySelector(".listTitles");
        createListNode(slidesNotes, outline, textBox);
        slidesNotes.removeAttribute("hidden");
    }

    // update outline
    const updateOutline = (event) => {
        const callingTitleClass = event.target.classList[event.target.classList.length-1];
        var outlineDiv = document.getElementById("outline");
        var paragraph = outlineDiv.querySelector(".listTitles").getElementsByClassName(callingTitleClass)[0];
        paragraph.innerHTML = event.target.innerHTML;
        updateNotes(event, callingTitleClass);
    }

    // update notes
    const updateNotes = (event, callingTitleClass) => {
        var slidesDiv = document.getElementById("slidesNotes");
        var paragraph = slidesDiv.querySelector(".listTitles").getElementsByClassName(callingTitleClass)[0];
        paragraph.innerHTML = event.target.innerHTML;
    }

    // add title
    function addTextStyle() {
        if(!activeSlideInMain) return;
        const titleBox = document.createElement("p");
        const nbTitles = document.getElementsByClassName("title").length;
        titleBox.classList.add("title");
        titleBox.classList.add("title-" + nbTitles.toString());
        titleBox.style.top = "10px";
        titleBox.style.left = "50px";
        titleBox.style.width = "200px";
        titleBox.setAttribute("contentEditable", "");
        titleBox.style.zIndex = currentZIndex ++;
        titleBox.textContent = "Add title";
        titleBox.style.fontSize = "50px";
        titleBox.style.fontWeight = "bold";
        titleBox.style.backgroundColor = "#000";
        titleBox.style.color = "#fff";
        titleBox.addEventListener("focus", () => {
            titleBox.classList.remove("outlined");
            titleBox.style.backgroundColor = "#fff";
            titleBox.style.color = "#000";
        });
        titleBox.addEventListener("input", updateOutline);
        titleBox.addEventListener("paste", updateOutline);
        titleBox.addEventListener("cut", updateOutline);
        titleBox.addEventListener("delete", updateOutline);
        titleBox.style.cursor = "grab";
        titleBox.style.position = "absolute";
        titleBox.draggable = true;
        activeSlideInMain.appendChild(titleBox);
        setupDragEvents(titleBox);
        //createElementInOutline(titleBox);
    }

    // add text box
    function addTextBox() {
        if(!activeSlideInMain) return;
        const textBox = document.createElement("div");
        textBox.className = "text-box";
        textBox.style.top = "50px";
        textBox.style.left = "50px";
        textBox.contentEditable = true;
        textBox.style.zIndex = currentZIndex++;
        activeSlideInMain.appendChild(textBox);
        textBox.style.fontSize = `${fontSize}px`; // Apply the current font size
        textBox.focus();
        setupDragEvents(textBox);
    }

    // add image
    function addImage() {
        if (!activeSlideInMain) return;
        const imageUrl = prompt("Enter image URL:");
        if (imageUrl) {
            const imageBox = doc.createElement("img");
            imageBox.src = imageUrl;
            imageBox.className = "image-box";
            imageBox.style.top = "50px";
            imageBox.style.left = "50px";
            imageBox.style.width = "200px"; // Change width as desired
            imageBox.style.zIndex = currentZIndex++;
            activeSlideInMain.appendChild(imageBox);
            setupDragEvents(imageBox);
        }
    }

    // handle drag events
    const setupDragEvents = (element) => {
        element.addEventListener("dragstart", (event) => {
            const handleMouseMove = (event) => {
                const rect = event.target.getBoundingClientRect();
                offsetX = event.clientX - rect.left;
                offsetY = event.clientY - rect.top;
                event.dataTransfer.setData("text/plain", null);
            }
        });

        activeSlideInMain.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        activeSlideInMain.addEventListener("drop", (event) =>  {
            event.preventDefault();
            const rect = activeSlideMain.getBoundingClientRect();
            const x = event.clientX - rect.left - offsetX;
            const y = event.clientY - rect.top - offsetY;

            // for the text to stay in the container
            const maxX = activeSlideInMain.clientWidth - element.clientWidth;
            const maxY = activeSlideInMain.clientHeight - element.clientHeight;

            element.style.left = `$(Math.min(Math.max(0, x), maxX)}px`;
            element.style.top = `$(Math.min(Math.max(0, y), maxY)}px`;
        });
    }

    // show the active slide
    function showActiveSlide() {
        if(!slideShow) return;
        // get the element having the active class
        var activeSlide = document.getElementById("active");

        // take its classes
        var className = activeSlide.className;

        // among the children of main, display the appropriate div
        console.log(slideShow);
        activeSlideInMain = slideShow.querySelector("." + className + ".slide");
        
        if(activeSlideInMain) {
            // set his attribute hidden to false
            activeSlideInMain.removeAttribute("hidden");

            // hide the other divs
            let children = slideShow.getElementsByClassName("slide");
            
            for(let i=0; i<children.length; i++) {
                if(!children[i].className.includes(className)) {
                    children[i].setAttribute("hidden", "true");
                }
            }
        }

        // do the same for slide notes
        showActiveSlideNotes();
        
    }

    // show active slide notes
    function showActiveSlideNotes() {
        // get the element having the active class
        const classNames = activeSlideNote.className;

        // hide it for now to avoid multiple repaints and reflows
        slidesNotes.setAttribute("hidden", "");

        let slideNumber;
        let children = document.getElementsByClassName("slideNote");
        for(let i=0; i<children.length; i++) {
            // hide the other divs notes
            if(!classNames.includes(children[i].className[0])) {
                children[i].setAttribute("hidden", "");
            }
            else {
                // show active slide notes
                children[i].removeAttribute("hidden");
                slideNumber = i;
            }
        }

        // print slide title
        document.getElementById("slideTitle").innerText = "Slide " + (slideNumber + 1).toString();
        
        // repaint
        slidesNotes.removeAttribute("hidden");
    }

    // create a new slide
    function createNewSlide() {
        // count the current number of p element in slides
        var allSlides = document.getElementById("slides");
        var nbSlidesCreated = allSlides.childElementCount;

        /* ___ on the slide show ___ */

        // remove the active id to the current slide
        document.getElementById("active").removeAttribute("id");

        // create a new block above the 'add block' + set it to active
        var newSlide = "<p class='slide-" + nbSlidesCreated.toString() + "'" + " id='active'></p>";
        newBlock.insertAdjacentHTML("beforebegin", newSlide);

        // add the click listener to toggle the slide show
        document.getElementById("active").addEventListener("click", (event) => {
            toggleSlideShow(event.target);
            showActiveSlide();
        });

        // create the div in the slideshow + give it the necessary attributes
        var newSlideInSlideShow = document.createElement("div");
        newSlideInSlideShow.className = "slide-" + nbSlidesCreated.toString() + " slide";

        // canvas in the div
        const newCanvas = document.createElement("canvas");
        newCanvas.className = "drawing-canvas";
        newCanvas.width = newSlideInSlideShow.offsetWidth;
        newCanvas.height = newSlideInSlideShow.offsetHeight;
        newSlideInSlideShow.appendChild(newCanvas);
        setupDragEvents(newCanvas);

        // add this div as a child
        slideShow.appendChild(newSlideInSlideShow);

        // set it as the main slide
        activeSlideInMain = slideShow.lastChild;
        console.log("Active : ", activeSlideInMain);

        /* ___ on the notes ___ */

        // remove class active to the current slide
        slidesStructure.getElementsByClassName("active")[0].classList.remove("active");

        let slideCreatedString = nbSlidesCreated.toString();

        // create a new note
        var newNoteInSummary = "<p class='slide-" + nbSlidesCreated.toString() + " active'>" + "Slide " + slideCreatedString + "</p>";
        slidesStructure.insertAdjacentHTML("beforeend", newNoteInSummary);

        // set it as the main slide note
        activeSlideNote = slidesStructure.lastChild;

        // add the click listener to toggle the slide note state
        slidesStructure.lastChild.addEventListener("click", (event) => {
            toggleSlideNoteState(event.target);
            showActiveSlideNotes();
        });

        // create notes
        var newNotes = document.createElement("div");
        newNotes.className = "slide-" + nbSlidesCreated.toString() + " slideNote";
        newNotes.setAttribute("contenteditable", "");
        slidesNotes.appendChild(newNotes);
    }

    // show the selected slide
    function toggleSlideShow(selectedSlide) {
        document.getElementById("active").removeAttribute("id");
        selectedSlide.setAttribute("id", "active");
    }

    // show the selected slide's notes
    function toggleSlideNoteState(selectedSlideNote) {
        // remove class name active to the current active element
        activeSlideNote.classList.remove("active");

        // set the selected slide's note class name to active
        selectedSlideNote.classList.add("active");
        activeSlideNote = selectedSlideNote;
    }

    function toggleTitleState() {
        titleStyle = !titleStyle;
    }

    // drawing functions 
    function startDrawing(event) {
        if (!isDrawingMode) return;
        console.log("Im here");
        isDrawing = true;
        currentPath = "";
        var innerDoc = iframe.contentWindow.document;
        currentDrawing = innerDoc.createElementNS("http://www.w3.org/2000/svg", "svg");
        currentDrawing.setAttribute("width", "100%");
        currentDrawing.setAttribute("height", "100%");
        currentDrawing.style.position = "absolute";

        path = innerDoc.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", brushColor);
        path.setAttribute("stroke-width", brushThickness.toString());
        currentDrawing.appendChild(path);
        activeSlideInMain.appendChild(currentDrawing);
        const rec = activeSlideInMain.getBoundingClientRect();
        const x = event.clientX - rec.left;
        const y = event.clientY - rec.top;
        currentPath += `M ${x},${y}`;
    }

    function draw(event) {
        if (!isDrawing) return;
        console.log("Draw");
        const rec = activeSlideInMain.getBoundingClientRect();
        const x = event.clientX - rec.left;
        const y = event.clientY - rec.top;
        currentPath += `L ${x},${y} `;
        path.setAttribute("d", currentPath);
    }

    // toggle drawing mode
    function toggleDrawingMode() {
        if (!activeSlideInMain) return;
        isDrawingMode = !isDrawingMode;
        if (isDrawingMode) {
            console.log("Drawing : ", isDrawingMode);
            activeSlideInMain.addEventListener("mousedown", startDrawing);
            activeSlideInMain.addEventListener("mousemove", draw);
            activeSlideInMain.addEventListener("mouseup", () => isDrawing = false);
            activeSlideInMain.addEventListener("mouseleave", () => isDrawing = false);
        } else {
            console.log("Drawing : ", isDrawingMode);
            activeSlideInMain.removeEventListener("mousedown", startDrawing);
            activeSlideInMain.removeEventListener("mousemove", draw);
            activeSlideInMain.removeEventListener("mouseup", () => isDrawing = false);
            activeSlideInMain.removeEventListener("mouseleave", () => isDrawing = false);
        }
    }

    // add listeners to iframe elements
    function addListenerIframe(document) {
        // add the drag events to the canvas in the document
        document.body.querySelectorAll(".drawing-canvas").forEach(element => {
            setupDragEvents(element);
        });

        // do the same for the text boxes
        document.body.querySelectorAll(".text-box").forEach(element => {
            setupDragEvents(element);
        });
    }

    // add listeners to toolbar buttons
    function addToolbarListeners() {
        // handle the style events
        styleTitle.addEventListener("click", () => {
            addTextStyle();
        });

        // add listeners to buttons
        document.getElementById("addTextBoxBtn").addEventListener("click", addTextBox);
        document.getElementById("addImageBtn").addEventListener("click", addImage);
        document.getElementById("fontSizeInput").addEventListener("input", (event) => {
            fontSize = event.target.value;
            if (activeSlideInMain) {
              const element = document.activeElement;
              if (element && element.classList.contains("text-box")) {
                element.style.fontSize = `${fontSize}px`;
              }
            }
        });
        document.getElementById("brushColorPicker").addEventListener("input", (event) => {
            brushColor = event.target.value;
        });
        document.getElementById("brushThicknessSlider").addEventListener("click", (event) => {
            brushThickness = event.target.value;
        });
        document.getElementById("toggleDrawingModeBtn").addEventListener("click", toggleDrawingMode);
    }

    function init() {
        console.log("Here first");
        // add the click listener to the slide notes in the document
        for(const child of slidesStructure.children) {
            child.addEventListener("click", (event) => { toggleSlideNoteState(event.target) });
        }

        // add the click listener to the slides
        const slides = document.querySelectorAll("#slides p");
        for(const slide of slides) {
            if(slide.id != "newSlide") {
                slide.addEventListener("click", (event) => {
                    toggleSlideShow(event.target);
                    showActiveSlide();
                });
            }
        }

        // handle the new slide creation event
        newBlock.addEventListener("click", () => {
            // create a new slide
            createNewSlide();

            // show the slide
            showActiveSlide();
        });
    }

    iframe.webstrate.on("transcluded", () => {
        var innerDoc = iframe.contentWindow.document;
        if(!innerDoc.style) {
            var link = innerDoc.createElement("style");
            link.id = "style.css";
            innerDoc.head.appendChild(link);
        }
        if(innerDoc.getElementsByClassName("slide").length == 0) {
            var div = innerDoc.createElement("div");
            div.classList.add("slide-1");
            div.classList.add("slide");
            /*var canvas = innerDoc.createElement("canvas");
            canvas.className = "drawing-canvas";
            div.appendChild(canvas);*/
            div.style.height = "100vh";
            innerDoc.body.appendChild(div);
        }
        addListenerIframe(innerDoc);
        addToolbarListeners();
        slideShow = innerDoc.body;
        showActiveSlide();
    });

    init();
});