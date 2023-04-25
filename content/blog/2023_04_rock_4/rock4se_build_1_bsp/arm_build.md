---
title: Rock 4 SE build v1_arm (using rockchip-bsp)
description: Building a custom kernal, u-boot and Debian from source for the Rock 4 SE, the old rockchip-bsp way and attempting to do it on arm without cross compiling
date: 2023-04-21
tags: rock
---

THESE INSTRUCTIONS DO NOT WORK. They go some way to adapting the Rock SE build instructions for running on an arm machine, but they are not fully working and are shared here in case it's ever interesting to anyone.

Steps
----------

1. **Install dependencies**

   Install the following on a raw machine (Tested on an Intel Mac, should be adaptable for Linux, not tested on Windows)
   
   * **Docker**: See [get-docker](https://docs.docker.com/get-docker/).

   * **Git**: Follow suitable install instructions for your host OS (e.g. on a mac `brew install git`)
   
2. **Clone the Radxa Board Support Package (BSP)**

   ```bash
   cd ./ # choose a working directory that suits you
   git clone -b master https://github.com/radxa/rockchip-bsp.git
   cd rockchip-bsp
   ```
3. **Create a Docker container**

   A docker container will be used for building the board SD card image. You can create a docker image from the Dockerfile contained in the rockchip-bsp, but first you need to edit it to make some changes (if you are building on a arm machine) and fixes:

   * Open the docker file
     ```bash
     open ./docker/Dockerfile 
     ```

   * Comment out all lines that contain `RUN echo "deb http://mirrors.tuna...`

   * If you are using an arm machine (as oppose to x86) comment out the cross compiler packages:
      * crossbuild-essential-arm64 
      * gcc-aarch64-linux-gnu 

   * add `u-boot-tools` (The kernel build later is dependent on mkimage from u-boot-tools, but unfortunately the Dockerfile provided doesn't include it.

   You can then build and tag the image with

   ```bash
   docker build -t rockchip-radxa:1 -f ./docker/Dockerfile .  
   docker tag rockchip-radxa:1 rockchip-radxa:latest
   ```

4. Start a container

   Now start a Containe rusing this image. The BSP documentation suggests bind mounting the source code (which you cloned in step 1) into the container (e.g. `docker run --privileged -it -v /home/jack/rockchip-bsp:/root ...`). However this can run in to issues with differing operating systems (e.g. file name case sensitivity) so it's safer to create new a volume for the source code:

   ```bash
   docker volume create rockchip-bsp
   ```
   Then, start the docker container with: 
   ```bash
   docker run -it --rm -v `pwd`:/root/host --mount source=rockchip-bsp,target=/root/rockchip-bsp rockchip-radxa /bin/bash
   ```
   The options here are:
     
     * `run` and `/bin/bash` start the container with a bash shell
     
     * `-it` make is an interactive terminal 
     
     * `-v ...` maps the current working director of the host machine to the container, so you can copy files out
     
     * `--mount ...` maps the docker volume create earlier to the container, to keep the source code, and complied out in


 5. **Update the BSP submodules**
 
    Now you have shell in the docker container, clone the BSP in the `/root/rockchip-bsp` directory (which is where the volume created earlier is mounted) and checkout the submodules with:
    ```bash
    cd /root/rockchip-bsp
    git clone -b master https://github.com/radxa/rockchip-bsp.git ./
    git submodule init
    git submodule update 
    ```

    This may take some time; it's over 6Gb to download. (The linux kernel, led by Linus Torvalds, is one of the largest git repositories out there. Linus also led the development of git itself)

6. **Configure the kernel**

   The kernel in the BSP is currently based on linux 4.19. The next step is where you can enable AppArmor, and make any other kernal configurations you like:
  
   ```bash
   cd kernel
   make rockchip_linux_defconfig
   make menuconfig
   ```
   Use the menu to goto:

     1. Security options (space) 
     2. Enable different security models (space) 
     3. AppArmor support (space to select) 
     4. Exit
     5. Exit
     6. Yes (to save)


   Then save the config:
   ```bash
   make savedefconfig
   cp defconfig arch/arm64/configs/rockchip_linux_defconfig
   cd ..
   ```

7. Compile the kernel

   If you are on a x86 machine you will need to cross compile, which is done by setting two environment variables.

   ```bash
   export ARCH=arm64
   export CROSS_COMPILE=aarch64-linux-gnu-
   ```

   Then compile with:
   ```bash
   cd ..
   ./build/mk-kernel.sh rk3399-rock-pi-4b  
   ```
   
   The generated image and device tree blob (dtb) is copied to the `out/kernel` directory. To see them:
   ```bash
   ls out/kernel/
   ```

   To pack the kernel in deb packages run:
   ```bash
   ./build/pack-kernel.sh -d rockchip_linux_defconfig -r 1 
   ```

   The generated packages will be copied to `out/packages` directory:
   ```bash
   ls out/packages/
   ```

   The copy them all excdpt the `dbg` and `libc` packages:
   ```bash
   (GLOBIGNORE="*dbg*:*libc*"; cp out/packages/*.deb /root/host)
   ```
   

6. **Build u-boot**

   For ROCK Pi 4 Model B or ROCK 4 SE use `rk3399-rock-pi-4b`. (The README is out of date on this step it suggests using `rockpi4b`, but you can see the correct board names to use in the `build/board_configs.sh` file.)

   Run:
   ```bash
   ./build/mk-uboot.sh rk3399-rock-pi-4b  
   ```

   if you get the error `qemu-x86_64: Could not open '/lib64/ld-linux-x86-64.so.2': No such file or directory`

   comment out `export CROSS_COMPILE` in:
   1. top of `build/board_configs.sh` 
   2. top of  `build/mk-uboot.sh`
   3. `rk3399-rock-pi-4b` section of `build/mk-uboot.sh`

   ```bash
   find ./ -type f -name '*.sh' -exec sed -i 's,export CROSS,\#export CROSS,gI' {} \;
   ```

   ``
   git clone x
   cd x
   sudo apt-get install libsdl1.2-dev
   sudo apt-get install python3-setuptools
   make tools-only_defconfig
   ```

   The generated images are copied to the `out/u-boot` directory. To see them:
   ```bash
   ls out/u-boot/
   ```

7. **Make a Debian rootfs image**

   The scripts in `rootfs` create a debian system using `lb` (from live-build, the Debian Live tool suite). They are packaged in the BSP with all the correct configuration except one thing, they are configured to use a chinese mirror which is great if you live in China, and slow if you do not, so slow in fact yur build might timeout. Use `sed` to replace the mirrors:

   **First, the Debian Security Mirror**

   * from: `https://mirrors.tuna.tsinghua.edu.cn/debian-security`
   * to: `https://security.debian.org/debian-security`
   
   ```bash
   find ./ -type f -name configure -exec sed -i 's,https://mirrors.tuna.tsinghua.edu.cn/debian-security,https://security.debian.org/debian-security,gI' {} \;
   ```
   
   **Second, the Debian Mirror**
   
   * from: `https://mirrors.tuna.tsinghua.edu.cn/debian`
   * to: `http://ftp.uk.debian.org/debian` 
   ```bash
   find ./ -type f -name configure -exec sed -i 's,https://mirrors.tuna.tsinghua.edu.cn/debian,http://ftp.uk.debian.org/debian,gI' {} \;
   ```

   Then run the following:
   ```bash
   cd ./rootfs
   
   # ignore the missing dependencies in the next step
   dpkg -i ubuntu-build-service/packages/*  
   
   # The next step fixes the dependencies
   apt-get install -f                       

   export RELEASE=buster 
   export TARGET=desktop 
   export ARCH=arm64
   
   ./mk-base-debian.sh
   ./mk-rootfs-buster.sh
   ./mk-image.sh
   
   ```
   The environment variables are self explanatory (a Debian 11 / buster, desktop build for arm64). The scripts do the following:
   
   * `mk-base-debian.sh` make a base Debian image (using live build)

   * `mk-rootfs-buster.sh` unpacks the image and merges it with packages and custom firmware for the Rock 4

   * `mk-image.sh` packages it all up again in an ext4 formatted image named `linaro-rootfs.img`. 
   
   To see the output and return to the top level BSP directory.
   ```bash
   ls
   cd ..
   ```

8. **Create a single image**

   Combine the separate u-boot, linux kernel, and debian rootfs images into a single image with a GPT partition table:
   ```bash
   build/mk-image.sh -c rk3399 -b rockpi4 -t system -r rootfs/linaro-rootfs.img
   ```
   The result is:
   ```bash
   out/system.img
   ```
   To copy this to your host computer run:
   ```bash
   cp out/system.img /root/host/
   ```

9. **Flash the SD card**
   
   The final step is to flash `system.img` to an SD card. Balena Etcher is a good choice for this.


References
----------

* https://wiki.radxa.com/Rock3/dev/Debian
* https://wiki.radxa.com/Rockpi4/dev/Debian
* https://github.com/radxa/rockchip-bsp
