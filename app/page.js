"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { VALID_GUESSES } from "./valid-guesses";

const WORD_LIST = [
  "ALTON",
  "HMART",
  "TESLA",
  "MONEY",
  "TUTOR",
  "STUDY",
  "ASIAN",
  "QUIET",
  "EBIKE",
  "TRAIL",
  "FINES",
  "CRASH",
  "CLEAN",
  "BOBAS",
  "MERGE",
  "GATED",
  "WALKS",
  "SPEND",
  "PLAZA",
  "PARKS",
  "CROWD",
  "LINES",
  "UTURN",
  "HILLS",
  "NERDS",
  "AGRAN",
  "PETER",
  "QUAIL",
  "KUMON",
  "TOLLS",
  "WEEBS",
  "BRYAN",
  "TAIKO",
  "OMOMO",
  "BISON",
  "TOWED",
  "PIANO",
  "YIELD",
  "LEASE",
  "STONE",
  "CREEK",
  "GREAT",
  "VIEWS",
  "BIKES",
  "SHADY",
  "DUCKS",
  "HOMES",
  "TREES",
  "SOLAR",
  "ARBOR",
  "RIDGE",
  "UCIPD",
  "LAKES",
];
const WORD_CLUES = {
  ALTON: "Irvine road.",
  HMART: "A grocery spot.",
  TESLA: "Official Irvine vehicle.",
  MONEY: "What Irvine takes from you.",
  TUTOR: "After-school helper.",
  STUDY: "UCI finals week.",
  ASIAN: "The greatest drivers.",
  QUIET: "Irvine after 8PM.",
  EBIKE: "Not a motorcycle.",
  TRAIL: "Turtle Rock weekend plan.",
  FINES: "Parking cost.",
  CRASH: "freeway backed up reason.",
  CLEAN: "Peak Irvine energy.",
  BOBAS: "The local drink economy.",
  MERGE: "405 survival skill.",
  GATED: "Irvine neighborhood specialty.",
  WALKS: "Spectrum without buying anything.",
  SPEND: "What plazas make you do.",
  PLAZA: "Where Irvine life happens.",
  PARKS: "Clean grass, strict signs.",
  CROWD: "Grand opening situation.",
  LINES: "Boba shop punishment.",
  UTURN: "Missed a turn move.",
  HILLS: "UCI got a lot of these.",
  NERDS: "Study hall population.",
  AGRAN: "Deep Irvine lore name.",
  PETER: "UCI mascot.",
  QUAIL: "It's a hill, trail, and neighborhood.",
  KUMON: "Afterschool spot.",
  TOLLS: "Accidental road tax.",
  WEEBS: "NPC Anime fans.",
  BRYAN: "Irvine road.",
  TAIKO: "A nice old Japanese spot.",
  OMOMO: "Boba line favorite.",
  BISON: "Irvine road.",
  TOWED: "Parking consequence.",
  PIANO: "Every Asian kid learns this.",
  YIELD: "Nobody follows this traffic rule here.",
  LEASE: "Monthly payment hell.",
  STONE: "_____ Gate.",
  CREEK: "Oak _____.",
  GREAT: "It's a big park.",
  VIEWS: "What the hills are for.",
  BIKES: "Pedestrian jump scares.",
  SHADY: "____ Canyon.",
  DUCKS: "You see these at the lake.",
  HOMES: "You see these everywhere.",
  TREES: "Every neighborhood has these.",
  SOLAR: "On half the rooftops.",
  ARBOR: "There's a 99 Ranch here.",
  RIDGE: "Turtle Rock has one.",
  UCIPD: "UCI enforcers.",
  LAKES: "Known in the Woodbridge area.",
};
const VALID_GUESS_SET = new Set([...VALID_GUESSES, ...WORD_LIST]);

const LETTERS = 5;
const MAX_ATTEMPTS = 8;
const KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const MARKS = ["", "red", "yellow", "green"];
const STATS_KEY = "irvine500-stats";
const GAME_KEY = "irvine500-game";
const MODES = [
  {
    id: "baby",
    label: "Irvine",
    face: "happy",
    color: "text-[#58a84f]",
    rules: ["Hints allowed", "No repeats"],
  },
  {
    id: "standard",
    label: "Irvine+",
    face: "neutral",
    color: "text-[#d0bb59]",
    rules: ["No hints", "No repeats"],
  },
  {
    id: "standard-plus",
    label: "Irvine Pro",
    face: "hard",
    color: "text-[#dc494c]",
    rules: ["No hints", "Repeats allowed"],
  },
];
const SOCIALS = [
  {
    label: "Twitch",
    href: "https://www.twitch.tv/stevomeepo",
    paths: [
      {
        d: "M216 48v108.25a8 8 0 0 1-2.88 6.15l-42.89 35.75a8.05 8.05 0 0 1-5.13 1.85H120l-48 40v-40H48a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8",
        opacity: "0.2",
      },
      {
        d: "M208 32H48a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h16v32a8 8 0 0 0 13.12 6.15L122.9 208h42.2a16 16 0 0 0 10.25-3.71l42.89-35.75a15.93 15.93 0 0 0 5.76-12.29V48a16 16 0 0 0-16-16m0 124.25L165.1 192H120a8 8 0 0 0-5.12 1.85L80 222.92V200a8 8 0 0 0-8-8H48V48h160ZM160 136V88a8 8 0 0 1 16 0v48a8 8 0 0 1-16 0m-48 0V88a8 8 0 0 1 16 0v48a8 8 0 0 1-16 0",
      },
    ],
  },
  {
    label: "Discord",
    href: "https://discord.gg/qhGEjuEC26",
    paths: [
      {
        d: "m235.21 185.59l-67 29.7a8.15 8.15 0 0 1-11-4.56L147 183.06a191 191 0 0 1-19 .94a191 191 0 0 1-19-.94l-10.25 27.67a8.15 8.15 0 0 1-11 4.56l-67-29.7a8 8 0 0 1-4.55-9.24L45.77 60a8.08 8.08 0 0 1 6.54-6l36.06-5.92a8.1 8.1 0 0 1 9.21 6l5 19.63a192.3 192.3 0 0 1 50.88 0l5-19.63a8.1 8.1 0 0 1 9.21-6L203.69 54a8.08 8.08 0 0 1 6.54 6l29.53 116.37a8 8 0 0 1-4.55 9.22",
        opacity: "0.2",
      },
      {
        d: "M104 140a12 12 0 1 1-12-12a12 12 0 0 1 12 12m60-12a12 12 0 1 0 12 12a12 12 0 0 0-12-12m74.45 64.9l-67 29.71a16.17 16.17 0 0 1-21.71-9.1l-8.11-22q-6.72.45-13.63.46t-13.63-.46l-8.11 22a16.18 16.18 0 0 1-21.71 9.1l-67-29.71a15.94 15.94 0 0 1-9.06-18.51L38 58a16.08 16.08 0 0 1 13-11.87l36.06-5.92a16.21 16.21 0 0 1 18.26 11.88l3.26 12.83Q118.11 64 128 64t19.4.92l3.26-12.83a16.22 16.22 0 0 1 18.26-11.88L205 46.13A16.08 16.08 0 0 1 218 58l29.53 116.38a15.94 15.94 0 0 1-9.08 18.52M232 178.28L202.47 62h-.08l-36.06-6a.17.17 0 0 0-.17 0l-2.83 11.14c5 .94 10 2.06 14.83 3.42A8 8 0 0 1 176 86.31a8 8 0 0 1-2.16-.3A172.3 172.3 0 0 0 128 80a172.3 172.3 0 0 0-45.84 6a8 8 0 1 1-4.32-15.4c4.82-1.36 9.78-2.48 14.82-3.42L89.83 56a.2.2 0 0 0-.12 0l-36.1 5.92a.2.2 0 0 0-.09 0L24 178.33L91 208a.21.21 0 0 0 .22 0L98 189.72a173 173 0 0 1-20.14-4.32a8 8 0 0 1 4.3-15.4a172 172 0 0 0 45.84 6a172 172 0 0 0 45.84-6a8 8 0 0 1 4.32 15.41a173 173 0 0 1-20.16 4.31l6.75 18.28a.22.22 0 0 0 .21 0Z",
      },
    ],
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/stevomeepovids",
    paths: [
      {
        d: "M176 32H80a48 48 0 0 0-48 48v96a48 48 0 0 0 48 48h96a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48m-48 136a40 40 0 1 1 40-40a40 40 0 0 1-40 40",
        opacity: "0.2",
      },
      {
        d: "M176 24H80a56.06 56.06 0 0 0-56 56v96a56.06 56.06 0 0 0 56 56h96a56.06 56.06 0 0 0 56-56V80a56.06 56.06 0 0 0-56-56m40 152a40 40 0 0 1-40 40H80a40 40 0 0 1-40-40V80a40 40 0 0 1 40-40h96a40 40 0 0 1 40 40Zm-88-96a48 48 0 1 0 48 48a48.05 48.05 0 0 0-48-48m0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32m64-84a12 12 0 1 1-12-12a12 12 0 0 1 12 12",
      },
    ],
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@stevomeepo",
    paths: [
      {
        d: "M224 120a95.55 95.55 0 0 1-56-18v54a68 68 0 0 1-136 0c0-33.46 24.17-62.33 56-68v42.69A28 28 0 1 0 128 156V24h40a56 56 0 0 0 56 56Z",
        opacity: "0.2",
      },
      {
        d: "M224 72a48.05 48.05 0 0 1-48-48a8 8 0 0 0-8-8h-40a8 8 0 0 0-8 8v132a20 20 0 1 1-28.57-18.08a8 8 0 0 0 4.57-7.23V88a8 8 0 0 0-9.4-7.88C50.91 86.48 24 119.1 24 156a76 76 0 0 0 152 0v-39.71A103.25 103.25 0 0 0 224 128a8 8 0 0 0 8-8V80a8 8 0 0 0-8-8m-8 39.64a87.2 87.2 0 0 1-43.33-16.15A8 8 0 0 0 160 102v54a60 60 0 0 1-120 0c0-25.9 16.64-49.13 40-57.6v27.67A36 36 0 1 0 136 156V32h24.5A64.14 64.14 0 0 0 216 87.5Z",
      },
    ],
  },
];

