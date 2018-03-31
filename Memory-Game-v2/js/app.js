/****************
 * DOM elements *
 ****************/

const end = document.querySelector('.end'), // end game modal
      cog = document.querySelector('.cog'),
      deck = document.querySelector('.board'), // game board
      start = document.querySelector('#start'), // start button
      rows = document.querySelectorAll('.row'), // board rows
      close = document.querySelectorAll('.off'), // modal close buttons
      back = document.querySelector('.deck-back'), // side panel faction back card
      cards = document.querySelectorAll('.row img'),
      factions = document.querySelector('.faction'), // faction selector
      moves = document.querySelector('.count span'),
      settings = document.querySelector('.settings'),
      facBtn = document.querySelector('.panel-deck'), // start game modal opener
      lives = document.querySelectorAll('.gems img'),
      dropdown = document.querySelector('.dropdown'), // faction selector container
      dpArrow = document.querySelector('#arrow-icon'),
      shuffleBtn = document.querySelector('#shuffle'),
      endMsg = document.querySelector('#end-message'),
      dpOptions = document.querySelectorAll('.option'), // faction selector items
      preview = document.querySelector('#preview img'), // faction back card preview in the start game modal
      dpMenu = document.querySelector('.dropdown-menu'), // faction selector menu
      timeScore = document.querySelector('#total-time'),
      movesScore = document.querySelector('#total-moves'),
      livesScore = document.querySelector('#remaining-lives');



/*************
 * Variables *
 *************/

/*
 * faction will be used for a quick access to the different image folders
 * one, two are card holders used to compare the 2 selected cards
 */
let faction,
    game,
    foo,
    count,
    one, two,
    match;

const modal = {
        /*
         * Open the modal. Depending on the game status (true → the user wins) display the ending message
         * Display the scores depending on the gameplay:
         *   ∟ Timer: Display both the ellapsed time, moves, and remaining lives.
         *   ∟ Moves: Display the moves number and the remaining lives. Timer is disabled.
         */
        open: e => {
          e.style.display = 'flex';
          endMsg.textContent = game ? 'You win!' : 'You loose';
          if (moves.textContent) {
            timeScore.textContent = (!userSettings.gameplay.checked) ? [moves.textContent - 45, clearInterval(foo)] : 'Disabled';
            movesScore.textContent = count;
            livesScore.innerHTML = game ? document.querySelector('.gems').outerHTML : 0;
          }
          /*
           * The audio is by default marked as disabled.
           * This conditions checks if it has been enabled by the user.
           * If so, play the modal opening sound.
           */
          if (!userSettings.sound.checked) {
            audio.open.currentTime = 0;
            audio.open.play();
          }
        },

        /*
         * Hide the modal.
         * In the start menu, the deck on the side panel takes the selected faction back face.
         * Suffle the deck
         * If the audio is enabled, play the modal closing sound.
         */
        close: e => {
          e.style.display = 'none';
          if (faction) back.src = preview.src;
          if (e == end && !game) show();
          game = true;
          if (game) shuffle();
          if (!userSettings.sound.checked) {
            audio.close.currentTime = 0;
            audio.close.play();
          }
        }
      };

/*
 * Allows the user to chose the gameplay type.
 * 2 Gameplays are available:
 *    ∟ Timer: Display a timer instead of moves count. It still counts the moves but displays it at the end only
 *    ∟ Moves: The timer is disabled.
 * TODO: Display controls and game rules
 */
const userSettings = {
  sound: document.querySelector('#disabled'),
  gameplay: document.querySelector('#moves'), // moves || timer
  difficulty: document.querySelector("#regular") // regular || hard
};

const audio = {
  open: document.querySelector('audio[data-audio="open"]'),
  close: document.querySelector('audio[data-audio="close"]'),
  flip: document.querySelector('audio[data-audio="flip"]')
};


/*************
 * Functions *
 *************/

/*
 * A simple toggle function that will either open or close the custom faction selector
 */
const toggleMenu = e => {
  let foo = e.target;
  if (dpMenu.classList.contains('open')) {
    dpMenu.classList.remove('open');
    dpMenu.classList.add('close');
    dpArrow.style.transform = 'rotateX(180deg)';
  }
  else if (dpMenu.classList.contains('close')) {
    dpMenu.classList.remove('close');
    dpMenu.classList.add('open');
    dpArrow.style.transform = 'rotateX(0deg)';
  }
};

/*
 * Display a preview of the selected faction card.
 */
const getFaction = e => {
  if (e.target.classList.contains('option')) faction = e.target.dataset.faction;
  preview.src = `img/back_cards/${faction}_back.png`;
}


