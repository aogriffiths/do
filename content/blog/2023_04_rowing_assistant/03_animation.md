---
title: Rowing Assistant - Animation for a neopixel display
description: Creating and animated gif from a video, for a neopixel display
date: 2023-04-27
tags: rowing assistant
---

Coxles four
https://www.youtube.com/watch?v=r7Qe3e2rb0U

Options
2:20-2:35 - from above
2:46-2:50 - side close up
3:12-3:17 - side close up moving
3:36-3:40 - side / backgournd not ideal
3:52-3:58 - side / fairly good background
4:26-4:32 - above side on (stationary camera)
5:05-5:08 - My final chocie
5:20-5:24 - My original choice but image was too small and blurly in the end

Download some of the rounding video e.g. 5:10-5:25




```
ffmpeg -y -i original.webm  -vf "drawtext=text='%{n}. %{pts\:hms}':fontsize=32:fontcolor=white:box=1:boxborderw=6:boxcolor=black@0.75:x=(w-text_w)/2:y=h-text_h-20, drawgrid=w=iw/16:h=ih/12:t=1:c=white@0.5" -g 1 -c:a copy  step1_timestamped.mp4
ffplay  step1_timestamped.mp4
```

Open in the vlc media player and use the hotkeys:

ffplay 

left arrow ...... 10 seconds backwards
right arrow ..... 10 seconds forward
up arrow ........  1 minute  backwards
down arrow ......  1 minute  forwards
page down ....... 10 minutes backwards
page up ......... 10 minutes forward
s ............... Step to the next frame

Find the exact start and finish of the clip you want

Start of stroke
153. 00:00:08.446 < read for catch
154. 00:00:08.486
155. 00:00:08.526 < touches water
156. 00:00:08.566 

End of stroke
189. 00:00:09.886
190. 00:00:09.926
191. 00:00:09.966 < touches water
192. 00:00:10.006 

So we want 00:00:08.526 to 00:00:09.926, which is 00:00:08.566 for 00:00:01.4

3. STEP 3
=========
Next lets crop to the area of interest, the grid lines help here 11 horizontal, 7 vertical 3x3 

```
VIDEOSS=00:00:08.526
VIDEOT=00:00:01.44
SHIFT=6
ffmpeg -y -i original.webm -i original.webm  -ss $VIDEOSS -t $VIDEOT -filter_complex "crop=iw*3/16:ih*3/12:iw*11/16:ih*7/12, [0:v]overlay=0:100+t*$SHIFT, drawgrid=w=iw/16:h=ih/12:t=1:c=white@0.5" -c:a copy  test2.mp4
ffplay -loop 0 test2.mp4
```

playing arround with that (luckly all I reall needed was to adjust the `7.4` in `t*7.4`)



```
ffmpeg -y -i original.webm -i original.webm  -ss $VIDEOSS -t $VIDEOT -filter_complex "crop=iw*3/16:ih*3/12:iw*11/16:ih*7/12, [0:v]overlay=0:100+t*7.4, drawbox=x=30:y=185:w=50:h=50:c=red" -c:a copy  test2.mp4
ffplay -loop 0 test2.mp4
```

4 STEP 4
========
to crop it:

```
ffmpeg -y -i original.webm -i original.webm  -ss $VIDEOSS -t $VIDEOT -filter_complex "crop=iw*3/16:ih*3/12:iw*11/16:ih*7/12, [0:v]overlay=0:100+t*$SHIFT, boxblur=1, histeq, crop=x=30:y=175:w=50:h=50, vignette=a=0.1" -c:a copy  test2.mp4
```

5. STEP 5
=========
to get a 16x16

```
ffmpeg -y -i original.webm -i original.webm  -ss $VIDEOSS -t $VIDEOT -filter_complex "crop=iw*3/16:ih*3/12:iw*11/16:ih*7/12, [0:v]overlay=0:100+t*$SHIFT, histeq, crop=x=30:y=175:w=50:h=50, vignette=a=0.1, scale=16:16" -c:a copy  out.gif
```

scale=320:240

=============

The example here is a video of Steve Redgrave's record-breaking fifth gold medal at the Sydney 2000 Olypics see [here](https://www.youtube.com/watch?v=r7Qe3e2rb0U). The second from 2:38 to 2:54 gives a reasonable quality close up without too much camera vibration or movement to contend with.


## 1. Get a clip from the original footage


Downloading the full video will take time, you can get a small part using `yt-dlp` and postprocessor arguments. Add a good margin arround the section of the clip you want to be sure to get a keyframe preceeding it.

```
VIDEOURL=https://www.youtube.com/watch?v=r7Qe3e2rb0U
VIDEOSS=00:02:30.00
VIDEOT=00:00:20.00

yt-dlp --postprocessor-args "-ss $VIDEOSS -t $VIDEOT" $VIDEOURL --force-overwrites -o "step1_original.%(ext)s"
```

## 2. Inspect


To inspect the clip, and choose the exact frames you need, create a copy with a grid and timestamps.

