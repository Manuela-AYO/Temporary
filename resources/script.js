webstrate.on("loaded", function(webstrateId) {
    var slideShow = document.getElementById("main");
    var newBlock = document.getElementById("newSlide");
    var styleTitle = document.getElementById("activateTitle");
    var styleSubtitle = document.getElementById("activateSubtitle");
    var activeSlideInMain;
    var titleStyle = false;
    var styleEnabled;

    function showActiveSlide() {
        // get the element having the active class
        var activeSlide = document.getElementById("active");

        // take its classes
        var className = activeSlide.className;

        // among the children of main, display the corresponding div
        activeSlideInMain = document.querySelector("." + className + ".slide");
        if(activeSlideInMain) {
            // set his attribute hidden to false
            activeSlideInMain.removeAttribute("hidden");

            // hide the other divs
            for(let i=0; i<slideShow.childElementCount; i++) {
                if(!slideShow.children[i].className.includes(className)) {
                    slideShow.children[i].setAttribute("hidden", "true");
                }
            }
        }
        
    }

    // create a new slide
    function createNewSlide() {
        // count the current number of p element in slides
        var allSlides = document.getElementById("slides");
        var nbSlidesCreated = allSlides.childElementCount - 1;

        // remove the active id to the current slide
        document.getElementById("active").removeAttribute("id");

        // create a new block above the 'add block' + set it to active
        var newSlide = "<p class='slide-" + nbSlidesCreated.toString() + "'" + " id='active'></p>";
        newBlock.insertAdjacentHTML("beforebegin", newSlide);

        // add the click listener to toggle the slide show
        document.getElementById("active").addEventListener("click", (event) => {
            toggleSlideShow(event.target);
        });

        // create the div in the slideshow + give it the necessary attributes
        var newSlideInSlideShow = document.createElement("div");
        newSlideInSlideShow.className = "slide-" + nbSlidesCreated.toString() + " slide";
        newSlideInSlideShow.setAttribute("contenteditable", "");

        // add this div as a child
        slideShow.appendChild(newSlideInSlideShow);

        // set it as the main slide
        activeSlideInMain = slideShow.lastChild;
        console.log("Title style value : ", titleStyle);
    
        if(titleStyle) {
            handleTitleType(styleEnabled);
        } 
    }

    // show the selected slide
    function toggleSlideShow(selectedSlide) {
        document.getElementById("active").removeAttribute("id");
        selectedSlide.setAttribute("id", "active");
        showActiveSlide();
    }

    function toggleTitleState() {
        titleStyle = !titleStyle;
    }

    // define the title's style of the slide
    function handleTitleType(styleClicked) {
        if(!titleStyle) {
            return;
        }

        // get the id of the paragraph clicked
        styleEnabled = styleClicked;

        const list_elements = ["ul", "ol"];
        let previousSibling;

        if(styleClicked == "activateTitle") {
            // assign the clicked element the class active
            styleTitle.className = "active";

            // check if the active slide is already in a list
            var parent = activeSlideInMain.parentElement;
            var parentName = parent.nodeName.toLowerCase();
            console.log("The parent");
            console.log(parent);
            if(activeSlideInMain.previousElementSibling) {
                previousSibling = activeSlideInMain.previousElementSibling.nodeName.toLowerCase();
            }
            else {
                previousSibling = "None";
            }

            console.log(activeSlideInMain);

            console.log("Previous sibling : ");
            console.log(activeSlideInMain.previousElementSibling);
            console.log(previousSibling);

            // if not, put it in a list
            if(parentName == "div" && !list_elements.includes(previousSibling)) {
                console.log("case1");
                // insert it at the main slide position
                activeSlideInMain.insertAdjacentHTML("beforebegin", `<ol></ol>`);

                // get the list
                parent = activeSlideInMain.previousSibling;
                console.log("Parent");
                console.log(parent);
            }
            else if(parentName == "div" && list_elements.includes(previousSibling)) {
                console.log("case2");
                // get the list
                parent = activeSlideInMain.previousElementSibling;
                console.log(parent);
            }
            console.log("case3");
            parent.insertAdjacentHTML("beforeend", "<li></li>");

            // insert the slide in the list
            var listItem = parent.lastChild;
            listItem.appendChild(activeSlideInMain); 
            console.log("parent");
        }
    }

    function init() {
        // add the click listener to the very first slide
        const slides = document.querySelector("#slides");
        slides.children[1].addEventListener("click", (event) => toggleSlideShow(event.target));

        // handle the new slide creation event
        newBlock.addEventListener("click", () => {
            // create a new slide
            createNewSlide();

            // show the slide
            showActiveSlide();
        });

        // check if a title/subtitle style is applied
        const parent = document.getElementById("editor");
        const child = parent.getElementsByClassName("active");
        if(child.length > 0) {
            titleStyle = true;
            styleEnabled = child[0].id;
        }

        // handle the style events
        styleTitle.addEventListener("click", (event) => {
            toggleTitleState();
            handleTitleType(event.target.id);
        });

        styleSubtitle.addEventListener("click", (event) => {
            toggleTitleState();
            handleTitleType(event.target.id);
        });

        showActiveSlide();
    }

    init();
});