const deck = document.querySelector('.deck'), // Grab the deck
      modal = document.querySelector('#modal'),
      moves = document.querySelector('.moves'), // Moves counter
      reset = document.querySelector('.restart'), // Restart button
      cards = document.querySelectorAll('.deck .card'); // Node list containing the cards
let one, two, // 2 card holders used to compare them
		match;

/*
The deck is sorted by a Grid layout system.
We can easily swap the cards position by changing their order property
*/
const shuffle = _ => {
  [one, two] = [0, 0]; // reset the card holder
  deck.addEventListener('pointerdown', flip);
  let index, order = [...Array(cards.length).keys()]; // Make a list of values from [0 → amount of cards[
  for (card of cards) { // Loop over the cards
    card.classList.remove('open', 'show', 'match'); // Flip the card back.
    card.removeAttribute('style'); // Prevents the card from staying red (if the user reset right after a wrong guess)
    index = order[Math.floor(Math.random() * order.length)]; // Grab a random value in our order list.
    order.splice(order.indexOf(index), 1); // Remove this value from the list to avoid duplicates.
    card.style.order = index; // Change the position of the card.
  };
  moves.textContent = 0; // Reset the moves count.
}

const compare = (a, b) => {
  deck.removeEventListener('pointerdown', flip); // temporary disable the flip function
  moves.textContent++;
  [one, two] = [0, 0]; // reset the card holder
  setTimeout(_ => {
    (a.innerHTML === b.innerHTML) ?
      [a.classList.add('match'), b.classList.add('match'), match = document.querySelectorAll('.match')] : // keep the cards visible
      [a.classList.remove('open', 'show'), b.classList.remove('open', 'show')]; // flip back the cards

    setTimeout(_ => deck.addEventListener('pointerdown', flip), 0); // toggle back the flip function
  }, 500);
}

const flip = e => {
  card = e.target;
  if (card.classList.contains('card')) { // If the clicked element has the "card" class then :
    if (!(card.classList.contains('open', 'show'))) { // check if it is visible. If not, then :
      card.classList.add('open', 'show'); // make it visible
      one ? two ? 0 : two = card : one = card;
      if (one && two) compare(one, two);
    }
  }
}

reset.addEventListener('pointerdown', shuffle);
window.onload = shuffle;

/*
Shuffle function from http://stackoverflow.com/a/2450976

function ugly-shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
*/