---
title: Introduction to Panorama UI with TypeScript
author: Perry
steamId: '76561198046986723'
date: 26.07.2017
---

## What is TypeScript and why should I use it

[TypeScript](https://www.typescriptlang.org/) is a language created by and for people that were unhappy with Javascript and all of its quirks and flaws. TypeScript is a language with its own syntax (although similar to Javascript) that compiles to Javascript in a way that avoids a lot of Javascript's issues.

The name TypeScript comes from the fact that the language is basically Javascript with type checking, but on top of that it supports all of the newest Javascript language construct that are not supported by Panorama.

**Pros of using TypeScript:**

*   Type checking
*   Code completion based on type (also for API!)
*   Prevents scoping issues
*   Proper OOP constructs (such as classes, interfaces, inheritance...)

**Cons of using TypeScript:**

*   Requires some setup
*   Remember to compile
*   Requires good definitions for Panorama

## How to install TypeScript

1. Install [Node.js](https://nodejs.org/en/) which is used to compile TypeScript.
2. Create a `package.json` file in the root directory of your project with at least `{}` content.
3. Install required dependencies by opening a command prompt and executing `npm install -D typescript panorama-types`.

That's it, after these three steps you are ready to start using TypeScript.

[Visual Studio Code](https://code.visualstudio.com/) supports TypeScript out of the box. For other editors you might have to install a plugin to get language features (for example [Sublime TypeScript plugin](https://github.com/Microsoft/TypeScript-Sublime-Plugin#installation), available through Sublime Text package manager).

## How to set up TypeScript for your dota addon

TypeScript requires a `tsconfig.json` used to configure it for your project. Put it in your addon's `content/panorama` directory. You can adjust all settings yourself, but I usually have this set to the most strict settings. My preferred configuration:

```json
{
    "compilerOptions": {
        "target": "es2017",
        "lib": ["es2017"],
        "types": ["panorama-types"],
        "strict": true
    }
}
```

Your addon's content directory structure should be something like this:

    content/dota_addons/[addon]/
        ...
        panorama/
            layout/
            scripts/
            styles/
            tsconfig.json

## Your first TypeScript UI

To illustrate why I like using TypeScript for modular UI I will walk through a small example. We will be making some hero portraits with player name and a healh bar: ![What we are making](http://web.archive.org/web/20190201023254im_/http://i.imgur.com/ZrqqlFo.png "Example UI")

Since this tutorial is about TypeScript I will just quickly give the xml and css, this is standard stuff:

~~~xml
<root>
    <styles>
        <include src="file://{resources}/styles/custom_game/example.css" />
    </styles>

    <scripts>
        <include src="file://{resources}/scripts/custom_game/PlayerPortrait.js" />
        <include src="file://{resources}/scripts/custom_game/ExampleUI.js" />
    </scripts>

    <snippets>
        <snippet name="PlayerPortrait">
            <Panel class="PlayerPortrait" hittest="false">
                <Image id="HeroImage" hittest="false" />
                <Label id="PlayerName" />
                <Panel class="HealthContainer">
                    <Panel id="HealthBar" />
                </Panel>
            </Panel>
        </snippet>
    </snippets>

    <Panel hittest="false" style="width: 100%; height: 100%;">
        <Panel id="HeroPortraits" />
    </Panel>
</root>
~~~

CSS:

~~~css
#HeroPortraits {
    width: 300px;
    height: 650px;
    margin-top: 150px;
    flow-children: down;
}
.PlayerPortrait {
    background-color: blue;
    height: 80px;
    width: 300px;
    margin-bottom: 10px;
}
#HeroImage {
    width: 80px;
    height: 80px;
    background-color: black;
}
#PlayerName {
    color: white;
    font-size: 25px;
    margin-top: 10px;
    margin-left: 90px;
}
.HealthContainer {
    width: 200px;
    height: 20px;
    x: 90px;
    y: 50px;
    background-color: black;
}
#HealthBar {
    height: 20px;
    width: 50%;

    background-color: green;
}
~~~

As you can see the XML of this part of the UI has a snippet containing the XML of a player portrait containing a hero image, a label for the player name and a health container and health bar inside that container. The CSS applies some simple layout to this.

## Writing TypeScript for your UI

First we want to define a class of our UI and to link that to the XML. We do this by taking an existing panel and wrapping it into a typescript class, as follows:

~~~typescript
class ExampleUI {
    // Instance variables
    panel: Panel;

    // ExampleUI constructor
    constructor(panel: Panel) {
        this.panel = panel;
        $.Msg(panel); // Print the panel
    }
}

let ui = new ExampleUI($.GetContextPanel());
~~~

Nothing too exciting, we basically create a new ExampleUI object in ExampleUI.ts from the context panel, so this entire XML file is now an instance of the ExampleUI class. If you build this by pressing **ctrl+b** in Sublime, you will see it creates a new compiled ExampleUI.js file with the same name. This compiled file is loaded by Panorama. If you load your game mode at this point you should see a print in console printing your UI panel.

Now let's create a class for a hero portrait. In this case we do not wrap an existing element, but instead create a panel in the constructor. To do this we do still need a parent panel, so we require that as parameter for the constructor, as well as the hero name and player name. After creating a panel and loading the snippet into it we look up some of its child elements and store them for later.

