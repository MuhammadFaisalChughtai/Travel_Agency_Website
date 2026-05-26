import { redirect } from "next/navigation";

// The /new page is retired — everything is handled on the main /admin/transport page.
export default function NewTransportPage() {
  redirect("/admin/transport");
}
