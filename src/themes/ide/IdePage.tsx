"use client";

import { useState } from "react";
import { PortfolioData, portfolioData } from "@/content/portfolio";
import { useTheme } from "@/themes/ThemeProvider";
import { FileTree, FileNode } from "./components/FileTree";
import { ContentPanel } from "./components/ContentPanel";
import { ChatPanel } from "./components/ChatPanel";
import "./ide.css";

// Build file tree from portfolio data
function buildFileTree(): FileNode[] {
  const projectNodes: FileNode[] = (portfolioData.currentRole.projects || []).map((p) => ({
    id: `project-${p.slug}`,
    name: `${p.slug}.md`,
    type: "file" as const,
    icon: "📄",
  }));

  return [
    {
      id: "about",
      name: "about.md",
      type: "file",
      icon: "👤",
    },
    {
      id: "work",
      name: "work.md",
      type: "file",
      icon: "💼",
    },
    {
      id: "projects-folder",
      name: "projects",
      type: "folder",
      icon: "📁",
      defaultOpen: true,
      children: projectNodes,
    },
    {
      id: "contact",
      name: "contact.md",
      type: "file",
      icon: "✉️",
    },
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
        <div className="ide-titlebar-left">
          <div className="ide-titlebar-dot" style={{ background: "#ff5f57" }} />
          <div className="ide-titlebar-dot" style={{ background: "#febc2e" }} />
          <div className="ide-titlebar-dot" style={{ background: "#28c840" }} />
        </div>
        <span className="ide-titlebar-title">angela-liu — portfolio</span>
        <div className="ide-titlebar-menu">
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
        </div>
      </div>

      {/* Activity bar */}
      <div className="ide-activitybar">
        <div className="ide-activitybar-icon active" title="Explorer">
          ◫
        </div>
        <div className="ide-activitybar-icon" title="Search">
          ⌕
        </div>
        <div className="ide-activitybar-icon" title="Extensions">
          ⊞
        </div>
      </div>

      {/* Main workspace */}
      <div className="ide-workspace">
        {/* Sidebar: file tree */}
        <div className="ide-sidebar">
          <FileTree
            nodes={FILE_TREE}
            activeId={activeId}
            onSelect={setActiveId}
          />
        </div>

        {/* Editor area: content */}
        <div className="ide-editor-area">
          <ContentPanel
            activeId={activeId}
            data={portfolioData}
            onNavigate={setActiveId}
          />
        </div>

        {/* Chat panel */}
        <div className="ide-chat-panel">
          <ChatPanel />
        </div>
      </div>

      {/* Status bar */}
      <div className="ide-statusbar">
        <div className="ide-statusbar-left">
          <span className="ide-statusbar-item">⎇ main</span>
          <span className="ide-statusbar-item">✓ TypeScript</span>
        </div>
        <div className="ide-statusbar-right">
          <span className="ide-statusbar-item" style={{ marginRight: 4 }}>Theme:</span>
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
