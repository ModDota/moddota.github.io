---
title: Apply Hero and Creep modifier durations
author: Noya
steamId: 76561198046984233
date: 15.01.2015
category: general
---

I came up with this method after [kritth](http://moddota.com/forums/profile/1600/kritth) showed us that you can directly add a `"Duration"` key value to an `"ApplyModifier"` block and the use of the `"Target"` block without a Radius (defaulting to 0).

Basically, abusing the datadriven system we can do this on any event:

~~~
"ApplyModifier"
{
    "ModifierName"	"modifier_name"
    "Target"
    {
        "Center"	"TARGET"
        "Types"  "DOTA_UNIT_TARGET_HERO"
    }
    "Duration"	"%hero_duration"	
}

"ApplyModifier"
{
    "ModifierName"	"modifier_name"
    "Target"
    {
        "Center"	"TARGET"
        "Types"  "DOTA_UNIT_TARGET_BASIC"
    }
    "Duration"	"%creep_duration"
}
~~~

modifier_name being any modifier **without a "Duration"** specified directly in its block.

Hopefully this will make many codes that need to apply different duration to hero and creeps way better to read and polish. Until now I was using Lua to define the different duration but after seeing this system it's just way better.