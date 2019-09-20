---
title: Making a \&quot;rpg-like\&quot; looting chest
author: FrenchDeath
steamId: 76561198002718302
---

Hello , it's the first time i'm making a tutorial here (and on lua too)
I was working on this for the last 2 day for my mod , an I didn't seen something similar for now 
So today i'll teach you how to make a chest you must open , and then you can obtain item or gold from it (or anything you want idc)

first off , you need to create you chest item in npc_item_custom.txt :

~~~lua
"item_chest"
	{
		// General
		//-------------------------------------------------------------------------------------------------------------
		"ID"							"1282"														// Here put a unused ID.
		"AbilityBehavior"				"DOTA_ABILITY_BEHAVIOR_CHANNELLED|DOTA_ABILITY_BEHAVIOR_NO_TARGET" // here we define it as a channeled item
		"BaseClass"						"item_datadriven"
		"AbilityTextureName"			"item_present" //Here goes the texture name of the item
		"ItemShareability"				"ITEM_FULLY_SHAREABLE" // make everyone able to use it
		"Model"							"models/props_winter/present.vmdl"
		"ItemKillable"					"0" // the chest can't be destroyed when on ground
		"ItemSellable"					"0" // can't be sold at a shop
		"ItemPurchasable"				"0" //can't be purchased
		"ItemDroppable"					"1" // can be put on the ground (set it to 0 if you don't want allow the player to
		"ItemCost"						"99999" 
		"ItemQuality"					"artifact"
		"ItemDeclarations"				"DECLARE_PURCHASES_TO_TEAMMATES | DECLARE_PURCHASES_IN_SPEECH | DECLARE_PURCHASES_TO_SPECTATORS"
		"AbilityCooldown"				"1.0" //time before the player can open another chest
		"AbilityChannelTime"			"1.0" //time the player must channel to open the chest
		


		"OnChannelSucceeded"
		{
			"RunScript"
		    {
		        "ScriptFile"			"lua_datadriven/chest.lua" //create a folder named lua_item in "your_game_mode\scripts\vscripts" and create a text file called chest.lua
				"Function"				"chest_open" // here we call the function
				"chest_name"				"chest_1" // here you can give a name to this chest in case you want more than 1 chest type 
				"gold"				"1" // does this chest give gold or only item ? (0 = no gold , 1 = gold instead of item , 2 = gold + item)
				"gold_amt"				"1500" // how many gold the chest give if it give out
				"gold_rand"				"250" // if you want gold to be random

		    }
		}
	}
~~~
then your script in lua_datadriven/chest.lua 
~~~lua
function chest_open(keys)
	local item_list = LoadKeyValues("scripts/kv/chest_result.kv") --Here we load a kv file where we will put all the item you can find in chest
	local caster = keys.caster
	local Player_ID = caster:GetPlayerOwnerID() 
	local item = keys.ability
	local gold = 0
	if keys.gold >0 then
		gold = keys.gold_amt + math.random(-(keys.gold_rand),(keys.gold_rand))
	end
	caster:RemoveItem(item)--Here we remove the chest
	local chest_name = keys.chest_name

	item_list = item_list[chest_name] --he we load the item list specific to this chest
	--DeepPrintTable (item_list) --undo the commentary to check if your item_list is right
	local len = 0
	for k,v in pairs( item_list ) do
		len = len + 1
	end
	local item_number = 0
	if keys.gold == 1 then
		item_number = math.random(1,(len + 1)) --here we determine the item number (soo here we chose the item), the +1 is to add the gold chance in ,you can change it to 2 or more if you want gold to have higger change of appear
	else
		item_number = math.random(1,len)
	end
	if item_number > len then --in case the player obtaine gold instead of item
	       PlayerResource:ModifyGold(Player_ID, gold, true, 0 ) 
	else
		local item_name = item_list[tostring(item_number)] -- i know it could be better , but i'm not realy used to kv
		local item_reward = CreateItem( item_name, caster, caster )
		caster:AddItem(item_reward)
		if keys.gold == 2 then
			PlayerResource:ModifyGold(Player_ID, gold, true, 0 ) 
		end
	end
end
~~~

and finaly we create our kv file where we put all the item for each chest 
"scripts/kv/chest_result.kv"
~~~
"put_the_name_you_wanna" 
{ 
    "chest_1"
    { 
        "1" "item_assault"
        "2" "item_desolator"
        "3" "item_sange_and_yasha"   
        "4" "item_butterfly"
    }
    "chest_2"
    { 
        "1" "item_youritem"
    }
}
~~~

Now you can easely make a chest for your rpg game :D
If you want to make the chest loot on ennemy death , look this another tuto from Noya about drop system : 
https://moddota.com/forums/discussion/257/item-drop-system