type SummaryCardProps = {
  title: string;
  value: number;
  description: string;
};

function SummaryCard({
  title,
  value,
  description,
}: SummaryCardProps) {
  return (
    <section className="border rounded-xl p-6 shadow-sm border-slate-200">
        <h2 className="text-slate-600 text-sm">{title}</h2>
        <p className="text-slate-900 text-3xl font-bold mt-2">{value}</p>
        <p className="text-slate-600 mt-2">{description}</p>
    </section>
  );
}



export default function LearnPage() {
  return (
    <main className="bg-white min-h-screen p-6">
        <div className="mx-auto max-w-5xl">
            <h1 className="mt-3 text-slate-900 text-2xl font-bold">Taskforge Summary</h1>
            <div className="grid md:grid-cols-3 mt-6 gap-3">
                <SummaryCard title="Workspaces" value={2} description="Teams you belong to" />
                <SummaryCard title="Projects" value={7} description="Projects across your workspaces" />
                <SummaryCard title="Open issues" value={14} description="Issues requiring attention" />
            </div>
        </div>
    </main>
  );
}