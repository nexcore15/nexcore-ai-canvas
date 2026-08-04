import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section, pageMeta } from "@/components/site/page";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageMeta({
      title: "Privacy Policy — Pixflow AI",
      description:
        "How Pixflow AI collects, uses and protects your data, including prompts, generated images, cookies and your GDPR rights.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell title="Privacy Policy" intro="Last updated: 4 August 2026">
      <Section title="Who we are">
        <p>
          Pixflow AI ("we", "us") is operated by Nexcore. This policy explains what data we handle
          when you use pixflow, and the rights you have over it. Contact us at hello@nexcore.app.
        </p>
      </Section>
      <Section title="Data we collect">
        <p>
          <strong className="text-foreground">Prompts:</strong> the text you submit is sent to our
          server and forwarded to an image provider to create your picture. We do not sell prompts
          or use them to train our own models.
        </p>
        <p>
          <strong className="text-foreground">Generated images:</strong> stored in your own browser
          (local storage) on your device. We do not keep a copy tied to your identity.
        </p>
        <p>
          <strong className="text-foreground">Technical data:</strong> standard server logs such as
          IP address, browser type and timestamps, used for security and abuse prevention.
        </p>
        <p>
          <strong className="text-foreground">Analytics:</strong> aggregated, non-identifying usage
          statistics if analytics are enabled.
        </p>
      </Section>
      <Section title="Legal bases (GDPR)">
        <p>
          We process data to perform the service you requested (Article 6(1)(b)), and for our
          legitimate interest in keeping the service secure and improving it (Article 6(1)(f)).
          Where consent is required, such as for non-essential cookies, we ask for it.
        </p>
      </Section>
      <Section title="Third parties">
        <p>
          Prompts are transmitted to the AI provider that renders your image, and our site is served
          through a hosting provider. These processors act on our instructions and are bound by
          their own privacy terms.
        </p>
      </Section>
      <Section title="Retention">
        <p>
          Server logs are kept for a short period for security purposes and then deleted. Images and
          history stored in your browser remain until you clear them.
        </p>
      </Section>
      <Section title="Your rights">
        <p>
          You may request access, correction, deletion, restriction, portability, or object to
          processing. Email hello@nexcore.app and we will respond within 30 days. You also have the
          right to complain to your local data protection authority.
        </p>
      </Section>
      <Section title="Children">
        <p>
          Pixflow AI is not directed at children under 13 (or the minimum age of digital consent in
          your country). We do not knowingly collect their data.
        </p>
      </Section>
      <Section title="Changes">
        <p>
          We may update this policy. Material changes will be highlighted on this page with a new
          "last updated" date.
        </p>
      </Section>
    </PageShell>
  );
}