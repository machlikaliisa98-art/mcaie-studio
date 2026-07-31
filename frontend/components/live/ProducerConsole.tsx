"use client";

export default function ProducerConsole({

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
                    marginBottom:22,
                }}
            >
                🎛 Producer Console
            </h2>

            <StatusRow
                title="Broadcast"
                value={
                    session.status==="live"

                    ? "LIVE"

                    : "Waiting"
                }
                color={
                    session.status==="live"

                    ? "#16A34A"

                    : "#2563EB"
                }
            />

            <StatusRow
                title="Recording"
                value="Ready"
                color="#0EA5E9"
            />

            <StatusRow
                title="Studio Audio"
                value="Healthy"
                color="#16A34A"
            />

            <StatusRow
                title="Camera Engine"
                value="Ready"
                color="#16A34A"
            />

            <StatusRow
                title="Screen Sharing"
                value="Available"
                color="#9333EA"
            />

            <StatusRow
                title="Whiteboard"
                value="Available"
                color="#F59E0B"
            />

            <StatusRow
                title="Documents"
                value="Ready"
                color="#2563EB"
            />

            <StatusRow
                title="Polls"
                value="Ready"
                color="#EA580C"
            />

            <StatusRow
                title="Questions"
                value="Ready"
                color="#0891B2"
            />

            <StatusRow
                title="MCAIE Producer"
                value="Monitoring"
                color="#16A34A"
            />

            <StatusRow
                title="Knowledge Engine"
                value="Listening"
                color="#7C3AED"
            />

            <StatusRow
                title="Transcript"
                value="Waiting"
                color="#6B7280"
            />

            <StatusRow
                title="Translation"
                value="Ready"
                color="#0F766E"
            />

        </section>

    );

}

function StatusRow({

    title,

    value,

    color,

}:{

    title:string;

    value:string;

    color:string;

}){

    return(

        <div
            style={{
                display:"flex",
                justifyContent:"space-between",
                alignItems:"center",
                marginBottom:14,
                paddingBottom:14,
                borderBottom:"1px solid rgba(255,255,255,.06)",
            }}
        >

            <span>

                {title}

            </span>

            <div
                style={{
                    background:color,
                    padding:"6px 12px",
                    borderRadius:999,
                    fontSize:12,
                    fontWeight:700,
                }}
            >

                {value}

            </div>

        </div>

    );

}