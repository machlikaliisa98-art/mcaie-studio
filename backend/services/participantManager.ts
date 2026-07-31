import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export interface Publication {
  title: string;
  publication: string;
  date: string;
  link: string;
  summary: string;
}

interface PublicationsProps {
  articles: Publication[];
}

export default function Publications({
  articles,
}: PublicationsProps) {
  return (
    <section className="mt-24">
      <h2 className="text-4xl font-bold">
        Publications & Thought Leadership
      </h2>

      <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-400">
        Selected publications and opinion pieces exploring artificial
        intelligence, digital infrastructure, economic transformation and
        Africa's technological future.
      </p>

      <div className="mt-12 space-y-6">
        {articles.map((article) => (
          <article
            key={article.title}
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 transition hover:border-cyan-500"
          >
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-widest text-cyan-400">
                  {article.publication}
                </p>

                <h3 className="mt-3 text-2xl font-bold">
                  {article.title}
                </h3>

                <p className="mt-4 leading-8 text-zinc-400">
                  {article.summary}
                </p>

                <p className="mt-6 text-sm text-zinc-500">
                  {article.date}
                </p>
              </div>

              <Link
                href={article.link}
                target="_blank"
                className="rounded-xl border border-cyan-500 p-4 transition hover:bg-cyan-500 hover:text-black"
              >
                <ArrowUpRight />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}