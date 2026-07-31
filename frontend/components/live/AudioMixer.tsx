"use client";

type Channel={

    id:string;

    name:string;

    role:string;

    volume:number;

    muted:boolean;

    solo:boolean;

};

export default function AudioMixer({

    session,

}:{

    session:any;

}){

    const channels:Channel[]=(

        session?.speakers ?? []

    ).map(

        (speaker:any)=>({

            id:speaker.id,

            name:speaker.name,

            role:speaker.role,

            volume:80,

            muted:speaker.muted,

            solo:false,

        })

    );

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

                🎚 Studio Audio Mixer

            </h2>

            <p
                style={{
                    color:"#9FB4C9",
                    marginBottom:24,
                }}
            >

                Live participant audio control.

            </p>

            {

                channels.map(

                    (channel)=>(

                        <AudioChannel

                            key={channel.id}

                            channel={channel}

                        />

                    )

                )

            }

        </section>

    );

}

function AudioChannel({

    channel,

}:{

    channel:Channel;

}){

    return(

        <div
            style={{
                background:"#0E1C2D",
                borderRadius:18,
                padding:18,
                marginBottom:18,
            }}
        >

            <div
                style={{
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center",
                    marginBottom:16,
                }}
            >

                <div>

                    <strong>

                        {channel.name}

                    </strong>

                    <div
                        style={{
                            color:"#9FB4C9",
                            marginTop:4,
                            fontSize:13,
                        }}
                    >

                        {channel.role}

                    </div>

                </div>

                <div
                    style={{
                        display:"flex",
                        gap:8,
                    }}
                >

                    <ActionButton>

                        🎤

                    </ActionButton>

                    <ActionButton>

                        🎧

                    </ActionButton>

                    <ActionButton>

                        🔇

                    </ActionButton>

                </div>

            </div>

            <input

                type="range"

                min={0}

                max={100}

                value={channel.volume}

                readOnly

                style={{

                    width:"100%",

                }}

            />

            <div
                style={{
                    marginTop:10,
                    color:"#9FB4C9",
                    fontSize:13,
                }}
            >

                Output Volume {channel.volume}%

            </div>

        </div>

    );

}

function ActionButton({

    children,

}:{

    children:React.ReactNode;

}){

    return(

        <button
            style={{
                width:42,
                height:42,
                border:"none",
                borderRadius:12,
                background:"#1E6FA8",
                cursor:"pointer",
                color:"#fff",
                fontSize:18,
            }}
        >

            {children}

        </button>

    );

}