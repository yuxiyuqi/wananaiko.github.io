---
title: "Huntlyt 部署到宝塔"
date: 2023-03-10T20:23:45+08:00
author: "wananaiko"
tags:
  - huntly
draft: false
---

####  1、Docker 部署

安装Docker后，在终端里以 root 身份运行：

```
docker run -d --name huntly -p 9090:80 -v /opt/huntly:/data lcomplete/huntly:0.1.0
```

查看是否安装成功：`docker ps`

#### 2、安装 Java11

```
yum install java-11-openjdk -y
```

检查 Java 版本号是否为 11.

```
java -version
```

输出以下内容代表成功：

```
openjdk version "11.0.18" 2023-01-17
OpenJDK Runtime Environment (build 11.0.18+10-post-Debian-1deb10u1)
OpenJDK 64-Bit Server VM (build 11.0.18+10-post-Debian-1deb10u1, mixed mode, sharing)
```

#### 3、安装 huntly

```
useradd -r -s /sbin/nologin huntly
```

```
mkdir -p /opt/huntly 
```

```
wget -P /opt/huntly https://github.com/lcomplete/huntly/releases/download/0.1.0/huntly-server-0.1.0-SNAPSHOT.jar
```

上面这一步，如何是国内的服务器遇到下载失败的话，手动下载文件上传至目录 `/opt/huntly` 下面。

终端里运行 `chown -R huntly: /opt/huntly`

#### 4、作为服务运行

在 `/etc/systemd/system/` 目录下新建文件 huntly.service。编辑后输入以下内容并保存。

```
[Unit]
Description=huntly reader server
After=network.target

[Service]
Type=simple
User=huntly
WorkingDirectory=/opt/huntly
ExecStart=/usr/bin/java -Xms128m -Xmx1024m -jar /opt/huntly/huntly-server-0.1.0-SNAPSHOT.jar --server.port=9090
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

接着在终端里依次执行以下指令。

```
systemctl daemon-reload
```

```
systemctl start huntly
```

```
systemctl enable huntly
```

```
journalctl -n 20 -u huntly
```

#### 5、反向代理

在宝塔“网站” 里新建你的 huntly 站点，在反向代理里设置目标URL 为：`http://127.0.0.1:9090`

这个时候你已经可以用你的服务器 IP 加端口号访问了，然后就是域名解析了。

如果你使用 Cloudflare  接管了域名管理，可以使用 Cloudflare 自带的 SSL 证书。在Cloudflare - SSL/TLS - 源证书，创建证书，将申请后的证书 PEM 和 KEY 填到宝塔后对应域名的 SSL 中并保存。

 访问遇到520错误，在宝塔软件商店里安装  Nginx 免费防火墙，在对应的设置 - 全局配置里“导入” IP 白名单。

```
103.21.244.0/22
103.22.200.0/22
103.31.4.0/22
104.16.0.0/13
104.24.0.0/14
108.162.192.0/18
131.0.72.0/22
141.101.64.0/18
162.158.0.0/15
172.64.0.0/13
173.245.48.0/20
188.114.96.0/20
190.93.240.0/20
197.234.240.0/22
198.41.128.0/17
```

接着在“站点配置”的“设置”里，打开使用 CDN。到这里基本就可以正常访问使用。

#### 6、使用

建议在 ARC 浏览器里使用，置顶你的 huntly 站点，配合 ARC 的 Little Arc 小窗口，可以速度方便的查看内容。

同步 Twitter 内容到 huntly 里需要去[官方的 GitHub](https://github.com/lcomplete/huntly/) 下载安装插件，并设置你的 huntly 地址。
