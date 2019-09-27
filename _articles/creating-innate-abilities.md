---
title: 'Creating innate (available from level 1) abilities'
author: DoctorGester
steamId: 76561198046920629
date: 27.09.2019
category: Scripting
---

This article will guide you through creating an ability which is available to the given hero right away, like Earth Spirit's Stone Remnant.
This guide assumes you already have an ability set up on a hero.

The plan is:
1. Subscribe to the hero spawn event
2. Determine if the spawned hero has a specific ability
3. Level it up

Okay. Since the entry point to every mod is the file `addon_game_mode.lua` go right there and find `function Activate()`.
Activate is the function called on the very start of our custom game when all the players have loaded.
We can subscribe to events using `ListenToGameEvent`.

Put the following code inside the `Activate` function:

```lua
ListenToGameEvent('npc_spawned', function(event)
    HandleNpcSpawned(event.entindex)
end, nil)
```

This code is subscribing to the `npc_spawned` event and then calling the HandleNpcSpawned function (we will create that later) with the spawned entity index.
That entity index is provided to us in the event table when the event is triggered.

Let's create the `HandleNpcSpawned` function, put it in the same file just below `Activate`:

```lua
function HandleNpcSpawned(entityIndex)
    local entity = EntIndexToHScript(entityIndex)
    local innateAbilityName = "my_innate_ability"
    
    if entity:IsRealHero() and entity:HasAbility(innateAbilityName) then
        entity:FindAbilityByName(innateAbilityName):SetLevel(1)
    end
end
```

Let's go line by line here. After defining a function which accepts our entityIndex parameter we define a variable, which holds the actual entity.
We turn entity index into an actual entity using `EntIndexToHScript`. Now we can call methods on our actual entity.
First we declare our innate ability name for easier usage.
Then we make a condition where we check that our entity is indeed a hero and that it has that ability.
If all conditions hold true we get the handle of that ability and set it to level 1 right away.

That's it! Now all heroes who have `my_innate_ability` will automatically have it leveled up on spawn.
