(function() {
	"use strict";
	const FRAME_PATH = "assets/frames/"
	const GIF_PATH = "assets/gifs/"
	const OTHER_PATH = "assets/other/"
	const AUDIO_PATH = "assets/audio/"
	const BOX_PATH = "assets/boxes/"
	const INVENTORY_PATH = "assets/inventory/"
	const HEIGHT = 750;
	const WIDTH = 750;
	const SIDE_SPEED = 400;
	const FADE_SPEED = 400;

	let processes = 0; //whether not to listen to user input
	let frame = 101;
	
	window.onload = function() {
		initView();
	};


//Make boxes objects that can inherit/overrride properties

//MODEL DATA
const frames = { 
	101:{//1
		left: 103, right: 102, forward: 1
	},102:{//2
		left: 101
	},103:{//3
		right: 101
	},1:{//4
		left: 2, right: 4, forward: 9
	},2:{//5
		left: 3, right: 1
	},3:{//6
		left: 4, right: 2
	},4:{//7
		left: 1, right: 3, forward: 5
	},5:{//8
		left: 8, right: 6
	},6:{//9
		left: 5, right: 7
	},7:{//10
		left: 6, right: 8, forward: 2
	},8:{//11
		left: 7, right: 5
	},9:{//12
		left: 10, right: 12
	},10:{//13
		left: 11, right: 9, forward: 13
	},11:{
		left: 12, right: 10, forward: 3
	},12:{
		left: 9, right: 11
	},13:{
		left: 14, right: 15
	},14:{
		left: 16, right: 13
	},15:{
		left: 13, right: 16
	},16:{
		left: 15, right: 14, forward: 12
	},17:{
		left: 20, right: 18
	},18:{
		left: 17, right: 19
	},19:{
		left: 18, right: 20
	},20:{
		left: 19, right: 17
	},21:{
		left: 24, right: 23
	},22:{
		left: 23, right: 24
	},23:{
		left: 21, right: 22
	},24:{
		left: 22, right: 21
	},25:{
		left: 22, right: 21
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
		2:	[{	pos: [.2, .42, .15, .7],
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


//processess and updates boxes, based on the given frame
function updateBoxes(newFrame) {
	frame = newFrame;
	getById("img").src = FRAME_PATH + newFrame + ".jpg"
	updateStandardBoxes(newFrame);
	updateCustomBoxes(newFrame);
}


//STANDARD BOXES

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

//only called at init! TODO: replace 
function makeStandardBoxes() {
	makeStandardBox(boxes.standard.left);
	makeStandardBox(boxes.standard.right);
	makeStandardBox(boxes.standard.forward);
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

//TRANSITIONS
//make a controller function for this?
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
	for (let i = 1; i <= 25; i++) {
		let preload = new Image();
		preload.src = FRAME_PATH + i + ".jpg";
		getById("preloads").appendChild(preload);
	}
	for (let i = 101; i <= 103; i++) {
		let preload = new Image();
		preload.src = FRAME_PATH + i + ".jpg";
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