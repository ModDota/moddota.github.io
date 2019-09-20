---
title: Hiding HUD with SetHUDVisible
author: Noya
steamId: 76561198046984233
category: general
---

There's a function currently missing from the API page: SetHUDVisible(int, bool) which I want to document here.

Credits to BMD for this list:

| HUD Component | int value 
| ------------- |-------------|
| DOTA_HUD_VISIBILITY_TOP_TIMEOFDAY | 0
| DOTA_HUD_VISIBILITY_TOP_HEROES | 1 |
| DOTA_HUD_VISIBILITY_TOP_SCOREBOARD | 2
| DOTA_HUD_VISIBILITY_ACTION_PANEL | 3
| DOTA_HUD_VISIBILITY_ACTION_MINIMAP | 4
| DOTA_HUD_VISIBILITY_INVENTORY_PANEL | 5
| DOTA_HUD_VISIBILITY_INVENTORY_SHOP | 6
| DOTA_HUD_VISIBILITY_INVENTORY_ITEMS | 7
| DOTA_HUD_VISIBILITY_INVENTORY_QUICKBUY | 8
| DOTA_HUD_VISIBILITY_INVENTORY_COURIER | 9
| DOTA_HUD_VISIBILITY_INVENTORY_PROTECT | 10
| DOTA_HUD_VISIBILITY_INVENTORY_GOLD | 11
| DOTA_HUD_VISIBILITY_SHOP_SUGGESTEDITEMS |  12

Note that changing it once doesn't let you change it back without restarting tools, so this shouldn't be used to manipulate the HUD after the game loads.

**Usage**

Somewhere in a game started event, I used `player_connect_full`
~~~
mode = GameRules:GetGameModeEntity()
mode:SetHUDVisible(hud_component_value, false)
~~~

<br>

#### DOTA_HUD_VISIBILITY_TOP_TIMEOFDAY

    mode:SetHUDVisible(0, false)

http://puu.sh/fAOer/20a271530e.jpg 

<br>

#### DOTA_HUD_VISIBILITY_TOP_HEROES

    mode:SetHUDVisible(1, false)

http://puu.sh/fAOiv/1035acf865.jpg 

<br>

#### DOTA_HUD_VISIBILITY_TOP_SCOREBOARD

    mode:SetHUDVisible(2, false)

http://puu.sh/fAOpV/887d94d3b1.jpg 

<br>

#### DOTA_HUD_VISIBILITY_ACTION_PANEL

    mode:SetHUDVisible(3, false) 

http://puu.sh/fAOuF/dfe961a286.jpg 

:bug: Hiding the action panel has this issue: http://puu.sh/fAOSh/9fc90dc654.jpg

<br>

#### DOTA_HUD_VISIBILITY_ACTION_MINIMAP

    mode:SetHUDVisible(4, false)

http://puu.sh/fAOBz/e1018a097b.jpg 

<br>

#### DOTA_HUD_VISIBILITY_INVENTORY_PANEL

    mode:SetHUDVisible(5, false) 

http://puu.sh/fAPiT/e6b2af6fd8.jpg 

<br>

#### DOTA_HUD_VISIBILITY_INVENTORY_SHOP

    mode:SetHUDVisible(6, false) 

http://puu.sh/fAP4b/4159ddae39.jpg 

<br>

#### DOTA_HUD_VISIBILITY_INVENTORY_ITEMS 

    mode:SetHUDVisible(7, false) 

 http://puu.sh/g9Ywi/56095d4467.jpg

<br>

#### DOTA_HUD_VISIBILITY_INVENTORY_QUICKBUY

    mode:SetHUDVisible(8, false) 

 http://puu.sh/fAOQx/7ff8fddbc1.jpg

<br>

#### DOTA_HUD_VISIBILITY_INVENTORY_COURIER 

:success: This one is fairly useful if your map doesn't use courier.

    mode:SetHUDVisible(9, false) 

http://puu.sh/g9YoK/096d9a4a95.jpg

<br>

#### DOTA_HUD_VISIBILITY_INVENTORY_PROTECT 

:question: Nothing changed?

    mode:SetHUDVisible(10, false) 

http://puu.sh/fAPAp/5e003ec96f.jpg 

<br>

#### DOTA_HUD_VISIBILITY_INVENTORY_GOLD 

    mode:SetHUDVisible(11, false) 

http://puu.sh/fAPEV/8b3e7d0808.jpg 

muh shekels are gone! :biblethump: 

<br>

#### DOTA_HUD_VISIBILITY_SHOP_SUGGESTEDITEMS

:success: This one actually disables that mostly useless window, unlike `SetRecommendedItemsDisabled(bool)`

    mode:SetHUDVisible(12, false) 

http://puu.sh/fAPKp/6e8f843dda.jpg

<br>


**For a more flexible HUD manipulation, Flash Scaleform tutorials will be coming SOON(TM)**