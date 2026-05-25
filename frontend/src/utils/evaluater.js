export const evaluateCode = (userOutput, expectedOutput) => {
  if (userOutput.trim() === expectedOutput.trim()) {
    return "Accepted";
  }
  return "Wrong Answer";
};
