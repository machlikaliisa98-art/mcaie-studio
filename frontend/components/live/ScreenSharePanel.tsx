"use client";

type Request = {

    id:string;

    name:string;

    role:string;

    status:"Waiting"|"Approved"|"Live";

};

export default function ScreenSharePanel({

    session,

}:{

    session:any;

}){

    const requests: Request[] = [];

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

                🖥 Presentation Center

            </h2>

            <p
                style={{
                    color:"#9FB4C9",
                    marginBottom:24,
                }}
            >

                Manage every presentation, screen share and demonstration.

            </p>

            <PreviewWindow/>

            <ActionGrid/>

            <RequestQueue
                requests={requests}
            />

        </section>

    );

}

function PreviewWindow(){

    return(

        <div
            style={{
                height:260,
                borderRadius:18,
                background:"#0E1C2D",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                fontSize:60,
                marginBottom:24,
            }}
        >

            🖥

        </div>

    );

}

function ActionGrid(){

    const actions=[

        "Entire Screen",

        "Application",

        "Browser Tab",

        "Slides",

        "Whiteboard",

        "Camera",

        "Documents",

        "Video",

    ];

    return(

        <div
            style={{
                display:"grid",
                gridTemplateColumns:
                    "repeat(2,1fr)",
                gap:12,
                marginBottom:28,
            }}
        >

            {

                actions.map(

                    action=>(

                        <button
                            key={action}
                            style={{
                                border:"none",
                                background:"#1E6FA8",
                                color:"#fff",
                                padding:"16px",
                                borderRadius:14,
                                cursor:"pointer",
                                fontWeight:700,
                            }}
                        >

                            {action}

                        </button>

                    )

                )

            }

        </div>

    );

}

function RequestQueue({

    requests,

}:{

    requests:Request[];

}){

    return(

        <div>

            <h3>

                Presentation Queue

            </h3>

            {

                requests.length===0 &&

                <div
                    style={{
                        color:"#9FB4C9",
                        padding:"18px 0",
                    }}
                >

                    No pending presentation requests.

                </div>

            }

        </div>

    );

}