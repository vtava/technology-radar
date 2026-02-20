export type RadarRing = {
  id: string;
  label: string;
  order: number;
  color?: string;
};

export type RadarQuadrant = {
  id: string;
  label: string;
};

export type RadarLink = {
  label: string;
  url: string;
};

export type RadarEntry = {
  id: string;
  name: string;
  quadrantId: string;
  ringId: string;
  description: string;
  tags: string[];
  owner: string;
  lastUpdated: string;
  links: RadarLink[];
  maturity?: string;
  status?: string;
};

export type RadarConfig = {
  title: string;
  updatedAt: string;
  rings: RadarRing[];
  quadrants: RadarQuadrant[];
  entries: RadarEntry[];
};
