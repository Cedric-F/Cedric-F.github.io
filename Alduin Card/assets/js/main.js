const Alduin = document.getElementById('Alduin')
const prevent = e => e.preventDefault()

Alduin.addEventListener('mouseenter', _ => {
  console.log('Enter')
  Alduin.setAttribute('src', 'assets/img/Alduin.png');
});

Alduin.addEventListener('mouseleave', _ => {
  console.log('Leave');
  Alduin.setAttribute('src', 'assets/img/Alduin2.png');
});

this.addEventListener('contextmenu', prevent)
this.addEventListener('click', prevent)
this.addEventListener('selectstart', prevent)
this.addEventListener('dragstart', prevent)

