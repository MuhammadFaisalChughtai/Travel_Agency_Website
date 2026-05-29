import UniversalViewPage, { generateMetadata as viewGenerateMetadata } from "../../v/[slug]/page";
import { blogPostsData } from "@/lib/blogData";

export async function generateStaticParams() {
  return blogPostsData.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return viewGenerateMetadata({ params: { slug: params.slug } });
}

export default function BlogSlugPage({ params }: { params: { slug: string } }) {
  return <UniversalViewPage params={{ slug: params.slug }} />;
}
