import fs from "fs";
import { select } from "@inquirer/prompts";
import { reviewCard } from "./fsrs.js";

const loadCards = () => {
  return JSON.parse(fs.readFileSync("./cards.json", "utf-8"));
};

const saveCards = (cards) => {
  fs.writeFileSync("./cards.json", JSON.stringify(cards, null, 2));
};

const study = async () => {
  let cards = loadCards();

  const now = Date.now() / 1000;

  const dueCards = cards.filter(c => c.due <= now);

  if (dueCards.length === 0) {
    console.log("0 Cards Review");
    return;
  }

  for (let card of dueCards) {
    console.log("\n📖 Question:");
    console.log(card.question);

    await select({
      message: "Press ENTER to see answer",
      choices: [{ name: "Show answer", value: "show" }]
    });

    console.log("\n💡 Answer:");
    console.log(card.answer);

    const rating = await select({
      message: "\n\n",
      choices: [
        { name: "Again (1)", value: 1 },
        { name: "Hard (2)", value: 2 },
        { name: "Good (3)", value: 3 },
        { name: "Easy (4)", value: 4 }
      ]
    });

    const updated = reviewCard(card, rating);

    const index = cards.findIndex(c => c.id === card.id);
    cards[index] = updated;

    console.log("Next review:", new Date(updated.due * 1000));
  }

  saveCards(cards);
};

study();
