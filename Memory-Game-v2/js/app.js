// DOM elements
const deck = document.querySelector('.board'),
      rows = document.querySelectorAll('.row'),
      cards = document.querySelectorAll('.row img'),
      shuffleBtn = document.querySelector('#shuffle'),
      facBtn = document.querySelector('.panel-deck'),
      factions = document.querySelector('.faction'),
      lives = document.querySelectorAll('.gems img'),
      moves = document.querySelector('.count span'),
      start = document.querySelector('#start'),
      dropdown = document.querySelector('.dropdown'),
      dpMenu = document.querySelector('.dropdown-menu'),
      dpOptions = document.querySelectorAll('.option')
      end = document.querySelector('.end'),
      endMsg = document.querySelector('.end #end-message'),
      back = document.querySelector('.deck-back'),
      preview = document.querySelector('#preview img'),
      close = document.querySelector('.off'),
      modal = {
        open: e => {
          e.style.display = "flex";
          endMsg.textContent = game ? "You win!" : "You loose";
        },
        close: e => {
          e.style.display = "none";
          faction ? back.src = `img/back_cards/${faction}_back.png` : 0;
        }
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

const toggleMenu = e => {
  let foo = e.target;
  if (dpMenu.classList.contains('open')) [dpMenu.classList.remove('open'), dpMenu.classList.add('close')];
  else if (dpMenu.classList.contains('close')) [dpMenu.classList.remove('close'), dpMenu.classList.add('open')];
};
const getFaction = e => {
  if (e.target.classList.contains('option')) faction = e.target.dataset.faction;
  preview.src = `img/back_cards/${faction}_back.png`;
}


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
    card.src = `img/back_cards/${faction}_back.png`;
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
    card.src = `img/faction_cards/${faction}/card${card.dataset.value}.png`;
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
      [a.src = `img/back_cards/${faction}_back.png`, b.src = `img/back_cards/${faction}_back.png`];
      [a.classList.remove('open'), b.classList.remove('open')];
    }

    setTimeout(_ => deck.addEventListener('pointerdown', flip), 0); // toggle back the flip function
  }, 750);
};

// Events

dropdown.addEventListener("click", toggleMenu);
dpMenu.addEventListener('click', getFaction);


shuffleBtn.addEventListener('pointerdown', shuffle);
facBtn.addEventListener('pointerdown', _ => modal.open(factions));
start.addEventListener('pointerdown', e => faction ? [modal.close(factions), shuffle()] : 0);
deck.addEventListener('pointerdown', flip);
close.addEventListener('pointerdown', _ => modal.close(end));