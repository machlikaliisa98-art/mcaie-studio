"use client";

import { useState } from "react";
import ChooseSource from "./ChooseSource";
import ConversationDetails from "./ConversationDetails";
import ProductionOptions from "./ProductionOptions";
import ProcessingView from "./ProcessingView";

export default function NewConversationWizard() {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div
      style={{
        background: "#FFFFFF",
        borderRadius: 32,
        padding: 40,
        boxShadow: "0 18px 45px rgba(0,0,0,.05)",
      }}
    >
      {/* Header */}

      <div
        style={{
          marginBottom: 40,
        }}
      >
        <div
          style={{
            color: "#B48A45",
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          NEW CONVERSATION
        </div>

        <h2
          style={{
            marginTop: 10,
            color: "#153848",
            fontSize: 42,
          }}
        >
          Create a Conversation
        </h2>

        <p
          style={{
            color: "#666",
            lineHeight: 1.8,
            maxWidth: 700,
          }}
        >
          Upload, record or import a conversation, then let FONS
          transform it into a structured knowledge experience.
        </p>
      </div>

      {/* Progress */}

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 45,
        }}
      >
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            style={{
              flex: 1,
              height: 8,
              borderRadius: 999,
              background:
                item <= step
                  ? "#153848"
                  : "#E6DDD0",
              transition: ".25s",
            }}
          />
        ))}
      </div>

      {/* Steps */}

      {step === 1 && <ChooseSource />}

      {step === 2 && <ConversationDetails />}

      {step === 3 && <ProductionOptions />}

      {step === 4 && (
        <div>
          <h3
            style={{
              color: "#153848",
            }}
          >
            Review Conversation
          </h3>

          <p
            style={{
              color: "#666",
              lineHeight: 1.8,
            }}
          >
            Confirm your conversation details and production settings
            before publishing.
          </p>
        </div>
      )}

      {step === 5 && <ProcessingView />}

      {/* Navigation */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 60,
        }}
      >
        <button
          onClick={back}
          disabled={step === 1}
          style={{
            background: "#F6F1E8",
            border: "none",
            padding: "16px 28px",
            borderRadius: 999,
            cursor: step === 1 ? "default" : "pointer",
            color: "#153848",
            fontWeight: 700,
          }}
        >
          Back
        </button>

        <button
          onClick={next}
          style={{
            background: "#153848",
            color: "#FFFFFF",
            border: "none",
            padding: "16px 34px",
            borderRadius: 999,
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          {step === 5 ? "Finish" : "Continue"}
        </button>
      </div>
    </div>
  );
}