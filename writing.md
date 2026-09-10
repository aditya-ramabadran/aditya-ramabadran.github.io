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

{% assign series_posts_all = site.posts | where_exp: "post", "post.series" %}
{% if series_posts_all.size > 0 %}
<p class="writing-section-label">Series</p>
{% for series_entry in site.data.series %}
{% assign series_key = series_entry[0] %}
{% assign series = series_entry[1] %}
{% assign series_posts = site.posts | where: "series", series_key | sort: "series_order" %}
{% if series_posts.size > 0 %}
<section class="writing-series-group" aria-labelledby="series-{{ series_key }}">
  <header class="writing-series-header">
    <h2 id="series-{{ series_key }}"><a href="{{ series.url | relative_url }}">{{ series.title }} <span aria-hidden="true">→</span></a></h2>
    <p>{{ series.description }}</p>
  </header>
  {% include post-list.html posts=series_posts in_series=true %}
</section>
{% endif %}
{% endfor %}
{% endif %}

{% assign other_posts = site.posts | where_exp: "post", "post.series == nil" %}
{% if other_posts.size > 0 %}
<section class="writing-other" aria-labelledby="other-writing-title">
  <h2 id="other-writing-title">Other writing</h2>
  {% include post-list.html posts=other_posts %}
</section>
{% endif %}
