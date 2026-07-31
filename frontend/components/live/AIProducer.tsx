"use client";

type Insight = {

    level: "info" | "warning" | "success";

    title: string;

    description: string;

};

export default function AIProducer({

    session,

}:{

    session:any;

}){

    const insights:Insight[]=[

        {

            level:"success",

            title:"Studio Ready",

            description:"Broadcast systems are operational.",

        },

        {

            level:"info",

            title:"Knowledge Engine",

            description:"Waiting for live discussion.",

        },

        {

            level:"info",

            title:"Transcript",

            description:"Will begin once broadcast starts.",

        },

        {

            level:"info",

            title:"Highlights",

            description:"Interesting moments will appear here.",

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
                    marginBottom:18,
                }}
            >

                🧠 MCAIE AI Producer

            </h2>

            <div
                style={{
                    color:"#9FB4C9",
                    marginBottom:24,
                }}
            >

                Your intelligent production assistant.

            </div>

            {

                insights.map(

                    (item,index)=>(

                        <InsightCard

                            key={index}

                            insight={item}

                        />

                    )

                )

            }

        </section>

    );

}

function InsightCard({

    insight,

}:{

    insight:Insight;

}){

    const color=

        insight.level==="success"

        ? "#16A34A"

        : insight.level==="warning"

        ? "#F59E0B"

        : "#2563EB";

    return(

        <div
            style={{
                marginBottom:16,
                borderLeft:`4px solid ${color}`,
                padding:"14px 16px",
                background:"#0E1C2D",
                borderRadius:12,
            }}
        >

            <div
                style={{
                    fontWeight:700,
                    marginBottom:6,
                }}
            >

                {insight.title}

            </div>

            <div
                style={{
                    color:"#9FB4C9",
                    fontSize:14,
                }}
            >

                {insight.description}

            </div>

        </div>

    );

}