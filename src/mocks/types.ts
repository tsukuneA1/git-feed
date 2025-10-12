export type MockTag = {
  id: string;
  label: string;
  description: string;
};

export type MockFeedItem = {
  id: string;
  title: string;
  url: string;
  repository: {
    owner: string;
    name: string;
    language: string;
    stars: number;
    description: string;
  };
  tags: string[];
  summary: string;
  changeSummary: string;
  additions: number;
  deletions: number;
  mergedAt: string;
};

export type MockAuthState = {
  status: "signed-out" | "signed-in";
  userName?: string;
  lastSignedInAt?: string;
  welcomeMessage?: string;
};

export type TimelineResponse = {
  feeds: MockFeedItem[];
  selectedTagIds: string[];
  configuredTagIds: string[];
  updatedAt: string;
};

export type TagPageResponse = {
  tags: MockTag[];
  selectedTagIds: string[];
  page: number;
  totalPages: number;
};
