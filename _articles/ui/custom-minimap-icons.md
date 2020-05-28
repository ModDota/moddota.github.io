---
title: Custom Minimap Icons
author: Noya
steamId: 76561198046984233
date: 11.11.2015
---

Here is a quick and simple step by step guide on how to make and use your own minimap icons for creatures

## Step 1: Get the files

[minimap_icon.zip](http://moddota.com/resources/minimap_icon.zip) - From the [Resources page](https://moddota.com/forums/resources)

This contains the following files:

* **addon_hud_textures.txt**
* **vgui/hud/minimap_icon.txt**
* **vgui/hud/minimap_icon.vmat**
* **vgui/hud/minimap_icon.psd**

addon_hud_textures is an unique file to define the paths for every custom icon.

The 3 minimap_icon files are used together, and should be renamed to the name your future icon, like *minimap_questgiver* or *boss_kappa*.

## Step 2: Edit the files

### PSD Image

Use a graphic editor such as Photoshop or GIMP to edit the PSD file. 

In the example source file, I quickly made this transparent image from [this source](http://static.ongamers.com/uploads/ignore_jpg_scale_super/0/22/12584-dota2_courier_skippy03.png):

![img](http://i.imgur.com/78Z3kaV.png)

The suggested image size is **64x64**.<br />
If you want to use a different image size it **must be a power of two**.

**Important**: You need to have an Alpha layer filled with the transparent figure you want to display:

![img](http://puu.sh/lhQL0/81b3632bad.png)

For better results, add strong black borders to the image as an outline (and remember to update the Alpha layer accordingly).

### VMAT Material

Open the vmat with any code editor and make sure to change minimap_icon.psd for the name of your choice. Keep the rest unchanged

~~~
"Layer0"
{
    "Shader"            "ui.vfx"
    "F_STENCIL_MASKING" "1"
    "Texture"           "materials/vgui/hud/minimap_icon.psd" //EDIT THIS
    "F_TRANSLUCENT"     "1"
}
~~~

### Texture KV File

Same process in the addon_hud_textures.txt file

~~~
""
{
    "TextureData"
    {
        "minimap_icon" //EDIT THIS
        {
            "file"     "materials/vgui/hud/minimap_icon.vmat" //EDIT THIS
            "x"        "0"
            "y"        "0"
            "width"    "64"
            "height"   "64"
        }
    }
}
~~~

For more icons, just copy the minimap_icon block again with another name inside TextureData

### Step 3: Move the files

* **minimap_icon** files go in **content**/dota_addons/YOUR_ADDON/materials/**vgui/hud/**. 

* **addon_hud_textures.txt** file goes in **content**/dota_addons/YOUR_ADDON/scripts/

### Step 4: Compile and check

Go into the asset browser, write the name of your icon, open the vmat by double clicking on it (this will compile it).

![img](http://puu.sh/lhRLL/31d63b48d9.jpg)

### Step 5: Set your unit to use the new icon

In the unit definition, add these lines:
~~~
"MinimapIcon"        "minimap_icon"
"MinimapIconSize"    "1000"
"MinimapDisableTint" "1"
~~~

`MinimapIconSize` determines the relative size of the minimap icon, while `MinimapDisableTint` can be 0 or omitted if you want the creature to use different team colors.

### 6. Try it ingame

![img](http://puu.sh/lhQFp/37192e1e63.jpg)

---
