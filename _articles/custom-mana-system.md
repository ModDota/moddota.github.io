---
title: Custom Mana System
author: Noya
steamId: 76561198046984233
---

This is a guide to make a simple custom mana system. A working barebones addon is assumed. 

In this example we'll make a classic *Rage* system, meaning:
1. No normal mana regeneration, starting mana 0
2. Gain mana after an attack, scaling with level 
3. Gain mana after being attacked, scaling with level
4. Gain mana on particular spell cast
5. Decrease mana over time, scaling with level

Hope this is enough for most systems, let me know if you have another concept that I should add.


##No normal mana regeneration and start mana at 0
 The easier approach is to nullify your hero's Intelligence
 For this you'll need to set the following in your hero definition


~~~
//KV code inside npc_heroes_custom.txt
"AttributeBaseIntelligence" "0" // Base intelligence
"AttributeIntelligenceGain" "0" // Intelligence bonus per level.
   
"StatusMana"	"50"    // Initial Max Mana
"StatsManaRegen"	"0"	// Base Mana Regen (KV doesn't like negative numbers here) 
~~~

If you need to keep your Int stat but still have 0 natural mana regen, you'll need to apply modifiers for each Int point with negative mana regen to compensate. 

I won't be following this process in this guide, but you can check the guide [on the wiki](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/Using_Bitfields_To_Adjust_Stat_Value_Bonuses)

For your mana to start at 0, we'll begin by making the passive hidden ability which will be the base for our Rage system:


~~~
//KV code inside npc_abilities_custom.txt
"barbarian_rage" 
{
    "BaseClass" "ability_datadriven"
    "AbilityTextureName"	"barbarian_rage"
    "MaxLevel" "1"
    "AbilityBehavior"	"DOTA_ABILITY_BEHAVIOR_PASSIVE | DOTA_ABILITY_BEHAVIOR_HIDDEN"

    "Modifiers"
    { 
        "rage_modifier"
        {
            "Passive"	"1"	//Auto apply this modifier when the spell is learned
            "IsBuff"	"1"	//Display as a green modifier
            "IsHidden"	"0"	//Show in the UI

            "OnCreated"
            {
                "RunScript"
                {
                    "ScriptFile"	"barbarian.lua"
                    "Function"	"ZeroManaOnSpawn"
                }
            }
        }
    }
}
~~~


This requires a barbarian.lua script inside *your_addon/scripts/vscripts* folder.
The script is very simple:

~~~lua
 -- lua code inside barbarian.lua
    function ZeroManaOnSpawn( event ) 
        local hero = event.caster
        Timers:CreateTimer(.01, function()
        -- Set Mana to 0 on created
        hero:SetMana(0)
    end)
 end
~~~

We need to do a wait a bit for the hero to be properly spawned else it might fail. Notice the use of [BMD's Timers](https://github.com/bmddota/barebones/blob/source2/game/dota_addons/barebones/scripts/vscripts/timers.lua).

###Before we continue:
Right now our spell is not even available on the hero, and we want it to be learned when we spawn.
 For this we'll need to add the following in our `OnHeroInGame`* listener (*function hook of npc_spawned, see [barebones Event Hooks](https://github.com/bmddota/barebones/blob/source2/game/dota_addons/barebones/scripts/vscripts/barebones.lua#L443) )


~~~lua
-- lua code inside OnHeroInGame(hero)
local heroName = hero:GetUnitName()
if heroName == "npc_dota_hero_beastmaster" then
    -- Add the spell
    hero:AddAbility("barbarian_rage")
    -- Level it up
    hero:FindAbilityByName("barbarian_rage"):SetLevel(1)
end
~~~

The if is not exactly neccessary but you'll need to filter your desired hero somehow. We'll use Beastmaster for our example


## Gain mana after an attack, scaling with level 

Our rage_modifier block gains another modifier event:

~~~
"OnAttackLanded"
{
    "RunScript"
    {
        "ScriptFile"	"barbarian.lua"
        "Function"	"ManaOnAttack"
    }
} 
~~~

I'll use a basic formula for it, which gives a base mana per attack but also scales with levels slightly.
Keep in mind this function is used for a 200 hero level system, so if you have something different of bigger mana costs, you need to adjust to your liking.

~~~lua
-- lua code inside barbarian.lua
function ManaOnAttack( event )
    local hero = event.caster
    local level = hero:GetLevel()

    hero:GiveMana(0.01 * level + 3)
end
~~~


## Gain mana after being attacked, scaling with level

Our modifier block gains another modifier event:
~~~
"OnAttacked"
{
   "RunScript"
    {
        "ScriptFile"	"barbarian.lua"
        "Function"	"ManaOnAttacked"
    }
}
~~~

Same as befefore, another different formula can be used, we will give a bit less mana on attacked

~~~lua
function ManaOnAttacked( event )
   local hero = event.caster
   local level = hero:GetLevel()

   hero:GiveMana(0.01 * level + 0.4)
end
~~~


## Gain mana on particular spell cast

~~~
"OnSpellStart" 
{
    "RunScript"
    { 
        "ScriptFile"	"barbarian.lua"
        "Function"	"leap"
    }
}
~~~

Then in your lua spell script we need to have this somewhere:

~~~lua
local manaGain = event.ability:GetLevelSpecialValueFor("mana_gain", (event.ability:GetLevel()-1))
event.caster:GiveMana(manaGain)
~~~

Note the relatively complicated GetLevelSpecialValueFor with a GetLevel()-1! 

This will take your "mana_gain" from AbilitySpecial, in my leap example it would be:

~~~
"AbilitySpecial"
{
    "01"
    {
        "var_type"	"FIELD_INTEGER"
        "mana_gain"	"8 16 25 35 47 60 72 85"
    }
}
~~~

We need to use GetLevelSpecialValueFor because GetSpecialValueFor("mana_gain") only takes the first parameter (so it is only useful for non scaling specials)


## Decrease mana over time, scaling with level

In the beginning we had set our StatsManaRegen to 0. This is done to properly control the mana regen dinamically in our main lua file

Base Mana Regen will need to be updated when the hero spawns `OnHeroInGame`, and then each time he levels up `OnPlayerLevelUp` if we want it to scale.

For this we create a local function somewhere inside our main addon lua file and call it whenever we need (at least once `OnHeroInGame`):

~~~lua
function AdjustWarriorClassMana( hero ) 
    Timers:CreateTimer(0.1,function() 
        local heroLevel = hero:GetLevel()
        -- Adjust the new mana regen
        hero:SetBaseManaRegen( -(0.01 * heroLevel) - 0.25)
    end)
end

~~~

With this, our hero's mana will decrease over time by ~0.3 and slightly faster on higher levels.


I hope I covered everything and kept a middle ground explanation style for those who are new to scripted abilities, without boring those who aren't.

Thanks for reading, feel free to ask any questions or discuss variations of mana systems.

Check the original complete file scripts in TBR Github

* [main lua scripts](https://github.com/Aleteh/TBR3/blob/master/scripts/vscripts/tbr.lua)

* [barbarian lua scripts](https://github.com/Aleteh/TBR3/blob/master/scripts/vscripts/abilities/barbarian.lua)

* [heroes_custom file](https://github.com/Aleteh/TBR3/blob/master/scripts/npc/npc_heroes_custom.txt)

* [abilities file](https://github.com/Aleteh/TBR3/blob/master/scripts/npc/npc_abilities_custom.txt)

