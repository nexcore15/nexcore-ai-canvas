import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section, pageMeta } from "@/components/site/page";

export const Route = createFileRoute("/terms")({
  head: () =>
    pageMeta({
      title: "Terms of Service — Pixflow AI",
      description:
        "The rules for using Pixflow AI: acceptable use, ownership of generated images, availability and liability.",
      path: "/terms",
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell title="Terms of Service" intro="Last updated: 4 August 2026">
      <Section title="1. Acceptance">
        <p>
          By using Pixflow AI you agree to these terms. If you do not agree, please do not use the
          service. Pixflow AI is operated by Nexcore.
        </p>
      </Section>
      <Section title="2. The service">
        <p>
          Pixflow AI turns text prompts into images using third-party AI models. The service is
          provided free of charge and may change, pause or end at any time.
        </p>
      </Section>
      <Section title="3. Acceptable use">
        <p>You agree not to use Pixflow AI to create or distribute content that:</p>
        <p>
          is illegal; sexualises minors; depicts real people without consent; infringes copyright or
          trademarks; harasses, defames or incites violence; spreads deliberate misinformation; or
          attempts to bypass safety filters or rate limits.
        </p>
      </Section>
      <Section title="4. Your content">
        <p>
          You are responsible for the prompts you write and the images you publish. Subject to these
          terms and applicable law, you may use images you generate, including commercially. Note
          that in some jurisdictions purely AI-generated works may not attract copyright.
        </p>
      </Section>
      <Section title="5. Availability">
        <p>
          We do not guarantee uptime, generation speed, or that any particular model remains
          available. Free capacity depends on upstream providers.
        </p>
      </Section>
      <Section title="6. Liability">
        <p>
          The service is provided "as is" without warranties of any kind. To the maximum extent
          permitted by law, Nexcore is not liable for indirect or consequential losses arising from
          your use of Pixflow AI.
        </p>
      </Section>
      <Section title="7. Termination">
        <p>
          We may restrict access if these terms are breached or if usage threatens the stability of
          the service.
        </p>
      </Section>
      <Section title="8. Contact">
        <p>Questions about these terms: hello@nexcore.app.</p>
      </Section>
    </PageShell>
  );
}