/*
 * An old exercise on DOM manipulation. Creates a pyramid of random numbers and find the sum of the smallest number of each row
 */


let line,
    rows = document.getElementById('row'),
    go = document.getElementById('go'),
    solution = document.getElementById('solution'),
    pyramid = document.getElementById('sort');

const makeArray = e => {
  e.preventDefault(); // no reload

  solution.innerHTML = ''; // clear the existing results, if there is any
  pyramid.innerHTML = '';

  line = Array();
  for (let i = 1; i <= rows.value; i++) {
    line.push([... Array(i)]); // add an array of index i and i empty elements
  }
  return add(line.map(e => e.map((e, i) => e = ~~(Math.random() * 10)))); // assign a random value (from 1 to 9) to each sub element
}

const add = n => {
  console.log(n);
  let total = 0;
  for (let i = 0; i < n.length; i++) { // sum of all min numbers
    total += Math.min(...n[i]);
    console.log(Math.min(...n[i]));
  }

  document.getElementById('sort').appendChild(makeUl(n)); // creates the list
  solution.innerHTML = `The solution is ${total}`;
  console.log(solution.innerHTML);
}

const makeUl = n => {
  let list = document.createElement('ul');
  let item;
  for (let i = 0; i < n.length; i++) {
    item = document.createElement('li');
    item.appendChild(document.createTextNode(n[i])); // each line gets an array
    list.appendChild(item);
  }
  return list;
}


go.addEventListener('submit', makeArray);
