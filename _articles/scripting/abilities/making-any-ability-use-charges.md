---
title: Making any ability use charges
author: DoctorGester
steamId: '76561198046920629'
date: 28.12.2015
---

A guide/snippet which will help you to make any ability use charges like Shrapnel or Stone Caller.

First, add save this [file](https://gist.github.com/DoctorGester/1939e277e677e9394924) with a name "modifier_charges.lua" to your vscripts folder (or any subfolder inside of it)

Then, add an initialization line to your addon_game_mode.lua:

    LinkLuaModifier("modifier_charges", LUA_MODIFIER_MOTION_NONE)

If your file is into a subfolder you can do it like that

    LinkLuaModifier("modifier_charges", "subfolder/anothersubfolder/modifier_charges", LUA_MODIFIER_MOTION_NONE)

Gratz, you've successfully installed it!

Now you can add charges to any ability with this code:

~~~
unit:AddNewModifier(unit, unit:FindAbilityByName("ability_name"), "modifier_charges",
        {
            max_count = 2,
            start_count = 1,
            replenish_time = 6
        }
    )
~~~

The settings in the end are pretty self-explanatory. You can omit the start_count if you want.

That's it, folks.
