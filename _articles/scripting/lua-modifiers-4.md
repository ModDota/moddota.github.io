---
title: '[Lua Modifiers IV]: Enchanting Trees'
author: DrTeaSpoon
steamId: 76561197975484185
date: 08.09.2016
category: Scripting
---

Without further delay. Lets get to it!  
`npc_abilities_custom.txt` entry for our ability.

```
"enchant_tree_lua"
{
    // These are required for this to work
    "BaseClass"             "ability_lua"
    "ScriptFile"                    "lua_abilities/enchant_tree/ability.lua" //set your script file path in 'vscripts' folder
    "AbilityBehavior"               "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET"
    "AbilityUnitTargetTeam"         "DOTA_UNIT_TARGET_TEAM_CUSTOM"
    "AbilityUnitTargetType"         "DOTA_UNIT_TARGET_TREE"
    "AbilityDuration"               "10.0" //well, technically optional.
    // Optional stuff
    "AbilityTextureName"            "enchant_tree_lua"
    "AbilityCastPoint"              "0.1"
    "AbilityCooldown"               "5.0"
    "AbilityManaCost"               "100"
    "AbilityCastRange"              "400"
}
```

This is your basic start for lua ability.

```lua
if enchant_tree_lua == nil then
    enchant_tree_lua = class({})
end
LinkLuaModifier( "enchant_tree_lua_mod", "lua_abilities/enchant_tree/modifier.lua", LUA_MODIFIER_MOTION_NONE )
```

The magic happens here. `CreateModifierThinker` creates sort of invisible unit with modifier attached to it.

```lua
function enchant_tree_lua:OnSpellStart()
    CreateModifierThinker( self:GetCaster(), self, "enchant_tree_lua_mod", { duration = self:GetDuration() }, self:GetCursorPosition(), self:GetCaster():GetTeamNumber(), true )
end
```

Now for the next piece of magic we need to setup our cool modifier. In this example the file path would be "vscripts/lua_abilities/enchant_tree/modifier.lua".  
There are two major parts for every 'tree enchantment'. First is making sure that we have tree nearby. Because of engine limitations the trees are difficult to interact with. For our solution we are simply requesting from gridnav every half a second if there is trees in very small area at our thinker unit's location.  
The last part is minor optimization that may become redundant but was not at the time of developing this. There was issue where the thinker unit would remain on the map for some time after the modifier was destroyed.

```lua
if enchant_tree_lua_mod == nil then
    enchant_tree_lua_mod = class({})
end
function enchant_tree_lua_mod:OnCreated( kv )   
    if IsServer() then
        self:StartIntervalThink(0.5)
    end
end
function enchant_tree_lua_mod:OnIntervalThink()
    if IsServer() then
        if not GridNav:IsNearbyTree(self:GetParent():GetAbsOrigin(), 10, false) then
            self:Destroy()
        end
    end
end
function enchant_tree_lua_mod:OnDestroy()
    if IsServer() then
        UTIL_Remove( self:GetParent() )
    end
end
```

Now comes the fun part. What do we want to do with this modifier.  
I decided to go with soul collecting tree: if enemy hero is killed in radius(you need to add this to special values of your `npc_abilities_custom.txt`) the owner of the spell steal up to 2 of victim's primary stat.

```lua
function enchant_tree_lua_mod:DeclareFunctions()
    local funcs = {
        MODIFIER_EVENT_ON_HERO_KILLED
    }
    return funcs
end

function enchant_tree_lua_mod:OnHeroKilled(kv)
    if IsServer() then
        if kv.unit and kv.unit:GetTeam() ~= self:GetCaster():GetTeam() then
            if (self:GetParent():GetAbsOrigin() - kv.unit:GetAbsOrigin()):Length2D() <= self:GetAbility():GetSpecialValueFor("radius") then
                self:CollectSoul(kv.unit)
            end
        end
    end
end

function enchant_tree_lua_mod:CollectSoul(hTarget)
  local primary = hTarget:GetPrimaryAttribute()
  local val = hTarget:GetPrimaryStatValue()
  local n = math.max (0, math.min(2,val))
  if primary == 0 then
    self:GetCaster():ModifyStrength(n) 
    hTarget:ModifyStrength(n*-1) 
  elseif primary == 1 then
    self:GetCaster():ModifyAgility(n) 
    hTarget:ModifyAgility(n*-1) 
  else
    self:GetCaster():ModifyIntellect(n) 
    hTarget:ModifyIntellect(n*-1) 
  end
end
```

For those fancy effects that ironwood tree has you might want to add these lines

```lua
function enchant_tree_lua_mod:GetEffectName()
 return "particles/items_fx/ironwood_tree.vpcf"
end

function enchant_tree_lua_mod:GetEffectAttachType()
 return PATTACH_OVERHEAD_FOLLOW
end
```

Next Topic: [Stacking Modifiers](lua-modifiers-5)
