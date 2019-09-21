---
title: Asset File Type Reference
author: Noya
steamId: 76561198046984233
date: 28.05.2015
category: Assets
---

This list contains all the info for asset types with its related tools & guides explaining the formats.

Type | .Extension | S1 Equivalent | Info, Format, Decompiler
--|--|--|
Animation|vanim|smd|*.smd* files are added to a *.vmdl* through the Model Editor to make *.vanim* files.
Animation Sequence|vgarp|?|??
Map|vmap|vmf|Hammer Files.<br>No decompiler known to humans yet, but it is rumored that a magical penguin is working on it 
Material|vmat|vmt|Made with .tga files in the Material Editor.<br> Decompiler: [S2DC](https://moddota.com/forums/discussion/264/source-2-decompiler)
Model|vmdl|mdl|Decompilation Guide: [MDL to VMDL Conversion](/articles/mdl-to-vmdl-conversion)
Mesh|vmesh|smd,dmx,fbx|Defines the shape of a model.<br>Loaded to the Model editor to make a new model.
Particle|vpcf|pcf|Decompiler: [S2DC](https://moddota.com/forums/discussion/264/source-2-decompiler)<br>No method yet known for PCF to VPCF conversion.
Sound|vsnd|wav|Takes wav/mp3 files and converts them to this file through a *.vsndevts*
Sound Event|vsndevts|txt|[Sound Editor](https://github.com/pingzing/dota2-sound-editor) reads the Source 1 strings which are identical to the ones used in Source 2.<br>Guide: [Adding and playing Custom Sounds](/articles/adding-and-playing-custom-sounds)
Texture|vtex|vtx|Compiled out of .tga files.<br>Compiler/Decompiler: [ModKit](https://github.com/Myll/Dota-2-ModKit/releases)<br>Guide: [Extracting and Compiling VTEX files](http://moddota.com/forums/discussion/85/extracting-and-compiling-vtex-files)

It will be updated as we get more knowledge and build more tools for file decompiling and conversion.