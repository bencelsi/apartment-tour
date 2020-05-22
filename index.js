// POINT 'N' CLICK

// A template for creating point 'n' click games


(function() {
	"use strict";
	
	const FRAME_PATH = "assets/swamp/"
	const GIF_PATH = "assets/gifs/"
	const OTHER_PATH = "assets/other/"
	const AUDIO_PATH = "assets/audio/"
	const BOX_PATH = "assets/boxes/"
	const INVENTORY_PATH = "assets/inventory/"
	const EXTENSION = ".jpg"
	const HEIGHT = 750;
	const WIDTH = 750;
	const SIDE_SPEED = 400;
	const FADE_SPEED = 400;

	let processes = 0; // whether not to listen to user input
	let frame = 0;
	
	window.onload = function() {
		initView();
	};



//Make boxes objects that can inherit/overrride properties

//MODEL DATA
const frames = { 
	0:{
		left: 4, right: 2, forward: 1
	},1:{
		left: 4, right: 2, forward: 5
	},2:{
		left: 0, right: 3
	},3:{
		left: 3, right: 4
	},4:{
		left: 3, right: 0
	},5:{
		left: 8, right: 6, forward: 13
	},6:{
		left: 5, right: 7
	},7:{
		left: 6, right: 8, forward: 3
	},8:{
		left: 7, right: 5, forward: 9
	},9:{
		left: 12, right: 10
	},10:{
		left: 9, right: 11
	},11:{
		left: 10, right: 12, forward: 6
	},12:{
		left: 11, right: 9
	},13:{
		left: 16, right: 14, forward: 17
	},14:{
		left: 13, right: 15, forward: 28
	},15:{
		left: 14, right: 16, forward: 7
	},16:{
		left: 15, right: 13, forward: 45
	},17:{
		left: 20, right: 18, forward: 33
	},18:{
		left: 17, right: 19, forward: 21
	},19:{
		left: 18, right: 20, forward: 15
	},20:{
		left: 19, right: 17
	},21:{
		left: 24, right: 22
	},22:{
		left: 21, right: 23, forward: 25
	},23:{
		left: 22, right: 24, forward: 20
	},24:{
		left: 23, right: 21
	},25:{
		left: 28, right: 26, forward: 29
	},26:{
		left: 25, right: 27, forward: 16
	},27:{
		left: 26, right: 28, forward: 24 
	},28:{
		left: 27, right: 25
	},29:{
		left: 32, right: 30
	},30:{
		left: 29, right: 31
	},31:{
		left: 30, right: 32, forward: 27
	},32:{
		left: 31, right: 29
	},33:{
		left: 36, right: 34
	},34:{
		left: 33, right: 35, forward: 41
	},35:{
		left: 34, right: 36, forward: 19
	},36:{
		left: 35, right: 33, forward: 37
	},37:{
		left: 40, right: 38
	},38:{
		left: 37, right: 39, forward: 34
	},39:{
		left: 38, right: 40, forward: 34
	},40:{
		left: 39, right: 37
	},41:{
		left: 44, right: 42
	},42:{
		left: 41, right: 43
	},43:{
		left: 42, right: 44, forward: 36
	},44:{
		left: 43, right: 41
	},45:{
		left: 48, right: 46
	},46:{
		left: 45, right: 47
	},47:{
		left: 46, right: 48, forward: 14
	},48:{
		left: 47, right: 45
	}

}

let inventory = {
	0: {
		name: "key",
		state: 0,
		img: "burger",
		targetId: "frontDoor",
		action: ()=>{
			inventory[0].state = 2;
			updatePics(frame);
			updateInventory();
		}
	}
}


//CONTROL DATA
const boxes = {
	standard: {
		left: {
			pos: [0, .2, .2, .8],
			transition: "left",
			cursor: "left"
		},
		right: {
			pos: [.8, 1, .2, .8],
			transition: "right",
			cursor: "right"
		},
		forward: {
			pos: [.25, .75, .25, .75],
			transition: "fade",
			cursor: "forward"
		}
	},
	custom: {
	/*	2:	[{	pos: [.2, .42, .15, .7],
				cursor: "forward",
				addListeners: function(box) {
					box.onclick = ()=>{
						transition(21, "fade");
					};
				}
			}],
		12:	[{	pos: [.2, .4, .15, .7],
				cursor: "forward",
				addListeners: function(box) {
					box.onclick = ()=>{
						transition(17, "fade");
					};
				}
			}],
		19:	[{	pos: [.45, .75, .1, .7],
				cursor: "forward",
				addListeners: function(box) {
					box.onclick = ()=>{
						transition(10, "fade");
					};
				}
			}],
		22:	[{	pos: [.55, .9, 0, .87],
			cursor: "forward",
			addListeners: function(box) {
				box.onclick = ()=>{
					transition(4, "fade");
				};
			}
		}],
		24:	[{	pos: [.45, .5, .2, .25],
				cursor: "forward",
				addListeners: function(box) {
					box.onclick = ()=>{
						transition(25, "none");
					};
				}
			}],

		25:	[{	pos: [.2, .25, .12, .18],
				cursor: "forward",
				addListeners: function(box) {
					box.onclick = ()=>{
						transition(24, "none");
					};
				}
			}],
		*/
	},
	pics: {
	}
}




//******************************************
//*****************VIEW*********************
//******************************************
function initView() {
	importImages();
	makeStandardBoxes();
	updateBoxes(frame);	
	//window.onclick = ()=>launchFullScreen(getById("window"));
}

//only called at init! TODO: replace 
function makeStandardBoxes() {
	makeStandardBox(boxes.standard.left);
	makeStandardBox(boxes.standard.right);
	makeStandardBox(boxes.standard.forward);
} 

//processes and updates boxes, based on the given frame
function updateBoxes(newFrame) {
	frame = newFrame;
	getById("img").src = FRAME_PATH + newFrame + EXTENSION
	updateStandardBoxes(newFrame);
	updateCustomBoxes(newFrame);
}


function updateStandardBoxes(frame) {
	updateStandardBox(boxes.standard.left, frames[frame].left);
	updateStandardBox(boxes.standard.right, frames[frame].right);
	updateStandardBox(boxes.standard.forward, frames[frame].forward);
}

function updateStandardBox(boxData, destinationFrame) {
	let element = boxData.element;
	if (destinationFrame == null) {
		element.style.visibility = "hidden";
	} else {
		element.style.visibility = "visible";
		element.onclick = ()=>{transition(simpleEval(destinationFrame), boxData.transition);};
	}
}



function makeStandardBox(boxData) {
	let box = makeBox(boxData);
	getById("standardBoxes").appendChild(box);
}

//CUSTOM BOXES
function updateCustomBoxes(frame){
	getById("customBoxes").innerHTML = "";
	let boxesData = boxes.custom[frame];
	if (boxesData != null) {			//creates custom boxes
		for (let i = 0; i < boxesData.length; i++) {
			makeCustomBox(boxesData[i]);
		}
	}
}

//returns a box element from a JSON object containing box info, or null if the box shouldn't exist
function makeCustomBox(boxData) {
	if (boxData.condition == null || boxData.condition()) {
		let box = makeBox(boxData);
		
		if(boxData.addListeners != null) {
			boxData.addListeners(box);
		}
		getById("customBoxes").appendChild(box);
	}
}


//INVENTORY BOXES
function updateInventory(){
	getById("inventory").innerHTML = "";
	for (let i = 0; i < 1; i++){
		if (inventory[i].state == 1){
			makeInventoryBox(i);
		}
	}
}

function makeInventoryBox(id){
	let box = document.createElement("div");
	box.classList.add("inventory");
	box.classList.add("box");
	box.style.left = "0px";
	box.style.top = "0px";
	let img = document.createElement("img");
	img.src = INVENTORY_PATH + inventory[id].img + ".png";
	box.appendChild(img);
	makeDraggable(box, inventory[id].targetId, inventory[id].action);
	getById("inventory").appendChild(box);
}

//GENERIC BOXES
function makeBox(boxData) {
	let box = document.createElement("div");
	box.className = "box";
	boxData.element = box;
	setBoxPos(box, boxData.pos);
	setBoxCursor(box, boxData.cursor);
	setBoxId(box, boxData.id);
	return box;
}

function setBoxPos(box, pos) {
	if (pos != null) {
		box.style.left = pos[0] * WIDTH + "px";
		box.style.width = (pos[1] - pos[0]) * WIDTH + "px";
		box.style.bottom = pos[2] * HEIGHT + "px";
		box.style.height = (pos[3] - pos[2]) * HEIGHT + "px";	
	}
}

function setBoxCursor(box, cursor){
	box.style.cursor = "url(" + OTHER_PATH + cursor + ".png), auto";
}

function setBoxId(box, id){
	if (id != null){
		box.id = id;
	}
}

  ///////////////////////
 ///// TRANSITIONS /////
///////////////////////

function transition(newFrame, type) {
	if (processes == 0) {
		processes++;
		createTransition(type + "Out");
		updateBoxes(newFrame);
		createTransition(type+"In");
		setTimeout(()=>{
			getById("transitions").innerHTML = "";
			processes--;
		}, SIDE_SPEED);
	}
}

function createTransition(type) {
	let transition = document.createElement("div");
	
	transition.appendChild(getById("img").cloneNode(true)); //creates duplicate img

	let picBoxes = getById("pics").cloneNode(true);
	picBoxes.id = null;
	transition.appendChild(picBoxes);
	transition.classList.add("transition");
	
	transition.classList.add(type);
	if (type == "leftIn"){
		transition.style.left = -WIDTH + "px";
				
	} else if (type == "rightIn"){
		transition.style.left = WIDTH + "px";
	}
	
	getById("transitions").appendChild(transition);
}

function importImages() {
	for (let i = 1; i <= 11; i++) {
		let preload = new Image();
		preload.src = FRAME_PATH + i + EXTENSION;
		getById("preloads").appendChild(preload);
	}
}











//******************************************
//*****************HELPER*******************
//******************************************
	
	//returns the element with the given id
	function getById(id) {
		return document.getElementById(id);
	}

	//If x is a function, returns the result of evaluating x, otherwise returns x
	function simpleEval(x) {
		if (x instanceof Function) {
			return (x)();
		} else {
			return x;
		}
	}

	//returns true if a and b are overlapping
	function isCollide(a, b) {
    	return !(
     		((a.y + a.height) < (b.y)) ||
      	(a.y > (b.y + b.height)) ||
      	((a.x + a.width) < b.x) ||
      	(a.x > (b.x + b.width))
    	);
	}
	
})();