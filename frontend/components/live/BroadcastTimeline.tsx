"use client";

type TimelineEvent={

    time:string;

    title:string;

    description:string;

    color:string;

};

export default function BroadcastTimeline(){

    const events: TimelineEvent[] = [

        {

            time:"00:00",

            title:"Studio Ready",

            description:"Waiting for host to begin.",

            color:"#2563EB",

        },

        {

            time:"--",

            title:"Broadcast",

            description:"Timeline begins once live starts.",

            color:"#16A34A",

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
                    marginBottom:20,
                }}
            >

                🕒 Broadcast Timeline

            </h2>

            {

                events.map(

                    (event,index)=>(

                        <TimelineCard

                            key={index}

                            event={event}

                        />

                    )

                )

            }

        </section>

    );

}

function TimelineCard({

    event,

}:{

    event:TimelineEvent;

}){

    return(

        <div
            style={{
                display:"flex",
                gap:18,
                marginBottom:18,
            }}
        >

            <div
                style={{
                    minWidth:70,
                    fontWeight:700,
                    color:"#FFFFFF",
                }}
            >

                {event.time}

            </div>

            <div
                style={{
                    flex:1,
                    borderLeft:`4px solid ${event.color}`,
                    paddingLeft:18,
                    paddingBottom:12,
                }}
            >

                <div
                    style={{
                        fontWeight:700,
                    }}
                >

                    {event.title}

                </div>

                <div
                    style={{
                        color:"#9FB4C9",
                        marginTop:6,
                        fontSize:14,
                    }}
                >

                    {event.description}

                </div>

            </div>

        </div>

    );

}