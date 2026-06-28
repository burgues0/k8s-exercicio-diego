FROM ubuntu:22.04

RUN apt-get update && apt-get install -y openssh-server curl unzip

RUN mkdir /var/run/sshd \
    && echo 'root:root' | chpasswd \
    && echo 'PermitRootLogin yes' >> /etc/ssh/sshd_config \
    && echo 'PasswordAuthentication yes' >> /etc/ssh/sshd_config

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]