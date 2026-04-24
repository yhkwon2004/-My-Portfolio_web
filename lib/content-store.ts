import { Redis } from "@upstash/redis";
import { z } from "zod";
import { defaultContent } from "./default-content";
import type { PortfolioContent } from "./types";

const CONTENT_KEY = "portfolio:kwon-yonghyun:content:v1";

const imageSchema = z.object({
  url: z.string().min(1),
  altKo: z.string().default(""),
  altEn: z.string().default(""),
  role: z.enum(["cover", "gallery", "certificate", "evidence"]).optional()
});

const itemSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["profile", "award", "project", "education", "experience", "certification", "archive"]),
  titleKo: z.string().min(1),
  titleEn: z.string().min(1),
  summaryKo: z.string().default(""),
  summaryEn: z.string().default(""),
  year: z.string().optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  featuredRank: z.number().default(99),
  visible: z.boolean().default(true),
  images: z.array(imageSchema).default([]),
  links: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
  details: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional()
});

export const contentSchema = z.object({
  updatedAt: z.string(),
  settings: z.object({
    ownerKo: z.string(),
    ownerEn: z.string(),
    headlineKo: z.string(),
    headlineEn: z.string(),
    quoteKo: z.string(),
    quoteEn: z.string(),
    defaultLocale: z.enum(["ko", "en"]),
    defaultTheme: z.enum(["dark", "light"]),
    backgrounds: z.object({
      entrance: z.string(),
      growth: z.string(),
      library: z.string(),
      lab: z.string()
    })
  }),
  items: z.array(itemSchema)
});

type GlobalCache = typeof globalThis & {
  __portfolioContent?: PortfolioContent;
};

function redisClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

function mergeWithDefaults(content: PortfolioContent): PortfolioContent {
  const storedItems = new Map(content.items.map((item) => [item.id, item]));
  const defaultIds = new Set(defaultContent.items.map((item) => item.id));

  const items = [
    ...defaultContent.items.map((item) => storedItems.get(item.id) ?? item),
    ...content.items.filter((item) => !defaultIds.has(item.id))
  ];

  return contentSchema.parse({
    ...defaultContent,
    ...content,
    settings: {
      ...defaultContent.settings,
      ...content.settings,
      backgrounds: {
        ...defaultContent.settings.backgrounds,
        ...content.settings.backgrounds
      }
    },
    items
  });
}

export async function getContent(): Promise<PortfolioContent> {
  const redis = redisClient();

  if (redis) {
    const stored = await redis.get<PortfolioContent>(CONTENT_KEY);
    if (stored) {
      return mergeWithDefaults(stored);
    }
  }

  const cache = globalThis as GlobalCache;
  return cache.__portfolioContent ? mergeWithDefaults(cache.__portfolioContent) : defaultContent;
}

export async function saveContent(content: PortfolioContent): Promise<PortfolioContent> {
  const parsed = contentSchema.parse({ ...content, updatedAt: new Date().toISOString() });
  const redis = redisClient();

  if (redis) {
    await redis.set(CONTENT_KEY, parsed);
  } else {
    const cache = globalThis as GlobalCache;
    cache.__portfolioContent = parsed;
  }

  return parsed;
}
