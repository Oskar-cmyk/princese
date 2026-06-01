const speaker = document.getElementById("speaker");
const message = document.getElementById("message");
const nextButton = document.getElementById("nextButton");
const choiceRow = document.getElementById("choiceRow");
const addWaterButton = document.getElementById("addWaterButton");
const noWaterButton = document.getElementById("noWaterButton");
const endingNote = document.getElementById("endingNote");

const scenes = [
  {
    speaker: "Cleo",
    message: "Hey, Cleo! You look around, confused, and that is fair because the pool is giving main character energy.",
  },
  {
    speaker: "Matej",
    message: "Matej already hauled the inflatable pool from Vienna. Truly a heroic logistics moment.",
  },
  {
    speaker: "Zodiac",
    message: "Our zodiac has been preconditioning us to be dramatic, so now we need you to make the least dramatic choice possible.",
  },
  {
    speaker: "Cleo",
    message: "We just need one final action: add water, or absolutely refuse to add water and let the scene collapse in style.",
  },
];

let sceneIndex = 0;

function resetTheme() {
  document.body.classList.remove("sparkly", "moody");
}

function showScene(index) {
  const scene = scenes[index];

  if (!scene || !speaker || !message) {
    return;
  }

  resetTheme();
  speaker.textContent = scene.speaker;
  message.textContent = scene.message;

  if (choiceRow) {
    choiceRow.hidden = index !== scenes.length - 1;
  }

  if (endingNote) {
    endingNote.hidden = true;
    endingNote.textContent = "";
  }
}

function setEnding(isWaterAdded) {
  document.body.classList.toggle("sparkly", isWaterAdded);
  document.body.classList.toggle("moody", !isWaterAdded);

  if (choiceRow) {
    choiceRow.hidden = true;
  }

  if (nextButton) {
    nextButton.hidden = true;
  }

  if (!speaker || !message || !endingNote) {
    return;
  }

  if (isWaterAdded) {
    speaker.textContent = "Good ending";
    message.textContent = "You add the water. The pool glows, sparkles, and becomes the cutest little summer miracle ever.";
    endingNote.textContent = "Everything is pink, shiny, and a little bit legendary.";
  } else {
    speaker.textContent = "Bad ending";
    message.textContent = "You do not add the water. The pool sighs, the vibes go black, and the whole place turns spooky and emo.";
    endingNote.textContent = "No sparkle. Only dramatic silence and one very sad inflatable pool.";
  }

  endingNote.hidden = false;
}

if (nextButton) {
  showScene(sceneIndex);

  nextButton.addEventListener("click", () => {
    if (sceneIndex < scenes.length - 1) {
      sceneIndex += 1;
      showScene(sceneIndex);
      return;
    }

    if (choiceRow) {
      choiceRow.hidden = false;
    }

    nextButton.hidden = true;
  });
}

if (addWaterButton) {
  addWaterButton.addEventListener("click", () => setEnding(true));
}

if (noWaterButton) {
  noWaterButton.addEventListener("click", () => setEnding(false));
}
