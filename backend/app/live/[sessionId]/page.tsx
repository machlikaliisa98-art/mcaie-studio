export default function TechnologiesPage() {
  const technologies = [
    {
      title: "Nexus AI Engine",
      description:
        "The intelligence core powering every Nexus platform through advanced reasoning, learning, and decision-making.",
    },
    {
      title: "Language Intelligence",
      description:
        "Large language models, multilingual understanding, translation, summarization, and conversational AI.",
    },
    {
      title: "Speech Intelligence",
      description:
        "Speech recognition, speaker identification, transcription, voice synthesis, and real-time communication.",
    },
    {
      title: "Vision Intelligence",
      description:
        "Image analysis, computer vision, object detection, document intelligence, and video understanding.",
    },
    {
      title: "Predictive Intelligence",
      description:
        "Machine learning models that forecast trends, identify risks, and support strategic decision-making.",
    },
    {
      title: "Cloud Infrastructure",
      description:
        "Secure, scalable AI infrastructure designed for enterprise-grade deployment across Africa and beyond.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-32">
        <p
          className="uppercase tracking-[0.4em] text-sm text-blue-400"
          style={{ fontFamily: "Arial" }}
        >
          TECHNOLOGIES
        </p>

        <h1
          className="mt-6 text-5xl md:text-7xl leading-tight"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          Engineering
          <br />
          Intelligence at Scale
        </h1>

        <p
          className="mt-10 max-w-4xl text-xl leading-10 text-gray-300"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          Nexus technologies combine artificial intelligence, advanced
          software engineering, cloud computing and scientific research
          to create intelligent systems that are reliable, secure and
          scalable for governments, enterprises and communities.
        </p>
      </section>

      {/* Technology Grid */}
      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-32 md:grid-cols-2 lg:grid-cols-3">
        {technologies.map((tech) => (
          <div
            key={tech.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500 hover:bg-white/10"
          >
            <div className="mb-6 h-1 w-20 rounded-full bg-blue-500"></div>

            <h2
              className="mb-5 text-3xl"
              style={{ fontFamily: "Times New Roman, serif" }}
            >
              {tech.title}
            </h2>

            <p className="leading-8 text-gray-300">
              {tech.description}
            </p>
          </div>
        ))}
      </section>

      {/* Closing Statement */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2
            className="text-4xl md:text-5xl"
            style={{ fontFamily: "Times New Roman, serif" }}
          >
            Technology Built for Tomorrow
          </h2>

          <p
            className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-gray-300"
            style={{ fontFamily: "Times New Roman, serif" }}
          >
            Every Nexus technology is developed with a long-term vision:
            creating intelligent systems that solve meaningful problems,
            strengthen digital infrastructure, and contribute to Africa's
            position in the global AI ecosystem.
          </p>
        </div>
      </section>
    </main>
  );
}