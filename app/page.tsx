import { PortfolioExperience } from "@/components/PortfolioExperience";
import { getContent } from "@/lib/content-store";

export default async function Home() {
  const content = await getContent();
  return <PortfolioExperience initialContent={content} />;
}
