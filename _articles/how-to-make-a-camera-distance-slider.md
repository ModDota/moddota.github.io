---
title: How To Make a Camera Distance Slider
author: Myll
steamId: 76561198000729788
category: general
---

There were a lot of WC3 mods that had a camera setting you can set like this: `-cam xxxx`. In this short guide, I'll show you how to add a camera distance slider to your mod. I assume that you've done some basic flash on your mod already, and know how to create MovieClips and TextFields. If you don't, please go through [this guide first.](http://yrrep.me/dota/dota-ui-flash.html)

{% include gfycat.html id="LeanTenderAvocet" %}

### 1. Create TextFields and MovieClips

![](http://i.imgur.com/YEUXbN7.png)

The white rectangle is a MovieClip, and the rest are TextFields. Here are the instance names to better read the AS3 code:

* White rectangle is `camDistSlider`
* "Camera Distance" is `camDistLabel`
* "Current Distance" is `currDistLabel`
* The TextFields for the min and max values aren't referenced.

### 2. Actionscript code ([pastebin](http://pastebin.com/WGugXkCL))

~~~lua
package  {
	import flash.display.MovieClip;
	import scaleform.clik.events.*;
	import flash.utils.getDefinitionByName;
	import flash.events.*; 

	import ValveLib.*;
	import flash.text.TextFormat;
	
	//import some stuff from the valve lib
	import ValveLib.Globals;
	import ValveLib.ResizeManager;
	
	public class Options extends MovieClip {
		
		public var gameAPI:Object
		public var globals:Object
		var _camDistSlider:Object
		var currCamDist:int = 2000
		var currDistLabelT:String // currDistLabel translated

		public function Options() {
			// constructor code
		}
		
		//set initialise this instance's gameAPI
		public function setup(api:Object, globals:Object) {
			this.gameAPI = api;
			this.globals = globals;
			
			// set this to at least 2000 above the max slider value.
			// it's necessary for the game to render properly while zooming
			Globals.instance.GameInterface.SetConvar("r_farz", "6000")

			addEventListener(Event.ENTER_FRAME, myEnterFrame)

			camDistLabel.text = Globals.instance.GameInterface.Translate("#CamDistLabel")
			currDistLabelT = Globals.instance.GameInterface.Translate("#CurrDistLabel")
			currDistLabel.text = currDistLabelT
			yourSettingsWill.text = Globals.instance.GameInterface.Translate("#YourSettingsWill")

			_camDistSlider = replaceWithValveComponent(camDistSlider, "Slider_New", true)
			_camDistSlider.minimum = 900
			_camDistSlider.maximum = 4000
			_camDistSlider.value = 2000
			_camDistSlider.snapInterval = 50
			_camDistSlider.addEventListener( SliderEvent.VALUE_CHANGE, onCamDistSliderChanged )

			trace("##Called Options Setup!");
		}

		public function onCamDistSliderChanged(e:SliderEvent) {
			var currVal:int = _camDistSlider.value
			trace("Current value: " + currVal)
			currCamDist = currVal
		}

		private function myEnterFrame(e:Event) : void {
			//trace("myEnterFrame Options")
			Globals.instance.GameInterface.SetConvar("dota_camera_distance", currCamDist.toString())
			currDistLabel.text = currDistLabelT + " " + currCamDist
		}

		//Parameters: 
		//	mc - The movieclip to replace
		//	type - The name of the class you want to replace with
		//	keepDimensions - Resize from default dimensions to the dimensions of mc (optional, false by default)
		public function replaceWithValveComponent(mc:MovieClip, type:String, keepDimensions:Boolean = false) : MovieClip {
			var parent = mc.parent;
			var oldx = mc.x;
			var oldy = mc.y;
			var oldwidth = mc.width;
			var oldheight = mc.height;
			
			var newObjectClass = getDefinitionByName(type);
			var newObject = new newObjectClass();
			newObject.x = oldx;
			newObject.y = oldy;
			if (keepDimensions) {
				newObject.width = oldwidth;
				newObject.height = oldheight;
			}
			
			parent.removeChild(mc);
			parent.addChild(newObject);
			
			return newObject;
		}

		//onScreenResize
		public function screenResize(stageW:int, stageH:int, xScale:Number, yScale:Number, wide:Boolean) {
			
		}
	}	
}
~~~

For `Globals.instance.GameInterface.Translate`, make sure to reference the keys in your `addon_english.txt`:

~~~
"CamDistLabel"					"Camera Distance:"
"CurrDistLabel"					"Current Distance:"
"YourSettingsWill"				"Your settings will automatically be saved for future Dota Strikers games."
~~~

An important thing to note is we're using an ENTER_FRAME event. This is because of the current replication issue in Dota. If the host changes his camera distance, all the clients will have their camera distance changed to the host's. So, the ENTER_FRAME will ensure that the client immediately reverts back to his set camera distance if the host ever changes his. If Valve fixes the replication issue, this won't be necessary.

Also, you'll probably notice that your map looks washed out at high zoom levels, due to the fog. To fix this, you can either edit your env_fog_controller entity in your vmap and completely disable the fog by unchecking "Enable Fog" in the parameters, or you can try tweaking the values. You can also completely disable the fog by putting this code snippet in: `Globals.instance.GameInterface.SetConvar("fog_enable", "0")`. I'm not aware of a way to dynamically change the parameters of env_fog_controller, unfortunately.

Regarding saving the camera distance value for future games: You can save a KV file on the player's computer with `Globals.instance.GameInterface.SaveKVFile`. Example (ty BMD):

`Globals.instance.GameInterface.SaveKVFile(options, 'resource/flash3/youraddon_options.kv', 'Options');`

* options is an AS3 table {}
* The 2nd parameter is where to put it
* The third is the top-level key name, doesn't really matter

Let me know if you have any questions!