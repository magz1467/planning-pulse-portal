export interface CategoryScore {
  score: number;
  details: string;
}

export interface ImpactScoreDetails {
  [key: string]: CategoryScore;
}

export interface ImpactScoreData {
  impact_scores: {
    Environmental?: {
      air_quality: number;
      noise: number;
      ecosystem: number;
      biodiversity: number;
      water_quality: number;
    };
    Social?: {
      community: number;
      cultural: number;
      economic: number;
    };
    [key: string]: Record<string, number> | undefined;
  };
  key_concerns?: string[];
  recommendations?: string[];
  impacted_services?: {
    [key: string]: {
      impact: 'positive' | 'negative' | 'neutral';
      details: string;
    };
  };
}

export interface ImpactCategory {
  category: string;
  scoreData: CategoryScore;
}