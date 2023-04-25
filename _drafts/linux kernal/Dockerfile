FROM mcr.microsoft.com/devcontainers/base:bullseye



RUN apt-get update && apt-get install -y \
  bzr \
  cvs \
  git \
  mercurial \
  subversion \
  && rm -rf /var/lib/apt/lists/*

WORKDIR "/home/vscode"

RUN git clone git://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git

WORKDIR "/home/vscode/linux"


RUN wget https://releases.linaro.org/components/toolchain/binaries/7.3-2018.05/aarch64-linux-gnu/gcc-linaro-7.3.1-2018.05-x86_64_aarch64-linux-gnu.tar.xz \
    && sudo tar xvf gcc-linaro-7.3.1-2018.05-x86_64_aarch64-linux-gnu.tar.xz  -C /usr/local/  \
    && rm gcc-linaro-7.3.1-2018.05-x86_64_aarch64-linux-gnu.tar.xz
