export function averageRounded(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error("Input must be a non-empty array of numbers.");
  }

  let sum = numbers.reduce((acc, num) => acc + num, 0);
  let average = sum / numbers.length;

  return average;
}
