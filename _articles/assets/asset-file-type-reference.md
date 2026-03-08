---
title: Asset File Type Reference
author: Noya
steamId: '76561198046984233'
date: 28.05.2015
---

# Asset File Type Reference

This list contains all the info for asset types with their related tools & guides explaining the formats.

| Type               | .Extension | S1 Equivalent | Info, Format, Decompiler                                                                                                                                                                                  |
| ------------------ | ---------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Animation          | vanim      | smd           | _.smd_ files are added to a _.vmdl_ through the Model Editor to make _.vanim_ files.                                                                                                                      |
| Animation Sequence | vgarp      | ?             | ??                                                                                                                                                                                                        |
| Map                | vmap       | vmf           | Hammer Files.<br />No decompiler known to humans yet, but it is rumored that a magical penguin is working on it.                                                                                          |
| Material           | vmat       | vmt           | Made with .tga files in the Material Editor.<br /> Decompiler: [S2V](https://s2v.app/)                                                                                                                    |
| Model              | vmdl       | mdl           | Decompilation Guide: [MDL to VMDL Conversion](models/mdl-to-vmdl-conversion)                                                                                                                              |
| Mesh               | vmesh      | smd,dmx,fbx   | Defines the shape of a model.<br />Loaded to the Model editor to make a new model.                                                                                                                        |
| Particle           | vpcf       | pcf           | Decompiler: [S2V](https://s2v.app/)<br />No method yet known for PCF to VPCF conversion.                                                                                                                  |
| Sound              | vsnd       | wav           | Takes wav/mp3 files and converts them to this file through a _.vsndevts_                                                                                                                                  |
| Sound Event        | vsndevts   | txt           | [Sound Editor](https://github.com/pingzing/dota2-sound-editor) reads the Source 1 strings which are identical to the ones used in Source 2.<br />Guide: [Adding and playing Custom Sounds](custom-sounds) |
| Texture            | vtex       | vtx           | Compiled out of .tga files.<br />Guide: [Extracting and Compiling VTEX files](/assets/extracting-and-compiling-vtex-files)                                                                                |

Most Source 2 formats can be decompiled with [Source 2 Viewer](https://s2v.app/).

It will be updated as we get more knowledge and build more tools for file decompiling and conversion.
