export const getScoreExplanation = (category: string, value: number) => {
  const impactLevels = {
    1: "minimal",
    2: "low",
    3: "moderate",
    4: "significant",
    5: "severe",
  };

  const explanations: Record<string, Record<number, string>> = {
    air_quality: {
      1: "No significant impact on local air quality expected",
      2: "Minor changes to local air quality possible",
      3: "Moderate impact on local air quality expected",
      4: "Significant impact on local air quality likely",
      5: "Major impact on local air quality expected",
    },
    noise: {
      1: "Minimal noise impact expected",
      2: "Low level increase in ambient noise",
      3: "Moderate noise levels during development",
      4: "Significant noise impact likely",
      5: "High levels of noise impact expected",
    },
    community: {
      1: "Minimal impact on community dynamics",
      2: "Minor changes to community structure",
      3: "Moderate impact on local community",
      4: "Significant community changes expected",
      5: "Major impact on community structure",
    },
  };

  const defaultExplanation = `${
    impactLevels[value] || "moderate"
  } impact expected`;
  return explanations[category]?.[value] || defaultExplanation;
};