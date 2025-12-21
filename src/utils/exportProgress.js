import { getAllProgress } from "./storage";

export const exportCSV = () => {
  const progress = getAllProgress();
  let csv = "Sheet,QuestionID,Solved\n";

  Object.entries(progress).forEach(([sheet, qs]) => {
    Object.entries(qs).forEach(([id, solved]) => {
      csv += `${sheet},${id},${solved}\n`;
    });
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "codearena_progress.csv";
  a.click();
};
