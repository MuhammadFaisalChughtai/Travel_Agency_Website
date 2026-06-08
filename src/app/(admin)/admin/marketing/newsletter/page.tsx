import { NewsletterComposerClient } from "@/components/admin/NewsletterComposerClient";

export default function NewsletterPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-slate-900">
          Compose Newsletter
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Write and send a personalized email to all your customers.
        </p>
      </div>
      
      <NewsletterComposerClient />
    </div>
  );
}
