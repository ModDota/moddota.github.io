---
title: Calling Spells with SetCursor
author: tte
steamId: 76561198003060848
date: 10.01.2015
---

`CDotaBaseAbility:OnSpellStart` in combination with `CDotaBaseNPC:SetCursorCastTarget` and `CDOTABaseNPC:SetCursorPosition` are used to "Call" spells.

This is a powerful way to interact with Valve's spells in particular. This allows you to:

* Activate hidden abilities
* Ignore turn-restrictions
* Ignore castpoint or cooldown
* Ignore any other cruft associated with the formal spell-casting methods

This is easy to use, easy to configure and easy to think about. Here is an example that casts Tether on a hidden dummy unit, activated by a datadriven spell:

    local tether = caster:FindAbilityByName("trollsandelves_hidden_tether")
    tether:SetLevel(4)
    tether:EndCooldown()
    caster:SetCursorCastTarget(dummy)
    tether:OnSpellStart()

 