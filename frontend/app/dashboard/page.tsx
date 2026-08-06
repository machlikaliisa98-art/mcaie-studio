"use client";

import Link from "next/link";
import DashboardLayout from "../../components/DashboardLayout";

const brandCards = [
  {
    title: "Kyamagero Daily",
    subtitle: "Conversations that challenge, inspire and transform.",
    href: "/shows/kyamagero-daily",
    color: "#153848",
    accent: "#B48A45",
  },
];

const quickActions = [
  {
    title: "Open Studio",
    href: "/studio",
  },
  {
    title: "Library",
    href: "/library",
  },
  {
    title: "Explore",
    href: "/landing",
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>

<div
style={{
maxWidth:1400,
margin:"0 auto",
}}

>

<section
style={{
marginBottom:50,
}}
>

<div
style={{
fontSize:13,
fontWeight:700,
letterSpacing:2,
color:"#B48A45",
marginBottom:12,
}}
>

RETURN FOR WISDOM

</div>

<h1
style={{
margin:0,
fontSize:58,
color:"#153848",
lineHeight:1.1,
}}
>

Welcome back to FONS.

</h1>

<p
style={{
marginTop:20,
fontSize:20,
lineHeight:1.8,
color:"#666",
maxWidth:820,
}}
>

Everything you create, preserve and publish begins here.

</p>

</section>

<div

style={{

display:"grid",

gridTemplateColumns:"2fr 1fr",

gap:30,

marginBottom:35,

}}

>

<div

style={{

background:"#153848",

color:"#fff",

padding:45,

borderRadius:32,

}}

>

<div

style={{

fontSize:13,

letterSpacing:2,

fontWeight:700,

opacity:.8,

}}

>

CONTINUE CREATING

</div>

<h2

style={{

fontSize:40,

marginTop:18,

marginBottom:20,

}}

>

Open Creator Studio

</h2>

<p

style={{

fontSize:18,

lineHeight:1.8,

opacity:.9,

maxWidth:620,

}}

>

Upload conversations, allow MCAIE to process them and automatically publish them into your FONS Library.

</p>

<Link

href="/studio"

style={{

display:"inline-block",

marginTop:35,

padding:"18px 30px",

background:"#B48A45",

borderRadius:999,

color:"#fff",

fontWeight:700,

textDecoration:"none",

}}

>

Open Studio

</Link>

</div>

<div

style={{

background:"#fff",

padding:35,

borderRadius:30,

boxShadow:"0 12px 40px rgba(0,0,0,.05)",

}}

>

<h3

style={{

marginTop:0,

color:"#153848",

fontSize:30,

}}

>

Quick Access

</h3>

<div

style={{

display:"flex",

flexDirection:"column",

gap:18,

marginTop:25,

}}

>

{quickActions.map((item)=>(

<Link

key={item.title}

href={item.href}

style={{

padding:18,

borderRadius:18,

background:"#F6F1E8",

color:"#153848",

fontWeight:700,

textDecoration:"none",

}}

>

{item.title}

</Link>

))}

</div>

</div>

</div>

{/* Kyamagero Daily */}

<section
  style={{
    marginBottom: 40,
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    }}
  >
    <div>
      <div
        style={{
          color: "#B48A45",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 2,
          marginBottom: 8,
        }}
      >
        FEATURED BRAND
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: 42,
          color: "#153848",
        }}
      >
        Kyamagero Daily
      </h2>

      <p
        style={{
          marginTop: 10,
          color: "#666",
          fontSize: 18,
          maxWidth: 700,
        }}
      >
        Conversations that challenge, inspire and transform.
      </p>
    </div>

    <Link
      href="/shows/kyamagero-daily"
      style={{
        textDecoration: "none",
        background: "#153848",
        color: "#fff",
        padding: "16px 26px",
        borderRadius: 999,
        fontWeight: 700,
      }}
    >
      Open →
    </Link>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: 28,
    }}
  >
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 30,
        padding: 36,
        boxShadow: "0 12px 40px rgba(0,0,0,.05)",
      }}
    >
      <div
        style={{
          color: "#B48A45",
          fontWeight: 700,
          letterSpacing: 2,
          fontSize: 12,
          marginBottom: 12,
        }}
      >
        CONTINUE LISTENING
      </div>

      <h2
        style={{
          margin: 0,
          color: "#153848",
          fontSize: 34,
        }}
      >
        You Rise Surrounded
      </h2>

      <p
        style={{
          marginTop: 18,
          color: "#666",
          lineHeight: 1.8,
        }}
      >
        Resume your latest conversation exactly where you left off.
      </p>

      <div
        style={{
          marginTop: 30,
          height: 10,
          borderRadius: 999,
          background: "#EEE",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "38%",
            height: "100%",
            background: "#B48A45",
          }}
        />
      </div>

      <div
        style={{
          marginTop: 12,
          color: "#666",
        }}
      >
        38% completed
      </div>
    </div>

    <div
      style={{
        background: "#153848",
        color: "#fff",
        borderRadius: 30,
        padding: 30,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          letterSpacing: 2,
          fontSize: 12,
          opacity: .8,
        }}
      >
        RECENTLY PROCESSED
      </div>

      <h3
        style={{
          marginTop: 18,
          fontSize: 28,
        }}
      >
        MONDAY.wav
      </h3>

      <p
        style={{
          opacity: .85,
          lineHeight: 1.8,
        }}
      >
        Ready to be organised into your Library.
      </p>
    </div>
  </div>
</section>

<section
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 28,
  }}
>
  {[
    "Series",
    "Latest Episodes",
    "Library",
  ].map((title) => (
    <div
      key={title}
      style={{
        background: "#fff",
        borderRadius: 30,
        padding: 30,
        minHeight: 320,
        boxShadow: "0 12px 40px rgba(0,0,0,.05)",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          color: "#153848",
          fontSize: 28,
        }}
      >
        {title}
      </h3>

      <div
        style={{
          marginTop: 24,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            padding: 18,
            borderRadius: 18,
            background: "#F6F1E8",
            fontWeight: 700,
            color: "#153848",
          }}
        >
          You Rise Surrounded
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: 18,
            background: "#F6F1E8",
            fontWeight: 700,
            color: "#153848",
          }}
        >
          Episode 1
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: 18,
            background: "#F6F1E8",
            fontWeight: 700,
            color: "#153848",
          }}
        >
          Browse Library
        </div>
      </div>
    </div>
  ))}
</section>
    </div>
    </DashboardLayout>
  );
}