/* =====================================================================
 * SE Report & SRS — AI-Powered Smart Study Planner & Syllabus Breakdown Tool
 * Recipe: R1 (Pure Paragraph Left) + DM-1 Deep Cyan palette (AI/tech)
 * Profile A (Formal, English) — Times New Roman, pure black body
 * 3 sections: Cover (no page #) / Front matter (Roman) / Body (Arabic)
 * =================================================================== */
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, PageBreak, Header, Footer, PageNumber, NumberFormat,
  AlignmentType, HeadingLevel, WidthType, BorderStyle, ShadingType,
  SectionType, LevelFormat, TableOfContents, TableLayoutType,
} = require("docx");
const fs = require("fs");

/* ── Palette (DM-1 Deep Cyan cover + derived body tokens) ── */
const P = {
  cover: {
    bg: "162235", titleColor: "FFFFFF", subtitleColor: "B0B8C0",
    metaColor: "90989F", footerColor: "687078", accent: "37DCF2",
  },
  body: {
    primary: "0F3B44",      // headings — dark teal
    text: "000000",         // Profile A pure black
    secondary: "606060",
    accent: "1B6B7A",       // table header bg / rules (darkened DM-1)
    innerLine: "C8DDE2",
    surface: "EDF3F5",
  },
};
const FONT = { ascii: "Times New Roman", eastAsia: "Times New Roman" };
const MONO = { ascii: "Courier New", eastAsia: "Courier New" };

const noBorders = {
  top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
};
const allNoBorders = {
  ...noBorders,
  insideHorizontal: { style: BorderStyle.NONE },
  insideVertical: { style: BorderStyle.NONE },
};

function safeText(v, ph) {
  if (v === undefined || v === null || v === "" || String(v) === "NaN" || String(v) === "undefined") {
    return ph || "[to be completed]";
  }
  return String(v);
}

/* ═══════════════ Cover layout engine (per design-system.md) ═══════════════ */
function splitTitleLines(title, charsPerLine) {
  if (title.length <= charsPerLine) return [title];
  const breakAfter = new Set([...",.;:!?", ..."-_/", ..." \t"]);
  const lines = [];
  let remaining = title;
  while (remaining.length > charsPerLine) {
    let breakAt = -1;
    for (let i = charsPerLine; i >= Math.floor(charsPerLine * 0.6); i--) {
      if (i < remaining.length && breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
    }
    if (breakAt === -1) {
      const limit = Math.min(remaining.length, Math.ceil(charsPerLine * 1.3));
      for (let i = charsPerLine + 1; i < limit; i++) {
        if (breakAfter.has(remaining[i - 1])) { breakAt = i; break; }
      }
    }
    if (breakAt === -1) breakAt = charsPerLine;
    lines.push(remaining.slice(0, breakAt).trim());
    remaining = remaining.slice(breakAt).trim();
  }
  if (remaining) lines.push(remaining);
  if (lines.length > 1 && lines[lines.length - 1].length <= 2) {
    const last = lines.pop();
    lines[lines.length - 1] += last;
  }
  return lines;
}

function calcTitleLayout(title, maxWidthTwips, preferredPt = 40, minPt = 24) {
  const charWidth = (pt) => pt * 11; // English chars ~0.55x CJK width
  const charsPerLine = (pt) => Math.floor(maxWidthTwips / charWidth(pt));
  let titlePt = preferredPt;
  let lines;
  while (titlePt >= minPt) {
    const cpl = charsPerLine(titlePt);
    if (cpl < 2) { titlePt -= 2; continue; }
    lines = splitTitleLines(title, cpl);
    if (lines.length <= 3) break;
    titlePt -= 2;
  }
  if (!lines || lines.length > 3) {
    const cpl = charsPerLine(minPt);
    lines = splitTitleLines(title, cpl);
    titlePt = minPt;
  }
  return { titlePt, titleLines: lines };
}

function calcCoverSpacing(params) {
  const {
    titleLineCount = 1, titlePt = 36, hasSubtitle = false,
    hasEnglishLabel = false, metaLineCount = 0,
    fixedHeight = 800, pageHeight = 16838, marginTop = 0, marginBottom = 0,
  } = params;
  const SAFETY = 1200;
  const usableHeight = pageHeight - marginTop - marginBottom - SAFETY;
  const titleHeight = titleLineCount * (titlePt * 23 + 200);
  const subtitleHeight = hasSubtitle ? (12 * 23 + 600) : 0;
  const englishLabelHeight = hasEnglishLabel ? (9 * 23 + 600) : 0;
  const metaHeight = metaLineCount * (10 * 23 + 100);
  const implicitParaHeight = 3 * 300;
  const contentHeight = titleHeight + subtitleHeight + englishLabelHeight +
    metaHeight + fixedHeight + implicitParaHeight;
  const remainingSpace = usableHeight - contentHeight;
  const safeRemaining = Math.max(remainingSpace, 400);
  const FOOTER_MIN = 800;
  const rawTop = Math.floor(safeRemaining * 0.45);
  const rawBottom = Math.floor(safeRemaining * 0.45);
  const bottomSpacing = Math.max(rawBottom, FOOTER_MIN);
  const topSpacing = Math.max(rawTop - Math.max(0, FOOTER_MIN - rawBottom), 400);
  const midSpacing = Math.max(safeRemaining - topSpacing - bottomSpacing, 0);
  return { topSpacing, midSpacing, bottomSpacing };
}

function buildCoverR1(config) {
  const C = config.palette;
  const padL = 1200, padR = 800;
  const availableWidth = 11906 - padL - padR - 300;
  const { titlePt, titleLines } = calcTitleLayout(config.title, availableWidth, 40, 24);
  const titleSize = titlePt * 2;
  const spacing = calcCoverSpacing({
    titleLineCount: titleLines.length, titlePt,
    hasSubtitle: !!config.subtitle, hasEnglishLabel: !!config.englishLabel,
    metaLineCount: (config.metaLines || []).length,
    fixedHeight: 400,
  });
  const accentLeft = { style: BorderStyle.SINGLE, size: 8, color: C.accent, space: 12 };
  const children = [];

  children.push(new Paragraph({ spacing: { before: spacing.topSpacing } }));

  if (config.englishLabel) {
    children.push(new Paragraph({
      indent: { left: padL, right: padR }, spacing: { after: 500 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.accent, space: 8 } },
      children: [new TextRun({
        text: config.englishLabel.split("").join("  "),
        size: 18, color: C.accent, font: { ascii: "Arial", eastAsia: "Arial" }, characterSpacing: 40,
      })],
    }));
  }

  for (let i = 0; i < titleLines.length; i++) {
    children.push(new Paragraph({
      indent: { left: padL },
      spacing: { after: i < titleLines.length - 1 ? 100 : 300, line: Math.ceil(titlePt * 23), lineRule: "atLeast" },
      children: [new TextRun({
        text: titleLines[i], size: titleSize, bold: true,
        color: C.titleColor, font: { ascii: "Arial", eastAsia: "Arial" },
      })],
    }));
  }

  if (config.subtitle) {
    children.push(new Paragraph({
      indent: { left: padL, right: padR }, spacing: { after: 800 },
      children: [new TextRun({
        text: config.subtitle, size: 24, color: C.subtitleColor,
        font: { ascii: "Arial", eastAsia: "Arial" },
      })],
    }));
  }

  for (const line of (config.metaLines || [])) {
    children.push(new Paragraph({
      indent: { left: padL + 200, right: padR }, spacing: { after: 80 },
      border: { left: accentLeft },
      children: [new TextRun({
        text: safeText(line), size: 24, color: C.metaColor,
        font: { ascii: "Arial", eastAsia: "Arial" },
      })],
    }));
  }

  children.push(new Paragraph({ spacing: { before: spacing.bottomSpacing } }));

  children.push(new Paragraph({
    indent: { left: padL, right: padR },
    border: { top: { style: BorderStyle.SINGLE, size: 2, color: C.accent, space: 8 } },
    spacing: { before: 200 },
    children: [
      new TextRun({ text: config.footerLeft || "", size: 16, color: C.footerColor, font: { ascii: "Arial" } }),
      new TextRun({ text: "                                        " }),
      new TextRun({ text: config.footerRight || "", size: 16, color: C.footerColor, font: { ascii: "Arial" } }),
    ],
  }));

  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: C.bg }, borders: noBorders,
        children,
      })],
    })],
  })];
}

