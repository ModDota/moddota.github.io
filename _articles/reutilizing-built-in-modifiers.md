---
title: Reutilizing Built-In Modifiers
author: Noya
steamId: 76561198046984233
date: 18.01.2015
category: general
---

Here it will be explained how to reuse any Built-In modifier through the datadriven system.

This has many uses, as sometimes it's impossible to replicate some effects that are very hidden/hardcoded within the engine. 

In a previous example, the [Illusion Ability Example](http://moddota.com/forums/discussion/62/illusion-ability-example) made use of the `"modifier_illusion modifier"` in Lua like this:

~~~
illusion:AddNewModifier(caster, ability, "modifier_illusion", { duration = duration, 
                                                                outgoing_damage = outgoingDamage, 
                                                                incoming_damage = incomingDamage })
~~~

The fields between { } are **Very** specific. For that particular modifier, I took the values from [this magic list](http://moddota.com/resources/modifier_keys.txt), but this isn't the only way of acquiring them, as this list is very incomplete.

The Full List of Built-In Modifiers can be found [on the the wiki](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/Built-In_Modifier_Names)

`AddNewModifier` can be replaced by the datadriven `"ApplyNewModifier"` Action block like this:

**Basic Example:** This will apply 1 frame of MODIFIER_STATE_NO_UNIT_COLLISION
~~~
"ApplyModifier" 
{
    "ModifierName"	"modifier_phased"
    "Target"       "TARGET"
    "Duration"     "0.03"
}
~~~

However this isn't more than a shortcut to avoid creating a new modifier with the state. The real strength of this method is in applying modifiers that have very custom properties that aren't easily reproduced with the basic Properties/States/etc.

<br>

For example, in the `alchemist_chemical_rage` ability, Alchemist changes its attack/idle/run animation, model effect, attack sound and also gets the ability bonus. 

If we wanted to get all the cosmetic properties but with different ability effects, we need to rewrite the skill from scratch, but sadly the autoattack sound and animations for attack/idle/run aren't easily changed, and we would need to find a wacky workaround for it.

Instead, we can make use of the `"modifier_alchemist_chemical_rage_transform"` which will handle everything, transforming the hero and applying a `"modifier_alchemist_chemical_rage"` with the exact ability we want.

<br>

Now to find out the field names and pass values to the modifier, follow these steps:

#### Step 1 - Finding the ability modifier

Go to the original ability that uses the modifier you want to reuse form the list. The [SpellLibrary](https://github.com/Pizzalol/SpellLibrary/tree/SpellLibrary/game/dota_addons/spelllibrary/scripts/npc/abilities) contains a split list of all Dota Abilities with its own names, it's very easy to find the fields there.

<br>

#### Step 2 - Setting the AbilitySpecial fields

Copy the ability specials from the main ability into your datadriven AbilitySpecial block. If the custom ability doesn't have the field, the modifier will default to 0, so you can remove those that you want to ignore.

**Example:** [alchemist_chemical_rage](https://github.com/Pizzalol/SpellLibrary/blob/SpellLibrary/game/dota_addons/spelllibrary/scripts/npc/abilities/alchemist_chemical_rage_datadriven.txt#L30) AbilitySpecial block, with 2 added values and most of its ability bonus removed.
~~~
"AbilitySpecial"
{
    "01"
    {
        "var_type"           "FIELD_FLOAT"
        "duration"           "25.0"
    }
    "02"
    {
        "var_type"            "FIELD_FLOAT"
        "transformation_time" "0.35"
    }
    "03"
    {
        "var_type"                "FIELD_INTEGER"
        "bonus_movespeed_percent" "50"
    }
    "04"
    {
        "var_type"                 "FIELD_INTEGER"
        "bonus_attack_speed"       "322"
    }
}
~~~
<br>

#### Step 3 - Applying the modifier

On the desired Ability or Modifier Event, add the ApplyModifier action:
~~~
"ApplyModifier" 
{
    "ModifierName" "modifier_alchemist_chemical_rage_transform"
    "Target"       "CASTER"
    "Duration"     "%transformation_time"
}
~~~

**Without a Duration field**, the modifier might be applied for duration = nil, meaning infinite duration.

<br>

#### Step 4 - Adjusting the Tooltip

![img](http://puu.sh/eHc3N/2b62c46b84.jpg)

The modifier_alchemist_chemical_rage tooltip needs to be adjusted to ignore AbilitySpecials we don't need, and instead use our bonus_attack_speed and bonus_movespeed_percent .

1. Go to dota_english.txt, which can be found in the main dota file or in [this repository link](https://raw.githubusercontent.com/dotabuff/d2vpk/master/dota/resource/dota_english.txt)

2. Find the modifier tooltip of the spell we want to modify, copy them into your addon_english and edit them:

~~~
"DOTA_Tooltip_modifier_alchemist_chemical_rage"             "Legacy Chemical Rage"
"DOTA_Tooltip_modifier_alchemist_chemical_rage_Description"	"Increasing attack and movement speed."
~~~

After modifying the addon_english.txt:

![img](http://puu.sh/eHpXB/8fe79a1d57.jpg)

Note that you cannot refer to a new custom %dMODIFIER_PROPERTY_[CONSTANT_LIST](http://moddota.com/forums/discussion/14/datadriven-ability-breakdown-documentation##properties)% in the tooltip, because it doesn't have the custom values in its modifier. 

Instead you can make those tooltips in the separate modifier, or directly add the numbers to the original modifier tooltip if they are static values (like in this cause I could've written 50 and 322). Sadly, you can't set the built-in modifier as hidden either.

<br>

#### Full Example
~~~
"alchemist_chemical_rage_warcraft"
{
    "BaseClass"            "ability_datadriven"
    "AbilityTextureName"   "alchemist_chemical_rage_warcraft"
    "MaxLevel"             "3"

    "AbilityBehavior"      "DOTA_ABILITY_BEHAVIOR_NO_TARGET"
    "AbilityCastAnimation" "ACT_DOTA_ALCHEMIST_CHEMICAL_RAGE_START"

    "AbilityCastRange"      "700"
    "AbilityCastPoint"      "0.0"
    "AbilityCooldown"       "30.0"

    "AbilityManaCost"       "25"

    "AbilitySpecial"
    {
        "01"
        {
            "var_type"                 "FIELD_FLOAT"
            "duration"                 "15.0"
        }
        "02"
        {
            "var_type"                 "FIELD_FLOAT"
            "transformation_time"      "0.35"
        }
        "03"
        {
            "var_type"                 "FIELD_FLOAT"
            "bonus_movespeed_percent"  "50"
        }
        "04"
        {
            "var_type"                 "FIELD_FLOAT"
            "bonus_attack_speed"       "25 75 125"
        }
    }

    "precache"
    {
        "soundfile" "soundevents/game_sounds_heroes/game_sounds_alchemist.vsndevts"
        "particle"  "particles/status_fx/status_effect_chemical_rage.vpcf"
        "particle"  "particles/units/heroes/hero_alchemist/alchemist_chemical_rage.vpcf"
    }

    "OnSpellStart"
    {
        "FireSound"
        {
            "EffectName"   "Hero_Alchemist.ChemicalRage.Cast"
            "Target"       "CASTER"
        }

        "ApplyModifier"
        {
            "ModifierName" "modifier_alchemist_chemical_rage_transform"
            "Target"       "CASTER"
            "Duration"     "%transformation_time"
        }

        // Extra Modifier with what we need to add for the custom ability 
        "ApplyModifier"
        {
            "ModifierName" "modifier_chemical_rage_warcraft"
            "Target"       "CASTER"
        }
  }

    "Modifiers"
    {
        
        "modifier_chemical_rage_warcraft"
        {
            "IsBuff"   "1"
            "IsHidden" "1"
            "Duration" "%duration"

            "Properties"
            {
                "MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT" "%bonus_attack_speed"
                "MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE" "%bonus_movespeed_percent"
            }
        }
    }
}
~~~

<br>

Hopefully this will help you have more options if the ability you want to modify hasn't been rewritten yet, or to get a particular effect which is hard to replicate by normal means.

*Remember to share any interesting discoveries in here, for the benefit of everyone in the community.*

Thanks for reading!