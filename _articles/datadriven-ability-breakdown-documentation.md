---
title: DataDriven Ability Breakdown - Documentation
author: Noya
steamId: 76561198046984233
date: 10.12.2014
category: Scripting
---

[![img](http://i.imgur.com/JTVv40S.png)](#datadriven-ability "Get started")
[![BaseClass](http://i.imgur.com/KI6fmyE.png)](#baseclass "BaseClass ability_datadriven")
[![Behavior](http://i.imgur.com/ujvVUCw.png)](##type "Main behavior property of the ability")
[![Ability Type](http://i.imgur.com/far760I.png)](##type "Basic, Ultimate and other Leveling rules")
[![Icon Texture](http://i.imgur.com/a1Kogu4.png)](##icon "Set the Spell Icon in the interface")
[![UnitTarget](http://i.imgur.com/8EsWKFO.png)](##target "Targeting options")
[![Team](http://i.imgur.com/hiWGRJq.png)](##targetTeam "Target Teams")
[![Type](http://i.imgur.com/jqo3t4O.png)](##targetType "Target Type of units")
[![Flags](http://i.imgur.com/FC0IEBp.png)](##targetFlags "Ignore or include targets with Flags")
[![Damage Type](http://i.imgur.com/WwwNkbj.png)](##damage "Damage type of the ability")
[![Cast Animation](http://i.imgur.com/ewEWcom.png)](##animation "Animation when the spell starts casting")
[![General Stats](http://i.imgur.com/5mO6j4Z.png)](##stats "General numeric values")
[![Others](http://i.imgur.com/z73NEKo.png)](##others "Other less common values")
[![Ability Special](http://i.imgur.com/3ynaE40.png)](##special "AbilitySpecial block, used for variables")
[![precache](http://i.imgur.com/qKW3Xs4.png)](##precache "Precache block, used to preload assets")
[![Ability Events](http://i.imgur.com/6IFhMIu.png)](##abilityevents "Triggers on the ability to perform Actions")
[![Modifiers](http://i.imgur.com/XEFsYCD.png)](##modifiers "Effects that can be applied on units")
[![Properties Block](http://i.imgur.com/HFXTmij.png)](##properties "Give numeric stat values for the duration of the modifier")
[![States Block](http://i.imgur.com/ACfQMmq.png)](##states "Enable or Disable certain states on units")
[![Modifier Events](http://i.imgur.com/LWPALN8.png)](#modifierevents "Triggers on the modifier to perform Actions")

<br><br>

# DataDriven Ability
A DataDriven ability is a collection *KeyValues*. KeyValues are simple, tree-based structures used for storing nested sections containing key/value pairs.

DataDriven abilities are defined inside scripts/npc/npc_abilities_custom.txt under a game addon folder.

This skeleton contains many keyvalues which will be expanded upon in this documentation.

~~~
"datadriven_skeleton"
{
    // General  
    // ----------------------------------------------------------------------------------------
    "BaseClass"              "ability_datadriven"
    "AbilityBehavior"        "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET"
    "AbilityTextureName"     "spellicon"
    "AbilityUnitTargetTeam"  "DOTA_UNIT_TARGET_TEAM_ENEMY"
    "AbilityUnitTargetType"  "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC"
    "AbilityUnitTargetFlags" "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES"
    "AbilityUnitDamageType"  "DAMAGE_TYPE_MAGICAL"

    "AbilityType"            "DOTA_ABILITY_TYPE_BASIC"
    "MaxLevel"               "7"
    "RequiredLevel"          "-4"
    "LevelsBetweenUpgrades"  "7"

    "AbilityCastPoint"       "0.0"
    "AbilityCastAnimation"   "ACT_DOTA_ATTACK"
    "AnimationPlaybackRate"  "1"
    "AnimationIgnoresModelScale" "1"

    // Stats
    //----------------------------------------------------------------------------------------
    "AbilityDamage"           "0 0 0 0"
    "AbilityManaCost"         "0 0 0 0"
    "AbilityCooldown"         "0.0 0.0 0.0 0.0"
    "AbilityCastRange"        "0"
    "AbilityCastRangeBuffer"  "250"
    "AbilityChannelTime"      "0.0 0.0 0.0 0.0"
    "AbilityChannelledManaCostPerSecond" "30 35 40 45"
    "AbilityDuration"         "0.0 0.0 0.0 0.0"
    "AoERadius"               "250"

    // ...
}
~~~

# BaseClass

BaseClass can be any default dota ability name or "ability_datadriven", which allows the use of the entire data driven ability system.

Using a dota ability as the BaseClass can be done either as an override of the ability (goes in npc_abilities_override.txt) or just as a new ability in npc_abilities.custom.txt which inherits the exposed variables. This however doesn't let us change/add its internal structure, as that code is locked in C++ code.

Here we'll focus on everything that concerns writing custom abilities from scratch, using the `"BaseClass" "ability_datadriven"`.

# AbilityBehavior

This describes how the ability works, the general behavior to perform when it is executed.

You can use different behaviors together, separated by spaces and | pipes.

Example:
~~~
"DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_NO_TARGET"
~~~
## List of every possible AbilityBehavior

|**AbilityBehavior**|**Description**  |
|-------|-------|
|DOTA_ABILITY_BEHAVIOR_NO_TARGET|	Doesn't need a target to be cast. <br/> Ability fires off as soon as the button is pressed.|
|DOTA_ABILITY_BEHAVIOR_UNIT_TARGET|Needs a target to be cast on. <br/> Requires `AbilityUnitTargetTeam` and `AbilityUnitTargetType`, see Targeting.|
|DOTA_ABILITY_BEHAVIOR_POINT|Can be cast anywhere the mouse cursor is. <br/> If a unit is clicked, it will just be cast where the unit was standing.|
|DOTA_ABILITY_BEHAVIOR_PASSIVE|Cannot be cast.|
|DOTA_ABILITY_BEHAVIOR_CHANNELLED|Channeled ability.<br/>If the user moves, or is silenced/stunned, the ability is interrupted.|
|DOTA_ABILITY_BEHAVIOR_TOGGLE|Can be toggled On/Off.|
|DOTA_ABILITY_BEHAVIOR_AURA|Ability is an aura.<br/>Not really used other than to tag the ability as such.|
|DOTA_ABILITY_BEHAVIOR_AUTOCAST|Can be cast automatically.<br/>Usually doesn't work by itself in anything that is not an ATTACK ability.|
|DOTA_ABILITY_BEHAVIOR_HIDDEN|Can't be cast, and won't show up on the HUD.|
|DOTA_ABILITY_BEHAVIOR_AOE|Can draw a radius where the ability will have effect.<br/>Like POINT, but with an area of effect display.<br/>Makes use of `AOERadius`.|
|DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE|CAnnot be learned by clicking on the HUD.<br/>Example: Invoker's abilities.|
|DOTA_ABILITY_BEHAVIOR_ITEM|Ability is tied to an item. There is no need to use this, the game will internally assign this behavior to any `"item_datadriven"`.|
|DOTA_ABILITY_BEHAVIOR_DIRECTIONAL|Has a direction from the hero.<br/>Examples: Mirana's Arrow, or Pudge's Hook.|
|DOTA_ABILITY_BEHAVIOR_IMMEDIATE|Can be used instantly, without going into the action queue.|
|DOTA_ABILITY_BEHAVIOR_NOASSIST|Ability has no reticle assist. (?)|
|DOTA_ABILITY_BEHAVIOR_ATTACK|Is an attack, and cannot hit attack-immune targets.|
|DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES|Cannot be used when rooted.|
|DOTA_ABILITY_BEHAVIOR_UNRESTRICTED|Ability is allowed when commands are restricted.<br/>Example: Lifestealer's Consume.|
|DOTA_ABILITY_BEHAVIOR_DONT_ALERT_TARGET|Does not alert enemies when target-cast on them.<br/>Example: Spirit Breaker's Charge.|
|DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT|Should not resume movement when it completes.<br/>Only applicable ot no-target, non-immediate abilities.|
|DOTA_ABILITY_BEHAVIOR_DONT_RESUME_ATTACK|Ability should not resume command-attacking the previous target when it completes.<br/>Only applicable to no-target, non-immediate abilities and unit-target abilities.|
|DOTA_ABILITY_BEHAVIOR_NORMAL_WHEN_STOLEN|Ability still uses its normal cast point when stolen.<br/>Examples: Meepo's Poof, Furion's Teleport.|
|DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING|Ability ignores backswing pseudoqueue.|
|DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE|Can be executed while stunned, casting, or force-attacking. Only applicable to toggled abilities.<br/>Example: Morphling's Attribute Shift.|
|DOTA_ABILITY_BEHAVIOR_RUNE_TARGET|Targets runes.|
|DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL|Doesn't cancel abilities with `_CHANNELED` behavior.|
|DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET|Bottle and Wards.|
|DOTA_ABILITY_BEHAVIOR_OPTIONAL_NO_TARGET|(?)|

## Behavior Tooltips

The following behaviors will generate a line in the ability tooltip. You want at least one of 1 behavior of this list. The rest of the ability behaviors don't have any UI support yet.

The UI can only show one behavior tooltip, but internally it will behave as expected, as long two contradicting keys are not used together (like *NO_TARGET* with *UNIT_TARGET*).

|**AbilityBehavior**|**ABILITY: *Tooltip***|**Takes precdence over:**|
|-|-|-|
|DOTA_ABILITY_BEHAVIOR_NO_TARGET|**No Target**||
|DOTA_ABILITY_BEHAVIOR_UNIT_TARGET|**Unit Target**|POINT|
|DOTA_ABILITY_BEHAVIOR_POINT|**Point Target**||
|DOTA_ABILITY_BEHAVIOR_PASSIVE|**Passive**||
|DOTA_ABILITY_BEHAVIOR_CHANNELLED|**Channeled**|POINT and UNIT|
|DOTA_ABILITY_BEHAVIOR_TOGGLE|**Toggle**|POINT and UNIT|
|DOTA_ABILITY_BEHAVIOR_AURA|**Aura**|PASSIVE|
|DOTA_ABILITY_BEHAVIOR_AUTOCAST|**Auto-Cast**|UNIT_TARGET|

For example, an ability with 
~~~
"AbilityBehavior" "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_CHANNELED"
~~~
will be shown like this:

![img](https://i.imgur.com/xYjIXM8.jpg)

# AbilityType

Omitting this will default to DOTA_ABILITY_TYPE_BASIC.

|**AbilityType**|**Description**|
|-|-|
|DOTA_ABILITY_TYPE_BASIC|Normal ability, learnable at level 1 and upgradeable every 2 levels.|
|DOTA_ABILITY_TYPE_ULTIMATE|5 levels between upgrades, and requires level 6 to spend the first point on it.<br/>Also tags the ability as ultimate for the HUD.|
|DOTA_ABILITY_TYPE_ATTRIBUTES|Used for attribute_bonus.|
|DOTA_ABILITY_TYPE_HIDDEN|What for?|

Additionally, ability level intervals and limits can be directly changed with these keyvalues inside the ability block:

## MaxLevel

The UI currently supports the following ability level displays: 1, 3, 4, and 7.

You can still use any integer value as MaxLevel, and it will assign the proper level values internally, but it will use a combination of these UI display numbers, then "start again" to another UI.

*Example*:
~~~
"MaxLevel" "10"
~~~

## RequiredLevel

At which level the ability can first be learned. This takes negative values, to enable for skills to be skilled at any point, because the next value sets the levels between ranks of the ability, including the first one.

## LevelsBetweenUpgrades

How many levels to wait to be able to learnt he next rank.

*Example*:
~~~
"MaxLevel"              "7"
"RequiredLevel"         "-4"
"LevelsBetweenUpgrades" "7"
~~~

Results in an ability that can be first skilled at levels 3/10/17/24/31/38/45.

Max level of the heroes can be changed using the Lua `SetCustomHeroMaxLevel(MAX_LEVEL)` [API function](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/API).

# AbilityTextureName

The icon file name that should be used in the UI for this ability. You can reutilize the icon from another just by putting that ability name here if desired. The internal name of every default dota ability can be found in: [Built-In Ability Names](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/Built-In_Ability_Names).

To use your own icons, place them in `resources/flash3/images/spellicons` in you game addon folder, and just directly refer to the image name without the path or the extension.

**Format**: 128x128 PNG
~~~
"AbilityTextureName" "warchasers_buff"
~~~
![img](https://i.imgur.com/PvTBUis.png)

# Recject Self-Cast

Added in Reborn:

~~~
"CastFilterRejectCaster" "1"
~~~

## Cast While Hidden

Added in Reborn:

~~~
"IsCastableWhileHidden" "1"
~~~

**Sources**

* [Constants wiki](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/Constants)
* [Abilities Data Driven wiki](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/Abilities_Data_Driven)
* Extracted [npc_abilities.txt](https://raw.githubusercontent.com/dotabuff/d2vpk/master/dota_pak01/scripts/npc/npc_abilities.txt) file
* holdout_example keyvalues
* random [github](https://github.com/) datamining
* brute-forcing everything for countless hours!

---

If you have any content to expand or improve this documentation, please let me know.

---
