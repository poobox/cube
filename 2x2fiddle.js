// in our 2x2 solved cube: blue is opposite green, orange is opp red, white is opp yellow.
// looking at the green face, adjacent colors going clockwise are: y, o, w, r

// TODO: https://twitter.com/i/status/1593771091738374144 is a better visualization.
// TODO: make it follow standard notation (URT instead of ALT)
// TODO: inputs for DFS vs BFS and implement a depth limit for async iterative DFS.
// TODO: validate dom cube state is viable state (4 of each color, each chusnk is 3 distinct colors) or check each chunk (I did make my state definition intentionally in chunks)

const solvedState = "byrbyoyrgygobrwbowrgwgow";

function toggleColor(cell) {
  // function for modifying the starting position of the cube.
  const classes = cell.classList;
  if (classes.replace("yellow", "blue")) return;
  if (classes.replace("blue", "green")) return;
  if (classes.replace("green", "orange")) return;
  if (classes.replace("orange", "red")) return;
  if (classes.replace("red", "white")) return;
  if (classes.replace("white", "yellow")) return;
  classes.add("white");
}

function cellColor(cell) {
  if (cell.classList.contains("blue")) return "b";
  if (cell.classList.contains("green")) return "g";
  if (cell.classList.contains("orange")) return "o";
  if (cell.classList.contains("red")) return "r";
  if (cell.classList.contains("white")) return "w";
  if (cell.classList.contains("yellow")) return "y";
}
var domCube; // the Element

function domCubeToState() {
  // cubestates are (2) layers of "corners" of which there are only 8.
  // chunks are named by their 3 face colors in the order(where present): back,top,left,front,right,bottom.
  // layers of 3 letter chunks are ordered:
  // top-left-back, top-right-back, top-left-front, top-right-front, bottom-left-back...
  var backFace, topFace, leftFace, frontFace, rightFace, bottomFace;
  for (let i = 0; i < domCube.children.length; i++) {
    if (domCube.children[i].classList.contains("back")) {
      backFace = domCube.children[i];
    } else if (domCube.children[i].classList.contains("top")) {
      topFace = domCube.children[i];
    } else if (domCube.children[i].classList.contains("left")) {
      leftFace = domCube.children[i];
    } else if (domCube.children[i].classList.contains("front")) {
      frontFace = domCube.children[i];
    } else if (domCube.children[i].classList.contains("right")) {
      rightFace = domCube.children[i];
    } else if (domCube.children[i].classList.contains("bottom")) {
      bottomFace = domCube.children[i];
    }
  }
  var tlb, trb, tlf, trf, blb, brb, blf, brf;
  tlb = [cellColor(backFace.children[2]),
         cellColor(topFace.children[0]),
         cellColor(leftFace.children[0])
        ].join('');
  trb = [cellColor(backFace.children[3]),
         cellColor(topFace.children[1]),
         cellColor(rightFace.children[1])
        ].join('');
  tlf = [cellColor(topFace.children[2]),
         cellColor(leftFace.children[1]),
         cellColor(frontFace.children[0])
        ].join('');
  trf = [cellColor(topFace.children[3]),
         cellColor(frontFace.children[1]),
         cellColor(rightFace.children[0])
        ].join('');
  blb = [cellColor(backFace.children[0]),
         cellColor(leftFace.children[2]),
         cellColor(bottomFace.children[2])
        ].join('');
  brb = [cellColor(backFace.children[1]),
         cellColor(rightFace.children[3]),
         cellColor(bottomFace.children[3])
        ].join('');
  blf = [cellColor(leftFace.children[3]),
         cellColor(frontFace.children[2]),
         cellColor(bottomFace.children[0])
        ].join('');
  brf = [cellColor(frontFace.children[3]),
         cellColor(rightFace.children[2]),
         cellColor(bottomFace.children[1])
        ].join('');
  return [tlb, trb, tlf, trf, blb, brb, blf, brf].join('');
}

function splitState(state) {
  var tmp = new Array(8);
  for (let i = 0; i < 27; i += 3) {
    tmp[i / 3] = state.substring(i, i + 3);
  }
  return tmp;
}

