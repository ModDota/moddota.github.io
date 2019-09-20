---
title: 3rd-person view and control method
author: Aerohand
steamId: 76561198072158954
category: general
---

Hello everyone. Today I will introduce your guys the way to make a 3rd-person view mod in dota2 workshop tool.
You will need some basic knowledge to understand this tutorial.

The final demo would be like this:

{% include gfycat.html id="MessySilverKarakul" %}

You would also find my work of this in steam workshop which name is Speed Racing.
http://steamcommunity.com/sharedfiles/filedetails/?id=370771264

Ok. The first thing I will introduce you is control the camera in dota2. Although the API for camera lock is broken, we still could use the as3 to make the camera lock. 

You could contact Noya for the camera control swf he used in warchaser. [Here's the link to it](https://github.com/MNoya/Warchasers/blob/master/resource/flash3/CameraLock.swf)

After we successfully lock our hero to stay at the middle of our screen, we need to slightly change the camera to make it a little bit lower. The code I use is sending some command to console. Here is the code:

~~~lua
       SendToConsole("dota_camera_pitch_max 25")
       SendToConsole("r_farz 6000")
~~~
You guys could modify these two numbers to do more fancy stuff.

Another thing to handle is the keyboard listener. This part is also done console command.
Here's the example from speed racing. It contains four arrow keys and space key.

~~~lua
       SendToConsole("unbindall");
       SendToConsole("alias \"+move_left\" \"LeftWalking\"");
       SendToConsole("alias \"-move_left\" \"LeftWalkingDone\"");
       SendToConsole("alias \"+move_right\" \"RightWalking\"");
       SendToConsole("alias \"-move_right\" \"RightWalkingDone\"");
       SendToConsole("bind leftarrow +move_left");
       SendToConsole("bind rightarrow +move_right");

       SendToConsole("alias \"+move_up\" \"UpWalking\"");
       SendToConsole("alias \"-move_up\" \"UpWalkingDone\"");
       SendToConsole("alias \"+move_down\" \"DownWalking\"");
       SendToConsole("alias \"-move_down\" \"DownWalkingDone\"");
       SendToConsole("bind uparrow +move_up");
       SendToConsole("bind downarrow +move_down");
       
       SendToConsole("alias \"+gasoline\" \"GasolineAcc\"");
       SendToConsole("alias \"-gasoline\" \"GasolineAccDone\""); 
       SendToConsole("bind space +gasoline");
~~~
Through these we are able to bind keys to different functions. For example, when left arrow key is pressed, LeftWalking will be activated (only once per time you press), and when you release it, LeftWalkingDone would be activated. I make a flag in both functions to detect the current state of the command. This would also be a pipeline program which could handle different key activation at the same time. Here is the code I made for turning left and right. To make it more nature to human's sense of control, I use a queue and a pointer to show the current state. (like after pressing left, without releasing, you press right, the queue will move to right and if u release right, the queue will turn back to left)

~~~lua
--start walking
function jajajaGameMode:WalkingLeft(player)
  print("get walking left!")
  local pid=player:GetPlayerID()
  local layer=ps[pid][6]
  --current queue point to left
  ps[pid][1][layer]=1
  --pointer++
  ps[pid][6]=ps[pid][6]+1
end

function jajajaGameMode:WalkingRight(player)
  print("get walking right!")
  local pid=player:GetPlayerID()
  local layer=ps[pid][6]
  ps[pid][1][layer]=2
  ps[pid][6]=ps[pid][6]+1
end

--end walking
function jajajaGameMode:WalkingUpDone(player)
  ps[player:GetPlayerID()][7]=0
end

function jajajaGameMode:WalkingDownDone(player)
  ps[player:GetPlayerID()][7]=0
end
~~~

The final part is make the camera yaw to show correctly. Here is the core function of this part. a is the initial unit vector of your hero(in this case it is (1,0)) and ps[pid][5] is the current unit vector of your hero. This function is called 10 times per sec to make sure everything looks fine. 

~~~lua
function view(a,pid)
  pvalue=-math.deg(math.atan(ps[pid][5].y/ps[pid][5].x)-math.atan(a.y/a.x))

 if a.x<0 then
   pvalue=pvalue+180
 end

 SendToConsole("dota_camera_yaw "..tostring(pvalue)) 
end
~~~

The complete code will be available soon since the map is not finished. If you have any questions, feel free to ask me! 

