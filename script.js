const textReveal = document.getElementById("textReveal");
const endingNote = document.getElementById("endingNote");
const lockScreen = document.getElementById("lockScreen");
const lockForm = document.getElementById("lockForm");
const accessCodeInput = document.getElementById("accessCode");
const lockMessage = document.getElementById("lockMessage");
const relockButton = document.getElementById("relockButton");

const unlockSessionKey = "princeseUnlockedSession";
const waterTotalKey = "princeseWaterTotal";
const waterEntriesKey = "princeseWaterEntries";
const youtubeSongUrl = "https://www.youtube.com/watch?v=SJi9WILdmcM";
const acceptedCodes = new Set(["h2o", "water", "voda"]);

const lines = [
  "Narrator: Cleo!",
  "Narrator: Hey, Cleo!",
  "Stage direction: [you look around, confused]",
  "Narrator: Yes, *you*, Cleo.",
  "Narrator: We’re in some trouble here. Can you help?",
  "Narrator: Please? Our Zodiac\\* won’t let go; we’ve been preconditioned to blow things out of proportion. You know the mermaids, the pool party, the princesses. All we need you to do is just help us a little with the pool.",
  "Cleo: *approaches* I’m not good with pools.",
  "Narrator: You’ll be fine. Matej\\* has already taken care of most of it; they brought it from Vienna just now.",
  "Cleo: So, what do you need *me* for?",
  "Narrator: Well, we need to fill up the pool, right? And how else would we do that, if not by asking every single person invited to bring 💧💧💧 3–4 litres of water 💧💧💧for it? To *just add water*.",
  "Cleo: Are you serious?",
  "Narrator: Sadly, yes, but it will be fun! Don’t worry about the rest.",
  "Narrator: Hmm, actually, never mind, there is one more thing. Definitely worry about the sun! 50 SPF mandatory!",
  "Cleo: But I’m confused. Where is the pool, anyway?",
  "Narrator: ✨Oh, yes, silly us!✨ ",
  "✨We'll inflate it in Tivoli. Monday, the 8th of June after 16h!✨",
  "Narrator: We'll keep you posted on the details. 🌊",
  "+1 welcome<3",
  
];

let lineIndex = 0;
let timerId = null;
let choiceVisible = false;
let storyEnded = false;
let choiceBlock = null;
let confirmationBlock = null;
let isUnlocked = false;
let selectedWaterLevel = 0;
let waterMeterShown = false;

const choicePointIndex = 10;

function addLine(lineData) {
  if (!textReveal) return;

  const line = document.createElement("div");
  line.className = "text-line";
  // mark the final line so it can be styled as bold
  if (lineIndex === lines.length - 3) {
    line.classList.add("last");
  }

  const speakerMatch = lineData.match(/^([^:]+):\s*(.*)$/);
  const speakerText = speakerMatch ? speakerMatch[1].trim() : "";
  const bodyText = speakerMatch ? speakerMatch[2] : lineData;

  if (speakerText) {
    const speaker = document.createElement("div");
    speaker.className = "speaker";
    speaker.textContent = speakerText;
    line.append(speaker);
  }

  const text = document.createElement("div");
  text.className = "line-text";

  bodyText.split(/(\*[^*]+\*)/).forEach((part) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 1) {
      const italic = document.createElement("i");
      italic.textContent = part.slice(1, -1).replaceAll("\\*", "*");
      text.append(italic);
      return;
    }

    text.append(document.createTextNode(part.replaceAll("\\*", "*")));
  });

  line.append(text);
  textReveal.append(line);
  // ensure the new line is visible; smooth on capable browsers
  requestAnimationFrame(() => {
    try {
      // scroll the element into view in the page (uses the page scrollbar)
      line.scrollIntoView({ behavior: "smooth", block: "end" });
    } catch (e) {
      // fallback to window scroll
      try {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      } catch (err) {
        // last-resort direct set
        window.scrollTo(0, document.body.scrollHeight);
      }
    }
  });
  // if this is the last line and the 3-drop path was chosen, trigger sparkle finale
