const deck = document.querySelector('.deck'), // Grab the deck
      close = document.querySelector('.close'),
      moves = document.querySelector('.moves'), // Moves counter
      reset = document.querySelectorAll('.restart'), // Restart button
      cards = document.querySelectorAll('.deck .card'); // Node list containing the cards
      totalMoves = document.querySelector('#total-moves'),
      time = document.querySelector('#total-time'),
      endMessage = document.querySelector('#end-message'),
      result = document.querySelector('#result'),
      rating = document.querySelector('.stars'),
      stars = document.querySelectorAll('.fa-star');
let one, two, // 2 card holders used the selected elements
		match,
    start, end;

const modal = {
  div: document.querySelector('#modal'),
  open: _ => {
    end = Date.now();
    modal.div.style.display = 'block';
    totalMoves.textContent = moves.textContent;
    endMessage.textContent = moves.innerHTML == 24 ? 'You lose!' : 'You win!';
    result.appendChild(rating.cloneNode(true));
    time.textContent = `~${Math.floor((end - start)/1000)} seconds`;
  },
  close: _ => {
    modal.div.style.display = 'none';
    result.innerHTML = '';
  }
}

/*
The deck is sorted by a Grid layout system.
We can easily swap the cards position by changing their order property
*/
const shuffle = _ => {
  [match, start, one, two] = [0,0,0,0] // safety reset
  for (let i = 0; i < stars.length; i++) stars[i].style.color = null; // Inline color attribtue set to nothing
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
};

const rate = _ => {
  if (moves.textContent == 12) stars[2].style.color = 'black';
  else if (moves.textContent == 18) stars[1].style.color = 'black';
  else if (moves.textContent == 24) {
    stars[0].style.color = 'black';
    modal.open();
  }
}

const compare = (a, b) => {
  deck.removeEventListener('pointerdown', flip); // temporary disable the flip function
  moves.textContent++;
  rate();
  [one, two] = [0, 0]; // reset the card holder
  setTimeout(_ => {
    (a.innerHTML === b.innerHTML) ?
      [a.classList.add('match'),
      b.classList.add('match'),
      (++match == cards.length/2) ?
        modal.open() :
        0] :
      [a.classList.remove('open', 'show'), b.classList.remove('open', 'show')]; // flip back the cards

    setTimeout(_ => deck.addEventListener('pointerdown', flip), 0); // toggle back the flip function
  }, 500);
};

const flip = e => {
  if (!start) start = Date.now();
  card = e.target;
  if (card.classList.contains('card')) { // If the clicked element has the "card" class then :
    if (!(card.classList.contains('open', 'show'))) { // check if it is visible. If not, then :
      card.classList.add('open', 'show'); // make it visible
      one ? two ? 0 : two = card : one = card;
      if (one && two) compare(one, two);
    }
  }
};

reset[0].addEventListener('pointerdown', shuffle);
reset[1].addEventListener('pointerdown', _ => [shuffle(), modal.close()]);
close.addEventListener('pointerdown', modal.close);


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