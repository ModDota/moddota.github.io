---
title: Create Creature AttachWearable blocks directly from the keyvalues
author: Noya
steamId: 76561198046984233
date: 15.12.2015
category: general
---

For those still Ctrl+F'ing and copying from [items_game.txt](https://raw.githubusercontent.com/dotabuff/d2vpkr/master/dota/scripts/items/items_game.txt) I bring you the better solution:

First, "Map" the valid wearables from items_game:

~~~lua
function MapWearables()
    GameRules.items = LoadKeyValues("scripts/items/items_game.txt")['items']
    GameRules.modelmap = {}
    for k,v in pairs(GameRules.items) do
        if v.name and v.prefab ~= "loading_screen" then
            GameRules.modelmap[v.name] = k
        end
    end
end
~~~

Then, there's 2 options:

* Generate a default set for a hero name (internal `npc_dota_hero_name`)
* Generate a bundle set, you can use this list for set names: http://dota2.gamepedia.com/Equipment

**Usage**

* For default hero sets, run `GenerateDefaultBlock(hero_name)`
* For generating a bundle set, run: `GenerateBundleBlock(set_name)`

**Code, using 4 space indents**
~~~lua
function GenerateDefaultBlock( heroName )
    print("    \"Creature\"")
    print("    {")
    print("        \"AttachWearables\" ".."// Default "..heroName)
    print("        {")
    local defCount = 1
    for code,values in pairs(GameRules.items) do
        if values.name and values.prefab == "default_item" and values.used_by_heroes then
            for k,v in pairs(values.used_by_heroes) do
                if k == heroName then
                    local itemID = GameRules.modelmap[values.name]
                    GenerateItemDefLine( defCount, itemID, values.name )
                    defCount = defCount + 1
                end
            end
        end
    end
    print("        }")
    print("    }")
end
 
function GenerateBundleBlock( setname )
    local bundle = {}
    for code,values in pairs(GameRules.items) do
        if values.name and values.name == setname and values.prefab and values.prefab == "bundle" then
            bundle = values.bundle
        end
    end

    print("    \"Creature\"")
    print("    {")
    print("        \"AttachWearables\" ".."// "..setname)
    print("        {")
    local wearableCount = 1
    for k,v in pairs(bundle) do
        local itemID = GameRules.modelmap[k]
        if itemID then
            GenerateItemDefLine(wearableCount, itemID, k)
            wearableCount = wearableCount+1
        end
    end
    print("        }")
    print("    }")
end
 
function GenerateItemDefLine( i, itemID, comment )
    print("            \""..tostring(i).."\" { ".."\"ItemDef\" \""..itemID.."\" } // "..comment)
end
~~~