function stateToDomCube(state) {
  var backFace, topFace, leftFace, frontFace, rightFace, bottomFace;
  for (let i = 0; i < domCube.children.length; i++) {
    if (domCube.children[i].classList.contains("back")) {
      backFace = domCube.children[i];
    } else if (domCube.children[i].classList.contains("top")) {
      topFace = domCube.children[i];
    } else if (domCube.children[i].classList.contains("left")) {
      leftFace = domCube.children[i];
    } else if (domCube.children[i].classList.contains("front")) {
      frontFace = domCube.children[i];
    } else if (domCube.children[i].classList.contains("right")) {
      rightFace = domCube.children[i];
    } else if (domCube.children[i].classList.contains("bottom")) {
      bottomFace = domCube.children[i];
    }
  }
  var tlb, trb, tlf, trf, blb, brb, blf, brf;
  [tlb,trb,tlf,trf,blb,brb,blf,brf] = splitState(state);

  while(cellColor(backFace.children[2]) != tlb.substring(0,1)) toggleColor(backFace.children[2])
  while(cellColor(topFace.children[0]) != tlb.substring(1,2)) toggleColor(topFace.children[0])
  while(cellColor(leftFace.children[0]) != tlb.substring(2,3)) toggleColor(leftFace.children[0])

  while(cellColor(backFace.children[3]) != trb.substring(0,1)) toggleColor(backFace.children[3])
  while(cellColor(topFace.children[1]) != trb.substring(1,2)) toggleColor(topFace.children[1])
  while(cellColor(rightFace.children[1]) != trb.substring(2,3)) toggleColor(rightFace.children[1])

  while(cellColor(topFace.children[2]) != tlf.substring(0,1)) toggleColor(topFace.children[2])
  while(cellColor(leftFace.children[1]) != tlf.substring(1,2)) toggleColor(leftFace.children[1])
  while(cellColor(frontFace.children[0]) != tlf.substring(2,3)) toggleColor(frontFace.children[0])

  while(cellColor(topFace.children[3]) != trf.substring(0,1)) toggleColor(topFace.children[3])
  while(cellColor(frontFace.children[1]) != trf.substring(1,2)) toggleColor(frontFace.children[1])
  while(cellColor(rightFace.children[0]) != trf.substring(2,3)) toggleColor(rightFace.children[0])

  while(cellColor(backFace.children[0]) != blb.substring(0,1)) toggleColor(backFace.children[0])
  while(cellColor(leftFace.children[2]) != blb.substring(1,2)) toggleColor(leftFace.children[2])
  while(cellColor(bottomFace.children[2]) != blb.substring(2,3)) toggleColor(bottomFace.children[2])

  while(cellColor(backFace.children[1]) != brb.substring(0,1)) toggleColor(backFace.children[1])
  while(cellColor(rightFace.children[3]) != brb.substring(1,2)) toggleColor(rightFace.children[3])
  while(cellColor(bottomFace.children[3]) != brb.substring(2,3)) toggleColor(bottomFace.children[3])

  while(cellColor(leftFace.children[3]) != blf.substring(0,1)) toggleColor(leftFace.children[3])
  while(cellColor(frontFace.children[2]) != blf.substring(1,2)) toggleColor(frontFace.children[2])
  while(cellColor(bottomFace.children[0]) != blf.substring(2,3)) toggleColor(bottomFace.children[0])

  while(cellColor(frontFace.children[3]) != brf.substring(0,1)) toggleColor(frontFace.children[3])
  while(cellColor(rightFace.children[2]) != brf.substring(1,2)) toggleColor(rightFace.children[2])
  while(cellColor(bottomFace.children[1]) != brf.substring(2,3)) toggleColor(bottomFace.children[1])
}


var countElement;
var solutionElement;
var stop = false;

function init() {
  document.getElementById("stopButton").addEventListener('click', event => {
    stop = true;
  });
  domCube = document.getElementById("startCube");
  countElement = document.getElementById("counter");
  solutionElement = document.getElementById("solution");
}

function updateCount(count) {
  label = "searched " + count + " unique states.";
  countElement.textContent = label;
  return count;
}

function showSolution(path) {
  solutionElement.textContent = path;
}

function T() {
  stateToDomCube(rotateTopClock(domCubeToState()));
}
function Tp() {
  stateToDomCube(rotateTopAnti(domCubeToState()));
}
function L() {
  stateToDomCube(rotateLeftClock(domCubeToState()));
}
function Lp() {
  stateToDomCube(rotateLeftAnti(domCubeToState()));
}
function A() {
  stateToDomCube(rotateBackClock(domCubeToState()));
}
function Ap() {
  stateToDomCube(rotateBackAnti(domCubeToState()));
}

