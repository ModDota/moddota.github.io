---
title: Custom Keybindings in panorama
author: ole
steamId: '76561197966853265'
date: 24.07.2015
---

### Introduction

With the recent update (20th of july) valve added support for custom keybindings. That is, you can bind key's to fire a custom command.

The technique used is derived from rpg_example.

Although this method is not nescessarily limited to panorama this tutorial will focus on using them within panorama.

### Setup
Start by adding a couple of lines to your `addoninfo.txt` file located in `/game/<your addon>/addoninfo.txt`

~~~
"AddonInfo"
{
  "TeamCount" "10"
  "maps"      "your_map"
  "IsPlayable"  "1"
  "your_map"
  {
          "MaxPlayers"                    "10"
  }
  "Default_Keys"
    {
        "01"
        {
            "Key"       "S"
            "Command"   "CustomGameExecuteAbility1"
            "Name"      "Execute Ability 1"
        }
        "02"
        {
            "Key"       "Z"
            "Command"   "+CustomGameTestButton"
            "Name"      "Example"
        }
    }
}
~~~

The important parts are of course what is defined in `"Default_Keys"`

`"Key"`
is the key you want to bind, use capital letters here

`"Command"`
is the command to fire, make sure the command name is unique.  
The prefix of the command defines when the command will trigger.

`"Name"`
Name of the command, used for debugging purposes.

####Command Prefixes

| Prefix        | Example    | Description                                             |
| ------------- |------------|---------------------------------------------------------|
| *(nothing)*   | *command*  | Command will trigger on press and release               |
| **+**         | *+command* | Trigger when key is pressed (used for normal key press) |
| **-**         | *-command* | Command will trigger when key is released               |

The prefixes do not lock the command to be triggered only in that event. But is a good self-reference for what you want the keybind to do.

### Panorama
Catching the keybind commands in Panorama is easy:

~~~lua
function OnExecuteAbility1ButtonPressed()
{
  $.Msg("'S' Pressed or Released");
}

function OnTestButtonPressed()
{
  $.Msg("'Z' Pressed");
}

function OnTestButtonReleased()
{
  $.Msg("'Z' Released");
}

(function() {
  Game.AddCommand( "CustomGameExecuteAbility1", OnExecuteAbility1ButtonPressed, "", 0 );
  Game.AddCommand( "+CustomGameTestButton", OnTestButtonPressed, "", 0 );
  Game.AddCommand( "-CustomGameTestButton", OnTestButtonReleased, "", 0 );
})();
~~~

Note how the prefixes are used again. Even though we only defined `CustomGameTestButton` to be fired on *key down*, we can easily catch the release event in our JS aswell.
