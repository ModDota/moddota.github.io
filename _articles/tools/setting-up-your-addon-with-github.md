---
title: Setting Up Your Addon With GitHub
author: Veggiesama
date: 06.03.2024
---

Split the game into a `game` and `content` folder, then add junctions or symlinks to link them with the Dota files.

## Windows - Create the junctions
For `game` folder, run
```shell
mklink /J "C:\Users\Veggiesama\Desktop\HVH\game\hunter_v_hunted\" "C:\Games\steamapps\common\dota 2 beta\game\dota_addons\hunter_v_hunted\"
# Junction created for C:\Users\Veggiesama\Desktop\HVH\game\hunter_v_hunted\ <<===>> C:\Games\steamapps\common\dota 2 beta\game\dota_addons\hunter_v_hunted\
```

For `content` folder, run
```shell
mklink /J "C:\Users\Veggiesama\Desktop\HVH\content\hunter_v_hunted\" "C:\Games\steamapps\common\dota 2 beta\content\dota_addons\hunter_v_hunted\"
#Junction created for C:\Users\Veggiesama\Desktop\HVH\content\hunter_v_hunted\ <<===>> C:\Games\steamapps\common\dota 2 beta\content\dota_addons\hunter_v_hunted\
```

To remove junctions, simply remove the link directory
```shell
rmdir "C:\Users\Veggiesama\Desktop\HVH\content\hunter_v_hunted\" -force
```

## Linux - Create the symlinks
For `game` folder, run
```shell
ln -s /home/username/games/Steam/steamapps/common/dota2/game/dota_addons/my_custom_game /home/username/workspaces/dota2-workshops/my_custom_game/game
```

For `content` folder, run
```shell
ln -s /home/username/games/Steam/steamapps/common/dota2/content/dota_addons/my_custom_game /home/username/workspaces/dota2-workshops/my_custom_game/content
```

Remove the symlinks by using
```shell
unlink /home/username/workspaces/dota2-workshops/my_custom_game/content
umlink /home/username/workspaces/dota2-workshops/my_custom_game/game
```

Now you can do modifications from the steamapps folder and still use Github for version control from a linked folder.
