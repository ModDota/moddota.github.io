---
title: Beginners Guide to Dota Scripting
author: Noya
steamId: 76561198046984233
date: 18.02.2015
category: Beginners
---

Part 2 of [Getting Started With Dota 2 Modding](/articles/getting-started-with-dota-2-modding), this tutorial is meant to explain the basics of programming Dota 2 custom mods.

## Scripting
 
So now you have your freshly created gamemode running and have played around the map editor a bit, it’s time to move into the programming realm of Dota 2 custom maps.
 
Go into your <addonName>/scripts/ folder. The 2 main script folders are **npc** and **vscripts**. The first holds the following .txt files:
 
* npc_**abilities**_custom.txt - Contains all the custom abilities of the gamemode.
* npc_**heroes**_custom.txt - Heroes with its abilities and stats
* npc_**items**_custom.txt - Items are abilities that go into a units inventory
* npc_**units**_custom.txt - All the data for non-hero units like buildings or creatures.
* npc_**abilities**_override.txt - Modified dota abilities/items with changed values.
* **herolist**.txt - List of the heroes available for picking.
 
These files are defined using KeyValues (KV) and are the core of the the **DataDriven system**. While they fulfill the definition of a programming language, it’s more like a big table containing all the possible data in a static document. it uses a relatively simple syntax whose only special characters are curly braces and quotes, with alternating sets of "Key" and "Value" or "Key" {table} pairs, where table is another set of KeyValues.

KV will define the structure of abilities/items/units, while more elaborate behavior is handled with Lua.
 
