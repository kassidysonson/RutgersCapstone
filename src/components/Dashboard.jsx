import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // to read :id from the URL
import { supabase } from "../supabaseClient";
import "./Dashboard.css";

const Dashboard = () => {
  const { id } = useParams(); // get user id from URL
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [newBio, setNewBio] = useState("");
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("applied");

  // Static stats (example)
  const stats = {
    applied: 3,
    saved: 0,
    active: 2,
    posted: 2,
  };

  // Static projects (same as before)
  const appliedProjects = [
    {
      id: "p1",
      title: "E-commerce Mobile App Development",
      company: "ShopFlow Startup",
      appliedDate: "Applied Nov 1, 2024",
      due: "Dec 15, 2024",
      skills: ["React Native", "JavaScript", "API Integration"],
      members: [{ name: "SW", initials: "SW" }],
      status: "In Progress",
      progress: 65,
      updated: "2 days ago",
    },
    {
      id: "p2",
      title: "Brand Identity Design Package",
      company: "TechVision",
      appliedDate: "Applied Oct 15, 2024",
      due: "Nov 30, 2024",
      skills: ["Logo Design", "Branding", "Adobe Illustrator"],
      members: [{ name: "JD", initials: "JD" }],
      status: "Completed",
      progress: 100,
      updated: "1 week ago",
    },
  ];

  const postedProjects = [
    {
      id: "posted1",
      title: "Social Media Management Tool",
      postedDate: "Posted Nov 20, 2024",
      applicants: 12,
      description:
        "Need a developer to build a social media scheduling platform",
      due: "Feb 15, 2025",
      skills: ["React", "Node.js", "MongoDB", "API Integration"],
      selectedStudents: [
        { name: "Alex Chen", initials: "AC" },
        { name: "Sarah Kim", initials: "SK" },
      ],
      status: "Active",
      statusColor: "active",
    },
    {
      id: "posted2",
      title: "Mobile App UI/UX Design",
      postedDate: "Posted Nov 18, 2024",
      applicants: 8,
      description: "Looking for a creative designer for our fitness app",
      due: "Jan 10, 2025",
      skills: ["Figma", "Mobile Design", "User Research", "Prototyping"],
      selectedStudents: [],
      status: "In Review",
      statusColor: "review",
    },
  ];

  // 🔹 Fetch user data from Supabase
  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("full_name, bio")
        .eq("id", id)
        .single();

      if (!error && data) {
        setUser(data);
        setBio(data.bio || "No bio yet.");
      } else {
        console.error("Error loading user:", error?.message);
      }
    };

    fetchUser();
  }, [id]);

  // 🔹 If no user yet, show loading
  if (!user) {
    return (
      <section className="dashboard">
        <div className="dashboard-container">
          <p>Loading your dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="dashboard" className="dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="user-chip">
            <div className="avatar">
              {user.full_name
                ? user.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "?"}
            </div>
            <div className="user-meta">
              <h2 className="dashboard-title">
                Welcome back, {user.full_name}
              </h2>
              <p className="dashboard-subtitle">
                Here’s a quick look at your activity
              </p>
            </div>
          </div>
          <a href="/post-project" className="btn-post-new">
            Post New Project
          </a>
        </div>

        {/* 🔹 Bio Section */}
        <div className="profile-bio-section">
          {editing ? (
            <div className="edit-bio-box">
              <textarea
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                className="bio-input"
              />
              <button
                className="btn-save"
                onClick={async () => {
                  const { error } = await supabase
                    .from("users")
                    .update({ bio: newBio })
                    .eq("id", id);
                  if (!error) {
                    setBio(newBio);
                    setEditing(false);
                  }
                }}
              >
                Save
              </button>
            </div>
          ) : (
            <>
              <p className="user-bio">{bio}</p>
              <button
                className="btn-edit"
                onClick={() => {
                  setNewBio(bio);
                  setEditing(true);
                }}
              >
                ✎ Edit
              </button>
            </>
          )}
        </div>

        {/* Stat Cards */}
        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-title">Applied Projects</div>
            <div className="stat-value">{stats.applied}</div>
            <div className="stat-hint">Projects you've applied to</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Saved Projects</div>
            <div className="stat-value">{stats.saved}</div>
            <div className="stat-hint">Projects saved for later</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Active Projects</div>
            <div className="stat-value">{stats.active}</div>
            <div className="stat-hint">Currently working</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "applied" ? "active" : ""}`}
            onClick={() => setActiveTab("applied")}
          >
            Applied ({stats.applied})
          </button>
          <button
            className={`tab ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            Saved ({stats.saved})
          </button>
          <button
            className={`tab ${activeTab === "posted" ? "active" : ""}`}
            onClick={() => setActiveTab("posted")}
          >
            Posted ({stats.posted})
          </button>
        </div>

        {/* Projects (same as before) */}
        <div className="project-list">
          {activeTab === "applied" &&
            appliedProjects.map((p) => (
              <div key={p.id} className="project-card">
                <div className="project-top">
                  <div className="project-main">
                    <h3 className="project-title">{p.title}</h3>
                    <div className="project-sub">
                      <span className="company">{p.company}</span>
                      <span className="dot">•</span>
                      <span className="applied">{p.appliedDate}</span>
                    </div>
                  </div>
                  <div
                    className={`status-badge ${
                      p.status === "Completed" ? "completed" : "inprogress"
                    }`}
                  >
                    {p.status}
                  </div>
                </div>
              </div>
            ))}

          {activeTab === "posted" &&
            postedProjects.map((p) => (
              <div key={p.id} className="project-card">
                <div className="project-top">
                  <div className="project-main">
                    <h3 className="project-title">{p.title}</h3>
                    <div className="project-sub">
                      <span className="posted-date">{p.postedDate}</span>
                      <span className="dot">•</span>
                      <span className="applicants">
                        {p.applicants} applicants
                      </span>
                    </div>
                  </div>
                  <div className={`status-badge ${p.statusColor}`}>
                    {p.status}
                  </div>
                </div>
              </div>
            ))}

          {activeTab === "saved" && (
            <div className="empty-state">
              <p>No saved projects yet</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
