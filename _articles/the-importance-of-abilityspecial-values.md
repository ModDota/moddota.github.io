---
title: The importance of AbilitySpecial values
author: Noya
steamId: 76561198046984233
date: 12.12.2014
category: Scripting
---

*To specify numeric values, you can put in a number or you can use `%name` formatting to grab values out of the "AbilitySpecial" block of the ability. The advantage to using the `%name` syntax is that the value can change as the ability levels up and the numeric value can be formatted into tooltips.*

When coding abilities or items, **do not** fall into the trap of replacing the use of AbilitySpecial variables with a constant (i.e. writing `"Duration" "12"`, `"MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE"	"-30"` or doing similar assignations in lua scripts), thinking it will only be used once. 

There's **2 problems** with doing this

* Tooltips are hard

  If you don't use AbilitySpecial for each variable, when you get to making the tooltips, you'll find pretty much impossible to make quality dota-styled strings because your spell description needs to have direct copies of the values you've put in the ability. To make this worse, if you ever make a change to an static number in your datadriven ability, you will also need to update the addon_english.txt 

* Consistency between Lua & Key Values

  Changing a key value won't only affect the datadriven but also the scripts and its easy to make a change and forget to extend this change to the .lua file. Doing proper references to the Specials also eliminates this problem.

<br>
**TL;DR**: Use as many AbilitySpecial values as possible, then modifying/balancing your abilities can be done just by changing these variables and it will extend to the rest of the game mode.

---

**Related**: [How to get AbilitySpecial values into Lua](http://moddota.com/forums/discussion/17/how-to-get-abilityspecial-values-into-lua)