/* ═══════════════ Body component builders ═══════════════ */
function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 360, after: 200, line: 312 },
    children: [new TextRun({ text, bold: true, size: 32, color: P.body.primary, font: FONT })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140, line: 312 },
    children: [new TextRun({ text, bold: true, size: 28, color: P.body.primary, font: FONT })],
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 220, after: 110, line: 312 },
    children: [new TextRun({ text, bold: true, size: 24, color: P.body.primary, font: FONT })],
  });
}
function body(text, opts = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 312, after: 120 },
    children: [new TextRun({ text, size: 24, color: P.body.text, font: FONT, ...opts })],
  });
}
/* body paragraph from mixed runs (for bold fragments / superscripts) */
function bodyRuns(runs) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 312, after: 120 },
    children: runs.map(r => new TextRun({ size: 24, color: P.body.text, font: FONT, ...r })),
  });
}
function numItem(reference, text, boldLead) {
  const runs = [];
  if (boldLead) {
    runs.push(new TextRun({ text: boldLead, bold: true, size: 24, color: P.body.text, font: FONT }));
    runs.push(new TextRun({ text: " " + text, size: 24, color: P.body.text, font: FONT }));
  } else {
    runs.push(new TextRun({ text, size: 24, color: P.body.text, font: FONT }));
  }
  return new Paragraph({
    numbering: { reference, level: 0 },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 312, after: 80 },
    children: runs,
  });
}
function caption(text) {
  return new Paragraph({
    keepNext: true,
    alignment: AlignmentType.LEFT,
    spacing: { before: 160, after: 80, line: 312 },
    children: [new TextRun({ text, bold: true, size: 21, color: P.body.primary, font: FONT })],
  });
}
function figCaption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 160, line: 312 },
    children: [new TextRun({ text, size: 21, color: P.body.secondary, font: FONT })],
  });
}

/* Horizontal-Only table (business default) with DM-1 derived tokens */
function makeTable(headers, rows, widths, opts = {}) {
  const headerRow = new TableRow({
    tableHeader: true, cantSplit: true,
    children: headers.map((text, i) => new TableCell({
      children: [new Paragraph({
        spacing: { line: 276 },
        children: [new TextRun({ text, bold: true, size: 21, color: "FFFFFF", font: FONT })],
      })],
      shading: { type: ShadingType.CLEAR, fill: P.body.accent },
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
      width: { size: widths[i], type: WidthType.PERCENTAGE },
    })),
  });
  const dataRows = rows.map((cells, ri) => new TableRow({
    cantSplit: true,
    children: cells.map((cell, i) => {
      const isMono = opts.monoCols && opts.monoCols.includes(i);
      const cellRuns = Array.isArray(cell) ? cell : [{
        text: safeText(cell, "-"), size: isMono ? 19 : 21,
        color: P.body.text, font: isMono ? MONO : FONT,
      }];
      return new TableCell({
        children: [new Paragraph({
          spacing: { line: 276 },
          alignment: (opts.centerCols && opts.centerCols.includes(i)) ? AlignmentType.CENTER : AlignmentType.LEFT,
          children: cellRuns.map(r => new TextRun({ size: 21, color: P.body.text, font: FONT, ...r })),
        })],
        shading: opts.zebra && ri % 2 === 1
          ? { type: ShadingType.CLEAR, fill: P.body.surface }
          : undefined,
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        width: { size: widths[i], type: WidthType.PERCENTAGE },
      });
    }),
  }));
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2, color: P.body.accent },
      bottom: { style: BorderStyle.SINGLE, size: 2, color: P.body.accent },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: P.body.innerLine },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [headerRow, ...dataRows],
  });
}

/* Shaded formula / code block (single-cell surface table) */
function block(lines, mono = false) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: allNoBorders,
    rows: [new TableRow({
      cantSplit: true,
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: P.body.surface },
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        width: { size: 100, type: WidthType.PERCENTAGE },
        children: lines.map(line => new Paragraph({
          spacing: { line: mono ? 260 : 300, after: 40 },
          children: [new TextRun({
            text: line, size: mono ? 19 : 22,
            color: P.body.text, font: mono ? MONO : FONT,
          })],
        })),
      })],
    })],
  });
}

/* PNG dimensions (manual IHDR parse — no external dependency) */
function pngSize(buf) {
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}
function chartImage(path, displayWidth) {
  const buf = fs.readFileSync(path);
  const dims = pngSize(buf);
  const displayHeight = Math.round(displayWidth * (dims.height / dims.width));
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 160, after: 40 },
    children: [new ImageRun({
      data: buf, transformation: { width: displayWidth, height: displayHeight }, type: "png",
    })],
  });
}

function pageFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "808080", font: FONT })],
    })],
  });
}

const now = new Date();
const MONTHS = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];
const dateLabel = MONTHS[now.getMonth()] + " " + now.getFullYear();

/* ═══════════════════════════ CONTENT ═══════════════════════════ */

