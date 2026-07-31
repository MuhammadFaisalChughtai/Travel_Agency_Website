const mockPool = [
  { text: "umrah packages 2026", searches: 2400, competition: "LOW", competitionIndex: 10 },
  { text: "cheap umrah packages from uk", searches: 1900, competition: "MEDIUM", competitionIndex: 35 },
  { text: "visa for umrah from uk", searches: 950, competition: "LOW", competitionIndex: 5 },
  { text: "family umrah package deals", searches: 800, competition: "LOW", competitionIndex: 15 },
  { text: "cheap flights to saudi arabia", searches: 1200, competition: "MEDIUM", competitionIndex: 40 },
  { text: "family holidays package deals", searches: 3400, competition: "LOW", competitionIndex: 20 },
  { text: "best deals on flights", searches: 4200, competition: "MEDIUM", competitionIndex: 45 },
];

const seedPhrases = ['umrah packages', 'cheap flights', 'family holidays', 'visa for umrah from uk'];

let keywordIdeas = mockPool.filter(item => 
  seedPhrases.some(seed => 
    item.text.toLowerCase().includes(seed.toLowerCase().split(" ")[0])
  )
);

console.log("Filtered to seeds count:", keywordIdeas.length);

const usedSlugs = new Set();
const usedKeywords = new Set();

const filtered = keywordIdeas.filter(k => {
  const keywordText = k.text.toLowerCase().trim();
  const slug = keywordText.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const hasSlug = usedSlugs.has(slug);
  const hasKw = usedKeywords.has(keywordText);
  
  const compCond = (k.competition === "LOW" || k.competition === "MEDIUM" || k.competitionIndex < 50);
  const searchCond = k.searches >= 30;
  const intentCond = (keywordText.includes("package") || keywordText.includes("deal") || keywordText.includes("book") || keywordText.includes("cheap") || keywordText.includes("best") || keywordText.includes("umrah") || keywordText.includes("holiday"));

  console.log(`Keyword: "${k.text}"`);
  console.log(`- hasSlug: ${hasSlug}`);
  console.log(`- hasKw: ${hasKw}`);
  console.log(`- compCond: ${compCond} (val: ${k.competition}, index: ${k.competitionIndex})`);
  console.log(`- searchCond: ${searchCond} (val: ${k.searches})`);
  console.log(`- intentCond: ${intentCond}`);
  
  return !hasSlug && !hasKw && compCond && searchCond && intentCond;
});

console.log("Final filtered count:", filtered.length);
