---
title: Adding a Very Simple AI to Units
author: wigguno
steamId: 76561198004447135
date: 27.07.2015
---

This tutorial will cover how to issue very simple orders to units. This tutorial uses a move order to make a unit wander inside an area randomly, and a cast order to make a unit cast an untargeted spell randomly.

This tutorial assumes a basic knowledge of lua scripting.

## Drawbacks
 - This technique should not be used for units which need to perform more than one kind of order each. If a more advanced AI is required, you should check holdout_example's lua ai scripts.  
 - Some functionality is hard-coded into this script. If you want to iterate on your game and change the behaviour often, I would suggest having some global constants or loading in the values from an external KV file. Doing this allows you to keep all the values in one place.

## References
I've copied some units from holdout_example for testing, and copied Berserkers Call from [Spell Library](https://github.com/Pizzalol/SpellLibrary). 

If you need help on making your own units or abilities, Noya's documentation is an excellent resource:  
[Datadriven Units](/articles/datadriven-units)  
[DataDriven Ability Breakdown - Documentation](/articles/datadriven-ability-breakdown-documentation)

## Hammer Setup
In Hammer, I've placed an info_target entity named "spawn_loc_test" which can be found in lua. This allows me to place the units spawn location in Hammer without changing the lua scripts around. If you wish to do this, give each entity a unique name and place them where you want the spawn point on your map.

## Lua Setup
In the InitGameMode() function we do a few things: seed the random number generator, create an empty table in order to keep track of every unit with behaviour, spawn some units, and set a thinker function up. 

Settings which aren't relevant to this tutorial have been omitted, but in this function you can set up things like GameRules for your game mode. 

~~~lua
function CAITesting:InitGameMode()
	print( "Loading AI Testing Game Mode." )
	-- SEEDING RNG IS VERY IMPORTANT
	math.randomseed(Time())

	-- Set up a table to hold all the units we want to spawn
	self.UnitThinkerList = {}

	-- Spawn some units
	for i = 1,5 do
		self:SpawnAIUnitWanderer()
	end
	for i = 1,3 do
		self:SpawnAIUnitCaster()
	end

	-- Set the unit thinker function
	GameRules:GetGameModeEntity():SetThink( "OnUnitThink", self, "UnitThink", 1 )
end
~~~

## Spawning a Wanderer
This function will spawn a unit with wandering behaviour. The bounds which the unit wanders between are hard coded. An easy way to determine these bounds is to spawn a simple entity in Hammer (such as info_target), move it about and read the coordinates. In this example, my info_target entity is named "spawn_loc_test".

~~~lua
function CAITesting:SpawnAIUnitWanderer()
	--Start an iteration finding each entity with this name
	--If you've named everything with a unique name, this will return your entity on the first go
	local spawnVectorEnt = Entities:FindByName(nil, "spawn_loc_test")

	-- GetAbsOrigin() is a function that can be called on any entity to get its location
	local spawnVector = spawnVectorEnt:GetAbsOrigin()

	-- Spawn the unit at the location on the neutral team
	local spawnedUnit = CreateUnitByName("npc_dota_creature_kobold_tunneler", spawnVector, true, nil, nil, DOTA_TEAM_NEUTRALS)

	-- make this unit passive
	spawnedUnit:SetIdleAcquire(false)

	-- Add some variables to the spawned unit so we know its intended behaviour
	-- You can store anything here, and any time you get this entity the information will be intact
	spawnedUnit.ThinkerType = "wander"
	spawnedUnit.wanderBounds = {}
	spawnedUnit.wanderBounds.XMin = -768
	spawnedUnit.wanderBounds.XMax = 768
	spawnedUnit.wanderBounds.YMin = -64
	spawnedUnit.wanderBounds.YMax = 768

	-- Add a random amount to the game time to randomise the behaviour a bit
	spawnedUnit.NextOrderTime = GameRules:GetGameTime() + math.random(5, 10) 

	-- finally, insert the unit into the table
	table.insert(self.UnitThinkerList, spawnedUnit)
end
~~~

## Spawning a Caster
This function will spawn a unit with casting behaviour. The bounds which the unit is spawned in are hard coded. The spell is an untargeted spell which requires no additional variables to cast.

