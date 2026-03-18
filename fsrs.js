export const W = [
  0.4026, 1.1839, 3.1730, 15.6910,
  7.1949, 0.5345, 1.4604,
  0.0046, 1.5458, 0.1192, 1.0193,
  1.9395, 0.1100, 0.2961, 2.2698,
  0.2315, 2.9898, 0.5166, 0.6621
];

const now = () => Date.now() / 1000;

export function retrievability(card) {
  const elapsed = now() - card.last_review;
  return Math.pow(1 + elapsed / card.stability, -W[0]);
}

function updateDifficulty(d, rating) {
  return d + W[1] * (rating - 3);
}

function updateStability(card, rating, R) {
  const { stability, difficulty } = card;

  if (rating === 1) {
    return W[2];
  }

  if (rating === 2) {
    return stability * (1 + Math.exp(W[3]) * Math.pow(difficulty, -W[4]) * (Math.pow(stability, -W[5])) * (Math.exp((1 - R) * W[6])));
  }

  if (rating === 3) {
    return stability * (1 + Math.exp(W[7]) * Math.pow(difficulty, -W[8]) * (Math.pow(stability, -W[9])) * (Math.exp((1 - R) * W[10])));
  }

  if (rating === 4) {
    return stability * (1 + Math.exp(W[11]) * Math.pow(difficulty, -W[12]) * (Math.pow(stability, -W[13])) * (Math.exp((1 - R) * W[14])));
  }
}

function nextInterval(stability) {
  return stability * W[15];
}

export function reviewCard(card, rating) {
  const R = retrievability(card);

  const newDifficulty = Math.max(1, updateDifficulty(card.difficulty, rating));
  const newStability = updateStability(card, rating, R);

  const interval = nextInterval(newStability);

  return {
    ...card,
    difficulty: newDifficulty,
    stability: newStability,
    last_review: now(),
    due: now() + interval
  };
      }
