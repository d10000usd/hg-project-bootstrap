export function formatNumberWithSuffix(number: number): string {
  const suffixes: string[] = ["", "K", "M", "B", "T"];
  let suffixIndex: number = 0;

  while (number >= 1000 && suffixIndex < suffixes.length - 1) {
    number /= 1000;
    suffixIndex++;
  }

  return number.toFixed(2) + suffixes[suffixIndex];
}


