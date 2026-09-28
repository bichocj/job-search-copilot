"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type FitAnalysis = {
  extractedStack: string[];
  matchedSkills: string[];
  gaps: string[];
  locationFlag: string | null;
  summary: string;
} | null;

type ApplicationItem = {
  id: string;
  company: string;
  role: string;
  url: string;
  status: string;
  notes: string | null;
  fitAnalysis: FitAnalysis;
};

const STATUSES = ["saved", "applied", "interview", "offer", "rejected", "withdrawn"];

export default function Page() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ company: "", role: "", url: "" });
  const [saving, setSaving] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  async function loadApplications() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/applications`);
      setApplications(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company || !form.role || !form.url) return;
    setSaving(true);
    try {
      await fetch(`${API_URL}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ company: "", role: "", url: "" });
      await loadApplications();
    } finally {
      setSaving(false);
    }
  }

  async function handleAnalyze(id: string) {
    setAnalyzingId(id);
    try {
      await fetch(`${API_URL}/agent/applications/${id}/analyze`, { method: "POST" });
      await loadApplications();
    } finally {
      setAnalyzingId(null);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch(`${API_URL}/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await loadApplications();
  }

  async function handleDelete(id: string) {
    await fetch(`${API_URL}/applications/${id}`, { method: "DELETE" });
    await loadApplications();
  }

  return (
    <div className="shell">
      <div className="header">
        <h1>Job Search Copilot</h1>
        <p>Track applications and get an honest AI fit-check against your real profile.</p>
      </div>

      <div className="panel">
        <h2>Add a job posting</h2>
        <form onSubmit={handleAdd}>
          <div className="form-row">
            <input
              placeholder="Company (e.g. Neginet)"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            <input
              placeholder="Role (e.g. Senior Backend Engineer)"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
          </div>
          <div className="form-row">
            <input
              placeholder="Job posting URL"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
            <button className="primary" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <p className="empty">Loading…</p>
      ) : applications.length === 0 ? (
        <p className="empty">No applications tracked yet — add your first one above.</p>
      ) : (
        applications.map((app) => (
          <div className="app-card" key={app.id}>
            <div className="app-card-top">
              <div>
                <h3>{app.role}</h3>
                <div className="company">{app.company}</div>
              </div>
              <span className={`badge ${app.status}`}>{app.status}</span>
            </div>

            <div className="app-actions">
              <a href={app.url} target="_blank" rel="noreferrer">
                <button className="ghost" type="button">
                  View posting
                </button>
              </a>
              <button
                className="ghost"
                type="button"
                onClick={() => handleAnalyze(app.id)}
                disabled={analyzingId === app.id}
              >
                {analyzingId === app.id
                  ? "Analyzing…"
                  : app.fitAnalysis
                    ? "Re-analyze fit"
                    : "Analyze fit"}
              </button>
              <select value={app.status} onChange={(e) => handleStatusChange(app.id, e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button className="ghost" type="button" onClick={() => handleDelete(app.id)}>
                Delete
              </button>
            </div>

            {app.fitAnalysis && (
              <div className="analysis">
                <div className="row">
                  <span className="label">Summary: </span>
                  {app.fitAnalysis.summary}
                </div>
                {app.fitAnalysis.locationFlag && (
                  <div className="row">
                    <span className="label">⚠ Location: </span>
                    {app.fitAnalysis.locationFlag}
                  </div>
                )}
                <div className="row">
                  <span className="label">Matched: </span>
                  {app.fitAnalysis.matchedSkills.map((s) => (
                    <span className="tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
                {app.fitAnalysis.gaps.length > 0 && (
                  <div className="row">
                    <span className="label">Gaps: </span>
                    {app.fitAnalysis.gaps.map((s) => (
                      <span className="tag gap" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
