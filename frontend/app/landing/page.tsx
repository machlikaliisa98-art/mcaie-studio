"use client";

import LandingHeader from "../../components/LandingHeader";
import Hero from "../../components/Hero";
import FeaturedConversations from "../../components/FeaturedConversations";
import FeaturedCreators from "../../components/FeaturedCreators";
import ContinueListening from "../../components/ContinueListening";
import TrendingCollections from "../../components/TrendingCollections";
import BecomeCreator from "../../components/BecomeCreator";
import LandingFooter from "../../components/LandingFooter";

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F6F1E8",
      }}
    >
      <LandingHeader />

      <Hero />

      <FeaturedConversations />

      <FeaturedCreators />

      <ContinueListening />

      <TrendingCollections />

      <BecomeCreator />

      <LandingFooter />
    </main>
  );
}