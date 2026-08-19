import TaskForgeLogo from "@/components/brand/taskforge-logo";
import AuthAwareActions from "@/components/landing/auth-aware-actions";
import TypingHeading from "@/components/landing/typing-heading";
import Link from "next/link";

const features = [
  { icon: "◇", title: "Organized team spaces", description: "Give every team a clear home for its people, plans, and day-to-day work." },
  { icon: "▦", title: "Projects with purpose", description: "Keep goals, responsibilities, and progress together from the first idea to completion." },
  { icon: "✓", title: "Work everyone can follow", description: "Assign tasks, choose what matters most, share updates, and always know what comes next." },
];

const workflow = [
  { number: "01", title: "Bring your team together", description: "Create a shared space and include everyone who helps the work move forward." },
  { number: "02", title: "Turn plans into projects", description: "Give each goal a clear place where people can understand the plan and their part in it." },
  { number: "03", title: "Make progress visible", description: "Assign tasks, share updates, solve problems together, and celebrate completed work." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2"><TaskForgeLogo /><span className="text-lg font-bold tracking-tight">TaskForge</span></Link>
          <div className="flex items-center gap-2"><Link href="#features" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 sm:block">Features</Link><AuthAwareActions variant="header" /></div>
        </nav>
      </header>

      <section className="relative overflow-hidden border-b border-slate-200 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.16),transparent_35%),radial-gradient(circle_at_10%_80%,rgba(139,92,246,0.12),transparent_30%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div><span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">A calmer way to work together</span><TypingHeading /><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">TaskForge gives your team one clear place to plan projects, organize tasks, share updates, and keep everyone moving in the same direction.</p><div className="mt-8"><AuthAwareActions variant="hero" /></div><div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-slate-500"><span>✓ Easy to understand</span><span>✓ Clear responsibilities</span><span>✓ Progress at a glance</span></div></div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-8 -z-10 rounded-full bg-indigo-200/50 blur-3xl" />
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-indigo-950/15">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div className="flex items-center gap-2"><TaskForgeLogo /><div><p className="text-sm font-bold">Spring campaign</p><p className="text-xs text-slate-400">12 teammates</p></div></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">On track</span></div>
              <div className="grid gap-4 p-5 sm:grid-cols-3"><div className="rounded-xl bg-indigo-50 p-4"><p className="text-xs font-medium text-indigo-600">To do</p><p className="mt-2 text-2xl font-bold">8</p></div><div className="rounded-xl bg-amber-50 p-4"><p className="text-xs font-medium text-amber-700">In progress</p><p className="mt-2 text-2xl font-bold">4</p></div><div className="rounded-xl bg-emerald-50 p-4"><p className="text-xs font-medium text-emerald-700">Done</p><p className="mt-2 text-2xl font-bold">19</p></div></div>
              <div className="space-y-3 px-5 pb-5">{["Approve the campaign message", "Prepare the client presentation", "Review the launch timeline"].map((title, index) => <div key={title} className="flex items-center justify-between rounded-xl border border-slate-200 p-4"><div className="flex items-center gap-3"><span className={`size-2.5 rounded-full ${index === 0 ? "bg-red-500" : index === 1 ? "bg-amber-500" : "bg-indigo-500"}`} /><div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs text-slate-400">Spring campaign</p></div></div><span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">{index === 0 ? "URGENT" : index === 1 ? "HIGH" : "MEDIUM"}</span></div>)}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-sm font-semibold text-indigo-600">Everything your team needs</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Less searching. More meaningful progress.</h2><p className="mt-4 leading-7 text-slate-600">Keep the work simple and visible, so your team can spend less time asking for updates and more time getting things done.</p></div><div className="mt-12 grid gap-6 md:grid-cols-3">{features.map((feature) => <article key={feature.title} className="group rounded-2xl border border-slate-200 bg-slate-50 p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10"><span className="flex size-11 items-center justify-center rounded-xl bg-indigo-100 text-xl font-bold text-indigo-700 transition group-hover:scale-110">{feature.icon}</span><h3 className="mt-5 text-lg font-bold">{feature.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p></article>)}</div></div></section>

      <section className="border-y border-slate-200 px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl"><div className="text-center"><p className="text-sm font-semibold text-indigo-600">From idea to achievement</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">A simple rhythm everyone can follow</h2></div><div className="mt-12 grid gap-6 lg:grid-cols-3">{workflow.map((step) => <article key={step.number} className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><span className="text-4xl font-black text-indigo-100">{step.number}</span><h3 className="mt-4 text-lg font-bold">{step.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p></article>)}</div></div></section>

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8"><div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2"><div><p className="text-sm font-semibold text-indigo-300">Confidence without complexity</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">The right people see the right work.</h2><p className="mt-4 max-w-xl leading-7 text-slate-300">Choose who can manage a team, guide projects, or contribute to tasks. TaskForge keeps responsibilities clear while protecting your team’s shared work.</p></div><div className="grid gap-4 sm:grid-cols-2">{["Clear team responsibilities", "Private and protected accounts", "Reliable access to your work", "Comfortable on any screen"].map((item) => <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-medium text-slate-200"><span className="mr-2 text-indigo-300">✓</span>{item}</div>)}</div></div></section>

      <section className="px-4 py-20 sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 px-6 py-14 text-center text-white shadow-2xl shadow-indigo-500/20 sm:px-12"><div className="mx-auto w-fit rounded-2xl bg-white/10 p-3"><TaskForgeLogo /></div><h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Help your team feel clear, connected, and ready.</h2><p className="mx-auto mt-4 max-w-2xl text-indigo-100">Bring your plans and people together, then turn every shared goal into progress everyone can see.</p><div className="mt-8"><AuthAwareActions variant="cta" /></div></div></section>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6"><div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><TaskForgeLogo /><span className="font-semibold text-slate-700">TaskForge</span></div><p>Teamwork that feels clear and achievable.</p><AuthAwareActions variant="header" /></div></footer>
    </main>
  );
}
