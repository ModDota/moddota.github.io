---
title: Creating units with a duration
author: Pizzalol
steamId: '76561198015886976'
date: 15.01.2015
---

This is a quick tutorial on how to create custom units so that they appear with a circular timer next to their health bar and the time remaining on the XP bar

If you are not sure to what I am referring to then look at these images ![img](https://i.imgur.com/NL1Gqmr.png) and ![img](https://i.imgur.com/GOeKyp7.png)

The thing that we will need is `modifier_kill`

You can either apply it in KV using `ApplyModifier` or in Lua using `AddNewModifier`

It allows for more flexibility and allows for the proper creation of summoned timed units through Lua

### KV example

Here is an example of it in KV; one spider spawns without the `modifier_kill` and the other one with it

***Note:*** In this example there is no difference between applying `modifier_kill` or using the inbuilt `Duration` parameter of the `SpawnUnit` action block

```
"test_ability"
{
    // General        
    "BaseClass"                "ability_datadriven"
    "AbilityBehavior"                "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE"
    "AbilityType"                    "DOTA_ABILITY_TYPE_BASIC"
    // Time         
    "AbilityCooldown"                "0.0"
    // Cost        
    "AbilityManaCost"                "0"
    // Special        
    "AbilitySpecial"
    {
        "01"
        {
            "var_type"                    "FIELD_FLOAT"
            "duration"                    "10.0"
        }
    }
    "OnSpellStart"
    {
        "SpawnUnit"
        {
            "UnitName"    "npc_dota_broodmother_spiderling"
            "UnitCount"    "1"
            "SpawnRadius"    "200"
            "Target"        "CASTER"

            "OnSpawn"
            {
                "ApplyModifier"
                {
                    "ModifierName"    "modifier_kill"
                    "Target"        "TARGET"
                    "Duration"        "%duration"
                }
            }
        }
        "SpawnUnit"
        {
            "UnitName"    "npc_dota_broodmother_spiderling"
            "UnitCount"    "1"
            "SpawnRadius"    "200"
            "Target"        "CASTER"
        }
    }
}
```

and a short video along with it

<Gfycat id="AmusedScientificHoneybadger" />

### Lua example

This is a really simple example on how to use it with Lua

this function will apply the `modifier_kill` modifier with a duration of 10 seconds after which the caster will die

```lua
function KillCaster( keys )
    local caster = keys.caster

    caster:AddNewModifier(caster, nil, "modifier_kill", {duration = 10})
end
```
