---
title: Semi-decent way of obtaining right click movement vectors
author: Myll
steamId: 76561198000729788
---

First, listen to this event: `ListenToGameEvent('dota_player_used_ability', Dynamic_Wrap(WormWar, 'OnAbilityUsed'), self)`
~~~lua
-- An ability was used by a player
function WormWar:OnAbilityUsed(keys)
	local player = EntIndexToHScript(keys.PlayerID)
	local abilityname = keys.abilityname
	local hero = player:GetAssignedHero()
	hero.justUsedAbility = true
        -- this should always fire an OnOrder event too, since casting an ability is an order.
end
~~~

Then attach a passive ability that has the OnOrder modifier to the hero:
~~~
"worm_passive"
{
	"AbilityBehavior" 			"DOTA_ABILITY_BEHAVIOR_PASSIVE"
	"BaseClass" 					"ability_datadriven"
	"AbilityTextureName"            "rubick_empty1"
	"MaxLevel"                      "1"

	"Modifiers"
	{
		"modifier_worm_passive"
		{
			"Passive"                        "1"
			"IsHidden"                       "1"
			"OnOrder"
			// Triggers on Move/Casting/Hold/Stop
			{
				"RunScript"
				{
					"ScriptFile"	"scripts/vscripts/abilities.lua"
					"Function"		"worm_on_order"
				}
			}
		}
	}
}
~~~
Then the worm_on_order function:
~~~lua
function worm_on_order( keys )
	keys.caster.orderDetected = true
end
~~~
Then use [FlashUtil](https://github.com/Perryvw/FlashUtil) to obtain the movement cursor position. `ply` is the player handle (i.e. PlayerResource:GetPlayer(playerID):
~~~lua
ply.cursorStream = FlashUtil:RequestDataStream( "cursor_position_world", .01, hero:GetPlayerID(), function(playerID, cursorPos)
	if not hero.orderDetected or not hero:IsAlive() then
		return
	elseif hero.justUsedAbility then
		--print("hero.justUsedAbility, returning")
		hero.justUsedAbility = false
		hero.orderDetected = false
		return
	end
	hero.orderDetected = false

	local validPos = true
	-- make sure the cursor isn't on the UI
	if cursorPos.x > 30000 or cursorPos.y > 30000 or cursorPos.z > 30000 then
		validPos = false
	end
	if validPos then
                local possibleRightClickVector = cursorPos
		-- at this point the player did not use an ability, but either used right click move, stop, or hold position.
		-- print("moveOrderDetected")
	end
end)
~~~

That's the gist of it. This algorithm can most likely be refined to filter out stop/hold position commands, but I didn't go that far.

