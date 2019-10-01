---
title: '[Lua Modifiers I]: Extending Hero/NPC API with lua modifiers'
author: DrTeaSpoon
steamId: 76561197975484185
date: 21.08.2016
category: Scripting
---

When creating cool new abilities or game mechanics you often run into issues with the lack of good API. While I admit the dota 2 has massive API, it seems to focus on few very odd things or mechanics not fully exposed by default game. (Runes, Spell Stealing, Illusions). To fix those issues you might want to expand it. Here is one method of doing so.  
If you are using BMD's Barebones then you already have neatly exposed function `GameMode:OnHeroInGame(hero)` in your `internal/gamemode.lua` file. Otherwise you will want to listen to NPC spawning when initializing your game mode:

```lua
function Activate()
  LinkLuaModifier( "heroes_base_mod", "lua_modifiers/hero_base_mod.lua", LUA_MODIFIER_MOTION_NONE )
  ListenToGameEvent('npc_spawned', Dynamic_Wrap(CModDotaTutorialsGameMode, 'OnNPC_Spawn'), CModDotaTutorialsGameMode)
end

function CModDotaTutorialsGameMode:OnNPC_Spawn(keys)
  local npc = EntIndexToHScript(keys.entindex)
  if npc:IsRealHero() and npc.bInit == nil then
    npc.bInit = true
        OnHeroFirst_Spawn(npc)
  end
end

function OnHeroFirst_Spawn(hero)
  hero:AddNewModifier( hero, nil, "heroes_base_mod", {} )
end
```

NOTE: Keep in mind your gamemode's function name. I used `CModDotaTutorialsGameMode`. You should probably have something else. Now lets get back to topic. As you noticed we used `LinkLuaModifier`. We should create file it points to in your vscripts folder `"lua_modifiers/hero_base_mod.lua"`  
For this example we are tracking what is the last spell player has cast. This could be used potentially as the building blocks for recreating Rubick's spell steal.  
If you are unfamiliar with lua modifiers here is the only essential part of your modifier:

```lua
if heroes_base_mod == nil then
    heroes_base_mod = class({})
end
```

Next we want to make sure the modifier is not disabled at any point:

```lua
function heroes_base_mod:GetAttributes()
    return MODIFIER_ATTRIBUTE_PERMANENT + MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE
end
```

Here is the meat of our function's purpose. Track when this hero casts a spell.

```lua
function heroes_base_mod:DeclareFunctions()
    local funcs = {
        MODIFIER_EVENT_ON_ABILITY_EXECUTED
    }
    return funcs
end

function heroes_base_mod:OnAbilityExecuted(params)
    if IsServer() then --Make sure we are doing this only server side.
        if params.unit == self:GetParent() then --we only want the spells cast by this unit.
            if not params.ability:IsItem() then --we don't want to track items.
                self.lastability = params.ability --record the ability handle.
            end
        end
    end
end
```

Now we get to the magic:

```lua
function heroes_base_mod:OnCreated(kv)
    local hMod = self --we can only reference to "self" in our own function we pass this modifier to function we create for the unit.
    local hParent = self:GetParent() --the unit.
    if hParent.GetLastSpell == nil then --if for some odd reason there is already such function
        function hParent:GetLastSpell() ---we create new function for the unit.
            if hMod.lastability ~= nil then --if unit has cast any spells
                return hMod.lastability --return the last ability.
            else
                return nil --in case there is nothing to return. this is sort of redundant.
            end
        end
    end
end
```

Because we assume every hero having this modifier its kinda useless to show it on the screen.

```lua
function heroes_base_mod:IsHidden()
    return true
end
```

Now that we have our modifier done. We want some way of testing it. I decided to go with simple console command. Add following to your game init function.

```lua
-- this is in function Activate()
 Convars:RegisterCommand( "mod_test_spells", Dynamic_Wrap(CModDotaTutorialsGameMode, 'PrintLastSpells'), "Print last spell for every hero", FCVAR_CHEAT )
```

Now the actual console command's function:

```lua
function CModDotaTutorialsGameMode:PrintLastSpells()
  print( '** Last Spell **' )
    local tList = HeroList:GetAllHeroes()
    for k,v in pairs(tList) do
        local s = v:GetLastSpell()
        if s == nil then
            print( v:GetName() .. ' has cast no spells yet.')
        else
            print( v:GetName() .. ' last cast ' .. v:GetLastSpell():GetAbilityName())
        end
    end
  print( '****************' )
end
```

Now you should be able to use console command `mod_test_spells` to print out the last spell every hero has used.  
Next topic: Linken Sphere & Lotus Orb.
