export interface TrendPoint {
  date: string;
  presentCount: number;
}

export const mockTrend: Record<string, TrendPoint[]> = {
  p1: [
    { date: "2026-05-10", presentCount: 3 },
    { date: "2026-06-05", presentCount: 5 },
    { date: "2026-07-15", presentCount: 7 },
  ],
};

export const mockRecommendations: Record<string, string[]> = {
  p1: [
    "Continue joint-attention games during snack time.",
    "Practice turn-taking with simple picture cards.",
    "Reinforce eye contact using preferred toys as motivators.",
  ],
};