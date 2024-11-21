<span id="hidden-autonumber"></span>

<h1 class="article-title">STM32-IIC</h1>

#SPI
>SPI协议【Serial Peripheral Interface】为串行外围设备接口，是一种高速全双工的同步通信总线。主要用在MCU与FLASH\ADC\LCD等模块之间的通信。[文章参考](https://blog.csdn.net/u014470361/article/details/79015712)

##SPI的信号线
SPI通常包含4条总线
- **SS（Slave Select）**：片选信号线，当有多个SPI 设备与 MCU 相连时，每个设备的这个片选信号线是与 MCU 单独的引脚相连的，而其他的 SCK、MOSI、MISO 线则为多个设备并联到相同的 SPI 总线上，低电平有效

- **SCK （Serial Clock）**：时钟信号线，由主通信设备产生，不同的设备支持的时钟频率不一样，如 STM32 的 SPI 时钟频率最大为 f PCLK /2

- **MOSI （Master Output Slave Input）**：主设备输出 / 从设备输入引脚。主机的数据从这条信号线输出，从机由这条信号线读入数据，即这条线上数据的方向为主机到从机

- **MISO（Master Input Slave Output）**：主设备输入 / 从设备输出引脚。主机从这条信号线读入数据，从机的数据则由这条信号线输出，即在这条线上数据的方向为从机到主机

SPI可以以下图的方式连接多个外设。
![SPI连线](assets\SPI连线.png)
其中SCK，MOSI，MISO是接在一起的，NSS分别接到不同的IO管脚控制。主器件要和从器件通信就先拉低对应从器件的NSS管脚使能。默认状态IO1,IO2,IO3全为高电平，当主器件和从器件1通信时，拉低IO1管脚使能从器件1。而从器件2,3不使能，不作响应

##SPI特性
- 单次传输可选择为 8 或 16 位。
- 波特率预分频系数(最大为 fPCLK/2) 。
- 时钟极性(CPOL)和相位(CPHA)可编程设置。
- 数据顺序的传输顺序可进行编程选择，MSB 在前或 LSB 在前。
- 可触发中断的专用发送和接收标志。
- 可以使用 DMA 进行数据传输操作。
>注：MSB(Most Significant Bit)是“最高有效位”，LSB(Least Significant Bit)是“最低有效位”

下为STM32的SPI框架图：
![SPI框架图](assets\SPI框架图.png)
如上图，MISO数据线接收到的信号经移位寄存器处理后把数据转移到接收缓冲区，然后这个数据就可以由我们的软件从接收缓冲区读出了。

当要发送数据时，我们把数据写入发送缓冲区，硬件将会把它用移位寄存器处理后输出到 MOSI数据线。

SCK 的时钟信号则由波特率发生器产生，我们可以通过波特率控制位（BR）来控制它输出的波特率。

控制寄存器 CR1掌管着主控制电路，STM32的 SPI模块的协议设置（时钟极性、相位等）就是由它来制定的。而控制寄存器 CR2则用于设置各种中断使能。

最后为 NSS引脚，这个引脚扮演着 SPI协议中的SS片选信号线的角色，如果我们把 NSS引脚配置为硬件自动控制，SPI模块能够自动判别它能否成为 SPI的主机，或自动进入 SPI从机模式。但实际上我们用得更多的是由软件控制某些 GPIO引脚单独作为SS信号，这个 GPIO引脚可以随便选择。

##SPI时钟时序
根据时钟极性（CPOL）及相位（CPHA）不同，SPI有四种工作模式。

**时钟极性(CPOL)定义了时钟空闲状态电平**

- CPOL=0为时钟空闲时为低电平
- CPOL=1为时钟空闲时为高电平

**时钟相位(CPHA)定义数据的采集时间**

- CPHA=0:在时钟的第一个跳变沿（上升沿或下降沿）进行数据采样。
- CPHA=1:在时钟的第二个跳变沿（上升沿或下降沿）进行数据采样。

具体时序如下图所示
![SPI时序](assets\SPI时序.png)

##教程分布

- [CubeMX配置及主要函数](./CubeMX配置及主要函数.md)
- [OLED驱动移植](./OLED驱动移植.md)
- [LVGL移植显示](./LVGL移植显示.md)
- [Flash的使用及文件系统](./Flash的使用及文件系统.md)