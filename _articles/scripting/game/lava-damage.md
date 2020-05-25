---
title: 'Lava damage'
author: DiNaSoR
steamId: 76561197974680917
date: 20.08.2015
category: Scripting
---

Hello, this is a small tutorial giving back to the awesome Moddota community.

Today we going to create Lava area when a hero step on that lava he will get damaged per sec until he die.


**First you need to create a block and assign trigger texture to it**
<Gfycat id="WaterloggedQuarrelsomeDutchshepherddog" />

Then convert the mesh to Entity and name it plus assign this Entity script to lavatrigger.lua <-- you can name it whatever you want.
![enter image description here](https://i.gyazo.com/f4e83a50e4c80ee658042c1dd2a73d2c.png "enter image title here")
<Gfycat id="AntiqueSkinnyKagu" />

next we go to Outputs tabs in top and click on it add the following in the picture.

![enter image description here](https://i.gyazo.com/bcea6b60046512109f121aa0164f7cd2.png "enter image title here")

Now go to your vscript folder and create a file called lavatrigger.lua and put this script inside.
~~~lua
local LAVA_DAMAGE_TICK_RATE = 2
local LAVA_DAMAGE_AMOUNT = 100

function lavatrigger(trigger)

        local ent = trigger.activator

        if not ent then return end

        local hp = ent:GetHealth()

        if hp >= LAVA_DAMAGE_AMOUNT then
            ent:SetHealth(hp - LAVA_DAMAGE_AMOUNT)
        else
            ent:ForceKill(true)
        end

    return LAVA_DAMAGE_TICK_RATE
end
~~~

here is the final result!:smile: 
<Gfycat id="CharmingTestyAlaskanmalamute" />


NOTE We can spice this a little bit with particles effect and sound will explain that next time.
