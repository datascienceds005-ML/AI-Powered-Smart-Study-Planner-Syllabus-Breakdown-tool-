"""Generate charts for the SE Report & SRS document (DM-1 palette derived colors)."""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

TEXT = "#333333"
GRID = "#E0E0E0"
TEAL = "#1B6B7A"       # DM-1 darkened table accent
AMBER = "#D4A030"      # education accent
STEEL = "#8FA6AD"
LIGHT_TEAL = "#3A8A9B"

plt.rcParams["axes.unicode_minus"] = False
plt.rcParams["font.family"] = "DejaVu Sans"


def save_chart(fig, path, dpi=200):
    w, h = fig.get_size_inches()
    if abs(w - h) < 0.1:
        fig.savefig(path, dpi=dpi, bbox_inches="tight", pad_inches=0.3,
                    facecolor="white", edgecolor="none")
    else:
        fig.savefig(path, dpi=dpi, bbox_inches="tight", pad_inches=0.1,
                    facecolor="white", edgecolor="none")
    plt.close(fig)
    return path


# ── Chart 1: Grouped bar — COCOMO effort & schedule by size scenario ──
categories = ["Small\n(2.0 KLOC)", "Medium\n(3.5 KLOC)", "Large\n(5.0 KLOC)"]
effort = [4.97, 8.94, 13.00]
tdev = [4.61, 5.75, 6.63]

fig, ax = plt.subplots(figsize=(10, 6))
x = np.arange(len(categories))
width = 0.35
b1 = ax.bar(x - width / 2, effort, width, label="Effort E (person-months)", color=TEAL, edgecolor="white")
b2 = ax.bar(x + width / 2, tdev, width, label="Schedule TDEV (months)", color=AMBER, edgecolor="white")
for bars, vals in ((b1, effort), (b2, tdev)):
    for bar, val in zip(bars, vals):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.18,
                f"{val:.2f}", ha="center", va="bottom", fontsize=10, color=TEXT)
ax.set_xticks(x)
ax.set_xticklabels(categories, fontsize=11)
ax.set_ylabel("Person-months / Months", fontsize=11, color=TEXT)
ax.set_ylim(0, 15.5)
ax.legend(frameon=False, fontsize=10, loc="upper left")
ax.spines[["top", "right"]].set_visible(False)
ax.grid(axis="y", alpha=0.3, color=GRID)
save_chart(fig, "chart_cocomo.png")
print("chart_cocomo.png done")

# ── Chart 2: Pie — recommended effort distribution ──
labels = ["Core algorithm modules\n(complexity, scheduling, High-Yield)",
          "UI / Streamlit dashboard\nand visualizations",
          "Data persistence, CSV\nimport / export layer",
          "Testing (pytest) and\ndocumentation"]
values = [40, 30, 15, 15]
colors = [TEAL, LIGHT_TEAL, AMBER, STEEL]

fig, ax = plt.subplots(figsize=(8, 8))
wedges, texts, autotexts = ax.pie(
    values, labels=labels, colors=colors,
    autopct="%1.0f%%", startangle=90, pctdistance=0.72,
    textprops={"fontsize": 11, "color": TEXT},
    wedgeprops={"edgecolor": "white", "linewidth": 1.5})
for t in autotexts:
    t.set_fontsize(11)
    t.set_color("white")
    t.set_fontweight("bold")
save_chart(fig, "chart_effort.png")
print("chart_effort.png done")
