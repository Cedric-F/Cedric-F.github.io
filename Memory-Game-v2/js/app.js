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
    started,
    count,
    focused,
    next,
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
            clearInterval(started);

            timeScore.textContent = (!userSettings.gameplay.checked) ? Math.abs(moves.textContent - 45) : 'Disabled';
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
  difficulty: document.querySelector('#regular'), // regular || hard

  // Styling purpose:
  form: document.querySelector('#user-settings'), // Settings form
  controls: document.querySelector('#controls') // Controls table
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
  if (dpMenu.classList.contains('open')) {
    dpMenu.classList.remove('open');
    dpMenu.classList.add('close');
    dpArrow.style.transform = 'rotateX(180deg)';
  } else if (dpMenu.classList.contains('close')) {
    dpMenu.classList.remove('close');
    dpMenu.classList.add('open');
    dpArrow.style.transform = 'rotateX(0deg)';
  }
};

/*
 * Display the shortcuts table in the settings modal
 */
const toggleControls = e => {
  if (userSettings.form.style.display === 'block') {
    userSettings.form.style.display = 'none';
    userSettings.controls.style.display = 'flex';
  } else if (userSettings.form.style.display !== 'block') {
    userSettings.controls.style.display = 'none';
    userSettings.form.style.display = 'block';
  }
}

/*
 * Get the faction selected by the user and display a preview of the corresponding back face.
 */
const getFaction = e => {
  if (e.target.classList.contains('option')) faction = e.target.dataset.faction;
  preview.src = `img/back_cards/${faction}_back.png`;
}

/*
 * Give a tabIndex to each element quick navigation.
 */
const toggleFocus = _ => {
  focused = true;
  cards.forEach((e, i, a) => a[i].tabIndex = i + 1);
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
  clearInterval(started);

  moves.textContent = count = one = two = match = 0;
  if (!focused) toggleFocus();
  if (!userSettings.gameplay.checked) {
    moves.textContent = 45;
    started = setInterval(timer, 1000);
  }
  for (let i = 0; i < 3; i++) lives[i].src = 'img/board/ruby.png';

  let order = [...Array(16)].map((e, i) => i > 7 ? i = i - 7 : i + 1),
      card, index;
  for (card of cards) {
    index = order[~~(Math.random() * order.length)];
    card.dataset.value = index;
    card.src = `img/back_cards/${faction}_back.png`;
    // For screen readers. Find coordinates (x,y) for each card thanks to their tabIndex.
    card.alt = `card number ${index}. Position (x:${(card.tabIndex > 4 ? card.tabIndex - 4 : card.tabIndex)}, y:${card.tabIndex > 12 ? 4 : (card.tabIndex > 8 ? 3 : (card.tabIndex > 4 ? 2 : 1))})`;
    card.classList.add('card');
    card.classList.remove('open', 'hold');
    order.splice(order.indexOf(index), 1);
  }
};

/*
 * Esc → close any modal OR open settings
 * Arrows (up, right, down, left) → Navigate through the cards with the focus.
 * Space/Enter → Flip the focused card.
 * S → Shuffle
 */

