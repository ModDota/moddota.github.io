---
title: Invisibility Ability Example
author: Noya
steamId: 76561198046984233
date: 19.12.2014
category: Scripting
---

This is a datadriven + lua ability that will apply the invis state and texture, with some extra particles and effects.

<Gfycat id="MajesticDimpledIrishwaterspaniel" />

(Some effects might not be from this example, as this video shows the Assassin hero, find it in the repository later on)

**KV:**

~~~
 "assassin_walk_the_shadows"
 {
  // General
  //--------------------------------------------------------------------------------------------------
  "BaseClass" "ability_datadriven"
  "AbilityTextureName"	"assassin_skill1"
  "MaxLevel" "7"
  "AbilityBehavior"	"DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE"
  
  // Stats
  //--------------------------------------------------------------------------------------------------
  "AbilityCastPoint"	"0"
  "AbilityCooldown"	"5"
  "AbilityManaCost"	"6 8 11 14 18 22 26 30"
     
     // Damage.
     //-----------------------------------------------------------------------------------------------
     "AbilityDamage" "25 150 300 600 1100 2000 3300 5000"
     "AbilityUnitDamageType"	"DAMAGE_TYPE_PHYSICAL"

     // Special
     "AbilitySpecial"
      {
      "01"
       {
    "var_type"	"FIELD_INTEGER"
    "duration"	"25"
       }
      "02"
       {
       "var_type"	"FIELD_INTEGER"
       "bonus_movespeed"	"35"
       }
      "03"
       {
       "var_type"	"FIELD_INTEGER"
       "bonus_damage"	"150 300 525 840 1260 1900 3000 4500"
       }
      "04"
       {
       "var_type"	"FIELD_FLOAT"
       "stun_duration"	"3.25"
       }
      }

     "precache"
     {
      "particle"	"particles/units/heroes/hero_templar_assassin/templar_assassin_meld.vpcf"
      "soundfile"	"soundevents/game_sounds_heroes/game_sounds_templar_assassin.vsndevts"
     }

     //----------------------------------------------------------------------------------------------
  "OnSpellStart"
  {
   "FireSound"
   {
    "EffectName"	"Hero_TemplarAssassin.Meld"
    "Target" "CASTER"
   }
   "RunScript"
   {
    "ScriptFile"	"abilities/assassin.lua"
    "Function"	"walk_the_shadows_cast"
   }
  }
  "Modifiers"
   {
   "assassin_walk_the_shadows_buff"
    {
    "IsBuff"	"1"
    "Duration" "%duration"
    "EffectName"	"particles/units/heroes/hero_templar_assassin/templar_assassin_meld.vpcf"
    "EffectAttachType"	"follow_origin"
    "OnCreated"
    {
     "FireEffect"
     {
      "EffectName"	"particles/units/heroes/hero_bounty_hunter/bounty_hunter_windwalk_smoke.vpcf"
      "EffectAttachType" "follow_origin"
      "Target" "CASTER"
     }
    }
    "Properties"
     {
     "MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE" "%bonus_movespeed"
     }
    "States"
     {
     "MODIFIER_STATE_INVISIBLE"	"MODIFIER_STATE_VALUE_ENABLED"
     "MODIFIER_STATE_NO_UNIT_COLLISION"	"MODIFIER_STATE_VALUE_ENABLED"
     }
    "OnAttackLanded"
     {
     "RunScript"
      {
      "ScriptFile"	"abilities/assassin.lua"
      "Function"	"walk_the_shadows_attack"
      }
     "Stun"
      {
      "Target"	"TARGET"
      "Duration"	"%stun_duration"
      }
     }
    "OnAbilityExecuted"
     {
     "RunScript"
      {
      "ScriptFile"	"abilities/assassin.lua"
      "Function"	"walk_the_shadows_interrupt"
      }
     }
    }
   }
  
 }
~~~


**Lua Scripts:**

~~~lua
function walk_the_shadows_cast( event )
  event.ability:ApplyDataDrivenModifier(event.caster, event.caster, "assassin_walk_the_shadows_buff", nil)
  event.caster:AddNewModifier(event.caster, event.ability, "modifier_invisible", {duration = 25}) 
  
end

function walk_the_shadows_interrupt( event )
 event.caster:RemoveModifierByName("assassin_walk_the_shadows_buff")
 event.caster:RemoveModifierByName("modifier_invisible")
end

function walk_the_shadows_attack( event )
 
 event.caster:RemoveModifierByName("assassin_walk_the_shadows_buff")
 
 ApplyDamage({ victim = event.target, attacker = event.caster, damage = event.ability:GetAbilityDamage(), damage_type = event.ability:GetAbilityDamageType(), ability = event.ability	})

end
~~~

The line that takes care of applying the "transparency" is AddNewModifier with modifier_invisible.

Credits to my buddy [igo](https://github.com/igo95862) that made this ability for [The Black Road project](https://github.com/Aleteh/TBR3) which is still WIP but there are some interesting stuff we made already.
