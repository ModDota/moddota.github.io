---
title: Using Modifier Properties in tooltips
author: DankBud
steamId: '76561198157673452'
date: 05.12.2021
---

Any time you see a modifier tooltip using a non-static number it's getting its value from one of that modifier's [MODIFIER_PROPERTY_](https://moddota.com/api/#!/vscripts/modifierfunction)'s

some examples:
![img](https://i.imgur.com/dngijaZ.png)
```
"DOTA_Tooltip_modifier_fountain_aura_buff_Description"				"Heals %dMODIFIER_PROPERTY_HEALTH_REGEN_PERCENTAGE%%% HP and %dMODIFIER_PROPERTY_MANA_REGEN_TOTAL_PERCENTAGE%%% mana per second."
```
![img](https://i.imgur.com/bzU8GAF.png)
```
"DOTA_Tooltip_modifier_smoke_of_deceit_Description"	"Invisible, moving %dMODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE%%% faster, and hidden from the minimap. Attacking or moving within %dMODIFIER_PROPERTY_TOOLTIP% range of an enemy hero or tower will break the invisibility."
```
![img](https://i.imgur.com/Xy0hTsD.png)
```
"DOTA_Tooltip_modifier_tower_aura_bonus_Description"    "Armor increased by %dMODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS% and health regeneration by %dMODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT%."
```
and approximately 560 more examples in valve's [abilities_english.txt](https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/game/dota/pak01_dir/resource/localization/abilities_english.txt)


As you can see, all of those numbers are not manually written into the modifier description, they are dynamically grabbed from the modifier.

### Why is this useful?

Because if you manually write the numbers into the tooltip then any time you make a number change in the ability you will have to remember to update every related tooltip, and hassle aside you're bound to miss some.

Using the dynamic tooltip you only have to change the number in one place and it gets updated everywhere.
And you can change the number you are returning in your script during the game.

### How to do it

First, please note that this only works with Lua Modifiers and Valve's built in modifiers. It cannot be done with datadriven modifiers.

Any time you use a modifier property in a lua modifier the value you `return` will be available for use in the modifier's description tooltip.

In your modifier script:
```lua
function modifier_example:DeclareFunctions()
	return {
		MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
	} 
end

function modifier_example:GetModifierPreAttack_BonusDamage()
	return 100
end
```
In your addon_\<language\>.txt
```json
"DOTA_Tooltip_modifier_example_Description" "Granting %dMODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE% bonus damage!"
```

This would result in a tooltip that says: **`Granting 100 bonus damage!`**

In the tooltip the percentage `%` sign surrounds the MODIFIER_PROPERTY_ to mark it as text to be replaced with the value of the modifier property.
If the contents between the %'s don't match the format then it wont work.

### The Format
`%<-><number><d|f>MODIFIER_PROPERTY_%`

Snippet from [abilities_english.txt](https://raw.githubusercontent.com/SteamDatabase/GameTracking-Dota2/master/game/dota/pak01_dir/resource/localization/abilities_english.txt):

```
// substitution for modifier tooltips
// %dMODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS% - 'd' prints the value returned by the function as an integer
// 'd' for integer
// 'f' for float
// optional '-' to not abs() the values
// optional number to specify the number of decimals to print after a float
// eg: %-2fMODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE% 
// use %% to draw a percentage sign 
test
```

The first thing needed is a `d` for integer (whole number), or `f` for float (floating point number)
Note that this is case sensitive, they must be lowercase.
And one of these is required, if you try to omit it, it will not work.

`%d...%`
`%f...%`

Next is the modifier property name, make sure there is no empty space.

`%dMODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT%`
`%fMODIFIER_PROPERTY_TOOLTIP%`

That's it, that's all you need for your tooltip to display.

But, there are 2 more options you can use.

By default the returned number will be absolute.
Meaning that even if you return a negative number it will be positive in the tooltip.
Putting a dash/minus sign `-` before the d/f will make it not abs() the number, so it can be negative.

`%-dMODIFIER_PROPERTY_COOLDOWN_REDUCTION_CONSTANT%`
`%-fMODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT%`

And with a float you can add a number before the `f` to choose how many decimals to display (default 1)

`%-2fMODIFIER_PROPERTY_MANA_REGEN_CONSTANT%`
`%3fMODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT%`

and finally, if you want to write a percentage sign `%` in your modifier tooltip you simply put 2 `%%` next to eachother where ever you want it in the tooltip.

`"This is a percentage sign: %%"`

`"Gaining %dMODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE%%% bonus movement speed"`


### MODIFIER_PROPERTY_TOOLTIP

I'll leave a special note here for MODIFIER_PROPERTY_TOOLTIP and MODIFIER_PROPERTY_TOOLTIP2
These modifier properties do not do anything functionality wise, they exist only to display a custom number in your tooltip.

A simple example could be:
```lua
function modifier_example:DeclareFunctions()
	return {
		MODIFIER_PROPERTY_TOOLTIP,
		MODIFIER_PROPERTY_TOOLTIP2,
	} 
end

function modifier_example:OnTooltip()
	return self:GetStackCount()
end
function modifier_example:OnTooltip2()
	return self.number_of_killed_units
end
```


### My %property% always shows 0 ??

If you're having this issue then your returned value is probably only seen on the Server and not the Client.
See this guide for instruction: [Sending Server values to the Client](https://moddota.com/abilities/server-to-client)