if (line.classList.contains('last') && (selectedWaterLevel === 3 || selectedWaterLevel === 4)) {
    setTimeout(() => createSparkles(), 250);
  }
}

function getSavedNumber(key) {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch (e) {
    return 0;
  }
}

function saveWaterContribution(count) {
  const previousTotal = getSavedNumber(waterTotalKey);
  const previousEntries = getSavedNumber(waterEntriesKey);
  try {
    window.localStorage.setItem(waterTotalKey, String(previousTotal + count));
    window.localStorage.setItem(waterEntriesKey, String(previousEntries + 1));
  } catch (e) {
    // ignore storage failures
  }
}

function clearWaterTheme() {
  document.body.classList.remove(
    "water-level-1",
    "water-level-2",
    "water-level-3",
    "water-level-4"
  );
}

function applyWaterTheme(level) {
  clearWaterTheme();
  if (level >= 1 && level <= 4) {
    document.body.classList.add(`water-level-${level}`);
  }
}

function showWaterMeter() {
  if (!textReveal || storyEnded || waterMeterShown) {
    return;
  }

  const totalWater = getSavedNumber(waterTotalKey);
  const totalEntries = getSavedNumber(waterEntriesKey);
  const target = 120;
  const units = 20;
  const filledUnits = Math.min(units, Math.round((totalWater / target) * units));

  const block = document.createElement("div");
  block.className = "choice-line water-meter";

  const title = document.createElement("div");
  title.className = "water-game-title";
  title.textContent = "Pool meter (supposedly):";

  const meter = document.createElement("div");
  meter.className = "water-meter-bar";
  meter.textContent = `${"💧".repeat(filledUnits)}${"⬜".repeat(units - filledUnits)}`;

  const note = document.createElement("div");
  note.className = "line-text";
  note.textContent = `Total so far: ${totalWater} litres from ${totalEntries} picks.`;

  block.append(title, meter, note);
  textReveal.append(block);
  waterMeterShown = true;

  if (endingNote && (selectedWaterLevel === 3 || selectedWaterLevel === 4)) {
  endingNote.textContent = "Thanks hihi, can’t wait to see you there to see you Maja and Oskar.";
  endingNote.hidden = false;
}

if (endingNote && (selectedWaterLevel === 1 || selectedWaterLevel === 2)) {
  endingNote.textContent = "Thanks, can’t wait to see you there to see you Maja and Oskar.";
  endingNote.hidden = false;
}

  requestAnimationFrame(() => {
    block.scrollIntoView({ behavior: "smooth", block: "end" });
  });
}

let backgroundAudio;

function playBackgroundMusic() {
  if (!backgroundAudio) {
    backgroundAudio = new Audio("Every_Seasons.mp3");
    backgroundAudio.volume = 0.8;
  }

  backgroundAudio.play().catch(console.error);
}

function clearTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function showChoice() {
  choiceVisible = true;
  if (!textReveal || choiceBlock) {
    return;
  }

  const block = document.createElement("div");
  block.className = "choice-line";

  const addWater = document.createElement("button");
  addWater.type = "button";
  addWater.textContent = "Add water";

  const noWater = document.createElement("button");
  noWater.type = "button";
  noWater.className = "secondary";
  noWater.textContent = "Do not add water";

  addWater.addEventListener("click", showWaterQuantityChoice);
  noWater.addEventListener("click", showNoWaterConfirmation);

  block.append(addWater, noWater);
  choiceBlock = block;
  textReveal.append(block);

  requestAnimationFrame(() => {
    block.scrollIntoView({ behavior: "smooth", block: "end" });
  });
}

function showWaterQuantityChoice() {
  hideChoice();

  if (!textReveal || choiceBlock) {
    return;
  }

  const block = document.createElement("div");
  block.className = "choice-line";

  const title = document.createElement("div");
  title.className = "water-game-title";
  title.textContent = "Choose how much water will you bring:";

  const options = document.createElement("div");
  options.className = "water-options";

  [1, 2, 3, 4].forEach((count) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "emoji-option";
    option.textContent = "💧".repeat(count);
    option.setAttribute("aria-label", `Choose ${count} drops of water`);
    option.addEventListener("click", () => selectWaterQuantity(count));
    options.append(option);
  });

  const back = document.createElement("button");
  back.type = "button";
  back.className = "secondary";
  back.textContent = "Back";
  back.addEventListener("click", () => {
    hideChoice();
    showChoice();
  });

  block.append(title, options, back);
  choiceBlock = block;
  choiceVisible = true;
  textReveal.append(block);

  requestAnimationFrame(() => {
    block.scrollIntoView({ behavior: "smooth", block: "end" });
  });
}

