"use client";

import { useState } from "react";
import { PortfolioData, portfolioData } from "@/content/portfolio";
import { useTheme } from "@/themes/ThemeProvider";
import { FileTree, FileNode } from "./components/FileTree";
import { ContentPanel } from "./components/ContentPanel";
import { ChatPanel } from "./components/ChatPanel";
import "./ide.css";

function buildFileTree(): FileNode[] {
  const projectNodes: FileNode[] = (portfolioData.currentRole.projects || []).map((p) => ({
    id: `project-${p.slug}`,
    name: `${p.slug}.md`,
    type: "file" as const,
    icon: "·",
  }));

  return [
    { id: "about", name: "about.md", type: "file", icon: "·" },
    { id: "work", name: "work.md", type: "file", icon: "·" },
    {
      id: "projects-folder",
      name: "projects",
      type: "folder",
      defaultOpen: true,
      children: projectNodes,
    },
    { id: "contact", name: "contact.md", type: "file", icon: "·" },
  ];
}

const FILE_TREE = buildFileTree();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function IdePage({ data: _data }: { data: PortfolioData }) {
  const [activeId, setActiveId] = useState("about");
  const { availableThemes, activeTheme, setTheme } = useTheme();

  return (
    <div className="ide-theme">
      {/* Title bar */}
      <div className="ide-titlebar">
        <div className="ide-titlebar-dots">
          <div className="ide-titlebar-dot" style={{ background: "#ff5f57" }} />
          <div className="ide-titlebar-dot" style={{ background: "#febc2e" }} />
          <div className="ide-titlebar-dot" style={{ background: "#28c840" }} />
        </div>
        <span className="ide-titlebar-title">angela-liu — portfolio</span>
        <div className="ide-titlebar-menu">
          <span>File</span>
          <span>View</span>
        </div>
      </div>

      {/* Activity bar */}
      <div className="ide-activitybar">
        <div className="ide-activitybar-icon active" title="Explorer">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.5 3H7.707L6.354 1.646A.5.5 0 006 1.5H2.5A1.5 1.5 0 001 3v10a1.5 1.5 0 001.5 1.5h11A1.5 1.5 0 0015 13V4.5A1.5 1.5 0 0013.5 3zM2.5 2.5H5.79l1 1H2.5a.5.5 0 010-1zm11 11h-11a.5.5 0 01-.5-.5V5h11.5a.5.5 0 01.5.5V13a.5.5 0 01-.5.5z"/>
          </svg>
        </div>
        <div className="ide-activitybar-icon" title="Search">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398l3.85 3.85a1 1 0 001.415-1.415l-3.868-3.833zM12 6.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"/>
          </svg>
        </div>
        <div className="ide-activitybar-icon" title="Source Control">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.5 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM9.05 3.5a2.5 2.5 0 114.9 0H15a.5.5 0 010 1h-1.05a2.5 2.5 0 01-4.9 0H1a.5.5 0 010-1h8.05zM4.5 7a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM2.05 8.5a2.5 2.5 0 114.9 0H15a.5.5 0 010 1H6.95a2.5 2.5 0 01-4.9 0H1a.5.5 0 010-1h1.05z"/>
          </svg>
        </div>
      </div>

      {/* Main workspace */}
      <div className="ide-workspace">
        <div className="ide-sidebar">
          <FileTree nodes={FILE_TREE} activeId={activeId} onSelect={setActiveId} />
        </div>

        <div className="ide-editor-area">
          <ContentPanel activeId={activeId} data={portfolioData} onNavigate={setActiveId} />
        </div>

        <div className="ide-chat-panel">
          <ChatPanel />
        </div>
      </div>

      {/* Status bar */}
      <div className="ide-statusbar">
        <div className="ide-statusbar-left">
          <span className="ide-statusbar-item">⎇ main</span>
          <span className="ide-statusbar-sep">·</span>
          <span className="ide-statusbar-item">TypeScript</span>
        </div>
        <div className="ide-statusbar-right">
          <span className="ide-statusbar-item">Theme:</span>
          {availableThemes.map((t) => (
            <button
              key={t.id}
              className={`ide-statusbar-theme-btn ${t.id === activeTheme.id ? "active-theme" : ""}`}
              onClick={() => setTheme(t.id)}
              disabled={t.id === activeTheme.id}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
