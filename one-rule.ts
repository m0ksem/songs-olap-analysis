import data from "./data"
import { json } from "./data-parse"

function calc(crit, data: { genre: string, open_notes: string, muted_notes: string, bpm: string, song_level: string }[]) {
  const uniqCritValues = Array.from(new Set(data.map((r) => r[crit])))

  const grouped = uniqCritValues.reduce((acc, uniqCrit) => {
    acc[uniqCrit] = data.filter((r) => r[crit] === uniqCrit)
    return acc
  }, {})

  const counts = Object.keys(grouped).map((key) => {
    const easyCount = grouped[key].reduce((acc, cur) => {
      if (cur.song_level === "easy") { return acc + 1 }
      return acc
    }, 0)

    const midCount = grouped[key].reduce((acc, cur) => {
      if (cur.song_level === "mid") { return acc + 1 }
      return acc
    }, 0)

    const hardCount = grouped[key].reduce((acc, cur) => {
      if (cur.song_level === "hard") { return acc + 1 }
      return acc
    }, 0)

    const className = easyCount > midCount ? "easy" : hardCount > midCount ? "hard" : "mid"
    const easyProbability = easyCount / (easyCount + midCount + hardCount)
    const midProbability = midCount / (easyCount + midCount + hardCount)
    const hardProbability = hardCount / (easyCount + midCount + hardCount)


    return {
      [crit]: key,
      easyCount,
      midCount,
      hardCount,
      className,
      easyProbability: easyProbability.toFixed(2),
      midProbability: midProbability.toFixed(2),
      hardProbability: hardProbability.toFixed(2),
    }
  })
  return counts
}

console.log('Genre')
console.table(calc('genre', json(data)))
console.log('')
console.log('BPM')
console.table(calc('bpm', json(data)))
console.log('')
console.log('Open Notes')
console.table(calc('open_notes', json(data)))