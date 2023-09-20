---
title: Rowing Assistant - Introduction
description: Creating a Home Assistant instance for Maidenhead Rowing Club 
date: 2023-04-25
tags: rowing assistant
---


Home Assistant is a fantastic way to bring all your smart devices together in to one smart home. It gives you a slick UI, companion app, remote access (courtesy of Nubu Casa), user configurable automations and much more. But it’s not limited to your home.

This series of posts will show you how to do a few things beyond the basics, like:

- Bespoke Sensors - using esphome
- Outdoors - measuring (and withstanding) the elements.
- Long wires - hard wiring to places wifi and power won’t reach.
- Public APIs - getting data from a source which Home Assistant doesn’t support (yet)
- Rock Pi - A raspberry Pi alternative with good  a cost / performance balance 
- Indoor display - attaching a screen directly to home assistant to share a dashboard
- Outdoor display - use RGB leds to create outdoor indicators or digital signage


It’s intended for makers, inventors, or anyone interested doing more than the out of the box stuff. There's lots of notes, including code, configuration, hardware assembly and more hands on soldering and making. You can read it all or just pick the bits of interest to you.

[All Posts](/tags/rowing-assistant/)
[Next Posts](/tags/rowing-assistant/)


The example its based on is monitoring weather conditions for a rowing club, however you could easily adapt it for many other other outdoor or indoor, sport or non-sport examples.

I hope it’s useful!

Part 1 - Home Assistant on a Rock PI 

Home assistant supports Raspberry PI as standard so why use anything else? Raspberry PI is a great choiuce, but you may find a Rock PI option that is easier to get holder of, cheaper or more powerful.



 
Requirements
* Measure air temperature.
* Measure water temperature.
* Get river flow rate from an online service.
* Show all three data points on a display.
 
Assumptions
* There is a wall mounted box, which:
    * can house a sensor control device;
    * is weather proof;
    * has access to mains power, which a micro usb charger can be plugged in to;
    * has access to wifi.
* Air temperature will be measured at the box location or nearby.
* Water temperature will be measured in the river which:
    * is no more than 10m away from the sensor control device;
    * is connect to by Cat5 cable run from the wall mounted box to the water
    * has a secure route for the Cat5 cable which won’t cause a trip hazard or lead to it being damaged
    * has a secure way to mount the water temperature sensor so it is underwater at all times
    * River height won’t vary more than 1m
 
Solution
 
#1 Home Assistant + Display
 
A single machine running Home Assistant (HA) and the display. Can be located anywhere in the club house with access to WiFi. In the future HA can collect data from other devices too, like cameras, alarms, and other IoT sensors, if you want. Attach a touch screen display directly to it to avoid the need for keyboard and mouse but run a very lightweight UI operating System - just needs a web browser to display home assistant. In order to run both a web browser and Home Assistant the “Home Assistant Container” installation method is needed (the alternative it to run two Rock Pis, one for HA and one for the display which would cost double).
 
HA can easily gather the temperature sensor data from the ESP device (see below) and using the “scrape” integration can get the river flow rate data from any online webpage. If there is an online API for river flow rate it’s not too hard to write a custom HA integration to pull data from that, which should be more stable than we page scraping the data for obvious reasons.
 
For the Home Assistant Setup 
* Rock PI 4C (Simon has one)
* Pi 7” touch screen display
* Pi 7” case
* 24w usb power supply with quick charge support
* Keyboard and mouse for the initial setup 


For the sensors I’ve used:
* Wemos D1 Mini (cheap and small, could switch to one of the larger and most costly esp8266 boards OKdo sell)
* 


* 16x16 neopixel 


* 16x16 Neopixel Grid 
* Micro USB power supply
* £10 – 2x RJ45 male and female connectors (to allow the temperature sensors to be easily connected / moved)
* £15 – UV and weather resistant Cat5 Cable (to connect the temperature sesnors)
* £2 – 2x DS18B20 temperatures sensors
* £8 – 2x temperature sensor probe casing
* £5 – 2x Sundry glue, PTFE tape, double layer heat shrink to create a water tight probes
* £10 – project enclosure (box to hold the D1 Mini, and cat 5 connectors)
* £10-£15 – optional 0.96” LCD display can be added to this device (allow people to read the temperature data, and potentially the river flow data, at the location of the sensor device. 0.96” LCD or OLED displays are cheap and easy to connect to ESP devices, anything larger is more expensive or impossible for the ESP to drive).
* £? Optional other sensors like air pressure and humidity, but that might be beyond the MVP…
 
Total - £60-75
 
* 4-6 hrs to build
* 2-3 hrs to install
 
Home Assitant OS dosn't yet support the Rock 4 and until it does we will need to set up a clean Debian OS manually.



## Part 4 - TBC






configuration.yaml:
/usr/share/hassio/homeassistant


RK3399-T











Hoke assistant is now downloading the docker image layers you need. To follow it’s progress you can run:

journalctl -f

sudo ufw allow from 192.168.1.0/24 to any port 8123

http://192.168.1.9:8123


> apt-get install libubootenv-tool

https://wiki.radxa.com/Rockpi4/dev/serial-console

In seriel console:
> setenv bootargs ${bootargs} systemd.unified_cgroup_hierarchy=false
> printenv  bootargs
>

cat /proc/cmdline

(//u-boot bootcmd_mmc1)


consider for machine name mDNS

```
apt install avahi-daemon
```





 # --------- END ---------  


RDP
- ? https://www.digitalocean.com/community/tutorials/how-to-enable-remote-desktop-protocol-using-xrdp-on-ubuntu-22-04




label kernel-4.4.194-11-rk3399-rockchip-g1bb08d49cc40
    kernel /vmlinuz-4.4.194-11-rk3399-rockchip-g1bb08d49cc40
    initrd /initrd.img-4.4.194-11-rk3399-rockchip-g1bb08d49cc40
    devicetreedir /dtbs/4.4.194-11-rk3399-rockchip-g1bb08d49cc40
    append earlyprintk console=ttyFIQ0,1500000n8 rw init=/sbin/init rootfstype=ext4 rootwait  root=UUID=fa5b60b5-f645-4f68-8d47-b519dd856ea1 console=ttyS2,1500000n8 systemd.unified_cgroup_hierarchy=false apparmor=1 security=apparmor


Boot procedure

1. Firmware - Arm trusted firmware initialises the board

2. Bootloader - Hands over to the bootloadaer which is u-boot. Internally u-boot calls "run bootcmd" which runs a number of commands designed to find storage media attached to the board contining "extlinux/extlinux.conf". IF it's found u-boot will handover to syslinux to use this configuation.

extlinux.conf

syslinux 


Original
```
label kernel-4.4.194-11-rk3399-rockchip-g1bb08d49cc40
    kernel /vmlinuz-4.4.194-11-rk3399-rockchip-g1bb08d49cc40
    initrd /initrd.img-4.4.194-11-rk3399-rockchip-g1bb08d49cc40
    devicetreedir /dtbs/4.4.194-11-rk3399-rockchip-g1bb08d49cc40
    append earlyprintk console=ttyFIQ0,1500000n8 rw init=/sbin/init rootfstype=ext4 rootwait  root=UUID=fa5b60b5-f645-4f68-8d47-b519dd856ea1 console=ttyS2,1500000n8 
```

New
```
q
```


3. Device tree
4. Linux kernal Image
5. Root Filesystem





