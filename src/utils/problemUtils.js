import Fuse from "fuse.js";

// Group problems by topic, subtag, difficulty
export function groupProblems(problems) {
  const groupedProblems = {};
  problems.forEach((problem) => {
    let rootTag = "Other", subTag = "General";
    if (problem.tag) {
      const [root, ...rest] = problem.tag.split("/");
      rootTag = root.trim();
      subTag = rest.length > 0 ? rest.join("/").trim() : "General";
    }
    const difficulty = problem.difficulty || "Medium";
    if (!groupedProblems[rootTag]) groupedProblems[rootTag] = {};
    if (!groupedProblems[rootTag][subTag]) groupedProblems[rootTag][subTag] = {};
    if (!groupedProblems[rootTag][subTag][difficulty]) groupedProblems[rootTag][subTag][difficulty] = [];
    groupedProblems[rootTag][subTag][difficulty].push(problem);
  });
  return groupedProblems;
}

// Sort grouped problems (frequency then title)
const freqOrder = { "Very High": 1, "High": 2, "Medium": 3, "Low": 4, "Other": 5 };
export function sortGroupedProblems(groupedProblems) {
  Object.keys(groupedProblems).forEach((rootTag) => {
    Object.keys(groupedProblems[rootTag]).forEach((subTag) => {
      Object.keys(groupedProblems[rootTag][subTag]).forEach((difficulty) => {
        groupedProblems[rootTag][subTag][difficulty].sort((a, b) => {
          const fa = freqOrder[a.frequency] || 99;
          const fb = freqOrder[b.frequency] || 99;
          if (fa !== fb) return fa - fb;
          return (a.title || '').localeCompare(b.title || '');
        });
      });
    });
  });
  return groupedProblems;
}

// Unique topics from problems
export function getTopics(problems) {
  return [...new Set(problems.map(p =>
    p.tag ? p.tag.split('/')[0].trim() : "Other"
  ))].sort();
}

// Fuzzy search + filters
export function searchAndFilterProblems({ problems, filters, search, fuseOptions }) {
  // Filter by fields
  let filteredProblems = problems.filter((problem) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key]) return true;
      if (key === 'companies') {
        return problem.companies?.includes(filters[key]);
      }
      if (Array.isArray(problem[key])) {
        return problem[key].some((item) =>
          item.toLowerCase().includes(filters[key].toLowerCase())
        );
      }
      return problem[key]
        ? problem[key].toLowerCase().includes(filters[key].toLowerCase())
        : true;
    });
  });
  // Fuzzy search
  if (search) {
    const fuse = new Fuse(filteredProblems, fuseOptions);
    return fuse.search(search).map(result => result.item);
  }
  return filteredProblems;
}

// Unique companies
export function getUniqueCompanies(problems) {
  return [...new Set(problems.flatMap((problem) => problem.companies || []))];
}
