---
title: Passing AbilitySpecial values into Lua
author: Noya
steamId: 76561198046984233
---

Given this "AbilitySpecial" block in the ability:

    "AbilitySpecial"
    {
        "01"
        {
            "var_type"	"FIELD_INTEGER"
            "radius"	"300"
        }
        "02"
        {
            "var_type"	"FIELD_INTEGER"
            "mana_per_second"	"5 10 15 20"
        }
    }

There are 2 functions to connect these with ua. `GetSpecialValueFor` and `GetLevelSpecialValueFor`. Both are applied over an ability.

    local event.ability = ability
    local radius = ability:GetSpecialValueFor("radius") 
    local mana_per_second = ability:GetLevelSpecialValueFor("mana_per_second", (ability:GetLevel() - 1))

The first one can be used **only for single level values**. If you use `GetSpecialValueFor` (no `Level`) on "mana_per_second" it will only get the value for the first level.

The second one is the most common and should be **used every time** to avoid mistakes. 

Note the use of `(ability:GetLevel() - 1)` as the second parameter (which tells the script which level to take). This is needed because ability levels are 1-indexed but `GetLevelSpecialValueFor` is 0-indexed.