~~~typescript
class PlayerPortrait {
    // Instance variables
    panel: Panel;
    heroImage: ImagePanel;
    playerLabel: LabelPanel;
    hpBar: Panel;

    constructor(parent: Panel, heroName: string, playerName: string) {
        // Create new panel
        const panel = $.CreatePanel("Panel", parent, "");
        this.panel = panel;

        // Load snippet into panel
        panel.BLoadLayoutSnippet("PlayerPortrait");

        // Find components
        this.heroImage = panel.FindChildTraverse("HeroImage") as ImagePanel;
        this.playerLabel = panel.FindChildTraverse("PlayerName") as LabelPanel;
        this.hpBar = panel.FindChildTraverse("HealthBar")!;

        // Set player name label
        this.playerLabel.text = playerName;

        // Set hero image
        this.heroImage.SetImage("s2r://panorama/images/heroes/" + heroName + "_png.vtex");

        // Initialise health at 100%
        this.SetHealthPercent(100);
    }

    // Set the health bar to a certain percentage (0-100)
    SetHealthPercent(percentage: number) {
        this.hpBar.style.width = Math.floor(percentage) + "%";
    }
}
~~~

This is saved in a second file **PlayerPortrait.ts** which compiles to PlayerPortrait.js. Therefore this file is also included in the scripts section of the xml (see above).

The constructor simply creates a new panel and loads a snippet into it, and then sets some default values. The class also defines a SetHealthPercent function that manipulates the health bar.

Now we go back to the ExampleUI class and make a couple PlayerPortrait instances to the PlayerPortraits element:

~~~typescript
class ExampleUI {
    // Instance variables
    panel: Panel;

    // ExampleUI constructor
    constructor(panel: Panel) {
        this.panel = panel;

        // Find container element
        const container = this.panel.FindChild("HeroPortraits")!;

        // Create portrait for player 0, 1 and 2
        const portrait0 = new PlayerPortrait(container, "npc_dota_hero_juggernaut", "Player0");
        const portrait1 = new PlayerPortrait(container, "npc_dota_hero_omniknight", "Player1");
        const portrait2 = new PlayerPortrait(container, "npc_dota_hero_invoker", "Player2");

        // Set HP of player 1 and 2 to a different value
        portrait0.SetHealthPercent(80);
        portrait2.SetHealthPercent(20);
    }
}

let ui = new ExampleUI($.GetContextPanel());
~~~

Your UI should now look like the screenshot we set out to make at the start.

## Advanced TypeScripting

Now this UI is not very useful for an actual game, so let's do something a bit more complicated. We want to save the player portraits and then whenever we receive an event that a player's HP has changed we want to retrieve the proper PlayerPortrait instance.

We do this by adding another instance variable to the ExampleUI, a map that maps playerIDs to the correct PlayerPortrait instance. When creating PlayerPortrait instances we put them in the map. When we get an hp_changed event we update the proper panel. The type of this map can be expressed in TypeScript as `{[playerID: number]: PlayerPortrait}`.

One of the advantages of TypeScript is that you can explicitly define which events you receive and what their contents are. We define the HPChanged event as follows:

~~~typescript
interface HPChangedEvent {
    playerID: PlayerID,
    hpPercentage: number
}
~~~

Putting these together our ExampleUI.ts file now looks as follows:

~~~typescript
interface HPChangedEvent {
    playerID: PlayerID;
    hpPercentage: number;
}

class ExampleUI {
    // Instance variables
    panel: Panel;
    playerPanels: Partial<Record<PlayerID, PlayerPortrait>> = {}; // A map with number keys and PlayerPortrait values

    // ExampleUI constructor
    constructor(panel: Panel) {
        this.panel = panel;

        const container = this.panel.FindChild("HeroPortraits")!;
        container.RemoveAndDeleteChildren();

        // Create portrait for player 0, 1 and 2
        this.playerPanels[0] = new PlayerPortrait(container, "npc_dota_hero_juggernaut", "Player0");
        this.playerPanels[1] = new PlayerPortrait(container, "npc_dota_hero_omniknight", "Player1");
        this.playerPanels[2] = new PlayerPortrait(container, "npc_dota_hero_invoker", "Player2");

        // Listen for health changed event, when it fires, handle it with this.OnHPChanged
        GameEvents.Subscribe<HPChangedEvent>("hp_changed", (event) => this.OnHPChanged(event));
    }

    // Event handler for HP Changed event
    OnHPChanged(event: HPChangedEvent) {
        // Get portrait for this player
        const playerPortrait = this.playerPanels[event.playerID];

        // Set HP on the player panel
        playerPortrait.SetHealthPercent(event.hpPercentage);
    }
}

let ui = new ExampleUI($.GetContextPanel());
~~~

We simply bound a handler for the `hp_changed` event in the constructor of our ExampleUI, and whenever that happens OnHPChanged is called, which looks up the player portrait in the map and calls SetHealthPercent on the portrait.

## Summary

To conclude, I hope to have convinced you TypeScript helps to write readable, modular UI scripts in Panorama. TypeScript helps you by finding typing errors before you compile, and even prevents errors by taking scoping into account. On top of that the code completion for the panorama API is very useful. The more I use TypeScript to write Panorama, the more I am impressed by how useful it is. Hopefully you give it a try and discover for yourself.
