// DOM elements
const deck = document.querySelector('.board'),
      rows = document.querySelectorAll('.row'),
      cards = document.querySelectorAll('.row img'),
      shuffleBtn = document.querySelector('#shuffle'),
      facBtn = document.querySelector('.panel-deck'),
      getFac = document.querySelector('#start'),
      factions = document.querySelector('#factions'),
      lives = document.querySelectorAll('.gems img'),
      moves = document.querySelector('.count span'),
      start = document.querySelector('.faction'),
      end = document.querySelector('.end'),
      endMsg = document.querySelector('.end #end-message'),
      modal = {
        open: e => {
          e.style.display = "block";
          endMsg.textContent = game ? "You win!" : "You loose";
        },
        close: e => e.style.display = "none"
      };

// Variables

/*
 * faction will be used for a quick access to the different image folders
 * one, two are card holders used to compare the 2 selected cards
 */
let faction,
    game,
    one, two,
    match;

// Functions

/*
 * A safety reset zeroes the counters.
 *
 * A list of pairs [1 → 8] is created
 * For each element of the cards NodeList, give to its data-value a random element from the order list.
 * Remove the given value from the order list to avoid duplicates.
 * Deal the cards, faces down.
 */
const shuffle = _ => {

  [moves.textContent, one, two, match] = [0, 0, 0, 0];
  for (let i = 0; i < 3; i++) lives[i].style.display = "inline";

  let order = [...Array(16)].map((e, i) => i > 7 ? i = i - 7 : i + 1),
      card, index;
  for (card of cards) {
    index = order[~~(Math.random() * order.length)];
    card.dataset.value = index;
    card.src = `img/Back_cards/${faction}_back.png`;
    card.classList.add('card');
    card.classList.remove('open');
    order.splice(order.indexOf(index), 1);
  }
};

/*
 * First check if the clicked element is a card.
 * If the card is already open, do nothing.
 * Else, open the card and store it in one of the 2 card holders.
 * Once both card holders have a card, compare them.
 */
const flip = e => {
  game = true;
  let card = e.target.classList.contains('card') ? e.target : null;
  if (card && !card.classList.contains('open')) {
    card.classList.add('open');
    card.src = `img/Faction_cards/${faction}/card${card.dataset.value}.png`;
    one ? two ? 0 : two = card : one = card;
    (one && two) ? compare(one, two) : 0;
  }
};

/*
 * Depending on the moves count value, remove the remaining life gems.
 * When there is no remaining gem, open the Ending modal.
 */
const rate = (count = moves.textContent) => {
  count = moves.textContent;
  if (count == 12) lives[2].style.display = "none";
  else if (count == 18) lives[1].style.display = "none";
  else if (count == 24) {
    lives[0].style.display = "none";
    game = false;
    modal.open(end);
  }
}

/*
 * Disable the click listener on the deck during the comparison.
 * Count one move, and check if a life gem is consummed (rate function).
 * Reset the card holders.
 * If the 2 cards have the same dataset (a.k.a same card), increment the match counter
 *  ∟ If the counter is 8 (both pairs have been found), open the Ending modal.
 * Else flip back the 2 cards.
 */
const compare = (a, b) => {
  deck.removeEventListener('pointerdown', flip);
  moves.textContent++;
  rate();
  [one, two] = [0, 0];
  setTimeout(_ => {
    if (a.dataset.value == b.dataset.value) {
      if (++match == 8) modal.open(end);
    } else {
      [a.src = `img/Back_cards/${faction}_back.png`, b.src = `img/Back_cards/${faction}_back.png`];
      [a.classList.remove('open'), b.classList.remove('open')];
    }

    setTimeout(_ => deck.addEventListener('pointerdown', flip), 0); // toggle back the flip function
  }, 750);
};

// Events

shuffleBtn.addEventListener('pointerdown', shuffle);
facBtn.addEventListener('pointerdown', _ => modal.open(start));
getFac.addEventListener('submit', e => [e.preventDefault(), faction = factions.value, modal.close(start), shuffle()]);
deck.addEventListener('pointerdown', flip);