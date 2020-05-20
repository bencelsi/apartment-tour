(function() {
	"use strict";
	const FRAME_PATH = "assets/frames/test2/"
	const GIF_PATH = "assets/gifs/"
	const OTHER_PATH = "assets/other/"
	const AUDIO_PATH = "assets/audio/"
	const BOX_PATH = "assets/boxes/"
	const INVENTORY_PATH = "assets/inventory/"
	const HEIGHT = 750;
	const WIDTH = 750;
	const SIDE_SPEED = 400;
	const FADE_SPEED = 400;

	let power = false;
	let processes = 0; //whether not to listen to user input
	let frame = 1;
	let lever = 0;

	window.onload = function() {
		initModel();
		initView();
		initController();
	};


//Make boxes objects that can inherit/overrride properties

//MODEL DATA
const frames = { 
	1:{//1
		left: 4, right: 2, forward: 5
	},2:{//2
		left: 1, right: 3, forward: 13
	},3:{//3
		left: 2, right: 4
	},4:{//4
		left: 3, right: 1, forward: 16
	},5:{//5
		left: 8, right: 6
	},6:{//6
		left: 5, right: 7
	},7:{//7
		left: 6, right: 8, forward: 3
	},8:{//8
		left: 7, right: 5, forward: 12
	},9:{//9
		left: 12, right: 10
	},10:{//10
		left: 9, right: 11, forward: 6
	},11:{//11
		left: 10, right: 12
	},12:{//12
		left: 11, right: 9
	},13:{//13
		left: 16, right: 14
	},14:{
		left: 13, right: 15, forward: 2
	},15:{
		left: 14, right: 16
	},16:{
		left: 15, right: 13
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
		},
		back: {
			pos: [0, 1, 0, .2],
			transition: "fade",
			cursor: "back"
		}
	},
	custom: {
		/*
		3:	[{	pos: [.1, .75, .25, .75],
				cursor: "forward",
				addListeners: function(box) {
					box.onclick = ()=>{
						transition(8, "fade");
						playGif("sidepath1", 9, 350);
						playSound("sidepath", 0, false);
					};
				}
			}],
		11:[{	pos: [.05, .2, .25, .75],
				cursor: "zoom",
				addListeners: function(box) {
					box.onclick = ()=>transition(14, "fade");
				}
			}],
		12:[{ pos: [.32, .65, .4, .48],
				condition: ()=>{return(inventory[0].state == 0);},
				cursor: "open",
				addListeners: function(box) {
					box.onclick = ()=>{
						inventory[0].state = 1;
						updateCustomBoxes(frame);
						updatePics(frame);
						updateInventory(frame);
					}
				}
			}],
		14:[{	pos: [.45, .57, .4, .47],
				cursor: "open",
				addListeners: function(box) {
					box.onclick = ()=>{
						power = true;
						updatePics(frame);
					}
				}
			},{condition: ()=>{return(power);},
				img: "x12",
				cursor: "open",
			}],
		16:[{ condition: ()=>{return(inventory[0].state != 3);},
				pos: [.45, .5, .33, .42],
				cursor: "open",
				id: "frontDoor",
				addListeners: function(box) {
					box.onclick = ()=>{
						if (inventory[0].state <= 1){
							//playSound("momoko", 1, true);s
						} else if (inventory[0].state == 2){
							inventory[0].state = 3;
							updatePics(frame);
							updateCustomBoxes(frame);
						}
					}
				}
			}],
		24:[{	pos: [.48, .57, .87, .93],
				cursor: "zoom",
				addListeners: function(box) {
					box.onclick = ()=>{
						transition(12, "fade");
					}
				}
			}]*/
	},
	pics: {
		/*
		12:[{ condition: ()=>{return(inventory[0].state == 0);},
				img: "x12",
			}],
		14: [{ condition: ()=>{console.log(power); return(power == true);},
				img: "x14.1",
		}],
		16:[{	condition: ()=>{return(inventory[0].state == 2);},
				img: "x16.1",
			},{
				condition: ()=>{return(inventory[0].state == 3);},
				img: "x16.2",
			}]*/
	}
}

	
	









//******************************************
//*****************MODEL********************
//******************************************
function initModel() {
	initSounds();
}

function initSounds() {
		let rain = playSound("outsiderain", 1, true);
		//let generator = playSound("reddit", .5, true);
		//json.sounds.rain = rain;
		//json.sounds.rain.volume = 0;	
		rain.volume = .2;
		for (let i = 0; i < 999; i++) {
			//json.sounds.rain.volume += .001;
		}
	}

function setVolume(n, volume, speed) {
		//	json.sounds.n.volume = volume;
}










//******************************************
//*****************CONTROLLER***************
//******************************************
function initController() {
	updateInventory();
}

//makes inventory boxes draggable
function makeDraggable(box, targetId, action) {
	setBoxCursor(box, "open");
	box.onmousedown = function(event) {
		event.preventDefault();
		setBoxCursor(box, "closed");	
		let boxX = parseInt(box.style.left)
		let boxY = parseInt(box.style.top)
		let mouseX = event.clientX
		var mouseY = event.clientY
		
		document.onmousemove = function(event) {
			event.preventDefault();
			box.style.left = boxX + event.clientX - mouseX + "px";
			box.style.top = boxY + event.clientY - mouseY + "px";
		};

		document.onmouseup = function(event) {
			event.preventDefault();
			let target = getById(targetId);
			if (target != null && isCollide(box, target)){
				action();
			} else {
				box.style.left = boxX;
				box.style.top = boxY;
				//setBoxPos(box, [0,0,0,0]);
				document.onmousemove = null;
				setBoxCursor(box, "open");
			}
		};
	};
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
	console.log(newFrame);
	updatePics(newFrame);
	updateStandardBoxes(newFrame);
	updateCustomBoxes(newFrame);
}


//STANDARD BOXES

function updateStandardBoxes(frame) {
	updateStandardBox(boxes.standard.left, frames[frame].left);
	updateStandardBox(boxes.standard.right, frames[frame].right);
	updateStandardBox(boxes.standard.forward, frames[frame].forward);
	updateStandardBox(boxes.standard.back, frames[frame].back);
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
	makeStandardBox(boxes.standard.back);
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




//PIC BOXES
function updatePics(frame){
	getById("pics").innerHTML = "";
	let pics = boxes.pics[frame];
	if (pics != null){
		for (let i = 0; i < pics.length; i++) {
			if (pics[i].condition == null || pics[i].condition()){
				let pic = document.createElement("img");
				pic.classList.add("picBox");
				pic.src = BOX_PATH + simpleEval(pics[i].img) + ".png";
				getById("pics").appendChild(pic);
			}
		}
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

//OTHER
//Plays the gif of the given name.  Takes the number of frames and the delay to calculate the time... (maybe make this automatic somehow?)
function playGif(name, frames, delay) {
	processes++;
	let gif = getById("fullGif");
	gif.src = GIF_PATH + name + ".gif" + "?a="+Math.random();
	gif.style.visibility = "visible"
	getById("movies").appendChild(gif);
	setTimeout(function() {
		gif.style.visibility = "hidden";
		processes--;
	}, frames*delay);	
}

function playSound(name, volume, loop) {
	let sound = new Audio(AUDIO_PATH + name + ".mp3");	
	sound.volume = volume;
	sound.play();
	return sound;
}

//launches full screen mode on the given element.
function launchFullScreen(element) {
	if(element.requestFullScreen) {
	   element.requestFullScreen();
	} else if(element.mozRequestFullScreen) {
	   element.mozRequestFullScreen();
	} else if(element.webkitRequestFullScreen) {
	   element.webkitRequestFullScreen();
	}
}

function importImages() {
	for (let i = 1; i < 13; i++) {
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