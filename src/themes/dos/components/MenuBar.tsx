"use client";

interface MenuBarProps {
  onCommand: (command: string) => void;
  activeSection?: string;
}

const MENU_ITEMS = [
  { label: "About", command: "about" },
  { label: "Work", command: "work" },
  { label: "Projects", command: "projects" },
  { label: "Contact", command: "contact" },
  { label: "Help", command: "help" },
];

export function MenuBar({ onCommand, activeSection }: MenuBarProps) {
  return (
    <div className="dos-menu">
      {MENU_ITEMS.map((item) => (
        <button
          key={item.command}
          className={`dos-menu-item ${activeSection === item.command ? "active" : ""}`}
          onClick={() => onCommand(item.command)}
        >
          [{item.label}]
        </button>
      ))}
    </div>
  );
}
