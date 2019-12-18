---
title: 'Setting Up Your Addon With GitHub'
author: Veggiesama
date: 07.03.2015
category: Beginners
---

# Setting Up Your Addon With GitHub

Split the game into a game and content folder, then add junctions to link them with the dota files.

Create the junctions:

mklink /J "C:\Users\Veggiesama\Desktop\HVH\game\hunter_v_hunted\" "C:\Games\steamapps\common\dota 2 beta\game\dota_addons\hunter_v_hunted\"

Junction created for C:\Users\Veggiesama\Desktop\HVH\game\hunter_v_hunted\ <<===>> C:\Games\steamapps\common\dota 2 beta\game\dota_addons\hunter_v_hunted\

mklink /J "C:\Users\Veggiesama\Desktop\HVH\content\hunter_v_hunted\" "C:\Games\steamapps\common\dota 2 beta\content\dota_addons\hunter_v_hunted\"

Junction created for C:\Users\Veggiesama\Desktop\HVH\content\hunter_v_hunted\ <<===>> C:\Games\steamapps\common\dota 2 beta\content\dota_addons\hunter_v_hunted\

Now you can do modifications from the steamapps folder and still use Github for version control from a desktop folder.