// layer rotations

//           0123456789 10 11 12 13 14 15 16 17 18 19 20 21 22 23
//  state = "abcdefghij k  l  m  n  o  p  q  r  s  t  u  v  w  x";
//"BackClock: dfepqrghijklabcmonstuvwx"
function rotateBackClock(state) {
  return "" + state.substring(3,4) + state.substring(5,6) + state.substring(4,5) + state.substring(15,18) +
    state.substring(6,12) + state.substring(0,3) +
    state.substring(12,13) + state.substring(14,15) + state.substring(13,14) + state.substring(18,24);
}

//           0123456789 10 11 12 13 14 15 16 17 18 19 20 21 22 23
//  state = "abcdefghij k  l  m  n  o  p  q  r  s  t  u  v  w  x";
// "BackAnti: mnoacbghijklprqdefstuvwx"
function rotateBackAnti(state){
  return "" + state.substring(12,15) + state.substring(0,1) + state.substring(2,3) + state.substring(1,2) +
    state.substring(6,12) + state.substring(15,16) + state.substring(17,18) + state.substring(16,17) +
    state.substring(3,6) + state.substring(18,24);
}

//           0123456789 10 11 12 13 14 15 16 17 18 19 20 21 22 23
//  state = "abcdefghij k  l  m  n  o  p  q  r  s  t  u  v  w  x";
//"TopClock: hgicbajklefdmnopqrstuvwx"
function rotateTopClock(state){
  return "" + state.substring(7,8) + state.substring(6,7) + state.substring(8,9) +
    state.substring(2,3) + state.substring(1,2) + state.substring(0,1) + state.substring(9,12) +
    state.substring(4,6) + state.substring(3,4) + state.substring(12,24);
}

//           0123456789 10 11 12 13 14 15 16 17 18 19 20 21 22 23
//  state = "abcdefghij k  l  m  n  o  p  q  r  s  t  u  v  w  x";
//"TopAnti: fedljkbacghimnopqrstuvwx"
function rotateTopAnti(state){
  return "" + state.substring(5,6) + state.substring(4,5) + state.substring(3,4) + state.substring(11,12) +
    state.substring(9,11) + state.substring(1,2) + state.substring(0,1) + state.substring(2,3) +
    state.substring(6,9) + state.substring(12,24);
}

//           0123456789 10 11 12 13 14 15 16 17 18 19 20 21 22 23
//  state = "abcdefghij k  l  m  n  o  p  q  r  s  t  u  v  w  x";
//"LeftClock: omndefacbjklustpqrhgivwx"
function rotateLeftClock(state) {
  return "" + state.substring(14,15) + state.substring(12, 14) + state.substring(3, 6) +
    state.substring(0,1) + state.substring(2,3) + state.substring(1,2) +
    state.substring(9,12) + state.substring(20,21) +
    state.substring(18,20) + state.substring(15,18) +  state.substring(7,8) +
    state.substring(6,7) + state.substring(8,9) + state.substring(21,24);
}


//           0123456789 10 11 12 13 14 15 16 17 18 19 20 21 22 23
//  state = "abcdefghij k  l  m  n  o  p  q  r  s  t  u  v  w  x";
//"LeftAnti: gihdeftsujklbcapqrnomvwx"
function rotateLeftAnti(state){
  return "" + state.substring(6,7) + state.substring(8,9) + state.substring(7,8) + state.substring(3,6) +
    state.substring(19,20) + state.substring(18,19) + state.substring(20,21) + state.substring(9,12) +
    state.substring(1,3) + state.substring(0,1) + state.substring(15,18) + state.substring(13,15) +
    state.substring(12,13) + state.substring(21,24);
}

//           0123456789 10 11 12 13 14 15 16 17 18 19 20 21 22 23
//  state = "abcdefghij k  l  m  n  o  p  q  r  s  t  u  v  w  x";
//"FrontClock: abcdeftushigmnopqrvxwkjl"
function rotateFrontClock(state){
  return "" + state.substring(0,6) + state.substring(19,21) + state.substring(18,19) + state.substring(7,9) +
    state.substring(6,7) + state.substring(12,18) + state.substring(21,22) + state.substring(23,24) +
    state.substring(22,23) + state.substring(10,11) + state.substring(9,10) + state.substring(11,12);
}

