---
title: Channeling Animations
author: Noya
steamId: 76561198046984233
date: 18.01.2015
category: Scripting
---

### Short Version: 

ApplyModifier with short duration in a OnThinkInterval, channeling modifier has an OverrideAnimation with a ACT_ from the [Action List](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Actions_List) or with the method explained later.

**Short Version Example:**
~~~
"Modifiers"
{
    "modifier_channeling"
    {
        "ThinkInterval" "1.0"
        "OnIntervalThink"
        {
            // Looping Animation
            "ApplyModifier"
            {
                "ModifierName"  "channelling_animation"
                "Target"        "CASTER"
            }
        }
    }
   
    "channelling_animation"
    {
        "IsHidden" "1"
        "Duration" "0.9"
        "OverrideAnimation" "ACT_DOTA_CAST_ABILITY_2"
    }
}
~~~

### Full Version

!{% include gfycat.html id="FlusteredBigBoa" %}

Instead of trying to find the desired animation in the Action List on the wiki, you can view the animations on the model you are trying to use and their respective names.

For this, go to the Asset Browser, type your hero name + *vmdl*, in this case I'm going to use drow.vmdl. Double click it, you will enter the Model Editor. In here, you want to go to the top tabs and click Tools -> View Sequences.

![img](http://puu.sh/eGRRP/c9e6fcc98f.png)

After this, you can select any animation and it will animate the white blocks at the right. To get the ACT_ name, you can click Properties then open the Activities box, or just tick down the Activity checkbox in the Sequences window, which will show how all the animations are refered ingame.

![img](http://puu.sh/eGOTt/5073e07a64.png)

**Note**: Ignore the +string.

**Full Example**:
~~~
"dark_ranger_life_drain"
{
    "BaseClass" "ability_datadriven"
    "AbilityTextureName" "dark_ranger_life_drain"
    "MaxLevel" "3"

    "AbilityBehavior" "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET | DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING"
    "AbilityUnitTargetTeam" "DOTA_UNIT_TARGET_TEAM_ENEMY"
    "AbilityUnitTargetType" "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC"
    "AbilityUnitDamageType" "DAMAGE_TYPE_MAGICAL"
    "AbilityCastAnimation" "ACT_DOTA_CAST_ABILITY_2"

    "AbilityCastRange" "700"
    "AbilityCastPoint" "0.3"
    "AbilityCooldown" "8.0"

    "AbilityManaCost" "50"
    "AbilityChannelTime" "8"

    "precache"
    {
        "particle" "particles/units/heroes/hero_pugna/pugna_life_drain.vpcf"
        "soundfile" "soundevents/game_sounds_heroes/game_sounds_pugna.vsndevts"
    }
    
    "AbilitySpecial"
    {
        "01"
        {
            "var_type" "FIELD_INTEGER"
            "hp_drain_per_second" "25 40 55"
        }
    }

    "OnSpellStart"
    {
        "ApplyModifier"
        {
            "ModifierName" "modifier_life_drain"
            "Target" "TARGET"
        }

        "FireSound"
        {
            "EffectName" "Hero_Pugna.LifeDrain.Target"
            "Target" "CASTER"
        }
    }

    "OnChannelFinish"
    {
        "RemoveModifier"
        {
            "ModifierName" "modifier_life_drain"
            "Target" "TARGET"
        }
    }

    "Modifiers"
    {
        "modifier_life_drain"
        {
            "IsDebuff" "1"
            "OnCreated"
            {
                "AttachEffect"
                {
                    "Target" "TARGET"
                    "EffectName" "particles/units/heroes/hero_pugna/pugna_life_drain.vpcf"
                    "EffectAttachType" "start_at_customorigin"

                    "ControlPointEntities"
                    {
                        "CASTER" "attach_hitloc"
                        "TARGET" "attach_hitloc"
                    }
                
                }
            }

            "ThinkInterval" "1.0"
            "OnIntervalThink"
            {
                // Health Transfer
                "Damage"
                {
                    "Type" "DAMAGE_TYPE_MAGICAL"
                    "Target" "TARGET" 
                    "Damage" "%hp_drain_per_second"
                }

                "Heal"
                {
                    "Target" "CASTER"
                    "HealAmount" "%hp_drain_per_second"
                }

                // Looping Animation
                "ApplyModifier"
                {
                    "ModifierName" "channelling_animation"
                    "Target" "CASTER"
                }
            }
        }

        "channelling_animation"
        {
            "IsHidden" "0"
            "Duration" "0.9"
            "OverrideAnimation" "ACT_DOTA_CAST_ABILITY_2"
        }
    }
}
~~~