/* ── Front matter: TOC + Executive Summary ── */
const frontMatter = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 480, after: 360 },
    children: [new TextRun({ text: "Table of Contents", bold: true, size: 32, font: FONT, color: P.body.primary })],
  }),
  new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
  new Paragraph({
    spacing: { before: 200 },
    children: [new TextRun({
      text: "Note: This Table of Contents is generated via field codes. To ensure page number accuracy after editing, please right-click the TOC and select \"Update Field.\"",
      italics: true, size: 18, color: "888888", font: FONT,
    })],
  }),
  new Paragraph({ children: [new PageBreak()] }),

  h1("Executive Summary"),
  body("This document consolidates the complete software engineering analysis for the AI-Powered Smart Study Planner & Syllabus Breakdown Tool, a 5th-semester academic project implemented in Python 3.10+ with Streamlit, pandas, NumPy, and Plotly/Altair. The application converts a raw syllabus into a personalized, day-by-day study schedule by scoring topic complexity, adjusting estimates for student familiarity, and packing topics into daily sessions that respect available study hours and the examination date. It serves student developers, project guides, evaluators, and future maintainers."),
  body("The report first evaluates five standard Software Development Life Cycle (SDLC) models — Waterfall, Prototype, Incremental, Spiral, and Agile — and justifies the selection of Agile with an embedded prototyping technique, executed across seven two-week sprints. It then provides a full Software Requirements Specification (SRS) breakdown: seventeen functional requirements organized into seven architectural modules, and eight categories of quantified, verifiable non-functional requirements, including plan generation in under 3 seconds for up to 200 topics."),
  body("Using the Basic COCOMO model in Organic mode, the estimated effort for the 2,000 to 5,000 source-line-of-code (SLOC) project ranges from 4.97 to 13.00 person-months, with a development schedule of 4.61 to 6.63 months and an average team size of 1.08 to 1.96 persons. A planning baseline of 3.5 KLOC (8.94 person-months, 5.75 months) is recommended. For the confirmed 4-member team — one AI/ML Engineer, two Data Analysts, and one Python Developer — the report maps every module to a primary owner in a delegation matrix that matches each work package to the strongest background, defines a collaboration protocol, and closes with a step-by-step local environment setup and execution guide for the Streamlit application."),
];

/* ── Chapter 1 ── */
const ch1 = [
  h1("1. Project Overview and Engineering Objectives"),
  h2("1.1 Purpose and Problem Statement"),
  body("Students preparing for semester and competitive examinations routinely struggle to decide which chapters to study first, how much time each topic genuinely requires, and how to divide a large syllabus into realistic daily targets. A fixed timetable cannot account for differences in topic difficulty or for a student's existing knowledge, and it offers no recovery path when the examination date approaches faster than planned. The AI-Powered Smart Study Planner & Syllabus Breakdown Tool addresses this problem directly: students provide their subjects, examination date, daily available study hours, and familiarity with each topic, and the application estimates topic complexity, allocates preparation time, and generates a day-by-day study plan that adapts as progress is recorded."),
  h2("1.2 Scope, Technology Stack, and Constraints"),
  body("The system is a locally deployed, single-user desktop-class web application launched through Streamlit, with a deliberately lightweight dependency footprint: Python 3.10 or higher, Streamlit for the interface, pandas and NumPy for data processing, Plotly or Altair for visualization, and JSON/CSV files for persistence. It must run without a GPU on standard student hardware (dual-core processor, 4 GB RAM) across Windows 10/11, Linux, and macOS. The scope covers syllabus input through three channels (predefined library, custom builder, and CSV upload), complexity scoring, familiarity-based time estimation, automated scheduling, High-Yield Mode for short preparation windows, progress tracking, plan regeneration, and CSV export. Cloud synchronization, multi-user accounts, and mobile-native interfaces are explicitly out of scope for this semester."),
  h2("1.3 Report Objectives"),
  body("This report has five engineering objectives. First, it evaluates five standard SDLC models against the project profile and justifies the selected process model. Second, it decomposes the functional requirements into seven modules with measurable acceptance criteria. Third, it states the non-functional requirements as quantified, testable targets. Fourth, it applies the Basic COCOMO estimation model in Organic mode to derive effort, schedule, and team size, and reconciles the estimate with the confirmed four-member team composition. Fifth, it assigns concrete ownership through a role and task delegation matrix and provides the exact terminal commands required to initialize, build, and execute the application from scratch."),
];

/* ── Chapter 2: SDLC ── */
const sdlcRows = [
  ["Waterfall", "Strictly sequential phases; each stage frozen before the next begins",
    "Strong documentation and a simple narrative for evaluation, but complexity weights and the user interface will certainly change after first feedback; testing deferred to the end surfaces scheduling bugs late", "Rejected"],
  ["Prototype", "Build a quick working mock, collect user feedback, refine repeatedly",
    "Ideal for the Streamlit dashboard and Gantt visualization where look and feel drives acceptance, but as a standalone lifecycle it neglects architecture, validation, and documentation", "Adopted as a technique within Agile"],
  ["Incremental", "Develop, test, and integrate small independent modules in sequence",
    "Maps cleanly onto the seven module boundaries and each sprint ends with a runnable application, but does not by itself manage feedback loops or changing requirements", "Subsumed by Agile"],
  ["Spiral", "Risk-driven loops of planning, risk analysis, building, and evaluation",
    "Excellent for large, high-risk, safety-critical systems; formal per-loop risk analysis is disproportionate overhead for a low-risk, well-understood academic CRUD-plus-scheduling application", "Rejected (disproportionate)"],
  ["Agile", "Iterative and incremental sprints with continuous testing and evolving requirements",
    "Absorbs algorithm re-tuning, delivers working software every sprint, embeds the prototyping loop naturally, and suits a two-to-four person team using Streamlit", "Selected"],
];
const sprintRows = [
  ["Sprint 1", "Requirements freeze, repository setup, data model, skeleton application", "Project scaffolding; agreed JSON schema for topic and plan records; empty Streamlit app launches", "M2"],
  ["Sprint 2", "Syllabus input: predefined library, custom builder, CSV upload with validation (FR-01 to FR-03)", "Working input tab; malformed CSV files rejected with descriptive errors", "M3"],
  ["Sprint 3", "Complexity and priority engine (FR-06, FR-08)", "Weighted scores computed; Low/Medium/High classification unit-tested", "M1"],
  ["Sprint 4", "Familiarity-based time estimation and day-by-day scheduler (FR-07, FR-09)", "Valid timetable generated; daily-hour cap and examination-date constraints enforced", "M1"],
  ["Sprint 5", "High-Yield Mode, interactive dashboard, Gantt chart (FR-10 to FR-12)", "Overloaded plans trigger High-Yield triage; Plotly/Altair Gantt renders", "M1 and M4"],
  ["Sprint 6", "Progress tracking, regeneration, CSV export, persistence, reset (FR-13 to FR-17)", "Full end-to-end user journey; state survives application restart", "M2"],
  ["Sprint 7", "Integration testing (pytest), performance validation under 3 seconds, documentation", "All acceptance criteria pass; final report and user manual submitted", "M3"],
];
const ch2 = [
  h1("2. SDLC Evaluation and Model Selection"),
  h2("2.1 Evaluation Criteria and Project Profile"),
  body("The choice of a life cycle model must be driven by the project's defining characteristics rather than by habit. This project exhibits four decisive traits: its estimation heuristics (complexity weights, familiarity multipliers, High-Yield thresholds) require calibration against real syllabi and will therefore change during development; its seven modules are functionally independent and communicate through well-defined data structures; its acceptance depends on usability feedback from real students well before the submission deadline; and it is built by a small student team on Streamlit, a framework explicitly designed for rapid iteration. An adequate model must tolerate requirement evolution, support incremental delivery of a runnable product, and institutionalize early feedback."),
  h2("2.2 Comparative Analysis of Five SDLC Models"),
  body("Table 1 assesses each candidate model against the project profile. The assessment deliberately separates the lifecycle decision from the technique decision: prototyping and incrementality are valuable practices, but neither constitutes a complete process for a graded, documentation-heavy academic project."),
  caption("Table 1: SDLC model evaluation against the project profile"),
  makeTable(["Model", "Approach", "Fit for This Project", "Verdict"], sdlcRows, [12, 24, 48, 16]),
  h2("2.3 Justification for Selecting the Agile Model"),
  body("Agile is selected as the life cycle model, executed Scrum-style in seven sprints of approximately two weeks with an embedded throwaway user-interface prototype in Sprint 2 and incremental delivery after every sprint. The justification is sixfold:"),
  numItem("list-agile", "The complexity-score formula and the familiarity-to-time multipliers are estimation heuristics that will be recalibrated two to three times against real syllabi; Agile absorbs this volatility as normal, whereas Waterfall treats it as a failure of the requirements phase.", "Requirements volatility is guaranteed, not hypothetical."),
  numItem("list-agile", "The complexity engine, scheduler, and dashboard exchange data through stable record structures, so Sprint 3 (complexity) and Sprint 5 (dashboard) can be developed and unit-tested with pytest in near isolation and merged without conflict.", "Natural module independence enables parallel work."),
  numItem("list-agile", "Streamlit re-runs the script on every interaction and rewards a build-measure-learn rhythm; a big-bang waterfall build would discard the framework's core strength.", "The framework itself is built for iteration."),
  numItem("list-agile", "Usability is an explicit acceptance criterion (NFR-02); sprint reviews with classmates and the guide produce concrete corrections, such as making High-Yield warnings more visible, while there is still time to react.", "Usability feedback is an acceptance criterion."),
  numItem("list-agile", "Regression-testing the scheduler at the end of every sprint prevents the classic academic failure mode of a demonstration that breaks days before submission.", "Continuous testing reduces end-of-term risk."),
  numItem("list-agile", "Spiral's formal risk quadrants and Waterfall's stage-gate documentation cost more than they return at 2 to 5 KLOC in a low-risk domain — the same reasoning that places the project in COCOMO's Organic mode in Chapter 5.", "The process is right-sized for the risk profile."),
  body("In short, Agile is the only evaluated model that simultaneously supports iterative requirement evolution, incremental module delivery, and continuous feedback, while incorporating prototyping and incrementality as sub-strategies rather than replacements for structure and documentation."),
  h2("2.4 Sprint Roadmap with Ownership"),
  body("Table 2 translates the model into an executable plan. Each sprint closes with a demonstrable exit criterion, and a named team member (M1 to M4, defined in Chapter 6) is accountable for that closure."),
  caption("Table 2: Seven-sprint roadmap with exit criteria and sprint leads"),
  makeTable(["Sprint", "Focus", "Exit Criterion", "Lead"], sprintRows, [10, 34, 44, 12], { centerCols: [3] }),
];

