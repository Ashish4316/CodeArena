export const evaluateCode = (userOutput, expectedOutput) => {
  if (userOutput === expectedOutput) {
    return "Correct Output";
  }
  return "Incorrect Output";
};