---
title: Precache, Fixing and avoiding issues
author: Noya
steamId: '76561198046984233'
date: 07.02.2015
---

When spawning units through KV and Lua, you might have to deal with the precache-dilemma. This also applies to particles and sounds. I talked about it briefly in the [precache section of the datadriven breakdown](http://moddota.com/forums/discussion/14/datadriven-ability-breakdown-documentation##precache) but here I have an straightforward example to help understand the matter.

So, if you see an unselectable orange ERROR as the model of a unit, then you have a precache model issue:

http://puu.sh/fBzOp/5c7afff665.jpg

Missing particles are indicated by red crosses:

<Gfycat id="SinfulShamefulBittern" />

**How to fix and avoid this crap?**

First, the datadriven `"SpawnUnit"` Action will always precache the "UnitName" custom unit and whatever cosmetics you have attached to it. For example in this [Avatar of Vengeance ability](https://github.com/MNoya/DotaCraft/blob/master/scripts/npc/abilities/warden_avatar_of_vengeance.txt), I'll be spawning a Spectre with some hats:

~~~
"SpawnUnit"
{
    "UnitName"	"npc_avatar_of_vengeance"
    "UnitCount"	"1"
    "SpawnRadius"	"100"
    "Duration"	"%duration"
    "Target"		"CASTER"
    "OnSpawn"
    {
	"FireSound"
	{
	    "EffectName" "Hero_Spectre.Haunt"
	    "Target"	 "CASTER"
	}
    }
}
~~~

Now there will be many many times that SpawnUnit doesn't cut it, and you need to spawn units in lua, using the `CreateUnitByName` function.

If I went ahead and just spawned my unit in lua (simplified example of [this script](https://github.com/MNoya/DotaCraft/blob/master/scripts/vscripts/heroes/warden/avatar_of_vengeance.lua#L35)):

~~~lua
function SpiritOfVengeanceSpawn( event )
    local caster = event.caster
    local unit_name = "npc_spirit_of_vengeance"
    local origin = caster:GetAbsOrigin()
    local spirit = CreateUnitByName(unit_name, origin, true, caster, caster, caster:GetTeamNumber())
end
~~~

Without any previous precache I'll get something like the ERROR model like before, or if this isn't the first I run the tools (because after the 1st run it attempts to store some models to keep on the cache), something like this:

http://puu.sh/fBwmn/0659d05a11.jpg

So yeah, that's bad, here's how to fix it:

**Always add a datadriven precache block with all models, sounds and particles that your ability would use**

In this case, I precache all the models and the ambient particles I'm using, inside the main datadriven ability.

~~~
"precache"
{
	"soundfile"	"soundevents/game_sounds_heroes/game_sounds_spectre.vsndevts"
	"model"		"models/heroes/vengeful/vengeful.vmdl"
	"model"		"models/items/vengeful/vengeful_immortal_weapon/vengeful_immortal_weapon.vmdl"
	"model"		"models/items/vengefulspirit/fallenprincess_shoulders/fallenprincess_shoulders.vmdl"
	"model"		"models/items/vengefulspirit/fallenprincess_legs/fallenprincess_legs.vmdl"
	"model"		"models/items/vengefulspirit/fallenprincess_head/fallenprincess_head.vmdl"
	"particle"      "particles/units/heroes/hero_vengeful/vengeful_ambient.vpcf"
	"particle"      "particles/econ/items/vengeful/vengeful_wing_fallenprincess/venge_wingsoffallenprincess_ambient.vpcf"
}
~~~

Now all the models will load properly.

http://puu.sh/fBx1X/8f04e3cd86.jpg

Final note, some cosmetics you might want to use have their own particles and its hard to know their names. In the first gif (the one with the red crosses) I was missing the wing particle effect for fallenprincess_shoulders. If this is the case, you can also find the particles used by the cosmetic in its [item_game.txt](https://raw.githubusercontent.com/dotabuff/d2vpk/master/dota_pak01/scripts/items/items_game.txt) definition:

http://puu.sh/fBxWT/83cceac063.png

<br />

Now after adding that particle (which I just looked up on the Asset Browser and copied the path to the .vpcf), everything is displaying properly:

<Gfycat id="SphericalHonorableChevrotain" />

---
