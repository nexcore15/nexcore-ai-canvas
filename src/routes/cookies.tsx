import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section, pageMeta } from "@/components/site/page";

export const Route = createFileRoute("/cookies")({
  head: () =>
    pageMeta({
      title: "Cookie Policy — Pixflow AI",
      description:
        "Which cookies and local storage Pixflow AI uses, what they do, and how to control them in your browser.",
      path: "/cookies",
    }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <PageShell title="Cookie Policy" intro="Last updated: 4 August 2026">
      <Section title="What we use">
        <p>
          Pixflow AI keeps things light. We use browser local storage rather than tracking cookies
          for the core experience.
        </p>
      </Section>
      <Section title="Essential storage">
        <p>
          <strong className="text-foreground">pixflow.gallery.v1</strong> — stores the images you
          generate so your gallery survives a refresh.
        </p>
        <p>
          <strong className="text-foreground">pixflow.theme</strong> — remembers whether you chose
          light or dark mode.
        </p>
      </Section>
      <Section title="Analytics">
        <p>
          If analytics are enabled, a provider such as Google Analytics may set cookies to measure
          aggregate, non-identifying usage. These are not required for the tool to work.
        </p>
      </Section>
      <Section title="Advertising">
        <p>
          Should we introduce advertising, ad partners may set cookies to limit repetition and
          measure performance. We will update this page before that happens.
        </p>
      </Section>
      <Section title="Managing cookies">
        <p>
          You can clear or block cookies and site data in your browser settings at any time.
          Clearing site data also deletes your saved gallery, so download anything you want to keep.
        </p>
      </Section>
    </PageShell>
  );
}