/* ── Chapter 3: Functional requirements ── */
const frA = [
  ["FR-01", "Predefined syllabus library: curated subject, chapter, and topic trees that populate the workspace in one click", "At least three predefined subjects are selectable; topics load without manual entry"],
  ["FR-02", "Custom syllabus builder: manual subject and chapter entry with full add, edit, and delete operations on topics", "Every CRUD operation reflects immediately in the topic list and persists across restart"],
  ["FR-03", "CSV upload: parse and validate file format, columns, and required fields; read topic information; reject invalid or incomplete files", "A malformed CSV produces a descriptive error message; no partial import and no crash"],
  ["FR-04", "Student input management: examination date, daily available study hours, and per-topic familiarity, mathematical density, conceptual depth, historical difficulty, and importance ratings", "All inputs are capturable through sliders and dropdowns; ratings default safely when omitted"],
  ["FR-05", "Input validation: dates must be in the future; study hours must be positive; ratings must fall within defined ranges; missing values are handled with documented defaults", "No invalid value reaches the computation engine; every rejection carries an actionable message"],
];
const frB = [
  ["FR-06", "Complexity score: weighted combination of mathematical density, conceptual depth, and historical difficulty; classification into Low, Medium, and High", "Identical inputs always produce identical scores and classes; thresholds are documented and centralized"],
  ["FR-07", "Familiarity-based time estimation: base preparation hours adjusted by a familiarity multiplier, granting more time to new topics and less to previously revised ones", "The estimate is monotonic: lower familiarity never reduces the estimated hours for the same topic"],
  ["FR-08", "Topic priority: combined score of importance, complexity, and estimated effort; ranked High, Medium, and Low", "Priority ordering is stable across regeneration and is explainable in the interface"],
  ["FR-09", "Automated scheduling: compute available days and hours, generate a day-by-day timetable, allocate topics by priority, respect the daily-hour cap, split large topics across days, and never schedule past the examination date", "Every allocated day is within the hour cap; no session exists after the examination date"],
  ["FR-10", "High-Yield Mode: when total estimated hours exceed total available hours, automatically prioritize important chapters, allocate hours by priority, flag shortened and dropped topics, and warn the user", "The trigger condition is mathematically correct; low-priority topics are truncated first; warnings are visible on the dashboard"],
];
const frC = [
  ["FR-11", "Interactive dashboard: subject, examination date, days remaining, estimated versus available hours, difficulty and priority per topic, and the daily schedule", "All eight metric groups are visible on one screen without navigation"],
  ["FR-12", "Gantt chart and timeline (Plotly or Altair) showing topic start dates, end dates, and durations", "The chart renders for any valid plan and supports hover inspection"],
  ["FR-13", "Progress tracking: mark topics completed or pending; compute overall progress; display progress bars and statistics", "Progress equals completed hours over total hours and updates immediately on interaction"],
  ["FR-14", "Schedule regeneration: re-plan remaining topics when study hours or the examination date change, honoring completion status", "Completed topics are never rescheduled; the remaining plan recomputes from the current date"],
  ["FR-15", "CSV export: study date, topic name, estimated hours, priority level, and completion status", "The exported file opens cleanly in Excel with all five columns populated"],
  ["FR-16", "Local persistence: save plans and progress to JSON/CSV and restore them when the application reopens", "Killing and relaunching the application preserves the plan and all progress"],
  ["FR-17", "Plan reset: clear the current plan and progress behind an explicit two-step confirmation", "Reset is impossible to trigger accidentally; progress is cleared only after confirmation"],
];
const ch3 = [
  h1("3. Functional Requirements Specification"),
  h2("3.1 Module Architecture Overview"),
  body("The seventeen functional requirements group into seven architectural modules that also define the code package structure: Syllabus Input and Validation (FR-01 to FR-05 upstream intake), the Intelligence Core comprising the Complexity Engine, Familiarity-Based Time Estimation, the Automated Scheduler, and High-Yield Mode (FR-06 to FR-10), and the Presentation and Output layer comprising the Dashboard with Gantt visualization, Progress Tracking, and CSV Export with local persistence (FR-11 to FR-17). This grouping is deliberate: each group maps to one team member's primary competence, which is exploited by the delegation matrix in Chapter 6. Data flows in one direction — intake produces validated topic records, the intelligence core annotates them with scores and a schedule, and the presentation layer renders and exports the result."),
  h2("3.2 Intake Subsystem: Syllabus Input, Student Inputs, and Validation"),
  caption("Table 3: Functional requirements FR-01 to FR-05 (intake subsystem)"),
  makeTable(["ID", "Requirement", "Acceptance Criterion"], frA, [9, 49, 42]),
  h2("3.3 Intelligence Core: Complexity, Estimation, Scheduling, High-Yield"),
  caption("Table 4: Functional requirements FR-06 to FR-10 (intelligence core)"),
  makeTable(["ID", "Requirement", "Acceptance Criterion"], frB, [9, 49, 42]),
  h2("3.4 Presentation and Output: Dashboard, Progress, Export, Persistence"),
  caption("Table 5: Functional requirements FR-11 to FR-17 (presentation and output)"),
  makeTable(["ID", "Requirement", "Acceptance Criterion"], frC, [9, 49, 42]),
  h2("3.5 Core Computational Formulas (Version 1 Baseline)"),
  body("The following formulas constitute the version 1 computational contract between the intake and presentation layers. All constants are centralized in a configuration module so that Sprint 3 calibration never requires touching engine code. The complexity score is a weighted sum on a 0-to-10 scale:"),
  block([
    "ComplexityScore = 0.35 x MathDensity + 0.40 x ConceptualDepth + 0.25 x HistoricalDifficulty",
    "Classification:  Low <= 3.9   |   Medium 4.0 - 6.9   |   High >= 7.0",
    "",
    "EstimatedHours(topic) = BaseHours(ComplexityClass) x FamiliarityMultiplier",
    "BaseHours:  Low -> 2 h   |   Medium -> 4 h   |   High -> 6 h",
    "Multipliers:  New x 1.50   |   SomewhatFamiliar x 1.15   |   Revised x 0.85   |   Confident x 0.60",
    "",
    "PriorityScore = 0.40 x Importance + 0.35 x ComplexityScore + 0.25 x NormalizedEffort",
    "",
    "High-Yield trigger:  SUM(EstimatedHours) > SUM(AvailableHours)",
    "Scheduler rule:      sort by PriorityScore desc -> pack day by day up to the daily-hour cap",
  ]),
  body("", { size: 8 }),
  body("Two invariants are absolute and protect the application's credibility at evaluation: the daily scheduled hours must never exceed the user's stated limit, and no study session may be scheduled after the examination date. Both are enforced inside the scheduler and verified by dedicated pytest cases independent of the user interface."),
];

