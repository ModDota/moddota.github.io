---
title: Scripted Shop Spawning
author: snippet
steamId: 76561198017441460
---

A feature commonly asked about is how to dynamically create shops. Turns out it's actually quite easy! Here's what to do.

## Step 1
You need to create the triggering area for your shop in hammer. Use the block tool (**ctrl+b**) to draw the triggering area you want for the shop, you can change the shape in the block tool to whatever you need.

Draw the area somewhere off the map. You don't want players randomly stumbling across it.

## Step 2.
Turn the block into a entity by selecting it and pressing **ctrl+t**. Change the entity class to trigger_shop and give it a name. Also filter materials and find the trigger material, drag it onto the block. Finally set the shop type at the bottom. It should now look like this ![ShopInHammer](http://i.imgur.com/XqzWA3I.jpg "ShopInHammer"). When that's done rebuild the map.

## Step 3.
Now simply add the following code to create a shop at your desired location! I added this to OnConstructionCompleted in building helper.
~~~lua
local shopEnt = Entities:FindByName(nil, "my_new_shop") -- entity name in hammer
local newshop = SpawnEntityFromTableSynchronous('trigger_shop', {origin = unit:GetAbsOrigin(), shoptype = 1, model=shopEnt:GetModelName()}) -- shoptype is 0 for a "home" shop, 1 for a side shop and 2 for a secret shop
~~~

Example:
[gfy DimwittedGlisteningAmericanmarten]

Recommended reading:
[Creating a custom shop in Dota 2](http://www.reddit.com/r/Dota2Modding/comments/2dpts1/tutorial_creating_a_custom_shop_step_by_step/)