function defaultStats() {
  return {
    played: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: Object.fromEntries(
      Array.from({ length: MAX_ATTEMPTS }, (_, index) => [index + 1, 0]),
    ),
  };
}

function playerStatus(stats, winPercent) {
  if (!stats.played) {
    return "Unranked Irvine";
  }

  if (winPercent >= 90) {
    return "Irvine Final Boss";
  }

  if (winPercent >= 75) {
    return "Master Irvine";
  }

  if (winPercent >= 60) {
    return "Captain Irvine";
  }

  if (winPercent >= 40) {
    return "Irvine Soldier";
  }

  return "Irvine NPC";
}

function dailyIndex() {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const day = Math.floor((today - start) / 86400000);
  return day % WORD_LIST.length;
}

function gameDayKey() {
  return new Date().toISOString().slice(0, 10);
}

function hasRepeatLetters(word) {
  return new Set(word).size !== word.length;
}

function wordFitsMode(word, modeId) {
  if (modeId === "baby" || modeId === "standard") {
    return !hasRepeatLetters(word);
  }

  return true;
}

function playableWordsFor(modeId) {
  return WORD_LIST.filter((word) => wordFitsMode(word, modeId));
}

function answerFor(modeId, gameOffset) {
  const playable = playableWordsFor(modeId);
  return playable[(dailyIndex() + gameOffset) % playable.length];
}

function nextOffsetForDifferentAnswer(modeId, previousAnswer, startOffset = 0) {
  const playable = playableWordsFor(modeId);

  for (let index = 0; index < playable.length; index += 1) {
    const offset = startOffset + index;
    const nextAnswer = playable[(dailyIndex() + offset) % playable.length];

    if (nextAnswer !== previousAnswer) {
      return offset;
    }
  }

  return startOffset;
}

function scoreGuess(guess, answer) {
  let green = 0;
  let yellow = 0;
  const remaining = {};
  const unmatchedGuess = [];

  for (let index = 0; index < LETTERS; index += 1) {
    if (guess[index] === answer[index]) {
      green += 1;
    } else {
      remaining[answer[index]] = (remaining[answer[index]] || 0) + 1;
      unmatchedGuess.push(guess[index]);
    }
  }

  unmatchedGuess.forEach((letter) => {
    if (remaining[letter]) {
      yellow += 1;
      remaining[letter] -= 1;
    }
  });

  return {
    green,
    yellow,
    red: LETTERS - green - yellow,
  };
}

function messageIndex(seed, count) {
  return Array.from(seed).reduce(
    (total, letter) => total + letter.charCodeAt(0),
    0,
  ) % count;
}

function pickMessage(seed, messages) {
  return messages[messageIndex(seed, messages.length)];
}

function invalidWordMessage(guess) {
  return pickMessage(guess, [
    "Do you know English? Try again.",
    "Dictionary said no.",
    "Irvine inspector rejected this.",
    "Keyboard freestyle detected.",
    "Not a word. Be serious.",
  ]);
}

function guessReactionMessage(guess, score) {
  if (guess === "DIDDY") {
    return "Bruh... might need to lock you up for this.";
  }

  if (score.green >= 4) {
    return pickMessage(guess, [
      "Basically breathing on it.",
      "Four green. Finish it.",
      "Irvine feels nervous.",
    ]);
  }

  if (score.green >= 2) {
    return pickMessage(guess, [
      "Ohh, some green.",
      "Now mix it up a bit.",
      "Green on board. Cooking.",
    ]);
  }

  if (score.green === 1) {
    return pickMessage(guess, [
      "One green. Tiny win.",
      "One tile knows Irvine.",
      "A little green. Use it.",
    ]);
  }

  if (score.yellow >= 3) {
    return pickMessage(guess, [
      "Big yellow energy.",
      "Letters there. Spots wrong.",
      "Shuffle it, Irvine style.",
    ]);
  }

  if (score.yellow > 0) {
    return pickMessage(guess, [
      "Wrong spots, right idea.",
      "Irvine is whispering.",
      "Some clues. Use them.",
    ]);
  }

  return pickMessage(guess, [
    "Irvine inspector says no.",
    "Clean miss. Painful.",
    "Zero clues. Bold.",
    "Not your finest plaza run.",
  ]);
}

function scoreLetters(guess, answer) {
  const feedback = Array(LETTERS).fill("red");
  const remaining = {};

  for (let index = 0; index < LETTERS; index += 1) {
    if (guess[index] === answer[index]) {
      feedback[index] = "green";
    } else {
      remaining[answer[index]] = (remaining[answer[index]] || 0) + 1;
    }
  }

  for (let index = 0; index < LETTERS; index += 1) {
    if (feedback[index] === "green") {
      continue;
    }

    if (remaining[guess[index]]) {
      feedback[index] = "yellow";
      remaining[guess[index]] -= 1;
    }
  }

  return feedback;
}

function isConsistentCandidate(candidate, guesses, answer) {
  return guesses.every((guess) => {
    const actual = scoreGuess(guess, answer);
    const candidateScore = scoreGuess(guess, candidate);

    return (
      actual.green === candidateScore.green &&
      actual.yellow === candidateScore.yellow &&
      actual.red === candidateScore.red
    );
  });
}

function keyIsUsable(key, disabledLetters, won, lost) {
  return !disabledLetters.includes(key) && !won && !lost;
}

function markClasses(mark) {
  if (mark === "green") {
    return "tile-feedback-green";
  }

  if (mark === "yellow") {
    return "tile-feedback-yellow";
  }

  if (mark === "red") {
    return "tile-feedback-red";
  }

  return "bg-[#2b2b2c] text-[#d7d7d8]";
}

