---
title: Lua Item Tutorial
author: DrTeaSpoon
steamId: '76561197975484185'
date: 07.08.2015
---

This tutorial is walk-through of creating completely new item with the new item_lua base class. <br />
For this first tutorial we create upgrade from Blink Dagger to Blink Staff. How it will work is that when targeting any point in ground it will work like Blink Dagger does but if you target allied Unit you can 'tag' it to blink instead of you. We will also add passive bonuses from the item we will have in the recipe.

### Blink Staff
First open up your npc_items_custom.txt in your favourite text editor. (I use notepad++) If  you don't have this file in your scripts\npc\ folder then create it and copy following into it.
~~~
"DOTAAbilities"
{
}
~~~
First and most important thing is naming your item. for this example I will use "item_blink_staff". Note that using the same name when referring to this item is important as dota 2 assumes some naming schemes.<br />
We will also setup unique ID for the item and a base class that tells the game that we are intending to create a lua item.
~~~
"DOTAAbilities"
{
	"item_blink_staff"
	{
		"ID"							"1250" // anything above 1250 should be safe to use.
		"BaseClass"						"item_lua"
	}
}
~~~
Next we need an image for the item. For that we use "AbilityTextureName" as items classify as sort of abilities in dota 2. Its important that we have our image file in correct place and named correctly. <br />For item in this example the file should be found from following path:
~~~
 dota 2 beta\game\dota_addons\{your addon name}\resource\flash3\images\items\blink_staff.png
