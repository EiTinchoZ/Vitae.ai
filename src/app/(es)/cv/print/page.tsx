import type { Metadata } from "next";
import { Fragment } from "react";
import { preload } from "react-dom";
import { getCvData } from "@/data/cv-data";
import {
  resume,
  site,
  type ResumeEntry,
  type ResumeLine,
} from "@/data/cv-resume";
import "./cv-print.css";

// Fuente del PDF: scripts/cv-pdf.mjs abre /cv/print?lang=es|en y la imprime en A4. Una columna, texto real, sin
// íconos con información (ATS). El hueco data-phone queda vacío aquí; solo el PDF privado lo llena.

type Props = { searchParams: Promise<{ lang?: string }> };
const pick = (l?: string) => (l === "en" ? "en" : "es");

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const lang = pick((await searchParams).lang);
  return {
    title: lang === "en" ? "Martín Bundy - Resume" : "Martín Bundy - Hoja de vida",
    robots: { index: false, follow: false },
  };
}

function Entry({ e }: { e: ResumeEntry }) {
  return (
    <div className="ent">
      <div className="eh">
        <h3>
          {e.title}
          <span className="org">, {e.org}</span>
        </h3>
        <span className="dt">{e.date}</span>
      </div>
      {e.note && <p className="nt">{e.note}</p>}
      {e.bullets && (
        <ul>
          {e.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Lines({ items }: { items: ResumeLine[] }) {
  return (
    <ul>
      {items.map((x) => (
        <li key={x.label}>
          <b>{x.label}</b> {x.text}
        </li>
      ))}
    </ul>
  );
}

export default async function CvPrint({ searchParams }: Props) {
  preload("/fonts/archivo-var.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  const lang = pick((await searchParams).lang);
  const r = resume[lang];
  const p = getCvData(lang).personal;
  const strip = (u: string) => u.replace(/^https?:\/\//, "");

  return (
    <main className="cvp" lang={lang}>
      <header>
        <div className="id">
          <h1>{p.fullName}</h1>
          <p className="role">{r.role}</p>
          <p className="ct">
            <span>{lang === "en" ? "Panama" : p.location}</span>
            <a href={`mailto:${p.email}`}>{p.email}</a>
            <span data-phone hidden />
          </p>
          <p className="ct">
            <a href={p.linkedin}>{strip(p.linkedin)}</a>
            <a href={p.github}>{strip(p.github)}</a>
            <a href={`https://${site}`}>{site}</a>
          </p>
        </div>
        <a className="qr" href={`https://${site}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/qr-portafolio.svg" alt="" width="78" height="78" />
          <span>{r.qr}</span>
        </a>
      </header>

      <section>
        <h2>{r.heads.profile}</h2>
        <p>{r.profile}</p>
        <p className="core">
          {r.core.map((c, i) => (
            <Fragment key={c}>
              {i > 0 && " · "}
              <span>{c}</span>
            </Fragment>
          ))}
        </p>
      </section>
      <section className="wins">
        <h2>{r.heads.wins}</h2>
        <Lines items={r.wins} />
      </section>
      <section>
        <h2>{r.heads.work}</h2>
        {r.work.map((e) => (
          <Entry key={e.title} e={e} />
        ))}
      </section>
      <section>
        <h2>{r.heads.education}</h2>
        {r.education.map((e) => (
          <Entry key={e.title} e={e} />
        ))}
      </section>
      <section>
        <h2>{r.heads.projects}</h2>
        <Lines items={r.projects} />
      </section>
      <section>
        <h2>{r.heads.skills}</h2>
        <Lines items={r.skills} />
      </section>
      <section>
        <h2>{r.heads.certs}</h2>
        {r.certs.map((e) => (
          <Entry key={e.title} e={e} />
        ))}
      </section>
      <section>
        <h2>{r.heads.languages}</h2>
        <p>{r.languages}</p>
      </section>
    </main>
  );
}
