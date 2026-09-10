---
title: "How models learn the price of thinking more"
subtitle: "DeepSeek V4.1 and Cognition SWE-2's math behind reasoning effort"
date: 2026-09-10
format: Article
series: reasoning-effort
series_order: 2
description: "DeepSeek V4.1 and Cognition SWE-2's math behind reasoning effort"
hero_image: "/assets/images/writing/deepseek-swe2/how-models-learn-the-price-of-thinking-more.jpg"
hero_alt: "How models learn the price of thinking more"
image:
  path: "/assets/images/writing/deepseek-swe2/how-models-learn-the-price-of-thinking-more.jpg"
  width: 1200
  height: 630
  alt: "How models learn the price of thinking more"
math: true
toc: true
token_price_widget: true
---

Something very interesting about some of [DeepSeek V4.1's benchmarks](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf) is that output length seems to grow very close to linearly with reasoning effort. If you've read my [previous article](https://adityaramabadran.com/writing/2026/08/21/juice-numbers-and-reasoning-effort/), you're probably familiar with the idea that reasoning efforts are often passed as scalar values to models, and this is the case for DeepSeek as well: it has an effort setting from 1 to 100. But there's no fundamental reason that moving from 50 to 60 should add about the same amount of computation as going from 80 to 90.

<figure>
  <img src="{{ '/assets/images/writing/deepseek-swe2/deepseek-v41-output-length.png' | relative_url }}" alt="DeepSeek-V4.1-Flash output length across reasoning-effort values on reasoning-intensive benchmarks" width="1920" height="1280" loading="lazy">
  <figcaption>Figure 1. In DeepSeek-V4.1-Flash, average output length increases with reasoning effort, close to linearly in reasoning-intensive benchmarks. Source: <a href="https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf#page=35">DeepSeek-V4.1-Flash Technical Report</a>.</figcaption>
</figure>

It turns out that this property is closely related to how DeepSeek defines its RL reward. There's also a cool connection to [Cognition's SWE-2](https://cognition.com/blog/swe-2), which was also released today. Essentially, reasoning effort is a way of choosing the price of test-time compute, and we can think of DeepSeek V4.1's RL penalty as mapping user-facing effort to compute prices, and Cognition SWE-2's as thinking about what compute price should be at a particular point (based on performance / Pareto frontier).

## Simple model

Consider a very simple model, where for a specific problem, a model spends <span class="math">\\(\ell\\)</span> reasoning tokens, and <span class="math">\\(p(\ell)\\)</span> is the probability of solving the problem given we spent this many tokens. Then suppose each additional reasoning token has cost <span class="math">\\(\mu\\)</span> in our reward. We can think of our model as optimizing

<div class="math-display">
\[
U(\ell) = p(\ell) - \mu \ell
\]
</div>

(although obviously RL doesn't directly optimize the reward which isn't directly differentiable in the model weights, but this is a good abstraction). If we differentiate this with respect to <span class="math">\\(\ell\\)</span> we get

<div class="math-display">
\[
U'(\ell) = p'(\ell) - \mu.
\]
</div>

So at an optimum in the interior <span class="math">\\(\ell^\star\\)</span>, we have <span class="math">\\(U^{\prime}(\ell^\star) = 0 \implies p^{\prime}(\ell^\star) = \mu\\)</span>. The takeaway is: **the model should keep thinking, until the expected marginal benefit of another reasoning token falls to exactly the "price" of that token.**  This is the standard Lagrangian picture that you would learn in a convex optimization class, i.e. if we wanted to maximize expected performance under a compute budget

<div class="math-display">
\[
\max_{\ell \ge 0}\ p(\ell) \quad \text{subject to} \quad \ell \le B
\]
</div>

then the Lagrangian would contain the term <span class="math">\\(-\mu \ell\\)</span> where the multiplier <span class="math">\\(\mu\\)</span> is the **shadow price of compute** (how much one additional unit of compute is worth, at the optimum).

## DeepSeek V4.1: effort is log scale for token price

During RL, DeepSeek V4.1 conditions the policy on effort values <span class="math">\\(b\\)</span> from <span class="math">\\(1\\)</span> to <span class="math">\\(100\\)</span>. It adds a length penalty

<div class="math-display">
\[
r_{\mathrm{len}}(\ell,b) = -\min\left\{ C_{\max}, k(b)\frac{\ell}{L_{\mathrm{norm}}} \right\},
\]
</div>

with

<div class="math-display">
\[
k(b) = k_0 \exp\left( -\frac{b-b_{\min}}{\tau} \right),
\]
</div>

meaning that the penalty coefficient decreases exponentially with effort. So the effective price of a reasoning token (ignoring the cap), is then <span class="math">\\(\mu(b) \propto \exp\left(-\frac{b}{\tau}\right).\\)</span> So every additive increase in the effort number makes reasoning **multiplicatively cheaper**. We can also rewrite this as <span class="math">\\(b=\text{constant}-\tau\log\mu\\)</span>, so we can think of the reasoning number <span class="math">\\(b\\)</span> as approximately a log coordinate for the price of reasoning compute.

DeepSeek then makes the assumption (in [Appendix C of the report](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf#page=49)) that the marginal benefit of more reasoning falls roughly exponentially, i.e. <span class="math">\\(p^{\prime}(\ell) \approx a e^{-\ell/s}.\\)</span> At the optimum reasoning length <span class="math">\\(\ell^\star\\)</span>, we have

<div class="math-display">
\[
p'(\ell^\star) = \mu(b)
\]
</div>

so

<div class="math-display">
\[
a e^{-\ell^\star/s} = \frac{k_0}{L_{\mathrm{norm}}} e^{-(b-b_{\min})/\tau}
\]
</div>

and taking logs we get

<div class="math-display">
\[
\ell^\star(b) = s\log\left(\frac{aL_{\mathrm{norm}}}{k_0}\right) + \frac{s}{\tau}(b-b_{\min}) \approx A+Bb.
\]
</div>

The tldr is: if we assume exponentially diminishing returns to thinking, and exponentially decreasing token price, then this gives <span class="math">\\(\approx\\)</span> linear reasoning length as a function of effort. (Just to be clear, this is about reasoning/output _length_ rather than performance.)

<p class="effort-widget-kicker">CODEX GENERATED INTERACTIVE FIGURE, HOPEFULLY THIS IS HELPFUL</p>

<figure class="effort-widget" data-effort-widget>
  <img class="effort-widget-fallback" data-effort-widget-fallback src="{{ '/assets/images/writing/deepseek-swe2/token-price-intersections.png' | relative_url }}" alt="A smaller effective per-token RL penalty intersects a decreasing marginal-benefit curve at a longer reasoning length" width="1800" height="1020" loading="lazy">
  <div class="effort-widget-shell" data-effort-widget-ui hidden>
    <div class="effort-widget-header">
      <p class="effort-widget-title">Reasoning effort controls effective token price (per-token RL penalty)</p>
      <div class="effort-widget-value">
        <span>Effort</span>
        <output for="reasoning-effort-slider" data-effort-value>50</output>
      </div>
    </div>

    <p class="effort-widget-rule">Model should keep thinking while the expected benefit of another token is ≥ its RL penalty (and stop when they’re equal!)</p>

    <div class="effort-widget-chart">
      <svg viewBox="0 0 720 420" role="img" aria-labelledby="effort-widget-svg-title effort-widget-svg-description">
        <title id="effort-widget-svg-title">Effective per-token RL penalty and optimal reasoning length</title>
        <desc id="effort-widget-svg-description">As reasoning effort rises, the effective per-token RL penalty falls and intersects the marginal-benefit curve at a longer reasoning length.</desc>
        <g class="effort-widget-grid" aria-hidden="true">
          <line x1="86" y1="112" x2="662" y2="112"></line>
          <line x1="86" y1="190" x2="662" y2="190"></line>
          <line x1="86" y1="268" x2="662" y2="268"></line>
        </g>
        <g class="effort-widget-axes" aria-hidden="true">
          <line x1="86" y1="44" x2="86" y2="346"></line>
          <line x1="86" y1="346" x2="662" y2="346"></line>
        </g>
        <text class="effort-widget-axis-label" x="86" y="26">Marginal benefit / per-token RL penalty</text>
        <text class="effort-widget-axis-label effort-widget-axis-label--end" x="662" y="394">Reasoning length ℓ</text>
        <text class="effort-widget-end-label" x="86" y="372">shorter</text>
        <text class="effort-widget-end-label effort-widget-end-label--right" x="662" y="372">longer</text>
        <path class="effort-widget-benefit" data-benefit-curve></path>
        <text class="effort-widget-curve-label" x="112" y="70">marginal benefit p′(ℓ)</text>
        <line class="effort-widget-price" data-price-line x1="86" x2="662" y1="0" y2="0"></line>
        <text class="effort-widget-price-label" data-price-label x="646" y="0">effective RL penalty μ(b)</text>
        <line class="effort-widget-guide" data-length-guide x1="0" x2="0" y1="0" y2="346"></line>
        <circle class="effort-widget-point-halo" data-intersection-halo cx="0" cy="0" r="12"></circle>
        <circle class="effort-widget-point" data-intersection cx="0" cy="0" r="7"></circle>
        <text class="effort-widget-length-label" data-length-label x="0" y="332">ℓ*</text>
      </svg>
    </div>

    <div class="effort-widget-control">
      <div class="effort-widget-control-row">
        <label for="reasoning-effort-slider">Reasoning effort <i>b</i></label>
        <span data-effort-state>medium penalty · medium trace</span>
      </div>
      <input id="reasoning-effort-slider" data-effort-slider type="range" min="1" max="100" value="50" step="1" aria-describedby="effort-widget-relationship">
      <div class="effort-widget-range-labels" aria-hidden="true">
        <span>1 · larger RL penalty</span>
        <span>100 · smaller RL penalty</span>
      </div>
    </div>

    <div class="effort-widget-relationship" id="effort-widget-relationship">
      <p><span>Effective RL penalty</span><strong>falls exponentially</strong><code>μ(b) ∝ e<sup>−b/τ</sup></code></p>
      <span class="effort-widget-arrow" aria-hidden="true">→</span>
      <p><span>Optimal length</span><strong>rises ≈ linearly</strong><code>ℓ*(b) ≈ A + Bb</code></p>
    </div>
  </div>
  <figcaption>Figure 2. Try changing the reasoning effort! The intersection’s x-coordinate is the optimal reasoning length. See how the reasoning effort toggle and this x-coordinate vary <span class="math">\(\approx\)</span> linearly when you move it around.</figcaption>
</figure>

## Cognition SWE-2: what should the price of compute be?

Cognition uses a pretty similar objective in SWE-2:

<div class="math-display">
\[
R = S - \lambda_e C
\]
</div>

where <span class="math">\\(S\\)</span> = success, <span class="math">\\(C\\)</span> = rollout cost, and <span class="math">\\(\lambda_e\\)</span> is a cost penalty depending on effort <span class="math">\\(e\\)</span>. The interesting question here is how to choose <span class="math">\\(\lambda_e\\)</span>.

Suppose the base model has a Pareto frontier (cost-performance) <span class="math">\\(s = f(c)\\)</span>. Then for a fixed expected reward <span class="math">\\(J = s - \lambda c\\)</span>, the slope of the iso-reward lines (<span class="math">\\(s = \lambda c + J\\)</span>) is <span class="math">\\(\lambda\\)</span>.

If <span class="math">\\(m = f^{\prime}(c)\\)</span> is the local slope of the existing Pareto frontier, then a small movement along that frontier gives <span class="math">\\(\Delta s \approx m \Delta c\\)</span> so <span class="math">\\(\Delta J \approx (m - \lambda) \Delta c\\)</span>. Cognition chooses <span class="math">\\(\lambda = m\\)</span> so that moving slightly along the old frontier gives <span class="math">\\(\approx 0\\)</span> reward improvement.

Why? If the cost penalty were larger, RL could try to "improve" an old high-effort policy by just making it cheaper and less capable, so that it behaves like a lower-effort policy (i.e. move down along the existing frontier), or vice versa. By having the reward line be tangent to the old frontier, this method encourages RL to **improve/push the frontier outward** instead.

<figure>
  <img src="{{ '/assets/images/writing/deepseek-swe2/cognition-swe2-cost-penalty.jpg' | relative_url }}" alt="Cognition SWE-2 diagram comparing an excessive cost penalty with a slope-matched penalty" width="691" height="417" loading="lazy">
  <figcaption>Figure 3. With too large a penalty, reward can improve by sliding down the old frontier, so they match penalty to the frontier's local slope. Source: <a href="https://cognition.com/blog/swe-2#deriving-cost-penalty">Cognition, “Introducing SWE-2”</a>.</figcaption>
</figure>

## Overall takeaway

Okay so what's the overall takeaway here? What does any of this actually mean?

So recall where I said that the marginal value of more compute should be equal to the shadow price of compute. DeepSeek basically asks, how should this effort number (which users can control) map to that price? And their answer is <span class="math">\\(\text{price}(b)\propto e^{-b/\tau}\\)</span> which means that under exponentially diminishing returns, reasoning length should be <span class="math">\\(\approx\\)</span> linear in effort. And this is what we see in their benchmark graphs!

Cognition instead cares about this question: what should this price be at a specific operating point? And their answer is,

<div class="math-display">
\[
\text{price} = \text{local slope of the base model's Pareto frontier}
\]
</div>

which encourages RL to improve and push out the Pareto frontier rather than getting easy reward by sliding down the existing frontier.

Also their ideas of "cost" are a bit different too: DeepSeek just focuses on reasoning token length, while Cognition uses a combination of inference cost and rollout time.

The even more general takeaway is that "reasoning effort" is a pretty complicated thing, and even though you just see "low medium high", there's a real optimization problem behind all this. The objective is to teach the model a policy corresponding to asking "**what is the value/cost of additional thinking?**" so that the model can spend more compute (i.e. another token, step, detour, or subagent, etc!) when useful and worth it, without teaching it to waste tokens or collapse unnecessarily to a cheaper policy.

## Sources

- [DeepSeek-V4.1-Flash Technical Report](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash/blob/main/DeepSeek_V41_Tech_Report.pdf)
- [DeepSeek-V4.1-Flash model card](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash)
- [Cognition, “Introducing SWE-2: Pushing the Pareto Frontier”](https://cognition.com/blog/swe-2)
