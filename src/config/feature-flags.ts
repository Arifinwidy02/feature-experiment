import type { FeatureFlag } from "../types/feature-flag.types";

export const DEFAULT_FEATURE_FLAGS: FeatureFlag[] = [
  {
    key: "show-recommendation-banner",
    enabled: true,
    rolloutPercentage: 100,
  },
  {
    key: "new-checkout-experience",
    enabled: false,
    rolloutPercentage: 100,
  },
  {
    key: "product-reviews",
    enabled: true,
    rolloutPercentage: 50,
  },
];
