---
title: Lava damage
author: DiNaSoR
steamId: '76561197974680917'
date: 20.08.2015
---

Hello, this is a small tutorial giving back to the awesome Moddota community.

Today we going to create Lava area when a hero step on that lava he will get damaged per sec until he die.


**First you need to create a block and assign trigger texture to it**

First press Shift+B and drag your desired box for the lava area.

Once you've created your Block, we have to assign it a trigger material.  
This can be done by going to the material library and name filtering "trigger", then drag and drop this material onto the block.  
It should change to the specified (trigger) material.

<Gfycat id="WaterloggedQuarrelsomeDutchshepherddog" />

Then convert the mesh to Entity by pressing Ctrl+T or find the `Outliner` => Right Click => Selected Meshes => Tie to Entity.
Afterwards, name it plus assign this Entity script to lavatrigger.lua <-- you can name it whatever you want.

![](https://i.imgur.com/5eZycip.png)

Next we go to Outputs tabs in top and click on it add the following in the picture.

![](https://i.imgur.com/nvr9nhv.png)

Now go to your vscript folder and create a file called lavatrigger.lua and put this script inside.

```lua
LAVA_MODIFIER_NAME = "lava_modifier"
LAVA_DAMAGE_AMOUNT = 10

lava_modifier = lava_modifier or class({})

local LAVA_DAMAGE_TICK_RATE = 0.5

function lava_modifier:IsHidden()
    return true
end

function lava_modifier:IsPurgable()
    return false
end

function lava_modifier:IsDebuff()
    return false
end

function lava_modifier:DeclareFunctions()
    local funcs = {}
    return funcs
end

-- Modifiers exist both on server and client, so take care what methods you use
function lava_modifier:OnCreated()
    if IsServer() then
        self:SetStackCount(0)
        self:StartIntervalThink(LAVA_DAMAGE_TICK_RATE)
    end
end

function lava_modifier:OnIntervalThink()
    if IsServer() then
        if self:GetStackCount() > 0 then
            local ent = self:GetCaster()
            local damageTable = {
                victim = ent,
                attacker = ent,
                damage = LAVA_DAMAGE_AMOUNT,
                damage_type = DAMAGE_TYPE_PURE,
            }
            ApplyDamage(damageTable)
        end
    end
end

LinkLuaModifier(LAVA_MODIFIER_NAME, "lavatrigger", LUA_MODIFIER_MOTION_NONE)

function applyLava(trigger, delta)
    if not IsServer() then
        return
    end

    local ent = trigger.activator

    if not ent then
        return
    end
    if not ent:HasModifier(LAVA_MODIFIER_NAME) then
        ent:AddNewModifier(ent, nil, LAVA_MODIFIER_NAME, nil)
    end
    local originalStacks = ent:GetModifierStackCount(LAVA_MODIFIER_NAME, nil)
    local newStacks = originalStacks + delta
    ent:SetModifierStackCount(LAVA_MODIFIER_NAME, ent, newStacks)
end

function lavaEnter(trigger)
    applyLava(trigger, 1)
end

function lavaExit(trigger)
    applyLava(trigger, -1)
end
```

You should be done!
