import { createFileRoute } from "@tanstack/react-router";

import { PageShell, Section, pageMeta } from "@/components/site/page";

export const Route = createFileRoute("/about")({
  head: () =>
    pageMeta({
      title: "About Pixflow AI — Free AI Image Generation by Nexcore",
      description:
        "Why Nexcore built Pixflow AI: a genuinely free, genuinely simple AI image generator that anyone can use without a tutorial.",
      path: "/about",
    }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell
      title="About Pixflow AI"
      intro="A free AI image generator built by Nexcore, for people who just want a good picture."
    >
      <Section title="Our story">
        <p>
          Pixflow AI started with a small frustration. Every image generator we tried asked for an
          account, a card, or a tour of twelve sliders before it would draw anything. We wanted the
          opposite: a box, a button, and a picture.
        </p>
        <p>
          So the team at Nexcore built one. A ten-year-old can use it. So can a seventy-year-old.
          You type what you imagine, you press Generate, and a few seconds later it is on your
          screen.
        </p>
      </Section>
      <Section title="Our mission">
        <p>
          Creative tools should not be gated behind subscriptions. Pixflow AI stays free to use,
          adds no watermark, and never sells your images. If we introduce paid options later, the
          free tier stays useful — that is a promise we designed the product around.
        </p>
      </Section>
      <Section title="The team">
        <p>
          We are a compact product studio: designers, engineers and one very opinionated writer.
          Nexcore builds fast, accessible AI products and ships small improvements constantly rather
          than big rewrites occasionally.
        </p>
      </Section>
      <Section title="How it works">
        <p>
          Your prompt is sent to our own backend, which talks to the image engines on your behalf.
          Provider credentials live only on the server and are never exposed in the browser. Your
          generated images are stored locally in your browser so they stay under your control.
        </p>
      </Section>
    </PageShell>
  );
}