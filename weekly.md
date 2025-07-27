---
title: "Weekly"
layout: single
permalink: /weekly/
author_profile: true
classes: wide
---

{% assign weekly_posts = site.weekly | sort: 'date' | reverse %}

<div class="entries-list">
  {% for post in weekly_posts %}
    {% include archive-single.html type="list" %}
  {% endfor %}
</div>