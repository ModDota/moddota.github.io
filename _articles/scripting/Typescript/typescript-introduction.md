---
title: Typescript Introduction
author: Shush
steamId: 76561197994333648
date: 02.12.2020
---

Typescript is a powerful tool that we can use to improve our ability to properly script files for Dota 2. Using tstl (Typescript To Lua), it automatically generates a lua file for the game to use for each file you're working on - this process is completely automatic from the moment it starts up.

Typescript is more strict compared to lua, and will use types to enforce certain functionalities, and will immediately alert you if you do something that doesn't make sense to it, and will show an error until you fix it. For instance, doing GetStrength() on an ability doesn't make sense.

Typescript can work well with most editors using plugins, however, [VSCode](https://code.visualstudio.com/) is recommended as it comes with Typescript support built in, and is a very powerful editor.

:::note
This guide assumes your operating system is Windows. If you have other operating systems, please contact us in the Typescript channel in the [Discord](#dedicated-typescript-channel) below.
:::

### Pros anc Cons for using Typescript

**Pros:**
* Enforces types, prevents you from using irrelevant functions.
* Typescript is much more similar to most languages such as C#, Java, Javascript, and C (compared to lua).
* Auto-complete that will only show API functions that match the type being called.
* Saves a ton of time by immediately finding logical errors in code, instead of having to find them in-game (sometimes as edge cases which may not be shown during local testing).
* Tremendous support of Typescript in the web (e.g. Stack Overflow) for common questions (outside of Dota 2 API).
* Typescript itself comes with very powerful built-in functionalities and types, such as Sets, Maps, array functionalities. Additionally, it supports class and types inheritance.
* Typescript converts to lua in game logic (found in `/game` folder) and to Javascript in panorama (found in `/content` folder), so you never have to switch between scripting languages.
* Auto-complete for various arguments in APIs, such as a built-in event list.
* Built-in and enums and interfaces to make finding a specific Dota-based value extremely quick!
* Extremely easy to update new APIs when Valve (eventually) releases new functions.
* Symlinks your Dota 2 folder for you as part of the setup, so you can easily integrate your changes into github.

**Cons:**
* Takes some time to set up for the first time.
* Some (uncommon) types may be incorrect. Those can be updated manually when the need arises.
* Due to the nature of a typed language, might interrupt the flow slightly sometimes (when compared to lua)
* Sometimes, requires more of a set up for a specific game logic, such as interfaces, typeguards and casts (this is again due to the nature of typed language).
* Not very convenient to integrate for ongoing projects, though it can still work.
* Referencing code or guides that are written in lua might not be easy in Typescript due to differences between how the languages work.

### Setting Up Typescript

First, since Typescript uses NodeJS, it must be installed on your computer. You can download NodeJS from [here](https://nodejs.org/en/). Simply choose the recommended version, which is the latest stable version, and download and install it.

Next, navigate to the [Typescript template](https://github.com/ModDota/TypeScriptAddonTemplate). This template has most of the files of a new addon configured for you, along with Typescript support.
There are two versions to use the template:

1. Without github: if you're not planning to put your code in github, clone the above template. See below for explanation how.

2. With github: if you do plan on put your code in github, click on the ![Use this template](static/images/typescript-tutorial/templateButton.png) button found on the top right of the github page. This will create a new github repository that uses the template under your name. Fill in the repository name, description, and whether it is public or private. You can leave "Include all branches" unchecked, then click "Create repository from template". When the new repository is created, clone it. See below for explanation how. For those unfamiliar with github, I recommend using a Github GUI, such as [Github Desktop](https://desktop.github.com/).

Cloning the repository meaning making a copy of it on your computer. This can be done by clicking on "Code", then on "Download Zip", as shown here:
![Cloning from Github](static/images/typescript-tutorial/cloneRepo.png)

You can then extract the ZIP anywhere you want - do NOT put it inside your Dota 2 folder. For example, I placed it at my Desktop, inside a folder named "Dota 2 custom games". The folder that becomes extracted is named `TypeScriptAddonTemplate-master`, so just rename the folder to more correctly reflect your custom game's name. For the sake of this tutorial, I named it `typescript-example`.

### Creating a Typescript-based addon in Dota

Now that we have the files on our computer, we can set up a new addon game very quickly. There are a few steps remaining before doing so:
* Go into your folder, in my case `typescript-example`.
* Open `package.json` with any text editor. You'll notice that the `name` field is an empty string. Add the name of the custom game. For example, I named it `typescript_tutorial`. The field should look like this:

```
"name": "typescript_tutorial",
```

:::note
Make sure there is no folder with that name inside both the `game/dota_addons` and `content/dota_addons` of your Dota 2 game folder. The installation process will create those folders for you.
:::

* While inside the folder with the `package.json` file you just edited, click on the address bar, so the path to your folder becomes highlighted and editable as text. It should look like this:
![Click on path](static/images/typescript-tutorial/clickAddressBar.png)

* While the path is highlighted, delete the text and instead type "cmd". This will open the Command Shell with the folder path shown right before your input cursor.

* Type `npm install` and press enter. You'll see a loading bar, which should take up to a minute to complete. If it was successful, you should see that your `game` and `content` folders now have a "shortcut" icon next to them. They're now symlinked to your Dota 2 folder. The `typescript_tutorial` folder now exists for both `game/dota_addons/` and `content/dota_addons` in your Dota 2 folder.

:::note
Symlinked folders are copies of each other, where any action done on one is also applied on the other folder. Therefore, you can simply work on your conveniently placed folder (`Desktop/Dota 2 custom games/typescript-example` in my example), and it will automatically be applied on the Steam Dota 2 folder as well.
:::

### Typescript Addon Structure
Most of the structure for Typescript is identical to a standard Dota addon, such as having `scripts/vscripts/` folder. However, there are a few additional files responsible for making Typescript identify and work with Dota 2 API, and in the custom game in general.

:::note
The structure inside the `/game/` and `/content/` folders can be changed and designed as you wish; however, you will have to make sure all imports still point to the correct path. You should not change folders in the root folder unless you know what you're doing.
:::

Most of them can be left alone, but it's good to know what they do. Most of those files are located at `/game/vscripts/` folder:
* tsconfig.json: Configures how Typescript works in the lua portion of the project.

:::note
The same file exists in the `/content/panorama/scripts/custom_game` folder for Typescript configuration rules for panorama.
::::

* vscripts/lib/dota_ts_adapter.ts: Responsible for registering various common classes, such as abilities, items, and modifiers.
* vscripts/lib/tstl-utils.ts: Responsible for the typescript-to-lua translation.
* vscripts/lib/timers.lua and lib/timers.d.ts: The common Timers library is already included in default in its lua form, with timers.d.ts including an interface to allow using the Timers library in Typescript.

:::note
An additional important folder is located at /node_modules/dota-lua-types/types/. This folder holds files that are responsible for all the API that exists for Dota 2 custom games. You can modify this file if you want. However, note that when updating the project (explained later), those files would be updated as well, effectively removing your changes. In addition, those are ignored in your Github, so others will not see your changes.
:::

### Updating Your Addon

Occasionally, Valve will release new API or changes to existing API, usually at events and major patches. Your Typescript project will not automatically adjust to those changes, they need to be filed and typed (usually done by the people responsible for the Typescript template). However, when a new update is announced for Typescript for Dota 2, you can easily update your project. There are two ways to do so:

* Using VSCode's terminal: If your chosen editor is VSCode and it has your project's folder loaded, click on Terminal -> New Terminal. A new terminal will open. Type `npm update` and press Enter.

* Using cmd: Open cmd from your project's root directory (`Desktop/Dota 2 custom games/typescript-example` in my example), then type `npm update` and press enter.

The project will update to the newest version automatically.

### Activating The Watcher
In order for your files to compile and have their compiled lua equivalents, it is required to activate the watcher. The watcher watches over all changes done on your files in the project, and immediately produces a lua equivalent, assuming the file compiled with no errors. There are three ways to do so:

* Using VSCode's terminal: If your chosen editor is VSCode and it has your project's folder loaded, click on Terminal -> Run Build Task. Alternatively, you can use the hotkey for it, default `Ctrl+Shift+B`.

* Using cmd: Open cmd from your project's root directory (`Desktop/Dota 2 custom games/typescript-example` in my example), then type `npm run dev` and press enter.

* Other editors: Depending on the editor, the editor might have their own method to invoke a Run Build Task command; check the editor's documentation for more details.

### Normalized types

When dumping functions from the game, it comes with predefined types. Some of those types are not very convenient to work with, so instead, we can use the normalized types instead. Those normalized types change enums slightly, and its purpose is to increase readability of your code.

Examples of how types change after normalization:
* `dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE` -> `UnitOrder.ATTACK_MOVE`
* `EDOTA_ModifyGold_Reason.DOTA_ModifyGold_Unspecified` -> `ModifyGoldReason.UNSPECIFIED`
* `ParticleAttachment_t.PATTACH_CUSTOMORIGIN` -> `ParticleAttachment.CUSTOMORIGIN`

As the examples show, it is a lot readable after the normalization.
The process is simple and only needs to be done once.

Navigate to your project's `/game/scripts/vscripts` folder, then open `tsconfig.json` in any text editor. Locate `"types": ["dota-lua-types"],`, and change it to `"types": ["dota-lua-types/normalized"]`. Save the file and you're done!

### Integrated Examples

Per writing this tutorial, the Typescript template comes with a few examples to show how game logic is done in Typescript. I recommend keeping those files for reference until you're more comfortable with it.
The examples are:
* In `game/scripts/vscripts/abilities/heroes/meepo/earthbind_ts_example.ts`: A custom Meepo's Earthbind ability example.
* In `game/scripts/vscripts/modifiers/modifier_panic.ts`: A custom modifier that restricts commands and orders the parent to move to a random position near it.
* In `game/scripts/vscripts/GameMode.ts`: Game mode logic examples, such as setting the maximum players for each team to 3. Timer and event listening examples are also shown here.

:::warning
If you normalized the types as shown in the [Normalized types](#normalized-types) section, the examples will no longer compile. You'll have to change them to their normalized forms, if you plan to use them, or you can comment them out to reference them later on.
:::

Note that the examples apply on your addon immediately, which can cause weird behaviors. You can disable those examples:

* In `/game/vscripts/GameMode.ts`, comment the code inside the `OnNpcSpawned` function. It gives all units spawned a custom Meepo's Earthbind and a custom modifier that causes them to lose control.
* In `/game/vscripts/GameMode.ts`, comment the conde inside the `configure` function. It sets each team to have 3 maximum players, along with some pick screen values.
* In `/game/vscripts/GameMode.ts`, comment the conde inside the `OnStateChange` function. It adds bots to the enemy team.
* In `/content/panorama/scripts/custom_game/manifest.ts`, comment all code inside it. It causes all HUD panels to be hidden by default when loading the game.

### Dedicated Typescript Channel in Moddota Discord

We have a dedicated Typescript channel in our [moddota Discord](https://discord.gg/ZyHg6T9sTd) for every Typescript related question. Feel free to join and ask anything and we'll be happy to assist.

Check out new tutorials that will come out later on for examples of abilities, modifiers, and some very powerful Typescript related techniques.
