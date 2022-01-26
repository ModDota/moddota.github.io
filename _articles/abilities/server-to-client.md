---
title: Sending Server values to the Client in a modifier.
author: DankBud
steamId: '76561198157673452'
date: 05.12.2021
---

Modifier scripts are run on both the server, and every client in the game.
A lot of the [Lua API](https://moddota.com/api/#!/vscripts) is server-side functions that the client cannot use.

And so, often times when using modifiers you will have to use Server only functions for calculations or whatever your purpose may be.

Usually the server is what handles the functionality, while the client is just for displaying information.

So if you for example gave your hero bonus damage that you calculated or stored only on the server then you would see that your hero does deal the bonus damage, but its not displayed on the UI or any Tooltips.

Example that grants 2x your primary attribute as bonus damage:
```lua
modifier_example = class({})

function modifier_example:DeclareFunction()
	return {
		MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE
	}
end

function modifier_example:GetModifierPreAttack_BonusDamage()
	if not IsServer() then return end
	--GetPrimaryStatValue is a server-only function
	return self:GetParent():GetPrimaryStatValue() * 2
end
```

With this modifier you will run into the mentioned issue where your attack damage is not updated in the UI, but you will still deal the bonus damage.

To fix this, we need to somehow send this server-only value to the client.
There are 2 primary methods for doing this, though there are other less convienient ways.

### Modifier Stack Count {#stacks}

This is the most basic method, where all you need to do is Set the modifiers stack count on the server and the stack count is automatically synced to the client.

Example using this method:
```lua
modifier_example = class({})

function modifier_example:DeclareFunction()
	return {
		MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE
	}
end

function modifier_example:GetModifierPreAttack_BonusDamage()
	if IsServer() then
		local stat = self:GetParent():GetPrimaryStatValue()
		self:SetStackCount(stat)
	end

	return self:GetStackCount() * 2
end
```

Great, now the damage is applied and displayed correctly!

But, there are some limitations with using modifier stacks.
* You can only set integer values. No floats, booleans, strings, or tables.
* You can only set one stack count per modifier.
* The stack count is displayed on the modifier buff icon, and this is not always wanted.

So what can you do if you need to send one of these unsupported values or even send multiple values to the client?

Well, there are some workarounds but what you should use is Modifier Transmitters.

### Modifier Transmitters {#transmitters}

Modifier transmitters allow you to send any amount of any value types from the server to the client in your modifier.
But they require a bit of set-up.

There are 3 functions needed to make use of transmitters.

* `SetHasCustomTransmitterData`
	This should be called in your modifier's `OnCreated` function
	to tell the server you want your modifier to transmit data to the client

* `AddCustomTransmitterData`
	This is where you pick the data you want to send to the client, run on server-side only

* `HandleCustomTransmitterData`
	This is where the server data is sent to, run on client-side only.

* and also `SendBuffRefreshToClients` for refreshing the transmitted data if needed.

Example that grants bonus damage and attack speed based on your current health.
```lua
modifier_example = class({})

function modifier_example:OnCreated( kv )
	if not IsServer() then return end
	--grab some values from the ability's KV
	local percent_health_to_damage = self:GetAbility():GetSpecialValueFor("percent_health_to_damage")
	local percent_health_to_atk_spd = self:GetAbility():GetSpecialValueFor("percent_health_to_atk_spd")

	--GetHealth is a server-only function
	local health = self:GetParent():GetHealth()

	--calculate our values on the server.
	self.damage = health * percent_health_to_damage
	self.attack_speed = health * percent_health_to_atk_spd

	--tell the server we are ready to send data to the client
	self:SetHasCustomTransmitterData(true)

	--we want to think so we can periodically refresh the data we are sending to the client
	--note: this can be called on client, but in this script its only called on server, so it only thinks on server.
	self:StartIntervalThink(0.1)
end

--refresh the modifier on every think
function modifier_example:OnIntervalThink()
	self:OnRefresh()
end

--this function is called when a modifier is reapplied, or manually refreshed in a script.
function modifier_example:OnRefresh( kv )
	if IsServer() then
    --call OnCreated again to recalculate our values
    self:OnCreated()
    
		--SendBuffRefreshToClients is a server-only function
		self:SendBuffRefreshToClients()
	end
end

--this is a server-only function that is called whenever modifier:SetHasCustomTransmitterData(true) is called,
-- and also whenever modifier:SendBuffRefreshToClients() is called
function modifier_example:AddCustomTransmitterData()
	return {
		damage = self.damage,
		attack_speed = self.attack_speed,
	}
end

--this is a client-only function that is called with the table returned by modifier:AddCustomTransmitterData()
function modifier_example:HandleCustomTransmitterData( data )
	self.damage = data.damage
	self.attack_speed = data.attack_speed
end

function modifier_example:DeclareFunctions()
	return {
		MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
		MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
	}
end

function modifier_example:GetModifierAttackSpeedBonus_Constant()
	return self.attack_speed
end

function modifier_example:GetModifierPreAttack_BonusDamage()
	return self.damage
end
```

You can find many other examples of modifier transmitters on [GitHub](https://github.com/search?l=Lua&q=SetHasCustomTransmitterData&type=Code)
