

1. install and test
   ```bash
   brew install qemu
   qemu-system-x86_64 --version
   ```

2. create avistaul disk
   ```
   mkdir -p ~/vm_debian/
   qemu-img create -f qcow2 ~/vm_debian/disk.qcow2 40G
   ```

3. Download ISO
   ```
   weget ../debian-11.6.0-amd64-netinst.iso
   ```

4. Run a VM
   ```
   qemu-system-x86_64 \
   -m 4G \
   -vga virtio \
   -display default,show-cursor=on \
   -machine type=q35 \
   -smp 2 \
   -cdrom ~/Downloads/debian-11.6.0-amd64-netinst.iso \
   -drive file=disk.qcow2,if=virtio \
   -cpu qemu64
   ```