function selectWaterQuantity(count) {
  hideChoice();
  selectedWaterLevel = count;
  applyWaterTheme(count);
  saveWaterContribution(count);

  if (count === 4) {
    playBackgroundMusic();
  }

  const droplets = "💧".repeat(count);
  addLine(`Cleo: I'll bring ${droplets}.`);
  continueWaterEnding();
}

function hideChoice() {
  choiceVisible = false;
  if (choiceBlock) {
    choiceBlock.remove();
    choiceBlock = null;
  }
}

function hideConfirmation() {
  if (confirmationBlock) {
    confirmationBlock.remove();
    confirmationBlock = null;
  }
}

function showNoWaterConfirmation() {
  hideChoice();

  if (!textReveal || confirmationBlock) {
    return;
  }

  const block = document.createElement("div");
  block.className = "choice-line confirmation-line";

  const message = document.createElement("div");
  message.className = "line-text";
  message.textContent = "are you shure??🐰";

  const yesButton = document.createElement("button");
  yesButton.type = "button";
  yesButton.textContent = "Yes";

  const noButton = document.createElement("button");
  noButton.type = "button";
  noButton.className = "secondary";
  noButton.textContent = "No";

  yesButton.addEventListener("click", showAccessDeniedEnding);
  noButton.addEventListener("click", () => {
    hideConfirmation();
    showChoice();
  });

  block.append(message, yesButton, noButton);
  confirmationBlock = block;
  textReveal.append(block);

  requestAnimationFrame(() => {
    block.scrollIntoView({ behavior: "smooth", block: "end" });
  });
}

function showAccessDeniedEnding() {
  storyEnded = true;
  clearTimer();
  hideChoice();
  hideConfirmation();
  document.body.classList.add("dryland", "access-denied");

  if (textReveal) {
    const nodes = Array.from(textReveal.children);
    const removeNext = () => {
      if (!nodes.length) {
        if (endingNote) {
          endingNote.textContent = "encrypted file found: access denied";
          endingNote.hidden = false;
        }
        return;
      }

      const nextNode = nodes.pop();
      if (nextNode) {
        nextNode.style.transition = "opacity 0.2s ease, transform 0.2s ease";
        nextNode.style.opacity = "0";
        nextNode.style.transform = "translateY(18px)";
        setTimeout(() => nextNode.remove(), 180);
      }

      setTimeout(removeNext, 90);
    };

    removeNext();
  }

  if (endingNote) {
    endingNote.textContent = "";
    endingNote.hidden = true;
  }
}

function continueWaterEnding() {
  hideChoice();

  if (endingNote) {
    endingNote.hidden = true;
    endingNote.textContent = "";
  }

  if (storyEnded) {
    return;
  }

  showNextLine();

  if (lineIndex < lines.length) {
    clearTimer();
    timerId = window.setInterval(showNextLine, 5000);
  }
}

function createSparkles() {
  const overlay = document.createElement('div');
  overlay.className = 'sparkles-overlay';

  const rand = (min, max) => Math.random() * (max - min) + min;

  // create sparkles
  for (let i = 0; i < 12; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = '✨';
    s.style.left = `${rand(5, 95)}%`;
    s.style.top = `${rand(10, 80)}%`;
    s.style.fontSize = `${rand(14, 36)}px`;
    s.style.animationDelay = `${rand(0, 0.8)}s`;
    overlay.appendChild(s);
  }

  // create floating water emojis
  for (let i = 0; i < 6; i++) {
    const w = document.createElement('div');
    w.className = 'water-emoji';
    w.textContent = '💧';
    w.style.left = `${rand(10, 90)}%`;
    w.style.top = `${rand(60, 95)}%`;
    w.style.fontSize = `${rand(18, 36)}px`;
    w.style.animationDelay = `${rand(0, 0.6)}s`;
    overlay.appendChild(w);
  }

  document.body.appendChild(overlay);

  
}