/* ── Chapter 4: NFRs ── */
const nfrRows = [
  ["Performance", "Generate a complete plan in under 3 seconds for 200 topics; dashboard interactions respond in under 1 second; CSV import and export complete within 2 seconds for typical files", "Time with time.perf_counter() on a synthetic 200-topic syllabus; record results in the test report"],
  ["Usability", "No programming knowledge required; clear labels and instructions; every error states what went wrong and how to fix it; readable, labeled charts; simple tab navigation", "Task-based walkthrough with three to five students; structured feedback form"],
  ["Reliability", "Deterministic outputs (same inputs yield the same plan); all inputs validated; corrupted or missing persistence files fall back gracefully with a warning; daily-hour cap and examination-date bound are invariant", "Unit tests plus property checks on scheduler invariants"],
  ["Maintainability", "Modular packages (intake, engine, scheduler, storage, UI); UI strictly separated from computation; reusable functions with docstrings; all tuning constants centralized in one configuration module", "Code review; pytest coverage of engine modules that import no Streamlit code"],
  ["Portability", "Runs on Windows 10/11, Linux, and macOS from a standard Python 3.10+ virtual environment; no GPU; 4 GB RAM and dual-core minimum; browser-agnostic (Chrome, Edge, Firefox)", "Clean-venv installation and run on at least two operating system families"],
  ["Data Persistence and Security", "Local JSON/CSV storage only; uploaded CSV content validated for type and size and never executed; no unnecessary personal data collected; user-initiated reset available", "File-format checks on the CSV importer; manual storage inspection"],
  ["Accessibility", "Readable fonts and adequate contrast; chart legends and axis labels; difficulty never conveyed by color alone (icons or H/M/L text accompany color)", "Manual checklist during sprint reviews"],
  ["Scalability (Future)", "Architecture admits future enhancements such as cloud sync and learned difficulty estimation without a rewrite", "Design note: storage behind an interface; engine modules are pure functions"],
];
const ch4 = [
  h1("4. Non-Functional Requirements Specification"),
  body("Non-functional requirements are stated as measurable, verifiable targets rather than aspirations, because each of them must be demonstrated during evaluation. Table 6 assigns every category a concrete target and the method by which the team will prove compliance. The performance target deserves emphasis: plan generation in under 3 seconds for 200 topics is comfortably achievable with vectorized pandas and NumPy operations, since the scheduling algorithm is a single greedy pass over a sorted table rather than a combinatorial search."),
  caption("Table 6: Non-functional requirements with quantified targets and verification methods"),
  makeTable(["Category", "Requirement (Measurable Target)", "Verification Method"], nfrRows, [16, 48, 36]),
  body("The reliability constraints interact with the functional requirements in a way evaluators frequently probe: a corrupted JSON plan file must never crash the application but instead degrade to an empty plan with a visible warning, and a regenerated schedule must never silently violate the two scheduling invariants stated in Section 3.5. These behaviors are therefore specified here as acceptance-level requirements, not implementation details."),
];

