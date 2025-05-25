---
title: Passing AbilityValues values into Lua
author: Noya
steamId: '76561198046984233'
date: 12.12.2014
---

Given this "AbilityValues" block in the ability:

```
"AbilityValues"
{
  "radius" "300"
  "mana_per_second" "5 10 15 20"
}
```

There are 2 functions to connect these with: `GetSpecialValueFor` and `GetLevelSpecialValueFor`. Both are applied over an ability.

```lua
local ability = event.ability
local radius = ability:GetSpecialValueFor("radius")
local mana_per_second = ability:GetLevelSpecialValueFor("mana_per_second", (ability:GetLevel() - 1))
```

The first one will get the value for the **current level** of the ability.

The second one will get the value for the **specified level** of the ability

The first one is the most common and should be **used every time**, unless you need the value for a specific level.

Note the use of `(ability:GetLevel() - 1)` as the second parameter (which tells the script which level to take). This is needed because ability levels are 1-indexed but `GetLevelSpecialValueFor` is 0-indexed.
