"use client";

import { useState } from "react";
import { PortfolioData, Project } from "@/content/portfolio";

interface ContentPanelProps {
  activeId: string;
  data: PortfolioData;
  onNavigate: (id: string) => void;
}

// Minimal media popup reusing the same concept as DOS but styled for IDE
function MediaModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const media = project.detail?.media;
  if (!media) return null;

  const ytId = media.src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
  const ytStart = media.src.match(/[?&]t=(\d+)/)?.[1];

  return (
    <div className="ide-modal-overlay" onClick={onClose}>
      <div className="ide-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ide-modal-header">
          <span>{media.filename}</span>
          <button className="ide-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="ide-modal-body">
          {media.type === "image" && (
            <img src={media.src} alt={project.name} />
          )}
          {media.type === "youtube" && ytId && (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}${ytStart ? `?start=${ytStart}` : ""}&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          {media.type === "video" && (
            <video src={media.src} controls />
          )}
        </div>
      </div>
    </div>
  );
}

export function ContentPanel({ activeId, data, onNavigate }: ContentPanelProps) {
  const [mediaProject, setMediaProject] = useState<Project | null>(null);

  const renderBreadcrumb = () => {
    const parts: string[] = [];
    if (activeId === "about") parts.push("about.md");
    else if (activeId === "work") parts.push("work.md");
    else if (activeId === "contact") parts.push("contact.md");
    else if (activeId.startsWith("project-")) {
      parts.push("projects");
      const project = data.currentRole.projects?.find(
        (p) => `project-${p.slug}` === activeId
      );
      if (project) parts.push(`${project.slug}.md`);
    }
    return parts;
  };

  const breadcrumb = renderBreadcrumb();

  return (
    <div className="ide-content">
      {/* Tab bar */}
      <div className="ide-tabs">
        <div className="ide-tab active">
          <span className="ide-tab-icon">M</span>
          {breadcrumb[breadcrumb.length - 1] ?? "about.md"}
          <button className="ide-tab-close">×</button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="ide-breadcrumb">
        <span className="ide-breadcrumb-root">angela-liu</span>
        {breadcrumb.map((part, i) => (
          <span key={i}>
            <span className="ide-breadcrumb-sep"> › </span>
            <span className={i === breadcrumb.length - 1 ? "ide-breadcrumb-active" : ""}>
              {part}
            </span>
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="ide-content-body">
        {activeId === "about" && <AboutContent data={data} onNavigate={onNavigate} />}
        {activeId === "work" && <WorkContent data={data} />}
        {activeId === "contact" && <ContactContent data={data} />}
        {activeId.startsWith("project-") && (
          <ProjectContent
            project={
              data.currentRole.projects?.find(
                (p) => `project-${p.slug}` === activeId
              ) ?? null
            }
            onOpenMedia={setMediaProject}
          />
        )}
      </div>

      {mediaProject && (
        <MediaModal project={mediaProject} onClose={() => setMediaProject(null)} />
      )}
    </div>
  );
}

function AboutContent({ data, onNavigate }: { data: PortfolioData; onNavigate: (id: string) => void }) {
  return (
    <div className="ide-doc">
      <h1 className="ide-doc-h1">{data.name}</h1>
      <p className="ide-doc-lead">{data.bio}</p>

      <div className="ide-doc-section">
        <h2 className="ide-doc-h2">Currently</h2>
        <div className="ide-doc-role-card">
          <div className="ide-doc-role-title">{data.currentRole.title}</div>
          <div className="ide-doc-role-company">
            {data.currentRole.company}
            <span className="ide-doc-badge">present</span>
          </div>
          <p className="ide-doc-body">{data.currentRole.description}</p>
        </div>
      </div>

      <div className="ide-doc-section">
        <h2 className="ide-doc-h2">Notable projects</h2>
        <div className="ide-doc-project-list">
          {(data.currentRole.projects || []).map((p) => (
            <button
              key={p.slug}
              className="ide-doc-project-link"
              onClick={() => onNavigate(`project-${p.slug}`)}
            >
              <span className="ide-doc-project-name">{p.name}</span>
              <span className="ide-doc-project-sub">{p.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkContent({ data }: { data: PortfolioData }) {
  return (
    <div className="ide-doc">
      <h1 className="ide-doc-h1">Work Experience</h1>
      <p className="ide-doc-lead">
        A career spent building products at the intersection of design, engineering, and healthcare.
      </p>

      <div className="ide-doc-timeline">
        {/* Current */}
        <div className="ide-doc-timeline-item current">
          <div className="ide-doc-timeline-period">{data.currentRole.period}</div>
          <div className="ide-doc-timeline-company">{data.currentRole.company}</div>
          <div className="ide-doc-timeline-role">{data.currentRole.title}</div>
        </div>

        {data.pastWork.map((job) => (
          <div key={job.company} className="ide-doc-timeline-item">
            <div className="ide-doc-timeline-period">{job.period}</div>
            <div className="ide-doc-timeline-company">{job.company}</div>
            <div className="ide-doc-timeline-role">{job.title}</div>
            {job.description && (
              <div className="ide-doc-timeline-desc">{job.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectContent({
  project,
  onOpenMedia,
}: {
  project: Project | null;
  onOpenMedia: (p: Project) => void;
}) {
  if (!project) return <div className="ide-doc"><p>Project not found.</p></div>;

  return (
    <div className="ide-doc">
      <h1 className="ide-doc-h1">{project.name}</h1>
      <p className="ide-doc-lead">{project.subtitle}</p>

      {project.detail?.media && (
        <button
          className="ide-doc-media-btn"
          onClick={() => onOpenMedia(project)}
        >
          <span>▶</span>
          <span>View {project.detail.media!.filename}</span>
        </button>
      )}

      {project.detail && (
        <>
          <div className="ide-doc-section">
            <h2 className="ide-doc-h2">Problem</h2>
            <p className="ide-doc-body">{project.detail.problem}</p>
          </div>

          {project.detail.hardPart && (
            <div className="ide-doc-section">
              <h2 className="ide-doc-h2">What made it hard</h2>
              <p className="ide-doc-body">{project.detail.hardPart}</p>
            </div>
          )}

          <div className="ide-doc-section">
            <h2 className="ide-doc-h2">My role</h2>
            <p className="ide-doc-body">{project.detail.role}</p>
          </div>

          <div className="ide-doc-section">
            <h2 className="ide-doc-h2">Outcome</h2>
            <p className="ide-doc-body">{project.detail.outcome}</p>
          </div>
        </>
      )}
    </div>
  );
}

function ContactContent({ data }: { data: PortfolioData }) {
  return (
    <div className="ide-doc">
      <h1 className="ide-doc-h1">Contact</h1>
      <p className="ide-doc-lead">Get in touch with Angela.</p>

      <div className="ide-doc-section">
        <div className="ide-doc-links">
          {data.socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ide-doc-ext-link"
            >
              <span>↗</span>
              <span>{link.label}</span>
              <span className="ide-doc-link-url">{link.url}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
