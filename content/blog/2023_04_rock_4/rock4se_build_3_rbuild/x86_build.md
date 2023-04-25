---
title: Rock4 SE build v3 (using rbuild)
description: Building Debian from source for the Rock 4 SE
date: 2023-04-23
tags: rock
---

### WORK IN PROGRESS. THESE INSTRUCTIONS ARE INCOMPLETE AND NOT WORKING.

The build of the system image is done using 
* [radxa-build/rock-4se](https://github.com/radxa-build/rock-4se/blob/main/.github/workflows/build.yml) and
* [radxa-repo/rbuild](https://github.com/radxa-repo/rbuild) using docker.

The official build process uses github workflows, e.g. [radxa-build/rock-4se](https://github.com/radxa-build/rock-4se/blob/main/.github/workflows/build.yml) uses actions from [radxa-repo/rbuild](https://github.com/radxa-repo/rbuild). So it should be possible to clone both repositories, customise them and use GitHub to build a custom image.

However, this page is hopefully going to document how you can build on your local machine.


Vagrant EXPERIMENT 
==================


1. Install vagrant

   ```
   brew install hashicorp/tap/hashicorp-vagrant
   ```

2. Instal VMWare Fusion Player

   It took me a while to do this. Could use virtualbox as an alternative but virtualbox support for Apple Silicon is still beta. Look at the official vagrant documentation, which indicates better support for VMware, also also [here](https://medium.com/geekculture/setting-up-vagrant-2-3-0-for-virtual-machine-management-in-mac-apple-m1-pro-9dc4ec9036db)

   * Download and install [Fusion 13 Player for macOS 12+](https://www.vmware.com/uk/products/fusion/fusion-evaluation.html) from VMWare
   * Download and install Vagrant vmware Utility from Vagrant
   * ```vagrant plugin install vagrant-vmware-desktop```


2. Create a debos docker image, with some customisations

   This will allow you to get a bash shell with a builduser later on.


   ```bash
   docker build -t rbuild:6 .
```

3. Open a bash shell using the image and volume
   ```bash
   docker run --rm -it -v "$(pwd)":/root/host --mount source=rock-4se-rbuild,target=/home/builduser/rock-4se-rbuild --tmpfs /dev/shm:rw,nosuid,nodev,exec,size=4g --security-opt label=disable --entrypoint=/bin/bash rbuild:6
```

4. Clone the rbuild source
   Inside the docker container run:
   ```bash
   git clone https://github.com/radxa-repo/rbuild ./
   ```

5. build the OS image
   ```bash
   ./rbuild
   ```



Docker EXPERIMENT (Not Working)
===============================

This method does not work, yet, but it's included here in case it can be made to work at some stage. 


1. Create Docker Volume

   ```bash
   docker volume create rock-4se-rbuild
   ```

2. Create a debos docker image, with some customisations

   This will allow you to get a bash shell with a builduser later on.

   ```bash
   docker build -t rbuild:6 .
   ```

3. Open a bash shell using the image and volume

   ```bash
   docker run --rm -it -v "$(pwd)":/root/host --mount source=rock-4se-rbuild,target=/home/builduser/rock-4se-rbuild --tmpfs /dev/shm:rw,nosuid,nodev,exec,size=4g --security-opt label=disable --entrypoint=/bin/bash rbuild:6
   ```
   
4. Clone the rbuild source

   Inside the docker container run:
   ```bash
   git clone https://github.com/radxa-repo/rbuild ./
   ```

5. Build the OS image
 
   ```bash
   ./rbuild
   ```



-----


1. `brew install ansible`


referecnes:

https://radxa-repo.github.io/bsp/