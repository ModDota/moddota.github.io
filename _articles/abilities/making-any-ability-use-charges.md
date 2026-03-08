---
title: Making any ability use charges
author: DoctorGester
steamId: '76561198046920629'
date: 28.12.2015
---

# Making any ability use charges

A guide/snippet which will help you to make any ability use charges like Shrapnel or Stone Caller.

First, save the following code with a name `modifier_charges.lua` to your `vscripts` folder (or any subfolder inside of it)

```lua
modifier_charges = class({})

if IsServer() then
    function modifier_charges:Update()
        if self:GetDuration() == -1 then
            self:SetDuration(self.kv.replenish_time, true)
            self:StartIntervalThink(self.kv.replenish_time)
        end

        if self:GetStackCount() == 0 then
            self:GetAbility():StartCooldown(self:GetRemainingTime())
        end
    end

    function modifier_charges:OnCreated(kv)
        self:SetStackCount(kv.start_count or kv.max_count)
        self.kv = kv

        if kv.start_count and kv.start_count ~= kv.max_count then
            self:Update()
        end
    end

    function modifier_charges:DeclareFunctions()
        local funcs = {
            MODIFIER_EVENT_ON_ABILITY_EXECUTED
        }

        return funcs
    end

    function modifier_charges:OnAbilityExecuted(params)
        if params.unit == self:GetParent() then
            local ability = params.ability

            if params.ability == self:GetAbility() then
                self:DecrementStackCount()
                self:Update()
            end
        end

        return 0
    end

    function modifier_charges:OnIntervalThink()
        local stacks = self:GetStackCount()

        if stacks < self.kv.max_count then
            self:SetDuration(self.kv.replenish_time, true)
            self:IncrementStackCount()

            if stacks == self.kv.max_count - 1 then
                self:SetDuration(-1, true)
                self:StartIntervalThink(-1)
            end
        end
    end
end

function modifier_charges:DestroyOnExpire()
    return false
end

function modifier_charges:IsPurgable()
    return false
end

function modifier_charges:RemoveOnDeath()
    return false
end
```

Then, add an initialization line to your `addon_game_mode.lua`:

```lua
LinkLuaModifier("modifier_charges", LUA_MODIFIER_MOTION_NONE)
```

If your file is in a subfolder you can do it like this

```lua
LinkLuaModifier("modifier_charges", "subfolder/anothersubfolder/modifier_charges", LUA_MODIFIER_MOTION_NONE)
```

Gratz, you've successfully installed it!

Now you can add charges to any ability with this code:

```lua
unit:AddNewModifier(unit, unit:FindAbilityByName("ability_name"), "modifier_charges", {
    max_count = 2,
    start_count = 1,
    replenish_time = 6
})
```

The settings in the end are pretty self-explanatory. You can omit the start_count if you want.

That's it.
