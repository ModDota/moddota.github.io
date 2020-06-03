---
title: DataDriven Ability Events & Modifiers
author: Noya
steamId: '76561198046984233'
date: 10.12.2014
---

A guide that tries to cover every Ability & Modifier Event of the *ability_datadriven* system, with examples.

[![img](http://i.imgur.com/T7W828Q.png)](http://moddota.com/forums/discussion/13/datadriven-ability-events-modifiers "Start")

- [Ability Events](#Comment_28)
  - [Spell Start](#Comment_28)
  - [Toggleable Abilities](#Comment_29)
  - [Channeled Abilities](#Comment_30)
  - [Death and Spawn](#Comment_31)
  - [Projectiles](#Comment_32)
  - [Item Equip](#Comment_33)
  - [Others](#Comment_34)
- [Modifier Events](#Comment_35)
  - [Create and Destroy](#Comment_35)
  - [Repeating Actions](#Comment_36)
  - [Attacks](#Comment_37)
  - [Damage](#Comment_38)
  - [Killing and Dying](#Comment_39)
  - [Orbs](#Comment_40)
  - [Others](#Comment_41)

<br />
<a name="start"></a>
This is an Intermediate guide that expects some knowledge of the most common first-level keyvalues. If unsure about the meaning of any of them, check the [DataDriven Ability Breakdown](http://moddota.com/forums/discussion/14/datadriven-ability-breakdown).

### Introduction

In the Data Driven system, an Event is something that triggers when a particular in-game event occurs, for example, finishing the cast of an ability.

They are of the form On[*EventTriggerKeyword*], like `OnSpellStart` `OnCreated` etc.

There's a complete (for the most part) [list of Events in the Workshop Tools Wiki](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/Abilities_Data_Driven#Ability_Events_and_Actions) but what I'm gonna do is explain each one of them with examples of how and when to use them.

In the process I'm also going to make use of different [Actions](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Scripting/Abilities_Data_Driven#Actions), inside the Events, some are self explanatory and some require some in-depth explanation on how to use them.

There are 2 types, **Ability Events** and **Modifier Events**. 

Ability Events go on the "first level" of the ability. Modifier Events need to be inside a modifier block.

Basic Skeleton looks like this:
```    
"ability_custom"
{
    // AbilityBehavior and General values
    // AbilitySpecial block 
    // precache block

    // Ability Events
    "OnSpellStart"
    { [ACTIONS] }

    "Modifiers"
    {
        "modifier_custom" 
          {
            // Modifier Events
            "OnCreated"
            { [ACTIONS] }
        }
    }
}
```

When the Event triggers, all the Actions defined in its block will be executed.

To test if your Event is actually happening when you expect, you can add the following Action block inside it:

```
"RunScript"
{
    "ScriptFile" "utilities.lua"
    "Function" "Test"
}
```

`RunScript` is one of the most common and potent Actions you'll use for creating complex abilities. For it to work, you need to have a Script File, in this case *utilities.lua*, inside the vscripts folder. 

The Function called can have this:

```lua
function Test( event )
    print("It works!")
end
```

This will display to the Console the values passed (usually a huge table) if your event trigger is being detected correctly.

I'll try to stay away from RunScript as the Action to not have to make this a Dota Lua API wall of text, which is to be addressed in another, more advanced tutorial.

---
