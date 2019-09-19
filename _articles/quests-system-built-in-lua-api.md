---
title: Quests System (Built-In Lua API)
author: Noya
steamId: 76561198046984233
---

This is a tutorial on how to use the quest system which comes by default with the game, used on the tutorials and the holdout map.

Keep in mind that this system is pretty limited, as it's not player-based but global, and its UI is pretty limited (doesn't like having more than a couple quests, offers no way of declining them, etc). That being said, there's 2 basic applications in which it's very useful for cooperative game modes:

1. Limited Time quests, **"Accomplish this before X time"**
2. Increasing counter quests, **"Kill/Get X of this"**

The first one will be a decreasing timer, while the second requires triggering when the counter has to be increased.

### Example 1

Survive for 30 seconds

[gfy PastelAnnualAnnashummingbird]

First initialize the Quest Entity whenever its supposed to start (could be stepping on a trigger box, killing certain unit, etc)
~~~
Quest = SpawnEntityFromTableSynchronous( "quest", { name = "QuestName", title = "#QuestTimer" } )
~~~

The title and strings required goes in resource/addon_english.txt:

~~~
"QuestTimer"	"Survive for %quest_current_value% seconds"
~~~

Set a Time to Finish the quest, 30 seconds in this example
~~~
Quest.EndTime = 30 
~~~

Initialize the sub Quest with its bar
~~~
subQuest = SpawnEntityFromTableSynchronous( "subquest_base", { 
           show_progress_bar = true, 
           progress_bar_hue_shift = -119 
         } )
~~~

Tie the subQuest to the Quest Entity
~~~
Quest:AddSubquest( subQuest )
~~~

Set the Text Values
~~~
-- text on the quest timer at start
Quest:SetTextReplaceValue( QUEST_TEXT_REPLACE_VALUE_CURRENT_VALUE, 30 )
Quest:SetTextReplaceValue( QUEST_TEXT_REPLACE_VALUE_TARGET_VALUE, 30 )

-- value on the bar
subQuest:SetTextReplaceValue( SUBQUEST_TEXT_REPLACE_VALUE_CURRENT_VALUE, 30 )
subQuest:SetTextReplaceValue( SUBQUEST_TEXT_REPLACE_VALUE_TARGET_VALUE, 30 )
~~~

Timer to decrease the bar ever second, updating text and bar
~~~lua
Timers:CreateTimer(1, function()
    Quest.EndTime = Quest.EndTime - 1
    Quest:SetTextReplaceValue( QUEST_TEXT_REPLACE_VALUE_CURRENT_VALUE, Quest.EndTime )
    subQuest:SetTextReplaceValue( QUEST_TEXT_REPLACE_VALUE_CURRENT_VALUE, Quest.EndTime )
    
    -- Finish the quest when the time is up  
    if Quest.EndTime == 0 then 
        EmitGlobalSound("Tutorial.Quest.complete_01") -- Part of game_sounds_music_tutorial
        Quest:CompleteQuest()
        return
    else
        return 1 -- Call again every second
    end
end)
~~~

### Example 2

Kill some Kobold-units (many types of the same kobold count as 1)

[gfy EarlyEvenAtlanticsharpnosepuffer]

Listener
~~~
ListenToGameEvent( "entity_killed", Dynamic_Wrap( GameMode, "OnEntityKilled" ), self )
~~~

Quest Initial configuration. Use the GameRules handle (or *self*) for stuff to be visible anywhere.
~~~
GameRules.Quest = SpawnEntityFromTableSynchronous( "quest", {
		name = "QuestName",
		title = "#QuestKill"
	})
GameRules.subQuest = SpawnEntityFromTableSynchronous( "subquest_base", {
	show_progress_bar = true,
	progress_bar_hue_shift = -119
} )
GameRules.Quest.UnitsKilled = 0
GameRules.Quest.KillLimit = 10
GameRules.Quest:AddSubquest( GameRules.subQuest )

-- text on the quest timer at start
GameRules.Quest:SetTextReplaceValue( QUEST_TEXT_REPLACE_VALUE_CURRENT_VALUE, 0 )
GameRules.Quest:SetTextReplaceValue( QUEST_TEXT_REPLACE_VALUE_TARGET_VALUE, GameRules.Quest.KillLimit )

-- value on the bar
GameRules.subQuest:SetTextReplaceValue( SUBQUEST_TEXT_REPLACE_VALUE_CURRENT_VALUE, 0 )
GameRules.subQuest:SetTextReplaceValue( SUBQUEST_TEXT_REPLACE_VALUE_TARGET_VALUE, GameRules.Quest.KillLimit )
~~~


Text on addon_english.txt
~~~
"QuestKill" "Kill dem Kobolds. (%quest_current_value%/%quest_target_value%)"
~~~

Every time a unit dies, check if it meets the condition and update the quest if so
~~~lua
function GameMode:OnEntityKilled( event )
    local killedUnit = EntIndexToHScript( event.entindex_killed )

    if killedUnit and string.find(killedUnit:GetUnitName(), "kobold") then
    	-- Fill the quest bar and substract one from the quest remaining text
        GameRules.Quest.UnitsKilled = GameRules.Quest.UnitsKilled + 1
        GameRules.Quest:SetTextReplaceValue(QUEST_TEXT_REPLACE_VALUE_CURRENT_VALUE, GameRules.Quest.UnitsKilled)
        GameRules.subQuest:SetTextReplaceValue( SUBQUEST_TEXT_REPLACE_VALUE_CURRENT_VALUE, GameRules.Quest.UnitsKilled )
        
        -- Check if quest completed 
        if GameRules.Quest.UnitsKilled >= GameRules.Quest.KillLimit then
            GameRules.Quest:CompleteQuest()
        end
   end
end
~~~

### Notes

You can have multiple quests and make quests without subQuest bars too

![img](http://puu.sh/hY5kO/dd9c3a5cba.jpg)

The max amount of quests that can be activated at any point is 5 :residentsleeper: <br>Those can also have bars, so it's not a size limitation but some questionable design choice:

![img](http://puu.sh/hY5RQ/300360728a.jpg)

---

If you know of better examples or uses of this built-in system please post them here.