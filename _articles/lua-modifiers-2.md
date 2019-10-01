---
title: '[Lua Modifiers II]: Linken''s Sphere & Lotus Orb'
author: DrTeaSpoon
steamId: 76561197975484185
date: 22.08.2016
category: Scripting
---

When you script your targeted lua abilities you may have had issue of the protection against such spells not working. Linken Sphere and Lotus Orb.  
To allow your cool new ability to be effected by these items you only need to add this line in your code:

```lua
if hTarget:TriggerSpellAbsorb( self ) then return end
```

`hTarget` in this example is assumed to be the target unit. The `self` is your ability. It is used by abilities like lotus orb to know what spell to send back. The `hTarget:TriggerSpellAbsorb( self )` returns true only if player has Linken Sphere or some custom item coded to have similar function.  
In case of Lotus Orb the same line triggers Lotus Orb but always returns false.  
Now to create your own Lotus/Linken like effects here are the two function declarations:

```lua
function my_modifier:DeclareFunctions()
    local funcs = {
        MODIFIER_PROPERTY_REFLECT_SPELL, --Lotus Orb trigger.
        MODIFIER_PROPERTY_ABSORB_SPELL --Linken's Sphere trigger.
    }
    return funcs
end

function my_modifier:GetReflectSpell(keys)
  print("you cast your spell on me!")
end

function my_modifier:GetAbsorbSpell(keys)
  if something then
      print("counter spell!")
       return 1 --conditions were met, lets return 1 to block the spell.
    end
    return false --do nothing and let the spell through.
end
```

With Linken sphere the code is pretty much checking the cooldown of the origin ability and if not on cooldown, play effect, return 1.

```lua
function my_modifier:GetAbsorbSpell(keys)
    local hAbility = self:GetAbility()
    if hAbility:IsCooldownReady() then
    --your cool effect here.
    hAbility:StartCooldown(hAbility:GetCooldown(hAbility:GetLevel()))
    return 1
    end
    return false
end
```

Simple right? The Lotus Orb is bit more complex and even my version is not fully tested for bugs but it has been working perfectly so far.

```lua
function my_modifier:GetReflectSpell(keys)
    if self.stored ~= nil then
        self.stored:RemoveSelf() --we make sure to remove previous spell.
    end
    local hCaster = self:GetParent()
    local hAbility = hCaster:AddAbility(kv.ability:GetAbilityName())
    hAbility:SetStolen(true) --just to be safe with some interactions.
    hAbility:SetHidden(true) --hide the ability.
    hAbility:SetLevel(kv.ability:GetLevel()) --same level of ability as the origin.
    hCaster:SetCursorCastTarget(kv.ability:GetCaster()) --lets send this spell back.
    hAbility:OnSpellStart() --cast the spell.
    self.stored = hAbility --store the spell reference for future use.
end
```

The reason we remove the stored spell at next trigger is to make sure there is no 'null' reference. For example if a modifier created by the spell tries to access the origin spell, if we were to remove it right after the cast, the game would give error message.  
Some ideas how you could use all that you have learned here:  
-Create combination of lotus and linken sphere. (block and reflect)  
-Passive that reflects every third spell.  
-Passive that blocks spell and gives you the mana used on it.  
-Blink & disjoint projectiles when a spell is cast against you.  

Here is small piece of code to get you started with the blink:

```lua
function my_modifier:Blink(hTarget, vPoint, nMaxBlink, nClamp)
    local vOrigin = hTarget:GetAbsOrigin() --Our units's location
    ProjectileManager:ProjectileDodge(hTarget)  --We disjoint disjointable incoming projectiles.
    ParticleManager:CreateParticle("particles/items_fx/blink_dagger_start.vpcf", PATTACH_ABSORIGIN, hTarget) --Create particle effect at our caster.
    hTarget:EmitSound("DOTA_Item.BlinkDagger.Activate") --Emit sound for the blink
    local vDiff = vPoint - vOrigin --Difference between the points
    if vDiff:Length2D() > nMaxBlink then  --Check caster is over reaching.
        vPoint = vOrigin + (vPoint - vOrigin):Normalized() * nClamp -- Recalculation of the target point.
    end
    hTarget:SetAbsOrigin(vPoint) --We move the caster instantly to the location
    FindClearSpaceForUnit(hTarget, vPoint, false) --This makes sure our caster does not get stuck
    ParticleManager:CreateParticle("particles/items_fx/blink_dagger_end.vpcf", PATTACH_ABSORIGIN, hTarget) --Create particle effect at our caster.
end
```

Next Topic: Transformations
