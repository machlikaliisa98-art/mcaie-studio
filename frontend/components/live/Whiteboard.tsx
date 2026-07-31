"use client";

export default function Whiteboard({

    session,

}:{

    session:any;

}){

    return(

        <section
            style={{
                background:"#13263D",
                borderRadius:24,
                padding:24,
            }}
        >

            <h2
                style={{
                    marginTop:0,
                }}
            >

                ✏ MCAIE Whiteboard

            </h2>

            <p
                style={{
                    color:"#9FB4C9",
                    marginBottom:24,
                }}
            >

                Collaborative drawing, brainstorming and live annotation.

            </p>

            <Toolbar/>

            <Canvas/>

            <StatusBar/>

        </section>

    );

}

function Toolbar(){

    const tools=[

        "✏ Pen",

        "🖍 Marker",

        "📏 Line",

        "⬜ Rectangle",

        "⭕ Circle",

        "➡ Arrow",

        "📝 Text",

        "🖼 Image",

        "📌 Sticky",

        "🧹 Eraser",

    ];

    return(

        <div
            style={{
                display:"flex",
                flexWrap:"wrap",
                gap:12,
                marginBottom:20,
            }}
        >

            {

                tools.map(

                    tool=>(

                        <button
                            key={tool}
                            style={{
                                border:"none",
                                background:"#1E6FA8",
                                color:"#fff",
                                borderRadius:12,
                                padding:"12px 18px",
                                cursor:"pointer",
                                fontWeight:700,
                            }}
                        >

                            {tool}

                        </button>

                    )

                )

            }

        </div>

    );

}

function Canvas(){

    return(

        <div
            style={{
                height:520,
                background:"#0E1C2D",
                borderRadius:20,
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                color:"#607D99",
                fontSize:22,
                marginBottom:20,
            }}
        >

            Whiteboard Canvas

        </div>

    );

}

function StatusBar(){

    return(

        <div
            style={{
                display:"flex",
                justifyContent:"space-between",
                flexWrap:"wrap",
                gap:16,
                color:"#9FB4C9",
                fontSize:14,
            }}
        >

            <span>Drawing Mode</span>

            <span>Participants: 0</span>

            <span>Annotations: 0</span>

            <span>Auto Saved</span>

        </div>

    );

}