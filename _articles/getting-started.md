---
title: Getting Started
author: Myll
steamId: '76561198000729788'
date: 22.02.2015
---

So you're completely new to Dota 2 modding? Don't know where in the hell to begin? This is the guide for you, the future Dota 2 modder!

Note: “Addon”, "mod", and “custom game” are all synonymous throughout this guide (and likely the entire website).

## The Facets of Dota 2 Modding

The [Workshop Tools Wiki Homepage](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools) does a good job with subdividing all the possible aspects of Dota 2 modding:

* **Level design** - Uses the tool called "Hammer"
* **Scripting** - Divided into KeyValue editing and Lua scripting
* **Modeling** - Importing your own custom models into your addon
* **Sounds** - Importing your own custom sounds, or editing existing ones
* **Particles** - Editing existing particles or creating your own using the Particle Editor Tool (PET)
* **Panorama** - Creating custom UI or modifying existing Dota 2 UI with Panorama scripts

## Step #0: Installing and Launching the Dota 2 Workshop Tools

You can't create mods for Dota without the Workshop Tools!

taken from [How to install the Dota 2 Workshop Tools](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Installing_and_Launching_Tools):

* Right-click on Dota 2 in Steam and select View Downloadable Content.
* Check the box in the Install column next to Dota 2 Workshop Tools DLC.
* Click Close. The required content will begin downloading.
* When download is finished, launch Dota 2 In Steam and select Launch Dota 2 - Tools.

## Step #1: Creating a New Addon From A Template

To start off on a good foot, you’re going to want to create a new addon from a template. You have two options to choose from:

### Option 1: The TypeScript Addon Template

Contains:
* Dota 2 API type declarations, that help you with error checking and auto-completion of your code
* Example gamerules
* Example TypeScript ability
* Example TypeScript modifier
* Example Panorama UI with TypeScript
* Automatic installation script
* Latest Timers library

This template contains everything you need to get up and running to make mods with TypeScript. Dota 2 uses Lua as scripting language, so this template includes tools to automatically translate your TypeScript to Lua. It provides the framework for addon development, but other than that it only contains a few small examples. It comes with automatic setup for git version control out of the box.

To get started with the TypeScript template, see: [The template GitHub page](https://github.com/ModDota/TypeScriptAddonTemplate) and [TypeScript introduction](scripting/Typescript/typescript-introduction.md) for the template and installation instructions.

### Option 2: The Barebones Lua Template

Contains:
* Some default gamerules and configuration you can easily adjust
* Example Lua abilities
* Example Lua modifiers
* Some older libraries like `animations`, `physics`, `projectiles` and `timers`.

You can get started based off of the Barebones template, which is a community made alternative to Valve’s default addon templates (i.e. Holdout). This is the link to the updated Barebones: https://github.com/DarkoniusXNG/barebones<br />
After downloading it as a zip, you want to browse to your `.../Steam/SteamApps/dota 2 beta/` and merge the `game` and `content` folders from the .zip into the that /dota 2 beta/ folder (which should already have folders in it called `game` and `content`).

Next, start up the Workshop Tools (or restart them if you have them opened already), and double click your new addon. Set it as the default addon. Then, go into Hammer -> File -> Open -> template_map.vmap -> Press F9 to begin building the map. After Hammer finishes building your map, your custom game will automatically load in Dota.

## Step #2: Creating your map in Hammer

<Gfycat id="YearlyDismalHuemul" />

(Credits to DarkMio for the gfy.)

Hammer is the tool you use to create worlds for your custom game. I highly recommend you start off creating something in Hammer first instead of diving straight into the scripting or another facet. You can have the most sophisticated scripting in the workshop, but how are people going to enjoy your game if there isn't a world they can play in?

Once you get to the point of having a rough layout blocked out for your map, it's probably safe to move on to scripting. You don't want to spend too much time piddling with detailing on something you realize needs changing once you get into the nitty gritty of your mode.

[The wiki page on Hammer](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Level_Design) does a good job with giving you a run-down of Hammer. I'd recommend you start with the [Tile editor](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Level_Design/Tile_Editor_Basics) section.

BMD has made some rather nice beginner Hammer tutorial videos:

* [Part 1: Tile Editor](https://www.youtube.com/watch?v=GMvmdnNM6Sc)
* [Part 2: Mesh Basics](https://www.youtube.com/watch?v=grLUv2hUDRY)
* [Part 3: entity basics](https://www.youtube.com/watch?v=ln3ep-k__dk)

## Step #3: Scripting and beyond...

Scripting is the next most important part of your addon. It is divided into Lua scripting, and KeyValue scripting. I'm going to go ahead and redirect you to [Noya's Beginner Scripting Guide](scripting-introduction.md), since it has essentially the same information that would go in this section.

Now I'm going keep this short and sweet. I've already presented a ton of information for you to begin delving yourself into Dota 2 modding! Becoming good at Hammer mapping and good at Lua and KeyValue scripting will go a very long way in making successful, fun Dota 2 custom games. Please don't hesitate to ask questions in [the Moddota Discord channel](https://discord.gg/Mvn4gww).
