---
title: AbilityDuration tooltips
author: Noya
steamId: 76561198046984233
category: general
date: 2018-04-01
---

**TL;DR:** AbilityDuration is a fairly useless keyvalue because whoever coded it forgot to make an automatic tooltip like with `AbilityDamage`. Use a "duration" AbilitySpecial and connect it with lua instead.

Imagine you want to have an ability apply a modifier for some seconds, duration changing with levels.

You can fall for the trap and do this:

~~~
"AbilityDuration" "3 2 2"
~~~

And then have your modifier refer to %AbilityDuration in the "Duration" modifier key. All fine for now.

But when when you want to indicate that your ability lasts for said duration, this AbilityDuration doesn't generate a **"DURATION:"** tooltip by itself, so you have 3 options:

**Option 1.** Write "Last 3 seconds at level 1 and then 2 at level 2 and 3" in the _Description. 

This is bad for the reasons explained before.

**Option 2*.** Have a "duration" AbilitySpecial in addition to the "AbilityDuration" and keep both values syncronized. 

Suboptimal but decent solution, as it allows you to use ability:GetAbilityDuration() which takes takes its value from AbilityDuration.

**Option 3.** Remove AbilityDuration, only keep the AbilitySpecial. Best way as far as I can tell.

~~~
"AbilitySpecial"
{
    "01"
    {
        "var_type" "FIELD_INTEGER"
        "duration" "3 2 2"
    }
}
~~~

And then do this in a Lua Script if needed.

~~~lua
function HowToTooltip(event)
   local ability = event.ability
   local duration = ability:GetLevelSpecialValueFor("duration", (ability:GetLevel() - 1))
   local damage = ability:GetAbilityDamage()
end
~~~

Has the same results and works for every scenario.

