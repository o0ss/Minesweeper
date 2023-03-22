class Cell {
    constructor() {
        this.isMine = Math.random() < 0.1 ? true : false;
        this.isOpen = false;
        this.isFlagged = false;
    }
}

var rows = 14;
var cols = 20;
var cs_array = Array(rows);
var mine_count = 0;
var lost = false;
var won = false;

window.onload = function() {
    var playerName = sessionStorage.getItem('playerName');
    document.getElementById("player-name-h").innerHTML = playerName;

    let grid = document.getElementById('grid');

    // Fill cells array and html elements
    for (let i = 0; i < cs_array.length; i++) {
        cs_array[i] = Array(cols)
        let new_row = document.createElement('div');
        new_row.classList.add("cell-row");
        new_row.id = 'r' + i.toString();

        for (let j = 0; j < cs_array[i].length; j++) {
            cs_array[i][j] = new Cell();
            if (cs_array[i][j].isMine) mine_count++;
            new_cell = document.createElement('div');
            new_cell.classList.add('cell');
            new_cell.id = i.toString() + '-' + j.toString();
            new_row.appendChild(new_cell);
        }
        grid.appendChild(new_row);
    }

    addClickListenerToCells();

    // document.addEventListener("contextmenu", function(event) {
    //     event.preventDefault();
    // });

    document.getElementById('mine-count').innerHTML = mine_count.toString().padStart(3, '0');

    // Open all
    // let cells = document.getElementsByClassName('cell');
    // for (let i = 0; i < cells.length; i++) {
    //     const c = cells[i];
    //     tryOpen(c);
    // }
};

function addClickListenerToCells() {
    let cells = document.getElementsByClassName('cell');
    let smiley = document.getElementById('smiley');
    for (let i = 0; i < cells.length; i++) {
        const c = cells[i];

        c.addEventListener('click', function (event) {
            if(event.shiftKey) { // CTRL + Click
                tryToggleFlag(this);
            } else { // Click
                tryOpen(this);
            }
        });

        c.addEventListener('mousedown', function() {
            smiley.classList.add('oh');
        });

        c.addEventListener('mouseup', function() {
            smiley.classList.remove('oh');
        });
    }
}

function idToCoords(id) {
    const coords = Array(2);
    coords[0] = id.split('-')[0]; // Row
    coords[1] = id.split('-')[1]; // Column
    return coords;
}

function tryOpen(cell) {
    const coords = idToCoords(cell.id);
    if(!cs_array[coords[0]][coords[1]].isOpen) {
        open(cell, coords);
    }
}

function tryOpenWithCoords(coords) {
    if(!cs_array[coords[0]][coords[1]].isOpen) {
        let id = coords[0].toString() + '-' + coords[1].toString();
        let cell = document.getElementById(id);
        open(cell, coords);
    }
}

function open(cell, coords) {
    cell.classList.add('open');
    cs_array[coords[0]][coords[1]].isOpen = true;

    if(cell.classList.contains('flagged')) cell.classList.remove('flagged');

    if (cs_array[coords[0]][coords[1]].isMine) {
        // Explode and open other mines
        cell.classList.add('mine');
        cell.classList.add('explode');
        document.getElementById('smiley').classList.add('busted');
        lost = true;
        openAllMines();
        return;
    }

    // Count mines around
    let count = getCountMinesAround(coords);
    if (count > 0) {
        cell.innerHTML = count.toString();
        switch (count) {
            case 1:
                cell.classList.add('o1');
                break;
            case 2:
                cell.classList.add('o2');
                break;
            case 3:
                cell.classList.add('o3');
                break;
            case 4:
                cell.classList.add('o4');
                break;
            default:
                cell.classList.add('o5');
        }
    } else {
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        for (let i = Math.max(0,r-1); i < Math.min(rows,r+2); i++) {
            for (let j = Math.max(0,c-1); j < Math.min(cols,c+2) ; j++) {    
                let cs = Array(2);
                cs[0] = i;
                cs[1] = j;
                tryOpenWithCoords(cs)
            }
        }
    }
}

function getCountMinesAround(coords) {
    let count = 0;
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    for (let i = Math.max(0,r-1); i < Math.min(rows,r+2); i++) {
        for (let j = Math.max(0,c-1); j < Math.min(cols,c+2) ; j++) {
            if(cs_array[i][j].isMine)
                count++;
        }
    }
    return count;
}

function tryToggleFlag(cell) {
    let r = parseInt(cell.id.split('-')[0]); // Row
    let c = parseInt(cell.id.split('-')[1]);
    if(cs_array[r][c].isFlagged) {
        cell.classList.remove('flagged');
        cs_array[r][c] = false;
    } else {
        cell.classList.add('flagged');
        cs_array[r][c].isFlagged = true;
    }
}

function openAllMines() {
    let cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        let coords = idToCoords(c.id);
        if(cs_array[coords[0]][coords[1]].isMine){
            c.classList.add('open');
            c.classList.add('mine');
        }
    }
}

function smileyClicked() {
    if(lost == true) location.reload();
}