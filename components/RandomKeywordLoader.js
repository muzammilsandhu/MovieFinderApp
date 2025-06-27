import { useEffect } from "react";

const RANDOM_KEYWORDS = [
  "star",
  "love",
  "man",
  "night",
  "war",
  "hero",
  "dream",
  "life",
  "fire",
  "ghost",
];

export default function RandomKeywordLoader({ onLoad }) {
  useEffect(() => {
    const randomWord =
      RANDOM_KEYWORDS[Math.floor(Math.random() * RANDOM_KEYWORDS.length)];
    onLoad(randomWord);
  }, []);

  return null;
}