function buildShareText(result, modeLabel) {
  const green = "\u{1F7E9}";
  const yellow = "\u{1F7E8}";
  const red = "\u{1F7E5}";
  const rows = result.guesses.map((guess) => {
    const score = scoreGuess(guess, result.answer);
    return `${green.repeat(score.green)}${yellow.repeat(score.yellow)}${red.repeat(score.red)}`;
  });
  const scoreLine = result.won
    ? `${result.guessesUsed}/${MAX_ATTEMPTS}`
    : `X/${MAX_ATTEMPTS}`;

  return [`Irvine500 ${scoreLine} ${modeLabel}`, ...rows].join("\n");
}

async function writeClipboardText(text) {
  try {
    if (!navigator.clipboard?.writeText) {
      return false;
    }

    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function SocialLinks() {
  return (
    <footer className="mx-auto mt-auto mb-[clamp(0.45rem,2dvh,1.25rem)] flex shrink-0 flex-col items-center gap-[clamp(0.2rem,0.6dvh,0.375rem)] pb-0">
      <div className="relative flex flex-col items-center">
        <Image
          src="/MADEBY.png"
          alt="Made by"
          width={2100}
          height={1200}
          unoptimized
          className="h-[var(--footer-madeby)] w-auto opacity-90"
        />
        <p className="-mt-2 text-sm font-black text-[#7bdd72]">
          @stevomeepo
        </p>
      </div>
      <nav
        aria-label="Stevomeepo social links"
        className="flex flex-wrap justify-center gap-2"
      >
        {SOCIALS.map((social) => (
          <a
            href={social.href}
            target="_blank"
            aria-label={social.label}
            rel="noreferrer"
            className="inline-flex size-[var(--social-size)] items-center justify-center rounded-full border border-[#58a84f]/35 bg-[#122016] text-[#7bdd72] shadow-[0_0_22px_rgba(88,168,79,0.12)] transition hover:border-[#7bdd72] hover:bg-[#18351f] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#58a84f]/25"
            key={social.label}
          >
            {renderSocialIcon(social.paths)}
          </a>
        ))}
      </nav>
    </footer>
  );
}

function BobaTip() {
  return (
    <aside className="fixed right-4 bottom-[clamp(1.55rem,3.6dvh,2.15rem)] z-10 flex flex-col items-center lg:bottom-4">
      <p className="mb-1 text-xs font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] lg:text-sm">
        <span className="block sm:inline">Buy me</span>
        <span className="block sm:inline sm:pl-1">boba?</span>
      </p>
      <a
        href="https://venmo.com/u/stevomeepo"
        target="_blank"
        aria-label="Buy me boba on Venmo"
        rel="noreferrer"
        className="block transition hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#58a84f]/30"
        title="Buy me boba?"
      >
        <Image
          src="/bobacat.png"
          alt=""
          width={765}
          height={804}
          unoptimized
          className="h-14 w-auto drop-shadow-[0_14px_24px_rgba(0,0,0,0.45)] lg:h-24"
        />
      </a>
    </aside>
  );
}

function renderSocialIcon(paths) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className="size-5"
      aria-hidden="true"
    >
      <g fill="currentColor">
        {paths.map((path) => (
          <path
            d={path.d}
            opacity={path.opacity}
            key={path.d}
          />
        ))}
      </g>
    </svg>
  );
}

function BackspaceIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className="size-5"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M216 36H68.53a20.09 20.09 0 0 0-17.15 9.71L5.71 121.83a12 12 0 0 0 0 12.34l45.67 76.12A20.09 20.09 0 0 0 68.53 220H216a20 20 0 0 0 20-20V56a20 20 0 0 0-20-20m-4 160H70.8L30 128l40.8-68H212Zm-108.49-52.49L119 128l-15.52-15.51a12 12 0 0 1 17-17L136 111l15.51-15.52a12 12 0 0 1 17 17L153 128l15.52 15.51a12 12 0 0 1-17 17L136 145l-15.51 15.52a12 12 0 0 1-17-17Z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className="size-5"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m45.66 85.66l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32"
      />
    </svg>
  );
}

function HintIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className="size-5"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M176 232a8 8 0 0 1-8 8H88a8 8 0 0 1 0-16h80a8 8 0 0 1 8 8m40-128a87.55 87.55 0 0 1-33.64 69.21A16.24 16.24 0 0 0 176 186v6a16 16 0 0 1-16 16H96a16 16 0 0 1-16-16v-6a16 16 0 0 0-6.23-12.66A87.59 87.59 0 0 1 40 104.5c-.26-47.67 38.26-87.35 85.88-88.5A88 88 0 0 1 216 104m-16 0a72 72 0 0 0-73.74-72c-39 .92-70.47 33.39-70.26 72.39a71.64 71.64 0 0 0 27.64 56.3A32 32 0 0 1 96 186v6h24v-44.69l-29.66-29.65a8 8 0 0 1 11.32-11.32L128 132.69l26.34-26.35a8 8 0 0 1 11.32 11.32L136 147.31V192h24v-6a32.12 32.12 0 0 1 12.47-25.35A71.65 71.65 0 0 0 200 104"
      />
    </svg>
  );
}

function ModeIcon({ type, className = "size-7" }) {
  const paths = {
    baby:
      "M134.16 24.1a4 4 0 0 0-3.56 1.81C120.3 41.48 120 55.79 120 56a8 8 0 0 0 9.68 7.79a8.24 8.24 0 0 0 6.32-8.11a8 8 0 0 1 8.8-7.68a8.14 8.14 0 0 1 7.2 8.23a24 24 0 0 1-48-.27c0-.63.09-10.78 5.44-24a4 4 0 0 0-4.59-5.39a104.16 104.16 0 0 0-80.78 105.09C26 186.72 71.23 231 126.32 231.9a104 104 0 0 0 7.84-207.8M80 127.91a12 12 0 1 1 12 12a12 12 0 0 1-12-12m80.27 54.77a61 61 0 0 1-64.54 0a8 8 0 0 1 8.54-13.54a45 45 0 0 0 47.46 0a8 8 0 0 1 8.54 13.54m3.73-42.77a12 12 0 1 1 12-12a12 12 0 0 1-12 12",
    happy:
      "M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24M92 96a12 12 0 1 1-12 12a12 12 0 0 1 12-12m82.92 60c-10.29 17.79-27.39 28-46.92 28s-36.63-10.2-46.92-28a8 8 0 1 1 13.84-8c7.47 12.91 19.21 20 33.08 20s25.61-7.1 33.08-20a8 8 0 1 1 13.84 8M164 120a12 12 0 1 1 12-12a12 12 0 0 1-12 12",
    neutral:
      "M128 24a104 104 0 1 0 104 104A104.13 104.13 0 0 0 128 24M92 96a12 12 0 1 1-12 12a12 12 0 0 1 12-12m76 72H88a8 8 0 0 1 0-16h80a8 8 0 0 1 0 16m-4-48a12 12 0 1 1 12-12a12 12 0 0 1-12 12",
    hard:
      "M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m36 72a12 12 0 1 1-12 12a12 12 0 0 1 12-12m-72 0a12 12 0 1 1-12 12a12 12 0 0 1 12-12m84 80c-10 0-15.05-6.74-18.4-11.2c-3-4-3.92-4.8-5.6-4.8s-2.57.76-5.6 4.8c-3.35 4.46-8.4 11.2-18.4 11.2s-15-6.74-18.4-11.2c-3-4-3.92-4.8-5.6-4.8s-2.57.76-5.6 4.8C95.05 169.26 90 176 80 176a8 8 0 0 1 0-16c1.68 0 2.57-.76 5.6-4.8C89 150.74 94 144 104 144s15 6.74 18.4 11.2c3 4 3.92 4.8 5.6 4.8s2.57-.76 5.6-4.8C137 150.74 142 144 152 144s15.05 6.74 18.4 11.2c3 4 3.92 4.8 5.6 4.8a8 8 0 0 1 0 16",
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d={paths[type]}
      />
    </svg>
  );
}

