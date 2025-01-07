export interface ImpactScoreData {
  Environmental?: {
    [key: string]: number;
  };
  Social?: {
    [key: string]: number;
  };
  impacted_services?: {
    [key: string]: {
      impact: 'positive' | 'negative' | 'neutral';
      details: string;
    };
  };
}