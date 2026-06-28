FROM ubuntu:22.04

RUN apt-get update && apt-get install -y openssh-server curl unzip openjdk-17-jre

RUN curl -fsSL https://github.com/zaproxy/zaproxy/releases/download/v2.17.0/ZAP_2.17.0_Linux.tar.gz | tar -xz -C /opt \
    && ln -s /opt/ZAP_2.17.0/zap.sh /usr/local/bin/zap.sh

RUN mkdir /var/run/sshd \
    && echo 'root:root' | chpasswd \
    && echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config \
    && echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]