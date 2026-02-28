import { PortfolioData, Project } from "@/content/portfolio";

export interface TerminalLine {
  id: string;
  content: string;
  type: "output" | "command" | "header" | "link" | "divider" | "subheader" | "media";
  url?: string;
  action?: string;
  media?: { type: "image" | "video" | "youtube"; src: string; filename: string };
}

export const CLEAR_SIGNAL = "__CLEAR__";

let lineCounter = 0;
function line(
  content: string,
  type: TerminalLine["type"] = "output",
  urlOrAction?: string,
  isAction?: boolean
): TerminalLine {
  return {
    id: `line-${lineCounter++}-${Date.now()}`,
    content,
    type,
    url: isAction ? undefined : urlOrAction,
    action: isAction ? urlOrAction : undefined,
  };
}

function divider(): TerminalLine {
  return line("═".repeat(60), "divider");
}

function formatProjectDetail(project: Project): TerminalLine[] {
  const lines: TerminalLine[] = [
    line(project.name.toUpperCase(), "header"),
    line(project.subtitle, "subheader"),
    divider(),
    line(""),
  ];

  // Add media button if project has media
  if (project.detail?.media) {
    const m = project.detail.media;
    const mediaLine: TerminalLine = {
      id: `line-${lineCounter++}-${Date.now()}`,
      content: `  ► VIEW ${m.filename}`,
      type: "media",
      media: { type: m.type, src: m.src, filename: m.filename },
    };
    lines.push(mediaLine);
    lines.push(line(""));
  }

  if (project.detail) {
    const d = project.detail;

    lines.push(line("PROBLEM", "subheader"));
    lines.push(line(""));
    // Wrap text at ~70 chars
    for (const paragraph of d.problem.split("\n")) {
      wrapText(paragraph, 70).forEach((l) => lines.push(line(`  ${l}`)));
      lines.push(line(""));
    }

    if (d.hardPart) {
      lines.push(line("WHAT MADE IT HARD", "subheader"));
      lines.push(line(""));
      wrapText(d.hardPart, 70).forEach((l) => lines.push(line(`  ${l}`)));
      lines.push(line(""));
    }

    lines.push(line("MY ROLE", "subheader"));
    lines.push(line(""));
    wrapText(d.role, 70).forEach((l) => lines.push(line(`  ${l}`)));
    lines.push(line(""));

    lines.push(line("OUTCOME", "subheader"));
    lines.push(line(""));
    wrapText(d.outcome, 70).forEach((l) => lines.push(line(`  ${l}`)));
    lines.push(line(""));
  }

  lines.push(divider());
  lines.push(line("  Type PROJECTS to go back.", "output"));
  lines.push(line(""));

  return lines;
}

