---
layout: default
title: Writing
browser_title: "Aditya Ramabadran | Writing"
description: Notes and linked X articles by Aditya Ramabadran.
permalink: /writing/
---

<header class="writing-intro">
  <h1>Writing</h1>
  <p>Notes, blog posts, random thoughts.</p>
</header>

<section class="writing-series-index" aria-labelledby="writing-series-title">
  <h2 id="writing-series-title">Series</h2>
  <ul class="writing-series-list">
    {% for series_entry in site.data.series %}
      {% assign series_key = series_entry[0] %}
      {% assign series = series_entry[1] %}
      {% assign series_posts = site.posts | where: "series", series_key %}
      {% if series_posts.size > 0 %}
        <li>
          <a class="writing-series-link" href="{{ series.url | relative_url }}">
            <span>{{ series.title }}</span>
            <span class="writing-series-count">{{ series_posts.size }} article{% unless series_posts.size == 1 %}s{% endunless %} <span aria-hidden="true">→</span></span>
          </a>
          <p>{{ series.description }}</p>
        </li>
      {% endif %}
    {% endfor %}
  </ul>
</section>

<h2 class="writing-list-title">All writing</h2>
{% include post-list.html %}
