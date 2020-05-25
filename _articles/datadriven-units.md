---
title: Datadriven Units
author: Noya
steamId: 76561198046984233
date: 22.04.2015
category: Scripting
---

This document covers every keyvalue of the npc_units_custom file

![img](http://i.imgur.com/T7W828Q.png)

* [General](##general)
* [Boolean Values and Flags](##flags)
* [Selection Properties](##selection)
* [Sounds](##sounds)
* [Abilities](##abilities)
* [Stats](##general)
* [Bounds](##bounds)
* [Movement](##movement)
* [Health and Mana](##healthmana)
* [Armor and Attack Types](##armorattack)
* [Vision](##vision)
* [Lua VScript AI](##AI)
* [Creature Block](#Comment_763)
  * [AttachWearables](##wearables)

## General

Most unit names start with "npc_" but this isn't necessary. A basic unit definition looks like this:

http://pastebin.com/KB7EsSLF

The definition of the default dota units can be found in [npc_units.txt](https://github.com/dotabuff/d2vpk/blob/master/dota_pak01/scripts/npc/npc_units.txt)

### Base Classes

There are a lot of classes for units, the [complete list can be found in here](https://moddota.com/forums/discussion/comment/746/#Comment_746), but as we don't have much control over their properties, only a few are really useful for custom units in general:

* ***npc_dota_creature***

  The most useful baseclass, it doesn't have any critical hardcoded property so it's the go-to unit type for most units. It also allows the usage of the "Creature" block, which will is reviewed in the next section. It's linked to the `"DOTA_UNIT_TARGET_BASIC"` target type in abilities.

  There is however one simple property imposed to this unit type, which for the most part it's useful but it's good to keep in mind, and it's that **abilities are automatically skilled** up to the MaxLevel if possible (limited by the Level*2 of the creature, meaning a Level 1 creature will autolearn its abilities upto the 2nd rank). This can be of course modified through Lua `SetLevel` on each ability.

* ***npc_dota_building***

  Linked to `"DOTA_UNIT_TARGET_BUILDING"`, this baseclass can prove useful in many situations. 

  It has the following properties imposed to it, which we have **no control** over them:

  * Invulnerable by default. Very annoying, it can be removed through Lua with `building_handle:RemoveModifierByName("modifier_invulnerable")`
  * Visible through fog. This is troublesome, and forces any game that wants to have building strategies to use npc_dota_creature and define custom building damage, with some other downsides.
  * No visual turning, even if internally the unit is actually changing its forward vector. Usually a good thing, the creature equivalent behavior for this is the stunned state.
<br />
  Worth mentioning `npc_dota_tower` is a subclass of building, and is coded to trigger stuff like the announcers, team gold sharing and aggro AI. Use npc_dota_building with attack to make towers that aren't forced to use those mechanics.
  
* ***npc_dota_thinker***

  For dummy units. More on this later

<br />
For the rest of this guide, we'll be assuming a `"BaseClass" "npc_dota_creature"`

### Level

~~~
"Level"                        "32"
~~~

![img](http://puu.sh/ho10S/fe733ccd2e.jpg)

This level can be accessed and modified with Lua though various creature functions.

### Model and Scale

~~~    
"Model"                        "models/heroes/dragon_knight/dragon_knight.vmdl"
"ModelScale"                    "0.8"
~~~

Self explanatory, get the models through the asset browser and set its size (it will use "1" by omission).

Creatures using models that are broken down for cosmetic equipment will be 'naked' unless we attach them wearables. More on this later.

### Minimap Icons

~~~
"MinimapIcon" 				"minimap_candybucket"
"MinimapIconSize" 			"1000"
~~~

Produces:
![img](http://puu.sh/ho19t/c5c7f7bb39.jpg)

### Unit Label

~~~
"UnitLabel"                    "healing_ward"
~~~

This can be any name, its only useful purpose is to use with Lua `GetUnitLabel()` which can work as an easy method of tagging units.

## Boolean Values and Flags

~~~
"HasInventory"                "1"
~~~

Associated Lua functions: `HasInventory()` and `SetHasInventory(bool)`

**Note:** `SetHasInventory(true)` won't work on units that didn't have `"HasInventory"  "1"` previously defined.

~~~
"IsSummoned"				"1"
"CanBeDominated"			"0"
~~~

Self explanatory, the default values are 0 for summoned (so the lua IsSummoned will always return false unless you set this), and 1 for dominated creaturesl

<br />
~~~
"ConsideredHero"		"1"
~~~

`"DOTA_UNIT_TARGET_FLAG_NOT_CREEP_HERO"` datadriven flag. Gives the unit a hero styled health bar:

![img](http://puu.sh/ho2pt/c687566db4.jpg)

<br />    
~~~
"IsAncient"                    "1"
~~~
  
Associated Lua function: `IsAncient()`<br />`"DOTA_UNIT_TARGET_FLAG_NOT_ANCIENTS"` datadriven flag. 

<br />
~~~
"IsNeutralUnitType"            "1"
~~~

Associated Lua function: `IsNeutralUnitType()`
 
<br /> 
~~~
"CanBeDominated"               "0"
~~~

Helm of the Dominator specific. No associated Lua function, but it's easy to make one to read from this value if you wish.

<br />
~~~
"AutoAttacksByDefault"         "0"
~~~

Ignores Auto Attack Behavior setting, forces to not autoattack. Used on Visage Familiars.

<br />
~~~
"ShouldDoFlyHeightVisual"      "0"
~~~

![img](http://puu.sh/ho2MV/7f3e6d0fd8.jpg)

Seems broken, no noticeable difference.

<br />
~~~
"WakesNeutrals"                "1"
~~~

Unit won't aggro units on the Neutral team within their acquisition range.

## Selection properties

~~~
"SelectionGroup"               "string"              
"SelectOnSpawn"                "1"
"IgnoreAddSummonedToSelection" "1"
~~~

* **SelectionGroup** will make it so that all the units of this type are in a group which can be accessed through tab.

![img](http://puu.sh/ho1rl/d0d5e48cd3.jpg)
*I pressed tab once and all these units got selected after defining them in the same control group*

* **SelectOnSpawn** forces the unit into the selection of the hero, even if the "Auto Select Summoned Units" setting is turned off. It's used on Visage Familiars.

* **IgnoreAddSummonedToSelection** if set to 1, makes the "Auto Select Summoned Units" ignore this unit when it spawns. It's used on Brewmaster Primal Split units.

## Sounds

~~~    
"SoundSet"                     "Hero_DragonKnight"
"GameSoundsFile"               "soundevents/game_sounds_heroes/game_sounds_dragon_knight.vsndevts"
"IdleSoundLoop"                "Hero_DragonKnight.Tutorial_Intro"
~~~

* **SoundSet** with the correct **GameSoundsFile** associated takes care of sounds like attacks and walking footsteps. The SoundSet string should be the first part of each of the hero sounds, which can be easily seen through the [Dota 2 Sound Editor](https://github.com/pingzing/dota2-sound-editor). [Example](http://puu.sh/ho4KA/f7ad0ff2ca.png)

* **IdleSoundLoop** will be played constantly after the unit spawns. Some heroes don't have a loop sound defined, but as in the example above it's possible to use this as an Spawn sound for the unit if you add the string of a non-loopable sound.

## Abilities

~~~
"AbilityLayout"               "4"
"Ability1"                    ""            // Ability 1.
//"Ability2" ... up to "Ability16"
~~~

The unit can hold up to 16 abilities at any time being.

`"AbilityLayout"` is used for the built-in Flash UI to change how many abilities it can display, and currently its limited to 4, 5 and 6 (anything else will malfunction)

## Stats    

Because of :valve: - reasons  , unit stats aren't hover-able, but they are there.
    
### Physical and Magical protection

~~~
"ArmorPhysical"                "0"
"MagicalResistance"            "0"
~~~

### Attack Capabilities

~~~
"AttackCapabilities"         "DOTA_UNIT_CAP_NO_ATTACK"
~~~
   
List of Attack Capabilities:

* `DOTA_UNIT_CAP_NO_ATTACK`
* `DOTA_UNIT_CAP_MELEE_ATTACK`
* `DOTA_UNIT_CAP_RANGED_ATTACK`

####  Other Attack Stats:

~~~
"AttackDamageMin"            "50"       // Damage range min.
"AttackDamageMax"            "40"       // Damage range max.
"AttackRate"                 "1.7"     // Speed of attack.
"AttackAnimationPoint"       "0.75"    // Normalized time in animation cycle to attack.
"AttackAcquisitionRange"     "800"     // Range within a target can be acquired.
"AttackRange"                "600"     // Range within a target can be attacked.
"AttackRangeBuffer"          "250"     // Extra range the target can move without canceling the attack
~~~

#### Ranged Attack Projectiles

~~~
"ProjectileModel"            "particles/units/heroes/hero_lina/lina_base_attack.vpcf"
"ProjectileSpeed"            "900"
~~~

Find hero/unit attack particles with the asset browser, filtering for the hero name + "attack vpcf" 

If you have any "Melee to Ranged" mechanic, the unit definition should have a projectile speed, else it will default to 0, effectively making them never reach its target.

#### The things we could do...

~~~
"AttackDamageType"           "DAMAGE_TYPE_ArmorPhysical"
~~~

This is seen in every unit file, but worthless/unsupported. In the future, we could see it being used to easily define Air/Ground attacks, Magic Attacks, etc, which currently require scripted abilities to simulate those behaviors.

### Attribute Stats

Attributes are ignored for anything that isn't a hero unit, but because anything used to define units can also be used for npc_heroes_custom, these are the keyvalues, all self explanatory:

    "AttributePrimary"             "DOTA_ATTRIBUTE_STRENGTH"
    "AttributeBaseStrength"        "0"            // Base strength
    "AttributeStrengthGain"        "0"            // Strength bonus per level.
    "AttributeBaseAgility"         "0"            // Base agility
    "AttributeAgilityGain"         "0"            // Agility bonus per level.
    "AttributeBaseIntelligence"    "0"            // Base intelligence
    "AttributeIntelligenceGain"    "0"            // Intelligence bonus per level.


### Bounty

If you want to make any complex rule for XP/Gold, for example, give less XP from this unit to heroes at a certain level, it's better to leave the values at 0 and grant it through lua.

~~~
"BountyXP"                    "0"            // Experience earn.
"BountyGoldMin"                "0"           // Gold earned min.
"BountyGoldMax"                "0"           // Gold earned max.
~~~

## Bounds

This defines the unit collision with other units.

~~~
"BoundsHullName"            "DOTA_HULL_SIZE_HERO"
~~~

Bound Size Reference:

| Value | Radius in Hammer units
|---|---|
| DOTA_HULL_SIZE_SMALL | 8
| DOTA_HULL_SIZE_REGULAR| 16
| DOTA_HULL_SIZE_SIEGE | 16
| DOTA_HULL_SIZE_HERO | 24
| DOTA_HULL_SIZE_HUGE | 80
| DOTA_HULL_SIZE_BUILDING | 81
| DOTA_HULL_SIZE_FILLER | 96
| DOTA_HULL_SIZE_BARRACKS | 144
| DOTA_HULL_SIZE_TOWER | 144

* Lua `SetHullRadius(float)` can change this to any value in between or even above 144.


~~~
"RingRadius"                "70"
~~~

  The visible selection ring when the unit is selected

![img](http://puu.sh/ho2lF/02ab15803e.jpg)

~~~
"HealthBarOffset"           "250"
~~~

The height from the ground at which the Health Bar should be placed. By default this value is set to "-1" to use the models default height. The bigger the Model and ModelScale, this should be adjusted to a higher number so it doesn't look weird.

![img](http://puu.sh/ho2CK/8ae5a734d8.jpg)

## Movement

~~~
"MovementCapabilities"        "DOTA_UNIT_CAP_MOVE_NONE"
"MovementSpeed"               "300"       // Speed
"MovementTurnRate"            "0.5"       // Turning rate.
~~~

List of Movement Capabilities

* `DOTA_UNIT_CAP_MOVE_NONE`
* `DOTA_UNIT_CAP_MOVE_GROUND`
* `DOTA_UNIT_CAP_MOVE_FLY`

##### Less used movement-related values:

~~~
"HasAggressiveStance"         "0"
~~~

Plays alternate idle/run animation when near enemies, e.g. Abaddon model

~~~
"FollowRange"                 "100"
~~~

Distance to keep when following. Healing Ward/Sigil have it set at 250.

## Health and Mana

~~~
"StatusHealth"                "150"       // Base health.
"StatusHealthRegen"           "0"         // Health regeneration rate.
"StatusMana"                  "0"         // Base mana.
"StatusManaRegen"             "0"         // Mana regeneration rate.
~~~

**Notes:**

* Negative Health/Mana Regen doesn't work.
* Setting StatusMana on 0 will make it not have a mana bar.
* There is currently **no way of Setting MAX Mana** in Lua! Unit mana pool modification has to be done with the Creature block and Levels.

### Rarely used:

~~~
"StatusStartingMana"          "-1"
~~~

-1 means default to full mana, which is the default. It can be changed to any integer value so the units don't spawn with a filled pool.

## Armor and Attack Types

The Table of Physical Attacks vs Armor Types can be found [here in this link to the dota wiki](http://dota2.gamepedia.com/Damage_types#Effective_Physical_Damage_by_Attack_Type_and_Armor_Type)

~~~lua
"CombatClassAttack"           "DOTA_COMBAT_CLASS_ATTACK_HERO"
"CombatClassDefend"           "DOTA_COMBAT_CLASS_DEFEND_HERO"
~~~

### Attack Types Table

| Name | Dota Equivalent
|---|---|
|  Normal | DOTA_COMBAT_CLASS_ATTACK_BASIC 
|  Pierce | DOTA_COMBAT_CLASS_ATTACK_PIERCE 
|  Siege  |  DOTA_COMBAT_CLASS_ATTACK_SIEGE
|  Chaos  |  DOTA_COMBAT_CLASS_ATTACK_LIGHT
|  Hero   |  DOTA_COMBAT_CLASS_ATTACK_HERO

### Armor Types Table

| Name | Dota Equivalent
|---|---|
| Unarmored | DOTA_COMBAT_CLASS_DEFEND_SOFT
| Light     | DOTA_COMBAT_CLASS_DEFEND_WEAK
| Medium    |  DOTA_COMBAT_CLASS_DEFEND_BASIC
| Heavy     |  DOTA_COMBAT_CLASS_DEFEND_STRONG
| Fortified |  DOTA_COMBAT_CLASS_DEFEND_STRUCTURE
| Hero      | DOTA_COMBAT_CLASS_DEFEND_HERO

## Vision

~~~
"VisionDaytimeRange"        "1200"        // Range of vision during day light.
"VisionNighttimeRange"      "1800"        // Range of vision at night time.
~~~

Vision on any unit can't exceed 1800, any value above that will just default to 1800.

<br />
## Unit Relationship Class

This doesn't seem to make any difference, might be deprecated or just used for tagging stuff internally.

~~~
"UnitRelationshipClass"       "DOTA_NPC_UNIT_RELATIONSHIP_TYPE_DEFAULT"
~~~

List:

* `DOTA_NPC_UNIT_RELATIONSHIP_TYPE_BARRACKS`
* `DOTA_NPC_UNIT_RELATIONSHIP_TYPE_BUILDING`
* `DOTA_NPC_UNIT_RELATIONSHIP_TYPE_COURIER`
* `DOTA_NPC_UNIT_RELATIONSHIP_TYPE_DEFAULT`
* `DOTA_NPC_UNIT_RELATIONSHIP_TYPE_HERO`
* `DOTA_NPC_UNIT_RELATIONSHIP_TYPE_SIEGE`
* `DOTA_NPC_UNIT_RELATIONSHIP_TYPE_WARD`

## Lua VScript AI

~~~
"vscripts"                    "path_to_ai_script.lua"
~~~

This will load a lua script file as soon as the unit is spawned. With a Spawn ( entityKeyValues ) function one can initiate a thinker to do any sort of logic, this is a very simple example for a unit that goes through a series of waypoints while casting spells anytime its possible: [ai_tank_miniboss.lua](https://github.com/MNoya/Warchasers/blob/master/game/dota_addons/warchasers/scripts/vscripts/ai_tank_miniboss.lua).

## Neutral Behavior

When you add a creep to the map and set it to the neutral team, the default is to turn it to a neutral. If you wan't to use a custom behavior, turn it off:

~~~
"UseNeutralCreepBehavior" 	"0"
~~~
