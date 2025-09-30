---
title: 使用Grafana监控服务器
date: 2025-09-29T00:43:03.184Z
updated: 2025-09-29T00:43:03.184Z
featured: true
summary: "在非 root 用户下安装和部署 Grafana 监控 CentOS 8"
keywords: ["Grafana","Prometheus","node_exporter","CentOS8"]
---
## 监控原理
node_exporter 会收集 CentOS 8 服务器的系统指标（如 CPU、内存、磁盘使用情况），并通过 Prometheus 将其暴露给 Grafana
![Grafana监控原理](/images/grafana-monitor.jpg)
由于没有 root 权限，我们将使用二进制包进行安装
## 一、安装 node_exporter (在每一台被监控的 CentOS 8 上)
1. 下载 node_exporter
访问 [Prometheus 下载页面](https://prometheus.io/download/#node_exporter) 找到最新的 node_exporter for Linux amd64 的链接
在 CentOS 8 服务器上执行以下命令：
```bash
wget https://github.com/prometheus/node_exporter/releases/download/v1.9.1/node_exporter-1.9.1.linux-amd64.tar.gz
```

2. 解压并运行

```bash
tar -xvf node_exporter-1.9.1.linux-amd64.tar.gz
cd node_exporter-1.9.1.linux-amd64
./node_exporter
# 或者在后台运行
nohup ./node_exporter &
```

`node_exporter` 默认运行在 **9100** 端口

## 二、下载并安装 Prometheus (只需在一个监控服务器上安装)

Prometheus 作为一个中间层，会定期从 `node_exporter` 拉取（scrape）监控数据并存储，然后 Grafana 再从 Prometheus 查询数据进行展示

1. 访问 [Prometheus 官网下载页面](https://prometheus.io/download/)  获取最新的 Linux 版本链接

使用`wget`命令下载并解压，步骤同上

2. 配置 Prometheus

编辑配置文件 `prometheus.yml`，文件的末尾有一个 `scrape_configs` 部分。默认情况下，它只监控 Prometheus 自己。

在 `scrape_configs` 下面**添加一个新的 job**，来监控 CentOS 8 服务器。假设被监控的 CentOS 8 服务器 IP 是 `192.168.1.100`，并且 `node_exporter` 在该服务器的 9100 端口上运行

```yaml
# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  # 新增这个 job 来监控你的 CentOS 8 服务器
  - job_name: "centos8-node"
    # The scrape interval is how often Prometheus will poll the target.
    scrape_interval: 15s 
    static_configs:
      - targets: ["192.168.1.100:9100"] # <--- 把这里换成你被监控服务器的 IP 和 node_exporter 端口
        labels:
          instance: "CentOS8-Server-01" # 可以给这个实例起个别名
```

如果你有多台服务器需要监控，可以在 `targets` 列表里继续添加，例如：`["192.168.1.100:9100", "192.168.1.101:9100"]`

3. 启动Prometheus 

```bash
nohup ./prometheus --config.file=prometheus.yml &
```

`Prometheus ` 默认运行在 **9090** 端口，访问 `http://<监控服务器IP>:9090/targets` 来检查 Prometheus 是否成功连接到了`node_exporter`。如果 "State" 显示为 "UP"，则表示一切正常

## 三、下载并安装 Grafana (只需在一个监控服务器上安装)

1. 下载解压流程同上，进入`bin`目录运行

```bash
cd grafana-10.1.5/bin
nohup ./grafana-server &
```

2. 访问 Grafana Web 界面

    Grafana 默认运行在 **3000** 端口，访问 `http://<服务器IP>:3000`

    - **默认用户名**：`admin`
    - **默认密码**：`admin`

    首次登录后，系统会提示修改密码

3. 在 Grafana 中配置数据源和仪表盘

    - 添加 Prometheus 数据源

    1. 在左侧菜单中，点击齿轮图标 (Configuration) -> **Data Sources**。

    2. 点击 **Add data source**。

    3. 选择 **Prometheus**。

    4. 在 **HTTP** -> **URL** 字段中，填入 `http://localhost:9090` (Prometheus 默认的地址)。

        **一个更简单的临时方案（不推荐用于生产环境）：** 如果不想单独安装 Prometheus，可以为每一台被监控的机器单独添加一个 Prometheus 数据源，URL 直接指向那台机器的 `node_exporter` 地址，例如 `http://<被监控的CentOS8服务器IP>:9100`。

    5. 点击 **Save & test**。

    - 导入 Node Exporter 仪表盘

    Grafana 社区有大量预置的仪表盘可供使用。

    1. 在左侧菜单中，点击 “+” (Create) -> **Import**
    2. 在 **Import via grafana.com** 字段中，输入 `1860` (这是一个非常流行的 Node Exporter 仪表盘 ID)，`8919`也不错
    3. 点击 **Load**
    4. 在下一个页面中，选择刚才创建的 Prometheus 数据源
    5. 点击 **Import**。

    完成这些步骤后，应该就能在 Grafana 仪表盘上看到 CentOS 8 服务器的各项性能指标了
