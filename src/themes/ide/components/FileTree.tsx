"use client";

import { useState } from "react";

export type FileNode = {
  name: string;
  id: string;
  type: "file" | "folder";
  icon?: string;
  children?: FileNode[];
  defaultOpen?: boolean;
};

interface FileTreeProps {
  nodes: FileNode[];
  activeId: string;
  onSelect: (id: string) => void;
}

function FileTreeNode({
  node,
  depth,
  activeId,
  onSelect,
}: {
  node: FileNode;
  depth: number;
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(node.defaultOpen ?? false);

  if (node.type === "folder") {
    return (
      <div>
        <div
          className="ide-tree-row"
          style={{ paddingLeft: `${12 + depth * 12}px` }}
          onClick={() => setOpen(!open)}
        >
          <span className="ide-tree-arrow">{open ? "▾" : "▸"}</span>
          <span className="ide-tree-icon">{node.icon ?? "📁"}</span>
          <span className="ide-tree-label folder">{node.name}</span>
        </div>
        {open && node.children?.map((child) => (
          <FileTreeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            activeId={activeId}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`ide-tree-row ${activeId === node.id ? "active" : ""}`}
      style={{ paddingLeft: `${24 + depth * 12}px` }}
      onClick={() => onSelect(node.id)}
    >
      <span className="ide-tree-icon">{node.icon ?? "📄"}</span>
      <span className="ide-tree-label">{node.name}</span>
    </div>
  );
}

export function FileTree({ nodes, activeId, onSelect }: FileTreeProps) {
  return (
    <div className="ide-filetree">
      <div className="ide-filetree-title">ANGELA LIU</div>
      {nodes.map((node) => (
        <FileTreeNode
          key={node.id}
          node={node}
          depth={0}
          activeId={activeId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
