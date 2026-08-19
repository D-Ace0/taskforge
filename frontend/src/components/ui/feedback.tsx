import Button from "@/components/ui/button";

export function LoadingBlock({ label = "Loading..." }: { label?: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500 shadow-sm"><span className="mx-auto mb-3 block size-7 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />{label}</div>;
}

export function ErrorBlock({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6"><p className="font-semibold text-red-800">Something went wrong</p><p className="mt-1 text-sm text-red-700">{message}</p>{onRetry && <Button variant="secondary" className="mt-4" onClick={onRetry}>Try again</Button>}</div>;
}

export function EmptyBlock({ title, description }: { title: string; description: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">◇</div><h3 className="mt-4 font-semibold text-slate-950">{title}</h3><p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{description}</p></div>;
}
