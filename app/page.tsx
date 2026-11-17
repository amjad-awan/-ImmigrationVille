"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  AnimatePresence,
  animate,
  MotionConfig,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Building2, Check, DraftingCompass,
  HardHat, Menu, MessageCircle, ShieldCheck, Users, Wrench, X,
} from "lucide-react";

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const photos = {
  hero: u("1504307651254-35680f356dfd", 1600),
  construction: u("1504307651254-35680f356dfd"),
  engineering: u("1581092921461-eab62e97a780"),
  trades: u("1621905251918-48416bd8575a"),
  industrial: u("1581092160562-40aa08e78837"),
  candidate: u("1504257432389-52343af06ae3", 1200),
  employer: u("1531834685032-c34bf0d84c77", 1200),
  cta: u("1541888946425-d81bb19240f5", 1800),
};

const sectors = [
  { title: "Construction & Infrastructure", text: "Building the places and systems communities depend on.", roles: ["Project Managers", "Site Supervisors", "General Foremen", "Construction Labourers"], image: photos.construction, icon: Building2 },
  { title: "Engineering & Architecture", text: "Technical expertise shaping what comes next.", roles: ["Civil Engineers", "Structural Engineers", "Architects", "Surveying Technicians"], image: photos.engineering, icon: DraftingCompass },
  { title: "Skilled Trades", text: "Hands-on specialists keeping projects moving.", roles: ["Electricians", "Plumbers", "Welders", "Carpenters"], image: photos.trades, icon: Wrench },
  { title: "Industrial & Technical", text: "Practical skills for essential operations.", roles: ["Equipment Operators", "Equipment Mechanics", "HVAC Technicians", "Quality Inspectors"], image: photos.industrial, icon: HardHat },
];
const steps = [
  ["01", "Submit your application", "Share your professional background, skills and relevant experience."],
  ["02", "Candidate assessment", "Applications are reviewed against relevant qualifications and potential employer requirements."],
  ["03", "Employer matching", "Suitable candidates may be considered for relevant opportunities, based on availability and employer needs."],
  ["04", "Recruitment coordination", "Further communication and documentation coordination take place where applicable."],
];
const benefits = [
  ["International recruitment focus", "A dedicated focus on connecting international candidates with Canadian employment opportunities."],
  ["Industry-specific opportunities", "Recruitment categories shaped around construction, skilled trades and related sectors."],
  ["Candidate communication", "Clear communication to help candidates understand application steps and relevant requirements."],
  ["Employer coordination", "A point of contact for employers exploring their workforce needs and potential talent matches."],
];
const opportunities = [
  ["Construction Project Coordinator", "Construction & Infrastructure", "Support planning, coordination and delivery across active construction projects."],
  ["Civil Engineer", "Engineering & Architecture", "Apply technical expertise to the planning and development of infrastructure."],
  ["Heavy Equipment Operator", "Industrial & Technical", "Operate and maintain equipment in construction and industrial environments."],
  ["Electrician", "Skilled Trades", "Bring electrical installation and maintenance skills to project teams."],
  ["Welder", "Skilled Trades", "Contribute fabrication and welding expertise across a range of projects."],
  ["HVAC Technician", "Industrial & Technical", "Support the installation and maintenance of heating and cooling systems."],
];

const ease = [0.22, 1, 0.36, 1] as const;

/* Scroll reveal: used for headings and grids only, with stagger via `i`. */
function Reveal({ children, i = 0, className }: { children: ReactNode; i?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease, delay: i * 0.09 }}
    >
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <div className="label"><span />{children}</div>;
}

