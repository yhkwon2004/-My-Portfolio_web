export type Locale = "ko" | "en";

export type ItemType =
  | "profile"
  | "award"
  | "project"
  | "education"
  | "experience"
  | "certification"
  | "archive";

export type PortfolioImage = {
  url: string;
  altKo: string;
  altEn: string;
  role?: "cover" | "gallery" | "certificate" | "evidence";
};

export type PortfolioItem = {
  id: string;
  type: ItemType;
  titleKo: string;
  titleEn: string;
  summaryKo: string;
  summaryEn: string;
  year?: string;
  tags: string[];
  featured: boolean;
  featuredRank: number;
  visible: boolean;
  images: PortfolioImage[];
  links?: { label: string; url: string }[];
  details?: Record<string, string | string[]>;
};

export type PortfolioContent = {
  updatedAt: string;
  settings: {
    ownerKo: string;
    ownerEn: string;
    headlineKo: string;
    headlineEn: string;
    quoteKo: string;
    quoteEn: string;
    defaultLocale: Locale;
    defaultTheme: "dark" | "light";
    backgrounds: {
      entrance: string;
      growth: string;
      library: string;
      lab: string;
    };
  };
  items: PortfolioItem[];
};
