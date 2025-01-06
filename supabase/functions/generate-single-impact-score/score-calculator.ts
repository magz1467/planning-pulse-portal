export function calculateNormalizedScore(scores: Record<string, any>): number {
  let totalScore = 0;
  let totalWeights = 0;

  // Define category weights
  const categoryWeights = {
    'Environmental': 1.2,
    'Social': 1.0,
    'Infrastructure': 0.8
  };

  for (const [category, subcategories] of Object.entries(scores)) {
    const categoryWeight = categoryWeights[category] || 1.0;
    for (const score of Object.values(subcategories as Record<string, number>)) {
      const weight = categoryWeight;
      totalScore += (score as number) * weight;
      totalWeights += weight;
    }
  }

  return Math.round((totalScore / totalWeights) * 20);
}