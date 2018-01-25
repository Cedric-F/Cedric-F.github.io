let line, rows;
let go = document.getElementById('go');
let arr = document.getElementById('array');
let pyramid = document.getElementById('sort');

const makeArray = e => {
	rows = document.getElementById('row').value; // get rows amount
	e.preventDefault(); // no reload
	arr.innerHTML = ''; // clean the existing results, if there is any
	pyramid.innerHTML = '';
	line = Array(); // Create an empty array
	for (let i = 1; i <= rows; i++) {
		line.push([... Array(i)]); // add array of index i and i empty elements
	}
	return add(line.map(e => e.map((e, i) => e = Math.floor(Math.random() * (10-1)+1)))); // assign a random value (from 1 to 9) to each sub element
}

const add = n => {
	console.log(n);
	let total = 0;
	for (let i = 0; i < n.length; i++) { // sum of all min numbers
		total += Math.min(...n[i]);
		console.log(Math.min(...n[i]));
	}

	document.getElementById('sort').appendChild(makeUl(n)); // creates the list
	arr.innerHTML = `The solution is ${total}`;
	console.log(`The solution is ${total}`);
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