function Brand({ footer }: { footer?: boolean }) {
  return (
    <a className={footer ? "brand brand-footer" : "brand"} href="#home" aria-label="Immigration Ville home">
      <span className="brand-mark">IV<span>.</span></span>
      <span className="brand-copy"><strong>Immigration Ville</strong><small>International recruitment, Canada</small></span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));
  const links = [["Home", "#home"], ["About", "#about"], ["Opportunities", "#opportunities"], ["For employers", "#employers"], ["Contact", "#contact"]];
  return (
    <motion.header
      className={scrolled ? "site-header is-scrolled" : "site-header"}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease }}
    >
      <div className="nav-wrap">
        <Brand />
        <button className="menu-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
        <nav className="main-nav" aria-label="Main navigation">
          {links.map(([l, h]) => <a key={l} href={h}>{l}</a>)}
          <a className="nav-cta" href="#opportunities">Explore opportunities <ArrowUpRight size={15} /></a>
        </nav>
      </div>
      <motion.div className="progress" style={{ scaleX: scrollYProgress }} />
      <AnimatePresence>
        {open && (
          <motion.nav className="mobile-nav" aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease }}>
            {[...links, ["Explore opportunities", "#opportunities"]].map(([l, h], i) => (
              <motion.a key={l} href={h} onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i, duration: 0.4, ease }}>
                {l}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

const rotating = ["opportunities", "careers", "projects", "futures"];
const marquee = ["Electricians", "Civil Engineers", "Welders", "Project Managers", "Equipment Operators", "Architects", "HVAC Technicians", "Site Supervisors", "Plumbers", "Quality Inspectors", "Carpenters", "Surveying Technicians"];

function Counter({ to, delay = 1.8 }: { to: number; delay?: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(0, to, { duration: 2, delay, ease, onUpdate: (l) => setV(Math.round(l)) });
    return () => c.stop();
  }, [to, delay]);
  return <>{v}</>;
}

/* Cinematic entrance: full-bleed image with slow zoom, cursor spotlight + parallax,
   masked headline with a cycling word, glass stat cards and a roles marquee. */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const bgX = useTransform(sx, (v) => v * -28);
  const cardX = useTransform(sx, (v) => v * 22);
  const cardY = useTransform(sy, (v) => v * 22);
  const px = useTransform(sx, (v) => (v + 0.5) * 100);
  const py = useTransform(sy, (v) => (v + 0.5) * 100);
  const spot = useMotionTemplate`radial-gradient(520px circle at ${px}% ${py}%, rgba(255,255,255,.09), transparent 62%)`;
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setW((i) => (i + 1) % rotating.length), 2600);
    return () => clearInterval(t);
  }, []);
  const line = (d: number) => ({ initial: { y: "110%" }, animate: { y: 0 }, transition: { duration: 1.1, ease, delay: 0.5 + d } });
  const rise = (d: number) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease, delay: d } });
  return (
    <section
      className="hero"
      id="home"
      ref={ref}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <motion.div className="hero-bg" style={{ y: bgY, x: bgX }}>
        <motion.img src={photos.hero} alt="Construction professional working on a building site" initial={{ scale: 1.35, opacity: 0 }} animate={{ scale: 1.12, opacity: 1 }} transition={{ duration: 2.6, ease }} />
      </motion.div>
      <div className="hero-shade" />
      <motion.div className="hero-spot" style={{ background: spot }} />
      <motion.div className="hero-wipe" initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ duration: 1.2, ease, delay: 0.1 }} />

      <motion.div className="hero-inner" style={{ opacity: fade }}>
        <div className="hero-copy">
          <motion.div {...rise(0.4)}><Label>International recruitment in Canada</Label></motion.div>
          <h1>
            <span className="mask"><motion.span {...line(0)}>Connecting global talent</motion.span></span>
            <span className="mask">
              <motion.span {...line(0.14)}>
                with{" "}
                <span className="rotor">
                  <AnimatePresence mode="wait">
                    <motion.em key={rotating[w]} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={{ duration: 0.55, ease }}>
                      {rotating[w]}
                    </motion.em>
                  </AnimatePresence>
                </span>
              </motion.span>
            </span>
            <span className="mask"><motion.span {...line(0.28)}>in Canada.</motion.span></span>
          </h1>
          <motion.p className="hero-intro" {...rise(1.3)}>
            We connect qualified international professionals and skilled workers with employment opportunities through structured recruitment and employer coordination.
          </motion.p>
          <motion.div className="hero-actions" {...rise(1.45)}>
            <motion.a className="button button-red" href="#opportunities" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Explore opportunities <ArrowRight size={17} /></motion.a>
            <a className="button button-outline" href="#employers">Partner with us <ArrowUpRight size={16} /></a>
          </motion.div>
        </div>

        <motion.div className="hero-stats" style={{ x: cardX, y: cardY }}>
          <motion.div className="glass stat" {...rise(1.7)}>
            <strong><Counter to={4} /></strong><span>Core sectors<small>Construction, engineering, trades, industrial</small></span>
          </motion.div>
          <motion.div className="glass stat" {...rise(1.85)}>
            <strong><Counter to={16} delay={1.95} /></strong><span>Role categories<small>From site supervisors to HVAC technicians</small></span>
          </motion.div>
          <motion.div className="glass note" {...rise(2)}>
            <div className="floating-icon"><Users size={20} /></div>
            <div><strong>Building connections</strong><p>Employers and skilled international talent, coordinated.</p></div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div className="marquee" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 1 }} aria-hidden="true">
        <motion.div className="marquee-track" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, ease: "linear", repeat: Infinity }}>
          {[...marquee, ...marquee].map((m, i) => <span key={i}>{m}</span>)}
        </motion.div>
      </motion.div>
    </section>
  );
}

