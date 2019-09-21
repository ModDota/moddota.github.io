---
title: Adding and playing Custom Sounds
author: Noya
steamId: 76561198046984233
date: 10.03.2015
category: general
---

Here's an step by step guide to custom sound events.

## 1 - Preparing the file

You want a file with mp3 extension, .wav might work but I haven't tried it. You can convert sounds to mp3 using any decent sound editor, I use Audacity, you can download it from [here](http://audacity.sourceforge.net/download/)

If you want a sound from a youtube video, I recommend using this website: http://www.vidtomp3.com/

## 2 - Copy/Move the file to the content folder

Sound files to be compiled by Source2 dota need to be placed in the **content\dota_addons\ADDON_NAME\sounds** folder. If you don't have it, create one.

Folder structure:

![img](http://puu.sh/guI0g/438a0323a4.png)

## 3 - The Custom Sounds Valve Event

Also inside the content folder of your addon, there should be an soundevents folder:

![img](http://puu.sh/guI3k/1c84b64257.png)

Create one if there isn't. Here is the place where text files with the **.vsndevts** extension are located. You can name it as you want was long as you keep that extension. I usually use custom_sounds.vsndevts for all the addon's sounds, and **make sure to precache this file somewhere** (usually it's easier to do it once in Lua Precache(context) and forget about it).

The structure of the file is quite simple, it's a KV list with a sound string name as the first value of each sound block and then many values that control different properties of the sounds which aren't really important most of the times if you use this code:

~~~
"SoundStringName"
{
    "operator_stacks"
    {
        "update_stack"
        {
            "reference_operator"
            {
                "operator"              "sos_reference_stack"
                "reference_stack"       "dota_src1_3d"
                "operator_variables"
                {
                    "vsnd_files"
                    {
                        "value"
                        {
                              "value0"        "sounds/FileName.vsnd"
                        }
                    }
                    "volume"            {   "value"     "10.00000"  }
                    "pitch_rand_min"    {   "value"     "-0.05000"  }
                    "pitch_rand_max"    {   "value"     "0.050000"  }
                    "pitch"             {   "value"     "1.000000"  }
                    "soundlevel"        {   "value"     "100.00000" }
                    "distance_max"      {   "value"     "1600.000"  }
                    "event_type"        {   "value"     "1.000000"  }
                }
            }
        }
    }
}
~~~

First **`"AddonName.FileName"`**, which is your desired sound string and will be used to Fire/Emit it

Last and most important, the **`"sounds/FileName.vsnd"`** contains a relative path to the sound files **compiled valveSound**. The sound you added on the step 2 was an mp3, the engine will convert this sound to .vsnd when the **.vsndevts** file is compiled/build.

In this whole block, the only lines you want to change when doing the new sound. Here's the whole [CourierMadness' custom_sounds.vsndevts](http://pastebin.com/kcuLqZBm), as you can see, its basically a big copy paste of the same block, just changing those 2 lines. 

You can change the volume/pitch of your sounds of course, play around the operator_variables for this.

## Step 4 - Emitting and making sure the sound is being compiled

Once the sound event file is done, you need to force the game to compile it before calling the string with KV `"FireSound"` or any Lua `EmitSound()` variant.

For this, go into the Workshop Tools Asset Browser of your addon, type the name of your custom sound event and do a Full Recompile+Reload

![img](http://puu.sh/guIUd/4ce0b6f142.png)

Now, if you go into your game addon folder, there should be a sounds and soundevents folder, which should contain your _c compiled version of the files made in the content folder.

![img](http://puu.sh/guJ7J/00d69a1243.png)

If this isn't the case, go into the Asset Browser again and instead of your sound event, type the name of your sound file, and click on it, if it starts playing, it has been properly compiled.

---

Thanks for reading, leave any questions below.