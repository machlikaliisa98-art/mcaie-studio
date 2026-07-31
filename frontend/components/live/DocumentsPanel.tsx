"use client";

type StudioDocument = {

    id:string;

    title:string;

    type:string;

    size:string;

    uploadedBy:string;

    status:"Ready"|"Presenting"|"Processing";

};

export default function DocumentsPanel({

    session,

}:{

    session:any;

}){

    const documents:StudioDocument[]=[];

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

                📄 Documents Center

            </h2>

            <p
                style={{
                    color:"#9FB4C9",
                    marginBottom:24,
                }}
            >

                Manage every file used during the broadcast.

            </p>

            <UploadZone/>

            <Toolbar/>

            <Library
                documents={documents}
            />

        </section>

    );

}

function UploadZone(){

    return(

        <div
            style={{
                border:"2px dashed #33506F",
                borderRadius:18,
                padding:"40px",
                textAlign:"center",
                marginBottom:24,
                background:"#0E1C2D",
            }}
        >

            <div
                style={{
                    fontSize:48,
                }}
            >

                📁

            </div>

            <h3>

                Drop Documents Here

            </h3>

            <div
                style={{
                    color:"#9FB4C9",
                }}
            >

                PDF · PowerPoint · Word · Excel · Images · Video · Code

            </div>

        </div>

    );

}

function Toolbar(){

    return(

        <div
            style={{
                display:"flex",
                gap:12,
                flexWrap:"wrap",
                marginBottom:24,
            }}
        >

            <Action text="Upload"/>

            <Action text="Present"/>

            <Action text="Annotate"/>

            <Action text="Share"/>

            <Action text="Knowledge"/>

            <Action text="Archive"/>

        </div>

    );

}

function Library({

    documents,

}:{

    documents:StudioDocument[];

}){

    if(documents.length===0){

        return(

            <div
                style={{
                    color:"#9FB4C9",
                    padding:"24px",
                    textAlign:"center",
                    background:"#0E1C2D",
                    borderRadius:16,
                }}
            >

                No documents uploaded.

            </div>

        );

    }

    return(

        <>

            {

                documents.map(

                    document=>(

                        <DocumentCard

                            key={document.id}

                            document={document}

                        />

                    )

                )

            }

        </>

    );

}

function DocumentCard({

    document,

}:{

    document:StudioDocument;

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

            <strong>

                {document.title}

            </strong>

        </div>

    );

}

function Action({

    text,

}:{

    text:string;

}){

    return(

        <button
            style={{
                border:"none",
                background:"#1E6FA8",
                color:"#fff",
                padding:"12px 18px",
                borderRadius:12,
                cursor:"pointer",
                fontWeight:700,
            }}
        >

            {text}

        </button>

    );

}