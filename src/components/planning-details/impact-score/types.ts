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
    energy_efficiency?: number;
    water_conservation?: number;
  };
  Social?: {
    community: number;
    cultural: number;
    economic: number;
    local_customs?: number;
    economic_activities?: number;
  };
  [key: string]: Record<string, number> | undefined;
}

export interface ImpactScoreData {
  Environmental?: Record<string, number>;
  Social?: Record<string, number>;
  key_concerns?: string[];
  recommendations?: string[];
  impacted_services?: {
    [key: string]: {
      impact: 'positive' | 'negative' | 'neutral';
      details: string;
    };
  };
}