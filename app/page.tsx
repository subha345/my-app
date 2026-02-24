"use client";

import Image from "next/image";
import {
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

const SECTION_IDS = ["about", "skills", "experience", "education", "projects", "contact"];

const NAV_LINKS = SECTION_IDS.map((id) => ({
  href: `#${id}`,
  label: id.charAt(0).toUpperCase() + id.slice(1),
}));

const SKILLS = [
  {
    category: "Frontend",
    items: [
      "React.js",
      "React Native",
      "HTML5",
      "CSS3",
      "JavaScript (ES6+)",
      "TypeScript",
      "Redux",
      "Redux-Saga",
      "Next.js",
      "Tailwind CSS",
    ],
  },
  {
    category: "Backend",
    items: [
      "Node.js",
      "Express.js",
      "Python",
      "FastAPI",
      "REST APIs",
      "GraphQL",
    ],
  },
  {
    category: "Real-time & Integration",
    items: ["WebSocket", "Webhooks", "Socket.IO", "Server-Sent Events"],
  },
  {
    category: "Tools & Practices",
    items: [
      "Git",
      "CI/CD",
      "Jest",
      "React Testing Library",
      "Agile/Scrum",
      "Code Review",
    ],
  },
];

const EXPERIENCE = [
  {
    role: "Senior Application Developer",
    company: "IQVIA, Bangalore",
    period: "Jul 2023 — Present",
    note: "Contractor via Hexaware from Nov 2020 – Jul 2023",
    description:
      "Leading frontend architecture and development for enterprise-scale healthcare and life-sciences applications. Driving best practices, mentoring developers, and owning end-to-end delivery.",
    highlights: [
      "Architected and built complex SPAs with React, Redux, and Redux-Saga",
      "Implemented real-time features using WebSocket and Webhooks",
      "Improved application performance through code splitting and optimization",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "Hexaware Technologies, Bangalore",
    period: "Nov 2020 — Jul 2023",
    note: "Client: IQVIA",
    description:
      "Developed and maintained multiple React and React Native applications for IQVIA, collaborating closely with cross-functional teams.",
    highlights: [
      "Built cross-platform mobile apps with React Native",
      "Developed RESTful APIs using Node.js/Express and Python/FastAPI",
      "Established testing standards with Jest and React Testing Library",
    ],
  },
  {
    role: "Associate Sr. Software Engineer",
    company: "Mahindra First Choice Wheels, Bangalore",
    period: "Jul 2018 — Nov 2020",
    description:
      "Built and scaled customer-facing web applications for India's largest multi-brand certified used car company.",
    highlights: [
      "Developed responsive web apps with React and Redux state management",
      "Integrated third-party APIs and payment gateways",
      "Collaborated with UX team to improve user experience and accessibility",
    ],
  },
  {
    role: "Software Engineer",
    company: "Health5c Wellness Solutions, Bangalore",
    period: "Mar 2017 — Jun 2018",
    description:
      "Built healthcare and wellness platform features, working across the full stack with modern JavaScript.",
    highlights: [
      "Developed interactive UI components with React",
      "Implemented responsive designs with CSS3 and modern layout techniques",
      "Worked on Node.js backend services and API integrations",
    ],
  },
  {
    role: "Project Trainee",
    company: "Altair Engineering, Bangalore",
    period: "Mar 2016 — Mar 2017",
    description:
      "Started professional career building internal tools and contributing to engineering projects.",
    highlights: [
      "Built internal web tools with HTML, CSS, and JavaScript",
      "Gained foundational experience in software development lifecycle",
    ],
  },
];

const EDUCATION = [
  {
    degree: "Master of Computer Applications (MCA)",
    institution: "Indira Gandhi Institute of Technology, Sarang, Odisha",
    period: "Jul 2013 — May 2016",
  },
  {
    degree: "B.Sc — Mathematics & Computing",
    institution: "Institute of Mathematics & Application, Bhubaneswar, Odisha",
    period: "Jul 2009 — May 2013",
  },
  {
    degree: "+2 Science",
    institution: "Maharishi College of Natural Law, Bhubaneswar, Odisha",
    period: "Jul 2007 — May 2009",
  },
  {
    degree: "Matriculation",
    institution: "Saraswati Vidya Mandir, Bhubaneswar, Odisha",
    period: "May 2007",
  },
];

const PROJECTS = [
  {
    title: "Project Name 1",
    description:
      "Brief description of the project, technologies used, and your role. Explain the problem it solved and the impact it had.",
    tags: ["React", "Redux", "Node.js", "WebSocket"],
    link: "#",
  },
  {
    title: "Project Name 2",
    description:
      "Brief description of the project, technologies used, and your role. Explain the problem it solved and the impact it had.",
    tags: ["React Native", "Redux-Saga", "FastAPI"],
    link: "#",
  },
  {
    title: "Project Name 3",
    description:
      "Brief description of the project, technologies used, and your role. Explain the problem it solved and the impact it had.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    link: "#",
  },
  {
    title: "Project Name 4",
    description:
      "Brief description of the project, technologies used, and your role. Explain the problem it solved and the impact it had.",
    tags: ["React", "Express.js", "Webhooks"],
    link: "#",
  },
];

/* ────────────────────────────────────────────────────────
   Hooks
   ──────────────────────────────────────────────────────── */

function useScrollSpy() {
  const [activeSection, setActiveSection] = useState("");
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  const update = useCallback(() => {
    setScrolledPastHero(window.scrollY > 400);

    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const triggerPoint = scrollY + viewportHeight * 0.35;

    if (scrollY + viewportHeight >= docHeight - 40) {
      setActiveSection(SECTION_IDS[SECTION_IDS.length - 1]);
      return;
    }

    let current = "";
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= triggerPoint) {
        current = id;
      }
    }
    if (current) setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [update]);

  return { activeSection, scrolledPastHero };
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function useCounter(end: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    let startTs: number | null = null;
    let raf: number;

    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, active]);

  return count;
}

