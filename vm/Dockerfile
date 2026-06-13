FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    openssh-server \
    python3 \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /var/run/sshd \
    && echo 'root:root' | chpasswd \
    && echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config \
    && echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config

EXPOSE 22 5000

CMD ["/usr/sbin/sshd", "-D"]
