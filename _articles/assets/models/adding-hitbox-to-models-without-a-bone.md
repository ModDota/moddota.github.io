---
title: Adding Hitbox to Models without a Bone
author: Noya
steamId: '76561198046984233'
date: 06.12.2015
---

If you tried some of Valve's prop models, you had already noticed that many of them don't have a hitbox, so they can't be used for selectable units.

There is a very easy process that takes no longer than a couple of minutes to add one. 

In this tutorial, I will add a hitbox to this model: `gryphon_statue001.vmdl`

![img](https://puu.sh/lLH62/45243b2ded.jpg)

As you can see after selecting `Display -> Hitboxes`, it has no hitbox, so it can't be clicked on ingame.

## Step 1. Hammer DMX Export

Open Hammer, make a new map, and drag the model into the origin.

![img](https://puu.sh/lLHek/b90cae10f2.png)

You can also rotate or displace it if its required, as well as adding more models to the scene.

After its done, go to **File -> Export Files** or **Export Selected**, and save the file as **.dmx** inside the models folder.

## Step 2. Generate a VMDL

Open the Model Editor and select **New VMDL From Mesh File** option, and choose your recently generated .dmx file

![img](https://puu.sh/lLHwg/89b5353d2a.png)

![img](https://puu.sh/lLHD0/2a3a5ed53b.jpg)

Save and close.

## Step 3. Add Cube.fbx hitbox


This is a mesh with 1 bone. [Download it directly](/cube.fbx) and put the file in your model folder


Credits to @Internet_Veteran

## Step 4. VMDL Editing

This is the critical part. Basically you'll be adding the cube mesh into the exported model. You can do this on the model editor (**Animation -> Add Animation**, or by editing the .vmdl file with a text editor and coping the following lines:

https://pastebin.com/qryMBaPz

Just replace everything on your vmdl except for the first big *m_meshList* block

Restart the workshop tools after that.

## Step 5: Open the file and adjust the hitbox

The attached cube is a small 50x50 rectangle, just click on it and adjust it to your model needs. You can also edit it directly from the .vmdl file under *m_vMinBounds* and *m_vMaxBounds*

**Note:** If your file shows as error, make sure to restart the workshop tools, or repeat the process after deleting all the compiled and source files.

Press `T` hotkey to access the scaling tool.

![img](https://puu.sh/lLIGx/4b75817f3f.jpg)

![img](https://puu.sh/lLIN3/8ab9a87b21.jpg)

That's all! Now your model will have a hitbox ingame:

<Gfycat id="FrightenedBareAlbino" />
