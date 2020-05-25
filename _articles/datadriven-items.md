---
title: DataDriven Items
author: Noya
steamId: 76561198046984233
date: 01.12.2014
category: Scripting
---

A comprehensive guide to npc_items_custom and coding items

![img](http://i.imgur.com/T7W828Q.png)

- [General](##general)
- [Common Modifier Key Values for items](##modifiers)
- [Adding spell functionality](##spells)
- [Icons and Custom Shops](##shops)
- [Cosmetic Values: Models, Effects, Tags](##cosmetics)
- [Restrictions](##restrictions)
- [Alt-Click on Inventory and Ground](##altclick)

# General

Start with "item_" and your item name. If you **don't** put `item_` at the begging of an item, bad things happen
  
`"item_custom"
{ ... }`

Each item needs its proper ID for purchasing on the shop, although you can define items without an ID if you only plan to create them through Lua.
Do not override Dota IDs, use IDs between 1000~2000

`"ID" "1100"`

Next is the BaseClass. It can be DataDriven, or overriding an existing item from the [default dota item_names](https://github.com/dotabuff/d2vpk/blob/master/dota_pak01/scripts/npc/items.txt).

~~~
"BaseClass" "item_datadriven"
            "item_aegis"
~~~

If you want to override an item, you won't be able to change/add abilities, you'll be limited to change values from items.txt (and some values can't even be changed)
So it's recommended to always try to make a datadriven version of the item if you want to have complete freedom on what your item does.

Now that we settled that, I'll review the most common key values seen in items.

### Basic Rules
  
~~~
"ItemCost" "322"
"ItemKillable" "0" 
"ItemSellable" "1"
"ItemPurchasable" "1"
"ItemDroppable" "1"
~~~

ItemKillable lets both allies and enemies destroy the dropped item by attacking it.


### Stock
~~~
"ItemStockMax" "1" 
"ItemStockTime" "100"
"ItemStockInitial" "3"
~~~

###Ownership
  
If you omit the following, its behavior will be NOT_SHAREABLE
~~~
"ItemShareability" "ITEM_NOT_SHAREABLE"             //Rapier
                   "ITEM_PARTIALLY_SHAREABLE"       //Ring of Regen
                   "ITEM_FULLY_SHAREABLE"           //Gem
                   "ITEM_FULLY_SHAREABLE_STACKING"  //Consumables
~~~

### Charges
~~~
"ItemInitialCharges" "1" //How many charges should the item start with - Tango x3 
"ItemDisplayCharges" "1" //Hide the charges of the item - Aegis 
"ItemRequiresCharges" "1" //The active ability needs charges to be used - Urn
~~~

Also remember to add this somewhere, normally at the beginning of a OnSpellStart block
  
`"SpendCharge" {}`

### Stacking, Consumable
  
~~~
"ItemStackable" "1"
"ItemPermanent" "0"
~~~

If "ItemPermanent" is set to 1, charged items won't disappear when they hit 0 charges (Bottle, Urn, etc)
By omitting it will also default to 1.


### Auto Cast
This value is the key for Tomes of Stats and other consumable items:
  
`"ItemCastOnPickup" "1"`

### Upgradeable items
~~~
"MaxUpgradeLevel" "5" // Dagon - 5
"ItemBaseLevel" "1" //You'll need 5 different items, and change each accordingly
~~~

### Recipes
~~~
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
~~~

**IMPORTANT NOTE:** Your item name for the recipe to be recognized by the Dota Shop UI NEEDS to have this format: 
~~~
"item_recipe_(name of your item)"
~~~

Meaning if the ItemResult you want to get is called *"item_capuchino"*, your recipe would be: *"item_recipe_capuchino"*

![img](http://puu.sh/dyDFL/f0a814100d.jpg)

If you don't, the item will till be combinable but it won't show the neat lines to the possible upgrades.

### Disassembling
~~~
"ItemDisassembleRule" "DOTA_ITEM_DISASSEMBLE_ALWAYS"
                      "DOTA_ITEM_DISASSEMBLE_NEVER"
~~~

# Common Modifier Key Values for items

We now have an item, but it doesn't do anything on its own.
To make it add stats or buffs, we need to set modifiers inside the item definition
For more on Modifiers, check the [Constants in the wiki]

~~~
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
  
~~~

# Adding spell functionality
Apart from this values specially related to items, you can add ***everything*** that could be part of a datadriven ability, for example:

~~~
"AbilityBehavior" "DOTA_ABILITY_BEHAVIOR_PASSIVE"
"AbilityUnitTargetTeam" "DOTA_UNIT_TARGET_TEAM_BOTH"
"AbilityUnitTargetType" "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC"
"AbilityCastAnimation" "ACT_DOTA_CAST_ABILITY_1"
"AbilityManaCost" "100"
"AbilitySpecial"
{ ... }
~~~

**[Ability Events](http://moddota.com/forums/discussion/13/datadriven-ability-events-modifiers)** like `"OnSpellStart"`, `"OnOwnerDied"` or `"OnEquip"` also go here in the main block.

You need at least set the AbilityBehavior for your item to not be active (if you don't, it will default to `DOTA_ABILITY_BEHAVIOR_UNIT_TARGET`).

See more on the complete [DataDriven Ability Breakdown](http://moddota.com/forums/discussion/comment/54)

#Icons and Custom Shops

For your item to have an icon you'll need to go to your addon folder under this path: 

`/resource/flash3/images/items`

And put a .PNG file with dimensions **86 x 64**, with the same name as the "item\_custom", WITHOUT the "item_"

[![img](https://raw.githubusercontent.com/bmddota/reflexdota/source2/game/dota_addons/reflex/resource/flash3/images/items/ability_reflex_flame_sword.png)](https://github.com/bmddota/reflexdota/blob/source2/game/dota_addons/reflex/resource/flash3/images/items/ability_reflex_flame_sword.png)

Then in your "item_custom" code, you add the following:

`"AbilityTextureName" "item_custom"`

You can also use the names of the dota icons. Just make sure this line starts with `"item_`, so the engine knows to look the image on the items folder.

Adding the item to a shop. Layout [Here]
For this, inside your addon folder you need to go inside scripts/shops and make/edit a .txt file with this name file structure:

`mapName_shops.txt`

mapName should be the name of YOUR MAP (.vmap file in Hammer or content folder), NOT your addon name (both could be the same, or you could have multiple maps with different shops)

Adding "_shops" to the mapName is also mandatory.

A template shop file can be copied from here: http://pastebin.com/KZrtm1xQ

In addition to this file, your item can have key value rules for where it can be bought

~~~
"SideShop" "1"  
"SecretShop" "0"
~~~

At the moment of writing this guide, we can only set up 3 different shops (Home, Side and Secret).
You can change categories and shop tab names, with [addon_english modding]

To make an actual shop area inside your map on Hammer, check this other tutorial [tutorial_creating_a_custom_shop_step_by_step](http://www.reddit.com/r/Dota2Modding/comments/2dpts1/tutorial_creating_a_custom_shop_step_by_step/)

To disable your dota items, use [this npc_abillities_override.txt](http://pastebin.com/pGExrS4A) inside the scripts/npc folder.

#Cosmetic Values: Models, Effects, Tags and others.
These values are optional but greatly improve the quality of your item

### Sounds when Picked, Dropped
~~~
"UIPickupSound" "Item.PickUpRingShop" //Sound when adquiring the item
"UIDropSound" "Item.DropRecipeShop" //Sound when dropping the item manually
"WorldDropSound" "Item.DropGemWorld" //Sound when dropping the item on death (?)
~~~

### Model and Glow in the world. 
VMDL and Particle files can be seen through the [Asset Browser]

~~~
"Model" "models/chest_worlddrop.vmdl"
"Effect" "particles/generic_gameplay/dropped_item.vpcf"
~~~
You can find good models in /props_gameplay, /econ or use your own customs

Important: If you create the item through lua [CreateItemOnPositionSync], you need to provide vision of the world position where the item is being created, at least briefly, to properly display the particle effect.

### Change the displayed color of the item
~~~ 
"ItemQuality"    "artifact" //Orange 
                 "epic" //Purple
                 "rare" //Blue
                 "common" //Green
                 "component" //White
                 "consumable" //White
~~~

### Tags & Alias

Tags are defined in addon_english, find them in [dota_english] under *// Tags*
Aliases help the search bar to find the item quickly with abreviations

~~~
"ItemShopTags" "int;str;agi;mana_pool;health_pool;hard_to_tag"
"ItemAliases" "this;appears_in;search"
~~~

Omit to not announce.
~~~
"ItemDeclarations" "DECLARE_PURCHASES_TO_TEAMMATES"
                   "DECLARE_PURCHASES_IN_SPEECH"
                   "DECLARE_PURCHASES_TO_SPECTATORS"
~~~

### Restrictions

This is how Basher is disallowed for certain heroes
~~~
"InvalidHeroes" "npc_dota_hero_spirit_breaker;npc_dota_hero_faceless_void"
~~~

For the Scripted, more powerful version, read more on [Item Restrictions & Requirements](http://moddota.com/forums/discussion/20/item-restrictions-requirements)

------

### Alt-Click

Alt-click text on items in Inventory and dropped on the ground. Takes the strings from resource/addon_english.txt
 or any other languages.

#### PingOverrideText

Overrides the default "[ALLIES] **ItemName** dropped here".
 It will look for *#DOTA_Chat_Text_String* (*Text_String* can be whatever) in your addon strings. 

{% include gfycat.html id="RemarkableImportantAnt" %}

In the item_datadriven:
~~~
"PingOverrideText" "DOTA_Chat_Text_String" 
~~~

In addon_english.txt:
~~~
"DOTA_Chat_Text_String" "[VOLVO] Giff"
~~~

#### ItemAlertable

Displays "[ALLIES] Gather for **ItemName** here."

![img](http://puu.sh/duiGf/025d66f1cd.jpg)

~~~~
"ItemAlertable"	"1" 
~~~~  


---

That's it for all the Item-related key values. In next post we'll review different examples.
