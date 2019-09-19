---
title: Item Restrictions &amp; Requirements
author: Noya
steamId: 76561198046984233
---

This implements the following mechanic:

[gfy OfficialAdorableJabiru]

### 1. Key Values Table

First create a text file to write down your item properties. File Name, extension and path can be anything as long as the file structure is a proper table.

For this example, we will use this path: **scripts**/**maps**/**item_info**.kv

~~~
"Items"
{
    "item_name_here" //change it to a custom items
    {
        "levelRequired"	"10"
        "classRequired"	"Warrior" 
    }

    "item_other_name_here" 
    {
        "levelRequired"	"25"
    }
}
~~~

To load a table into your game mode, you need to use the `LoadKeyValues( "path/to/file" ) lua function. This can be called at GameMode:InitGameMode() inside your main lua addon. GameMode = self

~~~
self.ItemInfoKV = LoadKeyValues( "scripts/maps/item_info.kv" ) 
~~~

If your table is badly formed (e.g. you missed a quotation mark or a bracket), this will fail and you'll get a lua console error when starting the game.

Note how I didn't add a "classRequired" to the 2nd item. When trying to access the `GameMode.ItemInfoKV[itemNane].classRequired` value will be nil, meaning there is no restriction on class (but still checks the level)

There are many ways to set a class, the most basic one is indexing `.class` in the hero handle the first time the hero is in game (using the barebones.lua default calls)

~~~lua
function GameMode:OnHeroInGame(hero)

    if heroName == "npc_dota_hero_axe" then
        hero.class = "Warrior"
        print("Axe is ready!")
    end
    
end
~~~

### 2. OnEquip Ability Event

Add this datadriven event on every item that needs to do a check for restrictions
. It calls a lua script to do the logic check against the table.

This is needed because the listener for inventory changed is broken, and the Lua `OnItemPickedUp` event hook doesn't account for someone dragging an item into another players inventory
.

~~~
"OnEquip" 
{   
    "RunScript"
    {
        "ScriptFile"	"items.lua"
        "Function"	"ItemCheck"
    }
}
~~~

### 3. Lua Script

In this example, I'll look for Level and Class requirements

Make use of the [CustomError Flash UI by zedor](https://github.com/zedor/CustomError) to display a red error message when the item doesn't met any criteria found in the table.

There are some `DeepPrintTable` and `print` to check that the table is being reviewed as you expect.

~~~lua
function ItemCheck( event )
    local itemName = event.ability:GetAbilityName()
    local hero = EntIndexToHScript( event.caster_entindex )
    local itemTable = GameMode.ItemInfoKV[itemName]
    print("Checking Restrictions for "..itemName)
    DeepPrintTable(itemTable)

    -- if there is no subtable for this item, end this script
    if itemTable == nil then
        return true
    end

    -- This timer is needed because OnEquip triggers before the item actually being in inventory
    Timers:CreateTimer(0.1,function()
        -- Go through every item slot
        for itemSlot = 0, 5, 1 do 
            local Item = hero:GetItemInSlot( itemSlot )
            -- When we find the item we want to check
            if Item ~= nil and itemName == Item:GetName() then
                DeepPrintTable(Item)

                -- Check Level Restriction
                if itemTable.levelRequired then
                    print("Name","Level Req","Hero Level")
                    print(itemName,itemTable.levelRequired,hero:GetLevel())
                    -- If the hero doesn't met the level required, show message and call DropItem
                    if itemTable.levelRequired > hero:GetLevel() then
                        FireGameEvent( 'custom_error_show', { player_ID = pID, _error = "You need level "..itemTable.levelRequired.." to use this." } )
                        DropItem(Item, hero)
                    end 
                end

                -- Check Class Restriction
                if itemTable.classRequired then
                    print("Name","Class Req","Hero Class")
                    print(itemName,itemTable.classRequired,hero.class)
                    -- If the item is for an specific class, message and drop
                    if itemTable.classRequired ~= hero.class then
                        FireGameEvent( 'custom_error_show', { player_ID = pID, _error = "Requires ".. hero.class .." to use." } )
                        DropItem(Item, hero)
                    end
                end
            end
        end
    end)
end

function DropItem( item, hero )
    -- Error Sound
    EmitSoundOnClient("General.CastFail_InvalidTarget_Hero", hero:GetPlayerOwner())

    -- Create a new empty item
    local newItem = CreateItem( item:GetName(), nil, nil )
    newItem:SetPurchaseTime( 0 )

    -- This is needed if you are working with items with charges, uncomment it if so.
    -- newItem:SetCurrentCharges( goldToDrop )

    -- Make a new item and launch it near the hero
    local spawnPoint = Vector( 0, 0, 0 )
    spawnPoint = hero:GetAbsOrigin()
    local drop = CreateItemOnPositionSync( spawnPoint, newItem )
    newItem:LaunchLoot( false, 200, 0.75, spawnPoint + RandomVector( RandomFloat( 50, 150 ) ) )
    
    --finally, remove the item
    hero:RemoveItem(item)
end

~~~

---

Leave your questions or suggestions below.