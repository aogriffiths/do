

## 1.1 Building A Custom Kernal

The official Rock 4 SE Debian 11 (Buster) image does not have App Armor enabled, which Home Assistant requires. To create a custom image we will use the [Radxa Board Support Package](https://github.com/radxa/rockchip-bsp) (BSP).

Take the following steps on machine of your choice, they should be easily adaptable to work on a Windows, Mac or Linux machine, but have only been tested on a Mac.

from
https://wiki.radxa.com/Rock3/dev/Debian
https://wiki.radxa.com/Rockpi4/dev/Debian

1. **Install dependecies**
   
   * Docker. See [get-docker](https://docs.docker.com/get-docker/).

   * Git. Follow suitable install intuctions for your host OS (e.g. on a mac `brew install git`)
   
2. **Clone the Radxa Board Support Package (BSP)**
   ```
   cd ./ # choose a working directory that suits you
   git clone -b master https://github.com/radxa/rockchip-bsp.git
   cd rockchip-bsp
   ```
3. **Create a Docker container**

   A docker container will be used for building the board SD card image. Start by creating the docker image.
   ```
   sudo docker build -t rockchip-radxa:1 -f ./docker/Dockerfile .  
   docker tag rockchip-radxa:1 rockchip-radxa:latest
   ```

   The kernal build later is dependent on mkimage but unfortunately the Dockerfile provided dosn't include it. To resolve create a new Dockerfile:
   
   Dockerfile2
   ```
   FROM rockchip-radxa:1

   RUN export DEBIAN_FRONTEND=noninteractive \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        u-boot-tools \
    && rm -rf /var/lib/apt/lists/*
   ```

   And run
   ```
   sudo docker build -t rockchip-radxa:2 -f ./Dockerfile2 .
   docker tag rockchip-radxa:2 rockchip-radxa:latest
   ```

   The BSP documentation suggests bind mounting the source code into the contaier (e.g. `docker run --privileged -it -v /home/jack/rockchip-bsp:/root ...`). However this can run in to issues with differing operating susyems (e.g. filenaming on Mac and Windows may not be case sesnsitive) so it's safer to create a volume for the source code:
   ```
   docker volume create rockchip-bsp
   ```
   Then, create the docker container with: 
   ```
   docker run -it --rm -v `pwd`:/root/host --mount source=rockchip-bsp,target=/root/rockchip-bsp rockchip-radxa /bin/bash
   ```
   The options here are:
     
     * `run` and `/bin/bash` start the container with a bash shell
     
     * `-it` make is an interative terminal 
     
     * `-v ...` maps the current working director of the host machine to the container, so you can copy files out
     
     * `--mount ...` maps the docker volume create earlier to the container, to keep the source code, and complied out in


 4. **Update the BSP submodules**
 
    Now you have shell in the docker container, clone the BSP in the `/root/rockchip-bsp` directory (which is where the volume created earlier is mounted) and checkout the submodules with:
    ```
    cd /root/rockchip-bsp
    git clone -b master https://github.com/radxa/rockchip-bsp.git ./
    git submodule init
    git submodule update 
    ```
    This may take some time!

5. **Build the kernal**

   The kernal in the BSP is currently based on linux 4.19. The next step is where you get to enable App Armor:
  
   ```
   cd kernel
   export ARCH=arm64
   export CROSS_COMPILE=aarch64-linux-gnu-
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
   ```
   make savedefconfig
   cp defconfig arch/arm64/configs/rockchip_linux_defconfig
   cd ..
   ```

   And build the kernal:
   ```
   cd ..
   ./build/mk-kernel.sh rk3399-rock-pi-4b  
   ```
   
   The generated image and device tree blob (dtb) is copied to the `out/kernel` directory. To see them:
   ```
   ls out/kernel/
   ```

   To pack the kernal in deb packages run:
   ```
   ./build/pack-kernel.sh -d rockchip_linux_defconfig -r 1 
   ```

   The generated packages will be copied to `out/packages` direcotry:
   ```
   ls out/packages/
   ```

   The copy them all excdpt the dbg and libc packages:
   ```
   (GLOBIGNORE="*dbg*:*libc*"; cp out/packages/*.deb /root/host)
   ```
   

6. **Build u-boot**

   For ROCK Pi 4 Model B or ROCK 4 SE use `rk3399-rock-pi-4b`. The README is ou of date on this step (it suggests using `rockpi4b`), but you can see the correct board names to use in the `build/board_configs.sh` file.

   Run:
   ```
   ./build/mk-uboot.sh rk3399-rock-pi-4b  
   ```
   The generated images are copied to the `out/u-boot` directory. To see them:
   ```
   ls out/u-boot/
   ```

7. **Make a Debian rootfs image**

   The scripts in `rootfs` create a debian system using `lb` (from live-build, the Debian Live tool suite). They are packaged in the BSP with all the correct configuration except one thing, they are configured to use a chinese mirror which is great if youy live in China, and slow if you do not, so slow in fact yur build might timeout. Use `sed` to replace the mirrors:

   **First, the Debian Security Mirror**

   * from: `https://mirrors.tuna.tsinghua.edu.cn/debian-security`
   * to: `https://security.debian.org/debian-security`
   
   ```
   find ./ -type f -name configure -exec sed -i 's,https://mirrors.tuna.tsinghua.edu.cn/debian-security,https://security.debian.org/debian-security,gI' {} \;
   ```
   
   **Second, the Debian Mirror**
   
   * from: `https://mirrors.tuna.tsinghua.edu.cn/debian`
   * to: `http://ftp.uk.debian.org/debian` 
   ```
   find ./ -type f -name configure -exec sed -i 's,https://mirrors.tuna.tsinghua.edu.cn/debian,http://ftp.uk.debian.org/debian,gI' {} \;
   ```

   Then run the following:
   ```
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
   The environment variables are self explanitory (a Debian 11 / buster, deskeop build for arm64). The scripts do the following:
   
   * `mk-base-debian.sh` make a base Debian image (using live build)

   * `mk-rootfs-buster.sh` uppacks the image and merges it with packages and custom firmware for the Rock 4

   * `mk-image.sh` packages it all up again in an ext4 formated image named `linaro-rootfs.img`. 
   
   To see the output and return to the top level BSP directory.
   ```
   ls
   cd ..
   ```

8. **Create a single image**

   Combine the separate u-boot, linux kernal, and debian rootfs images into a single image with a GPT partition table:
   ```
   build/mk-image.sh -c rk3399 -b rockpi4 -t system -r rootfs/linaro-rootfs.img
   ```
   The result is:
   ```
   out/system.img
   ```
   To copy this to your host computer run:
   ```
   cp out/system.img /root/host/
   ```

9. **Flash the SD card**
   
   The final step is to flash `system.img` to an SD card. Balena Etcher is a good choice for this.


