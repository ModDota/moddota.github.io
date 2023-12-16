---
title: Adding Hitbox to Models without a Bone
author: "Noya (updated by: Abraham Blinkin' 12.10.2023)"
steamId: '76561198046984233'
date: 06.12.2015
---

If you tried some of Valve's prop models, you had already noticed that many of them don't have a hitbox, so they can't be used for selectable units.

There is a very easy process that takes no longer than a couple of minutes to add one. 

In this tutorial, I will add a hitbox to this model: `gryphon_statue001.vmdl.`

![img](https://puu.sh/lLH62/45243b2ded.jpg)

## Step 1. Hammer DMX Export

Open Hammer, make a new map ( File->New or CTRL+N ), and drag the model into the origin. 

![img](https://puu.sh/lLHek/b90cae10f2.png)

You can also rotate, scale, or displace it as required.

After its done, select the model and right-click on it. Then under the **Selected Objects** options, click **Create Model From Selection**. Save to your **Models** directory. Bear in mind that you can select multiple mesh in the viewport and export them as a single model, but their textures will not properly export with them.

## Step 2. Generate a VMDL

Search for your new model in the Asset Browser and double-click it to open.

![img](https://i.imgur.com/l12Ub1w.png)

## Step 3. Download Cube.fbx

This is a mesh with 1 bone. [Download it directly](/cube.fbx) and put the file in your models directory.

Credits to @Internet_Veteran

## Step 4. Add the Cube.fbx a 'Simple Animation'

This is the critical part. Basically you'll be adding the cube mesh into the new model. You can do this on the model editor **Add -> Add Simples Animations...** and click "OK." It will ask for an fbx file to add. Choose the Cube.fbx that you placed in your models directory.

## Step 5: The a "Bone"

Now go to **Add -> Bone** and name it 'bone.' 

## Step 6: Add and Adjust the "Hitbox"

Now go to **Add -> Hitbox** and choose **(New HitboxSet)** as the parent node, and click "OK." Name the hitbox "hitbox" and click "OK," then choose "bone" as the parent_bone for the hitbox.

Now use the blue arrows in the viewport to adjust the size of the hitbox.

![img](https://i.imgur.com/pyrL292.png)

Finally, go to **File -> Save and Compile**

That's all! Now your model will have a hitbox ingame!
