---
layout: default
title: Aditya Ramabadran
browser_title: "Aditya Ramabadran | About Me"
description: Notes, research, selected work across AI, math, and computer science.
---

<div class="home-columns">
<div class="home-main">
<section class="intro">
  <p>I am a Member of Technical Staff at <a href="https://axiommath.ai/">Axiom Math</a>, where I work on post-training for formal mathematical reasoning agents.</p>
  <p>Previously, I studied mathematics and computer science at UC Berkeley. I did robotics and reinforcement learning research in <a href="https://www2.eecs.berkeley.edu/Faculty/Homepages/svlevine.html">Sergey Levine’s</a> lab, harmonic analysis with <a href="https://math.washington.edu/people/bobby-wilson">Bobby Wilson</a>, and dispersive PDE with <a href="https://sites.google.com/view/david-bowman/home">David Bowman</a>. I was set to begin a mathematics PhD at UCLA in fall 2026, but chose instead to work in AI.</p>
  <p>Outside of work, I like playing and watching basketball, lifting, running, and spending too much time on Twitter.</p>
</section>

<div class="timeline" aria-label="Career and research history">
  <div class="timeline-item">
    <div class="timeline-year">2026–now</div>
    <div class="timeline-logo"><img src="{{ '/assets/images/logos/axiom.svg' | relative_url }}" alt="Axiom Math logo"></div>
    <div class="timeline-copy">
      <h3><a href="https://axiommath.ai/">Axiom Math</a></h3>
      <p>Co-led development of post-training pipeline for formal (Lean) mathematical reasoning agents.</p>
      <p class="timeline-note"><span>Formalization</span><a href="https://primegaps.axiommath.ai/">Agent helped formalize the 2014 bounded-prime-gaps result (H₁ ≤ 246) in Lean.</a></p>
    </div>
  </div>

  <div class="timeline-item">
    <div class="timeline-year">Summer 2025</div>
    <div class="timeline-logo timeline-logo--tall"><img src="{{ '/assets/images/logos/uchicago.png' | relative_url }}" alt="University of Chicago logo"></div>
    <div class="timeline-copy">
      <h3><a href="https://math.uchicago.edu/~may/REU2025/">University of Chicago Math REU</a></h3>
      <p>Worked with David Bowman on dispersive PDE (concentration compactness, NLS).</p>
      <p class="timeline-note"><span>Paper</span><a href="https://math.uchicago.edu/~may/REU2025/REUPapers/Ramabadran.pdf">Ground States, Concentration Compactness, and Blow-Up Dynamics in the Nonlinear Schrödinger Equation</a></p>
    </div>
  </div>

  <div class="timeline-item">
    <div class="timeline-year">Summer 2024</div>
    <div class="timeline-logo"><img src="{{ '/assets/images/logos/washington.png' | relative_url }}" alt="University of Washington logo"></div>
    <div class="timeline-copy">
      <h3><a href="https://www.ams.org/opportunities/view/listing?listing_id=494069">University of Washington Math REU</a></h3>
      <p>Worked with Bobby Wilson on harmonic analysis and Fuglede's conjecture.</p>
      <p class="timeline-note"><span>Paper</span><a href="https://arxiv.org/abs/2508.15159">Spectrality of Product Sets with a Perturbed Interval Factor</a>, with Johannes van Vliet</p>
    </div>
  </div>

  <div class="timeline-item">
    <div class="timeline-year">2023–24</div>
    <div class="timeline-logo"><img src="{{ '/assets/images/logos/bair.svg' | relative_url }}" alt="Berkeley AI Research logo"></div>
    <div class="timeline-copy">
      <h3><a href="https://bair.berkeley.edu/">Berkeley AI Research</a></h3>
      <p>Researched long-horizon robotic manipulation and reinforcement learning in Sergey Levine's <a href="http://rail.eecs.berkeley.edu/">RAIL lab</a>.</p>
    </div>
  </div>

  <div class="timeline-item">
    <div class="timeline-year">Summer 2022</div>
    <div class="timeline-logo timeline-logo--wide"><img src="{{ '/assets/images/logos/voleon.png' | relative_url }}" alt="The Voleon Group logo"></div>
    <div class="timeline-copy">
      <h3><a href="https://voleon.com/">The Voleon Group</a></h3>
      <p>Worked on numerical computing and performance engineering with JAX, XLA, multicore CPUs, and GPUs.</p>
    </div>
  </div>

  <div class="timeline-item">
    <div class="timeline-year">2021–25</div>
    <div class="timeline-logo timeline-logo--wide"><img src="{{ '/assets/images/logos/berkeley.svg' | relative_url }}" alt="UC Berkeley logo"></div>
    <div class="timeline-copy">
      <h3><a href="https://www.berkeley.edu/">UC Berkeley</a></h3>
      <p>Studied mathematics and computer science.</p>
      <p class="timeline-note"><span>GPA</span>4.0 / 4.0</p>
      <p class="timeline-note"><span>Teaching</span>Four-time teaching assistant for EECS 127 (Convex Optimization); contributed to the <a href="https://eecs127.github.io/assets/notes/eecs127_reader.pdf">course reader</a>.</p>
      <p class="timeline-note"><span>Courses</span><a href="{{ '/courses/' | relative_url }}">Here</a> is a list of some of the courses I took.</p>
      <div class="timeline-note timeline-projects">
        <span>Course projects</span>
        <ul>
          <li><a href="{{ '/rpcholesky_paper.pdf' | relative_url }}">Math 221 Final Project (RPCholesky)</a></li>
          <li><a href="{{ '/navier_stokes_pde_paper.pdf' | relative_url }}">Math 222B Final Project (Navier Stokes)</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>
</div>

<aside class="home-writing" aria-label="Writing preview">
<h2>Writing</h2>

{% assign home_post_count = 0 %}
{% assign home_post_limit = 3 %}
{% for series_entry in site.data.series %}
  {% assign series_key = series_entry[0] %}
  {% assign series = series_entry[1] %}
  {% assign series_posts = site.posts | where: "series", series_key %}
  {% if series_posts.size > 0 and home_post_count < home_post_limit %}
    <section class="home-writing-group" aria-labelledby="home-series-{{ series_key }}">
      <h3 class="home-writing-group-title" id="home-series-{{ series_key }}"><a href="{{ series.url | relative_url }}">{{ series.title }} <span aria-hidden="true">→</span></a></h3>
      {% include post-list.html posts=series_posts in_series=true limit=1 %}
    </section>
    {% assign home_post_count = home_post_count | plus: 1 %}
  {% endif %}
{% endfor %}

{% assign other_posts = site.posts | where_exp: "post", "post.series == nil" %}
{% if other_posts.size > 0 and home_post_count < home_post_limit %}
  {% assign other_post_limit = home_post_limit | minus: home_post_count %}
  <section class="home-writing-group home-writing-other" aria-labelledby="home-other-writing">
    <h3 class="home-writing-group-title" id="home-other-writing">Other writing</h3>
    {% include post-list.html posts=other_posts limit=other_post_limit %}
  </section>
{% endif %}

<p class="writing-all"><a href="{{ '/writing/' | relative_url }}">View all writing <span aria-hidden="true">→</span></a></p>
</aside>
</div>
