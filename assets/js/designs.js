"use strict";

let height, width, row, col, current_color, new_color;
let drag = false;
const create = document.getElementById('creation-form');
const clear = document.getElementById('clear');
const table = document.getElementById('pixel_canvas');
const colorPicker = document.getElementById('colorPicker');
const cell = document.getElementsByTagName("td");

const hexToRGB = hex => {
	let rgb = {
		'r' : parseInt(hex.substr(1,2),16),
		'g' : parseInt(hex.substr(3,2),16),
		'b' : parseInt(hex.substr(5,2),16)
	};
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`; // convert the hex color in the "rgb(r, g, b)" format. e.g: #ffffff -> 255, 255, 255
  }

  const colors = c => { // c for "cell"
  	current_color = c.target.style.backgroundColor; // get the current color of the cell
	new_color = hexToRGB(colorPicker.value); // convert the selected color in rgb

	(current_color !== new_color) // if the two colors don't match (are different)
	? c.target.style.backgroundColor = new_color // apply new color to the cell(s)
	: c.target.removeAttribute('style'); // else remove the color
  }

const makeGrid = evt => {
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
		cell[i].addEventListener('mousedown', e => { // when holding mouse click
			drag = true; // enable drag option
			console.log('mousedown');
			colors(e); // color the cell
		});
		cell[i].addEventListener('mouseup', _ => { // when releasing the mouse click
			console.log('mouseup');
			drag = false; // disable drag option
		});
		cell[i].addEventListener('mouseover', e => { // when hovering over the cells
			if (drag) { // if the drag option is enabled (mousedown) is true then
				console.log('mouseover');
				colors(e); // color the cells
			}
		});
	}
}

const clearGrid = _ => {
	for (let i = 0; i < cell.length; i++) { // navigate through each cell
		if (cell[i].hasAttribute('style')){ // if a cell has a color then
			cell[i].removeAttribute('style'); // remove it
		}
	}
}

create.addEventListener('submit', makeGrid); // create the grid when submitting the form
clear.addEventListener('click', clearGrid); // clear the grid (remove colors)
table.addEventListener('mouseleave', _ => { // hover outside the grid will cancel the drag option
	drag = false;
});
