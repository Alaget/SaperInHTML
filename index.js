let difficulty = "middle";
function changeDifficulty (value) { 
    difficulty = value;
}

let size;
let flags;
function fieldDefinition () {
    switch (difficulty) {
        case "easy":    
            size = [10, 8];
            flags = 10;
            break;
        case "middle":    
            size = [18, 14];
            flags = 40;
            break;
        case "hard":    
            size = [24, 20];
            flags = 99;
            break;
    }
}

let fieldHidden;
function createFieldHidden () {
    fieldHidden = [];
    for (let y = 0; y != size[1]; y++) {
        fieldHidden.push([]);
        for (let x = 0; x != size[0]; x++) {
            fieldHidden[y].push("E");
        }
    }
}

let fieldMins;
let mins;
function createFieldMins () {
    mins = [];
    for (let i = 0; i != flags; i++) {
        mins.push([Math.floor(Math.random() * size[0]), Math.floor(Math.random() * size[1])]);
        for (let el = 0; el != mins.length; el++) {
            if (mins[i] == mins[el]) {
                mins[i] = [Math.floor(Math.random() * size[0]), Math.floor(Math.random() * size[1])];
            }   
        }
    }

    fieldMins = [];
    for (let y = 0; y != size[1]; y++) { 
        fieldMins.push([]);
        for (let x = 0; x != size[0]; x++) {
            fieldMins[y].push(0);
        }
    }

    for (let i of mins) {
        fieldMins[i[1]][i[0]] = "M";
    }

    for (let y = 0; y != size[1]; y++) {
        for (let x = 0; x != size[0]; x++) {
            if (fieldMins[y][x] == 0) { 
                fieldMins[y][x] = y != 0 && x != 0 && fieldMins[y-1][x-1] == "M"? fieldMins[y][x] + 1 : fieldMins[y][x];
                fieldMins[y][x] = y != 0 && fieldMins[y-1][x] == "M"? fieldMins[y][x] + 1 : fieldMins[y][x];
                fieldMins[y][x] = y != 0 && x != size[0]-1 && fieldMins[y-1][x+1] == "M"? fieldMins[y][x] + 1 : fieldMins[y][x];
                fieldMins[y][x] = x != 0 && fieldMins[y][x-1] == "M"? fieldMins[y][x] + 1 : fieldMins[y][x];
                fieldMins[y][x] = x != size[0]-1 && fieldMins[y][x+1] == "M"? fieldMins[y][x] + 1 : fieldMins[y][x];
                fieldMins[y][x] = y != size[1]-1 && x != 0 && fieldMins[y+1][x-1] == "M"? fieldMins[y][x] + 1 : fieldMins[y][x];
                fieldMins[y][x] = y != size[1]-1 && fieldMins[y+1][x] == "M"? fieldMins[y][x] + 1 : fieldMins[y][x];
                fieldMins[y][x] = y != size[1]-1 && x != size[0]-1 && fieldMins[y+1][x+1] == "M"? fieldMins[y][x] + 1 : fieldMins[y][x]; 
            }
        }
    }
}

let element;
let table;
function createFieldHTML () {
    table = document.querySelector("#gameTable");
    table.innerText = "";
    for (let y = 0; y != size[1]; y++) {
        element = document.createElement("tr");
        element.setAttribute("id", `tr${y}`);
        table.appendChild(element);
        for (let x = 0; x != size[0]; x++) {
            element = document.createElement("td");
            element.setAttribute("id", `td${y}td${x}`);
            if (fieldHidden[y][x] != "E") {
                element.classList.add("obj");
                element.classList.add(`obj${fieldHidden[y][x]}`);
            }
            if (x % 2 == 0 && y % 2 != 0 || x % 2 != 0 && y % 2 == 0) {
                element.classList.add("pl1");
            }
            else if (x % 2 != 0 && y % 2 != 0 || x % 2 == 0 && y % 2 == 0) {
                element.classList.add("pl2");
            }
            element.addEventListener('mousedown', clickEvent);
            element.innerText = fieldHidden[y][x];
            document.querySelector(`#tr${y}`).appendChild(element);
        }
    }
}

let flagsObject;
function displayFlags () {
    flagsObject = document.querySelector("#flags");
    flagsObject.innerText = "Флажки: " + flags;
}

let bodyObject = document.querySelector("body");
let selectObject = document.querySelector("#difficultySelectionList");
bodyObject.setAttribute("oncontextmenu", "return false");
selectObject.addEventListener("change", eventFieldHandler);
function eventFieldHandler (event) {
    workField(event.target.value);
}
function workField (value) {
    changeDifficulty(value);
    fieldDefinition();
    createFieldHidden();
    createFieldMins();
    createFieldHTML();
    displayFlags();
}

let check;
function checkWin () {
    check = true;
    for (let y = 0; y != size[1]; y++) {
        for (let x = 0; x != size[0]; x++) {
            if (fieldMins[y][x] == "M" && fieldHidden[y][x] != "F" || fieldHidden[y][x] == "E") {
                check = false;
            }
        }
    }
    if (check && flags == 0) {
        alert("Вы победили!");
        location.reload();
    }
}

let elementEvent;
let arrayId;
let clickButton;
function clickEvent (event) {
    elementEvent = event.target;
    arrayId = elementEvent.id.split("td");
    clickButton = event.button;
    
    event.preventDefault();
    switch (clickButton) {
        case 0:
            if (fieldHidden[arrayId[1]][arrayId[2]] != "F") {
                if (fieldMins[arrayId[1]][arrayId[2]] == "M") {
                    alert("Вы проиграли!");
                    location.reload();
                }
                fieldHidden[arrayId[1]][arrayId[2]] = fieldMins[arrayId[1]][arrayId[2]];
            }
            break

        case 2:
            if (fieldHidden[arrayId[1]][arrayId[2]] == "F") {
                fieldHidden[arrayId[1]][arrayId[2]] = "E";
                flags++;
            }
            else if (fieldHidden[arrayId[1]][arrayId[2]] == "E") {
                fieldHidden[arrayId[1]][arrayId[2]] = "F";
                flags--;
            }
            break
    }
    displayFlags();
    createFieldHTML();
    checkWin();
}
workField("easy")