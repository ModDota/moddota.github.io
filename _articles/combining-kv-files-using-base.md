---
title: 'Combining KV files using #base'
author: Perry
steamId: 76561198046986723
date: 06.04.2016
category: Scripting
---

Having one kv file containing every unit or ability definition as is default in the mod interface can become very annoying very quickly. Splitting up this one file into several smaller KV files makes it easier to keep an overview and manage your files. Usually people would use modkit for this, but:

**[ModKit](https://github.com/stephenfournier/Dota-2-ModKit) is not needed to combine KV files**

Thanks to some detective work done in #steamdb and some testing on my part, we discovered dota KV has a working #base directive, which tells the engine to combine another KV file with the current one.

**This method works for:**

*   Unit/Ability definition files (like npc_units_custom.txt or npc_abilities_custom.txt).
*   Custom key value files loaded into lua with LoadKeyValues.
*   Localisation files (addon_english.txt)

## How it works

Assume we start with one file at path `scripts/npc/npc_abilities_custom.txt` with the following content:

    "DOTAAbilities"
    {
        "Ability1"
        {
            "SomeProperty1"    "1"
            "SomeProperty2"    "2"
        }

        "Ability2"
        {
            "SomeProperty1"    "1"
            "SomeProperty2"    "2"
        }
    }

Now let's say we want to split this up into two files, we can create another file `scripts/npc/abilities_2.txt`. This file has to have a root element just like the other files, we can just copy DOTAAbilities. Also copy the content to be separated so this is the result:

    "DOTAAbilities"
    {
        "Ability2"
        {
            "SomeProperty1"    "1"
            "SomeProperty2"    "2"
        }
    }

Now edit the main file to include this new abilities_2.txt file by adding `#base "[relativePath]"`, this results in:

    #base "abilities_2.txt"
    "DOTAAbilities"
    {
        "Ability1"
        {
            "SomeProperty1"    "1"
            "SomeProperty2"    "2"
        }
    }

When loading this KV file, the engine will now automatically add the contents of abilities_2.txt to npc_abilities_custom.txt by combining the two root objects in both files. This means that the name of the root object does not matter, so instead of `"DOTAAbilities"` you could have `"MYOTHERFILE"`, or even just empty string `""`. You should not have identical keys in both root objects, but if you do then the ones defined later (think of #base happening before the rest of the file) will override already defined ones.

This also supports directories. Keep in mind all paths are relative. Say I create `scripts/npc/customAbilities/ability1.txt`, I can include this from `scripts/npc/npc_abilities_custom.txt` using `#base "customAbilities/ability1.txt"`.

**PS:** Other extensions are also allowed, you could name your included files *.kv

## Credits for pointing out this is part of the KV spec:

*   XMPPwocky
*   xPaw
*   Netshroud