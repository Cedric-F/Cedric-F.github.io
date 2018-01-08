let height, width, row, col;
let color = "#000";
const create = document.getElementById('creation-form');
const clear = document.getElementById('clear');
const table = document.getElementById('pixel_canvas');
const colorPicker = document.getElementById('colorPicker');
const cell = document.getElementsByTagName("td");


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

const hexToRGB = hex => {
	let r, g, b;
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	r = parseInt(result[1], 16);
    g = parseInt(result[2], 16);
    b = parseInt(result[3], 16);
    return `rgb(${r}, ${g}, ${b})`;
}

const cellColor = evt => {
	evt.currentTarget.setAttribute('style', 'background-color:' + color);
}

const removeColor = evt => {
	let current = evt.currentTarget.hasAttribute('style');
	console.log(current);
}

colorPicker.addEventListener('change', () => {
	color = colorPicker.value;
});

create.addEventListener('submit', makeGrid);
clear.addEventListener('click', clearGrid);