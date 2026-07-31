"use client";

type Speaker = {

    id: string;

    name: string;

    role: string;

    muted: boolean;

    camera: boolean;

    screen: boolean;

};

export default function SpeakerGrid({

    session,

}:{

    session:any;

}){

    const speakers:Speaker[] =

        session?.speakers ?? [];

    return(

        <section
            style={{
                background:"#13263D",
                borderRadius:24,
                padding:24,
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
                        👥 Speaker Stage
                    </h2>

                    <div
                        style={{
                            color:"#8EA2BD",
                            marginTop:6,
                        }}
                    >

                        {speakers.length} Active Speaker(s)

                    </div>

                </div>

            </div>

            <div
                style={{
                    display:"grid",
                    gridTemplateColumns:
                        "repeat(auto-fill,minmax(240px,1fr))",
                    gap:18,
                }}
            >

                {

                    speakers.map(

                        (speaker)=>(

                            <SpeakerCard

                                key={speaker.id}

                                speaker={speaker}

                            />

                        )

                    )

                }

            </div>

        </section>

    );

}

function SpeakerCard({

    speaker,

}:{

    speaker:Speaker;

}){

    return(

        <div
            style={{
                background:"#0E1C2D",
                borderRadius:18,
                padding:18,
                border:"1px solid rgba(255,255,255,.06)",
            }}
        >

            <div
                style={{
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center",
                }}
            >

                <div
                    style={{
                        width:56,
                        height:56,
                        borderRadius:"50%",
                        background:"#1E6FA8",
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                        fontSize:24,
                    }}
                >

                    🎙

                </div>

                <RoleBadge

                    role={speaker.role}

                />

            </div>

            <h3
                style={{
                    marginTop:18,
                    marginBottom:6,
                }}
            >

                {speaker.name}

            </h3>

            <div
                style={{
                    color:"#9FB4C9",
                    marginBottom:18,
                }}
            >

                {speaker.role}

            </div>

            <div
                style={{
                    display:"flex",
                    gap:10,
                    flexWrap:"wrap",
                }}
            >

                <Status
                    active={!speaker.muted}
                    icon="🎤"
                />

                <Status
                    active={speaker.camera}
                    icon="📷"
                />

                <Status
                    active={speaker.screen}
                    icon="🖥"
                />

            </div>

        </div>

    );

}

function RoleBadge({

    role,

}:{

    role:string;

}){

    let color="#1E6FA8";

    if(role==="Host"){

        color="#16864F";

    }

    else if(role==="CoHost"){

        color="#B88400";

    }

    return(

        <div
            style={{
                background:color,
                padding:"6px 12px",
                borderRadius:999,
                fontSize:12,
                fontWeight:700,
            }}
        >

            {role}

        </div>

    );

}

function Status({

    active,

    icon,

}:{

    active:boolean;

    icon:string;

}){

    return(

        <div
            style={{
                width:42,
                height:42,
                borderRadius:12,
                background:

                    active

                    ? "#1E6FA8"

                    : "#26394F",

                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                fontSize:20,
            }}
        >

            {icon}

        </div>

    );

}