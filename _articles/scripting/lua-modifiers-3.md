---
title: '[Lua Modifiers III]: Transformations'
author: DrTeaSpoon
steamId: 76561197975484185
date: 07.09.2016
category: Scripting
---

For this tutorial I am cheating and not explaining how to make lua ability. If you want to see full example of the code [click here!](https://gitlab.com/DrTeaSpoon/Dota2Overflow/tree/master/game/dota_addons/dota2overflow/scripts/vscripts/lua_abilities/ultimates/metamorph)  

Now we focus on the lua modifier. While we can do transformation and stuff in data driven counterpart, there is lack of calculations that make these things work better.  
First order of issue is attack range and type. We assume our custom ability has special value for `attack_range` and is designed to be a melee creature transformation. For this example we are using roshan so for attack range to match original we set it to `128`

```lua
function transformation_mod:OnCreated( kv ) 
    if IsServer() then
        self.AttackBonus = (self:GetParent():GetAttackRange() - self:GetAbility():GetSpecialValueFor("attack_range")) * -1
        --We get original attack range and substract away the wanted attack range, then negate the result.
        --YAY Math!
        self.OriginalAtkCap = self:GetParent():GetAttackCapability() 
        --Save original so we can set it back.
        self:GetParent():SetAttackCapability(DOTA_UNIT_CAP_MELEE_ATTACK) 
    end
end
```

Now we need to make sure when this modifier is lost, we change the attack type back to the original.

```lua
function transformation_mod:OnDestroy()
    if IsServer() then
        self:GetParent():SetAttackCapability(self.OriginalAtkCap) 
    end
end
```

What we want the transformation to effect should go here, these are some of the commons.

```lua
function transformation_mod:DeclareFunctions()
    local funcs = {
        MODIFIER_PROPERTY_MODEL_CHANGE,
        MODIFIER_PROPERTY_MODEL_SCALE,
        MODIFIER_PROPERTY_ATTACK_RANGE_BONUS
    }
    return funcs
end
```

Now we need to setup the functions for these wonderful functions. First one is for the model. Second is for the attack range. Last is for the scale.

```lua
function transformation_mod:GetModifierModelChange() return "models/creeps/roshan/roshan.vmdl" end
function transformation_mod:GetModifierAttackRangeBonus() return self.AttackBonus end
function transformation_mod:GetModifierModelScale() return self:GetAbility():GetLevel()*0.5 end
```

Last issues are using ability while immune and correctly duplicating modifier for illusions.

```lua
function metamorphosis_mod:GetAttributes() return MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE end
function metamorphosis_mod:AllowIllusionDuplicate() return true end
```

Thats pretty much it. You can add particle effects and/or animations. Though as a note there are some issues with animations on some heroes. For example phantom lancer's death animation makes the player model vanish so I suggest being careful with chosen animation.  

Next Topic: [Enchanting Trees](lua-modifiers-4)
