"use client";

import React from 'react';

interface LegalLayoutProps {
  title: string;
  updatedAt?: string;
  updatedLabel?: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, updatedAt, updatedLabel, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <section className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
          {updatedAt && (
            <p className="mt-3 text-purple-200">{updatedLabel ?? 'Terakhir diperbarui'}: {updatedAt}</p>
          )}
        </div>
      </section>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white shadow-lg rounded-xl border border-purple-100">
          <div className="px-6 sm:px-8 py-8 prose prose-purple max-w-none prose-headings:text-black prose-p:text-black prose-li:text-black prose-strong:text-black">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}