/* ── Chapter 5: COCOMO ── */
const coSizeRows = [
  ["Small (lean build)", "2,000", "2.0"],
  ["Medium (realistic target)", "3,500", "3.5"],
  ["Large (full-featured)", "5,000", "5.0"],
];
const coCalcRows = [
  ["Small", "2.0", "E = 2.4 x 2.0^1.05 = 2.4 x 2.0705", "4.97", "TDEV = 2.5 x 4.97^0.38 = 2.5 x 1.8389", "4.61", "4.97 / 4.61 = 1.08"],
  ["Medium", "3.5", "E = 2.4 x 3.5^1.05 = 2.4 x 3.7253", "8.94", "TDEV = 2.5 x 8.94^0.38 = 2.5 x 2.2990", "5.75", "8.94 / 5.75 = 1.56"],
  ["Large", "5.0", "E = 2.4 x 5.0^1.05 = 2.4 x 5.4166", "13.00", "TDEV = 2.5 x 13.00^0.38 = 2.5 x 2.6504", "6.63", "13.00 / 6.63 = 1.96"],
];
const ch5 = [
  h1("5. COCOMO Estimation: Effort, Schedule, and Team Size"),
  h2("5.1 Model and Mode Selection"),
  body("The Basic COCOMO model, published by Barry Boehm, estimates development effort from the size of the software expressed in thousands of delivered source lines of code (KLOC). The Organic mode applies to small, familiar, in-house projects with experienced teams and minimal process constraints, and it is unambiguously the correct mode here: the domain is well understood, the technology stack is standard, the team is small, the application is a form-plus-algorithm-plus-chart system with no novel research risk, and the hardware requirements are trivial. The Organic mode coefficients are a = 2.4 and b = 1.05 for effort, and c = 2.5 and d = 0.38 for schedule."),
  h2("5.2 Formulas and Assumptions"),
  body("Three formulas govern the estimate. Effort is E = 2.4 x (KLOC)^1.05, expressed in person-months; development time is TDEV = 2.5 x (E)^0.38, expressed in months; and the average team size is E divided by TDEV. One person-month is taken as approximately 152 productive hours. The estimate spans analysis, design, coding, and integration testing; documentation effort is modest for an academic project and is absorbed within the total. No effort multipliers (EAF) are applied — that refinement belongs to Intermediate COCOMO and is unnecessary at this scale, where a ten percent estimation error is smaller than the natural variance of student availability during examination periods."),
  h2("5.3 Size Scenarios and Step-by-Step Calculation"),
  body("Because the final size depends on how many stretch features survive Sprint 6, three scenarios are computed: a lean build at 2.0 KLOC, a realistic baseline at 3.5 KLOC, and a full-featured build at 5.0 KLOC. Table 7 defines the scenarios and Table 8 shows every arithmetic step so the calculation is fully auditable during evaluation."),
  caption("Table 7: Project size scenarios"),
  makeTable(["Scenario", "SLOC", "KLOC"], coSizeRows, [50, 25, 25], { centerCols: [1, 2] }),
  caption("Table 8: Basic COCOMO Organic-mode calculations (a = 2.4, b = 1.05, c = 2.5, d = 0.38)"),
  makeTable(
    ["Scenario", "KLOC", "Effort Step", "E (PM)", "Schedule Step", "TDEV (mo)", "Team E/TDEV"],
    coCalcRows, [11, 7, 25, 9, 25, 10, 13], { centerCols: [1, 3, 5, 6] }
  ),
  h2("5.4 Consolidated Results"),
  body("Table 9 consolidates the results and Figure 1 visualizes the growth pattern. Effort grows super-linearly with size — the exponent 1.05 plus the schedule exponent 0.38 compound — which is the quantitative argument for protecting the lean scope: moving from 2.0 to 5.0 KLOC multiplies effort by 2.6 while adding only 2.0 months of calendar time, meaning the extra scope must be absorbed by more people or more parallelism that a four-person student team cannot always sustain."),
  caption("Table 9: Consolidated COCOMO results"),
  makeTable(
    ["Scenario", "KLOC", "Effort (person-months)", "Dev Time (months)", "Average Team"],
    [
      ["Small", "2.0", "4.97", "4.61", "1.08"],
      ["Medium (recommended planning baseline)", "3.5", "8.94", "5.75", "1.56"],
      ["Large", "5.0", "13.00", "6.63", "1.96"],
    ], [30, 12, 22, 20, 16], { centerCols: [1, 2, 3, 4] }
  ),
  chartImage("chart_cocomo.png", 500),
  figCaption("Figure 1: COCOMO effort and schedule across the three size scenarios (Organic mode)"),
  h2("5.5 Team Recommendation and Effort Distribution"),
  body("The Organic-mode arithmetic indicates an average team of 1.08 to 1.96 persons. Purely single-person development is nonetheless a poor fit for a semester deadline because it serializes all work; the recommended staffing is therefore a team of two to four, and the confirmed team of four members sits at the upper bound with the remaining schedule risk absorbed by parallel module ownership (Chapter 6). The development timeline of 4.61 to 6.63 months maps onto a standard semester project window, and planning to the Medium baseline of 3.5 KLOC and 8.94 person-months leaves the Small scenario as the guaranteed minimum deliverable and the Large scenario as a stretch goal admitted only after Sprint 6 is stable. Figure 2 shows the recommended internal distribution of the estimated effort."),
  chartImage("chart_effort.png", 380),
  figCaption("Figure 2: Recommended effort distribution across work categories (percent of total effort)"),
];

