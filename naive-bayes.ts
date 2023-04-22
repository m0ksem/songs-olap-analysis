import data from './data';
import { convertToRange, json } from "./data-parse";

const SEPARATOR = "|";

class NaiveBayesClassifier {
  classProbabilities = new Map();
  featureProbabilities = new Map();

  fit(data, target) {
    const classCounts = new Map();
    const featureCounts = new Map();

    for (const item of data) {
      const cls = item[target];

      classCounts.set(cls, (classCounts.get(cls) || 0) + 1);

      for (const feature in item) {
        if (feature === target) continue;

        const key = [feature, item[feature], cls].join(SEPARATOR);
        featureCounts.set(key, (featureCounts.get(key) || 0) + 1);
      }
    }

    const totalCount = data.length;

    for (const [cls, count] of classCounts.entries()) {
      this.classProbabilities.set(cls, count / totalCount);
    }

    for (const [key, count] of featureCounts.entries()) {
      const [, , cls] = key.split(SEPARATOR);
      this.featureProbabilities.set(key, count / classCounts.get(cls));
    }
  }

  predict(item) {
    const probs: Record<string, number> = {};

    for (const [cls, classProb] of this.classProbabilities.entries()) {
      let prob = 1;

      for (const feature in item) {
        const key = [feature, item[feature], cls].join(SEPARATOR);
        prob *= this.featureProbabilities.get(key) || 0;
      }

      probs[cls] = prob;
    }

    // Fix zeros
    const allProbs = Object.values(probs).reduce((acc, v) => acc + v, 0);

    Object.keys(probs).forEach((key) => {
      probs[key] = probs[key] / allProbs;
    });

    return probs;
  }
}

const classifier = new NaiveBayesClassifier();
classifier.fit(json(data), "song_level");

const predict = (item) => {
  const probs = classifier.predict({
    ...item,
    bpm: convertToRange(item.bpm),
    open_notes: convertToRange(item.open_notes)
  });

  console.log("Input:", item);
  console.table(Object.entries(probs));
  console.log(
    "Potential class:",
    Object.entries(probs).reduce((acc, v) => (v[1] > acc[1] ? v : acc))[0]
  );
};

predict({ genre: "black-metal", open_notes: 60, bpm: 84 });
console.log()
predict({ genre: "punk-rock", open_notes: 170, bpm: 200 });
console.log()
predict({ genre: "death-metal", open_notes: 220, bpm: 220 });
