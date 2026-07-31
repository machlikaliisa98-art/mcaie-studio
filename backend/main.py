import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-6"
    >
      {/* Ambient Glow */}
      <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[180px]" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">

        {/* Logo */}
        <Image
          src="/images/logo-full.png"
          alt="Nexus Inc."
          width={720}
          height={180}
          priority
          className="mt-16 mb-14 w-full max-w-[620px]"
        />

        {/* Heading */}
        <h1
          className="max-w-5xl text-5xl font-normal leading-tight text-white md:text-7xl"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          Building the Next Generation of
          <span className="block mt-2 text-blue-400">
            Intelligent Systems
          </span>
        </h1>

        {/* Description */}
        <p
          className="mt-10 max-w-4xl text-xl leading-10 text-gray-300"
          style={{ fontFamily: "Times New Roman, serif" }}
        >
          Nexus Inc. is a Rwandan deep technology company advancing
          artificial intelligence through world-class research,
          enterprise software and intelligent infrastructure that
          empowers governments, businesses and society.
        </p>

        {/* Buttons */}
        <div className="mt-14 flex flex-wrap justify-center gap-6">
          <Link
            href="/research"
            className="rounded-full bg-blue-600 px-10 py-4 text-lg transition duration-300 hover:bg-blue-500"
          >
            Explore Research
          </Link>

          <Link
            href="/products"
            className="rounded-full border border-white/20 px-10 py-4 text-lg transition duration-300 hover:border-blue-400"
          >
            Explore Products
          </Link>
        </div>

      </div>
    </section>
  );
}