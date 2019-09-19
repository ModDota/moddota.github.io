---
title: Importing custom model into the map without any cosmetics
author: kritth
steamId: 76561198055627364
---

<p>Many people probably have the idea of using custom models into the map but having a hard time with importing models into the engine, importing animation for the models, importing texture for the model, creating up your hero without cosmetic problem, and especially, doing this with .mdx format which is originally from Warcraft 3 since many people seems to want to port maps from warcraft 3 to source 2. Here is the tutorial on how to do so.</p>
<p>This tutorial will mainly focus on importing .mdx to source 2 engine for hero's use. But the steps are also usable with other models, units, and extensions as well if it has base model and animation ready. If you have any suggestion, question or improvement to this tutorial, do not hesitate send me a message or leave a comment.</p>
<h2>Credits:</h2>
<p>- Dun1007, on importing mdx to source 2<br>
- Tailer007, for the model in this example (not sure who was the original modeler)<br>
- BMD, for his timers' file</p>

<h2>Required materials:</h2>
<p>- Dota 2<br>
- Dota 2 Workshop Tools Alpha<br>
- 3ds max<br>
- timers.lua, can be found <a href="https://github.com/bmddota/barebones/blob/source2/game/dota_addons/barebones/scripts/vscripts/timers.lua">here</a><br>
- model, in this example, I will use Asuna from SAO in this link. <a href = "http://api.viglink.com/api/click?format=go&jsonp=vglnk_14224047875778&drKey=1082&libId=fca55403-b124-4a6f-b0f3-ffaf43c9ed30&loc=http%3A%2F%2Fchaosrealm.info%2Ftopic%2F10759280%2F5%2F&v=1&out=http%3A%2F%2Fz5.ifrm.com%2F30005%2F144%2F0%2Fp1230621%2FAsunaV1.rar&ref=http%3A%2F%2Fchaosrealm.info%2Ftopic%2F10759280%2F4%2F&title=Tailer%27s%20Tailored%20Models&txt=%3Cimg%20src%3D%22http%3A%2F%2Fz5.ifrm.com%2F30005%2F144%2F0%2Fp1232295%2Fdl_but.png%22%20alt%3D%22Attachments%3A%22%3E%20AsunaV1.rar%20(146.95%20KB)">Click here</a><br>
- impexpmdx_v2.0.4.ms, this is only required for .mdx format<br>
- Warcraft 3 Model editor, this is only required for .mdx format, can get via this <a href = "http://www.hiveworkshop.com/forums/tools-560/war3-model-editor-62876/">link</a><br>
- GCFScape, for opening the vpk file</p>

<h2>Table of Contents</h2>
Step 1: [Preparation for mdx format](#step_one)<br>
Step 2: [3ds max importing and exporting](#step_two)<br>
Step 3: [Getting the textures](#step_three)<br>
Step 4: [Setting up for Source 2 Model Editor](#step_four)<br>
Step 5: [Setting up material](#step_five)<br>
Step 6: [Setting up the base model](#step_six)<br>
Step 7: [Importing Animation](#step_seven)<br>
Step 8: [Attachment Points](#step_eight)<br>
Step 9: [Different approaches on Scripting and its pros and cons](#step_nine)<br>
Step 10-1A: [Space Optimization Part one: Preparing KV Files](#step_ten_one_a)<br>
Step 10-1B: [Space Optimization Part two: Lua scripting](#step_ten_one_b)<br>
Step 10-2: [Performance-based](#step_ten_two)<br>

<p><b>Note: You don't need to go beyond step 8 if your model will not be used as a hero.</h></p>