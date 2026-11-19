export interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage: number;
  targeting?: {
    userIds?: string[];
  };
}
