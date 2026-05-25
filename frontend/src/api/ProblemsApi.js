export const fetchProblems = async () => {
  try {
    const res = await fetch(
      "https://codeforces.com/api/problemset.problems"
    );
    const data = await res.json();

    if (data.status !== "OK") throw new Error("API error");

    return data.result.problems.slice(0, 20).map((p, idx) => ({
      id: idx + 1,
      title: p.name,
      difficulty: p.rating ? p.rating : "Unrated",
      tags: p.tags
    }));
  } catch (error) {
    const local = await fetch("/problems.json");
    return local.json();
  }
};
