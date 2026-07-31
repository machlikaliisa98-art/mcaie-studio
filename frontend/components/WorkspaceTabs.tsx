"use client";

type Props = {

    active: string;

    onChange(tab: string): void;

};

const tabs = [

    "Overview",

    "Episodes",

    "Transcript",

    "Summary",

    "Knowledge",

    "Analytics",

    "Publishing",

];

export default function WorkspaceTabs({

    active,

    onChange,

}: Props) {

    return (

        <div
            style={{

                display: "flex",

                gap: 14,

                flexWrap: "wrap",

                marginBottom: 32,

            }}
        >

            {tabs.map(tab => (

                <button

                    key={tab}

                    onClick={() => onChange(tab)}

                    style={{

                        padding: "14px 22px",

                        borderRadius: 999,

                        border: "none",

                        cursor: "pointer",

                        fontWeight: 700,

                        fontSize: 14,

                        transition: ".25s",

                        background:

                            active === tab

                                ? "#2D6AA3"

                                : "#13263D",

                        color: "#FFFFFF",

                        boxShadow:

                            active === tab

                                ? "0 0 18px rgba(45,106,163,.45)"

                                : "none",

                    }}

                >

                    {tab}

                </button>

            ))}

        </div>

    );

}