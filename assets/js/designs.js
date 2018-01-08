let height, width, row, col;
let color = "#000";
const create = document.getElementById('creation-form');
const clear = document.getElementById('clear');
const table = document.getElementById('pixel_canvas');
const colorPicker = document.getElementById('colorPicker');
const cell = document.getElementsByTagName("td");


const makeGrid = (evt) => {
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

const clearGrid = () => {
	for (let i = 0; i < cell.length; i++) {
		if (cell[i].hasAttribute('style')){
			cell[i].removeAttribute('style');
		}
	}
}

const cellColor = (evt) => {
	evt.currentTarget.setAttribute('style', 'background-color:' + color);
}

colorPicker.addEventListener('change', () => {
	color = colorPicker.value;
});

create.addEventListener('submit', makeGrid);
clear.addEventListener('click', clearGrid);