/* ── Chapter 6: Delegation matrix ── */
const matrixRows = [
  ["Syllabus Input and Validation (FR-01 to FR-05)", "S", "S", "P", "S"],
  ["Complexity Engine — scoring model (FR-06)", "P", "S", "S", "S"],
  ["Familiarity-Based Time Estimation (FR-07)", "P", "S", "S", "S"],
  ["Automated Day-by-Day Scheduler (FR-09)", "P", "S", "R", "S"],
  ["High-Yield Mode (FR-10)", "P", "S", "R", "S"],
  ["Dashboard, KPIs and Gantt Chart (FR-11, FR-12)", "R", "S", "S", "P"],
  ["Progress Tracking and Analytics (FR-13, FR-14)", "R", "S", "S", "P"],
  ["CSV Export and Local Persistence (FR-15 to FR-17)", "R", "P", "S", "R"],
  ["Application Scaffolding and Integration (app.py)", "S", "P", "S", "S"],
  ["Test Datasets, pytest Coordination and Validation", "S", "R", "P", "S"],
];
const charterRows = [
  ["M1 — AI/ML Engineer",
    "Model design, scoring, and optimization",
    "Complexity Engine; Time Estimation; Scheduler; High-Yield Mode; config.py constants",
    "core/complexity.py, core/estimator.py, core/scheduler.py, core/config.py; unit tests; calibrated weights and multipliers",
    "Sprints 3, 4, 5"],
  ["M2 — Python Developer",
    "Application engineering and integration",
    "app.py scaffolding; Streamlit session-state wiring; JSON persistence; CSV export; module integration",
    "app.py, storage layer, export pipeline, integration glue; release runs of streamlit run app.py",
    "Sprints 1, 6"],
  ["M3 — Data Analyst I",
    "Data ingestion, quality, and curation",
    "Syllabus Input module; CSV upload validation; predefined syllabus library; test datasets",
    "ui/input_forms.py, data/predefined/ library, CSV schema and validation rules, test datasets and pytest data fixtures",
    "Sprints 2, 7"],
  ["M4 — Data Analyst II",
    "Analytics and visualization",
    "Dashboard KPIs; Plotly/Altair Gantt; progress analytics; usability walkthroughs",
    "ui/dashboard.py, chart builders, progress statistics, usability feedback log",
    "Sprint 5 (co-lead with M1)"],
];
const ch6 = [
  h1("6. Role and Task Delegation Matrix (Four-Member Team)"),
  h2("6.1 Team Composition and Assignment Rationale"),
  body("The confirmed team comprises one AI/ML Engineer (M1), two Data Analysts (M3 and M4), and one Python Developer (M2). The delegation principle is to match each work package to the strongest background rather than to distribute work evenly by line count. The AI/ML Engineer owns the three modules that constitute the intelligence of the application — complexity scoring, familiarity-based estimation, and the scheduling and High-Yield optimization — because they are essentially heuristic model-building and constrained allocation problems. The two Data Analysts anchor the two ends of the data pipeline: Data Analyst I owns ingestion, validation, and curation (getting trustworthy data in), while Data Analyst II owns analytics and visualization (getting insight out). The Python Developer owns the application shell: scaffolding, Streamlit state management, the persistence layer, and the integration of every module into one coherent, restart-safe product."),
  h2("6.2 Module Ownership Matrix"),
  body("Table 10 is the authoritative assignment of responsibility using a P/S/R notation. P (Primary Owner) is accountable for delivery and quality of the package; S (Support) contributes implementation effort under the primary owner's direction; R (Reviewer) reviews the code and validates the acceptance criteria before a sprint is closed. Every package has exactly one P."),
  caption("Table 10: Module ownership matrix (P = Primary, S = Support, R = Reviewer)"),
  makeTable(
    ["Work Package", "M1 AI/ML Eng.", "M2 Python Dev", "M3 Data Analyst I", "M4 Data Analyst II"],
    matrixRows, [40, 15, 15, 15, 15], { centerCols: [1, 2, 3, 4] }
  ),
  h2("6.3 Member Role Charters"),
  body("Table 11 expands each member's charter into concrete artifacts, which double as the evaluation-ready definition of individual contribution for the project viva."),
  caption("Table 11: Member role charters with deliverables and sprint leadership"),
  makeTable(
    ["Member", "Competence Focus", "Primary Modules", "Key Deliverables", "Sprint Lead"],
    charterRows, [16, 17, 24, 30, 13]
  ),
  h2("6.4 Collaboration and Integration Protocol"),
  body("Four working agreements keep the matrix effective. First, all tuning constants (complexity weights, familiarity multipliers, base-hour tables, classification thresholds) live exclusively in core/config.py, which eliminates the most common merge conflict in algorithm projects and gives Sprint 3 calibration a single surface. Second, the team uses Git feature branches with pull requests reviewed by the primary owner of the adjacent package, so the scheduler author reviews intake changes that affect scheduling inputs. Third, pytest runs on every push, and no sprint closes with a failing invariant test — particularly the daily-hour cap and examination-date bounds. Fourth, a weekly sprint review with the project guide doubles as the Agile feedback loop demanded by the SDLC decision in Chapter 2, and its outcomes are logged as backlog items with named owners."),
];

/* ── Chapter 7: Setup guide ── */
const setupRows = [
  ["1", "Verify Python 3.10+", "python --version", "python3 --version", "Confirm the interpreter meets the minimum version"],
  ["2", "Create the project folder", "cd Documents, then mkdir smart-study-planner, then cd smart-study-planner", "cd ~, then mkdir smart-study-planner, then cd smart-study-planner", "Isolate the project in its own directory"],
  ["3", "Create a virtual environment", "python -m venv venv", "python3 -m venv venv", "Keep dependencies isolated from the system Python"],
  ["4", "Activate the environment", "venv\\Scripts\\activate (PowerShell: .\\venv\\Scripts\\Activate.ps1)", "source venv/bin/activate", "The prompt gains a (venv) prefix when active"],
  ["5", "Install dependencies", "pip install streamlit pandas numpy plotly pytest", "pip install streamlit pandas numpy plotly pytest", "Installs all runtime and test packages"],
  ["6", "Create the folder structure", "mkdir core, ui, data, tests", "mkdir -p core ui data tests", "Creates the module packages from Section 3.1"],
  ["7", "Create entry files", "New-Item app.py, requirements.txt; add empty __init__.py in core, ui, tests", "touch app.py requirements.txt core/__init__.py ui/__init__.py tests/__init__.py", "Prepares the minimum file skeleton"],
  ["8", "Initialize version control (optional but recommended)", "git init", "git init", "Enables the branching protocol from Section 6.4"],
  ["9", "Open the editor", "code .", "code .", "Opens the project in Visual Studio Code"],
  ["10", "Launch the application", "streamlit run app.py", "streamlit run app.py", "Starts the local server and opens the browser UI"],
  ["11", "Freeze dependencies (after installs)", "pip freeze > requirements.txt", "pip freeze > requirements.txt", "Makes the environment reproducible for teammates and evaluators"],
];
const structureLines = [
  "smart-study-planner/",
  "|-- app.py                  # Streamlit entry point and page router",
  "|-- requirements.txt        # Frozen dependencies",
  "|-- core/",
  "|   |-- config.py           # ALL tuning constants (weights, multipliers, thresholds)",
  "|   |-- complexity.py       # Complexity score and priority engine",
  "|   |-- estimator.py        # Familiarity-based time estimation",
  "|   |-- scheduler.py        # Day-by-day scheduling + High-Yield Mode",
  "|-- ui/",
  "|   |-- input_forms.py      # Predefined / custom / CSV syllabus input",
  "|   |-- dashboard.py        # KPIs, Gantt chart, progress tracking",
  "|-- data/",
  "|   |-- predefined/         # Built-in syllabus library (JSON)",
  "|   |-- plans/              # Saved plans and progress (JSON/CSV)",
  "|-- tests/",
  "    |-- test_scheduler.py    # Invariant tests: hour cap, exam-date bound",
];
const ch7 = [
  h1("7. Development Environment Setup and Execution Guide"),
  h2("7.1 Prerequisites"),
  body("Before starting, confirm that Python 3.10 or newer is installed and reachable from the terminal, that Visual Studio Code (or any preferred editor) is available, and that a modern browser (Chrome, Edge, or Firefox) is present; Streamlit serves its interface through the browser automatically. Internet access is required only for the initial package installation. No GPU and no database server are needed at any point — the persistence layer is file-based by design (NFR: Data Persistence and Security)."),
  h2("7.2 Step-by-Step Terminal Commands"),
  body("Table 12 provides the exact command sequence for Windows PowerShell and for macOS/Linux terminals. Execute the rows in order from the terminal; each command's purpose is stated so the sequence can be adapted safely. On Windows, if script activation is blocked by the execution policy, run PowerShell as Administrator once and execute Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser, then retry the activation command."),
  caption("Table 12: Environment setup and launch commands (Windows PowerShell and macOS/Linux)"),
  makeTable(
    ["#", "Step", "Windows (PowerShell)", "macOS / Linux", "Purpose"],
    setupRows, [4, 16, 28, 26, 26], { centerCols: [0] }
  ),
  h2("7.3 Recommended Project Structure"),
  body("Create the following layout inside the project folder. It mirrors the module architecture of Section 3.1 and the ownership boundaries of Chapter 6, so each team member's files are physically separated and merge conflicts are minimized. The structure is deliberately shallow — two package levels at most — to keep import paths simple for a 2 to 5 KLOC codebase."),
  block(structureLines, true),
  body("", { size: 8 }),
  h2("7.4 Running and Verifying the Application"),
  body("With the virtual environment active, execute streamlit run app.py from the project root. Streamlit starts a local web server (by default http://localhost:8501) and opens the default browser automatically; the terminal shows the server log and remains in the foreground while the application runs. Verify the skeleton by confirming that the browser renders the application title without errors, then stop the server with Ctrl+C. Every subsequent sprint closes with the same command: the application must launch cleanly from a fresh terminal before a sprint review is scheduled."),
];

