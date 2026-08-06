"use client";

import { useState } from "react";

export default function ConversationDetails() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [show, setShow] = useState("");
  const [series, setSeries] = useState("");
  const [language, setLanguage] = useState("English");
  const [visibility, setVisibility] = useState("Private");

  return (
    <>
      <div
        style={{
          marginBottom: 40,
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#153848",
            fontSize: 36,
          }}
        >
          Conversation Details
        </h2>

        <p
          style={{
            marginTop: 14,
            color: "#666",
            lineHeight: 1.8,
            maxWidth: 720,
          }}
        >
          Provide the information that identifies this conversation before it enters the production engine.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 30,
        }}
      >
        {/* LEFT */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <Field
            label="Conversation Title"
            value={title}
            onChange={setTitle}
            placeholder="e.g. You Rise Surrounded"
          />

          <Select
            label="Show"
            value={show}
            onChange={setShow}
            options={[
              "Select Show",
              "Kyamagero Daily",
              "Man Cave UG",
            ]}
          />

          <Field
            label="Series (Optional)"
            value={series}
            onChange={setSeries}
            placeholder="e.g. You Rise Surrounded"
          />

          <Select
            label="Language"
            value={language}
            onChange={setLanguage}
            options={[
              "English",
              "Luganda",
              "Kinyarwanda",
              "Swahili",
              "French",
            ]}
          />
        </div>

        {/* RIGHT */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              color: "#153848",
              fontWeight: 700,
            }}
          >
            Description

            <textarea
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this conversation..."
              style={{
                borderRadius: 18,
                border: "1px solid #DDD3C6",
                padding: 18,
                resize: "vertical",
                fontSize: 16,
                outline: "none",
              }}
            />
          </label>

          <Select
            label="Visibility"
            value={visibility}
            onChange={setVisibility}
            options={[
              "Private",
              "Unlisted",
              "Public",
            ]}
          />

          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              color: "#153848",
              fontWeight: 700,
            }}
          >
            Cover Artwork

            <input
              type="file"
              accept="image/*"
              style={{
                padding: 14,
                border: "1px solid #DDD3C6",
                borderRadius: 18,
              }}
            />
          </label>
        </div>
      </div>
    </>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
}: FieldProps) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        color: "#153848",
        fontWeight: 700,
      }}
    >
      {label}

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: 18,
          borderRadius: 18,
          border: "1px solid #DDD3C6",
          fontSize: 16,
          outline: "none",
        }}
      />
    </label>
  );
}

type SelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

function Select({
  label,
  value,
  onChange,
  options,
}: SelectProps) {
  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        color: "#153848",
        fontWeight: 700,
      }}
    >
      {label}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: 18,
          borderRadius: 18,
          border: "1px solid #DDD3C6",
          fontSize: 16,
          outline: "none",
          background: "#FFFFFF",
        }}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}