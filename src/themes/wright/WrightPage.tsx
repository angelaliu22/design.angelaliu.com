"use client";

import { useState, useCallback } from "react";
import { PortfolioData, Project } from "@/content/portfolio";
import { useTheme } from "@/themes/ThemeProvider";
import { WaterfallScene } from "./components/WaterfallScene";
import "./wright.css";

interface WrightPageProps {
  data: PortfolioData;
}

type Section = "about" | "work" | "projects" | "contact";

export default function WrightPage({ data }: WrightPageProps) {
  const [activeSection, setActiveSection] = useState<Section>("about");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { activeTheme, availableThemes, setTheme } = useTheme();

  const scrollTo = useCallback((section: Section) => {
    setActiveSection(section);
    document.getElementById(`wright-${section}`)?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  const extractYouTubeId = (url: string): string => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match?.[1] || "";
  };

  const getYouTubeStart = (url: string): number => {
    const match = url.match(/[?&]t=(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  return (
    <div className="wright-theme">
      {/* Three.js waterfall background */}
      <WaterfallScene />

      {/* Header - floats over scene */}
      <header className="wright-header">
        <span className="wright-name">{data.name}</span>
        <nav className="wright-nav">
          {(["about", "work", "projects", "contact"] as Section[]).map((s) => (
            <button
              key={s}
              className={`wright-nav-link ${activeSection === s ? "active" : ""}`}
              onClick={() => scrollTo(s)}
            >
              {s}
            </button>
          ))}
        </nav>
      </header>

      {/* Scrollable content layer */}
      <div className="wright-content-scroll">
        {/* Hero / About - cantilevered slab */}
        <section id="wright-about" className="wright-hero">
          <div className="wright-slab">
            <div className="wright-slab-edge" />
            <div className="wright-slab-content">
              <h1 className="wright-hero-title">{data.name}</h1>
              <p className="wright-hero-bio">{data.bio}</p>
              <p className="wright-hero-bio" style={{ marginTop: "16px" }}>
                {data.currentRole.title} at {data.currentRole.company}.{" "}
                {data.currentRole.description}
              </p>
            </div>
          </div>
        </section>

        {/* Spacer to let the waterfall show through */}
        <div className="wright-waterfall-gap" />

        {/* Work Experience */}
        <section id="wright-work" className="wright-section">
          <div className="wright-slab">
            <div className="wright-slab-edge" />
            <div className="wright-slab-content">
              <h2 className="wright-section-title">Experience</h2>
              <p className="wright-section-subtitle">
                A career in design & product
              </p>

              <div className="wright-timeline">
                <div className="wright-timeline-item">
                  <div className="wright-timeline-company">
                    {data.currentRole.company}
                  </div>
                  <div className="wright-timeline-role">
                    {data.currentRole.title}
                  </div>
                  <div className="wright-timeline-period">
                    {data.currentRole.period}
                  </div>
                </div>

                {data.pastWork.map((job) => (
                  <div key={job.company} className="wright-timeline-item">
                    <div className="wright-timeline-company">{job.company}</div>
                    <div className="wright-timeline-role">{job.title}</div>
                    <div className="wright-timeline-period">{job.period}</div>
                    {job.description && (
                      <div className="wright-timeline-desc">
                        {job.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="wright-waterfall-gap" />

        {/* Projects */}
        <section id="wright-projects" className="wright-section">
          <div className="wright-slab">
            <div className="wright-slab-edge" />
            <div className="wright-slab-content">
              <h2 className="wright-section-title">Selected Work</h2>
              <p className="wright-section-subtitle">
                Notable projects at Flexpa
              </p>

              <div className="wright-projects">
                {(data.currentRole.projects || []).map((project) => (
                  <div
                    key={project.slug}
                    className="wright-project-card"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="wright-project-name">{project.name}</div>
                    <div className="wright-project-desc">
                      {project.subtitle}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="wright-waterfall-gap" />

        {/* Contact */}
        <section id="wright-contact" className="wright-section">
          <div className="wright-slab wright-slab-narrow">
            <div className="wright-slab-edge" />
            <div className="wright-slab-content">
              <h2 className="wright-section-title">Connect</h2>
              <div className="wright-contact-links">
                {data.socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wright-contact-link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="wright-footer">{data.copyright}</footer>
      </div>

      {/* Theme switcher */}
      <div className="wright-status">
        {availableThemes.map((t) => (
          <button
            key={t.id}
            className={`wright-theme-btn ${t.id === activeTheme.id ? "active" : ""}`}
            onClick={() => setTheme(t.id)}
            disabled={t.id === activeTheme.id}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Project detail overlay */}
      {selectedProject && (
        <div
          className="wright-detail-overlay"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="wright-detail-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="wright-detail-close"
              onClick={() => setSelectedProject(null)}
            >
              ×
            </button>

            <h2 className="wright-detail-title">{selectedProject.name}</h2>
            <p className="wright-detail-subtitle">
              {selectedProject.subtitle}
            </p>

            {selectedProject.detail?.media && (
              <div className="wright-detail-media">
                {selectedProject.detail.media.type === "image" && (
                  <img
                    src={selectedProject.detail.media.src}
                    alt={selectedProject.name}
                  />
                )}
                {selectedProject.detail.media.type === "youtube" && (
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(selectedProject.detail.media.src)}?start=${getYouTubeStart(selectedProject.detail.media.src)}&rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
                {selectedProject.detail.media.type === "video" && (
                  <video src={selectedProject.detail.media.src} controls />
                )}
              </div>
            )}

            {selectedProject.detail && (
              <>
                <div className="wright-detail-section">
                  <div className="wright-detail-section-title">Problem</div>
                  <p className="wright-detail-text">
                    {selectedProject.detail.problem}
                  </p>
                </div>

                {selectedProject.detail.hardPart && (
                  <div className="wright-detail-section">
                    <div className="wright-detail-section-title">
                      What Made It Hard
                    </div>
                    <p className="wright-detail-text">
                      {selectedProject.detail.hardPart}
                    </p>
                  </div>
                )}

                <div className="wright-detail-section">
                  <div className="wright-detail-section-title">My Role</div>
                  <p className="wright-detail-text">
                    {selectedProject.detail.role}
                  </p>
                </div>

                <div className="wright-detail-section">
                  <div className="wright-detail-section-title">Outcome</div>
                  <p className="wright-detail-text">
                    {selectedProject.detail.outcome}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
