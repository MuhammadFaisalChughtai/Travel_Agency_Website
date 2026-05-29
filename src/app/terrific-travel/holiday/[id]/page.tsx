import UniversalViewPage, { generateMetadata as viewGenerateMetadata } from "../../v/[slug]/page";

export async function generateMetadata({ params }: { params: { id: string } }) {
  return viewGenerateMetadata({ params: { slug: params.id } });
}

export default function PackageDetailPage({ params }: { params: { id: string } }) {
  return <UniversalViewPage params={{ slug: params.id }} />;
}
