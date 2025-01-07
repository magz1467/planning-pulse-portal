export interface CategoryScore {
  score: number;
  details: string;
}

export interface ImpactScoreDetails {
  [category: string]: CategoryScore;
}

export interface ImpactScoreData extends ImpactScoreDetails {
  key_concerns?: string[];
  recommendations?: string[];
}

export interface ImpactCategory {
  category: string;
  scoreData: CategoryScore;
}