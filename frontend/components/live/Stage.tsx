"use client";

export default function Stage({

    session,

}:{

    session:any;

}){

    const presenter =

        session?.speakers?.[0];

    return(

        <section
            style={{
                background:"#13263D",
                borderRadius:24,
                padding:24,
                minHeight:420,
                display:"flex",
                flexDirection:"column",
            }}
        >

            <div
                style={{
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center",
                    marginBottom:20,
                }}
            >

                <div>

                    <h2
                        style={{
                            margin:0,
                        }}
                    >
                        🎬 Broadcast Stage
                    </h2>

                    <div
                        style={{
                            color:"#8EA2BD",
                            marginTop:8,
                        }}
                    >
                        Live Production Area
                    </div>

                </div>

                <div
                    style={{
                        background:
                            session.status==="live"

                            ? "#16864F"

                            : "#1E6FA8",

                        padding:"10px 18px",

                        borderRadius:999,

                        fontWeight:700,
                    }}
                >

                    {session.status.toUpperCase()}

                </div>

            </div>

            <div
                style={{
                    flex:1,
                    borderRadius:20,
                    background:"#0C1A2A",
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    flexDirection:"column",
                }}
            >

                <div
                    style={{
                        width:130,
                        height:130,
                        borderRadius:"50%",
                        background:"#1E6FA8",
                        display:"flex",
                        justifyContent:"center",
                        alignItems:"center",
                        fontSize:48,
                        marginBottom:18,
                    }}
                >

                    🎙

                </div>

                <h2>

                    {presenter?.name}

                </h2>

                <div
                    style={{
                        color:"#9FB4C9",
                    }}
                >

                    {presenter?.role}

                </div>

                <div
                    style={{
                        marginTop:30,
                        display:"flex",
                        gap:12,
                        flexWrap:"wrap",
                        justifyContent:"center",
                    }}
                >

                    <Badge text="🎤 Studio Audio" />

                    <Badge text="📷 Camera Ready" />

                    <Badge text="🖥 Screen Share Ready" />

                    <Badge text="🧠 MCAIE Active" />

                </div>

            </div>

        </section>

    );

}

function Badge({

    text,

}:{

    text:string;

}){

    return(

        <div
            style={{
                background:"#1E6FA8",
                padding:"10px 18px",
                borderRadius:999,
                fontSize:14,
                fontWeight:600,
            }}
        >

            {text}

        </div>

    );

}