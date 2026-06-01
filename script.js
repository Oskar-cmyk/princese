const nextButton = document.getElementById("nextButton");
const choiceRow = document.getElementById("choiceRow");
const addWaterButton = document.getElementById("addWaterButton");
const noWaterButton = document.getElementById("noWaterButton");
const endingNote = document.getElementById("endingNote");
const smsLog = document.getElementById("smsLog");

const scenes = [
  {
    name: "Story",
    side: "system",
    text: "E1: Metamorphosis",
  },
  {
    name: "Cleo",
    side: "left",
    text: "Cleo!",
  },
  {
    name: "Matej",
    side: "right",
    text: "Hey, Cleo!",
  },
  {
    name: "Stage direction",
    side: "system",
    text: "[you look around, confused]",
  },
  {
    name: "Matej",
    side: "right",
    text: "Yes, you, Cleo.",
  },
  {
    name: "Matej",
    side: "right",
    text: "We’re in some trouble here. Can you help?",
  },
  {
    name: "Matej",
    side: "right",
    text: "Please? Our Zodiac* won’t let go; we’ve been preconditioned to blow things out of proportion. You know the mermaids, the pool party, the princesses. All we need you to do is just help us a little with the pool.",
  },
  {
    name: "Cleo",
    side: "left",
    text: "approaches I’m not good with pools.",
  },
  {
    name: "Matej",
    side: "right",
    text: "You’ll be fine. Matej* has already taken care of most of it; they brought it from Vienna just now.",
  },
  {
    name: "Cleo",
    side: "left",
    text: "So, what do you need me for?",
  },
  {
    name: "Matej",
    side: "right",
    text: "Well, we need to fill up the pool, right? And how else would we do that, if not by asking every single person invited to bring 3–4 litres of water for it? To just add water.",
  },
  {
    name: "Cleo",
    side: "left",
    text: "Are you serious?",
  },
  {
    name: "Matej",
    side: "right",
    text: "Sadly, yes, but it will be fun! Don’t worry about the rest.",
  },
  {
    name: "Matej",
    side: "right",
    text: "Hmm, actually, never mind, there is one more thing. Definitely worry about the sun! 50 SPF mandatory!",
  },
  {
    name: "Cleo",
    side: "left",
    text: "But I’m confused. Where is the pool, anyway?",
  },
  {
    name: "Matej",
    side: "right",
    text: "Oh, yes, silly us! We’ll inflate it in Tivoli. Monday, the 8th of June!",
  },
];

let sceneIndex = 0;

function resetTheme() {
  document.body.classList.remove("sparkly", "moody");
}

function renderBubble(scene) {
  if (!smsLog || !scene) {
    return;
  }

  const bubble = document.createElement("div");
  bubble.className = `sms-bubble ${scene.side}`;

  const name = document.createElement("span");
  name.className = "sms-name";
  name.textContent = scene.name;

  const text = document.createElement("p");
  text.className = "sms-text";
  text.textContent = scene.text;

  bubble.append(name, text);
  smsLog.append(bubble);
}

function showScene(index) {
  const scene = scenes[index];

  if (!scene || !smsLog) {
    return;
  }

  renderBubble(scene);

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

  if (!smsLog || !endingNote) {
    return;
  }

  renderBubble({
    name: isWaterAdded ? "Ending" : "Ending",
    side: "system",
    text: isWaterAdded
      ? "You add the water. The pool glows, sparkles, and becomes the cutest little summer miracle ever."
      : "You do not add the water. The pool sighs, the vibes go black, and the whole place turns spooky and emo.",
  });

  if (isWaterAdded) {
    endingNote.textContent = "Everything is pink, shiny, and a little bit legendary.";
  } else {
    endingNote.textContent = "No sparkle. Only dramatic silence and one very sad inflatable pool.";
  }

  endingNote.hidden = false;
}

if (nextButton) {
  resetTheme();

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

if (smsLog && scenes.length > 0) {
  renderBubble(scenes[sceneIndex]);
}

if (addWaterButton) {
  addWaterButton.addEventListener("click", () => setEnding(true));
}

if (noWaterButton) {
  noWaterButton.addEventListener("click", () => setEnding(false));
}
