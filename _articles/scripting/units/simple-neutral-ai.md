---
title: 'Writing a simple AI for neutrals'
author: Perry
steamId: 76561198046986723
date: 25.01.2020
---

**NOTE:** This article is a rewrite of a very old AI tutorial: [http://yrrep.me/dota/dota-simple-ai.html](http://yrrep.me/dota/dota-simple-ai.html)



I have encountered many questions about AI on the modding irc over the time, so I decided to write up a tutorial for a very basic AI that can be used in Lua. The term AI might seem intimidating as a programmer that has little to no experience with it, I will try however to lay out the process for a simple state-driven AI in a way that is as clear as possible. Hopefully by the end of this article writing your own AI does not seem as scary anymore.

## What are we making
We will make a little state-driven AI that mimics how neutrals behave in DotA 2. This means it will do these things:

- It will stand idle in its location until an enemy comes in range.
- After spotting an enemy it will run to attack them.
- If the neutral runs too far from its initial 'idle location' it will return back to it.
- Repeat from the first point.


The first phase to making reliable AI (in the sense that it will always do what you expect it to) is planning. I personally think that making a diagram representing the different states and the transitions between these states are a big help when making an AI like this. The more effort you put into this diagram, the easier the actual implementation of your AI will be.

For our neutral example I have translated the text describing the unit's behaviour into a state diagram, which contains all possible states and the conditions for transitioning between these states. The result is the following diagram:

![State transition diagram](http://yrrep.me/dota/state-diag.png)

These diagrams can be made with any software with drawing possibilities such as paint, photoshop or word. I really like using https://www.draw.io/, which is an online drawing tool specialised for drawing diagrams and graphs.

In the diagram you can see the different states represented by boxes and transitions represented by arrows. The labels on the arrows describe when this transition happens.

## Implementing a single state

To show how to translate one state to code I will give the example implementation of the aggressive state. I am implementing each state as a 'think' function that will check if any of the transition conditions are true, and execute that transition if they are true. 

Look at the 'Aggressive' state in the above diagram. It has two transitions, so I would expect the 'AggressiveThink' function to contain one check for 'Target died', one check for 'Out of leash range', and some aggressive behavior that happens inside the state.

This translates to the following code:

```lua
function modifier_ai:AggressiveThink()
    -- Check if the unit has walked outside its leash range
    if (self.spawnPos - self.unit:GetAbsOrigin()):Length() > self.leashRange then
        self.unit:MoveToPosition(self.spawnPos) --Move back to the spawnpoint
        self.state = AI_STATE_RETURNING --Transition the state to the 'Returning' state(!)
        return -- Stop processing this state
    end
    
    -- Check if the target has died
    if not self.aggroTarget:IsAlive() then
        self.unit:MoveToPosition(self.spawnPos) --Move back to the spawnpoint
        self.state = AI_STATE_RETURNING --Transition the state to the 'Returning' state(!)
        return -- Stop processing this state
    end
    
    -- Still in the aggressive state, so do some aggressive stuff.
    self.unit:MoveToTargetToAttack(self.aggroTarget)
end
```

This way of translating your state diagram to code will always work as long as you can write code describing your transition conditions.

## AI as Lua modifier

Now we have one function that describes one 'tick' of one of our AI states, how do we make sure this is called?

The easiest way to create an AI tied to one unit is to make the AI a Lua modifier. This modifier has some very convenient properties built in:

* The AI will stop once the unit dies
* The modifier provides convenient created/destroyed handlers to setup/cleanup your AI
* The modifier provides an interval think

So really, the very core of your AI comes down to calling `StartIntervalThink(interval)` in your modifier's `OnCreated`, and then in the `OnIntervalThink` calling the correct 'state' function that you created like in the previous section.

## Complete AI modifier

Below is the complete state diagram from above implemented as AI. This AI can be added to `unit` by calling:

```lua
unit:AddNewModifier(nil, nil, "modifier_ai", { aggroRange = 600, leashRange = 600 });
```

I pass in some parameters to the AI behavior when I apply it, allowing for customization per-unit. Keep in mind this modifier is just like any other Lua modifier, so you can execute any code you can also call in regular modifiers.

```lua
modifier_ai = class({})

local AI_STATE_IDLE = 0
local AI_STATE_AGGRESSIVE = 1
local AI_STATE_RETURNING = 2

local AI_THINK_INTERVAL = 0.5

function modifier_ai:OnCreated(params)
    -- Only do AI on server
    if IsServer() then
        -- Set initial state
        self.state = AI_STATE_IDLE

        -- Store parameters from AI creation:
        -- unit:AddNewModifier(caster, ability, "modifier_ai", { aggroRange = X, leashRange = Y })
        self.aggroRange = params.aggroRange
        self.leashRange = params.leashRange

        -- Store unit handle so we don't have to call self:GetParent() every time
        self.unit = self:GetParent()

        -- Set state -> action mapping
        self.stateActions = {
            [AI_STATE_IDLE] = self.IdleThink,
            [AI_STATE_AGGRESSIVE] = self.AggressiveThink,
            [AI_STATE_RETURNING] = self.ReturningThink,
        }

        -- Start thinking
        self:StartIntervalThink(AI_THINK_INTERVAL)
    end
end

function modifier_ai:OnIntervalThink()
    -- Execute action corresponding to the current state
    self.stateActions[self.state](self)    
end

function modifier_ai:IdleThink()
    -- Find any enemy units around the AI unit inside the aggroRange
    local units = FindUnitsInRadius(self.unit:GetTeam(), self.unit:GetAbsOrigin(), nil,
        self.aggroRange, DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_ALL, DOTA_UNIT_TARGET_FLAG_NONE, 
        FIND_ANY_ORDER, false)

    -- If one or more units were found, start attacking the first one
    if #units > 0 then
        self.spawnPos = self.unit:GetAbsOrigin() -- Remember position to return to
        self.aggroTarget = units[1] -- Remember who to attack
        self.unit:MoveToTargetToAttack(self.aggroTarget) --Start attacking
        self.state = AI_STATE_AGGRESSIVE --State transition
        return -- Stop processing this state
    end

    -- Nothing else to do in Idle state
end

function modifier_ai:AggressiveThink()
    -- Check if the unit has walked outside its leash range
    if (self.spawnPos - self.unit:GetAbsOrigin()):Length() > self.leashRange then
        self.unit:MoveToPosition(self.spawnPos) --Move back to the spawnpoint
        self.state = AI_STATE_RETURNING --Transition the state to the 'Returning' state(!)
        return -- Stop processing this state
    end
    
    -- Check if the target has died
    if not self.aggroTarget:IsAlive() then
        self.unit:MoveToPosition(self.spawnPos) --Move back to the spawnpoint
        self.state = AI_STATE_RETURNING --Transition the state to the 'Returning' state(!)
        return -- Stop processing this state
    end
    
    -- Still in the aggressive state, so do some aggressive stuff.
    self.unit:MoveToTargetToAttack(self.aggroTarget)
end

function modifier_ai:ReturningThink()
    -- Check if the AI unit has reached its spawn location yet
    if (self.spawnPos - self.unit:GetAbsOrigin()):Length() < 10 then
        self.state = AI_STATE_IDLE -- Transition the state to the 'Idle' state(!)
        return -- Stop processing this state
    end

    -- If not at return position yet, try to move there again
    self.unit:MoveToPosition(self.spawnPos)
end
```

## Your next (more complicated) AI

This tutorial only covers a very basic concepts for making your first AI, but if you want to extend this here are some more interesting ideas:

* Since you are using a lua modifier, you do not have to change state in a think function, you can also just register a modifier event listener and change state inside those!
* Generalize state classes and give each state `OnStateEnter`, `OnStateThink` and `OnStateLeave` functions.
* You can nest these AIs! You could make the internal behavior of one state be its own AI built in the same way.
