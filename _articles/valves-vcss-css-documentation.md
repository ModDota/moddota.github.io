---
title: Valve's VCSS (CSS) Documentation
author: Imvoo
steamId: 76561198021806322
---

# V(alve's) CSS Sheet

## CSS w/ no description provided.
	x
	y
	z
	font
	clip
	flow-children
	padding
	padding-left
	padding-top
	padding-bottom
	padding-right
	margin
	margin-left
	margin-top
	margin-bottom
	margin-right
	transition-property
	animation
	animation-name
	animation-duration
	animation-timing-function
	animation-iteration-count
	animation-direction
	animation-delay
	align
	horizontal-align
	vertical-align
	min-width
	min-height
	max-width
	max-height
	fill
	stretch
	url( none )
	url(
	/
	auto
	%
	stretch
	repeat
	round
	space

## Unknown arguments
	down
	down-wrap
	right-wrap

## VCSS

### background-image
Comma separated list of images or movies to draw in the background. Can specify "none" to not draw a background layer. Combined with background-position, background-size and background-repeat values.

	Example: 'background-image: url("file://{images}/default.tga"), url( "file://{movies}/Background1080p.webm" );'


### background-size
Sets the horizontal and vertical dimensions used to draw the background image. Can be set in pixels, percent, "contains" to size down to panel dimensions or "auto" preserves the image aspect ratio. By default, set to "auto" which preveres the image's original size.
Multiple background layers can be specified in a comma separated list, which are then combined with background-image, background-position, and background-repeat values.

	Example: 'background-size: auto; // same as "auto auto" (default)
	Example: 'background-size: 100% 100%; // image fills the panel
	Example: 'background-size: 50% 75%; // image fills 50% of the panel's width, and 75% of the panel's height
	Example: 'background-size: 300px 200px; // image is drawn 300px wide, 200px tall


### background-position
Controls the horizontal and vertical placement of the background image, with the format: <left|center|right> <horizontal length> <top|center|bottom> <vertical length>
If length is a percent, the specified location within the image is positioned over that same specified position in the background. If the length is pixels, the top left corner is placed relative to the provided alignment keywords (left, bottom, etc.). See examples for more details.
If 1 value is specified, the other value is assumed to be center. If 2 values are specified, the first value must be for horizontal placement and the second for vertical.

	// aligns the top left corner of the image with the top left corner of the panel (default)
	Example: 'background-position: 0% 0%;
	// centers the image within the background (same as "center center")
	Example: 'background-position: center;
	// aligns the bottom right corner of the image with the bottom right corner of the panel (same as "100% 100%")
	Example: 'background-position: right bottom;
	// the top left corner of the image is placed 10px to the right of, 40px below the top left corner of the panel
	Example: 'background-position: left 10px top 40px;


### background-repeat
Controls if the background should be repeated in the horizontal and vertical directions.
Possible values per direction:
"repeat" - (default) Repeated in the specified direction until it fills the panel
"space" - Repeated as many times as required to fill the panel w/o being clipped. Space is added between images to to align first and last image with panel edges.
"round" - Repeated as many times as required to fill the panel w/o being clipped. The image is resized to align first and last image with panel edges.
"no-repeat" - Not repeated
Possible single values:
"repeat-x" - equals "repeat no-repeat"
"repeat-y" - equals "no-repeat repeat"

	Example: 'background-repeat: repeat; // equals "repeat repeat" (default)
	Example: 'background-repeat: repeat space; // repeats horizontally, spaces vertically
	Example: 'background-repeat: no-repeat round; // 1 column of images, scaled to fit evenly


### opacity-mask, opacity-mask-scroll-up, opacity-mask-scroll-down, opacity-mask-scroll-up-down
Applies an image as an opacity mask that stretches to the panel bounds and fades out it's content based on the alpha channel.
The second float value is an optional opacity value for the mask itself, the image won't interpolate/cross-fade, but you can animate the opacity to fade the mask in/out.
The -scroll-up, -scroll-down, and -scroll-up-down varients override the mask and apply only when the various vertical scroll scenarios affect the panel based on the overflow property.

	Example: 'opacity-mask: url( "file://{images}/upper_row_mask.tga" );'
	Example: 'opacity-mask: url( "file://{images}/upper_row_mask.tga" ) 0.5;'
	Example: 'opacity-mask-scroll-up: url( "file://{images}/upper_row_mask_up.tga" ) 0.5;'
	Example: 'opacity-mask-scroll-down: url( "file://{images}/upper_row_mask_down.tga" ) 0.5;'
	Example: 'opacity-mask-scroll-up-down: url( "file://{images}/upper_row_mask_up_down.tga" ) 0.5;'


### border-image, border-image-source
Shorthand for specifying all the border-image related properties at once.
Technical syntax is: <border-image-source> || <border-image-slice> [ / <border-image-width>? [ / <border-image-outset> ]? ]? || <border-image-repeat>, see the explanations for individual properties for details on each.

	Example: 'border-image: url( "file://message_border.tga" ) 25% repeat;'
	Example: 'border-image: url( "file://message_border.tga" ) 25% / 1 / 20px repeat;'
	Specifies the source image to use as the 9-slice border-image.
	Example: 'border-image-source: url( "file://message_border.tga" );'
	Example: 'border-image-source: url( "http://store.steampowered.com/public/images/steam/message_border.tga" );'

### border-image-slice
Specifies the insets for top, right, bottom, and left (in order) slice offsets to use for slicing the source image into 9 regions.  The 'fill' keyword may optionally appear before or after the length values and specifies to draw the middle region as a fill for the body background of the panel, without it the middle region will not be drawn.

	Example: 'border-image-slice: 10px 10px 10px 10px;'
	Example: 'border-image-slice: 20% 10% 20% 10% fill;'


### border-image-width
By default after slicing the image as specified in border-image-slice the 9 regions will be used to fill the space specified by the standard border-width property.  This border-image-width property may be used to override that and specify different widths.  The values appear in top, right, bottom, left order, the 2nd through 4th may be ommited and corresponding earlier values will be used.  Values may be straight floats which specify a multiple of the corresponding border-width value, a percentage (which is relative to the size of the border image in the corresponding dimension), or 'auto' which means to use the intrinsic size of the corresponding border-image-slice.

	Example: 'border-image-width: 1 1 1 1;'
	Example: 'border-image-slice: 50% 50% 50% 50%;'
	Example: 'border-image-slice: auto;'


### border-image-outset
Specifies the amount by which the border image should draw outside of the normal content/border box, this allows the border image to extend into the margin area and draw outside the panels bounds.  This may still result in clipping of the image by a parent panel if the parents bounds are too close to the edges of the panel with the border-image.  Values are specified as px or % in top, right, bottom, left order with the 2nd through 4th values optional.

	Example: 'border-image-outset: 0px;'
	Example: 'border-image-outset: 20px 20px 20px 20px;'


### border-image-repeat
Specifies how the top/right/bottom/left/middle images of the 9 slice regions are stretched to fit the available space.  Options are stretch, repeat, round or space.  Stretch/repeat are self explanatory, round means tile (repeat) but scale firstto ensure that a whole number of tiles is used with no partial tile at the edge of the space, space means tile (repeat) but add padding between tiles to ensure a whole number of tiles with no partial tile at the edge is needed.
Two values are specified, the first applies to how we stretch the top/middle/bottom horizontally to fill space, the second applies to how we stretch the left/middle/right vertically to fill space.

	Example: 'border-image-repeat: stretch stretch;'
	Example: 'border-image-outset: repeat;'
	Example: 'border-image-outset: round;'
	Example: 'border-image-outset: stetch space;'


### border-radius
Shorthand to set border radius for all corners at once.  Border radius rounds off corners of the panel, adjusting the border to smoothly round and also clipping background image/color and contents to the specified elliptical or circular values.  In this shorthand version you may specify a single value for all raddi, or horizontal / vertical separated by the '/' character.  For both horizontal and vertical you may specify 1 to 4 values in pixels or %, they will be taken in order as top-left, top-right, bottom-right, bottom-left radii values.

	// 2 px circular corners on all sides
	Example: 'border-radius: 2px;'
	// Perfect circular or elliptical panel (circular if box was square)
	Example: 'border-radius: 50% / 50%;'
	// 2 px horizontal radii 4px vertical elliptical corners on all sides
	Example: 'border-radius: 2px / 4px;'
	// All corners fully specified
	Example: 'border-radius: 2px 3px 4px 2px / 2px 3px 3px 2px;'


### border-top-left-radius
Specifies border-radius for top-left corner which rounds off border and clips background/foreground content to rounded edge.  Takes 1 or 2 values in px or %, first value is horizontal radii for elliptical corner, second is vertical radii, if only one is specified then horizontal/vertical will both be set and corner will be circular.

	Example: 'border-top-left-radius: 2px 2px;'
	Example: 'border-top-left-radius: 5%;'


### border-top-right-radius
Specifies border-radius for top-right corner which rounds off border and clips background/foreground content to rounded edge.  Takes 1 or 2 values in px or %, first value is horizontal radii for elliptical corner, second is vertical radii, if only one is specified then horizontal/vertical will both be set and corner will be circular.

	Example: 'border-top-right-radius: 2px 2px;'
	Example: 'border-top-right-radius: 5%;'


### border-bottom-right-radius
Specifies border-radius for bottom-right corner which rounds off border and clips background/foreground content to rounded edge.  Takes 1 or 2 values in px or %, first value is horizontal radii for elliptical corner, second is vertical radii, if only one is specified then horizontal/vertical will both be set and corner will be circular.

	Example: 'border-bottom-right-radius: 2px 2px;'
	Example: 'border-bottom-right-radius: 5%;'


### border-bottom-left-radius
Specifies border-radius for bottom-left corner which rounds off border and clips background/foreground content to rounded edge.  Takes 1 or 2 values in px or %, first value is horizontal radii for elliptical corner, second is vertical radii, if only one is specified then horizontal/vertical will both be set and corner will be circular.

	Example: 'border-bottom-left-radius: 2px 2px;'
	Example: 'border-bottom-left-radius: 5%;'


### border
Shorthand for setting panel border. Specify width, style, and color.  Supported styles are: solid, none.

	Example: 'border: 2px solid #111111FF;'


### border-top
Shorthand for setting the top panel border. Specify width, style, and color.  Supported styles are: solid, none.

	Example: 'border-top: 2px solid #111111FF;'


### border-right
Shorthand for setting the right panel border. Specify width, style, and color.  Supported styles are: solid, none.

	Example: 'border-right: 2px solid #111111FF;'


### border-bottom
Shorthand for setting the bottom panel border. Specify width, style, and color.  Supported styles are: solid, none.

	Example: 'border-bottom: 2px solid #111111FF;'


### border-left
Shorthand for setting the left panel border. Specify width, style, and color.  Supported styles are: solid, none.

	Example: 'border-left: 2px solid #111111FF;'


### border-color
Specifies border color for panel.  If a single color value is set it applies to all sides, if 2 are set the first is top/bottom and the second is left/right, if all four are set then they are top, right, bottom, left in order.

	Example: 'border-color: #111111FF;'
	Example: 'border-color: #FF0000FF #00FF00FF #0000FFFF #00FFFFFF;'

### border-top-color
Specifies border color for the top edge of the panel.
	Example: 'border-top-color: #111111FF;'


### border-right-color
Specifies border color for the right edge of the panel.

	Example: 'border-right-color: #111111FF;'


### border-bottom-color
Specifies border color for the bottom edge of the panel.

	Example: 'border-bottom-color: #111111FF;'


### border-left-color
Specifies border color for the left edge of the panel.

	Example: 'border-left-color: #111111FF;'


### border-width
Specifies border width for panel.  If a single width value is set it applies to all sides, if 2 are set the first is top/bottom and the second is left/right, if all four are set then they are top, right, bottom, left in order.

	Example: 'border-width: 1px;'
	Example: 'border-width: 20px 1px 20px 1px;'

### border-top-width
Specifies border width for the top edge of the panel.

	Example: 'border-top-width: 2px;'


### border-right-width
Specifies border width for the right edge of the panel.

	Example: 'border-right-width: 2px;'


### border-bottom-width
Specifies border width for the bottom edge of the panel.

	Example: 'border-bottom-width: 2px;'


### border-left-width
Specifies border width for the left edge of the panel.

	Example: 'border-left-width: 2px;'


### border-style
Extra ARGS: solid, none

Specifies border style for panel.  If a single style value is set it applies to all sides, if 2 are 
set the first is top/bottom and the second is left/right, if all four are set then they are top, right, bottom, left in order.

	Example: 'border-style: solid;'
	Example: 'border-style: solid none solid none;'


### border-top-style
Specifies border style for the top edge of the panel.

	Example: 'border-top-style: solid;'


### border-right-style
Specifies border style for the right edge of the panel.

	Example: 'border-right-style: solid;'


### border-bottom-style
Specifies border style for the bottom edge of the panel.

	Example: 'border-bottom-style: solid;'


### border-left-style
Specifies border style for the left edge of the panel.

	Example: 'border-left-style: solid;'


### transform
Sets the transforms to apply to the panel in 2d or 3d space.  You can combine various transforms (comma separated) and they will be applied in order to create a 4x4 3d transform matrix.  The possible operations are: translate3d( x, y, z), translatex( x ), translatey( y ), translatez( z ), scale3d( x, y, z), rotate3d( x, y, z ), rotatex( x ), rotatey( y ), rotatez( z ).

	Example: 'transform: translate3d( -100px, -100px, 0px );'
	Example: 'transform: rotateZ( -32deg ) rotateX( 30deg ) translate3d( 125px, 520px, 230px );'


### rect
Specifies a clip region within the panel, where contents will be clipped at render time.
This clipping has no impact on layout, and is fast and supported for transitions/animations.

	Example: rect( 10% 90% 90%, 10% );


### text-shadow
Specifies text shadows.  The shadow shape will match the text the panel can generate,and this is only meaningful for labels.  Syntax takes horizontal offset pixels, vertical offset pixels, blur radius pixels, strength, and then shadow color.

	Example: 'text-shadow: 2px 2px 8px 3.0 #333333b0'

### box-shadow
Extra ARGS: inset, fill

Specifies outer shadows for boxes, or inset shadows/glows.  The shadow shape will match the border box for the panel,so use border-radius to affect rounding.  Syntax takes optional 'inset', optional 'fill' then color, and then horizontal offset pixels, vertical offset pixels, blur radius pixels, and spread distance in pixels. Inset means the shadow is an inner shadow/glow, fill is validonly on outer shadows and means draw the shadow behind the entire box, not clipping it to outside the border area only.

	Example outer: 'box-shadow: #ffffff80 4px 4px 8px 0px'
	Example outer, filled: 'box-shadow: fill #ffffff80 4px 4px 8px 0px'
	Example inner: 'box-shadow: inset #333333b0 0px 0px 8px 12px'


### perspective-origin
Extra ARGS: invert

Sets the perspective origin which will be used when transforming children of this panel.  This can be thought of as the camera x/y position relative to the panel.

	Example: 'perspective-origin: 50% 50%'


### transform-origin
Extra ARGS: parent-relative

Sets the transform origin about which transforms will be applied.  Default is 50% 50% on the panel so a rotation/scale is centered.

	Example: 'transform-origin: 50% 50%'


### position
Sets the x, y, z position for a panel. Must not be in a flowing layout.

	Example: 'position: 3% 20px 0px'


### sound-out
Extra ARGS: "%s" (?)

Specifies a sound name to play when this selector is removed.

	Example: 'sound-out: "whoosh_out"'


### sound
Specifies a sound name to play when this selector is applied.

	Example: 'sound: "whoosh_in"'


### context-menu-arrow-position
Specifies where to point the arrow of a context menu at on this panel. The first value controls how the arrow is positioned horizontally when the context menu is to the top or bottom of the panel, and the second value controls how the arrow is positioned vertically when the context menu is to the left or right of the panel. Default is '50% 50%'.

	Example: 'context-menu-arrow-position: 25% 50%'


### context-menu-body-position
Specifies where to position the body of a context menu relative to this panel. The first value controls how the body is aligned horizontally when the context menu is to the top or bottom of the panel, and the second value controls how the body is aligned vertically when the context menu is to the left or right of the panel. 0% means left/top aligned, 50% means center/middle aligned, and 100% means right/bottom aligned. Default is '0% 0%'.

	Example: 'context-menu-body-position: 50% 100%'


### context-menu-position
Specifies where to position a context menu relative to this panel. Valid options include 'left', 'top', 'right', and 'bottom'. List up to 4 positions to determine the order that positions are tried if the context menu doesn't fully fit on screen. Default is 'right left bottom top'. If less than 4 positions are specified, the context menu first tries the opposite of the specified position along the same axis before switching to the other axis.

	Example: 'context-menu-position: bottom'
	Example: 'context-menu-position: left bottom'


### tooltip-arrow-position
Specifies where to point the arrow of a tooltip at on this panel. The first value controls how the arrow is positioned horizontally when the tooltip is to the top or bottom of the panel, and the second value controls how the arrow is positioned vertically when the tooltip is to the left or right of the panel. Default is '50% 50%'.

	Example: 'tooltip-arrow-position: 25% 50%'


### tooltip-body-position
Specifies where to position the body of a tooltip relative to this panel. The first value controls how the body is aligned horizontally when the tooltip is to the top or bottom of the panel, and the second value controls how the body is aligned vertically when the tooltip is to the left or right of the panel. 0% means left/top aligned, 50% means center/middle aligned, and 100% means right/bottom aligned. Default is '0% 0%'.

	Example: 'tooltip-body-position: 50% 100%'


### tooltip-position
Specifies where to position a tooltip relative to this panel. Valid options include 'left', 'top', 'right', and 'bottom'. List up to 4 positions to determine the order that positions are tried if the tooltip doesn't fully fit on screen. Default is 'right left bottom top'. If less than 4 positions are specified, the tooltip first tries the opposite of the specified position along the same axis before switching to the other axis.

	Example: 'tooltip-position: bottom'
	Example: 'tooltip-position: left bottom'


### transition
Extra ARGS: %s %s, %s, cubic-bezier( %1.3f, %1.3f, %1.3f, %1.3f ), infinite

Specifies which properties should transition smoothly to new values if a class/pseudo class changes the styles.  Also specifies duration, timing function, and delay.  Valid timing functions are: ease, ease-in, ease-out, ease-in-out, linear.

	Example: 'transition: position 2.0s ease-in-out 0.0s, perspective-origin 1.2s ease-in-out 0.8s;'
	Specifies which properties should transition smoothly to new values if a class/pseudo class changes the styles.
	Example: 'transition: position, transform, background-color;'


### transition-timing-function
Specifies the timing function to use for transition properties on this panel, if more than one comma delimited value is specified then the values are applied to each property specified in 'transition-property' in order.  If only one value is specified then it applies to all the properties specified in transition-property. Valid timing functions are: ease, ease-in, ease-out, ease-in-out, linear.

	Example: 'transition-timing-function: ease-in-out;'
	Example: 'transition-timing-function: ease-in-out, linear;'
	Example: 'transition-timing-function: cubic-bezier( 0.785, 0.385, 0.555, 1.505 );'


### transition-duration
Specifies the durating in seconds to use for transition properties on this panel, if more than one comma delimited value is specified then the values are applied to each property specified in 'transition-property' in order.  If only one value is specified then it applies to all the properties specified in transition-property.

	Example: 'transition-duration: 2.0s;'Example: 'transition-duration: 2.0s, 1.2s, 1.2s, 4.0s, 2.0s;'


### transition-delay
Specifies the delay in seconds to use for transition properties on this panel, if more than one comma delimited value is specified then the values are applied to each property specified in 'transition-property' in order.  If only one value is specified then it applies to all the properties specified in transition-property.

	Example: 'transition-delay: 0.0s;'Example: 'transition-delay: 0.0s, 1.2s';


### z-index
Sets the z-index for a panel, panels will be sorted and painted in order within a parent panel. The sorting first sorts by the z-pos computed from position and transforms, then if panels have matching zpos zindex is used. z-index is different than z-pos in that it doesn't affect rendering perspective, just paint/hit-test ordering. The default z-index value is 0, and any floating point value is accepted.

	Example: 'z-index: 1'


### visibility
Extra ARGS: visible, collapse

Controls if the panel is visible and is included in panel layout.

Possible values:
"visible" - panel is visible and included in layout (default)
"collapse" - panel is invisible and not included in layout


### height
Sets the height for this panel.

Possible values:
"fit-children" - Panel size is set to the required size of all children (default)
<pixels> - Any fixed pixel value (ex: "100px")
<percentage> - Percentage of parent height (ex: "100%")
"fill-parent-flow( <weight> )" - Fills to remaining parent height. If multiple children are set to this value, weight is used to determine final height. For example, if three children are set to fill-parent-flow of 1.0 and the parent is 300px tall, each child will be 100px tall. (ex: "fill-parent-flow( 1.0 )" )


### width
Sets the width for this panel.

Possible values:
"fit-children" - Panel size is set to the required size of all children (default)
<pixels> - Any fixed pixel value (ex: "100px")
<percentage> - Percentage of parent width (ex: "100%")
"fill-parent-flow( <weight> )" - Fills to remaining parent width. If multiple children are set to this value, weight is used to determine final width. For example, if three children are set to fill-parent-flow of 1.0 and the parent is 300px wide, each child will be 100px wide. (ex: "fill-parent-flow( 1.0 )" )
"height-percentage( <percentage> )" - Percentage of the panel's height, which allows you to enforce a particular aspect ratio.  The height cannot also be width-percentage.
"width-percentage( <percentage> )" - Percentage of the panel's width, which allows you to enforce a particular aspect ratio.  The width cannot also be height-percentage.


### background-color
Sets the background fill color/gradient/combination for a panel.

	Example: 'background-color: #FFFFFFFF;'
	Example: 'background-color: gradient( linear, 0% 0%, 0% 100%, from( #fbfbfbff ), to( #c0c0c0c0 ) );'
	Example: 'background-color: gradient( linear, 0% 0%, 0% 100%, from( #fbfbfbff ), color-stop( 0.3, #ebebebff ), to( #c0c0c0c0 ) );'
	Example: 'background-color: gradient( radial, 50% 50%, 0% 0%, 80% 80%, from( #00ff00ff ), to( #0000ffff ) );'
	Example: 'background-color: #0d1c22ff, gradient( radial, 100% -0%, 100px -40px, 320% 270%, from( #3a464bff ), color-stop( 0.23, #0d1c22ff ), to( #0d1c22ff ) );'


### perspective
Sets the perspective depth space available for children of the panel.  Default of 1000 would mean that children at 1000px zpos are right at the viewers eye, -1000px are just out of view distance faded to nothing.

	Example: 'perspective: 1000'


### color
Sets the foreground fill color/gradient/combination for a panel.  This color is the color used to render text within the panel.

	Example: 'color: #FFFFFFFF;'
	Example: 'color: gradient( linear, 0% 0%, 0% 100%, from( #cbcbcbff ), to( #a0a0a0a0 ) );'


### line-height
Specifies the line height (distance between top edge of line above and line below) to use for text.  By default this is unset and a value that matches the font-size reasonably will be used automatically.

	Example: 'line-height: 20px;'


### texture-sampling
Extra ARGS: alpha-only

Controls texture sampling mode for the panel. Set to alpha-only to use the textures alpha data across all 3 color channels.

	Example: 'texture-sampling: normal;'
	Example: 'texture-sampling: alpha-only;'


### -s2-mix-blend-mode
Extra ARGS: multiply, screen

Controls blending mode for the panel.  See CSS mix-blend-mode docs on web, except normal for us is with alpha blending.

	Example: '-s2-mix-blend-mode: normal;'
	Example: '-s2-mix-blend-mode: multiply;'
	Example: '-s2-mix-blend-mode: screen;'


### text-overflow
Extra ARGS: ellipsis

Controls truncation of text that doesn't fit in a panel.  "clip" means to simply truncate (on char boundaries), "ellipsis" means to end with '...'.
We default to ellipsis, which is contrary to the normal CSS spec.

	Example: 'text-overflow: ellipsis;'
	Example: 'text-overflow: clip;'


### white-space
Extra ARGS: nowrap

Controls white-space wrapping on rendered text.  "normal" means wrap on whitespace, "nowrap" means do no wrapping at all.

	Example: 'white-space: normal;'
	Example: 'white-space: nowrap;'


### letter-spacing
Sets letter-spacing for text in a string.

Possible values:
normal - no manual spacing
<pixels> - Any fixed pixel value (ex: "1px")


### text-align
Specifies the text alignment for text within this panel, defaults to left.

	Example: 'text-align: left;'
	Example: 'text-align: right;'
	Example: 'text-align: center;'


### text-transform
Specifies the transform for text within this panel, defaults to none. Possible values: none, uppercase, lowercase.

	Example: 'text-transform: uppercase;'


### text-decoration
Specifies the decoration for text within this panel, defaults to none. Possible values: none, underline, line-through.

	Example: 'text-decoration: underline;'


### font-family
Specifies the font face to use.

	Example: 'font-family: Arial;'
	Example: 'font-family: "Comic Sans MS";'


### font-size
Specifies the target font face height in pixels.

	Example: 'font-size: 12;'


### font-weight
Specifies the font weight to use. Supported values are light, thin, normal, medium, bold, and black.

	Example: 'font-weight: normal;'
	Example: 'font-weight: bold;'
	Example: 'font-weight: thin;'


### font-style
Extra ARGS: %s %s, italic

Specifies the font style to use. Supported values are normal, and italic

	Example: 'font-style: normal;'


### overflow
Extra ARGS: squish, scroll, noclip

Specifies what to do with contents that overflow the available space for the panel.

Possible values:
"squish" - Children are squished to fit within the panel's bounds if needed (default)
"clip" - Children maintain their desired size but their contents are clipped
"scroll" - Children maintain their desired size and a scrollbar is added to this panel


	Example: 'overflow: squish squish;' // squishes contents in horizontal and vertical directions
	Example: 'overflow: squish scroll;' // scrolls contents in the Y direction


### pre-transform-rotate2d
Sets 2 dimensional rotation degrees that apply to the quad for this panel prior to 3 dimensional transforms.This rotation applies without perspective and leaves the panel centered at the same spot as it started.

	Example: 'pre-transform-rotate2d: 45deg'


### pre-transform-scale2d
Sets 2 dimensional X/Y scale factors that apply to the quad for this panel prior to 3 dimensional transforms.This scaling applies without perspective and leaves the panel centered at the same spot as it started.Default of 1.0 means no scaling, 0.5 would be half size.

	Example: 'pre-transform-scale2d: 0.8'
	Example: 'pre-transform-scale2d: 0.4, 0.6'


### blur
Extra ARGS: gaussian(...

Sets the amount of blur to apply to the panel and all it's children during composition.  Default is no blur, for now Gaussian is the only blur type and takes a horizontal standard deviation, vertical standard deviation, and number of passes.  Good std deviation values are around 0-10, if 10 is still not intense enough consider more passes, but more than one pass is bad for perf.  As shorthand you can specify with just one value, which will be used for the standard deviation in both directions and 1 pass will be set.

	Example: 'blur: gaussian( 2.5 );'
	Example: 'blur: gaussian( 6, 6, 1 );'

### wash-color
Specifies a 'wash' color, which means a color that will be blended over the panel and all it's children at composition time, tinting them.  The alpha value of the color determines the intensity of the tinting.

	Example: 'wash-color: #39b0d325'


### desaturation
Sets the amount of desaturation to apply to the panel and all it's children during composition.  Default of 0.0 means no adjustment, 1.0 means fully desaturated to gray scale.

	Example: 'desaturation: 0.6'


### opacity
Sets the opacity or amount of transparency applied to the panel and all it's children during composition.  Default of 1.0 means fully opaque, 0.0 means fully transparent.

	Example: 'opacity: 0.8'
