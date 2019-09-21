---
title: Tutorials
---

<h2>Tutorials by category</h2>

{% assign articles_by_category = site.articles | group_by: "category" %}
{% assign beginners = articles_by_category | where:"name","Beginners" | first %}
{% assign scripting = articles_by_category | where:"name","Scripting" | first %}
{% assign user_interface = articles_by_category | where:"name","User Interface" | first %}
{% assign assets = articles_by_category | where:"name","Assets" | first %}
{% assign other = articles_by_category | where:"name","Other" | first %}

{% include category.html category=beginners %}
{% include category.html category=scripting %}
{% include category.html category=user_interface %}
{% include category.html category=assets %}
{% include category.html category=other %}