const shortcuts = e => {
  console.log(e.code);
  switch (e.code) {
    case 'Escape':
      if (end.style.display === 'flex') {
        modal.close(end);
      } else if (settings.style.display === 'flex' ) {
        modal.close(settings);
      } else if ((end.style.display === 'none' || end.style.display === '') && (factions.style.display === 'none' || factions.style.display === '') && (settings.style.display === 'none' || settings.style.display === '')) {
        modal.open(settings);
      }
      break;

    case 'ArrowRight':
      if (e.target.classList.contains('card')) {
        next = cards[[...cards].indexOf(e.target) + 1];
        next ? next.focus() : cards[0].focus();
      }
      break;
    case 'ArrowLeft':
      if (e.target.classList.contains('card')) {
        next = cards[[...cards].indexOf(e.target) - 1];
        next ? next.focus() : cards[cards.length - 1].focus();
      }
      break;
    case 'ArrowDown':
      if (e.target.classList.contains('card')) {
        next = cards[[...cards].indexOf(e.target) + 4];
        next ? next.focus() : cards[[...cards].indexOf(e.target) % 4].focus();
      }
      break;
    case 'ArrowUp':
      if (e.target.classList.contains('card')) {
        next = cards[[...cards].indexOf(e.target) - 4];
        next ? next.focus() : cards[[...cards].indexOf(e.target) + 12].focus();
      }
    break;

    case 'Space':
    case 'Enter':
      if (e.target.classList.contains('card') && e.target == document.activeElement) {
        flip(e);
      } else if (e.target.querySelector('input')) {
        e.target.querySelector('input').checked = true;
      }
      break;

    case 'KeyS':
      shuffle();
      break;
    case 'KeyF':
      modal.open(factions);
      break;
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
  let count = +moves.textContent;
  if ((userSettings.gameplay.checked && count == 24) || (!userSettings.gameplay.checked && count == 0)) {
    lives[0].src = ''
    console.log(count);
    game = false;
    modal.open(end);
  } else if ((userSettings.gameplay.checked && count == 18) || (!userSettings.gameplay.checked && count == 12)) {
    lives[1].src = '';
    console.log(count);
  } else if ((userSettings.gameplay.checked && count == 12) || (!userSettings.gameplay.checked && count == 25)) {
    lives[2].src = '';
    console.log(count);
  }
};

/*
 * A countdown for the Timer gameplay.
 * If it falls to 0, stop the timer and end the game;
 */
const timer = _ => {
  console.log(--moves.textContent);
  rate();
  if (!+moves.textContent) {
    clearInterval(started);
    game = false;
    modal.open(end);
  }

}

/*
 * Disable the click listener on the deck during the comparison.
 * Count one move, and check if a life gem is consummed (rate function).
 * Reset the card holders.
 * If the user plays in Hard difficulty, show the cards only when both are flipped.
 * If the 2 cards have the same dataset (a.k.a same card), increment the match counter
 *  ∟ If the counter is 8 (both pairs have been found), open the Ending modal.
 * Else flip back the 2 cards.
 */
const compare = (a, b) => {
  deck.removeEventListener('pointerdown', flip);
  document.removeEventListener('keydown', shortcuts);
  count++;
  if (userSettings.gameplay.checked) moves.textContent = count;
  rate();
  one = two = 0;
  if (!userSettings.difficulty.checked) {
    a.src = `img/faction_cards/${faction}/card${a.dataset.value}.png`;
    b.src = `img/faction_cards/${faction}/card${b.dataset.value}.png`;
  }
  setTimeout(_ => {
    if (a.dataset.value == b.dataset.value) {
      if (++match == 8) modal.open(end);
    } else {
      a.src = `img/back_cards/${faction}_back.png`;
      b.src = `img/back_cards/${faction}_back.png`;
      a.classList.remove('open', 'hold');
      b.classList.remove('open', 'hold');
    }

    setTimeout(_ => {
      deck.addEventListener('pointerdown', flip);
      document.addEventListener('keydown', shortcuts);
    }, 0); // toggle back the flip function
  }, 750);
};

/**********
 * Events *
 **********/

// Start modal events
dropdown.addEventListener('click', toggleMenu);
dpMenu.addEventListener('click', getFaction);
// Launch the game only if a faction is selected.
start.addEventListener('pointerdown', _ => faction ? modal.close(factions) : 0);

// Board events
deck.addEventListener('pointerdown', flip);
shuffleBtn.addEventListener('pointerdown', shuffle);
facBtn.addEventListener('pointerdown', _ => modal.open(factions));

// Settings modal
cog.addEventListener('pointerdown', _ => modal.open(settings));

// End modal
close[0].addEventListener('pointerdown', _ => modal.close(end));


document.addEventListener('keydown', shortcuts);

// Close the modals when taping outside their content area (for mobile users)
document.addEventListener('pointerdown', e => {
  e.target.classList == 'settings' ? modal.close(settings) :
  e.target.classList == 'end' ? modal.close(end) : 0
});

document.querySelector('#slide').addEventListener('pointerdown', toggleControls);