"use strict";

let height, width, row, col, current_color, new_color;
const create = document.getElementById('creation-form');
const clear = document.getElementById('clear');
const table = document.getElementById('pixel_canvas');
const colorPicker = document.getElementById('colorPicker');
const cell = document.getElementsByTagName("td");

const hexToRGB = hex => {
	let r, g, b;
    r = parseInt(hex.substr(1,2),16);
    g = parseInt(hex.substr(3,2),16);
    b = parseInt(hex.substr(5,2),16);
    return `rgb(${r}, ${g}, ${b})`;
  }

const cellColor = evt => {
	current_color = evt.currentTarget.style.backgroundColor;
	new_color = hexToRGB(colorPicker.value);

	current_color !== new_color
	? evt.currentTarget.style.backgroundColor = new_color
	: evt.currentTarget.removeAttribute('style');
}

const makeGrid = evt => {
	evt.preventDefault();
    table.innerHTML = "";
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

	for (let i = 0; i < cell.length; i++) {
		cell[i].addEventListener('click', cellColor);
	}
}

const clearGrid = _ => {
	for (let i = 0; i < cell.length; i++) {
		if (cell[i].hasAttribute('style')){
			cell[i].removeAttribute('style');
		}
	}
}

create.addEventListener('submit', makeGrid);
clear.addEventListener('click', clearGrid);