Each .txt file contains its particular KVs, and when the game starts, each client (and server) will interpret them. Changes to these files won’t take effect until the game is started again, so be very aware of the syntax, as any extra/missing `"` or `{` `}` will usually make all the keyvalues that come after this error unusable. Consistent [indentation](https://en.wikipedia.org/wiki/Indent_style) is a good practice to learn early! KV is case-sensitive, so also pay attention to write everything like the game expects you to write.
 
Now it’s a good time to get your environment ready to write Dota Scripts. For this, the best way is getting Sublime Text Editor, with these 2 snippet plugins that add completions for some commonly used functions and proper syntax coloring for KV and Lua.
 
* [Sublime Text 3](http://www.sublimetext.com/3)
* [Sublime Text KeyValues Package](https://github.com/bhargavrpatel/dota_kv#installation)
* [Sublime Text Lua Package](https://github.com/bhargavrpatel/Dota-2-Sublime-Packages#installation)
 
This will be just an introductory example to the datadriven system, to understand what goes where and how to expand it.
 
Start a new document in Sublime and make sure you are using Dota KV as the Syntax (press Ctrl+Shift+P and write down Dota KV to select it quickly).
 
We’ll be making a very simple ability that does single target damage. Start by writing the name of the ability between "" and no spaces. Then write BaseClass... and press Enter to insert the completion. Move through the different fields with Tab.
 
![img](http://puu.sh/g1Aks/252bb32b2d.png)
 
A `"BaseClass"` is essential to every datadriven definition, it orders the game to interpret this ability/item/unit in a certain way- in this case as a datadriven ability. Stock Dota 2 Items, units and heroes have their own base classes which have "hard-coded" behavior that we as modders can't change much.
 
AbilityTextureName can be a custom icon or any internal name of a dota ability, for example lina_laguna_blade.
 
Other essential KV is the AbilityBehavior, write down AbilityB and use the autocomplete

![img](http://puu.sh/g1AtQ/cda16f7138.png)
 
![img](http://puu.sh/g1Avn/65fe86524c.png)
 
Then we need an ability **event**, this is a trigger for when certain event happens to the owner of the ability. The most basic one is `OnSpellStart`, add one with the completions and you’ll see a new "level" within { } is created, this is known as a block. In [ACTIONS], write down a "Damage" action, some keys and a `%AbilityDamage` will appear. A % represents a value to be taken from somewhere else, in this case, an AbilityDamage KV. Add this last key and this first basic spell should be like this:
 
~~~
"test_ability"
{
        "BaseClass"             "ability_datadriven"
        "AbilityTextureName"    "lina_laguna_blade"
        "MaxLevel"                      "1"
 
        "AbilityBehavior"       "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET"
        "AbilityUnitTargetTeam" "DOTA_UNIT_TARGET_TEAM_ENEMY"
        "AbilityUnitTargetType" "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC"
        "AbilityUnitDamageType" "DAMAGE_TYPE_MAGICAL"
 
        “AbilityDamage”         "500"
 
        "OnSpellStart"
        {
                "Damage"
                {
                        "Target"        "TARGET"
                        "Type"          "DAMAGE_TYPE_MAGICAL"
                        "Damage"        "%AbilityDamage"
                }
        }
}
~~~
 
Now, this ability has to be added to the npc_abilities_custom.txt file for a hero or unit to be able to use it. To do this, you can either edit the file directly, or use modkit.

If editing the file directly, take extra care at the level of brackets you're using. (Sublime Text protip: use Ctrl + [ or ] to move selected blocks of text left and right through layers of tabs)

Alternatively using [ModKit](https://github.com/Myll/Dota-2-ModKit) you can choose to "break" this file in separate files and folders (abilities/items/units/heroes), using **Combine KV** it will merge the contents of the folders on to the npc custom files. Working with many small key value files is easier to maintain and debug in case of errors. Beware that if using modkit to combine KV files in this way, you should only edit the broken-up versions, as manual edits made to the final .txts themselves will be lost the next time you combine.

After following this process for the test_ability you just created, it’s time to add the ability to a hero. Open npc_heroes_custom.txt and change the "Ability1" value "example_ability" to "test_ability" (the ability we just made), save and it’s ready to be tested ingame.
 
Whenever you need a testing dummy, you can create one by writing
 
`-createhero (unit_name) enemy`
 
in chat, unit_name being one of the available hero names pickable or just any unit name available. It also accepts shortened names, like “ancient” instead of “ancient_apparition”. One quick command is `-createhero kobold enemy` which makes a default enemy neutral kobold. The full unit name is “npc_dota_neutral_kobold”, but the shorter command will do. You can also enable no-cooldown mode by writing `-wtf` (and `-unwtf` will disable it).
 
Extensive documentation and in-depth examples of the datadriven system can be found in the following links spread over various moddota tutorials.
 
### [Datadriven Ability Breakdown](http://moddota.com/forums/discussion/14/datadriven-ability-breakdown-documentation)

### [Datadriven Items](http://moddota.com/forums/discussion/4/datadriven-items)

### [Datadriven Units](/articles/datadriven-units)
 
<br><br>

## Lua Scripting
 
Going back to the game/scripts folder, there’s the **vscripts** folder. Here is the place where all the Lua scripts are placed. Lua is fairly easy to pick up and its syntax is very straightforward. For the most part, programming in Dota Lua is just knowing which API functions to use (more on this later).

There's 4 applications for Lua in Dota:

- Game Logic
- DataDriven RunScript
- Hammer I/O
- Custom UI Events
 
### Game Logic - Barebones Structure
 
To understand the core structure of the Dota Lua environment, I’ll be explaining the contents of a simplified Barebones. Get one of these from [this repository](https://github.com/MNoya/barebones/), and head to the vscripts folder.
 
In every single gamemode, a file named addon_game_mode.lua must be present. While it is possible to add the game logic to this file (and in fact, valve did so in their holdout example), it is recommended that you reserve this file only for this 3 functions:
 
- `Require`, here we put all the necessary files that will be used by the game logic, treated as libraries, meaning all the functions inside those files can be used at any point.
- `Precache`, when the game starts and players pick their heroes, the engine will try to load the associated models/particles/sounds to those heroes. If we’re dynamically using a resource in Lua before preloading it won’t be displayed properly.
- `Activate`, creates the base game mode entity and calls the initialize function.

![img](http://puu.sh/g2pUC/ca4413cc48.png) <br> Precache function was folded in sublime

Using our barebones, you don’t need to touch this file apart from very specific situations, and all the core game logic will be coded in barebones.lua, which has been already required. We’ll call this your *main lua file* from now on.
 
**Note:** For the more advanced starting template you should use BMD’s Barebones, this basic Barebones was specially designed for explaining the essential parts of the Dota Lua structure.
 
After addon_game_mode `Precache` & `Activate` are finished, the first function to be executed in the barebones.lua file is `GameMode:InitGameMode()`.
 
In here the game starts by initializing all sorts of rules and functions, which are registered over the GameRules and GameMode entities. For this, many variables are defined on top of the file to help organizing options like gold settings, kills, custom levels, etc.
 
This is the syntax of a function applied over GameRules, with one bool parameter:
 
`GameRules:SetHeroRespawnEnabled( ENABLE_HERO_RESPAWN )`
 
Just as KV, Lua is Case Sensitive. Also the placement of the functions within your main Lua file doesn’t generally matter. All the script lines within a function call will be run one after another, potentially on the same *frame*; one frame in Dota is 1/30 of a second.
 
Note the use of `:` colon before the function. In Lua, this is how we access the various **Game API functions**. We say that `GameRules` is an **HScript** or a **handle**. Handles are basically huge tables, with all the pertinent info of the entity. Over the [Scripting API page](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/API) you’ll see many different types of functions which can use different handles
 
Global functions don’t need any handle `:` prefix. Heroes, Creatures, Abilities and Items all have their different handle classes and attempting to call a function over an incompatible class will cause a VScript error, as pink text in console and red text on the gamescreen.
 
### The Console
 
You can access the game console by pressing the ` key.
 
This will provide tons of useful information for debugging. The different colors represent the various “channels” of information. By default all the channels are in the same Log: Default tab. It’s very recommended that you make your own tabs to split the log viewer.
 
![img](http://i.imgur.com/y2BUNcS.png)
 
For Lua Scripting, we want to have a VScript Tab. Messages about the DataDriven system are in the General channel in yellow along with some other info, make a separate viewer for this too.
 
![img](http://puu.sh/g2nWY/22554172f6.png)

The new tabs:

![img](http://puu.sh/g2o1O/b46e113293.png)
 
The console will notify whenever a Lua scripting error happens, either when the game is being loaded (a syntax-compilation error) or at runtime. In this error, I wrote GameRules.SetHeroRespawnEnabled with `.` instead of `:`

![img](http://puu.sh/g2jo2/6c85128308.png)

You can then trace the error to that line and attempt to solve it, writing **script_reload** in the console to reload the script and check if it was actually fixed.

A DataDriven syntax error will usually look like this:

![img](http://puu.sh/g3HVp/27ef775669.png)

<br>

### Engine Events
  
The second segment of the InitGameMode function is the **Listeners**:
 
`ListenToGameEvent('dota_player_gained_level', Dynamic_Wrap(GameMode, 'OnPlayerLevelUp'), self)`
 
The structure of this ListenToGameEvent is read as:

**Whenever the dota_player_gained_level event is triggered, execute the scripts inside the OnPlayerLevelUp function.**

`OnPlayerLevelUp` and `GameMode` are just the names of the function and main class name, normally you don’t need to worry about them, all Listeners and functions are already available in barebones, ready to be expanded. `Dynamic_Wrap` is a function to ensure that the `script_reload` command also reloads the listeners. `script_reload` restarts lua scripts at runtime, unlike DataDriven files which require the game to be fully restarted. As you can see on the barebones example there are tons of possible events, and not all of them are listed there, those are just the most used ones.
 
The 3rd and last main element of `InitGameMode` are self defined variables to track info. These use the `self.` entity, which is a local reference to the GameMode entity, seen through all the functions inside the main lua file. Adding information to an entity like `entity.` is loosely called “indexing” and is basically adding another entry to the big table of that entity. This is very useful because this information is stored under the entity handle visible everywhere, and won’t change until we reassign it or destroy it.
 
Enough theory, let’s see how this all comes together. We’ll add some simple script lines to the OnNPCSpawned function, which is the listener for `npc_spawned` and triggers every time a unit or hero entity is added to the map.
 
Let’s analyze the contents of the `OnNPCSpawned` default function:
 
~~~lua
-- An NPC has spawned somewhere in game.  This includes heroes
function GameMode:OnNPCSpawned(keys)
        print("[BAREBONES] NPC Spawned")
        DeepPrintTable(keys)
        local npc = EntIndexToHScript(keys.entindex)
 
        if npc:IsRealHero() and npc.bFirstSpawned == nil then
                npc.bFirstSpawned = true
                GameMode:OnHeroInGame(npc)
        end
end
~~~
 
First line will print the string under "" in the VConsole. The print function is native to Lua, and accepts multiple parameters separated by commas, and concatenation of strings with `".."` like this:
 
`print("[BAREBONES]".."NPC","Spawned")`
  
`DeepPrintTable` is a Global Valve-made function which will display the information of the table passed. For keys in this case, it will be the .entindex and .splitscreenplayer. The **entity index** is a very important number to reference the entity. Ignore splitscreenplayer, it’s just legacy source stuff and never used in Dota 2.
 
![img](http://puu.sh/g2iLY/54583b0b65.png)
 
The next line defines a local variable. In Lua local variables have their scope limited to the block where they are declared. It is good programming style to use local variables whenever possible. Local variables help you avoid cluttering the global environment with unnecessary names. Moreover, access to local variables is faster than to global ones.
 
`local npc = EntIndexToHScript(keys.entindex)`
 
This is basically reading the information that is provided by the event, and storing it into a local variable within that function call. In this example all the Listener and their functions have already been processed, but for reference you can always check the [Built-In_Engine_Events wiki page](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/Built-In_Engine_Events) to know exactly what parameters are carried by each event.
 
The npc local variable is an HScript, of handle type. All changes done into the npc variable will reflect on spawned unit.
 
The next line is a conditional, first it checks if the npc is a real hero (this excludes illusions) and it also checks if the .bFirstSpawned index (a self-defined variable) has not been assigned yet. If both conditions are true, changes the boolean value to true and calls the OnHeroInGame function.
 
To finish this basic Dota Lua tutorial, let’s modify the OnNPCSpawned function so that if a unit named npc_dota_neutral_kobold is spawned, wait 1 seconds and then kill itself. Added to the first if statement there’s this else-if condition:
 
~~~lua
function GameMode:OnNPCSpawned(keys)
   local npc = EntIndexToHScript(keys.entindex)
 
   if npc:IsRealHero() and npc.bFirstSpawned == nil then
       npc.bFirstSpawned = true
       GameMode:OnHeroInGame(npc)
   elseif npc:GetUnitName() == "npc_dota_neutral_kobold" then
       Timers:CreateTimer( 1.0 , function()
           npc:ForceKill(true)
       end)
    end
end
~~~
 
Here we make use of the Timers library for a simple 1.0 second delay, there are many different timer functions included and explained in timers.lua. The bool on ForceKill is to enable the death animation.

{% include gfycat.html id="DigitalDefinitiveChimpanzee" %}
 
 
### Tables. <a name="tables">
 
Tables are the most important structure we will have to use. As mentioned before, all the info on entities can be seen as a table (even though it's technically a pointer to a C++ object), and you Get and Set the values through the various Game API functions.

There are some functions in the API that return a table of entity handles. 

Let say you want to find all the units near the spawned kobold unit and kill them. The function `FindUnitsInRadius` can be used for this purpose, and takes a lot of parameters with different types which is worth explaining:

`table FindUnitsInRadius(int teamNumber, Vector position, handle cacheUnit, float radius, int teamFilter, int typeFilter, int flagFilter, int order, bool canGrowCache)`

The parameters Have to be in this order. This function is a global, so no `handle:` needed, but we need to keep the table under a variable, like this:

`local units = FindUnitsInRadius(...)`

For the teamNumber, finding out which team an entity is in can be done with `GetTeamNumber()` on the npc handle. As for the other Filter parameters, instead of real integers, we use a bunch of **Constants** that represent different number values. The complete list of Constants is [found on this wiki page](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/Constants).

A Vector is represented as Vector(x,y,z) coordinates. The function to get the position of  particular unit is called `GetAbsOrigin` and takes a npc handle.

As for the cache parameters, just leave it nil and false, they aren't of much use generally.

The complete function call to get the heroes in 500 radius from the spawned kobold would be:

~~~lua
local units = FindUnitsInRadius( npc:GetTeamNumber(), npc:GetAbsOrigin(), nil, 500, 
                                 DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_HERO, 
			         DOTA_UNIT_TARGET_FLAG_NONE, FIND_ANY_ORDER, false)
~~~

The use of extra break lines is just to make it more readable. Now we want to **iterate over the entities of this table**, which is done like this:

~~~lua
for key,unit in pairs(units) do
    print(key,value)
    unit:ForceKill(true)
end
~~~

The key,unit are the chosen names to refer to the position and value inside the *units* table, which will be read in pairs. Using '_' as the name of the key is a good convention when you want to make it clear that the first parameter wont be used. The 2nd parameter, unit, is used to itea handles of the units found.

There is one more thing to consider: the "wait one frame" issue. Because all units are actually spawned at the (0,0,0) coordinates and then moved to the desired position, many times you'll need to create a 0.03 second timer (1 frame) for some scripts to work, and this is one of those cases.

So, `OnNPCSpawned` is looking like this:

~~~lua
function GameMode:OnNPCSpawned(keys)
    local npc = EntIndexToHScript(keys.entindex)
 
    if npc:IsRealHero() and npc.bFirstSpawned == nil then
        npc.bFirstSpawned = true
        GameMode:OnHeroInGame(npc)
    elseif npc:GetUnitName() == "npc_dota_neutral_kobold" then
        Timers:CreateTimer(0.03, function() 
            local units = FindUnitsInRadius( npc:GetTeamNumber(), npc:GetAbsOrigin(), nil, 500, 
	               		DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_HERO, 
	         		DOTA_UNIT_TARGET_FLAG_NONE, FIND_ANY_ORDER, false)
	      
	    for key,value in pairs(units) do
	        print(key,value)
	        value:ForceKill(true)
            end
        end)
    end
end
~~~

And the result ingame:

{% include gfycat.html id="SkeletalIcyDalmatian" %}



## DataDriven RunScript

The 2nd application for Lua in Dota 2 Modding is the `"RunScript"` Action, which can be called from any DataDriven Event to connect the ability or item with with a Lua Script File
 
RunScript creates a new instance of the lua file, so.globals don’t really apply here, all variables should be either local and/or assigned to a handle.
 
Splitting the lua files for each ability is a good idea as it also helps splitting the ability scripts just like with the txt files
 
Let’s go back to the first super simple single target damage datadriven ability and add this block to the OnSpellStart ability event:
 
The Syntax is like this:

![img](http://puu.sh/g2x6h/d16e2db05b.png)
 
ScriptFile route is relative to the /vscripts/ folder. AbilityName is the name of the lua function inside that file.

Let's go back to the [super basic datadriven ability](##basicability) and add a RunScript block for a ScriptFile in a subfolder. Unlike the general Game Logic, it's recommended to separate the lua files for each ability script, and in different folders to separate heroes, units, items, etc. At the end, organization is up to you.

Adding this block to a DD Event like OnSpellStart will make a new instance of the example_script and execute the lines defined in function ScriptedAbility.

~~~
"RunScript"
{
    "ScriptFile"	"heroes/example_script.lua"
    "Function"		"ScriptedAbility"
}
~~~

In your vscripts folder, make a heroes folder and a example_script file with a .lua extension. I recommend setting these files to automatically open with Sublime, and set the syntax to Dota Lua.

In this example script, the event will pass some information to the first parameter of the functions, which can have any name but you'll see most refer to this parameter as `keys` or `event`.

![img](http://puu.sh/g2y9i/dfb5db78c9.png)

In the body, most ability scripts start by defining the local variables for the target entities which are passed by the event. This is explained more deeply in the guide [All About The Target](moddota.com/forums/discussion/87/all-about-the-target), but the basic target variables visible on any script are

* **.caster**, the entity that started the ability.
* **.target**, the target of the ability (can be same as the caster in some cases)

**Example**
~~~lua
function ScriptedAbility( event )
    local caster = event.caster
    local target = event.target

    if target:GetHealthPercent() < 50 then
        target:Kill(nil, caster) -- Kills this NPC, with the params Ability and Attacker
    end
end
~~~

This will kill the targeted unit if its Health percent is less than half, and credits the kill to the caster entity.

<br>

<a name="#examples"/></a>
## Scripting Examples and Sources

There are plenty of examples spread all across GitHub and with the contents of this guide you should now be able to understand the scripting flow of game logic and scripted abilities. The best GitHub repo to look for ability scripts is [SpellLibrary](https://github.com/Pizzalol/SpellLibrary), a community project to rewrite every dota ability using KV and Lua.

If you want to check the scripts of a certain game on the [Custom Games Workshop](http://steamcommunity.com/workshop/browse/?appid=570&browsesort=trend&section=readytouseitems) which hasn't made their source public on GitHub (because they are fools), just follow these steps:

1. Subscribe to the game. Download GCFScape if you haven't done so yet, it can be found in [moddota's tools list on the nav-bar](https://moddota.com/forums/tools)
2. Check the URL, steamcommunity.com/sharedfiles/filedetails/?id=**copy this number**
3. Go to your Steam folder -> SteamApps -> workshop -> content -> 570 (this is the dota folder)
4. Search for the copied number folder
5. Open the .vpk file with GCFScape and extract its contents anywhere you want. Now you can access its scripts and compiled models/particles/sounds.

![img](http://puu.sh/g2zNP/d1e018010e.png)

Whenever you have a doubt about how to use a particular GameAPI function, its possible to find examples all over GitHub by just writing the name of it, additionally filtering by lua like this:

![img](http://puu.sh/g2yTG/93f1641866.png)

Just make sure it's actually Dota Lua and not another game API, as some of the functions might share names with other engines.

That's all for the Scripting basics. I expect you to have more questions than when you started reading, feel free to drop all your doubts at the community's [Discord channel](https://discord.com/invite/tPvHaRz), you'll find help there 24/7. 

---
 
