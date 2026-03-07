---
title: Rotate Ability Example
author: Noya
steamId: '76561198046984233'
date: 23.01.2015
---

**Block**
```
"Rotate"
{
    "Target"       "TARGET"
    "PitchYawRoll"	"0 0 0" //x y z values
}
```

**Example:** Rotate the caster every interval
```
"OnSpellStart"
{
    "ApplyModifier"
    {
        "ModifierName"	"modifier_rotating"
        "Target"       "CASTER"
    }
}

"Modifiers"
{ 
    "modifier_rotating"
    {
        "ThinkInterval" "%interval"	
        "OnIntervalThink"
        {
            "Rotate"
            {
                "Target"       "TARGET"
                "PitchYawRoll"	"%x %y %z"
            }
        }
    }
}
```

<br />

**Pitch** Rotation, 15 every frame (0.03 interval)

<StaticVideo path="/videos/BothImpureHeterodontosaurus.mp4" />

<br />

**Yaw** Rotation, 15 every frame

<StaticVideo path="/videos/MemorableAcceptableDikdik.mp4" />

<br />

**Roll** Rotation, 15 every frame

<StaticVideo path="/videos/GraciousWebbedHamadryad.mp4" />

