export const PETITION_REASONS = [
  { id: "privacy", label: "Loss of privacy" },
  { id: "light", label: "Loss of light" },
  { id: "parking", label: "Car parking" },
  { id: "traffic", label: "Traffic generation" },
  { id: "noise", label: "Noise and disturbance" },
  { id: "character", label: "Character of the area" },
  { id: "greenbelt", label: "Green belt" },
  { id: "conservation", label: "Conservation area" },
  { id: "design", label: "Design, appearance and layout" },
  { id: "policies", label: "National and local policies" },
  { id: "other", label: "Other" },
] as const;

export type PetitionReason = typeof PETITION_REASONS[number]["id"];