```
ffmpeg -i step1_original.webm -y -c:a copy -vf "\
drawtext=text='%{n}. %{pts\:hms}'\
:fontsize=32:fontcolor=white\
:box=1:boxborderw=6:boxcolor=black@0.75\
:x=(w-text_w)/2:y=h-text_h-20, \
drawgrid=w=100:h=100:t=1:c=white@0.5" \
step2_timestamped.mp4

ffplay  step2_timestamped.mp4
```
* `-i` - input file
* `-y` -  overwrite output without asking
* `-c:a copy` - copy the audio
* `-vf`   filter the video withthe follwing filtergraph:
   * `drawtext` - add the frame number and timestamp to the output, with `fontsize fontcolor` for white 32pt, `box boxborderw boxcolor` for a 75% trasnparent box with 6px border, `x y` for tghe start position of the text (using `w`, `h`, `test_W` & `:text h` parameters to center the text at the bottom)
   * `drawgrid` - add a 100x100, 1px thick, 50% trasnparent white grid.
* `step2_timestamped.mp4` the output 

Note: the frame numbers are based on `step1_original.webm` so to reference a frame it needs to be based on that as the imput file. For example to select a single frame:
 
```
FRAMENUMBER=214
ffmpeg -i step1_original.webm -y -vframes 1 -vf "\
drawtext=text='%{n}. %{pts\:hms}'\
:fontsize=32:fontcolor=white\
:box=1:boxborderw=6:boxcolor=black@0.75\
:x=(w-text_w)/2:y=h-text_h-20, \
drawgrid=w=100:h=100:t=1:c=white@0.5, \
select=eq(n\,$FRAMENUMBER)" \
step2_timestamped.png
```

Which uses the `-vframes 1` option and the `select=eq(n\,$FRAMENUMBER)` filter.



[![step2_timestamped.mp4](step2_timestamped.png)](step2_timestamped.mp4)

To control the playback with ffplay use:

```
left arrow ...... 10 seconds backwardss
right arrow ..... 10 seconds forward
up arrow ........  1 minute  backwards
down arrow ......  1 minute  forwards
page down ....... 10 minutes backwards
page up ......... 10 minutes forward
s ............... Step to the next frame
```

You can see frame 138 to 175 inclusive creates a loop of 38 frames represeting 1.52s of time (the elapsed time between frames 137 and 175 is 10.606 - 9.086 = 1.52s). 

* `137. 00:00:09.086` Blades (oars) comming down, just above the water
* `138. 00:00:09.126` Blades touch the water
* `...`
* `175. 00:00:10.606` Blades just above the water
* `176. 00:00:10.646` Blades touch the water


> ***Side note:*** This maths shows a rate of 39.5 stokes per minute for the crew (60 / 1.52 = 39.5). However, the BBC commertary of the event quoted 36 - 38 stokes per miniute for the British at this part of the race. There could be several factors leading to the discrepancy but the crew was steadily increasing their rate at the time and it in all likelyhood they were one step ahead of the comentary.


## 3. Trim the clip

You may notice there is a lag in the video starting when playing `step2_timestamped.mp4`. This is becuase the playback requires a keyframe before the video can be rendered. 



So, 10 to 47 

```
VIDEOSS=00:00:04.086
VIDEOT=00:00:01.52
W=9
H=9
X=12
Y=3
SX=-29
SY=-7
OLX=50
OLY=50

#x 1/4, y 3/4

ffmpeg -y -i original.webm -i original.webm  -ss $VIDEOSS -t $VIDEOT -filter_complex "\
crop=x=ih*$X/16:y=ih*$Y/16:w=ih*$W/16:h=ih*$H/16, \
[0:v]overlay=$OLX-$SX+t*$SX:$OLY-$SY+t*$SY, \
drawgrid=w=ih/16:h=ih/16:t=1:c=white@0.5, \
drawbox=x=60:y=100:w=416:h=416:c=red" \
-c:a copy  step3_section.mp4

ffplay -loop 0 step3_section.mp4
```


4 STEP 4
========
to crop it, instead o drawing abox

```
ffmpeg -y -i original.webm -i original.webm  -ss $VIDEOSS -t $VIDEOT -filter_complex "\
crop=x=ih*$X/16:y=ih*$Y/16:w=ih*$W/16:h=ih*$H/16, \
[0:v]overlay=$OLX-$SX+t*$SX:$OLY-$SY+t*$SY, \
crop=x=60:y=100:w=416:h=416" \
-c:a copy  step4_crop.mp4

ffplay -loop 0 step4_crop.mp4

```

5 STEP 5
========

scale down flags=lanczos
16x16

instead of drawing the grid
boxblur=1, histeq, vignette=a=0.1, scale=16:16


```
ffmpeg -y -i original.webm -i palette.png -ss $VIDEOSS -t $VIDEOT -filter_complex "\
crop=x=ih*$X/16:y=ih*$Y/16:w=ih*$W/16:h=ih*$H/16, \
[0:v]overlay=$OLX-$SX+t*$SX:$OLY-$SY+t*$SY, \
histeq=0.1, vignette=0.1, tmix=frames=3:weights='1 1 1',
crop=x=60:y=100:w=416:h=416,
scale=16:16:flags=lanczos [x]; [x][1:v] paletteuse" \
-c:a copy  out.gif

ffplay -loop 0 out.gif
```


WS2812 supports
* 24bit - 8 bits per colour 

The esphome Animation suports
* 24bit - RGB24 - 8 bits per colour.
* 16bit - RGB565 - 5 red, 6 green, 5 blue bits (human eye can percieve more shared of green)

* 24bit 0xffffff = rrrr rrrr gggg gggg bbbb bbbb
* 16bit 0x0fffff = rrrr rggg gggb bbbb

generate a pallet from the cropped video

ffmpeg -i step4_crop.mp4 -vf "histeq=0.1,palettegen=stats_mode=diff" -y palette.png




http://blog.pkh.me/p/21-high-quality-gif-with-ffmpeg.html