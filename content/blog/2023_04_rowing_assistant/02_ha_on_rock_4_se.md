---
title: Rowing Assistant - Home Assistant on a Rock 4 SE
description: Installing Home Assistant on Debian on Rock 4 SE
date: 2023-04-26
tags: rowing assistant
---

# Home Assistant on Debian on Rock 4 SE

This installtion method is know as the "Supervised" method. It's required becuase Home Assistant OS dosn't yet support the rock pi, but hopfully it will one day.

## Steps - Part 1 - Install

1. Enable App Armor in the kernal
   
   This step is the biggest gotcha so lets get it out of the way. The 20221109-1447 relase of the Rock 4 SE image (rockpi-4b-debian-bullseye-xfce4-arm64-20221109-1447) does not have app armor built in to the kernal. To build it in follow the instuctions [here] which give you three deb packages.

   ```
   linux-firmware-image-...rockchip_arm64.deb
   linux-headers-...rockchip_arm64.deb
   linux-image-...rockchip_arm64.deb
   ```

   Copy these to your Rock 4 SE and install them:

   ```
   scp ./*.deb rock@homeassistant.local:~
   ssh rock@homeassistant.local
   sudo dpkg -i *.deb
   ```
   You willthen need to make the new kernal the default

   ```
   sudo nano /boot/extlinux/extlinux.conf
   ```
   and add:
   ```
   DEFAULT kernel-4.4.194-1-rockchip-g1bb08d4
   ```
   Make sure the name in `DEFAULT kernel-4.4.194-1-rockchip-g1bb08d4` matches the name in `label kernel-4.4.194-1-rockchip-g1bb08d4` below.


2. Switch to iptables. 

   Debian uses nftables by default but the docker installer requires iptables for NAT.
   ```
   sudo apt-get install -y iptables
   sudo update-alternatives --set iptables /usr/sbin/iptables-legacy
   sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy
   ```

3. Install dependencies

   Install these dependencies now, they are required for the next steps.

   ```
   sudo apt-get install \
   apparmor \
   udisks2 \
   network-manager \
   wget \
   curl \
   systemd-journal-remote -y
   ```
   Any perl locale warnings can be ignored.

4. Switch to cgroups v1 and enable app armor 

   These are kernal parameters and because the Rock 4 SE uses Das U-boot theu are set in `/boot/extlinux/extlinux.conf`. Append the parameters with the following:
   ```
   sudo sed -i '/append/ s/$/ apparmor=1 security=apparmor systemd.unified_cgroup_hierarchy=false/' /boot/extlinux/extlinux.conf
   ```
   **Side note**. If you ever need to do the same with the grub bootloader, the commands would be:
   ```
   sudo echo "apparmor=1 security=apparmor systemd.unified_cgroup_hierarchy=false" > /etc/default/grub
   sudo touch  /boot/cmdline.txt
   sudo sed -i -e "1 s/$/ apparmor=1 security=apparmor systemd.unified_cgroup_hierarchy=false/" /boot/cmdline.txt
   ```

5. Reboot. 

   For the cgroups and apparmor changes to take effect:

   ```
   sudo reboot
   ```

6. Install docker

   ```
   curl -fsSL https://get.docker.com -o get-docker.sh
   
   #dry run 1st if you want
   sudo sh ./get-docker.sh --dry-run

   sudo sh get-docker.sh
   ```
   Any perl locale warnings can be ignored.


