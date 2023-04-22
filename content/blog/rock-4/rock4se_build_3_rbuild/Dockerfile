FROM godebos/debos

RUN export DEBIAN_FRONTEND=noninteractive \
 && apt-get update \
 && apt-get install -y --no-install-recommends \
     sudo \
     apt-transport-https ca-certificates curl gnupg2 software-properties-common \
 && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"

RUN export DEBIAN_FRONTEND=noninteractive \
 && apt-get update \
 && apt-get install -y --no-install-recommends \
     docker-ce \
 && rm -rf /var/lib/apt/lists/*

RUN useradd -ms /bin/bash builduser \
    && adduser builduser sudo \
    && echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# needed becuase rbuild expects it
RUN groupadd docker \
    && adduser builduser docker

RUN mkdir /home/builduser/rock-4se-rbuild && chown builduser:builduser /home/builduser/rock-4se-rbuild

USER builduser
WORKDIR /home/builduser/rock-4se-rbuild 
ENTRYPOINT []
