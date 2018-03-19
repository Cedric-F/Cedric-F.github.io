/*
 * This script is used for a little DOM manipulation.
 * Some children of a specific Node need to be nested in another Node.
 * While using JS is not the best practice to deal with responsiveness,
 * It's the best way I've found to efficiently solve this particular issue, without abusing of media queries and absolute/relative positioning
 * which led to different results, some good, somme bad for different devices.
 */

// Grab all the required elements. Nodes and childrens.

const menus = document.querySelector('.side-panel'),
			board = document.querySelector('.board'),
			title = document.querySelector('.title'),
			lives = document.querySelector('.lives'),
			moves = document.querySelector('.moves'),
			rows = document.querySelector('.rows'),
			factions = document.querySelector('.factions'),
			shuffle = document.querySelector('.shuffle-btn'),
			div = document.createElement('div'),
			width = document.documentElement.clientWidth;

const sort = _ => {
	if (width <= 760) {
		board.insertBefore(title, rows);
		board.appendChild(lives);
		div.classList.add('sub');
		div.appendChild(shuffle);
		div.appendChild(moves);
		div.appendChild(factions);
		board.appendChild(div);
		menus.outerHTML = null;
	}
}

window.onload = sort();