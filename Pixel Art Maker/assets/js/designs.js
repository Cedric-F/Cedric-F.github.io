'use strict'; // strict mode

/* Variables */

let cells,
    drag = false;

const clear = document.getElementById('clear'),
      audio = document.getElementById('shout'),
      color = document.getElementById('color'),
      width = document.getElementById('width'),
      table = document.getElementById('canvas'),
      cell = document.getElementsByTagName('td'),
      height = document.getElementById('height'),
      eraser = document.getElementById('eraser'),
      create = document.getElementById('create'),
      border = document.getElementById('borders'),
      toggleBorders = document.getElementById('toggle-borders');

/* Functions */

const dye = e =>
  !eraser.checked ?
  e.target.style.backgroundColor = color.value :
  e.target.removeAttribute('style');

const clearGrid = _ => cells.map(e => e.hasAttribute('style') ? e.removeAttribute('style') : e);
// Navigate through each cell to cleanse the colored ones

const makeGrid = e => { // Create the table
  e.preventDefault();
  shout.play();
  table.innerHTML = ""; // empty the table content

  for (let i = 0; i < height.value; i++) {
    let row = table.insertRow(i);
    for (let j = 0; j < width.value; j++)
      row.insertCell(j);
  }

  cells = Array.from(cell); // Make an array out of the Dom Collection

  document.getElementById('box').style.visibility = "visible";
  toggleBorders.innerHTML = "Disable";
  border.checked = false; // If disabled, toggle the cells borders when creating a new tab

  cells.map(e => { // add the following eventListeners to all the cells
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
};

/* Global event listeners */

create.addEventListener('submit', makeGrid); // create the grid when submitting the form
clear.addEventListener('click', clearGrid); // clear the grid (cleanse colored cells)
table.addEventListener('mouseleave', _ => drag = false); // hover outside the grid will cancel the drag option
table.addEventListener('contextmenu', e => e.preventDefault()); // cancels right click default behavior for the grid (no context menu)
border.addEventListener('change', _ => { // Toggle the visibility of the cells borders
  if (border.checked) {
    toggleBorders.innerHTML = "Enable";
    Array.prototype.map.call(document.querySelectorAll('tr'), e => e.classList.toggle('border'));
    Array.prototype.map.call(document.querySelectorAll('td'), e => e.classList.toggle('border'));
  } else {
    toggleBorders.innerHTML = "Disable";
    Array.prototype.map.call(document.querySelectorAll('tr'), e => e.classList.remove('border'));
    Array.prototype.map.call(document.querySelectorAll('td'), e => e.classList.remove('border'));
  }
});