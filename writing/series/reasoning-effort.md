---
layout: default
title: Reasoning effort
browser_title: "Reasoning effort | Aditya Ramabadran"
description: For some reason I've been obsessed with reasoning effort levels and post-training length penalties, so here are some interesting notes on that.
permalink: /writing/series/reasoning-effort/
series_key: reasoning-effort
---

{% assign series = site.data.series[page.series_key] %}
{% assign series_posts = site.posts | where: "series", page.series_key | sort: "series_order" %}

<header class="writing-intro series-intro">
  <a class="back-link" href="{{ '/writing/' | relative_url }}">← All writing</a>
  <p class="eyebrow">Series</p>
  <h1>{{ series.title }}</h1>
  <p>{{ series.description }}</p>
  <p class="series-article-count">{{ series_posts.size }} article{% unless series_posts.size == 1 %}s{% endunless %}</p>
</header>

{% include post-list.html posts=series_posts show_series=false %}
