---
title: Custom Vagrant Box
description: Custom Vagrant Box
date: 2023-04-20
---

Here's how to create a custom vagrant box for Debian Arm 64. The process is similar for any OX, any architecture.

1. Install VMware
2. Create a VM (e.g. "Debian 11.x 64-bit Arm Box")
4. Install Debian (e.g. arm64 variant)   
   * Create user/password root/vagrant and vagrant/vagrant
   * Set up passwordless sudo for the vagrant user
5. Install the SSH certs
   ```
   https://raw.githubusercontent.com/hashicorp/vagrant/master/keys/vagrant.pub 
   ~/.ssh/authorized_keys
   ``
3. Install VMware Tools (build from source for arm64)
3. Speed up grub
   ```
   sudo nano /etc/default/grub
   # change GRUB_TIMEOUT=0
   sudo update-grub
   ```
5. Clean the image, remove any unneeded files and packages from the build process
6. Shut down the VM
7. Change the VM Network settings to Bridged Networking / Autodetect to ensure it has a ip address and is accessible from the host for ssh access.
8. Check it runs with `vmrun -T fusion start vm_name.vmx`
6. Shutdown again
7. Compress the disks
   ```
   /Applications/VMware\ Fusion.app/Contents/Library/vmware-vdiskmanager -d Virtual\ Disk.vmdk
   /Applications/VMware\ Fusion.app/Contents/Library/vmware-vdiskmanager -k Virtual\ Disk.vmdk
   ```
8. Disable scoreboards
   ```   
   echo vmx.scoreboard.enabled = \"FALSE\" >> *.vmx
   ```
9. Delete logs and lock files
   ```
   rm *.log
   rm *.scoreboard
   rm -rf *.vmx.lck
   ```
10. Create box meta data
   ```
   cat <<EOF >./metadata.json
   {
   "provider": "vmware_desktop"
   }
   EOF   
   ```
10. tar the box file
    ```
    tar -C ~/Virtual\ Machines.localized/Debian\ 11.x\ 64-bit\ Arm\ Box.vmwarevm -cvzf debain_arm64.box .
    ```

11. Add the box to Vagrant
   ```
   vagrant box add debain_arm64_box debain_arm64.box
   ```

   if you are updating you can run this first to be sure: 
   ```
   vagrant box remove debain_arm64_box
   vagrant box list
   ```
12. Check
   ```
   cd ..
   mkdir test_box
   cd test_box
   vagrant init debain_arm64_box
   ```

   then add to the Vagrantfile:

   ```
   config.vm.box = "debain_arm64_box" # after this line
   config.vm.provider 'vmware_fusion' do |p|
     p.linked_clone = false
   end
   config.vm.provider 'vmware_desktop' do |p|
     p.linked_clone = false
   end
   ```

   then

   ```
   vagrant up
   ```