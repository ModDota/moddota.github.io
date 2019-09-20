---
title: Doing arithmetic with KV
author: Pizzalol
steamId: 76561198015886976
category: general
---

Hello! 

This short tutorial is here to inform you that it is possible to do arithmetic calculations in the KV fields!

In this example the `AbilitySpecial` field `air_time` has the value of `3`

~~~
"Knockback"
{
    "Target"    "TARGET"
    "Center"    "CASTER"
    "Distance"    "0"
    "Duration"    "%air_time / 2"
    "Height"    "200"
    "IsFixedDistance"    "1"
}
~~~
The duration of the `Knockback` will be 1.5 seconds in this case(it is also possible to do calculations with more than one `AbilitySpecial` value in the same field)

So far I haven't run into any fields that don't work with this, in case something changes then I will update the post in the future.
