---
title: Unit producing buildings
author: Noya
steamId: '76561198046984233'
date: 08.03.2015
---

# Unit producing buildings

This is a response tutorial on a question thread, I'm gonna explain the scripting approaches to fully spawning units with a building, including making them controllable and defining initial orders.

## Step 1. The npc_units_custom.txt files

First of all, you'll need a KeyValue definition for a building and the unit you want to spawn.

There are many examples of units in [Warchasers](https://github.com/MNoya/Warchasers/tree/master/game/dota_addons/warchasers/scripts/npc/units) & [DotaCraft](https://github.com/MNoya/DotaCraft/tree/master/game/dota_addons/dotacraft/scripts/npc/units) repositories, so I don't think I need to explain much about this.

I want to make one special note here though. **"BaseClass" "npc_dota_building" can be seen through fog**.

So if you have a problem with this, don't make your unit a building, but a **npc_dota_creature instead**.

This has the issue of creatures having a turn rate, so additionally you'll need to apply a MODIFIER_STATE_STUNNED on them, make them Magic Immune so most spells don't damage them, and make a special rule for spells that are supposed to damage buildings this way.

That being said, we won't be bothering with that for the purpose of this tutorial.

I'll be using a simplified version of the `human_barracks` definition, with a "human_train_footman" ability, which I'll expand on the possibilities for it later.

```
"human_barracks"
{
	// General
	//----------------------------------------------------------------
	"BaseClass"					"npc_dota_building"
	"Model"						"models/props_structures/good_barracks_melee001.vmdl"
	"ModelScale"				"1"
	"Level"						"1"
	"HealthBarOffset"			"140"

	// Abilities
	//----------------------------------------------------------------
	"AbilityLayout"				"1"
	"Ability1"				"human_train_footman"

	// Armor
	//----------------------------------------------------------------
	"ArmorPhysical"				"5"
	"MagicalResistance"			"0"

	// Attack
	//----------------------------------------------------------------
	"AttackCapabilities"		"DOTA_UNIT_CAP_NO_ATTACK"
	"AttackDamageType"			"DAMAGE_TYPE_ArmorPhysical"
	"AttackDamageMin"			"0"
	"AttackDamageMax"			"0"

	// Bounty
	//----------------------------------------------------------------
	"BountyGoldMin"				"0.0"
	"BountyGoldMax"				"0.0"

	// Bounds
	//----------------------------------------------------------------
	"BoundsHullName"			"DOTA_HULL_SIZE_BARRACKS"
	"RingRadius"				"220"
	"CollisionSize"				"144"

	// Movement
	//----------------------------------------------------------------
	"MovementCapabilities"		"DOTA_UNIT_CAP_MOVE_NONE"	// Needed to cast Point abilities
	"MovementSpeed"				"0"

	// Status
	//----------------------------------------------------------------
	"StatusHealth"				"1200"
	"StatusHealthRegen"			"0"
	"StatusMana"				"0"
	"StatusManaRegen"			"0"

	// Vision
	//----------------------------------------------------------------
	"VisionDaytimeRange"		"900"
	"VisionNighttimeRange"		"600"

	// Team
	//----------------------------------------------------------------
	"TeamName"					"DOTA_TEAM_NEUTRALS"
	"CombatClassAttack"			"DOTA_COMBAT_CLASS_ATTACK_BASIC"
	"CombatClassDefend"			"DOTA_COMBAT_CLASS_DEFEND_STRUCTURE"
	"UnitRelationShipClass"		"DOTA_NPC_UNIT_RELATIONSHIP_TYPE_BUILDING"

}
```

## Step 2. Putting your unit into the map.

There are 2 main options for doing this, one is Hammer oriented, and the other is a fully scripted approach.

### Hammer Units

As described in the first thread, you can point and click to add a unit to the map, with all sort of properties.

The problem with this approach is that even though the building is "part of your team", you have no control over it, the same way you can't control the autoattacks of Towers in Dota.

To solve this, we need to use a couple of lines in lua, basically the `SetOwner` and `SetControllableByPlayer` [API functions](https://moddota.com/api/#!/vscripts/CBaseEntity).

`[CBaseEntity] void SetOwner( handle_owningEntity )` **-- Sets this entity's owner**

`[CDOTA_BaseNPC] void SetControllableByPlayer( int, bool )` **-- Set this unit controllable by a player.**

To properly call these functions, I'm gonna assume you already know the basics explained under the [Beginners Guide to Scripting](/scripting-introduction) and just explain where should you call these with an example.

A good GameMode hook to call these would be after the dota_player_picked_hero, so given a standard barebones listener like this:

```lua
ListenToGameEvent('dota_player_pick_hero', Dynamic_Wrap(GameMode, 'OnPlayerPickHero'), self)
```

In OnPlayerPickHero you need to **find the handle of the BaseEntity/BaseNPC**, that is, the unit you want to change ownership and control state.

This can be done in a couple of ways, for example, using the functions defined under [CEntities](https://moddota.com/api/#!/vscripts/CEntities). We want this building to have a unique identifier so its easy to search it, so inside Hammer, select it, go into its properties, and give it a name (I use the Alt+Enter hotkey for this):

![img](/images/external/gs6Ec-c0a81f34ae.jpg)

Now you can search the building and get a local variable to it with this line:

```lua
local building = Entities:FindByName(nil, "building_barracks1")
```

Note: **Remember to select Entities when building the map**!

The OnPlayerPickHero function should then look like this:

```lua
function GameMode:OnPlayerPickHero(keys)
    local hero = EntIndexToHScript(keys.heroindex)
    local player = EntIndexToHScript(keys.player)
    local playerID = hero:GetPlayerID()

    local building = Entities:FindByName(nil, "building_barracks1")
    building:SetOwner(hero)
    building:SetControllableByPlayer(playerID, true)
end
```

Now your building should be fully controllable for ability usage, and even subtract gold from the player if you use abilities with gold cost.

### Scripting Approach

Hey Hammer is good and everything, but its behavior is very static. You need to have predefined positions for the units, build the map every time you make a change, and can't choose to not spawn any of them if there are less players than expected, etc.

There is a fully scripted method for placing units on the map, which is done by using the `CreateUnitByName` function, with some additional perks.

`handle CreateUnitByName( szUnitName, vLocation, bFindClearSpace, hNPCOwner, hUnitOwner, iTeamNumber )`

Still working inside the same OnPlayerPickHero, we can either make a static position for each playerID, such as _Vector(450,322,128)_, doing random positions with named info_target entities in Hammer, or a dynamic position based on the hero spawn location. Let's do the latter:

```lua
local origin = hero:GetAbsOrigin() -- Spawn position
local fv = hero:GetForwardVector() -- Vector the hero is facing
local distance = 300
local position = origin + fv * distance
```

This will define a Vector facing 300 units to the direction the hero is facing.

Now, CreateUnitByName should then be called in this way:

```lua
local building = CreateUnitByName("human_barracks", position, true, hero, hero, hero:GetTeamNumber())
```

Even though we set the hNPCOwner and hUnitOwner, the SetOwner and SetControllableByPlayer are still necessary.

#### Building invulnerability

There's a small issue with npc_dota_building baseclass which is that they spawn with "modifier_invulnerable" by default, to get rid of this, run this line:

```lua
building:RemoveModifierByName("modifier_invulnerable")
```

#### Did I mention Buildings are retarded?

There's another issue, buildings will sometimes be not created where you want them to be, and instead be stuck to the (0,0,0) position, so, if this happens, add this:

```lua
Timers:CreateTimer(function() building:SetAbsOrigin(position) end)
```

Wait 1 frame, and using BMD's timers4life, your building will finally appear in the correct position

#### Precache

Last thing is the Unit's Precache requirement. Unlike units dropped on Hammer, lua CreateUnitByName won't run the precache {} blocks of the unit abilities nor Model, so we need to do it manually in either addon_game_mode.lua or in PostLoadPrecache() if you are worried about your clients not loading properly. I'll just go with the first method in this case:

```lua
function Precache( context ) -- Find this in addon_game_mode.lua
    PrecacheUnitByNameSync("human_barracks", context)
end
```

Done! Full code of the building spawning in front of the hero looks like this:

```lua
function GameMode:OnPlayerPickHero(keys)
    local hero = EntIndexToHScript(keys.heroindex)
    local player = EntIndexToHScript(keys.player)
    local playerID = hero:GetPlayerID()

    -- Choose a Position
    local origin = hero:GetAbsOrigin() -- Spawn position
    local fv = hero:GetForwardVector() -- Vector the hero is facing
    local distance = 300
    local position = origin + fv * distance

    -- Spawning
local building = CreateUnitByName("human_barracks", position, true, hero, hero, hero:GetTeamNumber())
    building:SetOwner(hero)
    building:SetControllableByPlayer(playerID, true)
    building:SetAbsOrigin(position)
    building:RemoveModifierByName("modifier_invulnerable")
```

<br />

## Step 3. Scripting the unit-spawning ability inside the building

Now that we have a fully working building ingame, let's move to npc_abilities_custom.txt and creature spawning from this building.

There are 2 main ways of doing this: with the DataDriven Action "SpawnUnit", or just with the `CreateUnitByName` Lua function as explained before.

### DataDriven "SpawnUnit"

I actually prefer this DD Action and use it extensively throughout all of DotaCraft's unit spawning, because it has access to the very useful `"OnSpawn"` Sub-Event, which is only accessible through this action, and has some other options for unit count, limit (so you can't have more than X units of the same unit at the same time), modifier_kill integration, etc.

Of course you could listen to the game event of unit spawned and do your OnSpawn stuff there, but that makes the ability less modular and harder to maintain.

SpawnUnit should be used as it follows, and is included in the Sublime Dota KV snippets:

```
"SpawnUnit"
{
    "UnitName"       "npc_name"
    "Target"         "CASTER"
    "Duration"       "%duration"
    "UnitCount"      "1"
    "UnitLimit"      "0"
    "GrantsGold"     "1"
    "GrantsXP"       "1"
    "SpawnRadius"    "10"
    "OnSpawn"
    {
        "ApplyModifier"
        {
            "ModifierName"  "modifier_phased"
            "Target"        "TARGET"
            "Duration"      "0.03"
        }
        [ACTIONS]
    }
}
```

Applying "modifier_phased" for 1 frame is to prevent units getting stuck, for example if you cast the ability directly on the caster, without the phasing, it will be stuck on the same point and both units will be unable to move. This is similar to running the Lua `FindClearSpaceForUnit`, because once the phasing ends, units will try to find an empty position.

Units created by this function are already under control of the owner of the building.

Inside the "OnSpawn" replacing the [ACTIONS], it's useful to send orders to the unit, which can be referenced in lua as the event.target.

Here is a full example:

```
"human_train_footman"
{
    "BaseClass"             "ability_datadriven"
    "AbilityTextureName"    "footman"
    "MaxLevel"              "1"

    "AbilityBehavior"    "DOTA_ABILITY_BEHAVIOR_NO_TARGET"

    "AbilityGoldCost"    "10"

    "OnSpellStart"
    {

        "SpawnUnit"
        {
            "UnitName"    "footman"
            "Target"      "CASTER"
            "UnitCount"   "1"
            "UnitLimit"   "0"
            "GrantsGold"  "1"
            "GrantsXP"    "1"
            "SpawnRadius" "100"
            "OnSpawn"
            {
                "ApplyModifier"
                {
                    "ModifierName" "modifier_phased"
                    "Target"       "TARGET"
                    "Duration"     "0.03"
                }
                "RunScript"
                {
                    "ScriptFile"    "buildings/rally_point.lua"
                    "Function"      "MoveToRallyPoint"
                }
            }
        }
    }
}
```

The footman unit definition is just a Dragon Knight with some wearables:

```
//=================================================================================
// Creature: Footman
//=================================================================================
"human_footman"
{
	// General
	//----------------------------------------------------------------
	"BaseClass"					"npc_dota_creature"
	"Model"						"models/heroes/dragon_knight/dragon_knight.vmdl"
	"ModelScale"				"0.8"
	"Level"						"2"
	"HealthBarOffset"			"140"

	// Armor
	//----------------------------------------------------------------
	"ArmorPhysical"				"2"
	"MagicalResistance"			"0"

	// Attack
	//----------------------------------------------------------------
	"AttackCapabilities"		"DOTA_UNIT_CAP_MELEE_ATTACK"
	"AttackDamageType"			"DAMAGE_TYPE_ArmorPhysical"
	"AttackDamageMin"			"12.0"
	"AttackDamageMax"			"13.0"
	"AttackRate"				"1.35"
	"AttackAnimationPoint"		"0.5"
	"AttackAcquisitionRange"	"500"
	"AttackRange"				"90"

	// Bounty
	//----------------------------------------------------------------
	"BountyGoldMin"				"26.0"
	"BountyGoldMax"				"38.0"

	// Bounds
	//----------------------------------------------------------------
	"BoundsHullName"			"DOTA_HULL_SIZE_HERO"
	"RingRadius"				"70"
	"CollisionSize"				"31"
	"FormationRank"				"0"

	// Building Cost Stats
	//----------------------------------------------------------------
	"GoldCost"					"135"
	"LumberCost"				"0"
	"FoodCost"					"2"
	"BuildTime"					"20"

	// Movement
	//----------------------------------------------------------------
	"MovementCapabilities"		"DOTA_UNIT_CAP_MOVE_GROUND"
	"MovementSpeed"				"270"
	"MovementTurnRate"			"0.6"

	// Status
	//----------------------------------------------------------------
	"StatusHealth"				"420"
	"StatusHealthRegen"			"0.25"
	"StatusMana"				"0"
	"StatusManaRegen"			"0"

	// Vision
	//----------------------------------------------------------------
	"VisionDaytimeRange"		"1400"
	"VisionNighttimeRange"		"800"

	// Team
	//----------------------------------------------------------------
	"TeamName"					"DOTA_TEAM_NEUTRALS"
	"CombatClassAttack"			"DOTA_COMBAT_CLASS_ATTACK_BASIC"
	"CombatClassDefend"			"DOTA_COMBAT_CLASS_DEFEND_STRONG"
	"UnitRelationShipClass"		"DOTA_NPC_UNIT_RELATIONSHIP_TYPE_DEFAULT"

	// Creature Data
	//----------------------------------------------------------------
	"Creature"
	{
		"DisableClumpingBehavior"	"1"
		"AttachWearables"
		{
			"Wearable1"		{	"ItemDef"		"6789"		} //"Shield of Ascension"
			"Wearable2"		{	"ItemDef"		"6791"		} //"Pauldrons of Ascension"
			"Wearable3" 	        {	"ItemDef"		"6790"		} //"Gauntlets of Ascension"
			"Wearable4"		{	"ItemDef"		"6788"		} //"Drapes of Ascension"
			"Wearable5"		{	"ItemDef"		"6787"		} //"Sword of Ascension"
			"Wearable6"		{	"ItemDef"		"6792"		} //"Helm of Ascension"
		}
	}
}
```

Note the usage of a RunScript to call a MoveToRallyPoint function, this will introduce the 4th and last step of this guide.

## Orders

Various orders can be run after the unit spawns.

Try to use the `ExecuteOrderFromTable` to avoid dropping orders because the unit is doing something else (like spawning), if you want to use easier functions like `MoveToPosition` you might need to add timers to make sure the unit is ready to perform the order.

Also, the Ownership of the unit needs to be changed to the **hero handle**, because the caster is a creature and those can't gain gold!

```lua
function MoveToRallyPoint( event )
    local caster = event.caster
    local target = event.target

    -- Change this to your desired Vector, usually as an hscript:GetAbsOrigin()
    local position = Vector(420,322,128)

    ExecuteOrderFromTable({ UnitIndex = target:GetEntityIndex(),
                            OrderType = DOTA_UNIT_ORDER_MOVE_TO_POSITION,
                            Position = position, Queue = true })
    print(target:GetUnitName().." moving to position",position)

    local player = caster:GetPlayerOwner()
    local hero = player:GetAssignedHero()
    target:SetOwner(hero)
end
```

---

<br />
That's it for now, post any doubts about anything below. Thanks for reading!