7. Check all required versions meet the spec in [ADR-0014](https://github.com/home-assistant/architecture/blob/master/adr/0014-home-assistant-supervised.md) (Optional)

   If you want to be sure, here's the check list and commands to verify version numbers:

   * `>= 20.10.17` for Docker CE 
     ```
     docker --version
     ```
   * `>=`239` for Systemd
     ```
     systemd --version
     ```
   * `>= 1.14.6` for NetworkManager
     ```
     apt info network-manager
     nmcli --version
     ```
   * `>= 2.8` for udisks2
     ```
     sudo journalctl -b | grep "udisks daemon version"
     ```
   * `== 2.13.x` for AppArmor (built into the kernel)
     ```
     sudo aa-status
     ```
   * `11` aka Bullseye Debian Linux (no derivatives)
     ```
     cat /etc/os-release
     ```
   * `latest` Home Assistant OS-Agent. Only the latest release is supported. See next step for installation.

8. Install the Home Assistant OS-Agent

   * Download the `aarch64` release from [here](https://github.com/home-assistant/os-agent/releases/latest). 
   
     You can tell you need arm64/aarch64 by running this command:
     ```
     dpkg --print-architecture  
     ```
     Download it with
     ```
     wget https://github.com/home-assistant/os-agent/releases/download/1.4.1/os-agent_1.4.1_linux_aarch64.deb
     ```
   * Install it with:
     ```
     sudo dpkg -i os-agent_1.4.1_linux_aarch64.deb
     ```
   * Test it worked
   
     Ensure there is no error when running:
     ```
     gdbus introspect --system --dest io.hass.os --object-path /io/hass/os
     ```

9. Install Home Assistant Supervised

   * Install dependencies

     Supervised has some dependencies, in addition to those you've already installed, they should be installed be default, but just to make sure  run: 
     ```
     sudo apt-get install \
     jq \
     libglib2.0-bin \
     dbus \
     lsb-release \
     systemd-journal-remote -y
     ```

   * Install the Supervised deb package
     ```
     wget https://github.com/home-assistant/supervised-installer/releases/latest/download/homeassistant-supervised.deb
     sudo dpkg -i homeassistant-supervised.deb 
     ```
     When you get the slection menue, choose `qemuarm-64` for the Rock 4 (which is arm64) and the installation should complete with:

     ```
     [info] Within a few minutes you will be able to reach Home Assistant at:
     [info] http://homeassistant.local:8123 or using the IP address of your
     [info] machine: http://192.168.1.9:8123
     ```
     Ignore the grub / cgroup v1 warning (that was resolved in the u-boot / cgroups step above).

     As it says within a few minutes you will be able to reach Home Assistant at http://homeassistant.local:8123. While you are waiting you can poke arround with the optioinal next step.

10. Optional, understand the support conditions in [ADR-0014](https://github.com/home-assistant/architecture/blob/master/adr/0014-home-assistant-supervised.md)

   * **OS dedicated to Home Assistant** - yes, well... kind of, you are going to use the same machine to display the homeassitant UI later on which is *interpreting* the rules becuase it requires a desktop and a browser.

   * **Dependencies installed to the manual** - yes, you did that above.

   * **No additional software** - yes, but see *interpeting* the rules above.

   * **Docker using overlayfs2, journald and Container name as Tag, and cgroup v1** - yes, you can confirm the Supervised installer has set this up by running:
     ```
     cat /etc/docker/daemon.json
     ```
     returns:
     ```
     {
          "log-driver": "journald",
          "storage-driver": "overlay2",
          "ip6tables": true,
          "experimental": true,
          "log-opts": {
              "tag": "{% raw %}{{.Name}}{% endraw %}"
          }
      }
      ```
      Also, you set up cgroup v1 as a kernal parameter earlier, and if you hadn't docker wouldn't be working now.

   * **NetworkManager ienabled in systemd** - yes, you can confirm:
      ```
      systemctl status NetworkManager
      ```
      returns `loadaed` and `active`.

   * **Systemd journal gateway on /run/systemd-journal-gatewayd.sock** - yes, you installed `systemd-journal-remote` earlier and you can confirm the Supervised installer has set this up by running:
      ```
      systemctl is-active systemd-journal-gatewayd.socket
      ```


## Steps - Part 2 - Setup Home Assitant

You may need to wait a few minutes but next step is to setup Home Assistant with the basics, through the UI.

1. Navigate to the front end e.g. at http://homeassistant.local:8123.

2. Create an 'admin' user for configuring Home Assistant. You will later create a 'kiosk' user with less privilidges for displaying dashboard. To be secure you should give the admin user a different password to the 'rock' system account you used fo ssh and set the password for earlier.

3. Set your location (by dragging the pin on the map), and related localisation information.

4.  Choose the information you wish to share with Home Assistant's developers 

5. Set the step to set up devices, we can come back tot heat later.

![Seting Up HA](step2_ha_config.gif)

## Conclusion

You now have a workong Home Asssitant installtionon a Rock 4 SE!

Consider [Customising Home Assistant](custom_ha.md) next.


## References

* [Home Asssitant Instalation](https://www.home-assistant.io/installation/) 
* [Home Assistant Supervised](https://www.home-assistant.io/installation/linux#install-home-assistant-supervised) (see end of the page)
* [Docker Install on Debian](https://docs.docker.com/engine/install/debian/)