/* ── Chapter 8: Acceptance criteria & conclusions ── */
const ch8 = [
  h1("8. Acceptance Criteria and Conclusions"),
  h2("8.1 Acceptance Criteria Checklist"),
  body("The project is complete when all eighteen criteria below pass. They are verbatim from the SRS acceptance register and are used as the definition of done for Sprint 7."),
  numItem("list-accept", "Application starts successfully with streamlit run app.py."),
  numItem("list-accept", "Predefined subjects are available and load correctly."),
  numItem("list-accept", "Custom syllabus input works, including add, edit, and delete of topics."),
  numItem("list-accept", "CSV upload works correctly and rejects invalid or incomplete files."),
  numItem("list-accept", "Input validation functions properly for dates, hours, and rating ranges."),
  numItem("list-accept", "Complexity scores are calculated and classified Low, Medium, or High."),
  numItem("list-accept", "Familiarity-based time estimation adjusts hours in the correct direction and magnitude."),
  numItem("list-accept", "Topic priority scores are generated and ordered sensibly."),
  numItem("list-accept", "Day-by-day study schedules are created and displayed."),
  numItem("list-accept", "Daily study-hour limits are maintained in every generated plan."),
  numItem("list-accept", "High-Yield Mode activates exactly when required and warns the user."),
  numItem("list-accept", "The Gantt chart displays the study schedule correctly."),
  numItem("list-accept", "Progress tracking works and survives restart."),
  numItem("list-accept", "Study plans export to CSV with all required columns."),
  numItem("list-accept", "Local data persistence restores plans and progress between sessions."),
  numItem("list-accept", "Invalid inputs are handled safely with actionable messages."),
  numItem("list-accept", "The application passes unit and integration testing with pytest."),
  numItem("list-accept", "Project documentation is complete (SRS, this report, user manual)."),
  h2("8.2 Conclusions"),
  body("The engineering analysis supports three definitive conclusions. First, Agile with an embedded prototyping technique is the appropriate life cycle model: it is the only evaluated option that accommodates guaranteed heuristic recalibration, exploits Streamlit's iterative nature, and institutionalizes the usability feedback that the acceptance criteria demand. Second, the Basic COCOMO Organic-mode estimate — 8.94 person-months at the 3.5 KLOC planning baseline with a 5.75-month schedule and an average team of 1.56 — is consistent with a four-member semester team provided scope is planned to the Medium scenario, with 2.0 KLOC as the guaranteed deliverable and 5.0 KLOC as a stretch goal. Third, the delegation matrix gives every module exactly one primary owner aligned to background competence, and the collaboration protocol (centralized configuration, mandatory invariant tests, weekly reviews) protects the integration points where student projects most often fail."),
  h2("8.3 Immediate Next Actions"),
  body("Execution should begin with four actions in the first week. The Python Developer (M2) initializes the repository and scaffolding per Chapter 7 and lands the agreed JSON schema for topic and plan records. The AI/ML Engineer (M1) freezes the version 1 constants of Section 3.5 into core/config.py as the single tuning surface. Data Analyst I (M3) curates the initial predefined syllabus library and a malformed-CSV test pack, and Data Analyst II (M4) drafts the dashboard wireframe for the Sprint 2 prototype review. With those four artifacts in place, Sprint 1 can close on schedule and Sprint 2 begins with every owner working in parallel."),
];

/* ═══════════════════════════ DOCUMENT ═══════════════════════════ */
const pgSize = { width: 11906, height: 16838 };
const pgMargin = { top: 1440, bottom: 1440, left: 1701, right: 1417 };

const doc = new Document({
  creator: "Project Team",
  title: "AI-Powered Smart Study Planner & Syllabus Breakdown Tool — SE Report & SRS",
  description: "Software Engineering Analysis, SRS, COCOMO Estimation, and Team Delegation Matrix",
  styles: {
    default: {
      document: {
        run: { font: FONT, size: 24, color: "000000" },
        paragraph: { spacing: { line: 312 } },
      },
      heading1: {
        run: { font: FONT, size: 32, bold: true, color: P.body.primary },
        paragraph: { spacing: { before: 360, after: 160, line: 312 }, outlineLevel: 0 },
      },
      heading2: {
        run: { font: FONT, size: 28, bold: true, color: P.body.primary },
        paragraph: { spacing: { before: 240, after: 120, line: 312 }, outlineLevel: 1 },
      },
      heading3: {
        run: { font: FONT, size: 24, bold: true, color: P.body.primary },
        paragraph: { spacing: { before: 200, after: 100, line: 312 }, outlineLevel: 2 },
      },
    },
  },
  numbering: {
    config: [
      {
        reference: "list-agile",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "list-accept",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [
    { /* Section 1: Cover — margin 0, no footer, no page number */
      properties: {
        page: { size: pgSize, margin: { top: 0, bottom: 0, left: 0, right: 0 } },
      },
      children: buildCoverR1({
        englishLabel: "SOFTWARE ENGINEERING REPORT",
        title: "AI-Powered Smart Study Planner & Syllabus Breakdown Tool",
        subtitle: "Software Engineering Analysis and Software Requirements Specification (SRS)",
        metaLines: [
          "Document: SE Analysis Report + SRS Breakdown - Version 2.0",
          "Project: Academic, 5th Semester - Python / Streamlit / pandas / NumPy / Plotly",
          "Team: 1 AI/ML Engineer - 2 Data Analysts - 1 Python Developer",
        ],
        footerLeft: "Software Engineering and Project Architecture",
        footerRight: dateLabel,
        palette: P.cover,
      }),
    },
    { /* Section 2: Front matter — Roman numerals */
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { size: pgSize, margin: pgMargin, pageNumbers: { start: 1, formatType: NumberFormat.UPPER_ROMAN } },
      },
      footers: { default: pageFooter() },
      children: frontMatter,
    },
    { /* Section 3: Body — Arabic numerals from 1 */
      properties: {
        type: SectionType.NEXT_PAGE,
        page: { size: pgSize, margin: pgMargin, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({
              text: "AI-Powered Smart Study Planner - SE Report & SRS",
              size: 18, color: "808080", font: FONT,
            })],
          })],
        }),
      },
      footers: { default: pageFooter() },
      children: [...ch1, ...ch2, ...ch3, ...ch4, ...ch5, ...ch6, ...ch7, ...ch8],
    },
  ],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("SE_Report_SRS_Study_Planner.docx", buf);
  console.log("DOCX written:", buf.length, "bytes");
});
