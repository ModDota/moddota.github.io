---
title: Getting Started
author: Myll
steamId: '76561198000729788'
date: 22.02.2015
---

**Edit 9/25/15**: Please note that this guide is somewhat out of date and lacking in content. I invite any decent Dota 2 modder to take the reigns and rewrite this guide proper.

So you're completely new to Dota 2 modding? Don't know where in the hell to begin? This is the guide for you, the future Dota 2 modder!

Note: “Addon”, "mod", and “custom game” are all synonymous throughout this guide (and likely the entire website).

## The Facets of Dota 2 Modding

The [Workshop Tools Wiki Homepage](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools) does a good job with subdividing all the possible aspects of Dota 2 modding:

* Level design (Uses the tool called "Hammer")
* Scripting (Divided into KeyValue editing and Lua scripting)
* Modeling (Importing your own custom models into your addon)
* Sounds (Importing your own custom sounds, or editing existing ones)
* Particles (Editing existing particles or creating your own using the Particle Editor Tool (PET))
* Custom UI (Creating Panorama scripts to extend or modify the existing Dota 2 UI)

## Step #0: Installing the Dota 2 Workshop Tools

You can't mod Dota without the Workshop Tools!

taken from [How to install the Dota 2 Workshop Tools](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Installing_and_Launching_Tools):

* Right-click on Dota 2 in Steam and select View Downloadable Content.
* Check the box in the Install column next to Dota 2 Workshop Tools DLC.
* Click Close. The required content will begin downloading.

## Step #1: Creating a New Addon From The 'Barebones' Template

To start off on a good foot, you’re going to want to create a new addon based off of the Barebones template, which is a community made alternative to Valve’s default addon templates (i.e. Holdout). This is the link to the updated BMD Barebones: https://github.com/bmddota/barebones <br /> After downloading it as a zip, you want to browse to your `.../Steam/SteamApps/dota 2 beta/` and merge the `game` and `content` folders from the .zip into the that /dota 2 beta/ folder (which should already have folders in it called `game` and `content`)

Next, start up the Workshop Tools (or restart them if you have them opened already), and double click your new addon. Set it as the default addon. Then, go into Hammer -> File -> Open -> barebones.vmap -> Press F9 to begin building the map. After Hammer finishes building your map, your custom game will automatically load in Dota. 

[Gfy Demo of Step #1](http://gfycat.com/NarrowIncredibleBongo). NOTE: Workshop tools now are launched through the same link in steam as the main dota client, and not the "Tools" list in steam. Otherwise this image is roughly still accurate.

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

Scripting is the next most important part of your addon. It is divided into Lua scripting, and KeyValue scripting. I'm going to go ahead and redirect you to [Noya's Beginner Scripting Guide](https://github.com/ModDota/moddota.github.io/blob/source/_articles/scripting-introduction.md), since it has essentially the same information that would go in this section. 

Now I'm going keep this short and sweet. I've already presented a ton of information for you to begin delving yourself into Dota 2 modding! Becoming good at Hammer mapping and good at Lua and KeyValue scripting will go a very long way in making successful, fun Dota 2 custom games. Please don't hesitate to ask questions in [the Moddota Discord channel](https://discord.gg/Mvn4gww).
