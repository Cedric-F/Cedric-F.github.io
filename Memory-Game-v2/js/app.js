// Modals related objects
const startModal = document.querySelector('.start'),
      factions = document.querySelector('#factions'),
      start = document.querySelector('#getFaction'),
      endModal = document.querySelector('.end'),
      close = document.querySelectorAll('.close'),
      modals = {
        open: (modal) => modal.style.display = 'block',
        close: (modal) => modal.style.display = 'none'
      },
// Game related objects
      deck = document.querySelector('.deck'),
      cards = document.querySelectorAll('.card');
let faction;

for (let btn of close)
  btn.addEventListener('click', _ => modals.close(startModal) && modals.close(endModal));
start.addEventListener('submit', e => {
  faction = factions.value;
  e.preventDefault();
  modals.close(startModal);

  for (let card of cards) {
    card.childNodes[0].src = `img/Back_cards/${faction}_back.png`;
    card.childNodes[0].classList.add('back');
  }
});

const shuffle = _ => {
  for (let i = 0; i < cards.length; i++) {
    cards[i].childNodes[0].src= `img/Faction_cards/${faction}/card${i+1}.png`;
  }
}

const flip = e => {
  let card = e.target;
  if (card.classList.contains('back')) {
    card.classList.add('front');
    card.classList.remove('back');
  }
}

deck.addEventListener('click', flip);