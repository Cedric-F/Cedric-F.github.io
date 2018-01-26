'use strict'; // strict mode


/* Variables */

let height, width, row, color;
let drag = false;
let eraser = document.getElementById('eraser');
let border = document.getElementById('borders')
let toggleBorders = document.getElementById('toggle-borders')
const create = document.getElementById('creation-form');
const clear = document.getElementById('clear');
const table = document.getElementById('pixel_canvas');
const colorPicker = document.getElementById('colorPicker');
const cell = document.getElementsByTagName('td');
const audio = document.getElementById('fusrohdah');

/* Functions */

const dye = e => { // colors the cells. if the eraser option is checked, cleanse them instead
	if (!eraser.checked) {
		color = colorPicker.value;
		e.target.style.backgroundColor = color;
	} else {
		e.target.removeAttribute('style');
	}
};

const makeGrid = e => { // add the desired amount of rows and cells to the table.
	e.preventDefault();
	fusrohdah.play();
	table.innerHTML = ""; // empty the table content
	height = document.getElementById('input_height').value;
	width = document.getElementById('input_width').value;

	for (let i = 0; i < height; i++) {
		row = table.insertRow(i);
		for (let j = 0; j < width; j++) {
			row.insertCell(j);
		}
	}

	document.getElementById('box').style.visibility = "visible";
  toggleBorders.innerHTML = "Disable";
  border.checked = false;

	for (let i = 0; i < cell.length; i++) { // add the following eventListeners to all the cells
		cell[i].addEventListener('mousedown', e => { // when holding mouse click, enable drag option and color the clicked cell
			console.log('mousedown');
			e.preventDefault();
			drag = true;
			dye(e);
		});
		cell[i].addEventListener('mouseup', _ => { // when releasing the mouse click, disable the drag option
			console.log('mouseup');
			drag = false;
		});
		cell[i].addEventListener('mouseover', e => { // when hovering over the cells, while mousedown is active, color them
			if (drag) {
				console.log('mouseover');
				dye(e);
			}
		});
	}
};

const clearGrid = _ => { // Navigate through each cell to cleanse the colored ones
	for (let i = 0; i < cell.length; i++) {
		if (cell[i].hasAttribute('style')) {
			cell[i].removeAttribute('style');
		}
	}
};

/* Global event listeners */

create.addEventListener('submit', makeGrid); // create the grid when submitting the form
clear.addEventListener('click', clearGrid); // clear the grid (cleanse colored cells)
table.addEventListener('mouseleave', _ => { // hover outside the grid will cancel the drag option
	drag = false;
});
table.addEventListener('contextmenu', e => { // cancels right click default behavior for the grid (no context menu)
	e.preventDefault();
});
border.addEventListener('change', _ => { // Toggle the visibility of the cells borders
	if (border.checked) {
		toggleBorders.innerHTML = "Enable";
		[].map.call(document.querySelectorAll('tr'), e => e.classList.toggle('border'));
		[].map.call(document.querySelectorAll('td'), e => e.classList.toggle('border'));
	} else {
		toggleBorders.innerHTML = "Disable";
		[].map.call(document.querySelectorAll('tr'), e => e.classList.remove('border'));
		[].map.call(document.querySelectorAll('td'), e => e.classList.remove('border'));
	}
});