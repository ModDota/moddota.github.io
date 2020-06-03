---
title: Making skip/clip blocks out of models
author: Noya
steamId: '76561198046984233'
date: 27.06.2015
---

This is the quickest but one very useful tip for Hammer map design. 

When you drag a prop model into the map, it won't have any collision, so if you want heroes to walk over it or be blocked by it, you need to add a skip or clip block. You could make a very raw block like a neanderthal, but there is a better way that will maintain every edge on the model:

1. Copy Paste Special (Ctrl+Shift+V with the model selected)
2. Selected props -> Convert into Editable Mesh (Ctrl+Shift+T with the newly selected pasted model)
3. Apply material (Shift+T)

<Gfycat id="RemarkableWetDotterel" />

That's it.

<Gfycat id="CarefreeScarceEthiopianwolf" />

Thanks BMD for the gyfs