//           0123456789 10 11 12 13 14 15 16 17 18 19 20 21 22 23
//  state = "abcdefghij k  l  m  n  o  p  q  r  s  t  u  v  w  x";
// "FrontAnti: abcdefljkwvxmnopqrighsut"
function rotateFrontAnti(state){
  return "" + state.substring(0,6) + state.substring(11,12) + state.substring(9,11) + state.substring(22,23) +
    state.substring(21,22) + state.substring(23,24) + state.substring(12,18) + state.substring(8,9) +
    state.substring(6,8) + state.substring(18,19) + state.substring(20,21) + state.substring(19,20);
}

//           0123456789 10 11 12 13 14 15 16 17 18 19 20 21 22 23
//  state = "abcdefghij k  l  m  n  o  p  q  r  s  t  u  v  w  x";
//"RightClock: abcjklghivxwmnoefdsturqp"
function rotateRightClock(state){
  return "" + state.substring(0,3) + state.substring(9,12) + state.substring(6,9) + state.substring(21,22) +
    state.substring(23,24) + state.substring(22,23) + state.substring(12,15) + state.substring(4,6) +
    state.substring(3,4) + state.substring(18,21) + state.substring(17,18) + state.substring(16,17) +
    state.substring(15,16);
}

//           0123456789 10 11 12 13 14 15 16 17 18 19 20 21 22 23
//  state = "abcdefghij k  l  m  n  o  p  q  r  s  t  u  v  w  x";
//"RightAnti: abcrpqghidefmnoxwvstujlk"
function rotateRightAnti(state){
  return "" + state.substring(0,3) + state.substring(17,18) + state.substring(15,17) + state.substring(6,9) +
    state.substring(3,6) + state.substring(12,15) + state.substring(23,24) + state.substring(22,23) +
    state.substring(21,22) + state.substring(18,21) + state.substring(9,10) + state.substring(11,12) +
    state.substring(10,11);
}

//           0123456789 10 11 12 13 14 15 16 17 18 19 20 21 22 23
//  state = "abcdefghij k  l  m  n  o  p  q  r  s  t  u  v  w  x";
//"BottomClock: abcdefghijklstunmovwxqpr"
function rotateBottomClock(state){
  return "" + state.substring(0,12) + state.substring(18,21) + state.substring(13,14) + state.substring(12,13) +
    state.substring(14,15) + state.substring(21,24) + state.substring(16,17) + state.substring(15,16) +
    state.substring(17,18);
}

//           0123456789 10 11 12 13 14 15 16 17 18 19 20 21 22 23
//  state = "abcdefghij k  l  m  n  o  p  q  r  s  t  u  v  w  x";
//"BottomAnti: abcdefghijklqprwvxmnostu"
function rotateBottomAnti(state){
  return "" + state.substring(0,12) + state.substring(16,17) + state.substring(15,16) + state.substring(17,18) +
    state.substring(22,23) + state.substring(21,22) + state.substring(23,24) + state.substring(12,15) + state.substring(18,21);
}



// rotation functions. unoptimized

