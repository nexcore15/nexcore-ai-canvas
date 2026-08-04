import { createFileRoute } from "@tanstack/react-router";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  ["Is Pixflow AI really free?", "Yes. Image generation is free, with no card required and no watermark on your images."],
  ["Do I need an account?", "No. You can generate images immediately. Accounts, cloud history and favourites sync are coming next."],
  ["How many images can I create?", "There is no hard daily cap today. We only apply light protection against automated abuse."],
  ["Can I use the images commercially?", "Generally yes, subject to our Terms of Service and the law where you live. Avoid prompts naming brands, trademarks or living people."],
  ["Who owns the images I generate?", "You are free to use what you create. Machine-generated output may not be copyrightable in some countries."],
  ["Why did my image look wrong?", "AI models are probabilistic. Regenerate, add detail to the prompt, and use a negative prompt to remove artefacts."],
  ["What is a negative prompt?", "A list of things you do not want in the picture, such as 'blurry, watermark, extra fingers'."],
  ["What does the Enhance button do?", "It rewrites your short idea into a detailed, professional prompt using an AI language model."],
  ["Which aspect ratio should I choose?", "1:1 for profiles, 16:9 for wallpapers and thumbnails, 9:16 for phones, 3:4 for portraits of people."],
  ["What image formats can I download?", "PNG for quality, JPG for smaller files, and WebP for the web."],
  ["Where are my images stored?", "In your own browser on this device. Clearing browser data removes them, so download anything you want to keep."],
  ["Can I generate images of real people?", "Please do not create images of identifiable people without consent. It is prohibited by our Terms."],
  ["Is there an age limit?", "Pixflow AI is intended for users aged 13 and over, or the minimum digital consent age in your country."],
  ["Do you allow adult or violent content?", "No. Our providers filter unsafe content, and such prompts violate our Terms of Service."],
  ["Why is generation sometimes slow?", "Free engines get busy. Try the Turbo model, or retry in a few seconds."],
  ["Do you use my prompts to train models?", "No. We do not sell prompts or use them to train our own models."],
  ["Can I use Pixflow AI on mobile?", "Yes. The interface is mobile-first with large, thumb-friendly controls."],
  ["Do you support API access?", "Not yet. Contact us if you have a use case and we will keep you posted."],
  ["How do I report a problem or a misuse?", "Use the contact page. Include a link or description and we will act quickly."],
  ["Who is behind Pixflow AI?", "Nexcore, a small product studio building fast and friendly AI tools."],
] as const;

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Pixflow AI Free Image Generator" },
      {
        name: "description",
        content:
          "Answers to 20 common questions about Pixflow AI: pricing, image ownership, commercial use, formats, aspect ratios and privacy.",
      },
      { property: "og:title", content: "FAQ — Pixflow AI" },
      {
        property: "og:description",
        content: "Everything you might ask about using Pixflow AI's free image generator.",
      },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(([question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-3 text-muted-foreground">
          Everything about using Pixflow AI, in plain language.
        </p>
      </header>
      <Accordion type="single" collapsible className="mt-8">
        {faqs.map(([question, answer]) => (
          <AccordionItem key={question} value={question}>
            <AccordionTrigger className="text-left">{question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}