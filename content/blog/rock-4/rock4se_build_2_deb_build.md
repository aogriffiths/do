---
title: Rock4 SE Debian Build
description: Building Debian from source for the Rick 4 SE
date: 2023-03-25
tags: rock
---


The build of the system image is done using the [debos-radxa](https://github.com/radxa/debos-radxa.git). 

WARNING These instructions are incomplete and untested. [debos-radxa](https://github.com/radxa/debos-radxa.git) is being replaced by [rbuild](https://github.com/radxa-repo/rbuild).

It includes a bespoke Dockerfile to create a build environment but instructions in the README use the standard debos docker image `godebos/debos`. The README also takes the approach of keeping the source on the parent machine and bind mounting it to the docker container. This works on linux machines but can run in to issue son Mac or Windows, so we take a different aproach here.


# Dry Run 
To build a standard image take the following steps:

1. Create a docker volume for the source
```
docker volume create debos-radxa
```

2. Start a docker container, using this volume
```
docker run --rm -it -v "$(pwd)":/root/host --mount source=debos-radxa,target=/root/debos-radxa --tmpfs /dev/shm:rw,nosuid,nodev,exec,size=4g --security-opt label=disable --entrypoint=/bin/bash godebos/debos
```

docker run --rm --interactive --tty --tmpfs /dev/shm:rw,nosuid,nodev,exec,size=4g --user $(id -u) --security-opt label=disable \
--workdir $PWD --mount "type=bind,source=$PWD,destination=$PWD" --entrypoint ./build-os.sh godebos/debos
TOP DIR = /build/stephen/debos-radxa

3. Clone the source
Inside the docker containe run:
```
cd /root/debos-radxa 
git clone https://github.com/radxa/debos-radxa.git ./
```

4. build the OS image
```
./build-os.sh -b rockpi-4b -m debian -v xfce4
```
This uses pre-built images for u-boot, the kernal, which are all kept in deb packages under `/rootfs/packages/arm64/...`. The output of the build can be found in the `./output/` directory.

5. To use it
```
cp output/rockpi-4b-debian-bullseye-xfce4-arm64-*.img.xz /root/host/
exit
```
Then burn this image to an SD card and boot it up.

# Change the Kernal

Run the following:
```
dpkg -I ./rootfs/packages/arm64/kernel/linux-4.4-rock-pi-4-latest_4.4.154-116-rockchip_all.deb
```

You will see:
```
Homepage: https://github.com/radxa/kernel
```

So this is the project to use to rebuild the kernal, howevber, there is a board suport package which references https://github.com/radxa/kernel, and makes it easier. This can be found at https://github.com/radxa/rockchip-bsp.

To use ths followig separate intections TODO. 

Follow all the stesp up until **Build the kernal**. There is no need to complete any of the othe steps becuase you will come back to debos-radxa to complile the rest of the OS in to a single image.

```
cp /root/host/rockchip-bsp/*.deb ./rootfs/packages/arm64/kernel/
```

rockpi-4b-debian-bullseye-xfce4-arm64-20221109-1447-gpt.img.xz
rockpi-4b-debian-bullseye-xfce4-arm64-20230209-0645-gpt.img.xz


