/*
To make the code cleaner I downloaded the images and renamed each of them:
kitten + the desired index of the image.
So the first image is named kitten0.jpg, and so on.
*/

let contents = [... Array(5)], // Make an array of 5 elements
    frag = document.createDocumentFragment(), // A Document Fragment is a Node that isn't part of the DOM (yet)
    container = document.querySelector('.container1'), // Get the container in which we want our images to be stored
    img = document.createElement('img'),
    shuffleButton = document.querySelector('button');

contents.forEach((_, i) => { // for Each element of the array created above:
  let div = document.createElement('div'), // Create a div
      txt = `<h3>Kitten${i}</h3>Cute kitten.`; // To add some text to the image afterwards
  img.setAttribute(`src`, `img/kitten${i}.jpg`); // Add the source attribute to the img, using the index variable to locate it.
  img.setAttribute(`alt`, `A Kitten`);
  div.appendChild(img); // Add the image to the created div.
  div.innerHTML += txt; // Add the text to the div, after the image.
  div.style.order = i; // Add an order to the div. Only works if using a grid system
  frag.appendChild(div); // Add the div to the fragment
});

container.appendChild(frag); // Insert the fragment in the container.

const shuffle = _ => {
  let divs = container.querySelectorAll('div') // Make a Node List out of the divs in the container
  let order = [... Array(5).keys()]; // Make an array of 5 elements and assign them their index value → [0,1,2,3,4]
  for (div of divs) { // Treat the Node List as like an array, and for each element:
    let index = order[Math.floor(Math.random() * order.length)] // Generate a random index taken from the order array
    console.log(order, index)
    order.splice(order.indexOf(index), 1); // Remove the value from the order array to avoid duplicates
    div.style.order = index; // change the order attribute of the div.
  };
};

shuffleButton.addEventListener('click', shuffle)