/*
 * RESET:
 * A safety reset zeroes the counters.
 * The game status is set to "true" (meaning that the "game is on")
 * As long as it's true, the user is a potential winner. They lose if it turns to "false"
 * If the user has selected the Timed gameplay, a countdown is created.
 *    ∟ The user has 45 seconds to complete the game.
 *
 * SHUFFLE:
 * A list of pairs [1 → 8] is created
 * For each element of the cards NodeList, give to its data-value a random element from the order list.
 * Remove the given value from the order list to avoid duplicates.
 * Deal the cards, faces down.
 */
const shuffle = _ => {
  clearInterval(foo);

  moves.textContent = count = one = two = match = 0;
  if (!userSettings.gameplay.checked) {
    moves.textContent = 45;
    foo = setInterval(timer, 1000);
  }
  for (let i = 0; i < 3; i++) lives[i].src = "img/board/ruby.png";

  let order = [...Array(16)].map((e, i) => i > 7 ? i = i - 7 : i + 1),
      card, index;
  for (card of cards) {
    index = order[~~(Math.random() * order.length)];
    card.dataset.value = index;
    card.src = `img/back_cards/${faction}_back.png`;
    card.classList.add('card');
    card.classList.remove('open', 'hold');
    order.splice(order.indexOf(index), 1);
  }
};

/*
 * First check if the clicked element is a card.
 * If the card is already open, do nothing.
 * Else, open the card and store it in one of the 2 card holders.
 * Once both card holders have a card, compare them.
 *
 * If the audio is enabled, play the card flip sound.
 */
const flip = e => {
  let card = e.target.classList.contains('card') ? e.target : null;
  if (card && !card.classList.contains('open')) {
    card.classList.add('open', 'hold');
    if (userSettings.difficulty.checked) card.src = `img/faction_cards/${faction}/card${card.dataset.value}.png`;
    one ? two ? 0 : two = card : one = card;
    (one && two) ? compare(one, two) : 0;
    if (!userSettings.sound.checked) {
      audio.flip.currentTime = 0;
      audio.flip.play();
    }
  }
};

/*
 * Depending on the gameplay, and the moves (or timer) count value, remove the remaining life gems.
 * When there is no remaining gem (the game is done and lost), open the Ending modal.
 */
const rate = _ => {
  let count = moves.textContent;
  if ((userSettings.gameplay.checked && count == 24) || (!userSettings.gameplay.checked && count == 0)) {
    lives[0].src = "";
    game = false;
    modal.open(end);
  } else if ((userSettings.gameplay.checked && count == 18) || (!userSettings.gameplay.checked && count == 12)) {
    lives[1].src = "";
  } else if ((userSettings.gameplay.checked && count == 12) || (!userSettings.gameplay.checked && count == 25)) {
    lives[2].src = "";
  }
};

/*
 * A countdown for the Timer gameplay.
 * If it falls to 0, stop the timer and end the game;
 */
const timer = _ => {
  console.log(--moves.textContent);
  if (!+moves.textContent) {
    clearInterval(foo);
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
  count++;
  if (userSettings.gameplay.checked) moves.textContent = count;
  rate();
  one = two = 0;
  setTimeout(_ => {
    if (a.dataset.value == b.dataset.value) {
      if (!userSettings.difficulty.checked) {
        a.src = `img/faction_cards/${faction}/card${a.dataset.value}.png`;
        b.src = `img/faction_cards/${faction}/card${b.dataset.value}.png`;
      }
      if (++match == 8) modal.open(end);
    } else {
      a.src = `img/back_cards/${faction}_back.png`;
      b.src = `img/back_cards/${faction}_back.png`;
      a.classList.remove('open', 'hold');
      b.classList.remove('open', 'hold');
    }

    setTimeout(_ => deck.addEventListener('pointerdown', flip), 0); // toggle back the flip function
  }, 750);
};

/*
 * Show the cards if the user leaves the end game modal with the cross icon.
 */
const show = _ => {
  cards.forEach(e => e.src = `img/faction_cards/${faction}/card${e.dataset.value}.png`);
};

/**********
 * Events *
 **********/

dropdown.addEventListener('click', toggleMenu);
dpMenu.addEventListener('click', getFaction);

deck.addEventListener('pointerdown', flip);
shuffleBtn.addEventListener('pointerdown', shuffle);
facBtn.addEventListener('pointerdown', _ => modal.open(factions));

cog.addEventListener('pointerdown', _ => modal.open(settings));

close[0].addEventListener('pointerdown', _ => modal.close(settings));
close[1].addEventListener('pointerdown', _ => modal.close(end));


// If a faction is selected, close the modal and shuffle the deck.
start.addEventListener('pointerdown', _ => faction ? modal.close(factions) : 0);

document.addEventListener('keydown', e => {
  switch (e.code) {
    case "Escape":
      if (end.style.display === "flex") modal.close(end)
      else if (settings.style.display === "flex" ) modal.close(settings);
      break;
    /*
    case: "ArrowLeft":
    case: "ArrowUp":
    case: "ArrowRight":
    case: "ArrowDown":
    */
  }
});