function ValueStrip() {
  const items = [
    { icon: Users, title: "International recruitment", text: "A global outlook on talent" },
    { icon: HardHat, title: "Skilled workforce", text: "Focused on essential sectors" },
    { icon: Building2, title: "Employer coordination", text: "Connecting teams and talent" },
    { icon: MessageCircle, title: "Candidate support", text: "Guidance through the process" },
  ];
  return (
    <section className="value-strip" id="about">
      <Reveal className="value-intro">
        <Label>Our focus</Label>
        <h2>Supporting Canada&apos;s workforce needs.</h2>
        <p>Connecting qualified international talent with potential employment opportunities across Canada&apos;s construction and skilled trades sectors.</p>
      </Reveal>
      <div className="value-grid">
        {items.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} i={i}>
            <article className="value-item"><Icon size={22} strokeWidth={1.5} /><h3>{title}</h3><p>{text}</p></article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Sectors() {
  return (
    <section className="section-pad" id="sectors">
      <Reveal className="section-heading">
        <div><Label>Where we work</Label><h2>Opportunities across <em>essential industries.</em></h2></div>
        <p>Explore professional and skilled trade categories where Canadian employers may require qualified talent.</p>
      </Reveal>
      <div className="sector-grid">
        {sectors.map(({ title, text, roles, image, icon: Icon }, i) => (
          <Reveal key={title} i={i % 2}>
            <motion.article className="sector-card" whileHover="hover" initial="rest">
              <a href="#opportunities" className="sector-photo">
                <motion.img src={image} alt={`${title} professional work`} loading="lazy" variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }} transition={{ duration: 0.8, ease }} />
                <div className="sector-overlay" />
                <motion.span className="sector-arrow" variants={{ rest: { x: -8, y: 8, opacity: 0 }, hover: { x: 0, y: 0, opacity: 1 } }}>
                  <ArrowUpRight size={19} />
                </motion.span>
              </a>
              <div className="sector-content">
                <div className="sector-title"><Icon size={19} /><h3>{title}</h3></div>
                <p>{text}</p>
                <div className="role-list">{roles.map((r) => <span key={r}>{r}</span>)}</div>
                <a className="text-link" href="#opportunities">Explore sector <ArrowRight size={15} /></a>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Audiences() {
  const cards = [
    { cls: "candidate-card", img: photos.candidate, alt: "Construction professional at work", label: "For international candidates", h: <>Your skills. <em>New opportunities.</em></>, p: "Explore potential employment opportunities in Canada and learn about the recruitment process, qualifications and application requirements.", href: "#opportunities", cta: "Explore candidate opportunities" },
    { cls: "employer-card", img: photos.employer, alt: "Construction team coordinating on site", label: "For Canadian employers", h: <>Find the talent your projects <em>need.</em></>, p: "Connect with an international recruitment team to discuss workforce requirements and potential talent-matching opportunities.", href: "#contact", cta: "Discuss your hiring needs" },
  ];
  return (
    <section className="audiences" id="employers">
      {cards.map((c, i) => (
        <Reveal key={c.cls} i={i}>
          <article className={`audience-card ${c.cls}`}>
            <div className="audience-photo"><img src={c.img} alt={c.alt} loading="lazy" /></div>
            <div className="audience-content">
              <Label>{c.label}</Label>
              <h2>{c.h}</h2>
              <p>{c.p}</p>
              <a href={c.href} className="button button-light">{c.cta} <ArrowRight size={16} /></a>
            </div>
          </article>
        </Reveal>
      ))}
    </section>
  );
}

function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  return (
    <section className="process section-pad">
      <Reveal className="section-heading">
        <div><Label>How it works</Label><h2>A clearer path to <em>employment opportunities.</em></h2></div>
        <p>Understand the general recruitment journey from initial application to employer coordination.</p>
      </Reveal>
      <div className="process-grid" ref={ref}>
        <div className="process-track"><motion.div className="process-fill" style={{ scaleX: scrollYProgress }} /></div>
        {steps.map(([n, t, p], i) => (
          <Reveal key={n} i={i}>
            <article className="process-step"><span className="step-no">{n}</span><h3>{t}</h3><p>{p}</p></article>
          </Reveal>
        ))}
      </div>
      <Reveal className="process-foot"><ShieldCheck size={17} /> Every opportunity and process is subject to applicable requirements and employer needs.</Reveal>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="why section-pad">
      <Reveal className="why-heading">
        <Label>The Immigration Ville approach</Label>
        <h2>Professional recruitment. <em>Meaningful connections.</em></h2>
        <p>Thoughtful coordination between qualified candidates and employers is where a great opportunity begins.</p>
      </Reveal>
      <div className="benefit-grid">
        {benefits.map(([t, p], i) => (
          <Reveal key={t} i={i}><article className="benefit"><h3>{t}</h3><p>{p}</p></article></Reveal>
        ))}
      </div>
    </section>
  );
}

function Opportunities() {
  return (
    <section className="section-pad" id="opportunities">
      <Reveal className="section-heading">
        <div><Label>Career possibilities</Label><h2>Explore what&apos;s <em>possible in Canada.</em></h2></div>
        <p>Discover illustrative career categories across industries. Contact our team to discuss your background and current opportunities.</p>
      </Reveal>
      <div className="jobs-grid">
        {opportunities.map(([title, industry, text], i) => (
          <Reveal key={title} i={i % 3}>
            <motion.article className="job-card" whileHover={{ y: -4 }} transition={{ duration: 0.3, ease }}>
              <span className="job-category">{industry}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <a href="#contact" aria-label={`Ask about ${title}`} className="text-link">Ask about this role <ArrowRight size={15} /></a>
            </motion.article>
          </Reveal>
        ))}
      </div>
      <p className="opportunity-note">* Illustrative employment categories only. Actual vacancies depend on current employer requirements and availability.</p>
    </section>
  );
}

function Callout() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  return (
    <section className="callout" ref={ref}>
      <motion.img src={photos.cta} alt="Construction site at golden hour" loading="lazy" style={{ y }} />
      <div className="callout-overlay" />
      <Reveal className="callout-content">
        <Label>Your next chapter starts here</Label>
        <h2>Let&apos;s build the next <em>opportunity together.</em></h2>
        <p>Whether you&apos;re exploring employment opportunities or seeking skilled talent for your organization, start a conversation with our team.</p>
        <div className="hero-actions">
          <a className="button button-red" href="#opportunities">Explore opportunities <ArrowRight size={17} /></a>
          <a className="button button-glass" href="#contact">Contact our team <ArrowUpRight size={16} /></a>
        </div>
      </Reveal>
    </section>
  );
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }
  return (
    <section className="contact section-pad" id="contact">
      <Reveal className="contact-info">
        <Label>Get in touch</Label>
        <h2>Let&apos;s start <em>a conversation.</em></h2>
        <p>Tell us what you&apos;re looking for. Our team welcomes inquiries from international candidates and Canadian employers.</p>
        <div className="contact-types">
          <div><span className="contact-type-icon"><Users size={18} /></span><span><strong>Candidate inquiries</strong><small>Share your experience and career interests.</small></span></div>
          <div><span className="contact-type-icon"><Building2 size={18} /></span><span><strong>Employer inquiries</strong><small>Discuss your organization&apos;s hiring needs.</small></span></div>
        </div>
        <a className="email-link" href="mailto:immigrationvilleltd1@outlook.com">immigrationvilleltd1@outlook.com <ArrowUpRight size={16} /></a>
      </Reveal>
      <Reveal i={1}>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-heading"><h3>Send an inquiry</h3><span>Fields marked * are required</span></div>
          <div className="form-row">
            <label>Full name *<input name="name" autoComplete="name" required placeholder="Your name" /></label>
            <label>Email address *<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
          </div>
          <div className="form-row">
            <label>I am a *
              <select name="inquiryType" required defaultValue="">
                <option value="" disabled>Select one</option><option>Candidate</option><option>Employer</option><option>Other</option>
              </select>
            </label>
            <label>Subject *<input name="subject" required placeholder="How can we help?" /></label>
          </div>
          <label>Message *<textarea name="message" rows={4} required minLength={10} placeholder="Tell us a little about your inquiry..." /></label>
          <div className="form-submit">
            <motion.button className="button button-red" type="submit" whileTap={{ scale: 0.97 }}>Send inquiry <ArrowRight size={16} /></motion.button>
            <span>Demo form: your message is not sent.</span>
          </div>
          <AnimatePresence>
            {submitted && (
              <motion.p className="form-confirm" role="status" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0 }}>
                <Check size={17} /> Thanks for your interest. This demo form does not send messages, so please email us directly.
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Brand footer />
          <p>Connecting international talent with potential employment opportunities in Canada.</p>
        </div>
        <div className="footer-col"><h3>Explore</h3><a href="#about">About us</a><a href="#sectors">Recruitment sectors</a><a href="#opportunities">Opportunities</a><a href="#process">Our process</a></div>
        <div className="footer-col"><h3>Information</h3><a href="#opportunities">For candidates</a><a href="#employers">For employers</a><a href="#contact">Contact</a></div>
        <div className="footer-col"><h3>Contact</h3><a href="mailto:immigrationvilleltd1@outlook.com">immigrationvilleltd1@outlook.com</a><span>Mr. Afshin Sadeghi-Ghasemabad<br />Authorized Representative</span></div>
      </div>
      <div className="footer-disclaimer">
        <ShieldCheck size={17} />
        <p>Employment opportunities are subject to employer requirements, candidate qualifications, availability and applicable Canadian laws and regulations. No employment, work permit or immigration outcome is guaranteed. Recruitment services are distinct from regulated immigration advice.</p>
      </div>
      <div className="footer-bottom"><span>© 2026 Immigration Ville Ltd. All rights reserved.</span><a href="#home">Back to top</a></div>
    </footer>
  );
}

export default function Page() {
  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main>
        <Hero />
        <ValueStrip />
        <Sectors />
        <Audiences />
        <div id="process"><Process /></div>
        <WhyUs />
        <Opportunities />
        <Callout />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}