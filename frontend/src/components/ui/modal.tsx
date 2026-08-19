"use client";

import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ open, title, description, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" aria-label="Close dialog" onClick={onClose} className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm" />
      <section role="dialog" aria-modal="true" aria-labelledby="modal-title" className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-slate-950">{title}</h2>
            {description && <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>}
          </div>
          <button type="button" aria-label="Close dialog" onClick={onClose} className="flex size-9 items-center justify-center rounded-lg text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-900">×</button>
        </div>
        <div className="mt-6">{children}</div>
      </section>
    </div>
  );
}
