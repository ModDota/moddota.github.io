---
title: Item Drop System
author: Noya
steamId: '76561198046984233'
date: 17.05.2015
---

# Item Drop System

Here I'll go over the implementation of a flexible item drop system for any sort of gamemode, mostly useful for RPGs.

There are multiple ways to do this, for example [Warchasers uses a pure datadriven system](https://github.com/MNoya/Warchasers/blob/master/scripts/npc/npc_abilities_custom.txt#L3687-L5667) that goes over 2 thousand lines of abilities, each one for a different drop type... yeah you don't want to do that :sweat_smile:

The best way for this is to have a text file to configure what items can drop from each unit, how many, its chances, etc, then whenever a unit dies, if it has an entry for item drops, handle the chances and drops accordingly, with a couple of choices that can be further extended if necessary.

<StaticVideo path="/videos/PowerlessCourageousAsiantrumpetfish.mp4" />

## Step 1. Key Values Table

I recommend having a `kv` folder under scripts to store this and other similar table files. The file can have any extension, but using `.kv` is a good convention.

```
"Drops"
{
    "creature_name1"
    {
        "item_name1" "10"
        "item_name2" "50"
        "item_name3" "100"
    }
}
```

This table will set a creature to drop the first item with 10% chance, 50% on the second, and the third item will be dropped every time.

After saving and naming the file, this table has to be loaded in Lua, ideally in the initialization of the game mode, using the `LoadKeyValues("relative/path/to/file")` this way:

```lua
GameRules.DropTable = LoadKeyValues("scripts/kv/item_drops.kv")
```

In this initial version, each item drop chance is independent from the others. From the same creature there might be 1 drop, all of them, or none (if the chances are all less than 100). This behavior will be expanded later to provide some of the classic drop options.

## Step 2. OnEntityKilled Lua Event

Simply listen to `entity_killed` and call a custom RollDrops function with the killed unit as a parameter.

```lua
ListenToGameEvent('entity_killed', Dynamic_Wrap(GameMode, 'OnEntityKilled'), self)
```

```lua
function GameMode:OnEntityKilled( keys )
    local killedUnit = EntIndexToHScript( keys.entindex_killed )
    if killedUnit:IsCreature() then
        RollDrops(killedUnit)
    end
end
```

## Step 3. RollDrops Lua Script

Now given the subtable of the unit name contained in the main Drop Table, if it exists, iterate over the elements rolling each chance value.

If the Roll succeeds, proceed to create an item handle with the name, and `LaunchLoot` it with some fancy parameters (could also just use a `CreateItemOnPositionSync` to drop the item instantly at the death position)

```lua
function RollDrops(unit)
    local DropInfo = GameRules.DropTable[unit:GetUnitName()]
    if DropInfo then
        for item_name,chance in pairs(DropInfo) do
            if RollPercentage(chance) then
                -- Create the item
                local item = CreateItem(item_name, nil, nil)
                local pos = unit:GetAbsOrigin()
                local drop = CreateItemOnPositionSync( pos, item )
                local pos_launch = pos+RandomVector(RandomFloat(150,200))
                item:LaunchLoot(false, 200, 0.75, pos_launch, nil)
            end
        end
    end
end
```

## Step 4. Extending the solution to allow multiple drops of the same item

The way Lua KV tables work, it's not possible to have more than 1 of the same index, so if we were to add 2 "item_name1" entries both with some chance value, LoadKeyValues would fail.

To get around this, the table has to use another level and have each possible item drop of the unit be a table by itself:

```
"Drops"
{
    "creature_name1"
    {
        "1"
        {
            "Item"     "item_name1"
            "Chance"   "10"
            "Multiple" "3"
        }
        "2"
        {
            "Item"     "item_name2"
            "Chance"   "50"
            "Multiple" "1"
        }
    }
}
```

This structure along with the Multiple value will allow an item to be dropped more than once from the same creature. _"Multiple" "1"_ will just be 1 drop max.

The RollDrops function needs to be adjusted to read the subtables and the Item/Chance in a slightly different way:

```lua
function RollDrops(unit)
    local DropInfo = GameRules.DropTable[unit:GetUnitName()]
    if DropInfo then
        for k,ItemTable in pairs(DropInfo) do
            local chance = ItemTable.Chance or 100
            local max_drops = ItemTable.Multiple or 1
            local item_name = ItemTable.Item
            for i=1,max_drops do
                if RollPercentage(chance) then
                    print("Creating "..item_name)
                    local item = CreateItem(item_name, nil, nil)
                    item:SetPurchaseTime(0)
                    local pos = unit:GetAbsOrigin()
                    local drop = CreateItemOnPositionSync( pos, item )
                    local pos_launch = pos+RandomVector(RandomFloat(150,200))
                    item:LaunchLoot(false, 200, 0.75, pos_launch, nil)
                end
            end
        end
    end
end
```

The 'or 100' and 'or 1' are just to make sure that if the "Chance" or "Multiple" lines are missing, a default value ('drop always' and 'drop 1') will be used.

## Step 5. Extending to "100% drop one of these"

Sometimes doing "50% of item 1 and 50% of item 2" is too random, because it will mean sometimes a mob will drop nothing, and sometimes it might drop 2. In order to reduce the randomness and ensure a certain combination of items will drop, the most common approach is to have a set list of possible drops, and make it so that the unit will drop only one of that set at random.

To do this, instead of tying a single item to each item table, there will be yet another table of the \{possible Set of items\} that we want this creature to drop:

```
"Drops"
{
    "creature_name1"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_name_set1"
                "2" "item_name_set2"
                "3" "item_name_set3"
            }
            "Chance"   "100" //of dropping 1 of the set
        }
        "2"
        {
            "Item"     "item_name2"
            "Chance"   "50"
            "Multiple" "3"
        }
    }
}
```

The ItemSets entry could also have a "Multiple" kv if we wanted an scenario like "2 of these 3", but this can't guarantee that the 2nd roll won't drop the same item as the first, if it did.

And the RollDrops now looks like this:

```lua
function RollDrops(unit)
    local DropInfo = GameRules.DropTable[unit:GetUnitName()]
    if DropInfo then
        print("Rolling Drops for "..unit:GetUnitName())
        for k,ItemTable in pairs(DropInfo) do
            -- If its an ItemSet entry, decide which item to drop
            local item_name
            if ItemTable.ItemSets then
            	-- Count how many there are to choose from
            	local count = 0
            	for i,v in pairs(ItemTable.ItemSets) do
            		count = count+1
            	end
                local random_i = RandomInt(1,count)
                item_name = ItemTable.ItemSets[tostring(random_i)]
            else
                item_name = ItemTable.Item
            end
            local chance = ItemTable.Chance or 100
            local max_drops = ItemTable.Multiple or 1
            for i=1,max_drops do
            	print("Rolling chance "..chance)
                if RollPercentage(chance) then
                    print("Creating "..item_name)
                    local item = CreateItem(item_name, nil, nil)
                    item:SetPurchaseTime(0)
                    local pos = unit:GetAbsOrigin()
                    local drop = CreateItemOnPositionSync( pos, item )
                    local pos_launch = pos+RandomVector(RandomFloat(150,200))
                    item:LaunchLoot(false, 200, 0.75, pos_launch, nil)
                end
            end
        end
    end
end
```

## Example item_drops.kv file

```
"Drops"
{
    //===============================================
    // ItemDrops UI Configuration
    //===============================================

    "MaxTime"        "60"
    "MaxDropsOnScreen"  "3"

    "ItemQualityColors"
    {
        "artifact"  "#FFA500" //Orange
        "epic"      "#8847FF" //Purple
        "rare"      "#4B69FF" //Blue
        "common"    "#00FF00" //Lime Green
        "component" "#FFFFFF" //White
        "consumable" "#FFFFFF" //White
    }

    // Don't fire the item_drop event for these
    "ExcludedQualities"
    {
        "consumable" "1"
        "component"  "1"
    }

    //===============================================
    // Roll Drops Configuration
    // Zone Specific
    //===============================================

    //===============================================
    // Titans
    //===============================================

    "titan_Avatar_of_Earth"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_boots_of_agility_16"
                "2" "item_cloak_of_flames_25"
                "3" "item_gauntlets_of_might_16"
                "4" "item_orb_of_mana"
                "5" "item_life_gem"
                "6" "item_firehand_gauntlets_20"
                "7" "item_robes_of_enlightenment_16"
            }
            "Chance"   "100"
        }
    }
    "titan_Avatar_of_Nature"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_boots_of_agility_16"
                "2" "item_heros_blade"
                "3" "item_gauntlets_of_might_16"
                "4" "item_orb_of_mana"
                "5" "item_ring_of_spell_power"
                "6" "item_heros_hauberk"
                "7" "item_robes_of_enlightenment_16"
                "8" "item_ring_of_healing_power"
            }
            "Chance"   "100"
        }
    }
    "titan_Avatar_of_Justice"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_boots_of_agility_16"
                "2" "item_cloak_of_flames_25"
                "3" "item_gauntlets_of_might_16"
                "4" "item_orb_of_mana"
                "5" "item_life_gem"
                "6" "item_firehand_gauntlets_20"
                "7" "item_robes_of_enlightenment_16"
            }
            "Chance"   "100"
        }
    }
    "titan_Avatar_of_Death"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_tbr_ring_of_health"
                "3" "item_pendant_of_energy"
            }
            "Chance"   "100"
        }
    }
    "titan_Avatar_of_the_Sky"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_tbr_ring_of_health"
                "3" "item_pendant_of_energy"
            }
            "Chance"   "100"
        }
    }
    "titan_Avatar_of_Sacrifice"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_tbr_ring_of_health"
                "3" "item_pendant_of_energy"
            }
            "Chance"   "100"
        }
    }
    "titan_Avatar_of_the_Sea"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_tbr_ring_of_health"
                "3" "item_pendant_of_energy"
            }
            "Chance"   "100"
        }
    }
    "titan_Mother_of_Earth"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_tbr_ring_of_health"
                "3" "item_pendant_of_energy"
            }
            "Chance"   "100"
        }
    }

    //===============================================
    // Demon Area
    //===============================================

	"demon_imp"     // noob tier
    {
        "1"
        {
            "Item"     "item_potion_of_minor_healing"
            "Chance"   "10"
        }
        "2"
        {
            "Item"     "item_gold_bag_100"
            "Chance"   "10"
        }
        "3"
        {
            "ItemSets"
            {
                "1" "item_talisman_of_health"
                "2" "item_ring_of_regeneration"
                "3" "item_apprentice_robes"
                "4" "item_hard_leather_armor"
                "5" "item_ring_mail"
            }
            "Chance"   "3"
        }
    }

    "demon_hound"   // noob tier
    {
        "1"
        {
            "Item"     "item_potion_of_minor_healing"
            "Chance"   "10"
        }
        "2"
        {
            "Item"     "item_potion_of_minor_healing"
            "Chance"   "10"
        }
        "3"
        {
            "Item"     "item_gold_bag_100"
            "Chance"   "10"
        }
        "4"
        {
            "ItemSets"
            {
                "1" "item_talisman_of_health"
                "2" "item_ring_of_regeneration"
                "3" "item_apprentice_robes"
                "4" "item_hard_leather_armor"
                "5" "item_ring_mail"
            }
            "Chance"   "8"
        }
    }

    "demon_fire"    // noob tier
    {
        "1"
        {
            "Item"     "item_potion_of_minor_healing"
            "Chance"   "10"
        }
        "2"
        {
            "Item"     "item_potion_of_minor_healing"
            "Chance"   "10"
        }
        "3"
        {
            "Item"     "item_gold_bag_100"
            "Chance"   "10"
        }
        "4"
        {
            "ItemSets"
            {
                "1" "item_talisman_of_health"
                "2" "item_ring_of_regeneration"
                "3" "item_apprentice_robes"
                "4" "item_hard_leather_armor"
                "5" "item_ring_mail"
            }
            "Chance"   "5"
        }
    }

    "forest_bear"   // tier 1
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    "nukacha"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_tbr_ring_of_health"
                "3" "item_pendant_of_energy"
                //"4" "item_goldbag" // It spawns between 1 to 6 Gold Bags of 50 gold each
            }
            "Chance"   "100"
        }
    }

    //===============================================
    // Goblin Area
    //===============================================

    "goblin"        // tier 1
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    "shaman"        // tier 1
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }
    //===============================================
    // Black Goblin Area
    //===============================================

    "black_goblin"  // tier 1
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    "black_shaman"  // tier 1
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    "ogre"          // tier 1
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    "rokthul"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_boots_of_agility_8"
                "2" "item_medallion_of_stamina"
                "3" "item_pendant_of_mana"
                "4" "item_gauntlets_of_might_8"
                "5" "item_robes_of_enlightenment_8"
                "6" "item_tbr_circlet_of_nobility"
            }
            "Chance"   "100"
        }
    }
    //===============================================
    // Bandit Area
    //===============================================

    "bandit"        // tier 1
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    "mance_swiftsword"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_pendant_of_energy"
                "2" "item_tbr_ring_of_health"
                "3" "item_orb_of_unending_life"
                "4" "item_ring_of_vigor"
                //"5" "item_goldbag" // drops between 1 to 12 goldbags of 50 gold each
            }
            "Chance"   "100"
        }
    }
    //===============================================
    // Spider Area
    //===============================================

    "forest_spider" // tier 1
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    "forest_lurker" // tier 2
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    "giant_spider"  // tier 2
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    "forest_terror"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_boots_of_agility_8"
                "2" "item_tbr_broadsword"
                "3" "item_mail_shirt"
                "4" "item_gauntlets_of_might_8"
                "5" "item_robes_of_enlightenment_8"
                "6" "item_wand_of_healing_power"
                "7" "item_wand_of_spell_power"
            }
            "Chance"   "100"
        }
    }
    //===============================================
    // Sea Servant Area
    //===============================================

    "sea_servant_huntsman"  // tier 1
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }
    "sea_servant_wavecaller"    // tier 2
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    //===============================================
    // Mountain Wolf Area
    //===============================================

    "mountain_wolf"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    //===============================================
    // Minotaur Area
    //===============================================

    "minotaur_grunt"    // tier 1
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    "minotaur_warlock"  // tier 2
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    "minotaur_beastman" // tier 2
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    "giant_of_the_seas" // tier 2 or 3 (its lvl 29)
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }
    //===============================================
    // Area
    //===============================================

    "bandit"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    "bandit"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    "bandit"
    {
       "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    "bandit"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }

    "bandit"
    {
        "1"
        {
            "ItemSets"
            {
                "1" "item_ring_of_regeneration"
                "2" "item_boots_of_agility_8"
                "3" "item_tbr_broadsword"
                "4" "item_tbr_circlet_of_nobility"
                "5" "item_cloak_of_flames_25"
                "6" "item_firehand_gauntlets_20"
                "7" "item_gauntlets_of_might_8"
                "8" "item_mail_shirt"
                "9" "item_pendant_of_energy" // This item doesn't exist, needs to be made
                "10" "item_ring_of_dodging"
                "11" "item_tbr_ring_of_health"  // This item doesn't exist, needs to be made
                "12" "item_ring_of_vigor"
                "13" "item_robes_of_enlightenment_8"
                "14" "item_wand_of_healing_power"
                "15" "item_wand_of_spell_power"
            }
            "Chance"   "5" //of dropping 1 of the set
        }
        "2"
        {
            "ItemSets"
            {
                "1" "item_potion_of_lesser_healing"
                "2" "item_potion_of_lesser_mana"
            }
            "Chance"   "10" //of dropping 1 of the set
        }
    }
}
```
