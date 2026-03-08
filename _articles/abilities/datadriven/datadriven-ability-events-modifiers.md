---
title: DataDriven Ability Events & Modifiers
author: Noya
steamId: '76561198046984233'
date: 10.12.2014
---

# DataDriven Ability Events & Modifiers

A guide that tries to cover every Ability & Modifier Event of the _ability_datadriven_ system, with examples.

![img](/images/external/T7W828Q.png)

<a name="start"></a>
This is an Intermediate guide that expects some knowledge of the most common first-level keyvalues.
If unsure about the meaning of any of them, check the [DataDriven Ability
Breakdown](/abilities/ability-keyvalues).

## Introduction

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
    // AbilityValues block
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

`RunScript` is one of the most common and potent Actions you'll use for creating complex abilities. For it to work, you need to have a Script File, in this case _utilities.lua_, inside the vscripts folder.

The Function called can have this:

```lua
function Test( event )
    print("It works!")
end
```

This will display to the Console the values passed (usually a huge table) if your event trigger is being detected correctly.

I'll try to stay away from RunScript as the Action to not have to make this a Dota Lua API wall of text, which is to be addressed in another, more advanced tutorial.

---