/*
// chunk rotations
// swap by index
function r01(c) {
return "" + c.charAt(1) + c.charAt(0) + c.charAt(2);
}

function r02(c) {
return "" + c.charAt(2) + c.charAt(1) + c.charAt(0);
}

function r12(c) {
return "" + c.charAt(0) + c.charAt(2) + c.charAt(1);
}

function rotateBackClockSlow(state) {
var tmp, tlb, trb, tlf, trf, blb, brb, blf, brf;
[tlb, trb, tlf, trf, blb, brb, blf, brf] = splitState(state);
return "" +
r12(trb) +
brb +
tlf + trf +
tlb +
r12(blb) +
blf + brf;
}

function rotateBackAntiSlow(state) {
return rotateBackClock(rotateBackClock(rotateBackClock(state)));
}

function rotateTopClockSlow(state) {
// oopsed it and implemented anti first
return rotateTopAnti(rotateTopAnti(rotateTopAnti(state)));
}

function rotateTopAntiSlow(state) {
var tmp, tlb, trb, tlf, trf, blb, brb, blf, brf;
[tlb, trb, tlf, trf, blb, brb, blf, brf] = splitState(state);
return "" +
r02(trb) +
r02(r01(trf)) +
r01(tlb) +
tlf +
blb +
brb +
blf +
brf;
}

function rotateLeftClockSlow(state) {
var tmp, tlb, trb, tlf, trf, blb, brb, blf, brf;
[tlb, trb, tlf, trf, blb, brb, blf, brf] = splitState(state);
return "" +
r12(r02(blb)) +
trb +
r12(tlb) +
trf +
r12(r02(blf)) +
brb +
r01(tlf) +
brf;
}

function rotateLeftAntiSlow(state) {
return rotateLeftClock(rotateLeftClock(rotateLeftClock(state)));
}

function rotateFrontClockSlow(state) {
var tmp, tlb, trb, tlf, trf, blb, brb, blf, brf;
[tlb, trb, tlf, trf, blb, brb, blf, brf] = splitState(state);
return "" +
tlb +
trb +
r01(r02(blf)) +
r12(r01(tlf)) +
blb +
brb +
r12(brf) +
r01(trf);
}

function rotateFrontAntiSlow(state) {
return rotateFrontClock(rotateFrontClock(rotateFrontClock(state)));
}

function rotateRightClockSlow(state) {
var tmp, tlb, trb, tlf, trf, blb, brb, blf, brf;
[tlb, trb, tlf, trf, blb, brb, blf, brf] = splitState(state);
return "" +
tlb +
trf +
tlf +
r12(brf) +
blb +
r12(r01(trb)) +
blf +
r02(brb);
}

function rotateRightAntiSlow(state) {
return rotateRightClock(rotateRightClock(rotateRightClock(state)));
}

function rotateBottomClockSlow(state) {
var tmp, tlb, trb, tlf, trf, blb, brb, blf, brf;
[tlb, trb, tlf, trf, blb, brb, blf, brf] = splitState(state);
return "" +
tlb +
trb +
tlf +
trf +
blf +
r01(blb) +
brf +
r01(brb);
}

function rotateBottomAntiSlow(state) {
return rotateBottomClock(rotateBottomClock(rotateBottomClock(state)));
}

/* tests
console.log("BackClock: " + (rotateBackClock(state) == rotateBackClockSlow(state)));
console.log("BackAnti: " + (rotateBackAnti(state) == rotateBackAntiSlow(state)));
console.log("TopClock: " + (rotateTopClock(state) == rotateTopClockSlow(state)));
console.log("TopAnti: " + (rotateTopAnti(state) == rotateTopAntiSlow(state)));
console.log("LeftClock: " + (rotateLeftClock(state) == rotateLeftClockSlow(state)));
console.log("LeftAnti: " + (rotateLeftAnti(state) == rotateLeftAntiSlow(state)));
console.log("FrontClock: " + (rotateFrontClock(state) == rotateFrontClockSlow(state)));
console.log("FrontAnti: " + (rotateFrontAnti(state) == rotateFrontAntiSlow(state)));
console.log("RightClock: " + (rotateRightClock(state) == rotateRightClockSlow(state)));
console.log("RightAnti: " + (rotateRightAnti(state) == rotateRightAntiSlow(state)));
console.log("BottomClock: " + (rotateBottomClock(state) == rotateBottomClockSlow(state)));
console.log("BottomAnti: " + (rotateBottomAnti(state) == rotateBottomAntiSlow(state)));
*/



var depthLimit = Number.MAX_SAFE_INTEGER;
var maxVisited = Number.MAX_SAFE_INTEGER;

