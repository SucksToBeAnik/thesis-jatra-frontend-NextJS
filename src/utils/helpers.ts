import { v4 as uuidv4 } from "uuid";

export function generateRandomName() {
  const adjectives = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Purple",
    "Orange",
    "Pink",
    "Black",
    "White",
    "Grey",
  ];
  const nouns = [
    "Dog",
    "Cat",
    "Bird",
    "Fish",
    "Elephant",
    "Giraffe",
    "Lion",
    "Tiger",
    "Bear",
    "Wolf",
  ];
  return (
    adjectives[Math.floor(Math.random() * adjectives.length)] +
    " " +
    nouns[Math.floor(Math.random() * nouns.length)] +
    uuidv4().slice(0, 4)
  );
}
