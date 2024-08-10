let addKittenForm = document.getElementById('add-kitten');
addKittenForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addKitten(e);
});

let clearKittensBtn = document.getElementById('clear-kittens');
clearKittensBtn.addEventListener('click', () => clearKittens());

let kittens = []; // Kittens
/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(e) {
  let form = e.target;
  let kittenName = form.kittenName.value;
  for (let kitten of kittens) {
    if (kitten.name === kittenName) {
      form.reset();
      alert(`You entered: '${kittenName}' but ${kitten.name} already exists.`);
      return;
    }
  }
  let kittenID = generateId();
  /** @type {Kitten} **/
  let kitten = {
    id: kittenID,
    name: kittenName,
    mood: 'curious',
    affection: 0,
  };
  kittens.push(kitten);
  form.reset();
  saveKittens();
  drawKittens();
}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  let collectionOfKittens = JSON.stringify(kittens);
  localStorage.setItem('kittens', collectionOfKittens);
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  let collectionOfKittens = localStorage.getItem('kittens');
  if (!collectionOfKittens) return;
  kittens = JSON.parse(collectionOfKittens);
  drawKittens();
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  let kittensContainer = document.getElementById('kittens-container');
  kittensContainer.innerHTML = '';
  if (!kittens) return;

  kittens.forEach((kitten) => {
    let kittenDiv = document.createElement('div');
    kittenDiv.className = 'kitten';

    let kittenName = document.createElement('p');
    kittenName.textContent = kitten.name;

    let kittenMood = document.createElement('p');
    kittenMood.textContent = `Condition: ${kitten.mood}`;

    let kittenAffection = document.createElement('p');
    kittenAffection.textContent = `Affection: ${kitten.affection}`;

    let kittenImg = document.createElement('img');
    kittenImg.alt = `${kitten.mood} kitten`;
    kittenImg.className = 'kitten-img';

    switch (kitten.mood) {
      case 'furious':
        kittenImg.src = 'images/furious-kitten.png';
        break;
      case 'angry':
        kittenImg.src = 'images/angry-kitten.png';
        break;
      case 'happy':
        kittenImg.src = 'images/happy-kitten.png';
        break;
      case 'tolerant':
        kittenImg.src = 'images/tolerant-kitten.png';
        break;
      default:
        kittenImg.src = 'images/curious-kitten.png';
    }

    let kittenBtns = document.createElement('div');

    let kittenPetBtn = document.createElement('button');
    kittenPetBtn.type = 'button';
    kittenPetBtn.textContent = 'Pet';
    kittenPetBtn.className = 'pet-kitten';
    kittenPetBtn.addEventListener('click', () => pet(kitten.id));

    let kittenCatnipBtn = document.createElement('button');
    kittenCatnipBtn.type = 'button';
    kittenCatnipBtn.textContent = 'Catnip';
    kittenCatnipBtn.className = 'catnip-kitten';
    kittenCatnipBtn.addEventListener('click', () => catnip(kitten.id));

    let deleteKittenBtn = document.createElement('button');
    deleteKittenBtn.type = 'button';
    deleteKittenBtn.textContent = 'Delete';
    deleteKittenBtn.className = 'delete-kitten';
    deleteKittenBtn.addEventListener('click', () => deleteKitten(kitten.id));

    kittenBtns.appendChild(kittenPetBtn);
    kittenBtns.appendChild(kittenCatnipBtn);
    kittenBtns.appendChild(deleteKittenBtn);

    kittenDiv.appendChild(kittenName);
    kittenDiv.appendChild(kittenMood);
    kittenDiv.appendChild(kittenAffection);
    kittenDiv.appendChild(kittenImg);
    kittenDiv.appendChild(kittenBtns);

    kittensContainer.appendChild(kittenDiv);
  });
}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  return kittens.find((k) => k.id === id);
}

// Find kitten within array by its index
function findKittenPosition(id) {
  return kittens.findIndex((k) => k.id === id);
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .5
 * increase the kittens affection
 * otherwise decrease the affection
 * @param {string} id
 */
function pet(id) {
  let kitten = findKittenById(id);
  let random = Math.random();
  if (random > 0.5) {
    kitten.affection += 1;
    setKittenMood(kitten);
  } else {
    kitten.affection -= 1;
    setKittenMood(kitten);
  }
}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * @param {string} id
 */
function catnip(id) {
  let kitten = findKittenById(id);
  kitten.affection = 5;
  kitten.mood = 'tolerant';
  setKittenMood(kitten);
}

function deleteKitten(id) {
  let kittenPosition = findKittenPosition(id);
  if (kittenPosition !== -1) {
    kittens.splice(kittenPosition, 1);
    saveKittens();
    drawKittens();
  }
}

/**
 * Sets the kittens mood based on its affection
 * @param {Kitten} kitten
 */
function setKittenMood(kitten) {
  switch (true) {
    case kitten.affection <= 0:
      kitten.mood = 'furious';
      break;
    case kitten.affection < 5:
      kitten.mood = 'angry';
      break;
    case kitten.affection > 5:
      kitten.mood = 'happy';
      break;
    default:
      kitten.mood = 'tolerant';
      break;
  }

  saveKittens();
  drawKittens();
}

/**
 * Removes all of the kittens from the array
 * remember to save this change
 */
function clearKittens() {
  kittens = [];
  localStorage.removeItem('kittens');
  drawKittens();
}

// --------------------------------------------- No Changes below this line are needed

/**
 * Defines the Properties of a Kitten
 * @typedef {{id:string, name: string, mood: string, affection: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return Math.floor(Math.random() * 10000000) + '-' + Math.floor(Math.random() * 10000000);
}

loadKittens();
