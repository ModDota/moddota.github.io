---
title: Item KeyValues
author: Noya
steamId: '76561198046984233'
date: 01.12.2014
---

# Item KeyValues

A comprehensive guide to npc_items_custom and coding items

## General

Start with `item_` and your item name. If you **don't** put `item_` at the beginning of an item, bad things happen.

```
"item_custom"
{ ... }
```

Each item needs its proper ID for purchasing on the shop, although you can define items without an ID if you only plan to create them through Lua.
Do not override Dota IDs, use IDs between 1000~2000

`"ID" "1100"`

Next is the BaseClass. It can be DataDriven, or overriding an existing item from the [default dota item_names](https://github.com/dotabuff/d2vpk/blob/master/dota_pak01/scripts/npc/items.txt).

```
"BaseClass" "item_datadriven"
            "item_aegis"
```

If you want to override an item, you won't be able to change/add abilities, you'll be limited to change values from items.txt (and some values can't even be changed)
So it's recommended to always try to make a datadriven version of the item if you want to have complete freedom on what your item does.

Now that we settled that, I'll review the most common key values seen in items.

### Basic Rules

```
"ItemCost" "322"
"ItemKillable" "0"
"ItemSellable" "1"
"ItemPurchasable" "1"
"ItemDroppable" "1"
```

ItemKillable lets both allies and enemies destroy the dropped item by attacking it.

### Stock

```
"ItemStockMax" "1"
"ItemStockTime" "100"
"ItemStockInitial" "3"
```

### Ownership

If you omit the following, its behavior will be NOT_SHAREABLE

```
"ItemShareability" "ITEM_NOT_SHAREABLE"             //Rapier
                   "ITEM_PARTIALLY_SHAREABLE"       //Ring of Regen
                   "ITEM_FULLY_SHAREABLE"           //Gem
                   "ITEM_FULLY_SHAREABLE_STACKING"  //Consumables
```

### Charges

```
"ItemInitialCharges" "1" //How many charges should the item start with - Tango x3
"ItemDisplayCharges" "1" //Hide the charges of the item - Aegis
"ItemRequiresCharges" "1" //The active ability needs charges to be used - Urn
```

Also remember to add this somewhere, normally at the beginning of a OnSpellStart block

`"SpendCharge" {}`

### Stacking, Consumable

```
"ItemStackable" "1"
"ItemPermanent" "0"
```

If "ItemPermanent" is set to 1, charged items won't disappear when they hit 0 charges (Bottle, Urn, etc)
By omitting it will also default to 1.

### Auto Cast

This value is the key for Tomes of Stats and other consumable items:

`"ItemCastOnPickup" "1"`

### Upgradeable items

```
"MaxUpgradeLevel" "5" // Dagon - 5
"ItemBaseLevel" "1" //You'll need 5 different items, and change each accordingly
```

### Recipes

```
"item_recipe_custom"
{
    "ID" "1200"
    "BaseClass"           "item_datadriven"
    "ItemRecipe"          "1" //destroyed after combine
    "ItemCost"            "0" //if its 0, it will combine without needing a recipe.
    "ItemResult"          "item_custom" //the result of combining the ItemRequirements
    "ItemRequirements"
    {
        "01" "item_ingredient_1;item_ingredient_2;item_ingredient_3"
        "02" "item_ingredient_1;item_ingredient_2;item_ingredient_alternative_3"
    }
}
```

**IMPORTANT NOTE:** Your item name for the recipe to be recognized by the Dota Shop UI NEEDS to have this format:

```
"item_recipe_(name of your item)"
```

Meaning if the ItemResult you want to get is called _"item_capuchino"_, your recipe would be: _"item_recipe_capuchino"_

![img](/images/external/dyDFL-f0a814100d.jpg)

If you don't, the item will still be combinable but it won't show the neat lines to the possible upgrades.

### Disassembling

```
"ItemDisassembleRule" "DOTA_ITEM_DISASSEMBLE_ALWAYS"
                      "DOTA_ITEM_DISASSEMBLE_NEVER"
```

## Common Modifier Key Values for items

We now have an item, but it doesn't do anything on its own.
To make it add stats or buffs, we need to set modifiers inside the item definition
For more on Modifiers, check the [Constants in the wiki]

```
"Modifiers"
{
    "item_custom_modifier"
    {
        "Passive" "1"
        "IsHidden" "0"
        "Attributes" "MODIFIER_ATTRIBUTE_MULTIPLE" //This makes duplicate items stack their properties
        "Properties"
        {
            "MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT" "%movement_speed"
            "MODIFIER_PROPERTY_EVASION_CONSTANT" "%evasion"
            "MODIFIER_PROPERTY_STATS_STRENGTH_BONUS" "%bonus_str_agi"
            "MODIFIER_PROPERTY_STATS_AGILITY_BONUS" "%bonus_agi"
            "MODIFIER_PROPERTY_STATS_INTELLECT_BONUS" "%bonus_int"
            "MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE" "%damage_bonus_percent"
        }

        "States"
        {
            "MODIFIER_STATE_SPECIALLY_DENIABLE" "MODIFIER_STATE_VALUE_ENABLED"
            "MODIFIER_STATE_MAGIC_IMMUNE" "MODIFIER_STATE_VALUE_ENABLED"
            "MODIFIER_STATE_NO_HEALTH_BAR" "MODIFIER_STATE_VALUE_ENABLED"
        }
    }
}

```

## Adding spell functionality

Apart from these values specially related to items, you can add **_everything_** that could be part of a datadriven ability, for example:

```
"AbilityBehavior" "DOTA_ABILITY_BEHAVIOR_PASSIVE"
"AbilityUnitTargetTeam" "DOTA_UNIT_TARGET_TEAM_BOTH"
"AbilityUnitTargetType" "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC"
"AbilityCastAnimation" "ACT_DOTA_CAST_ABILITY_1"
"AbilityManaCost" "100"
"AbilityValues"
{...}
```

**[Ability Events](datadriven/datadriven-ability-events-modifiers)** like `"OnSpellStart"`, `"OnOwnerDied"` or `"OnEquip"` also go here in the main block.

You need at least set the AbilityBehavior for your item to not be active (if you don't, it will default to `DOTA_ABILITY_BEHAVIOR_UNIT_TARGET`).

See more on the complete [DataDriven Ability Breakdown](ability-keyvalues)

## Icons and Custom Shops

For your item to have an icon you'll need to go to your addon folder under this path:

`/resource/flash3/images/items`

And put a `.PNG` file with dimensions **86 x 64**, with the same name as the `item_custom`, WITHOUT the `item_`

![img](/images/external/4Jr9cpF.png)

Then in your "item_custom" code, you add the following:

`"AbilityTextureName" "item_custom"`

You can also use the names of the dota icons. Just make sure this line starts with `"item_`, so the engine knows to look the image on the items folder.

Adding the item to a shop. Layout [Here]
For this, inside your addon folder you need to go inside `scripts/shops` and make/edit a `.txt` file with this name file structure:

`mapName_shops.txt`

mapName should be the name of YOUR MAP (`.vmap` file in Hammer or content folder), NOT your addon name (both could be the same, or you could have multiple maps with different shops)

Adding `_shops` to the mapName is also mandatory.

A template shop file:

```
//<map_name>_shops.txt inside a scripts\shops\ folder

"dota_shops"
{
	"consumables"
	{
		"item" 		"item_ingredient"
		"item"		"item_result"
	}

	"attributes"
	{

	}

	"weapons_armor"
	{

	}

	"misc"
	{

	}

	// Level 1 - Green Recipes
	"basics"
	{

	}

	// Level 2 - Blue Recipes
	"support"
	{

	}

	"magics"
	{

	}

	// Level 3 - Purple Recipes
	"defense"
	{

	}

	"weapons"
	{

	}

	// Level 4 - Orange / Orb / Artifacts
	"artifacts"
	{

	}

	"sideshop1"
	{

	}

	"sideshop2"
	{

	}

	"secretshop"
	{

	}
}
```

In addition to this file, your item can have key value rules for where it can be bought

```
"SideShop" "1"
"SecretShop" "0"
```

At the moment of writing this guide, we can only set up 3 different shops (Home, Side and Secret).
You can change categories and shop tab names, with [addon_english modding]

To make an actual shop area inside your map on Hammer, check this other tutorial [tutorial_creating_a_custom_shop_step_by_step](https://www.reddit.com/r/Dota2Modding/comments/2dpts1/tutorial_creating_a_custom_shop_step_by_step/)

To disable your dota items, use this `npc_abilities_override.txt` inside the `scripts/npc` folder:

::: details npc_abilities_override.txt

```
// Dota Abilities Override File
"DOTAAbilities"
{

// ITEM SHOPS---------------------------------------------------

	"item_blink"			"REMOVE"
	"item_blades_of_attack"			"REMOVE"
	"item_broadsword"			"REMOVE"
	"item_chainmail"			"REMOVE"
	"item_claymore"			"REMOVE"
	"item_helm_of_iron_will"			"REMOVE"
	"item_javelin"			"REMOVE"
	"item_mithril_hammer"			"REMOVE"
	"item_platemail"			"REMOVE"
	"item_quarterstaff"			"REMOVE"
	"item_quelling_blade"			"REMOVE"
	"item_ring_of_protection"			"REMOVE"
	"item_stout_shield"			"REMOVE"
	"item_gauntlets"			"REMOVE"
	"item_slippers"			"REMOVE"
	"item_mantle"			"REMOVE"
	"item_branches"			"REMOVE"
	"item_belt_of_strength"			"REMOVE"
	"item_boots_of_elves"			"REMOVE"
	"item_robe"			"REMOVE"
	"item_circlet"			"REMOVE"
	"item_ogre_axe"			"REMOVE"
	"item_blade_of_alacrity"			"REMOVE"
	"item_staff_of_wizardry"			"REMOVE"
	"item_ultimate_orb"			"REMOVE"
	"item_gloves"			"REMOVE"
	"item_lifesteal"			"REMOVE"
	"item_ring_of_regen"			"REMOVE"
	"item_sobi_mask"			"REMOVE"
	"item_boots"			"REMOVE"
	"item_gem"			"REMOVE"
	"item_cloak"			"REMOVE"
	"item_talisman_of_evasion"			"REMOVE"
	"item_cheese"			"REMOVE"
	"item_magic_stick"			"REMOVE"
	"item_recipe_magic_wand"			"REMOVE"
	"item_magic_wand"			"REMOVE"
	"item_ghost"			"REMOVE"
	"item_clarity"			"REMOVE"
	"item_flask"			"REMOVE"
	"item_dust"			"REMOVE"
	"item_bottle"			"REMOVE"
	"item_ward_observer"			"REMOVE"
	"item_ward_sentry"			"REMOVE"
	"item_tango"			"REMOVE"
	"item_tango_single"			"REMOVE"
	"item_courier"			"REMOVE"
	"item_tpscroll"			"REMOVE"
	"item_recipe_travel_boots"			"REMOVE"
	"item_travel_boots"			"REMOVE"
	"item_recipe_phase_boots"			"REMOVE"
	"item_phase_boots"			"REMOVE"
	"item_demon_edge"			"REMOVE"
	"item_eagle"			"REMOVE"
	"item_reaver"			"REMOVE"
	"item_relic"			"REMOVE"
	"item_hyperstone"			"REMOVE"
	"item_ring_of_health"			"REMOVE"
	"item_void_stone"			"REMOVE"
	"item_mystic_staff"			"REMOVE"
	"item_energy_booster"			"REMOVE"
	"item_point_booster"			"REMOVE"
	"item_vitality_booster"			"REMOVE"
	"item_recipe_power_treads"			"REMOVE"
	"item_power_treads"			"REMOVE"
	"item_recipe_hand_of_midas"			"REMOVE"
	"item_hand_of_midas"			"REMOVE"
	"item_recipe_oblivion_staff"			"REMOVE"
	"item_oblivion_staff"			"REMOVE"
	"item_recipe_pers"			"REMOVE"
	"item_pers"			"REMOVE"
	"item_recipe_poor_mans_shield"			"REMOVE"
	"item_poor_mans_shield"			"REMOVE"
	"item_recipe_bracer"			"REMOVE"
	"item_bracer"			"REMOVE"
	"item_recipe_wraith_band"			"REMOVE"
	"item_wraith_band"			"REMOVE"
	"item_recipe_null_talisman"			"REMOVE"
	"item_null_talisman"			"REMOVE"
	"item_recipe_mekansm"			"REMOVE"
	"item_mekansm"			"REMOVE"
	"item_recipe_vladmir"			"REMOVE"
	"item_vladmir"			"REMOVE"
	"item_flying_courier"			"REMOVE"
	"item_recipe_buckler"			"REMOVE"
	"item_buckler"			"REMOVE"
	"item_recipe_ring_of_basilius"			"REMOVE"
	"item_ring_of_basilius"			"REMOVE"
	"item_recipe_pipe"			"REMOVE"
	"item_pipe"			"REMOVE"
	"item_recipe_urn_of_shadows"			"REMOVE"
	"item_urn_of_shadows"			"REMOVE"
	"item_recipe_headdress"			"REMOVE"
	"item_headdress"			"REMOVE"
	"item_recipe_sheepstick"			"REMOVE"
	"item_sheepstick"			"REMOVE"
	"item_recipe_orchid"			"REMOVE"
	"item_orchid"			"REMOVE"
	"item_recipe_cyclone"			"REMOVE"
	"item_cyclone"			"REMOVE"
	"item_recipe_force_staff"			"REMOVE"
	"item_force_staff"			"REMOVE"
	"item_recipe_dagon"			"REMOVE"
	"item_recipe_dagon_2"			"REMOVE"
	"item_recipe_dagon_3"			"REMOVE"
	"item_recipe_dagon_4"			"REMOVE"
	"item_recipe_dagon_5"			"REMOVE"
	"item_dagon"			"REMOVE"
	"item_dagon_2"			"REMOVE"
	"item_dagon_3"			"REMOVE"
	"item_dagon_4"			"REMOVE"
	"item_dagon_5"			"REMOVE"
	"item_recipe_necronomicon"			"REMOVE"
	"item_recipe_necronomicon_2"			"REMOVE"
	"item_recipe_necronomicon_3"			"REMOVE"
	"item_necronomicon"			"REMOVE"
	"item_necronomicon_2"			"REMOVE"
	"item_necronomicon_3"			"REMOVE"
	"item_recipe_ultimate_scepter"			"REMOVE"
	"item_ultimate_scepter"			"REMOVE"
	"item_recipe_refresher"			"REMOVE"
	"item_refresher"			"REMOVE"
	"item_recipe_assault"			"REMOVE"
	"item_assault"			"REMOVE"
	"item_recipe_heart"			"REMOVE"
	"item_heart"			"REMOVE"
	"item_recipe_black_king_bar"			"REMOVE"
	"item_black_king_bar"			"REMOVE"
	"item_aegis"			"REMOVE"
	"item_recipe_shivas_guard"			"REMOVE"
	"item_shivas_guard"			"REMOVE"
	"item_recipe_bloodstone"			"REMOVE"
	"item_bloodstone"			"REMOVE"
	"item_recipe_sphere"			"REMOVE"
	"item_sphere"			"REMOVE"
	"item_recipe_reflex_energy_regen_booster"			"REMOVE"
	"item_vanguard"			"REMOVE"
	"item_recipe_blade_mail"			"REMOVE"
	"item_blade_mail"			"REMOVE"
	"item_recipe_soul_booster"			"REMOVE"
	"item_soul_booster"			"REMOVE"
	"item_recipe_hood_of_defiance"			"REMOVE"
	"item_hood_of_defiance"			"REMOVE"
	"item_recipe_rapier"			"REMOVE"
	"item_rapier"			"REMOVE"
	"item_recipe_monkey_king_bar"			"REMOVE"
	"item_monkey_king_bar"			"REMOVE"
	"item_recipe_radiance"			"REMOVE"
	"item_radiance"			"REMOVE"
	"item_recipe_butterfly"			"REMOVE"
	"item_butterfly"			"REMOVE"
	"item_recipe_greater_crit"			"REMOVE"
	"item_greater_crit"			"REMOVE"
	"item_recipe_basher"			"REMOVE"
	"item_basher"			"REMOVE"
	"item_recipe_bfury"			"REMOVE"
	"item_bfury"			"REMOVE"
	"item_recipe_manta"			"REMOVE"
	"item_manta"			"REMOVE"
	"item_recipe_lesser_crit"			"REMOVE"
	"item_lesser_crit"			"REMOVE"
	"item_recipe_armlet"			"REMOVE"
	"item_armlet"			"REMOVE"
	"item_recipe_invis_sword"			"REMOVE"
	"item_invis_sword"			"REMOVE"
	"item_recipe_sange_and_yasha"			"REMOVE"
	"item_sange_and_yasha"			"REMOVE"
	"item_recipe_satanic"			"REMOVE"
	"item_satanic"			"REMOVE"
	"item_recipe_mjollnir"			"REMOVE"
	"item_mjollnir"			"REMOVE"
	"item_recipe_skadi"			"REMOVE"
	"item_skadi"			"REMOVE"
	"item_recipe_sange"			"REMOVE"
	"item_sange"			"REMOVE"
	"item_recipe_helm_of_the_dominator"			"REMOVE"
	"item_helm_of_the_dominator"			"REMOVE"
	"item_recipe_maelstrom"			"REMOVE"
	"item_maelstrom"			"REMOVE"
	"item_recipe_desolator"			"REMOVE"
	"item_desolator"			"REMOVE"
	"item_recipe_yasha"			"REMOVE"
	"item_yasha"			"REMOVE"
	"item_recipe_mask_of_madness"			"REMOVE"
	"item_mask_of_madness"			"REMOVE"
	"item_recipe_diffusal_blade"			"REMOVE"
	"item_recipe_diffusal_blade_2"			"REMOVE"
	"item_diffusal_blade"			"REMOVE"
	"item_diffusal_blade_2"			"REMOVE"
	"item_recipe_ethereal_blade"			"REMOVE"
	"item_ethereal_blade"			"REMOVE"
	"item_recipe_soul_ring"			"REMOVE"
	"item_soul_ring"			"REMOVE"
	"item_recipe_arcane_boots"			"REMOVE"
	"item_arcane_boots"			"REMOVE"
	"item_orb_of_venom"			"REMOVE"
	"item_recipe_ancient_janggo"			"REMOVE"
	"item_ancient_janggo"			"REMOVE"
	"item_recipe_medallion_of_courage"			"REMOVE"
	"item_medallion_of_courage"			"REMOVE"
	"item_smoke_of_deceit"			"REMOVE"
	"item_recipe_veil_of_discord"			"REMOVE"
	"item_veil_of_discord"			"REMOVE"
	"item_recipe_rod_of_atos"			"REMOVE"
	"item_rod_of_atos"			"REMOVE"
	"item_recipe_abyssal_blade"			"REMOVE"
	"item_abyssal_blade"			"REMOVE"
	"item_recipe_heavens_halberd"			"REMOVE"
	"item_heavens_halberd"			"REMOVE"
	"item_recipe_ring_of_aquila"			"REMOVE"
	"item_ring_of_aquila"			"REMOVE"
	"item_recipe_tranquil_boots"			"REMOVE"
	"item_tranquil_boots"			"REMOVE"
	"item_shadow_amulet"			"REMOVE"
	"item_halloween_candy_corn"			"REMOVE"
	"item_mystery_hook"			"REMOVE"
	"item_mystery_arrow"			"REMOVE"
	"item_mystery_missile"			"REMOVE"
	"item_mystery_toss"			"REMOVE"
	"item_mystery_vacuum"			"REMOVE"
	"item_halloween_rapier"			"REMOVE"
	"item_greevil_whistle"			"REMOVE"
	"item_greevil_whistle_toggle"			"REMOVE"
	"item_present"			"REMOVE"
	"item_winter_stocking"			"REMOVE"
	"item_winter_skates"			"REMOVE"
	"item_winter_cake"			"REMOVE"
	"item_winter_cookie"			"REMOVE"
	"item_winter_coco"			"REMOVE"
	"item_winter_ham"			"REMOVE"
	"item_winter_kringle"			"REMOVE"
	"item_winter_mushroom"			"REMOVE"
	"item_winter_greevil_treat"			"REMOVE"
	"item_winter_greevil_garbage"			"REMOVE"
	"item_winter_greevil_chewy"			"REMOVE"
}
```

:::

## Cosmetic Values: Models, Effects, Tags and others.

These values are optional but greatly improve the quality of your item

### Sounds when Picked, Dropped

```
"UIPickupSound" "Item.PickUpRingShop" //Sound when acquiring the item
"UIDropSound" "Item.DropRecipeShop" //Sound when dropping the item manually
"WorldDropSound" "Item.DropGemWorld" //Sound when dropping the item on death (?)
```

### Model and Glow in the world.

VMDL and Particle files can be seen through the [Asset Browser]

```
"Model" "models/chest_worlddrop.vmdl"
"Effect" "particles/generic_gameplay/dropped_item.vpcf"
```

You can find good models in /props_gameplay, /econ or use your own customs

Important: If you create the item through lua [CreateItemOnPositionSync], you need to provide vision of the world position where the item is being created, at least briefly, to properly display the particle effect.

### Change the displayed color of the item

```
"ItemQuality"    "artifact" //Orange
                 "epic" //Purple
                 "rare" //Blue
                 "common" //Green
                 "component" //White
                 "consumable" //White
```

### Tags & Alias

Tags are defined in `addon_english.txt`, find them in [dota_english] under `// Tags`
Aliases help the search bar to find the item quickly with abbreviations

```
"ItemShopTags" "int;str;agi;mana_pool;health_pool;hard_to_tag"
"ItemAliases" "this;appears_in;search"
```

Omit to not announce.

```
"ItemDeclarations" "DECLARE_PURCHASES_TO_TEAMMATES"
                   "DECLARE_PURCHASES_IN_SPEECH"
                   "DECLARE_PURCHASES_TO_SPECTATORS"
```

### Restrictions

This is how Basher is disallowed for certain heroes

```
"InvalidHeroes" "npc_dota_hero_spirit_breaker;npc_dota_hero_faceless_void"
```

For the Scripted, more powerful version, read more on [Item Restrictions & Requirements](/scripting/item-restrictions-requirements)

## Alt-Click

Alt-click text on items in Inventory and dropped on the ground. Takes the strings from `resource/addon_english.txt`
or any other languages.

### PingOverrideText

Overrides the default "[ALLIES] **ItemName** dropped here".
It will look for _#DOTA_Chat_Text_String_ (_Text_String_ can be whatever) in your addon strings.

<StaticVideo path="/videos/RemarkableImportantAnt.mp4" />

In the item_datadriven:

```
"PingOverrideText" "DOTA_Chat_Text_String"
```

In addon_english.txt:

```
"DOTA_Chat_Text_String" "[VOLVO] Giff"
```

### ItemAlertable

Displays "[ALLIES] Gather for **ItemName** here."

![img](/images/external/duiGf-025d66f1cd.jpg)

```
"ItemAlertable"	"1"
```

## Basic Item Skeleton

Copy this to start an item

```
"item_custom"
{
    "ID"           "1100"
    "BaseClass"    "item_datadriven"
    "AbilityTextureName" "item_rapier"
    "Model"        "models/props_gameplay/recipe.vmdl"
    "Effect"       "particles/generic_gameplay/dropped_item.vpcf"
    "ItemQuality"  "artifact"

    "ItemCost"     "322"
    "ItemKillable" "0"
    "ItemSellable" "1"
    "ItemPurchasable" "1"
    "ItemDroppable" "1"
    "ItemShareability" "ITEM_NOT_SHAREABLE"

    "SideShop"     "1"
    "SecretShop"   "0"

    "ItemStackable" "1"
    "ItemPermanent" "1"
    "ItemDisassembleRule" "DOTA_ITEM_DISASSEMBLE_ALWAYS"

    "AbilitySpecial"
    {
        "01"
        {
            "var_type"      "FIELD_INTEGER"
            "bonus_stat"    "100"
        }
    }

    "Modifiers"
    {
        "modifier_item_custom"
        {
            "Passive"  "1"
            "IsHidden" "1"
            "Attributes" "MODIFIER_ATTRIBUTE_MULTIPLE"
            "Properties"
            {
                "MODIFIER_PROPERTY_STATS_STRENGTH_BONUS" "%bonus_stat"
            }
        }
    }
}
```

Those are the most important values. For Charges, Upgrades, Sounds, Aliases & Declarations add the lines explained before, I kept them out of the basic layout because they aren't needed for most items.

I also added a very basic passive Modifier which takes the _bonus_stat_ from `AbilitySpecial` to give 1 Strength bonus. Using `AbilitySpecial` makes it easier to make tooltips and adjust item values later without having to change said tooltips.

## Adding More Stats

Every value from [Modifier Constants](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/Constants#Modifier_Properties) can be added to the `"Properties"` block, some very common examples are:

```
    "Properties"
    {
        "MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT" "%bonus_attackspeed"
        "MODIFIER_PROPERTY_STATS_STRENGTH_BONUS" "%bonus_str"
        "MODIFIER_PROPERTY_STATS_AGILITY_BONUS" "%bonus_agi"
        "MODIFIER_PROPERTY_STATS_INTELLECT_BONUS" "%bonus_int"
        "MODIFIER_PROPERTY_HEALTH_BONUS"    "%bonus_hp"
        "MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT" "%bonus_health_regen"
        "MODIFIER_PROPERTY_MANA_BONUS"  "%bonus_hp"
        "MODIFIER_PROPERTY_MANA_REGEN_PERCENTAGE"  "%bonus_mana_regen"
        "MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE"   "%bonus_damage_percent"
    }
```

## Charged Consumables

### Tome of Stats

[item_tome_of_knowledge](https://github.com/MNoya/Warchasers/blob/master/scripts/npc/npc_items_custom.txt#L1475)

### Potion of Health

[item_potion_of_healing](https://github.com/MNoya/Warchasers/blob/master/scripts/npc/npc_items_custom.txt#L1844)

### Summons

[item_demonic_figurine](https://github.com/MNoya/Warchasers/blob/master/scripts/npc/npc_items_custom.txt#L2967)

## Upgradeable Items and Recipes

- See [Reflex](https://github.com/bmddota/reflexdota/blob/source2/game/dota_addons/reflex/scripts/npc/npc_items_custom.txt)

Apart from these values, item code uses the same datadriven values as abilities. See the [DataDriven Ability Breakdown](ability-keyvalues).

## Passives

### Auras

`"AbilityBehavior" "DOTA_ABILITY_BEHAVIOR_AURA | DOTA_ABILITY_BEHAVIOR_PASSIVE"`

In a modifier block:

```
    "Aura"  "custom_aura"
    "Aura_Teams"    "DOTA_UNIT_TARGET_TEAM_FRIENDLY"
    "Aura_Radius"   "%radius"
    "Aura_Types"    "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC"
    "Aura_Flags" "DOTA_UNIT_TARGET_FLAG_RANGED_ONLY"
```

Then have a new modifier block with the Aura name with the desired effects.

### Damage over time

Inside a modifier, use `"ThinkInterval" "1"` and have a `"OnIntervalThink"` block in which you do damage.

```
    "ThinkInterval" "1"
    "OnIntervalThink"
    {
        "Damage"
        {
             "Target"
             {
                 "Center" "CASTER"
                 "Radius" "%radius"
                 "Teams" "DOTA_UNIT_TARGET_TEAM_ENEMY"
                 "Types" "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC"
             }
             "Type" "DAMAGE_TYPE_MAGICAL"
             "Damage"   "%damage_per_second"
        }
    }
```

### Cleave

Inside a modifier. Keep in mind this will work on ranged, so you need to restrict it when applying this modifier if you need.

```
    "OnAttackLanded"
    {
        "CleaveAttack"
        {
            "CleavePercent" "10"
            "CleaveRadius"  "140"
            "CleaveEffect"  "particles/units/heroes/hero_sven/sven_spell_great_cleave.vpcf"
        }
    }
```

### Crit

There is a `MODIFIER_PROPERTY_PREATTACK_CRITICALSTRIKE` Property but this doesn't include a chance, so you need to use a DataDriven `Random` when starting the attack, and applying a modifier that has the crit, removing it later `OnAttackLanded`.

The first `RemoveModifier` is added to disable people from canceling attacks to get a guaranteed crit.

```
"modifier_crit"
{
    "Passive"   "1"
    "IsHidden"  "1"
    "OnAttackStart"
    {
        "RemoveModifier"
        {
            "ModifierName" "crit"
            "Target" "CASTER"
        }
        "Random"
        {
            "Chance" "%crit_chance"
            "OnSuccess"
            {
                "ApplyModifier"
                {
                    "ModifierName" "crit"
                    "Target"    "CASTER"
                }
            }
        }
    }
}

"crit"
{
    "IsHidden"  "1"
    "Properties"
    {
        "MODIFIER_PROPERTY_PREATTACK_CRITICALSTRIKE" "%crit_bonus"
    }

    "OnAttackLanded"
    {
        "RemoveModifier"
        {
            "ModifierName"  "crit"
            "Target"    "CASTER"
        }

        // Basic blood particle effect
        "FireEffect"
        {
            "EffectName" "particles/units/heroes/hero_phantom_assassin/phantom_assassin_crit_impact.vpcf"
            "EffectAttachType"  "follow_origin"
            "Target"    "TARGET"
        }
    }
}
```

### Orb: Slow and Lifesteal with custom projectile

```
"modifier_orb_of_frost"
{
    "Passive" "1"
    "IsHidden"  "1"
    "Attributes"    "MODIFIER_ATTRIBUTE_MULTIPLE"
    "Properties"
    {
        "MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE" "6"
    }

    "Orb"
    {
        "Priority"  "DOTA_ORB_PRIORITY_ABILITY"
        "ProjectileName" "particles\items2_fx\skadi_projectile.vpcf"
    }

    "OnOrbImpact"
    {
        "Lifesteal"
        {
            "Target"    "ATTACKER"
            "LifestealPercent" "%bonus_lifesteal"
        }

        "ApplyModifier"
        {
            "Target"    "TARGET"
            "ModifierName"  "modifier_orb_of_frost_slow"
            "Duration"  "%slow_duration"
        }
    }
}

"modifier_orb_of_frost_slow"
{
    "IsDebuff" "1"
    "Duration"  "3"
    "Properties"
    {
        "MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE"  "%move_speed_slow"
        "MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT"  "%attack_speed_slow"
    }
    "EffectName"    "particles/generic_gameplay/generic_slowed_cold.vpcf"
    "EffectAttachType" "attach_hitloc"
    "Target" "TARGET"
}
```

Note: DataDriven Lifesteal might steal from things you don't want to steal from, it's better done through [lua](https://github.com/MNoya/Warchasers/blob/master/scripts/npc/npc_abilities_custom.txt#L7041).

### Block

This is a tricky one. Note that there are 2 modifiers again.

The first one has `OnAttacked` which randoms a block chance, `OnSuccess` it applies the block modifier, `OnFailure` it removes it. Inside the block_modifier, `OnAttacked` removes itself.

The `OnCreated` is just so it's possible to block the 1st hit after equiping the shield.

```
"shield_modifier"
{
    "Passive" "1"
    "IsHidden" "1"
    "Properties"
    {
        "MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS" "%magic_resistance"
    }
    "OnCreated"
    {
        "Random"
        {
            "Chance" "%block_chance"
            "OnSuccess"
            {
                "ApplyModifier"
                {
                    "Target" "CASTER"
                    "ModifierName" "block_modifier"
                }
            }
        }
    }
    "OnAttacked"
    {
        "Random"
        {
            "Chance" "%block_chance"
            "OnSuccess"
            {
                "ApplyModifier"
                {
                    "Target" "CASTER"
                    "ModifierName" "block_modifier"
                }
            }
            "OnFailure"
            {
                "RemoveModifier"
                {
                    "Target" "CASTER"
                    "ModifierName" "block_modifier"
                }
            }
        }
    }
}

"block_modifier"
{
    "IsBuff" "1"
    "IsHidden" "1"
    "Properties"
    {
        "MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK" "%damage_blocked"
    }
    "OnAttacked"
    {
        "RemoveModifier"
        {
            "Target" "CASTER"
            "ModifierName" "block_modifier"
        }
    }
}
```
