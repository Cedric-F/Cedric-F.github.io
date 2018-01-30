'use strict'; // strict mode


/* Variables */

let color,
    drag = false;

const clear = document.getElementById('clear'),
      cell = document.getElementsByTagName('td'),
      eraser = document.getElementById('eraser'),
      border = document.getElementById('borders'),
      audio = document.getElementById('fusrohdah'),
      width = document.getElementById('input_width'),
      table = document.getElementById('pixel_canvas'),
      height = document.getElementById('input_height'),
      create = document.getElementById('creation-form'),
      colorPicker = document.getElementById('colorPicker'),
      toggleBorders = document.getElementById('toggle-borders');

/* Functions */

const dye = e => // colors the cells. if the eraser option is checked, cleanse them instead
  (!eraser.checked) ?
  e.target.style.backgroundColor = colorPicker.value :
  e.target.removeAttribute('style'),

makeGrid = e => { // add the desired amount of rows and cells to the table.
  e.preventDefault();
  fusrohdah.play();
  table.innerHTML = ""; // empty the table content

  for (let i = 0; i < height.value; i++) {
    let row = table.insertRow(i);
    for (let j = 0; j < width.value; j++) {
      row.insertCell(j);
    }
  }

  document.getElementById('box').style.visibility = "visible";
  toggleBorders.innerHTML = "Disable";
  border.checked = false; // If disabled, toggle the cells borders when creating a new tab

  Array.prototype.map.call(cell, e => { // add the following eventListeners to all the cells
    e.addEventListener('mousedown', e => { // when holding mouse click, enable drag option and color the clicked cell
      console.log('mousedown');
      e.preventDefault();
      drag = true;
      dye(e);
    });
    e.addEventListener('mouseup', _ => { // when releasing the mouse click, disable the drag option
      console.log('mouseup');
      drag = false;
    });
    e.addEventListener('mouseover', e => { // when hovering over the cells, while mousedown is active, color them
      if (drag) {
        console.log('mouseover');
        dye(e);
      }
    });
  });
},

clearGrid = _ => Array.prototype.map.call(cell, e => (e.hasAttribute('style')) ? e.removeAttribute('style') : e);
// Navigate through each cell to cleanse the colored ones

/* Global event listeners */

create.addEventListener('submit', makeGrid); // create the grid when submitting the form
clear.addEventListener('click', clearGrid); // clear the grid (cleanse colored cells)
table.addEventListener('mouseleave', _ => drag = false); // hover outside the grid will cancel the drag option
table.addEventListener('contextmenu', e => e.preventDefault()); // cancels right click default behavior for the grid (no context menu)
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