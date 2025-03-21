import { useState } from "react";
import "./StakeholderPortal.css";

import ViewEvents from "../../components/Stakeholder/ViewEvents/ViewEvents";

const StakeholderPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="tab-content">
            <h2>Overview</h2>
            <p>High-level analytics and summaries will appear here.</p>
            {/* Future integration: Add charts, KPIs, etc. */}
          </div>
        );
      case "events":
        return (
          <div className="tab-content">
            <h2>Event Details</h2>
            <ViewEvents />
          </div>
        );
      case "sponsorships":
        return (
          <div className="tab-content">
            <h2>Sponsorships</h2>
            <p>Sponsorship contributions and performance data.</p>
            {/* Future integration: Add financial charts and tables */}
          </div>
        );
      case "communications":
        return (
          <div className="tab-content">
            <h2>Communications</h2>
            <p>Messaging area to contact event organizers.</p>
            {/* Future integration: Build a messaging/chat interface */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="stakeholder-portal">
      <h1>Stakeholder Portal</h1>
      <div className="tabs">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === "events" ? "active" : ""}`}
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>
        <button
          className={`tab ${activeTab === "sponsorships" ? "active" : ""}`}
          onClick={() => setActiveTab("sponsorships")}
        >
          Sponsorships
        </button>
        <button
          className={`tab ${activeTab === "communications" ? "active" : ""}`}
          onClick={() => setActiveTab("communications")}
        >
          Communications
        </button>
      </div>
      <div className="content">{renderTabContent()}</div>
    </div>
  );
};

export default StakeholderPortal;
