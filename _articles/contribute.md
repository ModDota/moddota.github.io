---
title: Contribute
---

# Contribute

## Suggest an article on GitHub

To suggest a new article go to the [/\_articles directory of the ModDota GitHub](https://github.com/ModDota/moddota.github.io/tree/source/_articles).

::: info
You need to be logged in to your GitHub account for this.
:::

Next, click the 'Create file' button as indicated:
![Click the create new file button](/images/external/hzOmlcA.png)

### Fill your article

In the new file window you have to add a descriptive file name and text for your article:

![Fill your article](/images/external/4CcOl0i.png)

::: tip
You can use the preview tab at the top to preview the article!
:::

#### IMPORTANT: Mandatory fields

There are some mandatory fields you need to fill for the article to work:

First, you need to set a file name. Choose a descriptive name, words separated by `-` (no spaces). **The file must end with .md!**

Second, you need to set some basic article information at the top, the layout is always the same (including dashes):

```yaml
---
title: <Title of your article> # Title of your article (required)
author: <your name> # Your name
steamId: '<your steam ID>' # Your steam ID to link to your steam profile
date: <date> # The date of writing
---
```

The only required field is `title`, all other fields can be safely omitted.

### Submit your article for review

Once you're done you just need to add a very short description on the tutorial you just made at the bottom of the page. This will show up in the change history of the website. Once you are done hit the green 'Propose new file' button.

![Submit your tutorial](/images/external/xkwdcRx.png)

### Article review

Someone will check if the article is not broken on the website and is not missing information, you might be asked to make some changes before the page is added to the website.

Once your tutorial is merged it is automatically released to the website.

## Writing tutorials

Tutorials can be written in Markdown markup language, with some extra features from GitHub Flavored Markdown supported. To get familiar with the syntax, you can visit [this page](https://commonmark.org/help/).

In addition, this website supports markdown extensions provided by [VitePress](https://vitepress.dev/guide/markdown):

```lua{2}
function foo()
  -- Highlighted line
end
```

### Images and Videos

All images and videos should be stored locally in the repository, not linked from external URLs.

- **Images:** Place in the `static/images/` folder and reference as `![alt text](/images/your-image.png)`
- **Videos:** Place `.mp4` files in the `static/videos/` folder and use `<StaticVideo path="/videos/your-video.mp4" />`

**To add a YouTube player to the page use the following:**

To embed https://www.youtube.com/watch?v=GMvmdnNM6Sc:

Use `<YouTube id="GMvmdnNM6Sc" />`

### Headings

In VitePress, Markdown's [headings] get an additional meaning - they are used to generate the "On this page" outline, which you can see on the right side of the article.

:::info
Only headings of levels 2 (##) and 3 (###) would appear in the outline by default.
:::

## Using a git fork

::: warning
Advanced users only
:::

This website is set up as a GitHub Pages project built with VitePress. Content is rendered automatically after each push to the `source` branch and published to the website.

You can simply fork or clone the repository to edit the files and submit a pull request to the main repository.

File structure is as follows:

```
.
_articles/              # Directory storing all articles as markdown files
  | index.md            # Homepage
  | contribute.md       # This page
  | ...
.vitepress/
  | config.mts          # VitePress configuration (sidebar, nav, etc.)
  | theme/              # Custom theme, components, and CSS
static/
  | images/             # Static images
  | videos/             # Static videos
```
