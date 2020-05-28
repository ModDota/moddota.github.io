---
title: Contribute
---

**Table of contents**

- [Suggest an article on GitHub](#suggest-an-article-on-github)
- [Gfycat/Youtube content](#gfycatyoutube-content)
- [Using a git fork](#using-a-git-fork)



## Suggest an article on GitHub

To suggest a new article go to the [/_articles directory of the ModDota GitHub](https://github.com/ModDota/moddota.github.io/tree/master/_articles)

**Note: You need to be logged in to your GitHub account for this.**

Next, click the 'Create file' button as indicated:
![Click the create new file button](https://i.imgur.com/hzOmlcA.png)



### Fill your article

In the new file window you have to add a descriptive file name and text for your article:

![Fill your article](https://i.imgur.com/4CcOl0i.png)

**Tip:** You can use the preview tab at the top to preview the article!


#### IMPORTANT: Mandatory fields

There are some mandatory fields you need to fill for the article to work:

First, you need to set a file name. Choose a descriptive name, words separated by `-` (no spaces). **The file must end with .md!**

Second, you need to set some basic article information at the top, the layout is always the same (including dashes):

```yaml
---
title: <Title of your article>    # Title of your article (required)
author: <your name>               # Your name
steamId: '<your steam ID>'        # Your steam ID to link to your steam profile
date: <date>                      # The date of writing
---
```

The only required field is `title`, all other fields can be safely omitted.

### Submit your article for review

Once you're done you just need to add a very short description on the tutorial you just made at the bottom of the page. This will show up in the change history of the website. Once you are done hit the green 'Propose new file' button.

![Submit your tutorial](https://i.imgur.com/xkwdcRx.png)

### Article review

Someone will check if the article is not broken on the website and is not missing information, you might be asked to make some changes before the page is added to the website.

Once your tutorial is merged it is automatically released to the website.



## Gfycat/Youtube Content

**To add a Gfycat gif to the page use the following format:**

To embed https://gfycat.com/remarkableimportantant:

Use `<Gfycat id="remarkableimportantant" />`



**To add a YouTube player to the page use the following:**

To embed https://www.youtube.com/watch?v=GMvmdnNM6Sc:

Use `<YouTube id="GMvmdnNM6Sc" />`



## Using a git fork

**Warning: Advanced users only**

This website is set up as a Github Pages project which is automatically rendered from its source contents by Jekyll. Content is rendered automatically after each push to master and published to the website.

You can simply fork or clone the repository to edit the files and submit a pull request to the main repository.

File structure is as follows:

```
.
_articles/         # Directory storing all articles on the website as markdown files
  | article1.md
  | ...
_includes/         # Directory containing Jekyll includes
_layouts/          # Website layout files. (NOTE: We override the Jekyll Minima theme, only overrides   | ...                  are in this directory, the default minima files are not in this repo)
_sass/             # Sass stylesheets, will automatically be built when releasing

ask-a-question.md  # The 'Ask-A-Question' page
contribute.md      # This page
index.md           # Homepage
```

