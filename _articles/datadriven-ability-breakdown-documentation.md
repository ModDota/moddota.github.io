---
title: DataDriven Ability Breakdown - Documentation
author: Noya
steamId: 76561198046984233
date: 10.12.2014
category: Scripting
---

[![img](http://i.imgur.com/JTVv40S.png)](#datadriven-ability "Get started")
[![BaseClass](http://i.imgur.com/KI6fmyE.png)](#baseclass "BaseClass ability_datadriven")
[![Behavior](http://i.imgur.com/ujvVUCw.png)](#abilitybehavior "Main behavior property of the ability")
[![Ability Type](http://i.imgur.com/far760I.png)](#abilitytype "Basic, Ultimate and other Leveling rules")
[![Icon Texture](http://i.imgur.com/a1Kogu4.png)](#abilitytexturename "Set the Spell Icon in the interface")
[![UnitTarget](http://i.imgur.com/8EsWKFO.png)](#targeting "Targeting options")
[![Team](http://i.imgur.com/hiWGRJq.png)](#team "Target Teams")
[![Type](http://i.imgur.com/jqo3t4O.png)](#type "Target Type of units")
[![Flags](http://i.imgur.com/FC0IEBp.png)](#flags "Ignore or include targets with Flags")
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

## Reject Self-Cast

Added in Reborn:

~~~
"CastFilterRejectCaster" "1"
~~~

## Cast While Hidden

Added in Reborn:

~~~
"IsCastableWhileHidden" "1"
~~~

# Targeting

3 key elements set the rules for target selection: **Team**, **Type**, and **Flags**.

## [AbilityUnitTargetTeam](#team)
## [AbilityUnitTargetType](#type)
## [AbilityUnitTargetFlags](#flags)

## Team

|**AbilityUnitTargetTeam**|**Description**|
|-|-|
|DOTA_UNIT_TARGET_TEAM_BOTH|All|
|DOTA_UNIT_TARGET_TEAM_ENEMY|Enemy|
|DOTA_UNIT_TARGET_TEAM_FRIENDLY|Allied|
|DOTA_UNIT_TARGET_TEAM_NONE|Default value by omission.|
|DOTA_UNIT_TARGET_TEAM_CUSTOM|(?)|

## Type

|**AbilityUnitTargetType**|**Targets**|
|-|-|
|DOTA_UNIT_TARGET_ALL|Everything, including hidden entities.|
|DOTA_UNIT_TARGET_HERO|npc_dota_hero Heroes.<br/>DOTA_NPC_UNIT_RELATIONSHIP_TYPE_HERO|
|DOTA_UNIT_TARGET_BASIC	|Basic units, including summons.|
|DOTA_UNIT_TARGET_MECHANICAL|npc_dota_creep_siege<br/>DOTA_NPC_UNIT_RELATIONSHIP_TYPE_SIEGE|
|DOTA_UNIT_TARGET_BUILDING|npc_dota_tower, npc_dota_building<br/>DOTA_NPC_UNIT_RELATIONSHIP_TYPE_BUILDING|
|DOTA_UNIT_TARGET_TREE|ent_dota_tree<br/>Examples: Tangos, Quelling Blade.|
|DOTA_UNIT_TARGET_CREEP|npc_dota_creature, npc_dota_creep<br/>Same as BASIC, but *might* not include things like some summons.<br/>Examples: Death Pact, Devour.|
|DOTA_UNIT_TARGET_COURIER|npc_dota_courier, npc_dota_flying_courier<br/>DOTA_NPC_UNIT_RELATIONSHIP_TYPE_COURIER|
|DOTA_UNIT_TARGET_NONE|Nothing!|
|DOTA_UNIT_TARGET_OTHER|Everything not included in the previous types.|
|DOTA_UNIT_TARGET_CUSTOM|Not exposed?<br/>Examples: Replicate, Sunder, Demonic Conversion, Tether, Infest...|

## Flags

Flags allow targeting units that are ignored by default (for example, magic immune enemies,) or to ignore specific types of units that will otherwise be targetable (like Ancients, or magic immune allies.)

|**AbilityUnitTargetFlags**|**Targets / Ignores**|
|-|-|
|DOTA_UNIT_TARGET_FLAG_NONE|Default value by omission.|
|DOTA_UNIT_TARGET_FLAG_DEAD|Dead units, which are otherwise ignored.|
|DOTA_UNIT_TARGET_FLAG_MELEE_ONLY|Units with AttackCapabilities DOTA_UNIT_CAP_MELEE_ATTACK.|
|DOTA_UNIT_TARGET_FLAG_RANGED_ONLY|Units with AttackCapabilities DOTA_UNIT_CAP_RANGED_ATTACK.|
|DOTA_UNIT_TARGET_FLAG_MANA_ONLY|Units with mana, without `"StatusMana" "0"` in the npc_units file.|
|DOTA_UNIT_TARGET_FLAG_CHECK_DISABLE_HELP|Units with Disable Help on.<br/>Not sure how to make a DataDriven ability use it?|
|DOTA_UNIT_TARGET_FLAG_NO_INVIS|Ignores invisible units (with MODIFIER_STATE_INVISIBLE.)|
|DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES|Targets ENEMY units with `MODIFIER_STATE_MAGIC_IMMUNE`.<br/>Examples: Ensnare, Culling Blade, Primal Roar...|
|DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES|Ignores FRIENDLY units with `MODIFIER_STATE_MAGIC_IMMUNE`.<br/>Example: Bane's Nightmare.|
|DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE|Ignores units with `MODIFIER_STATE_ATTACK_IMMUNE`.|
|DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE|Breaks when the unit goes into the fog of war.<br/>Examples: Mana Drain, Life Drain.|
|DOTA_UNIT_TARGET_FLAG_INVULNERABLE|Units with `MODIFIER_STATE_INVULNERABLE`.<br/>Examples: Assassinate, Recall, Boulder Smash...|
|DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS|Ignores units with `"IsAncient" "1"` defined.<br/>Example: Hand of Midas.|
|DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO|Ignores units with `"ConsideredHero" "1"` defined.<br/>Examples: Astral Imprisonment, Disruption, Sunder.|
|DOTA_UNIT_TARGET_FLAG_NOT_DOMINATED|Ignores units with `MODIFIER_STATE_DOMINATED`.|
|DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS|Ignores untis with `MODIFIER_PROPERTY_IS_ILLUSION`.|
|DOTA_UNIT_TARGET_FLAG_NOT_NIGHTMARED|Ignores units with `MODIFIER_STATE_NIGHTMARED`.|
|DOTA_UNIT_TARGET_FLAG_NOT_SUMMONED|Ignores units created through the `SpawnUnit` [action](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/Abilities_Data_Driven#Actions).|
|DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD|Units with `MODIFIER_STATE_OUT_OF_GAME`.|
|DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED|Units controllable by a player, accesible with [Lua](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/API)'s `IsControllableByAnyPlayer()`.|
|DOTA_UNIT_TARGET_FLAG_PREFER_ENEMIES|Prioritizes units over trees when both are selectable.|

**Clean list**:

* DOTA_UNIT_TARGET_FLAG_NONE
* DOTA_UNIT_TARGET_FLAG_DEAD
* DOTA_UNIT_TARGET_FLAG_MELEE_ONLY
* DOTA_UNIT_TARGET_FLAG_RANGED_ONLY
* DOTA_UNIT_TARGET_FLAG_MANA_ONLY
* DOTA_UNIT_TARGET_FLAG_CHECK_DISABLE_HELP
* DOTA_UNIT_TARGET_FLAG_NO_INVIS
* DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES
* DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES
* DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE
* DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE
* DOTA_UNIT_TARGET_FLAG_INVULNERABLE
* DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS
* DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO
* DOTA_UNIT_TARGET_FLAG_NOT_DOMINATED
* DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS
* DOTA_UNIT_TARGET_FLAG_NOT_NIGHTMARED
* DOTA_UNIT_TARGET_FLAG_NOT_SUMMONED
* DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD
* DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED
* DOTA_UNIT_TARGET_FLAG_PREFER_ENEMIES

### Fun with Flags

Flags were seen as AbilityUnitTargetFlags completions, but this is not their sole application.

The same applies to Team and Types.

 * `"Flags"` and `"ExcludeFlags"` in a `"Target"` block gives control over how to target units to apply actions on them later:
 
~~~
"Target"
{
    "Center"    "CASTER"
    "Flags"     "DOTA_UNIT_TARGET_FLAG_DEAD"
}
~~~

 * `"TargetFlags"` in a `"LinearProjectile"` action allows a `LinearProjectile` to ignore units that would otherwise be included by default in the Team+Type values, for example those with `MODIFIER_STATE_INVISIBLE`.
 * `"Aura_Flags"` in a modifier with the other `"Aura"` keys can be used, for example, to make an [aura modifier](http://web.archive.org/web/20181130135800/http://moddota.com/forums/discussion/comment/29#Comment_29) only affect ranged units by adding `DOTA_UNIT_TARGET_FLAG_RANGED_ONLY`.
 
The same applies for **Teams** and **Types**.

*Example*: Targets all friendly units in a radius of the caster, including couriers, buildings, and siege units. Excludes heroes, summons, and other player controlled units.

~~~
"Target"
{
    "Center"        "CASTER"
    "Radius"        "%radius"
    
    // AbilityUnitTargetTeam values.
    "Teams"         "DOTA_UNIT_TARGET_TEAM_FRIENDLY"
    
    // AbilityUnitTargetTypes
    "Types"         "DOTA_UNIT_TARGET_ALL"
    "ExcludeTypes"  "DOTA_UNIT_TARGET_HERO"
    
    // AbilityUnitTargetFlags
    "Flags"         "DOTA_UNIT_TARGET_FLAG_NOT_SUMMONED"
    "ExcludeFlags"  "DOTA_UNIT_TARGET_FLAG_PLAYER_CONTROLLED"
}
~~~

*Example*: Mirana's Arrow projectile rewrite that only hits heroes, including those that are magic immune:

~~~
"LinearProjectile"
{
    "Target"            "POINT"
    "EffectName"        "particles/units/heroes/hero_mirana/mirana_spell_arrow.vpcf"
    "MoveSpeed"         "857"
    "StartRadius"       "115"
    "EndRadius"         "115"
    "StartPosition"     "attach_attack1"
    "FixedDistance"     "3000"
    "TargetTeams"       "DOTA_UNIT_TARGET_TEAM_ENEMY"
    "TargetTypes"       "DOTA_UNIT_TARGET_HERO"
    "TargetFlags"       "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES"
    "HasFrontalCone"    "0"
    "ProvidesVision"    "1"
    "VisionRadius"      "650"
}
~~~

With `DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES`, and with `DOTA_UNIT_TARGET_FLAG_NONE`: [comparison gfy](https://gfycat.com/floweryunevenhorseshoebat).

## Other keyvalues of the Action Target block

### Line

To target units in a line between the caster and the targeted point.

Instead of the `"Radius"` keyvalue, which only takes one parameter, `Line` takes `Length` and `Thickness` integer values in a block like this:

~~~
"Line"
{
    "Length"    "600"
    "Thickness" "250"
}
~~~

### Limiting the amount of targets

`MaxTargets` takes an integer value to limit the amount of targets the Target block will select.

~~~
"MaxTargets"    "10"
~~~

`Random` also takes an integer to be as "take up to this number of units randomly."

~~~
"Random"    "1"
~~~

(For more complex targeting, Lua scripting is the answer.)

### ScriptSelectPoints

Its use is very rare, normally when the targeting is complex we would just use `RunScript` lua and do all the acitons inside the script.

~~~
ScriptSelectPoints
{
    ScriptFile
    Function
    Radius
    Count
}
~~~

A more in-depth explanation is needed to explain the complete usage of the Target block, as understanding the *scope* of the "Target" "TARGET" keyvalue is one of the most difficult things of the datadriven system.

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