function recursiveDfs(start, end, visited, path, depth) {
  if (depth > depthLimit) return false;
  if (visited.size() > maxVisited) return false;

  if (start == end) return path;
  if (visited.has(start)) return false;
  visited.add(start);

  var tmp = recursiveDfs(rotateBackClock(start), end, visited, path.concat(" A"), depth + 1);
  if (tmp) return tmp;
  tmp = recursiveDfs(rotateTopClock(start), end, visited, path.concat(" T"), depth + 1);
  if (tmp) return tmp;
  tmp = recursiveDfs(rotateLeftClock(start), end, visited, path.concat(" L"), depth + 1);
  if (tmp) return tmp;

  // leaving bottom, front, right fixed
  // tmp = recursiveDfs(rotateFrontClock(start), end, visited, path.concat(" F"), depth + 1);
  // if (tmp) return tmp;
  // tmp = recursiveDfs(rotateRightClock(start), end, visited, path.concat(" R"), depth + 1);
  // if (tmp) return tmp;
  // tmp = recursiveDfs(rotateBottomClock(start), end, visited, path.concat(" B"), depth + 1);
  // if (tmp) return tmp;

  // anti clockwise
  tmp = recursiveDfs(rotateBackAnti(start), end, visited, path.concat(" A'"), depth + 1);
  if (tmp) return tmp;
  tmp = recursiveDfs(rotateTopAnti(start), end, visited, path.concat(" T'"), depth + 1);
  if (tmp) return tmp;
  tmp = recursiveDfs(rotateLeftAnti(start), end, visited, path.concat(" L'"), depth + 1);
  if (tmp) return tmp;
  // leaving bottom, front, right fixed
  // tmp = recursiveDfs(rotateFrontAnti(start), end, visited, path.concat(" F'"), depth + 1);
  // if (tmp) return tmp;
  // tmp = recursiveDfs(rotateRightAnti(start), end, visited, path.concat(" R'"), depth + 1);
  // if (tmp) return tmp;
  // tmp = recursiveDfs(rotateBottomClock(start), end, visited, path.concat(" B'"), depth + 1);
  // if (tmp) return tmp;
  return false;
}

function search(start, end, breadthFirst) {
  var dq = [];
  var currentState;
  var currentPath;
  var visited = new SuperSet();
  dq.push([start, ""]);

  while (dq.length > 0) {
    if (visited.size() > maxVisited){return visited.size();}

    if (breadthFirst) {
      [currentState, currentPath] = dq.shift();
    } else {
      [currentState, currentPath] = dq.pop();
    }
    if (visited.has(currentState)) continue;
    visited.add(currentState);
    if (currentState == end) return currentPath;

    dq.push([rotateBackClock(currentState), currentPath.concat(" A")]);
    dq.push([rotateBackAnti(currentState), currentPath.concat(" A'")]);
    dq.push([rotateTopClock(currentState), currentPath.concat(" T")]);
    dq.push([rotateTopAnti(currentState), currentPath.concat(" T'")]);
    dq.push([rotateLeftClock(currentState), currentPath.concat(" L")]);
    dq.push([rotateLeftAnti(currentState), currentPath.concat(" L'")]);
  }
  return "unsolved";
}


function asyncSearch(start, end, breadthFirst, callback) {
  var dq = [];
  var currentState;
  var currentPath;
  var visited = new Set();
  dq.push([start, ""]);

  var result;
  var iterate = function() {

    if (breadthFirst) {
      [currentState, currentPath] = dq.shift();
    } else {
      [currentState, currentPath] = dq.pop();
    }
    if (visited.has(currentState)) return;

    visited.add(currentState);

    if (currentState == end) {
      result = currentPath;
      return;
    }

    dq.push([rotateBackClock(currentState), currentPath + " A"]);
    dq.push([rotateBackAnti(currentState), currentPath + " A'"]);
    dq.push([rotateTopClock(currentState), currentPath + " T"]);
    dq.push([rotateTopAnti(currentState), currentPath + " T'"]);
    dq.push([rotateLeftClock(currentState), currentPath + " L"]);
    dq.push([rotateLeftAnti(currentState), currentPath + " L'"]);
  }

  var runnerId, updaterId;
  var runsPerInterval = 10;
  var stopAdjusting = false;
  var updaterTime;

  var updater = function() {
    updateCount(visited.size);
    if (stopAdjusting) return;

    if (updaterTime){
      if (2100 > (new Date() - updaterTime)){
	runsPerInterval += 10;
      } else {
	stopAdjusting = true;
    	runsPerInterval -= 5;
	console.log("running " + runsPerInterval + " per interval");
      }
    }
    updaterTime = new Date();
  }

  var runner = function() {
    for (let i=0; i < runsPerInterval; i++) {
      if (dq.length > 0 && !result && !stop) {
        iterate();
      } else if (runnerId) {
        clearInterval(runnerId);
        clearInterval(updaterId);
        updater();
        callback(result);
        break;
      }
    }
  }
  updaterId = setInterval(updater, 2000);
  runnerId = setInterval(runner);
}


function reverseMove(move){
  if(move.length == 1)
    return move + "'";
  else
    return move.substring(0,1);
}

function reversePath(path){
  console.log("path: " + path);
  return " " + path.split(" ").reverse().map(reverseMove).join(" ");
}


