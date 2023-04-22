export function convertToRange(scalar) {
  const ranges = [
    [0, 50],
    [51, 100],
    [101, 140],
    [141, 180],
    [181, 200],
    [201, 240],
    [241, 280],
    [281, 320]
  ];

  return (
    ranges
      .find((range) => scalar >= range[0] && scalar <= range[1])
      ?.join("-") || "NaN-NaN"
  );
}

export function rangifyData(data) {
  return data.map((item) => ({
    ...item,
    bpm: convertToRange(item.bpm),
    open_notes: convertToRange(item.open_notes),
    muted_notes: convertToRange(item.open_notes)
  })) as { genre: string, open_notes: string, muted_notes: string, bpm: string, song_level: string }[]
}

export const json = (text: string) => rangifyData(text
  .split("\n")
  .map((r) => r.replace(/\s/g, " ").split(" "))
  .map((r) => ({
    genre: r[0],
    open_notes: r[1],
    muted_notes: r[2],
    bpm: r[3],
    song_level: r[4]
  })))
