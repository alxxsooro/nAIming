import { useId, useState } from "react";
import { Link } from "react-router-dom";

const STEPS = [
  {
    n: 1,
    title: "Describe what you’re building",
    body: "Share your product, audience, and tone in a short brief—no brand deck required.",
  },
  {
    n: 2,
    title: "Get names that fit",
    body: "We generate options aligned with your positioning so you can stress-test with users or cofounders.",
  },
  {
    n: 3,
    title: "Shortlist & ship",
    body: "Pick favorites, share the list, and soon: domains, handles, and deeper brand signals in one place.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Finally stopped using “ProjectX” in slides. The shortlist actually sounded like a real company.",
    name: "Morgan L.",
  },
  {
    quote:
      "I wanted something memorable before I bought the domain. This got me unstuck in one evening.",
    name: "Casey T.",
  },
  {
    quote:
      "Naming used to eat a whole weekend. Now I iterate on ideas instead of staring at a blank doc.",
    name: "Riley J.",
  },
  {
    quote:
      "The positioning-aware suggestions felt surprisingly on-brand for our indie SaaS.",
    name: "Alex K.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Is Naming free to try?",
    a: "You can create an account and explore the tool. Pricing may evolve as we add domain and social checks—check back for updates.",
  },
  {
    q: "Do you register domains or social handles for me?",
    a: "Not automatically. We’ll surface availability and links where possible; you complete registration with your providers.",
  },
  {
    q: "How do you generate name ideas?",
    a: "We use your brief—product, audience, tone—to propose options that fit your story. You stay in control of the final choice.",
  },
  {
    q: "Can I use the names commercially?",
    a: "Suggestions are starting points. Always run your own trademark and domain checks before you commit to a brand.",
  },
];

function TestimonialCard({ quote, name }: { quote: string; name: string }) {
  return (
    <article className="landing-marquee__card">
      <p className="landing-marquee__quote">&ldquo;{quote}&rdquo;</p>
      <p className="landing-marquee__author">{name}</p>
    </article>
  );
}

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const faqHeadingId = useId();

  return (
    <div className="page page--landing">
      <section className="hero hero--saas" aria-labelledby="hero-title">
        <div className="hero__inner hero__inner--center">
          <h1 id="hero-title" className="hero__title hero__title--saas">
            Naming and branding for your{" "}
            <span className="hero__launch-lockup">
              <svg
                className="hero__rocket"
                viewBox="0 0 40 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M20 3l8 14h-16l8-14z"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 17h16v14a2 2 0 01-2 2H14a2 2 0 01-2-2V17z"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinejoin="round"
                />
                <circle cx="20" cy="24" r="2.25" stroke="currentColor" strokeWidth="1.1" />
                <path
                  d="M12 31H8l-4 10M28 31h4l4 10"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M17 33l-2 8M23 33l2 8"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity="0.45"
                />
              </svg>
              <span className="hero__title-accent">next launch</span>
            </span>
            —in seconds.
          </h1>
          <p className="hero__lead">
            Describe what you&apos;re building. Get a shortlist that fits your positioning—and
            the confidence to share it. Domains, handles, and deeper brand signals are on the
            way.
          </p>
          <div className="hero__actions hero__actions--saas">
            <Link to="/signup" className="btn btn--primary">
              Get started <span aria-hidden>→</span>
            </Link>
            <Link to="/login" className="btn btn--secondary">
              Log in <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="hero__preview" aria-hidden>
          <div className="hero__preview-chrome">
            <span className="hero__preview-dot" />
            <span className="hero__preview-dot" />
            <span className="hero__preview-dot" />
          </div>
          <div className="hero__preview-body">
            <div className="hero__preview-sidebar" />
            <div className="hero__preview-main">
              <div className="hero__preview-bar" />
              <div className="hero__preview-rows">
                <div className="hero__preview-row" />
                <div className="hero__preview-row hero__preview-row--short" />
                <div className="hero__preview-row" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section" id="how-it-works" aria-labelledby="how-heading">
        <div className="landing-section__inner">
          <h2 id="how-heading" className="landing-section__title">
            How it works
          </h2>
          <p className="landing-section__lead">
            Three simple steps—from brief to shortlist. Paste your story, get aligned names, and
            move toward launch.
          </p>
          <ol className="landing-steps">
            {STEPS.map((step) => (
              <li key={step.n} className="landing-step-card">
                <span className="landing-step-card__num" aria-hidden>
                  {step.n}
                </span>
                <h3 className="landing-step-card__title">{step.title}</h3>
                <p className="landing-step-card__body">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="landing-section landing-section--tight"
        id="testimonials"
        aria-labelledby="testimonials-heading"
      >
        <div className="landing-section__inner">
          <h2 id="testimonials-heading" className="landing-section__title">
            What people say
          </h2>
          <p className="landing-section__lead">Early feedback from founders trying Naming.</p>
          <div className="landing-marquee" role="region" aria-label="Testimonials">
            <div className="landing-marquee__track">
              <div className="landing-marquee__group">
                {TESTIMONIALS.map((t) => (
                  <TestimonialCard key={t.name + t.quote.slice(0, 12)} quote={t.quote} name={t.name} />
                ))}
              </div>
              <div className="landing-marquee__group" aria-hidden>
                {TESTIMONIALS.map((t, i) => (
                  <TestimonialCard key={`dup-${i}`} quote={t.quote} name={t.name} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section" id="faq" aria-labelledby={faqHeadingId}>
        <div className="landing-section__inner landing-section__inner--narrow">
          <h2 id={faqHeadingId} className="landing-section__title">
            Frequently asked questions
          </h2>
          <p className="landing-section__lead">Quick answers to common questions.</p>
          <div className="landing-faq">
            {FAQ_ITEMS.map((item, i) => {
              const open = openFaq === i;
              return (
                <div key={item.q} className="landing-faq__item">
                  <button
                    type="button"
                    className="landing-faq__trigger"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className="landing-faq__chevron" aria-hidden>
                      {open ? "↑" : "↓"}
                    </span>
                  </button>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    className="landing-faq__panel"
                    hidden={!open}
                  >
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
