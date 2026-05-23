import UniversalViewPage, { generateMetadata as viewGenerateMetadata } from "../../view/[type]/[id]/page";

export async function generateMetadata({ params }: { params: { id: string } }) {
  return viewGenerateMetadata({ params: { type: "package", id: params.id } });
}

export default function PackageDetailPage({ params }: { params: { id: string } }) {
  return <UniversalViewPage params={{ type: "package", id: params.id }} />;
}