function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (current.length + word.length + 1 > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export interface CommandDef {
  description: string;
  handler: (data: PortfolioData) => TerminalLine[] | typeof CLEAR_SIGNAL;
}

export const commands: Record<string, CommandDef> = {
  help: {
    description: "Show available commands",
    handler: () => [
      line("AVAILABLE COMMANDS", "header"),
      divider(),
      line("  HELP        Show this help message"),
      line("  ABOUT       Display bio and current role"),
      line("  WORK        Show work experience"),
      line("  PROJECTS    Show notable projects at Flexpa"),
      line("  CONTACT     Show contact information"),
      line("  DIR         List all sections"),
      line("  CLS         Clear screen"),
      line("  VER         Show version"),
      line("  THEME       List available themes"),
      line(""),
      line("  Project detail commands:"),
      line("  CONSENT     Consent 2.0 case study"),
      line("  PORTAL      Flexpa Portal Agent case study"),
      line("  COMMERCIAL  Commercial Claims Access case study"),
      line("  UAB         User Access Brand Bundles case study"),
      line(""),
      line("  Click menu items above or type a command below."),
    ],
  },

  about: {
    description: "Display bio",
    handler: (data) => [
      line("ABOUT", "header"),
      divider(),
      line(""),
      line(`  ${data.name}`),
      line(`  ${data.bio}`),
      line(""),
      line(`  Current: ${data.currentRole.title}`),
      line(`  at ${data.currentRole.company} (${data.currentRole.period})`),
      line(""),
      ...wrapText(data.currentRole.description || "", 70).map((l) =>
        line(`  ${l}`)
      ),
      line(""),
    ],
  },

  work: {
    description: "Show work experience",
    handler: (data) => {
      const lines: TerminalLine[] = [
        line("WORK EXPERIENCE", "header"),
        divider(),
        line(""),
      ];

      // Current role
      lines.push(
        line(`  ► ${data.currentRole.company} — ${data.currentRole.title}`)
      );
      lines.push(line(`    ${data.currentRole.period}`));
      if (data.currentRole.description) {
        wrapText(data.currentRole.description, 66).forEach((l) =>
          lines.push(line(`    ${l}`))
        );
      }
      lines.push(line(""));

      // Past work
      for (const job of data.pastWork) {
        lines.push(line(`  ► ${job.company} — ${job.title}`));
        lines.push(line(`    ${job.period}`));
        if (job.description) {
          wrapText(job.description, 66).forEach((l) =>
            lines.push(line(`    ${l}`))
          );
        }
        lines.push(line(""));
      }

      return lines;
    },
  },

  projects: {
    description: "Show notable projects",
    handler: (data) => {
      const lines: TerminalLine[] = [
        line("NOTABLE PROJECTS @ FLEXPA", "header"),
        divider(),
        line(""),
      ];

      const projects = data.currentRole.projects || [];
      for (const p of projects) {
        lines.push(
          line(`  ■ ${p.name}`, "link", p.slug, true)
        );
        lines.push(line(`    ${p.description}`));
        lines.push(line(""));
      }

      lines.push(
        line(
          "  Type a project command (e.g. CONSENT, PORTAL) to view details."
        )
      );
      lines.push(line(""));

      return lines;
    },
  },

  contact: {
    description: "Show contact info",
    handler: (data) => {
      const lines: TerminalLine[] = [
        line("CONTACT", "header"),
        divider(),
        line(""),
      ];

      for (const link of data.socialLinks) {
        lines.push(line(`  → ${link.label}`, "link", link.url));
      }

      lines.push(line(""));
      return lines;
    },
  },

  dir: {
    description: "List sections",
    handler: (data) => {
      const lines: TerminalLine[] = [
        line(" Volume in drive C is PORTFOLIO"),
        line(" Directory of C:\\PORTFOLIO\\"),
        line(""),
        line("  ABOUT       .TXT    Bio and current role"),
        line("  WORK        .TXT    Work experience"),
        line("  PROJECTS    .TXT    Notable projects"),
        line("  CONTACT     .TXT    Social links"),
        line(""),
        line(" Directory of C:\\PORTFOLIO\\PROJECTS\\"),
        line(""),
      ];

      const projects = data.currentRole.projects || [];
      for (const p of projects) {
        const slug = p.slug.toUpperCase().padEnd(12);
        lines.push(line(`  ${slug}.TXT    ${p.name}`));
      }

      lines.push(line(`         ${4 + projects.length} file(s)`));
      lines.push(line(""));

      return lines;
    },
  },

  cls: {
    description: "Clear screen",
    handler: () => CLEAR_SIGNAL,
  },

  ver: {
    description: "Show version",
    handler: () => [
      line(""),
      line("  ANGELA LIU DESIGN PORTFOLIO v2.0"),
      line("  (C) 2026 Angela C. Liu"),
      line(""),
    ],
  },

  theme: {
    description: "List available themes",
    handler: () => [
      line("AVAILABLE THEMES", "header"),
      divider(),
      line(""),
      line("  [1] DOS          ← current"),
      line("  [2] Coming soon..."),
      line(""),
      line("  Use the theme switcher in the status bar."),
      line(""),
    ],
  },
};

// Register project slug commands dynamically
function registerProjectCommands() {
  // These will be resolved at parse time with actual data
}

export function parseCommand(
  input: string,
  data: PortfolioData
): TerminalLine[] | typeof CLEAR_SIGNAL {
  const trimmed = input.trim().toLowerCase();

  if (!trimmed) return [];

  // Check static commands first
  const cmd = commands[trimmed];
  if (cmd) {
    return cmd.handler(data);
  }

  // Check project slugs
  const projects = data.currentRole.projects || [];
  const project = projects.find((p) => p.slug === trimmed);
  if (project) {
    return formatProjectDetail(project);
  }

  return [
    line(`Bad command or file name: '${input.trim()}'`),
    line("Type HELP for available commands."),
    line(""),
  ];
}
