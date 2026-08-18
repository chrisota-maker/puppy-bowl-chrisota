// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2606-FTB-CT-WEB-PT-PUPPIES"; // Make sure to change this!
const RESOURCE = "/players";
const API = BASE + COHORT + RESOURCE;

// === State ===
let puppies = [];
let selectedPuppy;

/** Updates state with all puppies from the API */
async function getPuppies() {
  try {
    const response = await fetch(API);
    const result = await response.json();
    puppies = result.data.players;

    console.log("Updated puppies:", puppies);

    render();
  } catch (e) {
    console.error(e);
  }
}


/** Updates state with a selected puppy from the API */
async function getPuppy(id) {
  try {
    const response = await fetch(API + "/" + id);
    const result = await response.json();
    selectedPuppy = result.data.player;

    console.log("Selected Puppy:", selectedPuppy);

    render();
  } catch (e) {
    console.error(e);
  }
}

/** Adds a new puppy through the API */
async function addPuppy(puppy) {
  try {
    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(puppy),
    });

    const result = await response.json();

    console.log("Add puppy result:", result);

    if (result.success) {
      await getPuppies();
    } else {
      console.error("Unable to add puppy:", result.error.message);
    }
  } catch (e) {
    console.error(e);
  }
}

/** Removes a puppy through the API */
async function removePuppy(id) {
  try {
    const response = await fetch(API + "/" + id, {
      method: "DELETE",
    });

    const result = await response.json();

    console.log("Remove puppy result:", result);

    if (result.success) {
      selectedPuppy = undefined;
      await getPuppies();
    } else {
      console.error("Unable to remove puppy:", result.error.message);
    }
  } catch (e) {
    console.error(e);
  }
}

/** Creates a list of all puppies */
function PuppyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("puppy-list");

  const $puppies = puppies.map(PuppyListItem);
  $ul.replaceChildren(...$puppies);

  return $ul;
}

/** Creates a list item for one puppy */
function PuppyListItem(puppy) {
  const $li = document.createElement("li");

  $li.innerHTML = `
    <button class="puppy-card" type="button">
      <img
        src="${puppy.imageUrl}"
        alt="${puppy.name}"
      >
      <span>${puppy.name}</span>
    </button>
  `;

  $li.addEventListener("click", () => getPuppy(puppy.id));

  return $li;
}

/** Detailed information about the selected puppy */
function PuppyDetails() {
  if (!selectedPuppy) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a puppy to learn more.";
    return $p;
  }

  const $puppy = document.createElement("section");
  $puppy.classList.add("selected-pup-container");

  $puppy.innerHTML = `
    <img
      class="selected-pup-image"
      src="${selectedPuppy.imageUrl}"
      alt="${selectedPuppy.name}"
    >

    <div class="selected-pup-info">
      <p><strong>Name:</strong> ${selectedPuppy.name}</p>
      <p><strong>ID:</strong> ${selectedPuppy.id}</p>
      <p><strong>Breed:</strong> ${selectedPuppy.breed}</p>
      <p><strong>Team:</strong> ${selectedPuppy.team?.name ?? "No team"}</p>
      <p><strong>Status:</strong> ${selectedPuppy.status}</p>
    </div>

    <button class="selected-pup-button remove-button" type="button">
      Remove From Roster
    </button>
  `;

  const $removeButton = $puppy.querySelector(".remove-button");

  $removeButton.addEventListener("click", () => {
    removePuppy(selectedPuppy.id);
  });

  return $puppy;
}

/** Creates the form used to invite a new puppy */
function NewPuppyForm() {
  const $form = document.createElement("form");
  $form.classList.add("invite-pup-form");

  $form.innerHTML = `
    <h2>Invite A Puppy</h2>

    <label for="name">Name</label>
    <input
      type="text"
      id="name"
      name="name"
      required
    >

    <label for="breed">Breed</label>
    <input
      type="text"
      id="breed"
      name="breed"
      required
    >

    <label for="status">Status</label>
    <select id="status" name="status" required>
      <option value="bench">Bench</option>
      <option value="field">Field</option>
    </select>

    <label for="imageUrl">Image URL</label>
    <input
      type="url"
      id="imageUrl"
      name="imageUrl"
      required
    >

    <button type="submit">Invite Puppy</button>
  `;

  $form.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = new FormData($form);

    const name = data.get("name");
    const breed = data.get("breed");
    const status = data.get("status");
    const imageUrl = data.get("imageUrl");

    addPuppy({
      name,
      breed,
      status,
      imageUrl,
    });
  });

  return $form;
}


//render()
function render() {
  const $app = document.querySelector("#app");

  $app.innerHTML = `
    <header class="page-header">
      <h1>Puppy Bowl</h1>
      <hr>
    </header>

    <section class="puppy-roster" aria-label="Puppy roster">
      <PuppyList></PuppyList>
    </section>
    
    <PuppyDetails></PuppyDetails>

    <NewPuppyForm></NewPuppyForm>
  `;

  $app.querySelector("PuppyList").replaceWith(PuppyList());
  $app.querySelector("PuppyDetails").replaceWith(PuppyDetails());
  $app.querySelector("NewPuppyForm").replaceWith(NewPuppyForm());
}

//init()
async function init() {
  await getPuppies();
}

init();