~~~lua
function CAITesting:SpawnAIUnitCaster()
	-- Generate a random location inside the neutrals area
	local spawnVector = Vector(math.random(-768, 768), math.random(-64, 768), 128)

	-- Spawn the unit at the location on the neutral team
	local spawnedUnit = CreateUnitByName("npc_dota_creature_gnoll_assassin", spawnVector, true, nil, nil, DOTA_TEAM_NEUTRALS)

	-- make this unit passive
	spawnedUnit:SetIdleAcquire(false)

	-- Add some variables to the spawned unit so we know its intended behaviour
	-- You can store anything here, and any time you get this entity the information will be intact
	spawnedUnit.ThinkerType = "caster"
	spawnedUnit.CastAbilityIndex = spawnedUnit:GetAbilityByIndex(0):entindex()

	-- Add a random amount to the game time to randomise the behaviour a bit
	spawnedUnit.NextOrderTime = GameRules:GetGameTime() + math.random(5, 10) 

	-- finally, insert the unit into the table
	table.insert(self.UnitThinkerList, spawnedUnit)
end
~~~

## Thinker Function
This function gets called every second. It will read each of the units and determine if they should be issued with a new order, then issue that order.

~~~lua
function CAITesting:OnUnitThink()
	if GameRules:State_Get() == DOTA_GAMERULES_STATE_GAME_IN_PROGRESS then

		local deadUnitCount = 0

		-- Check each of the units in this table for their thinker behaviour
		for ind, unit in pairs(self.UnitThinkerList) do

			-- The first check should be to see if the units are still alive or not.
			-- Keep track of how many units are removed from the table, as the indices will change by that amount
			if unit:IsNull() or not unit:IsAlive() then
				table.remove(self.UnitThinkerList, ind - deadUnitCount)
				deadUnitCount = deadUnitCount + 1

			-- Check if the game time has passed our random time for next order
			elseif GameRules:GetGameTime() > unit.NextOrderTime then

				if unit.ThinkerType == "wander" then
					--print("thinker unit is a wanderer")
					--print("time: " .. GameRules:GetGameTime() .. ". next wander: " .. unit.NextWanderTime)

					-- Generate random coordinates to wander to
					local x = math.random(unit.wanderBounds.XMin, unit.wanderBounds.XMax)
					local y = math.random(unit.wanderBounds.YMin, unit.wanderBounds.YMax)
					local z = GetGroundHeight(Vector(x, y, 128), nil)

					print("wandering to x: " .. x .. " y: " .. y)

					-- Issue the movement order to the unit
					unit:MoveToPosition(Vector(x, y, z))


				elseif unit.ThinkerType == "caster" then

					-- If you want a more complicated order, use this syntax
					-- Some more documentation: https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/API/Global.ExecuteOrderFromTable
					-- Unit order list is here: https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama/Javascript/API#dotaunitorder_t
					-- (Ignore the dotaunitorder_t. on each one)

					print("casting ability " .. EntIndexToHScript(unit.CastAbilityIndex):GetName())

					local order = {
						UnitIndex = unit:entindex(),
						AbilityIndex = unit.CastAbilityIndex,
						OrderType = DOTA_UNIT_ORDER_CAST_NO_TARGET,
						Queue = false
					}
					ExecuteOrderFromTable(order)
				end

				-- Generate the next time for the order
				unit.NextOrderTime = GameRules:GetGameTime() + math.random(5, 10)
			end
		end

		-- Make sure our testing map stays on day time		
		if not GameRules:IsDaytime() then
			GameRules:SetTimeOfDay(0.26)
		end

	elseif GameRules:State_Get() >= DOTA_GAMERULES_STATE_POST_GAME then
		return nil
	end

	-- this return statement means that this thinker function will be called again in 1 second
	-- returning nil will cause the thinker to terminate and no longer be called
	return 1
end
~~~

## Finishing Up
If you need more advanced behaviour, an AI script should be used. The method covered in this tutorial can be extended up to a point however, for example casting a ground-targeted ability in a random area would be possible using only code posted here.

The full files for this example can be found here:
https://github.com/Wigguno/AITesting

If you have any questions, the [#dota2modhelpdesk](https://moddota.com/forums/chat) irc channel is always happy to help.