function asyncBiSearch(start, end, breadthFirst, callback, visited, otherVisited) {
  // visited is a Map of state to path-from-start
  var dq = [];
  var currentState;
  var currentPath;

  dq.push([start, ""]);

  var result;
  var iterate = function() {

    if (breadthFirst) {
      [currentState, currentPath] = dq.shift();
    } else {
      [currentState, currentPath] = dq.pop();
    }
    if (visited.has(currentState)) return;

    visited.set(currentState, currentPath);

    if (currentState == end) {
      result = currentPath;
      return;
    } else if (otherVisited.has(currentState)){
      console.log("middle: " + otherVisited.get(currentState));
      result = currentPath + reversePath(otherVisited.get(currentState));
      return;
    }

    dq.push([rotateBackClock(currentState), currentPath + " A"]);
    dq.push([rotateBackAnti(currentState), currentPath + " A'"]);
    dq.push([rotateTopClock(currentState), currentPath + " T"]);
    dq.push([rotateTopAnti(currentState), currentPath + " T'"]);
    dq.push([rotateLeftClock(currentState), currentPath + " L"]);
    dq.push([rotateLeftAnti(currentState), currentPath + " L'"]);

    //dq.push([rotateFrontClock(currentState), currentPath + " F"]);
    //dq.push([rotateFrontAnti(currentState), currentPath + " F'"]);
    //dq.push([rotateRightClock(currentState), currentPath + " R"]);
    //dq.push([rotateRightAnti(currentState), currentPath + " R'"]);
    //dq.push([rotateBottomClock(currentState), currentPath + " B"]);
    //dq.push([rotateBottomAnti(currentState), currentPath + " B'"]);
  }

  var runnerId, updaterId;
  var runsPerInterval = 10;
  var stopAdjusting = false;
  var updateTime;
  var updater = function() {
    updateCount("" + (visited.size + otherVisited.size));
    if (stopAdjusting) return;

    if (updateTime){
      if (600 > (new Date() - updateTime)){
	runsPerInterval += 10;
      } else {
	stopAdjusting = true;
	runsPerInterval -= 5;
	console.log("running " + runsPerInterval + " per interval");
      }
    }

    updateTime = new Date();
  }

  var runner = function() {
    for(let i = 0; i < runsPerInterval; i++) {
      if (dq.length > 0 && !result && !stop) {
	iterate();
      } else if (runnerId) {
	clearInterval(runnerId);
	clearInterval(updaterId);
	updater();
	callback(result);
	break;
      }
    }
  }
  updaterId = setInterval(updater, 500);
  runnerId = setInterval(runner);
  return [updaterId, runnerId];
}

function bidirectionalSearch(start, end, callback) {
  var startToEndVisited = new Map();
  var endToStartVisited = new Map();
  var startIntervals = new Array(2);
  var endIntervals = new Array(2);

  var startToEndCallback = function(result){
    clearInterval(endIntervals[0]);
    clearInterval(endIntervals[1]);
    callback(result);
  };

  var endToStartCallback = function(result){
    clearInterval(startIntervals[0]);
    clearInterval(startIntervals[1]);
    if (result) callback(reversePath(result));
    else callback(result);
  };

  var s = asyncBiSearch(start, end, true, startToEndCallback, startToEndVisited, endToStartVisited);
  var e = asyncBiSearch(end, start, true, endToStartCallback, endToStartVisited, startToEndVisited);

  startIntervals[0] = s[0];
  startIntervals[1] = s[1];
  endIntervals[0] = e[0];
  endIntervals[1] = e[1];
}



function runTest() {
  var state = domCubeToState();

  updateCount(0);
  showSolution("");
  console.log("searching from " + state);
  var startTime = new Date();

  console.log("browser-friengly bidirectional bfs search between " + state + " and " + solvedState);
  var startTime = new Date();
  bidirectionalSearch(
    state, solvedState,
    (result) => {
      showSolution("moves to solve from " + state + ": " + result);
      console.log("runtime (ms): " + ((new Date()).getTime() - startTime.getTime()));
      stop = false;
    });

  /* run async bfs
     asyncSearch(state, solvedState, true,
     (result) => {
     console.log("moves to solve: " + result);
     showSolution("moves to solve from " + state + ": " + result);
     console.log("runtime (ms): " + ((new Date()).getTime() - startTime.getTime()));
     stop = false;
     });
     /**/
}

init();
