# Website ideas

## Direction

- Keep the site sparse, fast, and content-first; avoid full-page effects or generic AI-startup visuals.
- Prefer animations that explain or respond to specific content over permanent decoration.
- Use at most one subtle animation at a time, with no layout shift, sound, cursor trail, or required interaction.
- Try CSS, SVG, or Canvas 2D before Three.js; use Three.js only when actual depth adds something.
- Respect `prefers-reduced-motion`, pause animations offscreen, and use a static or omitted version on mobile.
- Do not currently plan articles about formal theorem proving. Formal-proof imagery can still appear as a small visual motif for Axiom.

## Reasoning-effort article: marginal animation candidates

- **Cache-prefix stack (strongest):** a quiet loop of aligned prompt bars; the Juice/system-prompt bar changes and the reusable prefix after it fades, then the stack resets.
- **Reasoning trajectories:** several thin paths grow to different lengths for low/medium/high effort; a few stop early to communicate distributions rather than hard token budgets.
- **Juice control dial:** a small numeric or tick-mark control moves between Juice values while the density/length of a restrained particle trail changes.
- **Modular recurrence orbit:** a point repeatedly advances around a faint ring using the recurrence from the article, leaving a longer trail at higher effort.
- **Injection comparison:** paired trajectories gently diverge when a user-message Juice value appears, echoing the matched-run graph in the article.
- The figure can simply run as a slow ambient loop. Hovering could pause it and reveal a one-line label, but scroll-driven state changes are optional.
- Best first prototypes: cache-prefix stack, reasoning trajectories, and modular recurrence orbit.

## Hover-triggered site animations

- Show a small corner or margin animation only while an institution, project, or paper link is hovered or keyboard-focused; fade it out on leave.
- **Axiom Math:** a tiny proof tree grows by a few nodes; one terminal node receives a restrained accent/check mark.
- **UChicago REU:** a dispersive wave packet spreads while a concentrated core remains.
- **UW REU:** a few set tiles and frequency points shift into a spectral/tiling pattern.
- **Berkeley AI Research:** a minimal two-link robot arm traces a short path.
- **The Voleon Group:** a small matrix/compute grid propagates a wave of highlighted cells.
- **UC Berkeley / EECS 127:** contour lines appear and a point takes several optimization steps.
- Use one reusable 120–180 px corner stage so the effects never move text or compete with the page.
- Trigger after a short hover delay so casual pointer movement does not create flicker; support keyboard focus too.

## Possible future content and sections

- Keep one chronological Writing stream with lightweight format labels: Essay, Experiment, Note, and Link.
- Add an Experiments index only after there are at least two or three real interactive pieces.
- Short public notes could cover model-behavior observations, paper-reading notes, experimental methodology, math explanations, or follow-ups to the reasoning-effort article.
- Strong article candidates: cache-aware reasoning controls; how to reverse-engineer hidden model behavior without fooling yourself; concentration compactness visually; spectral sets/Fuglede visually; lessons from teaching convex optimization four times.
- Surface RSS on the Writing page; add related posts, search, tags, or a Start Here page only after the archive is large enough to justify them.

## Prototype order

- Prototype the three reasoning-effort marginal figures locally and compare them beside the existing article.
- Prototype the Axiom proof-tree hover as the first site-wide hover effect.
- Test desktop, dark mode, keyboard focus, reduced motion, mobile fallback, and performance before considering publication.
