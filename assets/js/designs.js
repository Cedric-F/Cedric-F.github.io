"use strict"; // strict mode


/* Variables */

let height, width, row, col, color;
let drag = false;
let eraser = document.getElementById('eraser');
const create = document.getElementById('creation-form');
const clear = document.getElementById('clear');
const table = document.getElementById('pixel_canvas');
const colorPicker = document.getElementById('colorPicker');
const cell = document.getElementsByTagName("td");


/* Functions */

const colors = e => { // colors the cells. if the eraser option is checked, cleanse them instead
	if (!eraser.checked) {
		color = colorPicker.value;
		e.target.style.backgroundColor = color;
	} else {
		e.target.removeAttribute('style');
	}
  }

const makeGrid = evt => { // add the desired amount of rows and cells to the table.
	evt.preventDefault();
    table.innerHTML = ""; // empty the table content
	height = document.getElementById('input_height').value;
	width = document.getElementById('input_width').value;

	for (let i = 0; i < height; i++) {
		row = document.createElement('tr');
		for (let j = 0; j < width; j++) {
			col = document.createElement('td');
			row.appendChild(col);
		}
		table.appendChild(row);
	}

	for (let i = 0; i < cell.length; i++) { // add the following eventListeners to all the cells
		cell[i].addEventListener('mousedown', e => { // when holding mouse click, enable drag option and color the clicked cell
			drag = true;
			console.log('mousedown');
			colors(e);
		});
		cell[i].addEventListener('mouseup', _ => { // when releasing the mouse click, disable the drag option
			console.log('mouseup');
			drag = false;
		});
		cell[i].addEventListener('mouseover', e => { // when hovering over the cells, while mousedown is active, color them
			if (drag) {
				console.log('mouseover');
				colors(e);
			}
		});
	}
}

const clearGrid = _ => { // Navigate through each cell to cleanse the colored ones
	for (let i = 0; i < cell.length; i++) {
		if (cell[i].hasAttribute('style')) {
			cell[i].removeAttribute('style');
		}
	}
}

/* Global event listeners */

create.addEventListener('submit', makeGrid); // create the grid when submitting the form
clear.addEventListener('click', clearGrid); // clear the grid (cleanse colored cells)
table.addEventListener('mouseleave', _ => { // hover outside the grid will cancel the drag option
	drag = false;
});
