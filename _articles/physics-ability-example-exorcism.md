---
title: Physics Ability Example - Exorcism
author: Noya
steamId: 76561198046984233
---

Here's in the breakdown of an ability that spawns units and moves them with rotation, making use of the [Physics library](https://github.com/bmddota/barebones/blob/source2/game/dota_addons/barebones/scripts/vscripts/physics.lua)

The end result while there is no enemies to go to would be like this:

[gfy UniformLikableDavidstiger]

I include a Debug boolean that can be enabled to show the path and acquisition of different states:

[gfy MeekPortlyCrocodileskink]

The complete codes for the ability can be found in the following [SpellLibrary](https://github.com/Pizzalol/SpellLibrary) links:

* [death_prophet_exorcism_datadriven](https://github.com/Pizzalol/SpellLibrary/blob/SpellLibrary/game/dota_addons/spelllibrary/scripts/npc/abilities/death_prophet_exorcism_datadriven.txt)

* [exorcism.lua](https://github.com/Pizzalol/SpellLibrary/blob/SpellLibrary/game/dota_addons/spelllibrary/scripts/vscripts/heroes/hero_death_prophet/exorcism.lua)

The entire lua file has comments for every decision. I hope it helps understand and adapt this skill to different behaviors.

---

I'll just leave the lines related to physics here, special thanks to BMD for helping me through the entire process of rewriting this ability.

First step is to make each spawned unit a physics units and apply the properties. <br>[Physics Readme](https://github.com/bmddota/barebones/blob/source2/PhysicsReadme.txt) to know what these do.

<pre lang="php">
-- Make the spirit a physics unit
Physics:Unit(unit)

-- General properties
unit:PreventDI(true)
unit:SetAutoUnstuck(false)
unit:SetNavCollisionType(PHYSICS_NAV_NOTHING)
unit:FollowNavMesh(false)
unit:SetPhysicsVelocityMax(spirit_speed)
unit:SetPhysicsVelocity(spirit_speed * RandomVector(1))
unit:SetPhysicsFriction(0)
unit:Hibernate(false)
unit:SetGroundBehavior(PHYSICS_GROUND_LOCK)
</pre>	

After this, we want to control the units behavior on each frame, making use of the OnPhysicsFrame function. 

<pre lang="php">
-- This is set to repeat on each frame
unit:OnPhysicsFrame(function(unit)

    -- Move the unit orientation to adjust the particle
    Unit:SetForwardVector( ( unit:GetPhysicsVelocity() ):Normalized() )

    -- Movement and Collision detection are state independent

    -- MOVEMENT	
    -- Get the direction
    local diff = point - unit:GetAbsOrigin()
    diff.z = 0
    local direction = diff:Normalized()

    -- Calculate the angle difference
    local angle_difference = RotationDelta(VectorToAngles(unit:GetPhysicsVelocity():Normalized()), VectorToAngles(direction)).y
		
    -- Set the new velocity
    if math.abs(angle_difference) < 5 then
    -- CLAMP
	local newVel = unit:GetPhysicsVelocity():Length() * direction
	unit:SetPhysicsVelocity(newVel)
    elseif angle_difference > 0 then
	local newVel = RotatePosition(Vector(0,0,0), QAngle(0,10,0), unit:GetPhysicsVelocity())
	unit:SetPhysicsVelocity(newVel)
    else		
	local newVel = RotatePosition(Vector(0,0,0), QAngle(0,-10,0), unit:GetPhysicsVelocity())
	unit:SetPhysicsVelocity(newVel)
    end

    -- COLLISION CHECK
    local distance = (point - current_position):Length()
    local collision = distance < 50

    -- STATE DEPENDENT LOGIC
    -- Damage, Healing and Targeting are state dependent.
    -- Check the full script on SpellLibrary
</pre>

Last is to stop the units, very simple with this:

<pre lang="php">
unit:SetPhysicsVelocity(Vector(0,0,0))
unit:OnPhysicsFrame(nil)
</pre>

---

For a different logic, check [Locust Swarm](https://github.com/MNoya/DotaCraft/blob/master/scripts/vscripts/heroes/crypt_lord/locust_swarm.lua) from **[DotaCraft](https://github.com/MNoya/DotaCraft)** repository, it uses the same movement physics but has different acquire and return logic, to fit Warcraft 3 behavior.

[gfy TartSlowAfricangroundhornbill]