function ResultsIcon({ className = "size-7" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M224 96h-40V56a8 8 0 0 0-8-8H56v-8a8 8 0 0 0-16 0v176a8 8 0 0 0 16 0v-8h88a8 8 0 0 0 8-8v-40h72a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8m-56-32v32H56V64Zm-32 128H56v-32h80Zm80-48H56v-32h160Z"
      />
    </svg>
  );
}

function HelpIcon({ className = "size-7" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M184 112a8 8 0 0 1-8 8h-64a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8m-8 24h-64a8 8 0 0 0 0 16h64a8 8 0 0 0 0-16m48-88v160a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16M48 208h24V48H48Zm160 0V48H88v160z"
      />
    </svg>
  );
}

function CloseIcon({ className = "size-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M208.49 191.51a12 12 0 0 1-17 17L128 145l-63.51 63.49a12 12 0 0 1-17-17L111 128L47.51 64.49a12 12 0 0 1 17-17L128 111l63.51-63.52a12 12 0 0 1 17 17L145 128Z"
      />
    </svg>
  );
}

export default function Home() {
  const [gameOffset, setGameOffset] = useState(0);
  const [modeId, setModeId] = useState("standard");
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const [pendingModeId, setPendingModeId] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [animatedRows, setAnimatedRows] = useState([]);
  const [finalLetterRows, setFinalLetterRows] = useState([]);
  const [restoredScoreRows, setRestoredScoreRows] = useState([]);
  const [invalidRow, setInvalidRow] = useState(null);
  const [currentGuess, setCurrentGuess] = useState("");
  const [marks, setMarks] = useState({});
  const [message, setMessage] = useState("Irvine is waiting.");
  const [stats, setStats] = useState(defaultStats);
  const [gameLoaded, setGameLoaded] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [endEffect, setEndEffect] = useState(null);
  const [shareStatus, setShareStatus] = useState("");
  const modeMenuRef = useRef(null);
  const resultTimerRef = useRef(null);
  const confettiTimerRef = useRef(null);
  const invalidTimerRef = useRef(null);

  const activeMode = MODES.find((mode) => mode.id === modeId) ?? MODES[0];
  const playableWords = useMemo(
    () => WORD_LIST.filter((word) => wordFitsMode(word, modeId)),
    [modeId],
  );
  const answer = useMemo(() => answerFor(modeId, gameOffset), [
    gameOffset,
    modeId,
  ]);
  const disabledLetters = useMemo(
    () => [],
    [],
  );
  const showsHintKey = modeId === "baby";
  const won = guesses.includes(answer);
  const lost =
    (lastResult && !lastResult.won && lastResult.answer === answer) ||
    (guesses.length === MAX_ATTEMPTS && !won);
  const hasBoardProgress =
    guesses.length > 0 ||
    currentGuess.length > 0 ||
    Object.keys(marks).length > 0;
  const pendingMode = pendingModeId
    ? MODES.find((mode) => mode.id === pendingModeId)
    : null;
  const isPendingSameMode = pendingModeId === modeId;
  const candidates = useMemo(
    () =>
      playableWords.filter((word) => {
        return (
          !disabledLetters.some((letter) => word.includes(letter)) &&
          isConsistentCandidate(word, guesses, answer)
        );
      }),
    [answer, disabledLetters, guesses, playableWords],
  );

  function updateMessage(nextMessage) {
    setMessage(nextMessage);

    if (!gameLoaded) {
      return;
    }

    try {
      const savedGame = JSON.parse(localStorage.getItem(GAME_KEY) || "{}");

      localStorage.setItem(
        GAME_KEY,
        JSON.stringify({
          ...savedGame,
          dayKey: savedGame.dayKey || gameDayKey(),
          message: nextMessage,
        }),
      );
    } catch {
      // The normal save effect will rewrite the full game state next render.
    }
  }

  function clearBoard(nextMessage) {
    if (resultTimerRef.current) {
      clearTimeout(resultTimerRef.current);
      resultTimerRef.current = null;
    }

    if (confettiTimerRef.current) {
      clearTimeout(confettiTimerRef.current);
      confettiTimerRef.current = null;
    }

    if (invalidTimerRef.current) {
      clearTimeout(invalidTimerRef.current);
      invalidTimerRef.current = null;
    }

    setGuesses([]);
    setAnimatedRows([]);
    setFinalLetterRows([]);
    setRestoredScoreRows([]);
    setInvalidRow(null);
    setCurrentGuess("");
    setMarks({});
    setLastResult(null);
    setEndEffect(null);
    setResultOpen(false);
    setHelpOpen(false);
    setPendingModeId(null);
    setShareStatus("");
    updateMessage(nextMessage);
  }

  function startNextGame() {
    setGameOffset((offset) =>
      nextOffsetForDifferentAnswer(modeId, answer, offset + 1),
    );
    clearBoard("New Irvine. New nonsense.");
  }

  function recordResult(result) {
    setStats((currentStats) => {
      const nextStats = {
        ...currentStats,
        distribution: { ...currentStats.distribution },
      };

      nextStats.played += 1;

      if (result.won) {
        nextStats.wins += 1;
        nextStats.currentStreak += 1;
        nextStats.maxStreak = Math.max(
          nextStats.maxStreak,
          nextStats.currentStreak,
        );
        nextStats.distribution[result.guessesUsed] =
          (nextStats.distribution[result.guessesUsed] || 0) + 1;
      } else {
        nextStats.currentStreak = 0;
      }

      localStorage.setItem(STATS_KEY, JSON.stringify(nextStats));
      return nextStats;
    });
  }

  function showResultAfterEffect(result) {
    if (resultTimerRef.current) {
      clearTimeout(resultTimerRef.current);
    }

    if (confettiTimerRef.current) {
      clearTimeout(confettiTimerRef.current);
      confettiTimerRef.current = null;
    }

    setLastResult(result);
    setHelpOpen(false);
    setResultOpen(false);
    setEndEffect(result.won ? "win" : "loss");

    resultTimerRef.current = window.setTimeout(
      () => {
        if (!result.won) {
          setEndEffect(null);
        }
        setResultOpen(true);
        resultTimerRef.current = null;
      },
      result.won ? 900 : 1350,
    );

    if (result.won) {
      confettiTimerRef.current = window.setTimeout(() => {
        setEndEffect(null);
        confettiTimerRef.current = null;
      }, 9000);
    }
  }

  function openResults() {
    if (resultTimerRef.current) {
      clearTimeout(resultTimerRef.current);
      resultTimerRef.current = null;
    }

    if (confettiTimerRef.current) {
      clearTimeout(confettiTimerRef.current);
      confettiTimerRef.current = null;
    }

    setEndEffect(null);
    setHelpOpen(false);
    setShareStatus("");
    setResultOpen(true);
  }

  function openHelp() {
    if (resultTimerRef.current) {
      clearTimeout(resultTimerRef.current);
      resultTimerRef.current = null;
    }

    if (confettiTimerRef.current) {
      clearTimeout(confettiTimerRef.current);
      confettiTimerRef.current = null;
    }

    setEndEffect(null);
    setModeMenuOpen(false);
    setResultOpen(false);
    setHelpOpen(true);
  }

  function rejectGuess(nextMessage) {
    if (invalidTimerRef.current) {
      clearTimeout(invalidTimerRef.current);
    }

    const rowIndex = guesses.length;

    updateMessage(nextMessage);
    setInvalidRow(null);
    window.requestAnimationFrame(() => {
      setInvalidRow(rowIndex);
    });

    invalidTimerRef.current = window.setTimeout(() => {
      setCurrentGuess("");
      setInvalidRow(null);
      invalidTimerRef.current = null;
    }, 420);
  }

  async function copyResults() {
    if (!lastResult) {
      return;
    }

    try {
      const text = buildShareText(lastResult, activeMode.label);
      const copied = await writeClipboardText(text);
      setShareStatus(copied ? "Copied." : "");
    } catch {
      setShareStatus("");
    }
  }

  async function shareResults() {
    if (!lastResult) {
      return;
    }

    try {
      const text = buildShareText(lastResult, activeMode.label);

      if (navigator.share) {
        await navigator.share({ text, title: "Irvine500" });
        setShareStatus("Shared.");
        return;
      }

      const copied = await writeClipboardText(text);
      setShareStatus(copied ? "Copied." : "");
    } catch {
      const text = buildShareText(lastResult, activeMode.label);
      const copied = await writeClipboardText(text);
      setShareStatus(copied ? "Copied." : "");
    }
  }

  function applyModeChange(nextModeId) {
    const nextMode = MODES.find((mode) => mode.id === nextModeId) ?? MODES[0];

    setModeId(nextModeId);
    setGameOffset(nextOffsetForDifferentAnswer(nextModeId, answer));
    setModeMenuOpen(false);
    clearBoard(`${nextMode.label} mode.`);
  }

  function chooseMode(nextModeId) {
    if (hasBoardProgress) {
      setPendingModeId(nextModeId);
      setModeMenuOpen(false);
      return;
    }

    applyModeChange(nextModeId);
  }

  function confirmModeChange() {
    if (!pendingModeId) {
      return;
    }

    applyModeChange(pendingModeId);
  }

  function clearCurrentRow() {
    setMarks({});
    setCurrentGuess("");
    setInvalidRow(null);
    updateMessage("Cleared.");
  }

  function cycleMark(rowIndex, tileIndex) {
    const key = `${rowIndex}-${tileIndex}`;
    const currentIndex = MARKS.indexOf(marks[key] ?? "");
    const nextMark = MARKS[(currentIndex + 1) % MARKS.length];

    setMarks((currentMarks) => {
      const nextMarks = { ...currentMarks };

      if (nextMark) {
        nextMarks[key] = nextMark;
      } else {
        delete nextMarks[key];
      }

      return nextMarks;
    });
  }

  function addHint() {
    if (won || lost) {
      return;
    }

    if (modeId === "baby") {
      updateMessage(`Clue: ${WORD_CLUES[answer] ?? "Irvine knows this one."}`);
      return;
    }

    const nextCandidate =
      candidates.find((word) => !guesses.includes(word)) ?? candidates[0];

    if (!nextCandidate) {
      updateMessage("No hint fits. Impressive chaos.");
      return;
    }

    setCurrentGuess(nextCandidate);
    updateMessage("Free word loaded. Irvine has spoken.");
  }

  function submitGuess() {
    if (won || lost) {
      return;
    }

    if (currentGuess.length !== LETTERS || currentGuess.includes("_")) {
      updateMessage("Five letters first, superstar.");
      return;
    }

    if (currentGuess === "NIGGA") {
      rejectGuess("That is diabolical btw!");
      return;
    }

    if (disabledLetters.some((letter) => currentGuess.includes(letter))) {
      rejectGuess("That blacked-out letter is not invited.");
      return;
    }

    if (
      (modeId === "baby" || modeId === "standard") &&
      hasRepeatLetters(currentGuess)
    ) {
      rejectGuess("Do you not read the rules? No repeats!");
      return;
    }

    if (
      currentGuess !== "DIDDY" &&
      !VALID_GUESS_SET.has(currentGuess)
    ) {
      rejectGuess(invalidWordMessage(currentGuess));
      return;
    }

    const nextGuesses = [...guesses, currentGuess];
    const submittedRow = guesses.length;
    const currentScore = scoreGuess(currentGuess, answer);

    setGuesses(nextGuesses);
    setAnimatedRows((rows) =>
      rows.includes(submittedRow) ? rows : [...rows, submittedRow],
    );
    setCurrentGuess("");

    if (currentGuess === answer) {
      setFinalLetterRows(nextGuesses.map((_, rowIndex) => rowIndex));

      const result = {
        won: true,
        answer,
        guesses: nextGuesses,
        guessesUsed: nextGuesses.length,
        modeId,
      };

      showResultAfterEffect(result);
      recordResult(result);
      updateMessage(
        nextGuesses.length === 1
          ? "One-shot legend. Irvine bows."
          : "Solved. Irvine has been defeated.",
      );
    } else if (nextGuesses.length === MAX_ATTEMPTS) {
      setFinalLetterRows(nextGuesses.map((_, rowIndex) => rowIndex));

      const result = {
        won: false,
        answer,
        guesses: nextGuesses,
        guessesUsed: nextGuesses.length,
        modeId,
      };

      showResultAfterEffect(result);
      recordResult(result);
      updateMessage(`Answer: ${answer}`);
    } else {
      updateMessage(
        guessReactionMessage(
          currentGuess,
          currentScore,
        ),
      );
    }
  }

  function pressKey(key) {
    if (key === "ENTER") {
      submitGuess();
      return;
    }

    if (key === "BACK") {
      setCurrentGuess((guess) => guess.slice(0, -1));
      return;
    }

    if (key === "SPACE") {
      if (!won && !lost && currentGuess.length < LETTERS) {
        setCurrentGuess((guess) => `${guess}_`);
      }
      return;
    }

    if (
      /^[A-Z]$/.test(key) &&
      currentGuess.length < LETTERS &&
      keyIsUsable(key, disabledLetters, won, lost)
    ) {
      setCurrentGuess((guess) => `${guess}${key}`);
    }
  }

  useEffect(() => {
    function syncViewportHeight() {
      const height = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--app-height", `${height}px`);
    }

    syncViewportHeight();
    window.visualViewport?.addEventListener("resize", syncViewportHeight);
    window.addEventListener("resize", syncViewportHeight);
    window.addEventListener("orientationchange", syncViewportHeight);

    return () => {
      window.visualViewport?.removeEventListener("resize", syncViewportHeight);
      window.removeEventListener("resize", syncViewportHeight);
      window.removeEventListener("orientationchange", syncViewportHeight);
    };
  }, []);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      const savedStats = localStorage.getItem(STATS_KEY);

      if (!active) {
        return;
      }

      if (savedStats) {
        try {
          setStats({ ...defaultStats(), ...JSON.parse(savedStats) });
        } catch {
          localStorage.removeItem(STATS_KEY);
        }
      }

      const savedGame = localStorage.getItem(GAME_KEY);

      if (savedGame) {
        try {
          const parsedGame = JSON.parse(savedGame);
          const savedModeId = MODES.some((mode) => mode.id === parsedGame.modeId)
            ? parsedGame.modeId
            : parsedGame.modeId === "advanced"
              ? "standard-plus"
              : "standard";
          const savedOffset = Number.isInteger(parsedGame.gameOffset)
            ? parsedGame.gameOffset
            : 0;
          const savedGuesses = Array.isArray(parsedGame.guesses)
            ? parsedGame.guesses.filter((guess) => /^[A-Z_]{5}$/.test(guess))
            : [];
          const savedCurrentGuess =
            typeof parsedGame.currentGuess === "string" &&
            /^[A-Z_]{0,5}$/.test(parsedGame.currentGuess)
              ? parsedGame.currentGuess
              : "";
          const savedMarks =
            parsedGame.marks &&
            typeof parsedGame.marks === "object" &&
            !Array.isArray(parsedGame.marks)
              ? parsedGame.marks
              : {};
          const hasSavedMessage =
            typeof parsedGame.message === "string" &&
            parsedGame.message.length <= 240;
          const savedMessage = hasSavedMessage ? parsedGame.message : null;
          const savedLastResult =
            parsedGame.lastResult &&
            typeof parsedGame.lastResult === "object" &&
            parsedGame.lastResult.answer === answerFor(savedModeId, savedOffset)
              ? parsedGame.lastResult
              : null;

          if (parsedGame.dayKey === gameDayKey()) {
            const savedAnswer = answerFor(savedModeId, savedOffset);
            const restoredGuesses = savedGuesses.slice(0, MAX_ATTEMPTS);

            setModeId(savedModeId);
            setGameOffset(savedOffset);
            setGuesses(restoredGuesses);
            setCurrentGuess(savedCurrentGuess);
            setMarks(savedMarks);
            setAnimatedRows([]);
            setFinalLetterRows([]);
            setRestoredScoreRows(restoredGuesses.map((_, index) => index));
            setResultOpen(false);

            if (restoredGuesses.includes(savedAnswer)) {
              setLastResult({
                won: true,
                answer: savedAnswer,
                guesses: restoredGuesses,
                guessesUsed:
                  restoredGuesses.findIndex((guess) => guess === savedAnswer) +
                  1,
                modeId: savedModeId,
              });
              setMessage(savedMessage ?? "Solved.");
            } else if (savedLastResult?.won === false) {
              setLastResult({
                won: false,
                answer: savedAnswer,
                guesses: restoredGuesses,
                guessesUsed: restoredGuesses.length,
                modeId: savedModeId,
                reason: savedLastResult.reason,
              });
              setMessage(savedMessage ?? `Answer: ${savedAnswer}`);
            } else if (restoredGuesses.length >= MAX_ATTEMPTS) {
              setLastResult({
                won: false,
                answer: savedAnswer,
                guesses: restoredGuesses,
                guessesUsed: MAX_ATTEMPTS,
                modeId: savedModeId,
              });
              setMessage(savedMessage ?? `Answer: ${savedAnswer}`);
            } else {
              setLastResult(null);
              setMessage(savedMessage ?? "Irvine is waiting.");
            }
          } else {
            localStorage.removeItem(GAME_KEY);
          }
        } catch {
          localStorage.removeItem(GAME_KEY);
        }
      }

      setGameLoaded(true);
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (resultTimerRef.current) {
        clearTimeout(resultTimerRef.current);
      }

      if (confettiTimerRef.current) {
        clearTimeout(confettiTimerRef.current);
      }

      if (invalidTimerRef.current) {
        clearTimeout(invalidTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!gameLoaded) {
      return;
    }

    localStorage.setItem(
      GAME_KEY,
      JSON.stringify({
        currentGuess,
        dayKey: gameDayKey(),
        gameOffset,
        guesses,
        marks,
        message,
        modeId,
        lastResult,
      }),
    );
  }, [
    currentGuess,
    gameLoaded,
    gameOffset,
    guesses,
    lastResult,
    marks,
    message,
    modeId,
  ]);

  useEffect(() => {
    if (!modeMenuOpen) {
      return;
    }

    function onPointerDown(event) {
      if (!modeMenuRef.current?.contains(event.target)) {
        setModeMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [modeMenuOpen]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const key = event.key.toUpperCase();

      if (event.key === "Enter") {
        pressKey("ENTER");
      } else if (event.key === "Backspace") {
        pressKey("BACK");
      } else if (event.key === " " || event.key === "-") {
        event.preventDefault();
        pressKey("SPACE");
      } else if (/^[A-Z]$/.test(key)) {
        pressKey(key);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const rows = Array.from({ length: MAX_ATTEMPTS }, (_, rowIndex) => {
    const guess = guesses[rowIndex];
    const letters = guess ?? (rowIndex === guesses.length ? currentGuess : "");
    const score = guess ? scoreGuess(guess, answer) : null;
    const feedback = guess ? scoreLetters(guess, answer) : null;

    return { feedback, guess, letters, score };
  });
  const revealFinalLetters = Boolean(lastResult?.answer === answer);
  const winPercent = stats.played
    ? Math.round((stats.wins / stats.played) * 100)
    : 0;
  const status = playerStatus(stats, winPercent);
  const distributionTotal = Object.values(stats.distribution).reduce(
    (total, count) => total + (Number(count) || 0),
    0,
  );
  const maxDistribution = Math.max(
    1,
    ...Object.values(stats.distribution).map((count) => Number(count) || 0),
  );

  return (
    <main className="game-shell h-dvh overflow-hidden overscroll-none bg-[#111111] px-5 pt-[clamp(0.5rem,1.9dvh,0.9rem)] pb-[clamp(0.25rem,1.2dvh,0.5rem)] text-[#dedede] sm:px-5">
      <section className="mx-auto flex h-full w-full max-w-5xl flex-col gap-2">
        <header className="mx-auto flex w-full max-w-[34.5rem] shrink-0 items-center justify-between rounded-[14px] border border-[#363638] bg-[#202021] px-2.5 py-[clamp(0.3rem,0.95dvh,0.48rem)] shadow-[0_18px_55px_rgba(0,0,0,0.38)] sm:px-3">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div
              aria-hidden="true"
              className="grid size-[var(--logo-size)] shrink-0 grid-cols-2 grid-rows-2 overflow-hidden bg-black text-center text-[length:var(--logo-font)] font-black leading-none text-black"
            >
              <span className="flex items-center justify-center border border-black bg-white">I</span>
              <span className="flex items-center justify-center border border-black bg-[#45d24d]">5</span>
              <span className="flex items-center justify-center border border-black bg-[#f2ea25]">0</span>
              <span className="flex items-center justify-center border border-black bg-[#ff3148]">0</span>
            </div>
            <h1 className="truncate text-[1.15rem] font-black uppercase tracking-[0.04em] text-[#d8d8da] sm:text-[1.45rem]">
              Irvine500
            </h1>
          </div>

          <div
            className="relative flex gap-1.5"
            ref={modeMenuRef}
          >
            <button
              type="button"
              onClick={openHelp}
              className="grid size-[var(--header-button)] place-items-center rounded-lg bg-[#353539] text-[#f0f0f1] transition hover:bg-[#414146]"
              title="How to play"
              aria-label="How to play"
            >
              <HelpIcon />
            </button>

            <button
              type="button"
              onClick={() => setModeMenuOpen((open) => !open)}
              className={`grid size-[var(--header-button)] place-items-center rounded-lg bg-[#353539] transition hover:bg-[#414146] ${
                gameLoaded ? activeMode.color : "text-[#8c8c91]"
              }`}
              title="Mode"
              aria-expanded={modeMenuOpen}
            >
              {gameLoaded ? (
                <ModeIcon type={activeMode.face} />
              ) : (
                <span
                  className="size-7 rounded-full border-2 border-[#8c8c91] bg-[#4a4a4f]"
                  aria-hidden="true"
                />
              )}
            </button>

            <button
              type="button"
              onClick={openResults}
              className="grid size-[var(--header-button)] place-items-center rounded-lg bg-[#353539] text-[#f0f0f1] transition hover:bg-[#414146]"
              title="Stats"
              aria-label="Open stats"
            >
              <ResultsIcon />
            </button>

            {modeMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+0.6rem)] z-20 w-[min(21rem,calc(100vw-1rem))] rounded-[14px] border border-[#3a3a3d] bg-[#202021] p-2.5 shadow-[0_20px_70px_rgba(0,0,0,0.5)]">
                {MODES.map((mode) => (
                  <button
                    type="button"
                    onClick={() => chooseMode(mode.id)}
                    className={`grid w-full grid-cols-[1.75rem_6.75rem_1fr] items-center gap-1.5 rounded-lg px-2 py-1.5 text-left transition hover:bg-[#303034] ${
                      mode.id === modeId ? "bg-[#2b2b2f]" : ""
                    }`}
                    key={mode.id}
                  >
                    <span className={`grid place-items-center ${mode.color}`}>
                      <ModeIcon
                        type={mode.face}
                        className="size-5"
                      />
                    </span>
                    <span className="text-sm font-medium text-[#dedede]">
                      {mode.label}
                    </span>
                    <span className="text-xs font-semibold leading-4 text-[#9c9ca0]">
                      {mode.rules.map((rule) => (
                        <span
                          className="block"
                          key={rule}
                        >
                          - {rule}
                        </span>
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <section
          className="mx-auto min-h-0 max-w-full"
          style={{ width: "var(--board-width)" }}
        >
          <div className="mb-1.5 flex min-h-6 items-center justify-between gap-2 px-1 text-xs font-black uppercase tracking-[0.06em] text-[#8c8c91]">
            <p className="truncate">{gameLoaded ? message : ""}</p>
          </div>

          <div
            className="grid gap-[var(--board-gap)]"
            aria-label="Irvine500 board"
          >
            {rows.map((row, rowIndex) => {
              const shouldAnimate = Boolean(
                row.guess && animatedRows.includes(rowIndex),
              );
              const shouldAnimateLetters = Boolean(
                row.guess && finalLetterRows.includes(rowIndex),
              );
              const shouldAnimateScore = Boolean(
                row.score &&
                  (shouldAnimate || restoredScoreRows.includes(rowIndex)),
              );

              return (
                <div
                  className={`grid grid-cols-8 gap-[var(--board-gap)] ${
                    invalidRow === rowIndex ? "row-shake" : ""
                  }`}
                  key={`row-${rowIndex}`}
                >
                  {Array.from({ length: LETTERS }, (_, tileIndex) => {
                    const mark = revealFinalLetters
                      ? row.feedback?.[tileIndex]
                      : marks[`${rowIndex}-${tileIndex}`];
                    const hasGuess = Boolean(row.guess);
                    const canMarkTile = hasGuess && !revealFinalLetters;

                    return (
                      <button
                        type="button"
                        onClick={() =>
                          canMarkTile && cycleMark(rowIndex, tileIndex)
                        }
                        disabled={!canMarkTile}
                        className={`grid aspect-square min-h-0 min-w-0 place-items-center rounded-md text-[length:var(--board-font)] font-black leading-none uppercase transition ${markClasses(
                          mark,
                        )} ${
                          shouldAnimateLetters
                            ? "letter-reveal hover:brightness-110"
                            : canMarkTile
                              ? "hover:brightness-110"
                              : ""
                        }`}
                        style={
                          shouldAnimateLetters
                            ? { "--reveal-delay": `${tileIndex * 80}ms` }
                            : undefined
                        }
                        key={`tile-${rowIndex}-${tileIndex}`}
                        title={canMarkTile ? "Cycle mark" : undefined}
                      >
                        {row.letters[tileIndex] ?? ""}
                      </button>
                    );
                  })}

                  <div
                    className={`grid aspect-square min-h-0 min-w-0 place-items-center rounded-md bg-[#58a84f] text-[length:var(--board-font)] font-black leading-none text-white ${
                      shouldAnimateScore ? "score-spin" : ""
                    }`}
                    style={
                      shouldAnimateScore
                        ? { "--score-delay": `${rowIndex * 35}ms` }
                        : undefined
                    }
                    key={`score-${rowIndex}-green-${row.guess ?? "empty"}`}
                  >
                    {row.score?.green ?? ""}
                  </div>
                  <div
                    className={`grid aspect-square min-h-0 min-w-0 place-items-center rounded-md bg-[#d0bb59] text-[length:var(--board-font)] font-black leading-none text-white ${
                      shouldAnimateScore ? "score-spin" : ""
                    }`}
                    style={
                      shouldAnimateScore
                        ? { "--score-delay": `${rowIndex * 35 + 80}ms` }
                        : undefined
                    }
                    key={`score-${rowIndex}-yellow-${row.guess ?? "empty"}`}
                  >
                    {row.score?.yellow ?? ""}
                  </div>
                  <div
                    className={`grid aspect-square min-h-0 min-w-0 place-items-center rounded-md bg-[#dc494c] text-[length:var(--board-font)] font-black leading-none text-white ${
                      shouldAnimateScore ? "score-spin" : ""
                    }`}
                    style={
                      shouldAnimateScore
                        ? { "--score-delay": `${rowIndex * 35 + 160}ms` }
                        : undefined
                    }
                    key={`score-${rowIndex}-red-${row.guess ?? "empty"}`}
                  >
                    {row.score?.red ?? ""}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto mt-[var(--keyboard-margin)] w-fit max-w-full shrink-0 rounded-[14px] border border-[#38383b] bg-[#242426] p-[var(--keyboard-pad)] shadow-[0_18px_55px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-[var(--key-gap)]">
            {KEY_ROWS.map((row, rowIndex) => (
              <div
                className="flex justify-center gap-[var(--key-gap)]"
                key={`keyboard-${row}`}
              >
                {row.split("").map((letter) => {
                  const disabled = disabledLetters.includes(letter);

                  return (
                    <button
                      type="button"
                      onClick={() => pressKey(letter)}
                      disabled={disabled || won || lost}
                      className={`grid h-[var(--key-height)] w-[var(--key-width)] place-items-center rounded-md text-sm font-black transition ${
                        disabled
                          ? "bg-[#111113] text-[#5b5b60]"
                          : "bg-[#37373b] text-[#d8d8da] hover:bg-[#444449]"
                      }`}
                      key={letter}
                      title={disabled ? "Excluded hint letter" : undefined}
                    >
                      {letter}
                    </button>
                  );
                })}
                {rowIndex === 2 && (
                  <button
                    type="button"
                    onClick={() => pressKey("BACK")}
                    disabled={won || lost}
                    className="grid h-[var(--key-height)] w-[calc(var(--key-width)*1.28)] place-items-center rounded-md bg-[#111113] text-sm font-black text-[#77777b] transition hover:bg-[#1b1b1f]"
                    title="Delete"
                  >
                    <BackspaceIcon />
                  </button>
                )}
              </div>
            ))}

            <div className="flex justify-center gap-[var(--key-gap)]">
              <button
                type="button"
                onClick={clearCurrentRow}
                className={`grid h-[var(--key-height)] place-items-center rounded-md bg-[#37373b] text-xs font-black text-[#d8d8da] transition hover:bg-[#444449] ${
                  showsHintKey
                    ? "w-[calc(var(--key-width)*1.65)]"
                    : "w-[calc(var(--key-width)*2.65+var(--key-gap))]"
                }`}
                title="Clear marks"
              >
                CLR
              </button>
              {showsHintKey ? (
                <button
                  type="button"
                  onClick={addHint}
                  className="grid h-[var(--key-height)] w-[var(--key-width)] place-items-center rounded-md bg-[#111113] text-base font-black text-[#77777b] transition hover:bg-[#1b1b1f]"
                  title="Hint"
                >
                  <HintIcon />
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => pressKey("SPACE")}
                disabled={won || lost}
                className="grid h-[var(--key-height)] w-[calc(var(--key-width)*5.45)] place-items-center rounded-md bg-[#37373b] text-xs font-black uppercase tracking-[0.24em] text-[#d8d8da] transition hover:bg-[#444449]"
              >
                Space
              </button>
              <button
                type="button"
                onClick={() => pressKey("ENTER")}
                disabled={won || lost}
                className="grid h-[var(--key-height)] w-[var(--key-width)] place-items-center rounded-md bg-[#111113] text-base font-black text-[#77777b] transition hover:bg-[#1b1b1f]"
                title="Submit"
              >
                <CheckIcon />
              </button>
            </div>

          </div>
        </section>

        <SocialLinks />
      </section>

      <BobaTip />

      {endEffect === "win" && (
        <div
          className="celebration-overlay"
          aria-hidden="true"
        >
          {Array.from({ length: 144 }, (_, index) => (
            <span
              className="confetti-piece"
              style={{
                "--confetti-delay": `${(index % 60) * 85}ms`,
                "--confetti-left": `${8 + ((index * 17) % 84)}%`,
                "--confetti-rotate": `${(index * 37) % 180}deg`,
                "--confetti-size": `${0.42 + (index % 5) * 0.08}rem`,
                "--confetti-x": `${((index % 9) - 4) * 0.45}rem`,
              }}
              key={`confetti-${index}`}
            />
          ))}
        </div>
      )}

      {endEffect === "loss" && (
        <div className="celebration-overlay">
          <div
            className="cry-effect"
            aria-label="Game over"
            role="img"
          >
            <span className="cry-face">😭</span>
            <span className="tear tear-left" />
            <span className="tear tear-right" />
          </div>
        </div>
      )}

      {pendingMode && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/68 px-3">
          <section className="w-full max-w-sm rounded-[18px] border border-[#3a3a3d] bg-[#202021] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.65)]">
            <div className="flex items-start justify-between gap-4">
              <div className="pt-1">
                <h2 className="text-2xl font-semibold text-[#f0f0f1]">
                  {isPendingSameMode ? "New game?" : "Switch mode?"}
                </h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#b9b9bd]">
                  {isPendingSameMode
                    ? `Starting a new ${pendingMode.label} game will reset your progress and pick a new word.`
                    : `Switching to ${pendingMode.label} will reset your progress and pick a new word.`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPendingModeId(null)}
                className="-mt-1 grid size-10 shrink-0 place-items-center rounded-lg bg-[#111113] text-[#85858a] transition hover:bg-[#303034]"
                title="Cancel"
                aria-label="Cancel mode switch"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPendingModeId(null)}
                className="rounded-lg border border-[#3f3f43] bg-[#2b2b2f] px-4 py-3 text-sm font-black text-[#d8d8da] transition hover:bg-[#353539]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModeChange}
                className="rounded-lg bg-[#58a84f] px-4 py-3 text-sm font-black text-white transition hover:bg-[#67b95e]"
              >
                {isPendingSameMode ? "New Game" : "Switch"}
              </button>
            </div>
          </section>
        </div>
      )}

      {helpOpen && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/68 px-3">
          <section className="w-full max-w-md rounded-[18px] border border-[#3a3a3d] bg-[#202021] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.65)]">
            <div className="flex items-start justify-between gap-4">
              <div className="pt-1">
                <h2 className="text-3xl font-semibold text-[#f0f0f1]">
                  How to play
                </h2>
                <p className="mt-1 text-sm font-bold text-[#9c9ca0]">
                  Guess the Irvine500 word in {MAX_ATTEMPTS} tries.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="-mt-1 grid size-10 shrink-0 place-items-center rounded-lg bg-[#111113] text-[#85858a] transition hover:bg-[#303034]"
                title="Close"
                aria-label="Close help"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-5 space-y-3 text-sm font-semibold leading-6 text-[#d8d8da]">
              <p>
                Guess the secret Irvine500 word in 8 tries. Every guess must be
                a real 5-letter word, including words from the Irvine bank.
              </p>
              <p>
                The three score boxes on the right only show counts. They do
                not tell you which exact letters are correct.
              </p>
              <div className="grid gap-2 rounded-lg bg-[#2b2b2f] p-3">
                <div className="flex items-center gap-3">
                  <span className="size-5 rounded bg-[#58a84f]" />
                  <span>Green: correct letter, correct spot.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="size-5 rounded bg-[#d0bb59]" />
                  <span>Yellow: correct letter, wrong spot.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="size-5 rounded bg-[#dc494c]" />
                  <span>Red: letter is not in the answer.</span>
                </div>
              </div>
              <p>
                Click your letter tiles to mark your own notes: blank, red,
                yellow, then green. Use CLR to reset those marks.
              </p>
              <p>
                Space inserts an underscore placeholder while you think through
                a possible word. On a physical keyboard, Space or hyphen works.
              </p>
              <p className="text-[#9c9ca0]">
                Irvine gives clue text. Irvine+ has no hints and no repeats.
                Pro allows repeats.
              </p>
            </div>
          </section>
        </div>
      )}

      {resultOpen && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/68 px-3">
          <section className="max-h-[calc(100vh-1rem)] w-full max-w-md overflow-y-auto rounded-[18px] border border-[#3a3a3d] bg-[#202021] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.65)]">
            <div className="flex items-start justify-between gap-4">
              <div className="pt-1">
                <h2
                  className={`text-3xl font-black text-[#f0f0f1] ${
                    lastResult ? "" : "font-semibold"
                  }`}
                >
                  {lastResult ? lastResult.answer : "Statistics"}
                </h2>
                {lastResult && (
                  <p
                    className={`mt-1 text-sm font-black ${
                      lastResult.won ? "text-[#58a84f]" : "text-[#dc494c]"
                    }`}
                  >
                    {lastResult.won
                      ? `Solved in ${lastResult.guessesUsed}/${MAX_ATTEMPTS}`
                      : `Game over - missed in ${MAX_ATTEMPTS}`}
                  </p>
                )}
                {!lastResult && (
                  <p className="mt-1 text-sm font-bold text-[#9c9ca0]">
                    {stats.played === 1
                      ? "1 game played"
                      : `${stats.played} games played`}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setResultOpen(false)}
                className="-mt-1 grid size-10 shrink-0 place-items-center rounded-lg bg-[#111113] text-[#85858a] transition hover:bg-[#303034]"
                title="Close"
                aria-label="Close"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 rounded-lg bg-[#2b2b2f] p-3">
              {[
                ["Games Played", stats.played, ""],
                ["Win %", `${winPercent}%`, ""],
                ["Current Streak", stats.currentStreak, " 🔥"],
                ["Max Streak", stats.maxStreak, " 🔥"],
              ].map(([label, value, suffix]) => (
                <div
                  className="contents text-sm"
                  key={label}
                >
                  <p className="font-bold text-[#9c9ca0]">
                    {label}
                  </p>
                  <p className="text-left font-black text-[#f0f0f1]">
                    {value}
                    {suffix}
                  </p>
                </div>
              ))}
              <div className="col-span-2 mt-1 border-t border-[#3a3a3d] pt-2">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <p className="font-bold text-[#9c9ca0]">Status</p>
                  <p className="text-right font-black text-[#f0f0f1]">
                    {status}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-bold text-[#d8d8da]">
                Guess distribution
              </p>
              <div className="space-y-1.5">
                {Array.from({ length: MAX_ATTEMPTS }, (_, index) => {
                  const guessNumber = index + 1;
                  const count = stats.distribution[guessNumber] || 0;
                  const width =
                    distributionTotal === 0
                      ? "100%"
                      : `${Math.max(8, (count / maxDistribution) * 100)}%`;

                  return (
                    <div
                      className="grid grid-cols-[1.25rem_1fr] items-center gap-2"
                      key={guessNumber}
                    >
                      <span className="text-sm font-black text-[#b7b7bb]">
                        {guessNumber}
                      </span>
                      <div className="h-6 rounded bg-[#111113]">
                        <div
                          className="flex h-6 items-center justify-end rounded bg-[#58a84f] pr-2 text-xs font-black leading-none text-white"
                          style={{ width }}
                        >
                          {count}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {lastResult && (
              <>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={copyResults}
                    className="h-11 rounded-lg bg-[#37373b] text-sm font-black uppercase tracking-[0.08em] text-[#f0f0f1] transition hover:bg-[#444449]"
                  >
                    Copy Results
                  </button>
                  <button
                    type="button"
                    onClick={shareResults}
                    className="h-11 rounded-lg bg-[#58a84f] text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-[#66ba5c]"
                  >
                    Share
                  </button>
                </div>

                <button
                  type="button"
                  onClick={startNextGame}
                  className="mt-2 h-11 w-full rounded-lg bg-[#111113] text-sm font-black uppercase tracking-[0.1em] text-[#d8d8da] transition hover:bg-[#303034]"
                >
                  New Game
                </button>
              </>
            )}

            {shareStatus && (
              <p className="mt-3 min-h-5 text-center text-xs font-bold uppercase tracking-[0.12em] text-[#8d8d92]">
                {shareStatus}
              </p>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
