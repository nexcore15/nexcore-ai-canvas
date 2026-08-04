import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { pageMeta } from "@/components/site/page";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageMeta({
      title: "Contact Pixflow AI — Support & Feedback",
      description:
        "Questions, bug reports, partnership ideas or takedown requests? Contact the Nexcore team behind Pixflow AI.",
      path: "/contact",
    }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  message: z.string().trim().min(10, "Tell us a little more (10+ characters)").max(2000),
});

function ContactPage() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = schema.safeParse(values);
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    // Messages open in the user's mail client until accounts and cloud storage land.
    const subject = encodeURIComponent(`Pixflow AI enquiry from ${result.data.name}`);
    const body = encodeURIComponent(`${result.data.message}\n\nReply to: ${result.data.email}`);
    window.location.href = `mailto:hello@nexcore.app?subject=${subject}&body=${body}`;
    setSent(true);
    toast.success("Opening your email app to send the message");
  };

  const field =
    "mt-1 w-full rounded-xl border border-border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-primary";

  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Contact us</h1>
        <p className="mt-3 text-muted-foreground">
          We read everything. Expect a reply within two working days.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="card-soft p-5">
          <Mail className="size-5 text-primary" aria-hidden="true" />
          <h2 className="mt-2 font-semibold">Email</h2>
          <p className="mt-1 text-sm text-muted-foreground">hello@nexcore.app</p>
        </div>
        <div className="card-soft p-5">
          <MessageSquare className="size-5 text-primary" aria-hidden="true" />
          <h2 className="mt-2 font-semibold">Support hours</h2>
          <p className="mt-1 text-sm text-muted-foreground">Monday to Friday, 9am – 6pm IST</p>
        </div>
      </div>

      <form onSubmit={submit} noValidate className="card-soft mt-6 space-y-4 p-6">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Your name
          </label>
          <input
            id="name"
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            aria-invalid={Boolean(errors["name"])}
            className={field}
          />
          {errors["name"] ? <p className="mt-1 text-xs text-destructive">{errors["name"]}</p> : null}
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
            aria-invalid={Boolean(errors["email"])}
            className={field}
          />
          {errors["email"] ? (
            <p className="mt-1 text-xs text-destructive">{errors["email"]}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            value={values.message}
            onChange={(e) => setValues({ ...values, message: e.target.value })}
            aria-invalid={Boolean(errors["message"])}
            className={`${field} resize-none`}
          />
          {errors["message"] ? (
            <p className="mt-1 text-xs text-destructive">{errors["message"]}</p>
          ) : null}
        </div>
        <button
          type="submit"
          className="lift rounded-xl bg-[image:var(--gradient-brand)] px-6 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Send message
        </button>
        {sent ? (
          <p className="text-sm text-muted-foreground">
            If your email app did not open, write to hello@nexcore.app directly.
          </p>
        ) : null}
      </form>
    </main>
  );
}