/* ────────────────────────────────────────────────────────
   Animation wrappers
   ──────────────────────────────────────────────────────── */

function Reveal({
  children,
  animation = "reveal-up",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  animation?: string;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView(0.12);

  return (
    <div
      ref={ref}
      className={`${inView ? animation : "reveal-hidden"} ${className}`}
      style={inView ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Components
   ──────────────────────────────────────────────────────── */

function Navbar({
  activeSection,
  showAvatar,
}: {
  activeSection: string;
  showAvatar: boolean;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinksWithApps = [
    { href: "/apps", label: "Apps", isApps: true },
    ...NAV_LINKS.map((l) => ({ ...l, isApps: false })),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-foreground"
        >
          SS<span className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          <li>
            <a
              href="/apps"
              className="relative rounded-full px-4 py-2.5 text-sm font-medium text-accent transition-all duration-300 hover:bg-accent/10 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            >
              <span className="relative">Apps</span>
            </a>
          </li>
          {NAV_LINKS.map((link) => {
            const sectionId = link.href.slice(1);
            const isActive = activeSection === sectionId;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`relative rounded-full px-4 py-2.5 text-sm transition-all duration-300 min-h-[44px] inline-flex items-center ${
                    isActive
                      ? "text-accent"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-accent/10" />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={`hidden overflow-hidden transition-all duration-500 ease-out md:block ${
              showAvatar
                ? "w-9 scale-100 opacity-100"
                : "w-0 scale-50 opacity-0"
            }`}
          >
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-accent/50 shadow-md shadow-accent/10">
              <Image
                src="/photos/subha.jpeg"
                alt="Subhadatta Samal"
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
          </div>
          <a
            href="#contact"
            className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-accent-light hover:shadow-lg hover:shadow-accent/25 min-h-[44px] md:inline-flex md:items-center"
          >
            Get in Touch
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-border bg-background/95 backdrop-blur-xl px-4 py-4">
          <ul className="flex flex-col gap-1">
            {navLinksWithApps.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium min-h-[44px] flex items-center ${
                    item.isApps
                      ? "text-accent"
                      : activeSection === item.href.slice(1)
                        ? "bg-accent/10 text-accent"
                        : "text-foreground hover:bg-surface"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg bg-accent px-4 py-3 text-sm font-medium text-white min-h-[44px] flex items-center justify-center mt-2"
              >
                Get in Touch
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <div className="animate-pulse-glow pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col-reverse items-center gap-12 md:flex-row md:items-center md:gap-16">
          <div className="max-w-xl flex-1">
            <p className="animate-fade-in-up mb-4 font-mono text-sm tracking-wider text-accent">
              Hello, I&apos;m
            </p>
            <h1 className="animate-fade-in-up delay-100 mb-6 text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
              Subhadatta{" "}
              <span className="animate-gradient bg-gradient-to-r from-accent via-purple-400 to-accent bg-clip-text text-transparent">
                Samal
              </span>
            </h1>
            <div className="animate-fade-in-up delay-200 mb-5">
              <p className="mb-3 text-xl text-muted md:text-2xl">
                Senior Full Stack Developer
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { main: "React", sub: "Redux-Saga" },
                  { main: "Node.js", sub: "Express" },
                  { main: "Python", sub: "FastAPI" },
                ].map((tech, i) => (
                  <span key={tech.main}>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3.5 py-1 text-sm shadow-sm shadow-accent/5">
                      <span className="font-medium tracking-wide text-accent">
                        {tech.main}
                      </span>
                      <span className="text-muted/60">·</span>
                      <span className="text-xs text-accent/70">
                        {tech.sub}
                      </span>
                    </span>
                    {i < 2 && (
                      <span className="ml-2 text-sm text-muted/50">/</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <p className="animate-fade-in-up delay-300 mb-10 max-w-xl text-base leading-relaxed text-muted">
              10+ years crafting high-performance web and mobile applications
              with React, React Native, Node.js, and Python. Passionate about
              clean architecture, real-time systems, and exceptional user
              experiences.
            </p>
            <div className="animate-fade-in-up delay-400 flex flex-wrap gap-4">
              <a
                href="/apps"
                className="rounded-full border-2 border-accent bg-accent/20 px-8 py-3 text-sm font-semibold text-accent transition-all duration-200 hover:bg-accent hover:text-white hover:shadow-lg hover:shadow-accent/25"
              >
                Explore Mini Apps
              </a>
              <a
                href="#projects"
                className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-accent-light hover:shadow-lg hover:shadow-accent/25"
              >
                View My Work
              </a>
              <a
                href="#about"
                className="rounded-full border border-border px-8 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:border-accent hover:text-accent"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="animate-fade-in delay-200 relative shrink-0">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-accent/30 via-purple-500/20 to-transparent blur-2xl" />
            <div className="animate-float relative h-56 w-56 overflow-hidden rounded-full border-2 border-accent/30 shadow-2xl shadow-accent/10 md:h-72 md:w-72 lg:h-80 lg:w-80">
              <Image
                src="/photos/subha.jpeg"
                alt="Subhadatta Samal"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  value,
  suffix,
  label,
  active,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
  delay: number;
}) {
  const count = useCounter(value, 1800, active);

  return (
    <Reveal animation="reveal-scale" delay={delay}>
      <div className="card-lift flex flex-col items-center justify-center rounded-2xl border border-border bg-surface p-6 text-center hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
        <span className="mb-1 text-3xl font-bold text-accent">
          {count}
          {suffix}
        </span>
        <span className="text-sm text-muted">{label}</span>
      </div>
    </Reveal>
  );
}

function AboutSection() {
  const { ref, inView } = useInView(0.2);

  return (
    <section id="about" className="py-28" ref={ref}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading label="About" title="Who I Am" />
        </Reveal>
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-5 leading-relaxed text-muted">
            <Reveal animation="reveal-left" delay={0.1}>
              <p>
                I&apos;m a Senior React Developer with over a decade of hands-on
                experience building scalable, performant web and mobile
                applications. My journey began with vanilla JavaScript and
                HTML/CSS, and I&apos;ve evolved through the entire modern
                frontend ecosystem.
              </p>
            </Reveal>
            <Reveal animation="reveal-left" delay={0.2}>
              <p>
                I specialize in React.js and React Native, with deep expertise
                in state management using Redux and Redux-Saga. On the backend, I
                work with Node.js/Express and Python/FastAPI to build robust APIs
                and services.
              </p>
            </Reveal>
            <Reveal animation="reveal-left" delay={0.3}>
              <p>
                I&apos;m passionate about real-time communication — having built
                production systems with WebSocket and Webhooks — and I thrive in
                environments where code quality, performance, and user experience
                are paramount.
              </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StatCard value={10} suffix="+" label="Years Experience" active={inView} delay={0.1} />
            <StatCard value={50} suffix="+" label="Projects Delivered" active={inView} delay={0.2} />
            <StatCard value={15} suffix="+" label="Technologies" active={inView} delay={0.3} />
            <StatCard value={100} suffix="%" label="Commitment" active={inView} delay={0.4} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className="border-t border-border py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading label="Skills" title="Technical Expertise" />
        </Reveal>
        <div className="grid gap-8 md:grid-cols-2">
          {SKILLS.map((group, gi) => (
            <Reveal key={group.category} animation="reveal-up" delay={gi * 0.12}>
              <div className="card-lift rounded-2xl border border-border bg-surface p-8 hover:border-accent/40">
                <h3 className="mb-5 text-lg font-semibold text-foreground">
                  {group.category}
                </h3>
                <SkillPills items={group.items} groupDelay={gi * 0.12} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillPills({ items, groupDelay }: { items: string[]; groupDelay: number }) {
  const { ref, inView } = useInView(0.1);

  return (
    <div ref={ref} className="flex flex-wrap gap-2">
      {items.map((skill, i) => (
        <span
          key={skill}
          className={`rounded-full border border-border bg-surface-light px-4 py-1.5 text-sm text-muted transition-colors duration-200 hover:border-accent/50 hover:text-accent ${
            inView ? "pill-pop" : "opacity-0"
          }`}
          style={inView ? { animationDelay: `${groupDelay + i * 0.05}s` } : undefined}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function ExperienceSection() {
  return (
    <section id="experience" className="border-t border-border py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading label="Experience" title="Career Journey" />
        </Reveal>
        <div className="relative space-y-12 pl-8 before:absolute before:left-0 before:top-2 before:h-full before:w-px before:bg-gradient-to-b before:from-accent before:to-transparent md:pl-12">
          {EXPERIENCE.map((exp, idx) => (
            <Reveal
              key={idx}
              animation="reveal-left"
              delay={idx * 0.15}
            >
              <div className="relative">
                <div className="timeline-dot absolute -left-8 top-2 h-3 w-3 rounded-full border-2 border-accent bg-background md:-left-12" />
                <div className="card-lift rounded-2xl border border-border bg-surface p-8 hover:border-accent/40">
                  <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {exp.role}
                      </h3>
                      <p className="text-accent">{exp.company}</p>
                      {"note" in exp && exp.note && (
                        <p className="mt-1 text-xs italic text-muted/70">
                          {exp.note}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 font-mono text-sm text-muted">
                      {exp.period}
                    </span>
                  </div>
                  <p className="mb-4 text-muted">{exp.description}</p>
                  <ul className="space-y-2">
                    {exp.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-muted"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function EducationSection() {
  return (
    <section id="education" className="border-t border-border py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading label="Education" title="Academic Background" />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {EDUCATION.map((edu, idx) => (
            <Reveal key={idx} animation="reveal-up" delay={idx * 0.1}>
              <div className="card-lift flex h-full flex-col rounded-2xl border border-border bg-surface p-7 hover:border-accent/40">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {edu.degree}
                  </h3>
                  <span className="shrink-0 rounded-full bg-accent/10 px-3 py-0.5 font-mono text-xs text-accent">
                    {edu.period}
                  </span>
                </div>
                <p className="mt-auto flex items-center gap-2 text-sm text-muted">
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-accent/60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {edu.institution}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="border-t border-border py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading label="Projects" title="Selected Work" />
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {PROJECTS.map((project, idx) => (
            <Reveal
              key={idx}
              animation="reveal-scale"
              delay={idx * 0.1}
            >
              <div className="group card-lift relative overflow-hidden rounded-2xl border border-border bg-surface p-8 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/5 transition-transform duration-500 group-hover:scale-150" />
                <div className="relative">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-foreground transition-colors duration-200 group-hover:text-accent">
                      {project.title}
                    </h3>
                    <svg
                      className="h-5 w-5 text-muted transition-all duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 17L17 7M17 7H7M17 7v10"
                      />
                    </svg>
                  </div>
                  <p className="mb-5 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="border-t border-border py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <Reveal>
          <SectionHeading
            label="Contact"
            title="Let's Work Together"
            centered
          />
        </Reveal>
        <Reveal animation="reveal-up" delay={0.1}>
          <p className="mx-auto mb-10 max-w-lg text-muted">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of your team. Feel free to reach out.
          </p>
        </Reveal>
        <Reveal animation="reveal-up" delay={0.2}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:your.email@example.com"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-accent-light hover:shadow-lg hover:shadow-accent/25"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Send an Email
            </a>
            <a
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:border-accent hover:text-accent"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:border-accent hover:text-accent"
            >
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <Reveal animation="reveal-fade">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Subhadatta Samal. Built with
            Next.js &amp; Tailwind CSS.
          </p>
        </Reveal>
      </div>
    </footer>
  );
}

function SectionHeading({
  label,
  title,
  centered = false,
}: {
  label: string;
  title: string;
  centered?: boolean;
}) {
  return (
    <div className={`mb-14 ${centered ? "text-center" : ""}`}>
      <p className="mb-2 font-mono text-sm tracking-wider text-accent">
        {label}
      </p>
      <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      <div
        className={`heading-line mt-3 h-px w-16 bg-accent/60 ${centered ? "mx-auto" : ""}`}
      />
    </div>
  );
}

export default function Home() {
  const { activeSection, scrolledPastHero } = useScrollSpy();

  return (
    <>
      <Navbar activeSection={activeSection} showAvatar={scrolledPastHero} />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </>
  );
}