~~~
note that the file name is 'blink_staff.png' instead of 'item_blink_staff.png'. This is because dota will read ability texture name of 'item_blink_staff' as 'item\blink_staff.png'<br />It is also important to note that using same name for your ability texture is doubly important as the image in shop doesn't appear correctly if you use different name.<br />
The image I will be using for this item is this one: ![enter image description here](http://i.imgur.com/yz4ghPc.png "blink_staff.png")<br />
~~~
"DOTAAbilities"
{
	"item_blink_staff"
	{
		"ID"							"1250" // anything above 1250 should be safe to use.
		"BaseClass"						"item_lua"
		"AbilityTextureName"			"item_blink_staff"
	}
}
~~~
The last part we must add is link to the script file. You should create new *.lua file somewhere in your scripts\vscripts folder. You can even create sub-folder for it if you want to be organized. Now your 'npc_items_custom.txt' should be something like this.
~~~
"DOTAAbilities"
{
	"item_blink_staff"
	{
		"ID"							"1250" // anything above 1250 should be safe to use.
		"BaseClass"						"item_lua"
		"AbilityTextureName"			"item_blink_staff"
		"ScriptFile"					"lua_items/blink_staff/blink_staff.lua"
	}
}
~~~
Truth of the lua items and abilities is that all you really need to define for them in lua file is their class table. So lets create that into our lua file:
~~~lua
if item_blink_staff == nil then
	item_blink_staff = class({})
end
~~~
IMPORTANT: Make sure you use same name as you defined in your npc_items_custom.txt<br />
Now next we want to define cooldown and mana cost for our blink staff. This can be done through 'npc_items_custom.txt' or through lua. Note that everything we define through lua we can manipulate more dynamically. For example we could reduce cooldown by half durring night time or double the mana cost if player has positive k/d ratio.<br />
Also advantage of defining them in npc_items_custom.txt is that what ever shows in the store (before player has the item) is the values defined there. Also currently there is issue that Manacost will always display the value defined by 'npc_item_custom.txt' but the item will still grey(blue?)-out when your mana is lower than what is defined in lua for mana cost.<br />
Because we want things to look smooth lets define some basic parameters we can later over ride in lua as we like:
~~~
"DOTAAbilities"
{
	"item_blink_staff"
	{
		"ID"							"1250" // anything above 1250 should be safe to use.
		"BaseClass"						"item_lua"
		"AbilityTextureName"			"item_blink_staff"
		"ScriptFile"					"lua_items/blink_staff/blink_staff.lua"
		// Casting
		//--------------------------------------------
		"AbilityCastRange"				"0" //We could define limit here but blink dagger has unlimited range to let player use it more efficiently. The range limiting comes in the script. 0 means unlimited.
		"AbilityCastPoint"				"0.3" //It's the wind up time of spell.
		"AbilityCooldown"				"10.0"
		"AbilityManaCost"				"50"
	}
}
~~~
For more key-value stuff involving items use Noyas guide: http://moddota.com/forums/discussion/4/datadriven-items
<br /> Its great reference but lets get on with the lua stuff!

### Defining Cast Rules
First we add behaviours. This will define what happens when player activates the hot-key of the item.
~~~lua
function item_blink_staff:GetBehavior() 
	local behav = DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES
	return behav
end
~~~
The GetBehaviour() function is called by the engine when it needs to know how the ability should act on different occations. The 'return' should return number 'int' value. Valve has made defining this easy for us by providing them as keys we can just sum together. These values take advantage of bit band where for example:
~~~
Key ------ Value ------ Bytes
DOTA_ABILITY_BEHAVIOR_UNIT_TARGET ------ 8 ------ 01000
DOTA_ABILITY_BEHAVIOR_POINT ------ 16 ------ 10000
DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR_POINT ------ 24 ------ 11000
~~~
As you can see in the bytes, while the value might look arbitrary, the bytes act like on/off switch of the behaviour.
For available values for the behaviours use following link: https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/API#DOTA_ABILITY_BEHAVIOR

Next we add mana cost and cooldown.
~~~lua
function item_blink_staff:GetManaCost()
	return 50
end

function item_blink_staff:GetCooldown( nLevel )
	return 10
end
~~~
As items are defined like abilities the GetCooldown function has helper parameter for level of the ability. You can ignore it for items completely as the level will almost always be 1 (exception  of corner cases like bkb or dagon.)

Now lets get to the actual spell casting part.

First we create OnSpellStart() function and define some initial keys to use in the script.
~~~lua
function item_blink_staff:OnSpellStart()
	local hCaster = self:GetCaster() --We will always have Caster.
	local hTarget = false --We might not have target so we make fail-safe so we do not get an error when calling - self:GetCursorTarget()
	if not self:GetCursorTargetingNothing() then
		hTarget = self:GetCursorTarget()
	end
	local vPoint = self:GetCursorPosition() --We will always have Vector for the point.
	local vOrigin = hCaster:GetAbsOrigin() --Our caster's location
	local nMaxBlink = 1200 --How far can we actually blink?
	local nClamp = 960 --If we try to over reach we use this value instead. (this is mechanic from blink dagger.)
end
~~~
Note that while we are in 'item_blink_staff' class we can use 'self' as quick reference to it.<br />
Now that we have our stuff set up lets start blinking our caster!
~~~lua
function item_blink_staff:OnSpellStart()
	local hCaster = self:GetCaster() --We will always have Caster.
	local hTarget = false --We might not have target so we make fail-safe so we do not get an error when calling - self:GetCursorTarget()
	if not self:GetCursorTargetingNothing() then
		hTarget = self:GetCursorTarget()
	end
	local vPoint = self:GetCursorPosition() --We will always have Vector for the point.
	local vOrigin = hCaster:GetAbsOrigin() --Our caster's location
	local nMaxBlink = 1200 --How far can we actually blink?
	local nClamp = 960 --If we try to over reach we use this value instead. (this is mechanic from blink dagger.)
	
	ProjectileManager:ProjectileDodge(hCaster)  --We disjoint disjointable incoming projectiles.
	ParticleManager:CreateParticle("particles/items_fx/blink_dagger_start.vpcf", PATTACH_ABSORIGIN, hCaster) --Create particle effect at our caster.
	hCaster:EmitSound("DOTA_Item.BlinkDagger.Activate") --Emit sound for the blink
	local vDiff = vPoint - vOrigin --Difference between the points
	if vDiff:Length2D() > nMaxBlink then  --Check caster is over reaching.
		vPoint = vOrigin + (vPoint - vOrigin):Normalized() * nClamp -- Recalculation of the target point.
	end
	hCaster:SetAbsOrigin(vPoint) --We move the caster instantly to the location
	FindClearSpaceForUnit(hCaster, vPoint, false) --This makes sure our caster does not get stuck
	ParticleManager:CreateParticle("particles/items_fx/blink_dagger_end.vpcf", PATTACH_ABSORIGIN, hCaster) --Create particle effect at our caster.
end
~~~
IMPORTANT: We are using sounds and particle effects already precached by default. If you wish to use particle effects and sounds from other heroes or your custom ones then you have to do precaching for those resources.<br />
This is what our item should do right now:

<Gfycat id="RepentantYellowishDiscus" />

### Cast on Allied
Now we are going to create the part that makes this item unique compared to blink dagger. First we if statement in our cast function that distinguishes how it should act depending on the target. Also at same time we make sure that double tapping the item works like it does with blink dagger (self targeting blinks towards base)

Because this lua ability stuff still has some minor issues we have to return to our 'npc_items_custom.txt' file to add some targeting help. Just add the following to the item.
~~~
		"AbilityUnitTargetTeam"			"DOTA_UNIT_TARGET_TEAM_FRIENDLY"
		"AbilityUnitTargetType"			"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC"
~~~
Now looking at our lua code you can see that we can use most of our writen blink code in multiple places. Thats why we are going to change things around a bit like this:
~~~lua
function item_blink_staff:OnSpellStart()
	local hCaster = self:GetCaster() --We will always have Caster.
	local hTarget = false --We might not have target so we make fail-safe so we do not get an error when calling - self:GetCursorTarget()
	if not self:GetCursorTargetingNothing() then
		hTarget = self:GetCursorTarget()
	end
	local vPoint = self:GetCursorPosition() --We will always have Vector for the point.
	local vOrigin = hCaster:GetAbsOrigin() --Our caster's location
	local nMaxBlink = 1200 --How far can we actually blink?
	local nClamp = 960 --If we try to over reach we use this value instead. (this is mechanic from blink dagger.)
	self:Blink(hCaster, vPoint, nMaxBlink, nClamp)
end


function item_blink_staff:Blink(hTarget, vPoint, nMaxBlink, nClamp)
	local vOrigin = hTarget:GetAbsOrigin() --Our units's location
	ProjectileManager:ProjectileDodge(hTarget)  --We disjoint disjointable incoming projectiles.
	ParticleManager:CreateParticle("particles/items_fx/blink_dagger_start.vpcf", PATTACH_ABSORIGIN, hTarget) --Create particle effect at our caster.
	hTarget:EmitSound("DOTA_Item.BlinkDagger.Activate") --Emit sound for the blink
	local vDiff = vPoint - vOrigin --Difference between the points
	if vDiff:Length2D() > nMaxBlink then  --Check caster is over reaching.
		vPoint = vOrigin + (vPoint - vOrigin):Normalized() * nClamp -- Recalculation of the target point.
	end
	hTarget:SetAbsOrigin(vPoint) --We move the caster instantly to the location
	FindClearSpaceForUnit(hTarget, vPoint, false) --This makes sure our caster does not get stuck
	ParticleManager:CreateParticle("particles/items_fx/blink_dagger_end.vpcf", PATTACH_ABSORIGIN, hTarget) --Create particle effect at our caster.
end
~~~
Now we can just use the newly defined Blink function to blink our caster, and allies without writing it all again.<br />
Lets write the self cast now. We create IF statement first to check if we have hTarget. Then we check if the target is same as the caster or not. Also if we don't have hTarget we default to blinking ourselves. To get the location we want to blink towards we need to find some target location. For this we will use the fountain. (ent_dota_fountain)
~~~lua
function item_blink_staff:OnSpellStart()
	local hCaster = self:GetCaster() --We will always have Caster.
	local hTarget = false --We might not have target so we make fail-safe so we do not get an error when calling - self:GetCursorTarget()
	if not self:GetCursorTargetingNothing() then
		hTarget = self:GetCursorTarget()
	end
	local vPoint = self:GetCursorPosition() --We will always have Vector for the point.
	local vOrigin = hCaster:GetAbsOrigin() --Our caster's location
	local nMaxBlink = 1200 --How far can we actually blink?
	local nClamp = 960 --If we try to over reach we use this value instead. (this is mechanic from blink dagger.)
	if hTarget then
		if hCaster == hTarget then
			if not self.hFountain and not self.bNoFountain then --We check if we have ever tried finding the fountain before.
			local hFountain = Entities:FindByClassname(nil, "ent_dota_fountain") --Find first fountain
			local bFound = false --Make the boolean for while statement.
				while not bFound do
					if hFountain then --Is there a fountain entity?
						if hFountain:GetTeamNumber() == hCaster:GetTeamNumber() then -- Is it the right team?
							self.hFountain = hFountain --Store it so we don't have to trouble finding the foundtain again.
							bFound = true --Make sure while statement ends
						else
							hFountain = Entities:FindByClassname(hFountain, "ent_dota_fountain") --Find the next fountain if we didn't find the right team.
						end
					else
						self.bNoFountain = true --We have concluded that there is no fountain entity for this team. Lets not do that again!
						bFound = true --We could alternatively use 'Break' but I find this more funny.
					end
				end
			end
			if self.hFountain then --Do we have fountain?
				vPoint = self.hFountain:GetAbsOrigin() --Lets change our target location there then.
				self:Blink(hCaster, vPoint, nMaxBlink, nClamp) --BLINK!
			else
				self:EndCooldown() 
				self:RefundManaCost() 
			end
		end
	else
		self:Blink(hCaster, vPoint, nMaxBlink, nClamp) --BLINK!
	end
end
~~~
As you can see, this time we used while statement to go through all fountain entities and stored the results of our search into the ability. If it finds no entities it saves a boolean value so that it won't try to find fountain the next time. Also just like blink dagger if the target cannot be found the we won't blink at all.
<br />Next we need to allow targeting allies with the spell but instead of blinking we store their id for next time we do "point" targeting on ground. There are few ways we can do this but It would be fair if we give them some sort of warning what is happening. So lets create two modifiers. One will simply be effect on target ally and one will be hidden modifier to store the target's entity index for short duration.

First we need to link our intended modifiers to the ability. Top of your blink staff lua file should look like this
~~~lua
if item_blink_staff == nil then
	item_blink_staff = class({})
end

LinkLuaModifier( "item_blink_staff_effect_modifier", "lua_items/blink_staff/effect_modifier.lua", LUA_MODIFIER_MOTION_NONE )
~~~
Then we need our effect modifier file that was declared. For purposes of this tutorial we will use particle effect for armlet so we can skip precache again.

~~~lua
if item_blink_staff_effect_modifier == nil then
	item_blink_staff_effect_modifier = class({})
end

function item_blink_staff_effect_modifier:OnCreated( kv )	
	if IsServer() then
		if self:GetCaster() ~= self:GetParent() then
			local nFXIndex = ParticleManager:CreateParticle("particles/items_fx/armlet.vpcf", PATTACH_ROOTBONE_FOLLOW, self:GetParent())
			self:AddParticle( nFXIndex, false, false, -1, false, false )
		end
	end
end

function item_blink_staff_effect_modifier:GetAttributes() 
	return MODIFIER_ATTRIBUTE_MULTIPLE + MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE
end

function item_blink_staff_effect_modifier:IsHidden()
	if self:GetCaster() == self:GetParent() then
	return true
	else
	return false
	end
end
~~~
As you can see we for the first time used IsServer() function. This is used so some of the game logic is not ran multiple times (as some portions of the code is ran on both clients and server)
Also for purposes of this tutorial we will use this same effect for both the caster and the target of the blink staff. We could create two modifiers but that would be wasteful. That's why we added some extra functionality to the modifier so we can distinguish if the target of the modifier is the caster or not. Also in case there are more than one blink staff in game we make sure there can be multiple modifiers of the same type on single unit.

Now we need to add the code that lets us add the modifier to the target and store that target's entity index to our modifier and when point casting retrieve the target again. For this tutorial we give player five seconds to recast. We also end cooldown and refund mana cost on ally target.
~~~lua
function item_blink_staff:OnSpellStart()
	local hCaster = self:GetCaster() --We will always have Caster.
	local hTarget = false --We might not have target so we make fail-safe so we do not get an error when calling - self:GetCursorTarget()
	if not self:GetCursorTargetingNothing() then
		hTarget = self:GetCursorTarget()
	end
	local vPoint = self:GetCursorPosition() --We will always have Vector for the point.
	local vOrigin = hCaster:GetAbsOrigin() --Our caster's location
	local nMaxBlink = 1200 --How far can we actually blink?
	local nClamp = 960 --If we try to over reach we use this value instead. (this is mechanic from blink dagger.)
	if hTarget then
		if hCaster == hTarget then
			if not self.hFountain and not self.bNoFountain then --We check if we have ever tried finding the fountain before.
			local hFountain = Entities:FindByClassname(nil, "ent_dota_fountain") --Find first fountain
			local bFound = false --Make the boolean for while statement.
				while not bFound do
					if hFountain then --Is there a fountain entity?
						if hFountain:GetTeamNumber() == hCaster:GetTeamNumber() then -- Is it the right team?
							self.hFountain = hFountain --Store it so we don't have to trouble finding the foundtain again.
							bFound = true --Make sure while statement ends
						else
							hFountain = Entities:FindByClassname(hFountain, "ent_dota_fountain") --Find the next fountain if we didn't find the right team.
						end
					else
						self.bNoFountain = true --We have concluded that there is no fountain entity for this team. Lets not do that again!
						bFound = true --We could alternatively use 'Break' but I find this more funny.
					end
				end
			end
			if self.hFountain then --Do we have fountain?
				vPoint = self.hFountain:GetAbsOrigin() --Lets change our target location there then.
				self:Blink(hCaster, vPoint, nMaxBlink, nClamp) --BLINK!
			else
				self:EndCooldown() --Cooldown refund if we could not find fountain on self cast
				self:RefundManaCost() --Manacost refund if we could not find fountain on self cast
			end
		else
			hTarget:AddNewModifier( hCaster, self, "item_blink_staff_effect_modifier", { duration = 5 } ) --lets add modifier to target
			hCaster:AddNewModifier( hCaster, self, "item_blink_staff_effect_modifier", { duration = 5 } ) --lets add modifier to caster
			local hModifier = hCaster:FindModifierByNameAndCaster("item_blink_staff_effect_modifier", hCaster) --find that modifier (they really should fix this by returning handle when adding new modifier.
			local nTargetIndex = hTarget:GetEntityIndex() --lets find the targets entity index
			hModifier:SetStackCount(nTargetIndex) --add that index to the modifier as it's stack count
			self:EndCooldown() --Cooldown refund so can cast again
			self:RefundManaCost() --Manacost refund
		end
	else
	
		local hModifier = hCaster:FindModifierByNameAndCaster("item_blink_staff_effect_modifier", hCaster) --Check if we have someone selected
		if hModifier then
			hTarget = EntIndexToHScript(hModifier:GetStackCount()) --Find the target with the ent index
			if hTarget:FindModifierByNameAndCaster("item_blink_staff_effect_modifier", hCaster) then --Check if the target is not purged.
				self:Blink(hTarget, vPoint, nMaxBlink, nClamp) --BLINK!
			else --Someone purged our target
			self:Blink(hCaster, vPoint, nMaxBlink, nClamp) --BLINK!
			end
		else
			self:Blink(hCaster, vPoint, nMaxBlink, nClamp) --BLINK!
		end
	end
end
~~~
Now there are two more things we need to do before we are done with our lua script. Right now this item has unlimited cast range for purposes of targeting allied unit. We also have issue of this item being abused when target does not want to be 'helped' by another. (Aka. Disable Help)<br /> Luckyly we have one tool for both of them: CastFilterResultTarget and GetCustomCastErrorTarget.<br />Lets add following functions to our item's script:
~~~lua

function item_blink_staff:CastFilterResultTarget( hTarget ) -- hTarget is the targeted NPC.
	local hCaster = self:GetCaster() --We will always have Caster.
	local vOrigin = hCaster:GetAbsOrigin() --Our caster's location
	local vPoint = hTarget:GetAbsOrigin() --Our target's location
	local nMaxRange = 1200 --How far can we actually target?
	local vDiff = vPoint - vOrigin --Difference between the points
	local nTargetID = hTarget:GetPlayerOwnerID() --getting targets owner id
	local nCasterID = hCaster:GetPlayerOwnerID() --getting casters owner id
	if nTargetID and nCasterID then --making sure they both exist
		if PlayerResource:IsDisableHelpSetForPlayerID(nTargetID, nCasterID) then --target hates having caster help him out.
			return UF_FAIL_CUSTOM
		end
	end
	
	if vDiff:Length2D() > nMaxRange then  --Check caster is over reaching.
	return UF_FAIL_CUSTOM
	else
	return UF_SUCCESS
	end
end

function item_blink_staff:GetCustomCastErrorTarget( hTarget) -- hTarget is the targeted NPC. 
	local hCaster = self:GetCaster() --We will always have Caster.
	local vOrigin = hCaster:GetAbsOrigin() --Our caster's location
	local vPoint = hTarget:GetAbsOrigin() --Our target's location
	local nMaxRange = 1200 --How far can we actually target?
	local vDiff = vPoint - vOrigin --Difference between the points
	local nTargetID = hTarget:GetPlayerOwnerID() --getting targets owner id
	local nCasterID = hCaster:GetPlayerOwnerID() --getting casters owner id
	if nTargetID and nCasterID then --making sure they both exist
		if PlayerResource:IsDisableHelpSetForPlayerID(nTargetID, nCasterID) then --target hates having caster help him out.
			return "#dota_hud_error_target_has_disable_help"
		end
	end
	if vDiff:Length2D() > nMaxRange then  --Check caster is over reaching.
	return "#dota_hud_error_target_out_of_range" --returning error from localization
	end
end
~~~
Now to save time and sanity you might want to add 'Special' values to your script. These are values you can modify easily without opening the script and searching for them there. This is extremely helpful when you use those values in multiple places. It also lets you display the values in your item description.<br />First add following block to your item in 'npc_items_custom.txt'
~~~

		"AbilitySpecial"
		{
			"01"
			{
				"var_type"				"FIELD_INTEGER"
				"max_blink"				"1200"
			}
			"02"
			{
				"var_type"				"FIELD_INTEGER"
				"blink_clamp"			"960"
			}
			"03"
			{
				"var_type"				"FIELD_INTEGER"
				"help_range"			"3000"
			}
			"04"
			{
				"var_type"				"FIELD_FLOAT"
				"help_duration"			"5.0"
			}
		}
~~~
Now to use these values you use this function in your ability:
~~~
self:GetSpecialValueFor( "max_blink" )
~~~
Or in your modifier you have to get the handle for your ability first:
~~~
self:GetAbility():GetSpecialValueFor( "max_blink" )
~~~
Now we find and replace all those values with correct retrieval of a special value and we should end up with following result:
~~~lua

function item_blink_staff:OnSpellStart()
	local hCaster = self:GetCaster() --We will always have Caster.
	local hTarget = false --We might not have target so we make fail-safe so we do not get an error when calling - self:GetCursorTarget()
	if not self:GetCursorTargetingNothing() then
		hTarget = self:GetCursorTarget()
	end
	local vPoint = self:GetCursorPosition() --We will always have Vector for the point.
	local vOrigin = hCaster:GetAbsOrigin() --Our caster's location
	local nMaxBlink = self:GetSpecialValueFor( "max_blink" ) --How far can we actually blink?
	local nClamp = self:GetSpecialValueFor( "blink_clamp" ) --If we try to over reach we use this value instead. (this is mechanic from blink dagger.)
	if hTarget then
		if hCaster == hTarget then
			if not self.hFountain and not self.bNoFountain then --We check if we have ever tried finding the fountain before.
			local hFountain = Entities:FindByClassname(nil, "ent_dota_fountain") --Find first fountain
			local bFound = false --Make the boolean for while statement.
				while not bFound do
					if hFountain then --Is there a fountain entity?
						if hFountain:GetTeamNumber() == hCaster:GetTeamNumber() then -- Is it the right team?
							self.hFountain = hFountain --Store it so we don't have to trouble finding the foundtain again.
							bFound = true --Make sure while statement ends
						else
							hFountain = Entities:FindByClassname(hFountain, "ent_dota_fountain") --Find the next fountain if we didn't find the right team.
						end
					else
						self.bNoFountain = true --We have concluded that there is no fountain entity for this team. Lets not do that again!
						bFound = true --We could alternatively use 'Break' but I find this more funny.
					end
				end
			end
			if self.hFountain then --Do we have fountain?
				vPoint = self.hFountain:GetAbsOrigin() --Lets change our target location there then.
				self:Blink(hCaster, vPoint, nMaxBlink, nClamp) --BLINK!
			else
				self:EndCooldown() --Cooldown refund if we could not find fountain on self cast
				self:RefundManaCost() --Manacost refund if we could not find fountain on self cast
			end
		else
			hTarget:AddNewModifier( hCaster, self, "item_blink_staff_effect_modifier", { duration = self:GetSpecialValueFor( "help_duration" ) } ) --lets add modifier to target
			hCaster:AddNewModifier( hCaster, self, "item_blink_staff_effect_modifier", { duration = self:GetSpecialValueFor( "help_duration" ) } ) --lets add modifier to caster
			local hModifier = hCaster:FindModifierByNameAndCaster("item_blink_staff_effect_modifier", hCaster) --find that modifier (they really should fix this by returning handle when adding new modifier.
			local nTargetIndex = hTarget:GetEntityIndex() --lets find the targets entity index
			hModifier:SetStackCount(nTargetIndex) --add that index to the modifier as it's stack count
			self:EndCooldown() --Cooldown refund so can cast again
			self:RefundManaCost() --Manacost refund
		end
	else
	
		local hModifier = hCaster:FindModifierByNameAndCaster("item_blink_staff_effect_modifier", hCaster) --Check if we have someone selected
		if hModifier then
			hTarget = EntIndexToHScript(hModifier:GetStackCount()) --Find the target with the ent index
			if hTarget:FindModifierByNameAndCaster("item_blink_staff_effect_modifier", hCaster) then --Check if the target is not purged.
				self:Blink(hTarget, vPoint, nMaxBlink, nClamp) --BLINK!
				
			else --Someone purged our target
			self:Blink(hCaster, vPoint, nMaxBlink, nClamp) --BLINK!
			end
		else
			self:Blink(hCaster, vPoint, nMaxBlink, nClamp) --BLINK!
		end
	end
end


function item_blink_staff:Blink(hTarget, vPoint, nMaxBlink, nClamp)
	local vOrigin = hTarget:GetAbsOrigin() --Our units's location
	ProjectileManager:ProjectileDodge(hTarget)  --We disjoint disjointable incoming projectiles.
	ParticleManager:CreateParticle("particles/items_fx/blink_dagger_start.vpcf", PATTACH_ABSORIGIN, hTarget) --Create particle effect at our caster.
	hTarget:EmitSound("DOTA_Item.BlinkDagger.Activate") --Emit sound for the blink
	local vDiff = vPoint - vOrigin --Difference between the points
	if vDiff:Length2D() > nMaxBlink then  --Check caster is over reaching.
		vPoint = vOrigin + (vPoint - vOrigin):Normalized() * nClamp -- Recalculation of the target point.
	end
	hTarget:SetAbsOrigin(vPoint) --We move the caster instantly to the location
	FindClearSpaceForUnit(hTarget, vPoint, false) --This makes sure our caster does not get stuck
	ParticleManager:CreateParticle("particles/items_fx/blink_dagger_end.vpcf", PATTACH_ABSORIGIN, hTarget) --Create particle effect at our caster.
end

function item_blink_staff:CastFilterResultTarget( hTarget ) -- hTarget is the targeted NPC.
	local hCaster = self:GetCaster() --We will always have Caster.
	local vOrigin = hCaster:GetAbsOrigin() --Our caster's location
	local vPoint = hTarget:GetAbsOrigin() --Our target's location
	local nMaxRange = self:GetSpecialValueFor( "help_range" ) --How far can we actually target?
	local vDiff = vPoint - vOrigin --Difference between the points
	local nTargetID = hTarget:GetPlayerOwnerID() --getting targets owner id
	local nCasterID = hCaster:GetPlayerOwnerID() --getting casters owner id
	if nTargetID and nCasterID then --making sure they both exist
		if PlayerResource:IsDisableHelpSetForPlayerID(nTargetID, nCasterID) then --target hates having caster help him out.
			return UF_FAIL_CUSTOM
		end
	end
	
	if vDiff:Length2D() > nMaxRange then  --Check caster is over reaching.
	return UF_FAIL_CUSTOM
	else
	return UF_SUCCESS
	end
end

function item_blink_staff:GetCustomCastErrorTarget( hTarget) -- hTarget is the targeted NPC. 
	local hCaster = self:GetCaster() --We will always have Caster.
	local vOrigin = hCaster:GetAbsOrigin() --Our caster's location
	local vPoint = hTarget:GetAbsOrigin() --Our target's location
	local nMaxRange = self:GetSpecialValueFor( "help_range" ) --How far can we actually target?
	local vDiff = vPoint - vOrigin --Difference between the points
	local nTargetID = hTarget:GetPlayerOwnerID() --getting targets owner id
	local nCasterID = hCaster:GetPlayerOwnerID() --getting casters owner id
	if nTargetID and nCasterID then --making sure they both exist
		if PlayerResource:IsDisableHelpSetForPlayerID(nTargetID, nCasterID) then --target hates having caster help him out.
			return "#dota_hud_error_target_has_disable_help"
		end
	end
	if vDiff:Length2D() > nMaxRange then  --Check caster is over reaching.
	return "#dota_hud_error_target_out_of_range" --returning error from localization
	end
end
~~~
Now if we want to make sure the consistancy between npc_items_custom.txt and our lua file is complete we can use self.BaseClass for things like cooldown or castrange. Lets replace our mana cost and cooldown functions to see how it works.
~~~lua
function item_blink_staff:GetManaCost()
	return self.BaseClass.GetManaCost( self, nLevel )
end

function item_blink_staff:GetCooldown( nLevel )
	return self.BaseClass.GetCooldown( self, nLevel )
end
~~~
Now all we need to do is make localization for the item. In your 'dota 2 beta\game\dota_addons\{addon name}\resource' folder you should have addon_english.txt<br />If you are using some different language you might use differently named file. But all languages defaults to english if others fail.<br />
Open it up and lets add following lines to the mix.
~~~

		"DOTA_Tooltip_ability_item_blink_staff"                                           "Blink Staff"
		"DOTA_Tooltip_ability_item_blink_staff_Description"                               "Teleport to a target point up to 1200 units away. Can be used on allied units to select them to blink instead of you."
		"DOTA_Tooltip_ability_item_blink_staff_max_blink"                                 "Max Blink Distance:"
		"DOTA_Tooltip_ability_item_blink_staff_help_range"                                "Help Range:"
		
		"DOTA_Tooltip_item_blink_staff_effect_modifier"                                             "Blink Staff"
		"DOTA_Tooltip_item_blink_staff_effect_modifier_Description"                                 "Targeted by Blink Staff"
~~~
Lets see what we have now:
<Gfycat id="FrankBleakChihuahua" />

Now there are still some things we need to do but first lets fix the most obvious problem. Currently there is a bug where the:<br />
"AbilityUnitTargetTeam"			"DOTA_UNIT_TARGET_TEAM_FRIENDLY"<br />
Is ignored!<br />
We can fix it by adding team check to our cast filters:
~~~lua

function item_blink_staff:CastFilterResultTarget( hTarget ) -- hTarget is the targeted NPC.
	local hCaster = self:GetCaster() --We will always have Caster.
	local vOrigin = hCaster:GetAbsOrigin() --Our caster's location
	local vPoint = hTarget:GetAbsOrigin() --Our target's location
	local nMaxRange = self:GetSpecialValueFor( "help_range" ) --How far can we actually target?
	local vDiff = vPoint - vOrigin --Difference between the points
	local nTargetID = hTarget:GetPlayerOwnerID() --getting targets owner id
	local nCasterID = hCaster:GetPlayerOwnerID() --getting casters owner id
	if hCaster:GetTeamNumber() ~= hTarget:GetTeamNumber() then
		return UF_FAIL_CUSTOM
	end
	if nTargetID and nCasterID then --making sure they both exist
		if PlayerResource:IsDisableHelpSetForPlayerID(nTargetID, nCasterID) then --target hates having caster help him out.
			return UF_FAIL_CUSTOM
		end
	end
	
	if vDiff:Length2D() > nMaxRange then  --Check caster is over reaching.
	return UF_FAIL_CUSTOM
	else
	return UF_SUCCESS
	end
end

function item_blink_staff:GetCustomCastErrorTarget( hTarget) -- hTarget is the targeted NPC. 
	local hCaster = self:GetCaster() --We will always have Caster.
	local vOrigin = hCaster:GetAbsOrigin() --Our caster's location
	local vPoint = hTarget:GetAbsOrigin() --Our target's location
	local nMaxRange = self:GetSpecialValueFor( "help_range" ) --How far can we actually target?
	local vDiff = vPoint - vOrigin --Difference between the points
	local nTargetID = hTarget:GetPlayerOwnerID() --getting targets owner id
	local nCasterID = hCaster:GetPlayerOwnerID() --getting casters owner id
	if hCaster:GetTeamNumber() ~= hTarget:GetTeamNumber() then
		return "#dota_hud_error_cant_cast_on_enemy"
	end
	if nTargetID and nCasterID then --making sure they both exist
		if PlayerResource:IsDisableHelpSetForPlayerID(nTargetID, nCasterID) then --target hates having caster help him out.
			return "#dota_hud_error_target_has_disable_help"
		end
	end
	if vDiff:Length2D() > nMaxRange then  --Check caster is over reaching.
	return "#dota_hud_error_target_out_of_range" --returning error from localization
	end
end
~~~
Problem with this method is that its easier for user to blink towards the enemy rather than even try 'helping' him/her. But in this tutorial we assume you can figure it out your how to edit the code to blink when caster and target have different teams using the cast filter changes as example.<br />
Now the thing that makes blink dagger less as efficient as escape tool is it's Cooldown when hurt. Lets add that in! To do that we create Intrinsic modifier. Lets link our new modifier:
~~~lua
LinkLuaModifier( "item_blink_staff_passive_modifier", "lua_items/blink_staff/passive_modifier.lua", LUA_MODIFIER_MOTION_NONE )
function item_blink_staff:GetIntrinsicModifierName()
	return "item_blink_staff_passive_modifier"
end
~~~
Now create our declared lua file for it and its contents should be something like this:
~~~lua
if item_blink_staff_passive_modifier == nil then
	item_blink_staff_passive_modifier = class({})
end

function item_blink_staff_passive_modifier:IsHidden()
	return true --we want item's passive abilities to be hidden most of the times
end

function item_blink_staff_passive_modifier:DeclareFunctions() --we want to use these functions in this item
	local funcs = {
		MODIFIER_EVENT_ON_TAKEDAMAGE
	}
 
	return funcs
end

function item_blink_staff_passive_modifier:OnTakeDamage( params ) --When ever the unit takes damage this is called
	if IsServer() then --this should be only run on server.
		local hAbility = self:GetAbility() --we get the ability where this modifier is from
		if params.attacker ~= self:GetParent() and params.unit == self:GetParent() and  params.attacker:IsHero()  then
		hAbility:StartCooldown(hAbility:GetSpecialValueFor( "hurt_cooldown" )) --we start the cooldown
		end
	end
end
~~~
As you can see used declare functions to tell the game what to expect from this modifier. This makes sure the game doesn't check this modifier with every event that might be effected.<br />
We also added new special value for cooldown when caster gets hurt. Remember to add that to your 'npc_items_custom.txt' as float value preferably.
~~~
			"05"
			{
				"var_type"				"FIELD_FLOAT"
				"hurt_cooldown"			"3.0"
			}
~~~
Now we should have covered all the main issues. Next we add recipe for the item and add stats from the components.

### Recipe and Stats
As you might have noticed testing our item, it right now costs no gold to purchase. There are two things we can do here. We can either add ItemCost into our 'npc_items_custom.txt' file or create a recipe for the item. When you create a recipe for your item the game automatically calculates the item cost. We can also add ItemCost to our new recipe to let the game know that you have to buy it aswell instead of items being automatically combined into one. We are also adding the stats from our component items so be sure to add special values to your item reflecting the component stats.

I will be using item_quarterstaff, item_robe and item_blink for my components. I also make the recipe cost 325 gold. One important thing to note when creating recipe is the naming scheme. The recipe name should always be 
'item_recipe_your_item'<br />
my item: item_blink_staff<br />
my recipe: item_recipe_blink_staff<br />
Also you must give each item in npc_items_custom.txt unique ID. If you don't you may find odd bugs like item not being purchasable. Here is my current entries in npc_items_custom.txt
~~~

	"item_blink_staff"
	{
		"ID"							"1250"
		"BaseClass"						"item_lua"
		"ScriptFile"					"lua_items/blink_staff/blink_staff.lua"
		"AbilityTextureName"			"item_blink_staff"
		"AbilityUnitTargetTeam"			"DOTA_UNIT_TARGET_TEAM_FRIENDLY"
		"AbilityUnitTargetType"			"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC"
		"AbilityCastRange"				"0"
		"AbilityCastPoint"				"0.3"
		"AbilityCooldown"				"10.0"
		"AbilityManaCost"				"50"
		//// Item Info
		////-------------------------------------------------------------------------------------------------------------
		"ItemCost"						"3900"
		"ItemShopTags"					"blink;staff"
		"ItemQuality"					"rare"
		"ItemAliases"					"blink;staff"
        //
		"AbilitySpecial"
		{
			"01"
			{
				"var_type"				"FIELD_INTEGER"
				"max_blink"				"1200"
			}
			"02"
			{
				"var_type"				"FIELD_INTEGER"
				"blink_clamp"			"960"
			}
			"03"
			{
				"var_type"				"FIELD_INTEGER"
				"help_range"			"3000"
			}
			"04"
			{
				"var_type"				"FIELD_FLOAT"
				"help_duration"			"5.0"
			}
			"05"
			{
				"var_type"				"FIELD_FLOAT"
				"hurt_cooldown"			"3.0"
			}
			
			// Stats from the recipe items
			
			"06" // Quarterstaff
			{
				"var_type"				"FIELD_INTEGER"
				"bonus_damage"			"10"
			}
			
			"07" // Quarterstaff
			{
				"var_type"				"FIELD_INTEGER"
				"bonus_attack_speed"			"10"
			}
			
			"08" // Robe Of Magi
			{
				"var_type"				"FIELD_INTEGER"
				"bonus_int"			"6"
			}
		}
	}
	
	"item_recipe_blink_staff"
	{
		// General
		//-------------------------------------------------------------------------------------------------------------
		"BaseClass"                     "item_datadriven"
		"ID"							"1251"
		
		// Item Info
		//-------------------------------------------------------------------------------------------------------------
		"ItemCost"						"325"	
		"ItemShopTags"					""
		
		// Recipe
		//-------------------------------------------------------------------------------------------------------------
		"ItemRecipe"					"1"
		"ItemResult"					"item_blink_staff"
		"ItemRequirements"
		{
			"01"						"item_quarterstaff;item_robe;item_blink"
		}
	}
~~~
Notice that the item requirements part lists the items you need. For valve defined ones use this as reference: <br /> https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/Built-In_Item_Names <br />
Also notice how the first entry is defined "01" . This is because you can create recipe that can be used with different sets of components. This is used by valve in Power Threads where you can use any of the basic 450 costing attribute items.<br />
Now while we have defined special values for our blink staff stats, we have not actually used those values anywhere. Lets get back to our blink staff passive modifier lua file we used for the cooldown when taking damage.<br />
Here we have to declare new functions for the stats we need.
~~~lua
function item_blink_staff_passive_modifier:DeclareFunctions() --we want to use these functions in this item
	local funcs = {
		MODIFIER_EVENT_ON_TAKEDAMAGE,
		MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
		MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
		MODIFIER_PROPERTY_STATS_INTELLECT_BONUS
	}
 
	return funcs
end
~~~
Now that we have declared what we want to effect in game with this modifier lets add functions the game can call on the correct events.
~~~lua
function item_blink_staff_passive_modifier:GetModifierBonusStats_Intellect()
	local hAbility = self:GetAbility() --we get the ability where this modifier is from
	return hAbility:GetSpecialValueFor( "bonus_int" )
end

function item_blink_staff_passive_modifier:GetModifierAttackSpeedBonus_Constant()
	local hAbility = self:GetAbility() --we get the ability where this modifier is from
	return hAbility:GetSpecialValueFor( "bonus_attack_speed" )
end

function item_blink_staff_passive_modifier:GetModifierPreAttack_BonusDamage()
	local hAbility = self:GetAbility() --we get the ability where this modifier is from
	return hAbility:GetSpecialValueFor( "bonus_damage" )
end
~~~
Now last thing we need to do is tell player about the awe-inspiring stats this item gives them. Lets add our new stats to the addon_english.txt<br />
After that our file should have something like this:
~~~

		"DOTA_Tooltip_ability_item_blink_staff"                                           "Blink Staff"
		"DOTA_Tooltip_ability_item_blink_staff_Description"                               "Teleport to a target point up to 1200 units away. Can be used on allied units to select them to blink instead of you."
		"DOTA_Tooltip_ability_item_blink_staff_max_blink"                                 "Max Blink Distance:"
		"DOTA_Tooltip_ability_item_blink_staff_help_range"                                "Help Range:"
		"DOTA_Tooltip_ability_item_blink_staff_bonus_damage"                              "+$damage"
		"DOTA_Tooltip_ability_item_blink_staff_bonus_attack_speed"                        "+$attack"
		"DOTA_Tooltip_ability_item_blink_staff_bonus_int"                                 "+$int"
		
		"DOTA_Tooltip_item_blink_staff_effect_modifier"                                             "Blink Staff"
		"DOTA_Tooltip_item_blink_staff_effect_modifier_Description"                                 "Targeted by Blink Staff"
~~~

Now we are pretty much done. But because the biggest advantage of lua items is that we can define so many things dynamically so rest of this tutorial we will do few experiments that might not seem very balanced or sensible from game play perspective but just because we can!

### Advanced Uses
First Lets try effecting the help casting range if we are dealing with large mana pool hero. Since we are using cast filters for the help range limitation we can do this part there. To do this we use our already defined hCaster handle and use function :GetMaxMana() to return the hero's mana pool. Then we add that value to our already existing help range. This means that if our caster has 5000 mana pool to use late game he or she will have massive support range of 8000 units.<br />
So lets change the CastFilterResult target and error functions with following:
~~~lua
	local nRangeBonus = hCaster:GetMaxMana() --Get our caster's mana pool
	local nMaxRange = self:GetSpecialValueFor( "help_range" ) + nRangeBonus--How far can we actually target?
~~~
The end result should look something like this
~~~lua
function item_blink_staff:CastFilterResultTarget( hTarget ) -- hTarget is the targeted NPC.
	local hCaster = self:GetCaster() --We will always have Caster.
	local vOrigin = hCaster:GetAbsOrigin() --Our caster's location
	local vPoint = hTarget:GetAbsOrigin() --Our target's location
	local nRangeBonus = hCaster:GetMaxMana() --Get our caster's mana pool
	local nMaxRange = self:GetSpecialValueFor( "help_range" ) + nRangeBonus--How far can we actually target?
	local vDiff = vPoint - vOrigin --Difference between the points
	local nTargetID = hTarget:GetPlayerOwnerID() --getting targets owner id
	local nCasterID = hCaster:GetPlayerOwnerID() --getting casters owner id
	if hCaster:GetTeamNumber() ~= hTarget:GetTeamNumber() then
		return UF_FAIL_CUSTOM
	end
	if nTargetID and nCasterID then --making sure they both exist
		if PlayerResource:IsDisableHelpSetForPlayerID(nTargetID, nCasterID) then --target hates having caster help him out.
			return UF_FAIL_CUSTOM
		end
	end
	
	if vDiff:Length2D() > nMaxRange then  --Check caster is over reaching.
	return UF_FAIL_CUSTOM
	else
	return UF_SUCCESS
	end
end

function item_blink_staff:GetCustomCastErrorTarget( hTarget) -- hTarget is the targeted NPC. 
	local hCaster = self:GetCaster() --We will always have Caster.
	local vOrigin = hCaster:GetAbsOrigin() --Our caster's location
	local vPoint = hTarget:GetAbsOrigin() --Our target's location
	local nRangeBonus = hCaster:GetMaxMana() --Get our caster's mana pool
	local nMaxRange = self:GetSpecialValueFor( "help_range" ) + nRangeBonus--How far can we actually target?
	local vDiff = vPoint - vOrigin --Difference between the points
	local nTargetID = hTarget:GetPlayerOwnerID() --getting targets owner id
	local nCasterID = hCaster:GetPlayerOwnerID() --getting casters owner id
	if hCaster:GetTeamNumber() ~= hTarget:GetTeamNumber() then
		return "#dota_hud_error_cant_cast_on_enemy"
	end
	if nTargetID and nCasterID then --making sure they both exist
		if PlayerResource:IsDisableHelpSetForPlayerID(nTargetID, nCasterID) then --target hates having caster help him out.
			return "#dota_hud_error_target_has_disable_help"
		end
	end
	if vDiff:Length2D() > nMaxRange then  --Check caster is over reaching.
	return "#dota_hud_error_target_out_of_range" --returning error from localization
	end
end
~~~
Now you may have noticed how we are using almost same code for both cast filter and the error function. Here is a way to reduce the redundancy:
~~~lua
function item_blink_staff:CastFilterResultTarget( hTarget ) -- hTarget is the targeted NPC.
	return self:CCastFilter( hTarget, false )
end

function item_blink_staff:GetCustomCastErrorTarget( hTarget) -- hTarget is the targeted NPC. 
	return self:CCastFilter( hTarget, true )
end

function item_blink_staff:CCastFilter( hTarget, bError )
	if IsServer() then --this should be only run on server.
		local hCaster = self:GetCaster() --We will always have Caster.
		local vOrigin = hCaster:GetAbsOrigin() --Our caster's location
		local vPoint = hTarget:GetAbsOrigin() --Our target's location
		local nRangeBonus = hCaster:GetMaxMana() --Get our caster's mana pool
		local nMaxRange = self:GetSpecialValueFor( "help_range" ) + nRangeBonus--How far can we actually target?
		local vDiff = vPoint - vOrigin --Difference between the points
		local nTargetID = hTarget:GetPlayerOwnerID() --getting targets owner id
		local nCasterID = hCaster:GetPlayerOwnerID() --getting casters owner id
		if hCaster:GetTeamNumber() ~= hTarget:GetTeamNumber() then
			if bError then
				return "#dota_hud_error_cant_cast_on_enemy"
			else
				return UF_FAIL_CUSTOM
			end
		end
		if nTargetID and nCasterID then --making sure they both exist
			if PlayerResource:IsDisableHelpSetForPlayerID(nTargetID, nCasterID) then --target hates having caster help him out.
				if bError then
					return "#dota_hud_error_target_has_disable_help"
				else
					return UF_FAIL_CUSTOM
				end
			end
		end
		if vDiff:Length2D() > nMaxRange then  --Check caster is over reaching.
			if bError then
				return "#dota_hud_error_target_out_of_range" --returning error from localization
			else
				return UF_FAIL_CUSTOM
			end
		end
		if not bError then
			return UF_SUCCESS
		end
	end
end
~~~

### Item Levels
As I mentioned early in the tutorial things like bkb and dagon has item levels used. Dagon uses separate items to define the levels while bkb has built-in leveling when ever it is used. We are going to code where we reduce our blink staff help range when ever it is used to help a player.<br />First we need  to add new values for our help ranges between the levels. These are simply separated by spaces between values.
~~~
			"03"
			{
				"var_type"				"FIELD_INTEGER"
				"help_range"			"3000 2500 2000 1500 1000"
			}
~~~
Because there is some odd bugs here and there, the MaxLevel value that we would use for normal abilities doesn't work for items. To help us define it in the script we create new special value for it.
~~~
			"09"
			{
				"var_type"				"FIELD_INTEGER"
				"max_level"				"5"
			}
~~~
Back to the lua script, we need to upgrade the item only when ally is teleported and not when we simply tag our ally for teleport. First find this line:
~~~
self:Blink(hTarget, vPoint, nMaxBlink, nClamp) --BLINK!
~~~
Under it lets add the upgrade part. Note that we have to check we don't upgrade the item when it's fully upgraded.
~~~lua
if self:GetLevel() < self:GetSpecialValueFor( "max_level" ) then --We can't define max level for item like we can with abilities. Best to create special value for it.
	self:UpgradeAbility(true)
end
~~~
We could also add condition where if the game is currently in night time the upgrade doesn't happen. Letting our hero help his allies for free!
~~~lua
if self:GetLevel() < self:GetSpecialValueFor( "max_level" ) and GameRules:IsDaytime() then
	self:UpgradeAbility(true)
end
~~~
Now if we want to let our hero refresh the help range levels then we can either script some event where we reset the item's level with:
~~~
self:SetLevel(1)
~~~
Or we can use more elegant choice of modifying our recipe to act like charge refresh for drums of endurance.
~~~

	"item_recipe_blink_staff"
	{
		// General
		//-------------------------------------------------------------------------------------------------------------
		"BaseClass"                     "item_datadriven"
		"ID"							"1251"
		
		// Item Info
		//-------------------------------------------------------------------------------------------------------------
		"ItemCost"						"325"	
		"ItemShopTags"					""
		
		// Recipe
		//-------------------------------------------------------------------------------------------------------------
		"ItemRecipe"					"1"
		"ItemResult"					"item_blink_staff"
		"ItemRequirements"
		{
			"01"						"item_quarterstaff;item_robe;item_blink"
			"02"						"item_blink_staff"
		}
	}
~~~
Notice how we added "02" to the item requirements and it only requires the item "item_blink_staff". This means we can combine our original blink staff to create fully new one with level set to its default value.<br />Now what you should remember to do is change the description of the item and not keep the player guessing.
~~~
		"DOTA_Tooltip_ability_item_blink_staff_Description"                               "Teleport to a target point up to 1200 units away. Can be used on allied units to select them to blink instead of you. If you take damage the Blink Staff is put on 3.0 second cooldown. Every time you help ally the help range is reduced by 500. This doesn't apply if used durring night time. You maximum mana is added to the help distance."
~~~

### The End
That is end of this tutorial. If you have requests concerning this tutorial or improvements/corrections please comment bellow.<br />
You can find this and other lua items and abilities from my Dota2Overflow github repo.<br />
https://github.com/DrTeaSpoon/Dota2Overflow
<br />
To help declaring modifier functions use this for resource:
<br />https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Lua_Abilities_and_Modifiers#Modifier_Functions
<br />
Big thanks to BMD for barebones. While this tutorial has nothing to do with his repo, I used it for testing ground and creating the visual aids.
<br />
Big thanks to all who have contributed to https://github.com/Pizzalol/SpellLibrary
<br />

Happy Blinking!
<Gfycat id="AthleticEminentAnnashummingbird" />
