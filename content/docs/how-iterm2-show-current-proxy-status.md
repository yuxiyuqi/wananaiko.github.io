---
title: "让 ITERM2 实时显示梯子状态"
date: 2023-01-08T23:04:09+08:00
draft: false
author: "wananaiko"
Tag: 
  - iterm
---

最近在 iterm2 里使用 curl、wget、brew、git 等命令时，经常会遇到相应很慢的情况，只能慢慢的等待，网上查了查资料，可以通过以下方法实现。

修改 `~/.zshrc`，并加入以下内容：

```hljs
export proxy_host=127.0.0.1
export proxy_port=8888//自定义梯子端口
export switch_proxy=0
export cdc_in=0
 
function pp(){
	if [ $switch_proxy = 0 ]; then
    export http_proxy="$proxy_host:$proxy_port"
    export https_proxy="$proxy_host:$proxy_port"
    export ftp_proxy="$proxy_host:$proxy_port"
    export GOPROXY="$proxy_host:$Proxy_port"
    switch_proxy=l
    echo -e "梯子模式"
  else
 
    unset http_proxy
    unset https_proxy
    unset ftp_proxy
    unset GOPROXY
    switch_proxy=0
 
    echo -e "和谐模式"
  fi
}
```

保存后退出，打开 iterm2，输入`pp`即可在梯子模式和和谐模式之间切换。

参考：[让 iTerm2 实时显示梯子状态 ](https://tin6.com/post/how-iterm2-show-current-proxy-status/)，还有另外两种方法。

![WLh4ok](https://images.wananaiko.com/2023/01/WLh4ok.png)
