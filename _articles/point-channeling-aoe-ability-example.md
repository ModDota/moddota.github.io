---
title: Point Channeling AoE Ability Example
author: Noya
steamId: 76561198046984233
category: general
---

Here I'll explain a method to do this type of abilities effectively, based on this Earthquake Example:

{% include gfycat.html id=CarefreeAridBantamrooster %}

We will review each important section of the code with comments on it, including how to get the particles to show.

### General Definition:
~~~
"far_seer_earthquake"
{
    "BaseClass"          "ability_datadriven"
    "AbilityTextureName" "far_seer_earthquake"
    "MaxLevel"           "1"
    "AbilityType"        "DOTA_ABILITY_TYPE_ULTIMATE"

    "AbilityBehavior"	"DOTA_ABILITY_BEHAVIOR_CHANNELLED | DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE"
    "AbilityUnitTargetTeam"	"DOTA_UNIT_TARGET_TEAM_ENEMY"
    "AbilityUnitTargetType"	"DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC | DOTA_UNIT_TARGET_BUILDING"
    "AbilityUnitDamageType"	"DAMAGE_TYPE_MAGICAL"
    "AbilityCastAnimation"  "ACT_DOTA_SPAWN"

    "AbilityCastRange"   "1000"
    "AbilityCastPoint"   "0.5"
    "AbilityCooldown"    "90.0"

    "AbilityManaCost"    "150"
    "AbilityChannelTime" "25.0"

    "AOERadius"          "%radius"

//...
~~~

Target Team/Type and DamageType are just there to show the tooltips.

`"AbilityChannelTime"` is a must have that will determine how much time the spell can be maintained. 

Note the `"AOERadius"` which accepts a `"%radius"` from AbilitySpecial in its value. "AOERadius" needs `"DOTA_ABILITY_BEHAVIOR_AOE"` to display the AoE Circle.

---

### Ability Special block:
~~~ 
"AbilitySpecial"
{
    "01"
    {
       "var_type"	"FIELD_INTEGER"
       "duration"	"25"
    }
    "02"
    {
        "var_type" "FIELD_INTEGER"
        "building_damage_per_sec"	"50"
    }
    "03"
    {
        "var_type"	"FIELD_INTEGER"
        "radius"   "250"
    }
    "04"
    {
        "var_type" "FIELD_INTEGER"
        "movement_speed_slow_pct"	"-75"
    }
    "05"
    {
        "var_type"	"FIELD_FLOAT"
        "wave_interval"	"1.0"
    }
}
~~~

Nothing interesting except remarking that `"%duration"` **cannot** be used as a value for `"AbilityChannelTime"` (doing so makes it loop forever), so the ability will just refer to the duration and when changing the value, also change the channel time.

---

### Precache block:
~~~

"precache" 
{
  "particle"	"particles/units/heroes/hero_leshrac/leshrac_split_earth.vpcf"
  "particle"	"particles/units/heroes/hero_warlock/warlock_rain_of_chaos_explosion.vpcf"
  "particle"	"particles/units/heroes/hero_earthshaker/temp_eruption_dirt.vpcf"
  "particle"	"particles/dire_fx/dire_lava_falling_rocks.vpcf"
  "particle"	"particles/units/heroes/hero_earthshaker/earthshaker_echoslam_start_fallback_mid.vpcf"
  "particle" "particles/econ/items/earthshaker/egteam_set/hero_earthshaker_egset/earthshaker_echoslam_start_egset.vpcf"
  "soundfile"	"soundevents/game_sounds_heroes/game_sounds_leshrac.vsndevts"
}
~~~

Has all the particles used and leshrac soundfile loaded. 

Paths were copied directly from the asset browser, unmodified particles. I'll explain each of its attachments when we get to them.

---

### Spell Start

When the cast point is complete, perform the following actions:
~~~
"OnSpellStart"
{
    "RunScript"
    {
        "ScriptFile"	"heroes/far_seer/earthquake.lua"
        "Function"   "EarthquakeStart"
        "Target"     "POINT"
    }

//...
~~~

This calls a very simple Lua script which creates a dummy unit to apply a thinker modifier which does the "waves". 

When using an `"AbilityBehavior" "DOTA_ABILITY_BEHAVIOR_POINT"`, you can pass the POINT targeted as an extra parameter to the function (it won't be passed automatically, like CASTER or TARGET). This can be accessed as the **target_points[1]**
 on the event.

**Lua**
~~~lua
function EarthquakeStart( event )
    -- Variables
    local caster = event.caster
    local point = event.target_points[1]

    caster.earthquake_dummy = CreateUnitByName("dummy_unit", point, false, caster, caster, caster:GetTeam())
    event.ability:ApplyDataDrivenModifier(caster, caster.earthquake_dummy, "modifier_earthquake_thinker", nil)
end
~~~

There is a Datadriven function to do something similar, **"CreateThinker"**, but because we need to stop the ability from casting the waves if the hero stops channeling the ability, its better to have the dummy "indexed" on the *caster handle* so that we can run another script to remove it without the need to do a search for it.

Back to the dummy unit, this is its definition:

~~~
"dummy_unit_vulnerable"
{
    "BaseClass"            "npc_dota_creature"
    "AttackCapabilities"   "DOTA_UNIT_CAP_NO_ATTACK"
    "VisionDaytimeRange"   "0"	
    "VisionNighttimeRange"	"0"
    "UnitRelationshipClass"	"DOTA_NPC_UNIT_RELATIONSHIP_TYPE_WARD"
    "MovementCapabilities"	"DOTA_UNIT_CAP_MOVE_NONE"
    "Ability1"             "dummy_passive_vulnerable"
}
~~~

And the passive ability:
~~~
"dummy_passive_vulnerable"
{
    "BaseClass"       "ability_datadriven"
    "AbilityBehavior" "DOTA_ABILITY_BEHAVIOR_PASSIVE"
    "Modifiers"
    {
        "dummy_modifier"
        {
            "Passive" "1"
            "States"
            {
                "MODIFIER_STATE_NO_UNIT_COLLISION"  "MODIFIER_STATE_VALUE_ENABLED"
                "MODIFIER_STATE_NO_TEAM_MOVE_TO"    "MODIFIER_STATE_VALUE_ENABLED"
                "MODIFIER_STATE_NO_TEAM_SELECT"     "MODIFIER_STATE_VALUE_ENABLED"
                "MODIFIER_STATE_COMMAND_RESTRICTED" "MODIFIER_STATE_VALUE_ENABLED"
                "MODIFIER_STATE_ATTACK_IMMUNE"      "MODIFIER_STATE_VALUE_ENABLED"
                "MODIFIER_STATE_MAGIC_IMMUNE"       "MODIFIER_STATE_VALUE_ENABLED"
                "MODIFIER_STATE_NOT_ON_MINIMAP"     "MODIFIER_STATE_VALUE_ENABLED"
                "MODIFIER_STATE_UNSELECTABLE"       "MODIFIER_STATE_VALUE_ENABLED"
                "MODIFIER_STATE_NO_HEALTH_BAR"      "MODIFIER_STATE_VALUE_ENABLED" 
            }
        }
    }
}
~~~

**IMPORTANT:** The dummy doesn't have `MODIFIER_STATE_INVULNERABLE` enabled, because that state is a bitch, usually preventing from applying modifiers even if they have `MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE`. That's why I called it _vulnerable even tho it can't take damage.

---

Back to the OnSpellStart, 2 more actions:
~~~
"OnSpellStart"
{   //...

    "DestroyTrees"
    {
        "Target" "POINT"
        "Radius"	"%radius"
    }

    "DelayedAction"
    {
        "Delay" "0.5"
        "Action" 
        {
            "ApplyModifier"
            {
                "ModifierName"	"modifier_earthquake_channelling"
                "Target" "CASTER"
            }
        }
    }	
 }
~~~

First action will destroy the trees around the POINT targeted and the second action applies a modifier that takes care of the channeling animation, using the same method explained in the [Channeling Animations Tutorial](http://moddota.com/forums/discussion/77/channeling-animations)

Animation needs to start half a second later to sync with the damage, this is a matter of experimenting with the time frames.

---

### Channel Finish

When the ability finishes channeling either because the channel time has finished or it was cancelled, we need to stop the animation and the dummy thinker:
~~~
"OnChannelFinish"
{
    "RunScript"
    {
        "ScriptFile"	"heroes/far_seer/earthquake.lua"
        "Function"   "EarthquakeEnd"
    } 

    "RemoveModifier"
    {
        "ModifierName"	"modifier_earthquake_channelling"
        "Target"       "CASTER"
    } 
}
~~~

The 2nd lua function is even shorter, only has 1 API call to instantly remove the dummy:

~~~lua
function EarthquakeEnd( event )
    local caster = event.caster

    caster.earthquake_dummy:RemoveSelf()
end
~~~

---

### Modifiers

Now lets move to the the Modifiers block, the first couple handles the animation:

~~~
"Modifiers"
{
    "modifier_earthquake_channelling"
    {
        "IsHidden"          "1"
        "ThinkInterval"     "1.0"
        "OverrideAnimation" "ACT_DOTA_KINETIC_FIELD"
        "OnIntervalThink"
        {
            "ApplyModifier"
            {
                "ModifierName"	"modifier_channeling"
                "Target"       "CASTER"
                "Duration"     "0.9"
            } 
        }
    }

    "modifier_channeling"
    {
        "IsHidden"          "1"
        "OverrideAnimation" "ACT_DOTA_KINETIC_FIELD"
    }

//...
~~~


"modifier_earthquake_thinker" is the modifier applied in Lua to the dummy, and has the main logic for all the damage, particles, sounds and other effects needed. It has a lot bunch of actions, so I'll break it up

~~~
"modifier_earthquake_thinker"
{
    "Aura"        "modifier_eartquake_slow"
    "Aura_Radius" "%radius"
    "Aura_Teams"  "DOTA_UNIT_TARGET_TEAM_ENEMY"
    "Aura_Types"  "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC"	

//...
~~~

This constantly applies another modifier effect to all units around a radius of the targeted point, in this ability its a simple slow effect:

~~~
"modifier_eartquake_slow"
{
   "IsDebuff"	"1"
   "Properties"
   {
       "MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE" "%movement_speed_slow_pct" 
   }	
}
~~~

---

Back to the "modifier_earthquake_thinker", we have to have actions on 2 instances: When the modifier is created, and then on each wave interval.

#### Main modifier created

~~~
"OnCreated"
{
    "FireSound"
    {
        "EffectName"	"Hero_Leshrac.Split_Earth"
        "Target"     "TARGET"
    }

    // Many simple particle attachments:
    "AttachEffect"
    {
        "EffectName" "particles/econ/items/earthshaker/egteam_set/hero_earthshaker_egset/earthshaker_echoslam_start_egset.vpcf"
        "EffectAttachType" "follow_origin"
        "Target"           "TARGET"
    }

    "AttachEffect"
    {
        "Target"	"TARGET"
        "EffectAttachType" "follow_origin"
        "EffectName"	"particles/dire_fx/dire_lava_falling_rocks.vpcf"
    }

    "AttachEffect"
    {
        "Target"	"TARGET"
        "EffectAttachType" "follow_origin"
        "EffectName"	"particles/units/heroes/hero_leshrac/leshrac_pulse_nova.vpcf"
    }

//...
~~~

"TARGET" in all this scope will refer to the unit that has the modifier, i.e. the dummy.

I used one extra particle that needs to have the Control Point 1 attached to the target, else it will show on the middle of the map.

~~~
    "AttachEffect" 
    {
        "Target"           "TARGET"
        "EffectAttachType" "follow_origin"
        "EffectName"       "particles/units/heroes/hero_earth_spirit/espirit_spawn.vpcf"
        "ControlPointEntities"
        {
            "TARGET"	"attach_origin"
            "TARGET"	"attach_origin"
        }
    }
~~~

"ControlPointEntities" will set the CP0 to the origin of the dummy, and do the same for CP1.

To realize that the CP1 needs to be set else the particle will fail to display properly, this is the procedure:

1. Open the particle system on the Particle Editor, double clicking on it (needs **decompiled particles**!) 

  ![img](http://puu.sh/f61DF/2ed8e1c122.jpg)

2. Select Control Point #1 on the Control Points List:

  ![img](http://puu.sh/f61JZ/8593db279d.png)

3. Hold and drag the control point to somewhere else by clicking on the blue rectangle:

  ![img](http://puu.sh/f61MV/9d913ef133.jpg)

4. Notice that there's some dust that moved with the Control Point.

  ![img](http://puu.sh/f61pF/1c83b2e5cc.jpg)

**This means you need to set it!** Else it will stay unattached and originate on the (0,0,0) position at the map.

---

#### Main modifier wave interval actions

Still following this? Great, it's almost finished, only missing the `"OnIntervalThink"` actions which do the damage +effects every `"wave_interval"`

~~~
"ThinkInterval" "%wave_interval"
"OnIntervalThink"
{
    "Damage"
    {
        "Target"
        {
            "Center" "TARGET"
            "Radius" "%radius"
            "Teams"  "DOTA_UNIT_TARGET_TEAM_BOTH"
            "Types"  "DOTA_UNIT_TARGET_BUILDING"
        }    
        "Type"   "DAMAGE_TYPE_MAGICAL"
        "Damage"	"%building_damage_per_sec"
    }

    "FireSound"
    {
        "EffectName"  "Hero_Leshrac.Split_Earth"
        "Target"      "TARGET"
    }

    // Simple particle attachment
    "FireEffect"
    {
        "EffectName"       "particles/units/heroes/hero_warlock/warlock_rain_of_chaos_explosion.vpcf"
        "EffectAttachType" "follow_origin"
        "Target"           "TARGET"
    }
    "FireEffect"
    {
        "EffectName"       "particles/units/heroes/hero_earthshaker/temp_eruption_dirt.vpcf"
        "EffectAttachType" "follow_origin"
        "Target"           "TARGET"
    }  
//...
~~~

There's a couple of specific particle firing that need a separate explanation:

To find what each control point does, follow the same method as with the espirit_spawn.vpcf, but knowing this particles were designed for AoE effects, you should instead write radius-range numbers on the control points and see the effect on the particle editor.

~~~
    "AttachEffect"
    {
        "Target"           "TARGET"
        "EffectAttachType" "follow_origin"
        "EffectName"       "particles/units/heroes/hero_leshrac/leshrac_split_earth.vpcf"
        "ControlPoints"
        {
            "01"	"%radius 50 50"
        }
    } 

    "AttachEffect"
    {
        "Target"           "TARGET"
        "EffectAttachType" "follow_origin"
        "EffectName"       "particles/units/heroes/hero_leshrac/leshrac_pulse_nova.vpcf"
        "ControlPoints"
        {
           "01"	"%radius 0 %radius"
        }
    }

    "AttachEffect"
    {
        "Target"           "TARGET"
        "EffectAttachType" "follow_origin"
        "EffectName" "particles/units/heroes/hero_earthshaker/earthshaker_echoslam_start_fallback_mid.vpcf"
        "ControlPoints"
        {
            "01"	"1 0 0"
        }	
    }
}
~~~

Not gonna lie, it's mostly trial and error and just a bit of reading whatever the PET info has to enlighten you:

![img](http://puu.sh/f62Ph/2d34e46b46.png)

---

---

### Complete code can be found at the following links:

### [DataDriven](https://github.com/MNoya/DotaCraft/blob/master/game/dota_addons/dotacraft/scripts/npc/abilities/heroes/far_seer_earthquake.txt)
### [Lua](https://github.com/MNoya/DotaCraft/blob/master/scripts/vscripts/heroes/far_seer/earthquake.lua)

* For more examples of this style of ability, check:

  * [Blizzard](https://github.com/MNoya/DotaCraft/blob/master/scripts/npc/abilities/archmage_blizzard.txt)
  * [Rain of Fire](https://github.com/MNoya/DotaCraft/blob/master/scripts/npc/abilities/pit_lord_rain_of_fire.txt)
  * [Tornado](https://github.com/MNoya/DotaCraft/blob/master/scripts/npc/abilities/naga_sea_witch_tornado.txt)

---

If you find a way to improve this method or have any questions, leave them here.