export interface CategoryScore {
  score: number;
  details: string;
}

export interface ImpactCategory {
  category: string;
  scoreData: CategoryScore;
}

export interface ImpactScores {
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
}

export interface ImpactScoreData {
  impact_scores: ImpactScores;
  key_concerns?: string[];
  recommendations?: string[];
  impacted_services?: {
    [key: string]: {
      impact: 'positive' | 'negative' | 'neutral';
      details: string;
    };
  };
}