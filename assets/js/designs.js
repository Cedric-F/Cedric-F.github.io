let height, width, row, col;
let create = document.getElementById('creation-form');
let table = document.getElementById('pixel_canvas');
let colorPicker = document.getElementById('colorPicker');
let color = "#000";


function makeGrid(evt) {
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

	let cell = document.getElementsByTagName("td");
	for (var i = 0; i < cell.length; i++) {
		cell[i].addEventListener('click', cellColor);
	}
}

function cellColor() {
	this.style.backgroundColor = color;
}

colorPicker.addEventListener('change', function(){
	color = colorPicker.value;
});

create.addEventListener('submit', makeGrid);
clear.addEventListener('onclick', clearGrid);