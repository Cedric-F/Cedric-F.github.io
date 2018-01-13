let line, rows;
let go = document.getElementById('go');
let arr = document.getElementById('array');
let pyramid = document.getElementById('sort');

const makeArray = e => {
	rows = document.getElementById('row').value;
	e.preventDefault();
	arr.innerHTML = '';
	pyramid.innerHTML = '';
	line = Array();
	for (let i = 1; i <= rows; i++) {
		line.push([... Array(i)]);
	}
	return add(line.map(e => e.map((e, i) => e = Math.floor(Math.random() * (9-1)+1))));
}

const add = n => {
	console.log(n);
	let total = 0;
	for (let i = 0; i < n.length; i++) {
		total += Math.min(...n[i]);
		console.log(Math.min(...n[i]));
	}

	document.getElementById('sort').appendChild(makeUl(n));
	arr.innerHTML = `The solution is ${total}`;
}

const makeUl = n => {
	let list = document.createElement('ul');
	let item;
	for (let i = 0; i < n.length; i++) {
		item = document.createElement('li');
		item.appendChild(document.createTextNode(n[i]));
		list.appendChild(item);
	}
	return list;
}


go.addEventListener('submit', makeArray);