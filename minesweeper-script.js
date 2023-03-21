class Cell {
    constructor() {
        this.isMine = Math.random() < 0.1 ? true : false;
        this.isOpen = false;
    }
}

var rows = 14;
var cols = 20;
var cs_array = Array(rows);

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
            new_cell = document.createElement('div');
            new_cell.classList.add('cell');
            new_cell.id = i.toString() + '-' + j.toString();
            new_row.appendChild(new_cell);
        }
        grid.appendChild(new_row);
    }
    addClickListenerToCells();

    // Open all
    // let cells = document.getElementsByClassName('cell');
    // for (let i = 0; i < cells.length; i++) {
    //     const c = cells[i];
    //     tryOpen(c);
    // }
};

function addClickListenerToCells() {
    let cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        const c = cells[i];
        c.addEventListener('click', function () {
            tryOpen(this);
        });
    }
}

function tryOpen(cell) {
    const coords = Array(2);
    coords[0] = cell.id.split('-')[0]; // Row
    coords[1] = cell.id.split('-')[1]; // Column
    if(!cs_array[coords[0]][coords[1]].isOpen) {
        cell.classList.add('open');
        if(cs_array[coords[0]][coords[1]].isMine){
            // Explode and open other mines
            cell.classList.add('mine');
            cell.innerHTML = '*'
            cell.classList.add('explode');
        } else {
            // Count mines around
            let count = getCountMinesAround(coords);
            cell.innerHTML = count.toString();
        }
        cs_array[coords[0]][coords[1]].isOpen = true;
    }
}

function getCountMinesAround(coords) {
    console.log(coords);
    let count = 0;
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    console.log(r+'-'+c);
    for (let i = Math.max(0,r-1); i < Math.min(rows,r+2); i++) {
        console.log('i: '+i);
        for (let j = Math.max(0,c-1); j < Math.min(cols,c+2) ; j++) {
            console.log('j: '+j);

            if(cs_array[i][j].isMine)
                count++;
        }
    }
    return count;
}