function showNextLine() {
  if (storyEnded || choiceVisible || lineIndex >= lines.length) {
    return;
  }

  addLine(lines[lineIndex]);
  lineIndex += 1;

  if (lineIndex === choicePointIndex) {
    clearTimer();
    showChoice();
    return;
  }

  if (lineIndex >= lines.length && timerId) {
    clearTimer();
  }

  if (lineIndex >= lines.length) {
    showWaterMeter();
    // Show ending note after a short delay so it appears below the meter
    setTimeout(() => {
      if (endingNote) {
        endingNote.textContent = (selectedWaterLevel === 3 || selectedWaterLevel === 4)
          ? "Thanks hihi, can't wait to see you there Maja and Oskar!"
          : "Thanks, can't wait to see you there Maja and Oskar!";
        endingNote.hidden = false;
        endingNote.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 600);
  }
}

function startAutoReveal() {
  showNextLine();
  if (!choiceVisible && !storyEnded) {
    clearTimer();
    timerId = window.setInterval(showNextLine, 10000);
  }
}

function advanceOnDemand() {
  if (!isUnlocked || choiceVisible || storyEnded) {
    return;
  }

  clearTimer();
  showNextLine();
}

function isCodeValid(value) {
  return acceptedCodes.has(value.trim().toLowerCase());
}

function unlockPage(save = true) {
  isUnlocked = true;
  document.body.classList.remove("locked");
  clearWaterTheme();
  selectedWaterLevel = 0;
  waterMeterShown = false;
  if (endingNote) {
    endingNote.textContent = "";
    endingNote.hidden = true;
  }
  if (relockButton) {
    relockButton.hidden = false;
  }

  if (lockScreen) {
    lockScreen.classList.add("hidden");
    lockScreen.setAttribute("aria-hidden", "true");
  }

  if (save) {
    try {
      window.sessionStorage.setItem(unlockSessionKey, "1");
    } catch (e) {
      // Ignore storage failures in private browsing modes.
    }
  }

  if (textReveal && !textReveal.dataset.started) {
    textReveal.dataset.started = "1";
    startAutoReveal();

    const hint = document.createElement("div");
    hint.className = "hint";
    hint.textContent = "Press Enter or tap to skip ahead.";
    textReveal.after(hint);
  }
}

function showLockScreen() {
  isUnlocked = false;
  document.body.classList.add("locked");
  if (relockButton) {
    relockButton.hidden = true;
  }
  if (lockScreen) {
    lockScreen.classList.remove("hidden");
    lockScreen.removeAttribute("aria-hidden");
  }
  if (accessCodeInput) {
    accessCodeInput.focus();
  }
}

function initAccessGate() {
  let previouslyUnlocked = false;
  try {
    previouslyUnlocked = window.sessionStorage.getItem(unlockSessionKey) === "1";
  } catch (e) {
    previouslyUnlocked = false;
  }

  if (previouslyUnlocked) {
    unlockPage(false);
    return;
  }

  showLockScreen();

  if (lockForm) {
    lockForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const typedCode = accessCodeInput ? accessCodeInput.value : "";
      if (!isCodeValid(typedCode)) {
        if (lockMessage) {
          lockMessage.textContent = "Wrong code. hint: it’s something related to the pool party theme.";
        }
        if (accessCodeInput) {
          accessCodeInput.select();
        }
        return;
      }

      if (lockMessage) {
        lockMessage.textContent = "";
      }

      unlockPage(true);
    });
  }
}

if (relockButton) {
  relockButton.addEventListener("click", () => {
    try {
      window.sessionStorage.removeItem(unlockSessionKey);
    } catch (e) {
      // ignore
    }
    window.location.reload();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    advanceOnDemand();
  }
});

document.addEventListener("pointerup", () => {
  advanceOnDemand();
});

initAccessGate();
