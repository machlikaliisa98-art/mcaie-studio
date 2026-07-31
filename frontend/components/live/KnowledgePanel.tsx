"use client";

type KnowledgeNode = {

    title: string;

    type: string;

    confidence: number;

};

export default function KnowledgePanel({

    session,

}:{

    session:any;

}){

    const nodes:KnowledgeNode[]=[

        {

            title:"Knowledge Graph Ready",

            type:"System",

            confidence:100,

        },

        {

            title:"Waiting For Live Discussion",

            type:"Live",

            confidence:100,

        },

    ];

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

                🧠 Knowledge Engine

            </h2>

            <p
                style={{
                    color:"#9FB4C9",
                    marginBottom:24,
                }}
            >

                MCAIE builds a live knowledge graph while the broadcast is running.

            </p>

            {

                nodes.map(

                    (node,index)=>(

                        <NodeCard

                            key={index}

                            node={node}

                        />

                    )

                )

            }

        </section>

    );

}

function NodeCard({

    node,

}:{

    node:KnowledgeNode;

}){

    return(

        <div
            style={{
                background:"#0E1C2D",
                borderRadius:16,
                padding:18,
                marginBottom:16,
            }}
        >

            <div
                style={{
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center",
                }}
            >

                <strong>

                    {node.title}

                </strong>

                <span
                    style={{
                        background:"#1E6FA8",
                        padding:"6px 12px",
                        borderRadius:999,
                        fontSize:12,
                    }}
                >

                    {node.type}

                </span>

            </div>

            <div
                style={{
                    marginTop:12,
                    color:"#9FB4C9",
                }}
            >

                Confidence

                {" "}

                {node.confidence}%

            </div>

        </div>

    );

}