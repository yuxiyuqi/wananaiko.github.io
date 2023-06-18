---
title: "Installation | Update"
summary: Read Install and Update instructions here
date: 2021-01-20
author: "Aditya Telange"
TocSide: left
draft: true	
---

Installing requirements for Web UI 安装失败的时候，记得关掉梯子试试。

Prompt：先将中文翻译为英文，再通过网站：https://clio.so/ 生成优化后的 prompt。

如果生成的照片风格比较喜欢，将照片通过 “图片信息” 查看对应的种子seed，后面再生成的时候可以尝试在该seed数字上逐步加1。

尽量不开启 “高清修复”，开启后的生成速度会降慢。

采样迭代步数(Steps) 建议设置 28 以上。

可以同时使用多个模型，通过类似 `<lora:koreanDollLikeness_v15:0.1>,  <lora:chilloutmixss_xss10:0.9>,`的方式分配权重。

根据不同的模型，多尝试调整一些参数以达到满意的效果。

---

NSFW 参数

Euler a , Steps 40 , 512*768  

```
<lora:taiwanDollLikeness_v10:0.25>, <lora:chilloutmixss_xss10:0.55>, <lora:guofeng3Lora_v32Lora:0.2>,((photorealistic:1.4)), nsfw, best quality, masterpiece, illustration, an extremely delicate and beautiful, (CG:1.2),extremely detailed , ,unity ,8k wallpaper, Amazing, finely detail,best quality,official art, incredibly absurdres,ultra-detailed, highres, extremely detailed, 1girl, masterpiece, all fours,breasts, veins, milk, dark hair, nsfw, spread legs, tifa_lockhart, beautiful detailed girl, extremely detailed eyes and face, beautiful detailed black eyes, light on face, cinematic lighting, 
```

```
(worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), acnes, skin blemishes, bad anatomy,(long hair:1.4),DeepNegative,(fat:1.2),facing away, looking away,tilted head, lowres,bad anatomy,bad hands, text, error, missing fingers,extra digit, fewer digits, cropped, worstquality, low quality, normal quality,jpegartifacts,signature, watermark, username,blurry,bad feet,cropped,poorly drawn hands,poorly drawn face,mutation,deformed,worst quality,low quality,normal quality,jpeg artifacts,signature,watermark,extra fingers,fewer digits,extra limbs,extra arms,extra legs,malformed limbs,fused fingers,too many fingers,long neck,cross-eyed,mutated hands,polar lowres,bad body,bad proportions,gross proportions,text,error,missing fingers,missing arms,missing legs,extra digit, extra arms, extra leg, extra foot,
```

