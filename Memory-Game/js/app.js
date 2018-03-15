const deck = document.querySelector('.deck'), // Grab the deck
      close = document.querySelector('.close'),
      moves = document.querySelector('.moves'), // Moves counter
      reset = document.querySelectorAll('.restart'), // Restart button
      cards = document.querySelectorAll('.deck .card'); // Node list containing the cards
      totalMoves = document.querySelector('#total-moves'),
      time = document.querySelector('#total-time'),
      endMessage = document.querySelector('#end-message'),
      result = document.querySelector('#result'),
      rating = document.querySelector('.stars'), // Node containing the stars list
      stars = document.querySelectorAll('.fa-star'); // Node list containing the stars
let one, two, // 2 card holders used the selected elements
    match,
    start, end;

const modal = {
  div: document.querySelector('#modal'), // grab the modal element
  open: _ => {
    end = Date.now(); // opening the modal means the end of the game hence the end of the timer. Get the new date in milliseconds
    modal.div.style.display = 'block'; // display the modal
    totalMoves.textContent = moves.textContent; // add the moves value in the stats recap
    endMessage.textContent = moves.innerHTML == 24 ? 'You lose!' : 'You win!'; // Ending message depends on the moves
    result.appendChild(rating.cloneNode(true)); // clone the stars list in the rating recap
    time.textContent = `~${Math.floor((end - start)/1000)} seconds`; // The ellapsed time is equal to the date in the end minus the date at the beginning of the game
  },
  close: _ => {
    modal.div.style.display = 'none'; // make the modal disappear
    result.innerHTML = ''; // reset the rating recap
  }
}

/*
The deck is sorted by a Grid layout system.
We can easily swap the cards position by changing their order property
*/
const shuffle = _ => {
  [match, start, one, two, moves.textContent] = [0,0,0,0,0] // safety reset
  for (let i = 0; i < stars.length; i++) stars[i].style.color = null; // Inline color attribtue set to nothing
  deck.addEventListener('pointerdown', flip);
  let index, order = [...Array(cards.length).keys()]; // Make a list of values from [0 → amount of cards[
  for (card of cards) { // Loop over the cards
    card.classList.remove('open', 'show', 'match'); // Flip the card back.
    index = order[Math.floor(Math.random() * order.length)]; // Grab a random value in our order list.
    order.splice(order.indexOf(index), 1); // Remove this value from the list to avoid duplicates.
    card.style.order = index; // Change the position of the card.
  };
};

const rate = _ => { // Turn the stars in black as the moves add up
  if (moves.textContent == 12) stars[2].style.color = 'black';
  else if (moves.textContent == 18) stars[1].style.color = 'black';
  else if (moves.textContent == 24) {
    stars[0].style.color = 'black';
    modal.open(); // When there are no stars left, end the game
  }
}

const compare = (a, b) => {
  deck.removeEventListener('pointerdown', flip); // temporary disable the flip function
  moves.textContent++; // 2 cards are held in a and b hence count as a move
  rate();
  [one, two] = [0, 0]; // reset the card holder
  setTimeout(_ => {
    (a.innerHTML === b.innerHTML) ? // if a and b match then
      [a.classList.add('match'),
      b.classList.add('match'), // add the match class to both
      (++match == cards.length/2) ? // increment the match value and compare it to the number of pairs in the game
        modal.open() : // if they're equal then the game is won
        0] :
      [a.classList.remove('open', 'show'), b.classList.remove('open', 'show')]; // if a and b don't match then flip back the cards

    setTimeout(_ => deck.addEventListener('pointerdown', flip), 0); // toggle back the flip function
  }, 500);
};

const flip = e => {
  if (!start) start = Date.now(); // check if the start value is already initialized. If not, get the date in milliseconds.
  card = e.target;
  if (card.classList.contains('card')) { // If the clicked element has the "card" class then :
    if (!(card.classList.contains('open', 'show'))) { // check if it is visible. If not, then :
      card.classList.add('open', 'show'); // make it visible
      one ? two ? 0 : two = card : one = card; // Store the card in one of the available card holder
      if (one && two) compare(one, two); // if both the 2 card holders contain a card, then compare them
    }
  }
};

const showResult = _ => {
  Array.prototype.forEach.call(cards, (e, i, a) => {
    a[i].classList.add('open', 'show', 'match');
  })
}

reset[0].addEventListener('pointerdown', shuffle);
reset[1].addEventListener('pointerdown', _ => [shuffle(), modal.close()]);
close.addEventListener('pointerdown', _ => [modal.close(), showResult()]);


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