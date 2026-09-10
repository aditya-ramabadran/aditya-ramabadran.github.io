"""Recreate Figure 1 as a single-axis output-length plot.

The values below were digitized from Figure 9 of the DeepSeek-V4.1-Flash
technical report. Keeping the source here makes the website asset reproducible.
"""

from pathlib import Path

import matplotlib.pyplot as plt


EFFORT = [25, 30, 40, 50, 60, 70, 75, 80, 90, 100]
OUTPUT_TOKENS_K = [11.7, 13.6, 17.3, 17.9, 20.1, 24.5, 27.0, 25.5, 26.3, 31.7]

OUTPUT = (
    Path(__file__).resolve().parents[1]
    / "assets/images/writing/deepseek-swe2/deepseek-v41-output-length.png"
)


def main() -> None:
    blue = "#2775b8"
    fig, ax = plt.subplots(figsize=(9.6, 6.4), dpi=200)
    fig.patch.set_facecolor("white")
    ax.set_facecolor("white")

    ax.plot(
        EFFORT,
        OUTPUT_TOKENS_K,
        color=blue,
        linewidth=3.5,
        linestyle=(0, (7, 5)),
        marker="o",
        markersize=9.5,
        markerfacecolor="white",
        markeredgecolor=blue,
        markeredgewidth=2.6,
        zorder=3,
    )

    ax.set_title("Reasoning-intensive Benchmarks", fontsize=25, pad=20, weight="medium")
    ax.set_xlabel("Reasoning effort", fontsize=19, labelpad=14)
    ax.set_ylabel("Output tokens (k)", fontsize=19, labelpad=16)

    ax.set_xlim(20, 105)
    ax.set_ylim(9, 36)
    ax.set_xticks([25, 40, 60, 80, 100])
    ax.set_yticks([10, 15, 20, 25, 30, 35])
    ax.tick_params(axis="both", which="major", labelsize=14, width=1.4, length=6, pad=7)

    ax.grid(True, which="major", color="#e4e7eb", linewidth=1.2, linestyle=(0, (1.5, 3)))
    ax.set_axisbelow(True)
    for spine in ax.spines.values():
        spine.set_color("#171717")
        spine.set_linewidth(1.5)

    fig.subplots_adjust(left=0.15, right=0.97, bottom=0.18, top=0.84)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUTPUT, facecolor="white")
    plt.close(fig)


if __name__ == "__main__":
    main()
