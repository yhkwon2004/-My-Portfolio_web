import { defaultContent } from "./default-content";
import { notionProjectAdditions, notionProjectOverrides } from "./notion-project-seed";
import type { PortfolioContent, PortfolioItem } from "./types";

function mergeItem(base: PortfolioItem, override: PortfolioItem): PortfolioItem {
  return {
    ...base,
    ...override,
    tags: override.tags.length ? override.tags : base.tags,
    images: override.images.length ? override.images : base.images,
    links: override.links ?? base.links,
    details: override.details ?? base.details
  };
}

const overrideMap = new Map(notionProjectOverrides.map((item) => [item.id, item]));
const existingIds = new Set(defaultContent.items.map((item) => item.id));

const mergedItems = defaultContent.items.map((item) => {
  const override = overrideMap.get(item.id);
  return override ? mergeItem(item, override) : item;
});

export const seedContent: PortfolioContent = {
  ...defaultContent,
  items: [
    ...mergedItems,
    ...notionProjectAdditions.filter((item) => !existingIds.has(item.id))
  ]
};
