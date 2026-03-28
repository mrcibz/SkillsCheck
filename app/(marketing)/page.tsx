import Link from "next/link";
import type { Metadata } from "next";
import ScrollReveal from "@/app/components/home/ScrollReveal";
import AnimatedCodeBlock from "@/app/components/home/AnimatedCodeBlock";
import HeroImageCarousel from "@/app/components/home/HeroImageCarousel";

export const metadata: Metadata = {
  title: "SkillsCheck — Practice Algorithms & Ace Your Interviews",
  description:
    "Master programming logic with SkillsCheck: a zero-friction, account-free platform for junior developers to practice algorithm challenges and prepare for technical interviews.",
};

export default function HomePage() {
  return (
    <div>
      {/* ── Section 1: Hero ── */}
      <section className="relative flex min-h-screen items-center overflow-hidden px-6">
        {/* Decorative gradient orbs */}
        <div className="pointer-events-none absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-[300px] w-[300px] rounded-full bg-blue-600/5 blur-[100px]" />

        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: text content */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl animate-fade-in-down animate-duration-700 animate-delay-300">
              Practice Algorithms.
              <br />
              <span className="text-blue-500 animate-pulse">Ace Your Interview.</span>
            </h1>
            <p className="mt-6 max-w-xl self-center text-lg leading-relaxed text-slate-400 sm:text-xl lg:self-start animate-fade-in animate-duration-700 animate-delay-500">
              The zero-friction platform where junior developers sharpen their
              problem-solving skills — no sign-up required.
            </p>
            <Link
              href="/playground"
              className="mt-8 inline-flex h-14 w-fit items-center self-center rounded-full bg-blue-500 px-10 text-base font-semibold text-white transition-all hover:bg-blue-600 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 lg:self-start animate-fade-in-up animate-duration-500 animate-delay-700"
            >
              Start Practicing →
            </Link>
          </div>

          {/* Right: image carousel */}
          <div className="flex items-center justify-center animate-blurred-fade-in animate-duration-1000 animate-delay-300">
            <HeroImageCarousel />
          </div>
        </div>
      </section>

      {/* ── Section 2: Who We Are ── */}
      <section className="relative flex min-h-screen items-center overflow-hidden px-6">
        <div className="pointer-events-none absolute -left-40 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px]" />

        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: text with staggered reveals */}
          <div className="flex flex-col justify-center">
            <ScrollReveal animation="animate-fade-in-left animate-duration-500">
              <span className="text-sm font-semibold uppercase tracking-widest text-blue-500">
                Who We Are
              </span>
            </ScrollReveal>
            <ScrollReveal animation="animate-fade-in-left animate-duration-700" delay={150}>
              <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Built by developers,
                <br />
                for developers.
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="animate-fade-in-left animate-duration-700" delay={300}>
              <p className="mt-6 text-base leading-relaxed text-slate-400 sm:text-lg">
                We&apos;re a small team who remember how tough it was to break into
                the industry. The endless LeetCode grind, the confusing platforms,
                the paywalls. We built SkillsCheck because we believe practicing
                should be as simple as opening a browser.
              </p>
            </ScrollReveal>
            <ScrollReveal animation="animate-fade-in-left animate-duration-700" delay={450}>
              <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">
                No accounts. No tracking. No distractions. Just you, a code
                editor, and a problem to solve.
              </p>
            </ScrollReveal>
          </div>

          {/* Right: animated code block */}
          <ScrollReveal animation="animate-zoom-in animate-duration-700" className="flex items-center justify-center">
            <AnimatedCodeBlock />
          </ScrollReveal>
        </div>
      </section>

      {/* ── Section 3: What We Do ── */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="mx-auto max-w-6xl text-center">
          <ScrollReveal animation="animate-fade-in animate-duration-500">
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              What We Do
            </span>
          </ScrollReveal>
          <ScrollReveal animation="animate-blurred-fade-in animate-duration-700" delay={100}>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Everything you need.
              <br />
              Nothing you don&apos;t.
            </h2>
          </ScrollReveal>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <ScrollReveal animation="animate-fade-in-up animate-duration-500" className="h-full">
              <div className="group h-full rounded-2xl border border-slate-800 bg-[#0e1d33] p-8 text-left transition-all hover:border-blue-500/40 hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
                  ⚡
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">
                  Zero Friction
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  No sign-up, no login, no setup. Pick a difficulty, get a
                  challenge, and start coding in seconds.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="animate-fade-in-up animate-duration-500" delay={200} className="h-full">
              <div className="group h-full rounded-2xl border border-slate-800 bg-[#0e1d33] p-8 text-left transition-all hover:border-blue-500/40 hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
                  🧪
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">
                  Real Execution
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Your code runs against real test cases on a secure backend. Get
                  instant feedback — Accepted, Wrong Answer, or Runtime Error.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="animate-fade-in-up animate-duration-500" delay={400} className="h-full">
              <div className="group h-full rounded-2xl border border-slate-800 bg-[#0e1d33] p-8 text-left transition-all hover:border-blue-500/40 hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
                  🎯
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">
                  Interview Ready
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Challenges modeled after real technical interviews. Practice
                  the patterns that actually come up — arrays, strings, trees,
                  graphs, and more.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Section 4: How It Works ── */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="mx-auto max-w-4xl text-center">
          <ScrollReveal animation="animate-fade-in animate-duration-500">
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-500">
              How It Works
            </span>
          </ScrollReveal>
          <ScrollReveal animation="animate-blurred-fade-in animate-duration-700" delay={100}>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Three steps. That&apos;s it.
            </h2>
          </ScrollReveal>

          <div className="mt-16 flex flex-col gap-12 text-left">
            <ScrollReveal animation="animate-fade-in-up animate-duration-500">
              <div className="flex items-start gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 text-xl font-bold text-blue-500">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Pick a difficulty
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-slate-400">
                    Choose from Easy, Medium, or Hard. A random challenge from
                    that pool is loaded instantly.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="animate-fade-in-up animate-duration-500" delay={200}>
              <div className="flex items-start gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 text-xl font-bold text-blue-500">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Write your solution
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-slate-400">
                    Code in a full-featured Monaco editor with syntax highlighting,
                    autocomplete, and multiple language support.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="animate-fade-in-up animate-duration-500" delay={400}>
              <div className="flex items-start gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-blue-500 text-xl font-bold text-blue-500">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Hit Run & get results
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-slate-400">
                    Your code is executed against test cases in real time. See
                    exactly what passed, what failed, and why.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Section 5: CTA ── */}
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="pointer-events-none absolute h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px]" />

        <ScrollReveal animation="animate-zoom-in animate-duration-700">
          <h2 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Ready to prove yourself?
          </h2>
        </ScrollReveal>
        <ScrollReveal animation="animate-fade-in animate-duration-500" delay={300}>
          <p className="mt-6 max-w-md text-lg text-slate-400">
            No account. No paywall. Just open it and start coding.
          </p>
        </ScrollReveal>
        <ScrollReveal animation="animate-pulse-fade-in animate-duration-700" delay={500}>
          <Link
            href="/playground"
            className="mt-10 inline-flex h-14 items-center rounded-full bg-blue-500 px-10 text-base font-semibold text-white transition-all hover:bg-blue-600 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Start Practicing →
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
