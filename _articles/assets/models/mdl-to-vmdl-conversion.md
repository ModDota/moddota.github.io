---
title: MDL to VMDL Conversion
author: Noya
steamId: '76561198046984233'
date: 28.05.2015
---

This guide will go through the process of making a **.vmdl file** (Source 2 Model) from a **.mdl file** and other model-related files from Source 1. The Wyvern Hatchling courier will be used as example, but the same process applies to heroes, buildings and any Valve Dota model.

<Gfycat id="JauntyQuickArcticwolf" />

### Required Tools

* [GCFScape](https://developer.valvesoftware.com/wiki/GCFScape)
* [Crowbar](https://steamcommunity.com/groups/CrowbarTool/discussions/0/617328415069203029/)
* [VTFEdit](https://developer.valvesoftware.com/wiki/VTFEdit)
* Workshop Tools (Material and Model Editor)

### 1. Acquire the **model** and **material** files from the main game VPK (*pak01_dir.vpk*) using GCFScape. 

The following file types are required:

* .mdl
* .vvd
* .dx90.vtx
* .vtf

Model files will be in a subfolder of the */models/* folder:

![img](https://puu.sh/i3ayn/10871a9310.png)

Right-click extract into a folder of your choice.

![img](https://puu.sh/i3aCO/4887dee9a8.png)

Color Material files are located in the  the *materials/models/* folder. In this example this courier has 3 associated color files, one for each skin, so we'll get 

![img](https://puu.sh/i3aCw/5df098fb34.png)

Finally we should have these:

![img](https://puu.sh/i3aF1/ac40c1028e.png)

### 2. Use Crowbar to decompile the model files into meshes (.smd)

![img](https://puu.sh/i3aHy/2c37903006.png)

![img](https://puu.sh/i3aIq/aa87bc8d72.png)

Result on the output folder:

![img](https://puu.sh/i3byq/f3640f6f4b.png)

### 3. Use VTFEdit to generate color TGAs out of the VTF files acquired in step 1.

![img](https://puu.sh/i3aJa/775179ec38.jpg)

![img](https://puu.sh/i3aKg/33590b10c1.jpg)

Do File-> Export.

Result ([IrfanView](https://www.irfanview.com/) is an oldschool image viewer that can open TGAs just fine):

![img](https://puu.sh/i3bEp/1176075e01.png)

### 4. Move the generated files to your addons **/content/** folder.

- Move the decompiled files generated in step 2 to **/content/models/**

![img](https://puu.sh/i3cT8/8962d8e943.png)

- Move the TGA files generated in step 3 to **/content/materials/**

![img](https://puu.sh/i3cQg/76e8c16b46.png)

Create new folders on each or just drop the files over the respective directories. Make sure to use the content folder (not the /game/). <br />The location of the reference mesh in /content/models/ will determine the location where the .vmdl file will be saved.

### 5. Generate a .vmat file from the TGA files. 

- Open the Material Editor
- File -> New Material
- Without doing anything yet, **Save** the empty material with the name of the TGA you want to make a .vmat for. ![img](https://puu.sh/i3d02/b647383364.png)
- Browse and find the TGA to use ![img](https://puu.sh/i3d8I/b8d0e0b25d.png)
- The file should be visible by default with the _color. extension ![img](https://i.imgur.com/Bbu4VtP.jpg)
- Save the final material. ![img](https://i.imgur.com/Jbw6kyq.jpg)

### 6. Make a New VMDL from the Mesh file (.smd)

- Open the Model Editor
- New VMDL from Mesh File (Ctrl+M) ![img](https://puu.sh/i3gPC/eb6efe93f2.jpg)
- Select the reference .smd file generated in step 2. ![img](https://i.imgur.com/Q7VH7Nq.png)
- If everything went well you should get a red error mesh: ![img](https://i.imgur.com/MQmf1IM.jpg)

### 7. Add a Material Remap for the missing textures, using the .vmat file from step 5.

- On the menus, Model -> Add Material Remap ![img](https://i.imgur.com/NgZbK7n.png)
- Select the Material Remap List and collapse the properties on the Property Editor ![img](https://i.imgur.com/oRNgV71.png)
- Search Material, select on from the drop down list. These are missing materials which have to be remaped to the the .vmat made earlier.
- Ctrl+S to save the model, now the model comes together with the texture to take shape:

![img](https://i.imgur.com/o22c9Iy.jpg)

- IF the model shows as **Error**, something went wrong. Make sure to delete the auto-compiled models and materials of the same name on the /game/ folders, which are now corrupted. Make sure everything is using the proper names and directories, sometimes the Model/Material editor feel like not working and doing Volvo things.

### 8. Add the Animations on the _anims folder and make Activities for them.

![img](https://i.imgur.com/5BvFhPg.png)

Select all of them.

![img](https://i.imgur.com/GPPJld3.png)

The Animations will now preview when you click over them, the model will move, but for game to use the animations it needs an Activity (the ACT_DOTA_name strings).

On the Sequences window (Do Tools-> View Sequences if it doesn't show up), make sure **Activity** is selected. It will show an empty list between brackets []

![img](https://puu.sh/i3xPr/4ac46797fe.png)

Now, select each animation you want to have a activity for.

![img](https://puu.sh/i3yr7/447456fe3a.png)

On the Property Editor, there is a an Activities element which will have 0 items by default. Click on the **+** to add one.

![img](https://puu.sh/i3yyc/2bde52de31.png)

Add a Name to it, try to use the ACT_DOTA_name that better adjusts to the activity description

![img](https://puu.sh/i3yxi/2cbd4d5b16.png)

Finally, we have usable animations:

![img](https://puu.sh/i3yyc/2bde52de31.png)

**Note:** This is also useful to be able to have access to some of the ACT_DOTA_ACTIVITY+**string** activities that some of the Taunt and Alternative animations use which currently can't be used for abilities and other purposes (as it just ignores the **+string** part). <br />Knowing this, it's possible to assign some unused activity string like "ACT_DOTA_MINI_TAUNT" and force its usage trough the `OverrideAnimation` KV.

### 9. Add the Hitboxes

Go to Model->Hitboxes->Auto Populate and accept the list of all bones.

![img](https://puu.sh/i3yki/3624cba10a.png)

If you enable Display-> Hitboxes and Hitbox Names you should see something like these:

![img](https://puu.sh/i3ymK/0c24d9b35c.png)

---

Final result is the finished model with all its animations (hopefully):

<Gfycat id="FirmEthicalHylaeosaurus" />

---
