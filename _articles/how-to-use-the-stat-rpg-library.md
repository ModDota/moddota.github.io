---
title: How to use the Stat-RPG Library
author: Noya
steamId: 76561198046984233
---

***What is Stat-RPG ?***<br>
[stat-rpg](https://github.com/GetDotaStats/stat-rpg) is an ActionScript library developed by @SinZ and @jimmydorry at [GetDotaStats](http://getdotastats.com/).<br>This library allows mods to have persistent data over multiple plays.<br>For the Installation guide and a description of its API, read the [Stat RPG wiki](https://github.com/GetDotaStats/stat-rpg/wiki)

Having read that and assuming a minimum experience with [Dota Custom UIs](yrrep.me/dota/dota-ui-flash.html), on this guide I'll explain a **basic implementation to Save and Load** the following info for each player hero:

* Experience 
* Gold
* Unspent skill points
* Items
* Ability Levels

This can be extended to other things including custom values and more detailed structures (like units owned and their positions in the map).

### List of Steps:

1. [Required Custom Game Events](#step1)
2. [Send the SteamIDs when every player has loaded](#step2)
3. [Sending an rpg_save from Lua](#step3)
4. [SaveData on ActionScript](#step4)
5. [Sending an rpg_load from Lua](#step5)
6. [GetSave on ActionScript](#step6)
7. [Register the Console command on Lua and recreate the values](#step7)

<br>
<a name="step1"></a>
## Step 1. Required Custom Game Events

On the custom_events.txt there will be an event to send the steamIDs, and two for Save/Loading a player's SaveID.
~~~
"stat_collection_steamID"
{
    "ids"           "string"
}

"rpg_save"
{
    "player_ID"      "short"
    "save_ID"        "short"
    "hero_XP"        "long"
    "gold"           "short"
    "unspent_points" "short"
    "hero_items"     "string"
    "ability_levels" "string"
}

"rpg_load"
{
    "player_ID"     "short"
    "save_ID"       "short"
}
~~~

**Note:** Using the [Actionscript functions](https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Custom_UI/Actionscript_game_engine_reference) it's possible to move most of the event-based values and get them directly from the UI code (meaning rpg_save would just need to send the player_ID and save_ID), but I personally prefer to get the values from Lua and do as less AS as possible :smile: 

<a name="step2"></a>
## Step 2. Send the SteamIDs when every player has loaded.

The GDS Saves will be performed towards each player's SteamID, so make sure you call this after all these values are known. Using the `OnAllPlayersLoaded()` barebones call should be enough.

~~~lua
-- Stats Collection (RPG, Highscores, Achievements)
-- This is for Flash to know its steamID
j = {}
for i=0,9 do
    j[i+1] = tostring(PlayerResource:GetSteamAccountID(i))
end
local result = table.concat(j, ",")
j = {ids=result}
print("FireGameEvent(stat_collection_steamID, {",j,"})")
DeepPrintTable(j)
FireGameEvent("stat_collection_steamID", j)
~~~

<a name="step3"></a>
## Step 3. Sending an `rpg_save` from Lua

The following function will go through every player, get the required data to be saved, and fire the game event. 

`RPGSave()` can be called anytime after having successfully set the SteamIDs, for example, every time a player gains a level, someone disconnects, and on a slow looping timer every some minutes.

The code is long but quite simple, basically just get the data and put it in vars to send later.

For multiple values, like the item names and ability levels, the easiest way to do it is splitting them with commas and 'empty' keyword for items. The saved values will have to be later loaded and split into a table to recreate them when the players log again.

In this example, the save_ID is always tied to the hero. This means each hero can only have 1 save. If you want to have multiple saves for each hero, you'll need to use a different system to generate and load save_IDs, probably by keeping a save-of-saves per hero.

~~~lua
function RPGSave()
    print("Performing rpg_save for every player")
    for pID = 0, DOTA_MAX_PLAYERS-1 do
        if PlayerResource:IsValidPlayer(pID) then
            local hero = PlayerResource:GetSelectedHeroEntity( pID )
            if hero then
                local hID = PlayerResource:GetSelectedHeroID( pID )        
                local hero_XP = PlayerResource:GetTotalEarnedXP( pID )
                local gold = PlayerResource:GetGold( pID )
                local unspent_points = hero:GetAbilityPoints()

                -- Go through the inventory
                local items = ""
                for i=0,5 do
                    local item_i = hero:GetItemInSlot(i)
                    local item_name = "empty"
                    if item_i then
                        item_name = item_i:GetAbilityName()
                    end
                    items = items..item_name
                    if i<5 then
                        items = items..","
                    end
                end

                -- Go through the skill slots
                local ability_levels = ""
                for j=0,15 do
                    local ability = hero:GetAbilityByIndex(j)
                    local level = 0
                    if ability then
                        level = ability:GetLevel()
                    end
                    ability_levels = ability_levels..level
                    if j<15 then
                       ability_levels = ability_levels..","
                    end
                end

                print("FireGameEvent rpg_save")
                print("pID: "..pID)
                print("save_ID: "..hID)
                    print("XP: "..hero_XP )
                    print("Gold: "..gold)
                    print("Unspent Points: "..unspent_points)
                    print("Hero Items: "..items)
                    print("Ability Levels: "..ability_levels)
                    FireGameEvent( 'rpg_save', { player_ID = pID, save_ID = hID, hero_XP = hero_XP, 
                                                 gold = gold, unspent_points = unspent_points, 
                                                 hero_items = items, ability_levels = ability_levels})
                end
            end
        end
    end
end
~~~

<a name="step4"></a>
## Step 4. SaveData on ActionScript

When the UI gets loaded, add this listener for `rpg_save`:
~~~
this.gameAPI.SubscribeToGameEvent("rpg_save", this.savePlayerData);
~~~

This function will take the passed save_ID and the other arguments and store them in a JSON format. 

'modID' is your ID from http://getdotastats.com/#d2mods__my_mods.<br>"Save1" is just a generic string but it could also hold metaData info for the save.

~~~lua
public function savePlayerData(args:Object) : void {
    trace("[RPG]Saving Player Data");
			
    var pID:int = globals.Players.GetLocalPlayer();
    if (args.player_ID == pID) {
        globals.Loader_StatsCollectionRPG.movieClip.SaveData('modID', args.save_ID, 
        {     "hero_XP":args.hero_XP,
              "gold":args.gold,
              "unspent_points":args.unspent_points,
              "hero_items":args.hero_items,
              "ability_levels":args.ability_levels 
        }, "Save1", saveDataCallback);
    }
}
		
public function saveDataCallback(success:Boolean) {
    if (success) {
        trace("[RPG]Successfully saved the data for the player");
    }
    else{
        trace("[RPG]Something went wrong, save failed");
    }
}
~~~

That should be all for **Saving**. Now let's move to **Loading** those Saves and putting the values back on the picked hero.

<a name="step5"></a>
## Step 5. Sending an `rpg_load` from Lua

This step is trivial, just decide when to load and fire the game event with the player and save ID. In this example, the save is the hero ID, so on the `OnHeroInGame(hero)` just call the following function:

~~~lua
function RPGLoad( hero )
    local pID = hero:GetPlayerID()
    local hID = PlayerResource:GetSelectedHeroID( pID )
    print("FireGameEvent('rpg_load', {"..pID,hID.."})")
    FireGameEvent( 'rpg_load', { player_ID = pID , save_ID = hID})
end
~~~

<a name="step6"></a>
## Step 6. GetSave on ActionScript

Listening to `rpg_load` (should be together with the rpg_save listener):
~~~
this.gameAPI.SubscribeToGameEvent("rpg_load", this.loadPlayerData);
~~~

Replace 'modID' by your own. If there isn't a save on the save_ID, the GetSave Callback will fail and nothing else.

~~~lua
public function loadPlayerData(args:Object) : void {
    trace("[RPG]Starting to Load Player Data");
			
    // Get the player save for his heroID
    var pID:int = globals.Players.GetLocalPlayer();
    if (args.player_ID == pID) {
     trace("[RPG]Calling GetSave for player "+pID+" of heroID "+args.save_ID);
     globals.Loader_StatsCollectionRPG.movieClip.GetSave('modID', args.save_ID, playerDataCallback);
    }

    trace("[RPG]Finished Loading Player Data ");
}
~~~

Still on ActionScript, with the acquired string **we'll send the info back to Lua through a SendServerCommand**.

I've chosen "Load" as the command name, and each saved info on the JSON is separated by a space and concatenated before sending the command.

~~~lua
public function playerDataCallback(jsonData:Object) : void {
    trace("[RPG]playerDataCallback");
            
    for (var info in jsonData) {
        trace("jsonData." + info + " = " + jsonData[info]);
    }
            
    var pID:int = globals.Players.GetLocalPlayer();
    var hero_XP:int = jsonData["hero_XP"];
    var gold:int = jsonData["gold"];
    var unspent_points:int = jsonData["unspent_points"];
    var hero_items:String = jsonData["hero_items"];
    var ability_levels:String = jsonData["ability_levels"];
            
    var command:String = "Load "+pID+" "+hero_XP+" "+gold+" "
                         +unspent_points+" "+hero_items+" "+ability_levels;
    this.gameAPI.SendServerCommand(command);
    trace("[RPG]SendServerCommand "+command);            
    trace("[RPG]End playerDataCallback");
}
~~~

<a name="disclaimer"></a>
#### **Security Disclaimer** 

This raises a very important concern: What happens when someone just reads the code and figures out he just needs to write `"Load 0 100 100000 100 item_legendary,item_uber_legendary 4,4,4,4,4,4"` to get maxed instantly? But this is material for another, more complicated discussion, let's just try to get it working for now. 

<a name="step7"></a>
## Step 7. Register the Console command on Lua and recreate the values

Last section. With the received console command, load the data to the hero accordingly.

The command parameters are always strings so use `tonumber` on the single value numeric parameters. I attached an split auxiliar function at the end, which takes care of splitting strings like *"item1,item2,item3"* into a proper table that can be iterated in pairs.

~~~lua
-- Load RPG Command.
Convars:RegisterCommand( "Load", function(name, player_ID, hero_XP, gold, unspent_points, 
                                          hero_items, ability_levels)
    local cmdPlayer = Convars:GetCommandClient()
    if cmdPlayer then 
        return GameMode:LoadPlayer( cmdPlayer , tonumber(player_ID), tonumber(hero_XP),  
        			tonumber(gold), tonumber(unspent_points), hero_items, ability_levels )
    end
end, "Load GDS RPG", 0 )
~~~

I left the prints so it's easy to see what it's being loaded and compare the end result.
~~~lua
function GameMode:LoadPlayer(player,player_ID,hero_XP,gold,unspent_points, hero_items, ability_levels)
    print("============")
    print("Player ID: "..player_ID)
    print("Hero ID: "..PlayerResource:GetSelectedHeroID( player_ID ))
    print("Hero XP: "..hero_XP)
    print("Gold: "..gold)
    print("Unspent Skill Points: "..unspent_points)
    print("Hero Items: "..hero_items)
    print("Ability Levels: "..ability_levels)

    -- Load the values
    local hero = player:GetAssignedHero()

    hero:AddExperience(hero_XP, false, true)
    print("Added "..hero_XP.. " XP to put the player at level "..hero:GetLevel())

    hero:SetGold(gold, false)
    hero:SetAbilityPoints(unspent_points)

    local items = split(hero_items, ",")
    for _,item_name in pairs(items) do
        if item_name ~= "empty" then
            local newItem = CreateItem(item_name, hero, hero)
                hero:AddItem(newItem)
                newItem = nil
                print("Added "..item_name.." to this player")
            end
        end

    local levels = split(ability_levels, ",")
    for k,level in pairs(levels) do
        local ability = hero:GetAbilityByIndex(k-1)
        if ability then
            ability:SetLevel(tonumber(level))
            print("Set Level "..level.." on ability "..k..":"..ability:GetAbilityName())
        end
    end
    print("============")
end
~~~

**Split utility function**, which isn't a lua Built-In for some reason:
~~~lua
-- Lua pls
function split(inputstr, sep)
    if sep == nil then
            sep = "%s"
    end
    local t={} ; i=1
    for str in string.gmatch(inputstr, "([^"..sep.."]+)") do
            t[i] = str
            i = i + 1
    end
    return t
end
~~~

---

### List of Repositories using stat-rpg

Look here for complete examples.

* [TBR](https://github.com/Aleteh/TBR3)
* [TEvE](https://github.com/SinZ163/TEvE-2) (not really, but will be implementing it  :soon: )