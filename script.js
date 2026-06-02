const textReveal = document.getElementById("textReveal");

const lines = [
  "Cleo: Cleo!",
  "Matej: Hey, Cleo!",
  "Stage direction: [you look around, confused]",
  "Matej: Yes, *you*, Cleo.",
  "Matej: We’re in some trouble here. Can you help?",
  "Matej: Please? Our Zodiac\\* won’t let go; we’ve been preconditioned to blow things out of proportion. You know the mermaids, the pool party, the princesses. All we need you to do is just help us a little with the pool.",
  "Cleo: *approaches* I’m not good with pools.",
  "Matej: You’ll be fine. Matej\\* has already taken care of most of it; they brought it from Vienna just now.",
  "Cleo: So, what do you need *me* for?",
  "Matej: Well, we need to fill up the pool, right? And how else would we do that, if not by asking every single person invited to bring 💧💧💧 3–4 litres of water 💧💧💧for it? To *just add water*.",
  "Cleo: Are you serious?",
  "Matej: Sadly, yes, but it will be fun! Don’t worry about the rest.",
  "Matej: Hmm, actually, never mind, there is one more thing. Definitely worry about the sun! 50 SPF mandatory!",
  "Cleo: But I’m confused. Where is the pool, anyway?",
  "Matej: ✨Oh, yes, silly us!✨ ",
  "✨We’ll inflate it in Tivoli. Monday, the 8th of June!✨"
];

let lineIndex = 0;
let timerId = null;

function addLine(lineData) {
  if (!textReveal) return;

  const line = document.createElement("div");
  line.className = "text-line";
  // mark the final line so it can be styled as bold
  if (lineIndex === lines.length - 1) {
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
  // if this is the last line, trigger final effect
  if (line.classList.contains('last')) {
    // small delay so the line is visible before the effect
    setTimeout(() => createSparkles(), 250);
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

  // remove after 6s
  setTimeout(() => {
    overlay.remove();
  }, 6000);
}

function showNextLine() {
  if (lineIndex >= lines.length) {
    return;
  }

  addLine(lines[lineIndex]);
  lineIndex += 1;

  if (lineIndex >= lines.length && timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function startAutoReveal() {
  showNextLine();
  timerId = window.setInterval(showNextLine, 1700);
}

function advanceOnDemand() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  showNextLine();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    advanceOnDemand();
  }
});

document.addEventListener("pointerup", () => {
  advanceOnDemand();
});

if (textReveal) {
  startAutoReveal();

  const hint = document.createElement("div");
  hint.className = "hint";
  hint.textContent = "Press Enter or tap to skip ahead.";
  textReveal.after(hint);
}
