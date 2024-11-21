# OLED驱动移植

> 移植库函数的OLED驱动到HAL库下，了解一般移植过程

## IO口配置

根据上一小节所学内容，我们配置OLED所用到的四个IO口，其中CS和DC引脚都是输出模式

- **SCK：** SPI2的SCK，使用PB13引脚
- **MOSI:** SPI2的MOSI，使用PB15引脚
- **OLED_CS:** OLED的片选引脚，使用PB12
- **OELD_DC:** OLED的指令\数据标识引脚，使用PB10

![OLED引脚配置](assets\OLED引脚.png)

> **DC:** 含义Data (or) Command，通过控制这个引脚的高低电平，来告诉OLED驱动输入的是**指令还是数据**

之后如果需要一些调试外设，可以自行打开串口或者LED以及按键等外设，完成创建相应工程

## 程序准备

目前常用的屏幕模块大多来自于[中景园电子](https://zjy-display.taobao.com/shop/view_shop.htm?spm=a230r.1.14.19.35b45078qJwVEe&user_number_id=914671862)，很多小号屏幕模块都能在这买到，根据屏幕大小或者**显示驱动**可以找到很多可选模块。而拿到一个新的屏幕模块后，至少找到该屏幕的显示驱动，然后去网上找到商家提供的示例代码后就可以开始本节课的内容。给各位提供的1.29寸OLED模块是ch1115驱动，商品页参考[此处](https://item.taobao.com/item.htm?spm=a1z10.5-c-s.w4002-23284685151.22.7de44543WFF4gd&id=634148945663)

下载卖家提供的资料后，我们找到程序源码中的如下路径文件夹，整个复制到创建的SPI工程中：

![添加OLED源码](assets\添加OLED源码.png)

之后在VS code打开工程，添加相应的文件夹到工程中：

![工程添加文件夹](assets\工程添加文件夹.png)

## 库函数代码修正

### 头文件代码更改

在`main.h`中添加以下定义：

```c
/* USER CODE BEGIN Private defines */
typedef uint8_t u8;
typedef uint16_t u16;
typedef uint32_t u32;
/* USER CODE END Private defines */
```

打开`oled.h`修正以下库函数的代码：

![库函数头文件修正](assets\库函数头文件修正.png)

```c
#include "main.h"
#include "stdlib.h"

//-----------------OLED端口定义----------------
#define OLED_DC_Clr()  HAL_GPIO_WritePin(OLED_DC_GPIO_Port, OLED_DC_Pin, 0)//DC
#define OLED_DC_Set()  HAL_GPIO_WritePin(OLED_DC_GPIO_Port, OLED_DC_Pin, 1)

#define OLED_CS_Clr()  HAL_GPIO_WritePin(OLED_CS_GPIO_Port, OLED_CS_Pin, 0)//CS
#define OLED_CS_Set()  HAL_GPIO_WritePin(OLED_CS_GPIO_Port, OLED_CS_Pin, 1)

#define OLED_CMD  0	//写命令
#define OLED_DATA 1	//写数据
```

其中`sys.h`是库函数的头文件，这里改为使用HAL库的，可以直接包含`main.h`；而**SCL、SDA为通讯引脚**，因为我们**使用硬件控制的传输协议**，通信引脚的时钟和数据线传输具bit位时的细节我们可以不用在意，所以可以直接删除这两行宏定义；**RES**为OLED驱动的复位引脚，硬件连接上可以直接接上高电平，故这里也可以删除。

### 源文件代码更改

删除`delay.h`头文件的引用，该文件为库函数方式下实现的延时，而我们是使用HAL的，故将其删除：

![删除库函数头文件](assets\删除库函数头文件.png)

找到以下IO初始化的代码段（部分是定义了一个函数），将其删除；CubeMX生成代码时，已经包含了IO口的相应配置，不需要再次配置：

![删除初始化代码](assets\删除初始化代码.png)

## 向OLED发送一个字节

### 模拟方式时序解读

找到如下函数：

![模拟SPI时序](assets\模拟spi时序.png)

这一块是对接OLED驱动时最关键的一个函数，其功能是向驱动芯片发送一个字节的数据，并告知该驱动这个字节是**数据**还是**命令**，具体流程为：

- 由输入参数cmd判断改指令是否是数据，如果是，则将DC引脚置为高电平
- 片选引脚拉低，选中OLED驱动
- 在for循环中开始**逐个bit**传输数据
- 传输完成后CS和DC引脚置高电平，回到初始状态

这里的for循环代码为模拟的SPI时序代码，时钟线和数据线都是**手动**控制，其逻辑为：

- 时钟线拉低，等待数据线转换
- 判断**待传输数据的最高位**，依据该最高位设置数据线的电平
- 时钟线拉高，**通过上升沿发送数据**
- 将待发送的**数据移位**，进入下一次循环时发送下一个bit位

在剩余IO口没有SPI功能，或者硬件SPI功能不方便使用时，我们参考这样的方式编写模拟的通信时序

### 时序程序更改

本次移植我们使用**硬件SPI协议通信**，可以直接调用相应的SPI发送函数

在`oled.c`的文件开头外部引用相应句柄，规定相应宏定义方便后续移植：

```c
#include "oledfont.h"

extern SPI_HandleTypeDef hspi2;
#define OLED_SPI hspi2

u8 OLED_GRAM[144][8];

```

将发送一个byte的函数改为

```c
void OLED_WR_Byte(u8 dat, u8 cmd)
{
	if (cmd)
		OLED_DC_Set();
	else
		OLED_DC_Clr();
	OLED_CS_Clr();
	HAL_SPI_Transmit(&hspi2, &dat, 1, 0xFF);
	OLED_CS_Set();
	OLED_DC_Set();
}
```

## 驱动代码对接

参考卖家所给历程的程序代码，在`main.c`添加如下代码：

### 相应头文件的引用：

```
/* USER CODE BEGIN Includes */
#include "oled.h"
#include "bmp.h"
/* USER CODE END Includes */
```

### 初始化代码和变量定义：

```c
  /* USER CODE BEGIN 2 */
  u8 t = ' ';

  OLED_Init();
  OLED_ColorTurn(0);   //0正常显示，1 反色显示
  OLED_DisplayTurn(0); //0正常显示 1 屏幕翻转显示
  /* USER CODE END 2 */
```

### 测试代码

```c
  while (1)
  {
    	OLED_ShowPicture(0, 0, 128, 64, BMP1, 1);
		OLED_Refresh();
		HAL_Delay(500);
		OLED_Clear();
		OLED_ShowChinese(0, 0, 0, 16, 1);	//中
		OLED_ShowChinese(18, 0, 1, 16, 1);	//景
		OLED_ShowChinese(36, 0, 2, 16, 1);	//园
		OLED_ShowString(8, 16, "ZHONGJINGYUAN", 16, 1);
		OLED_ShowString(20, 32, "2014/05/01", 16, 1);
		OLED_ShowString(0, 48, "ASCII:", 16, 1);
		OLED_ShowString(63, 48, "CODE:", 16, 1);
		OLED_ShowChar(48, 48, t, 16, 1); //显示ASCII字符
		t++;
		if (t > '~')
			t = ' ';
		OLED_ShowNum(103, 48, t, 3, 16, 1);
		OLED_Refresh();
		HAL_Delay(500);
		OLED_Clear();
		OLED_ShowChinese(0, 0, 0, 16, 1);	//16*16 中
		OLED_ShowChinese(16, 0, 0, 24, 1);	//24*24 中
		OLED_ShowChinese(24, 20, 0, 32, 1); //32*32 中
		OLED_ShowChinese(64, 0, 0, 64, 1);	//64*64 中
		OLED_Refresh();
		HAL_Delay(500);
		OLED_Clear();
		OLED_ShowString(0, 0, "ABC", 8, 1);	  //6*8 “ABC”
		OLED_ShowString(0, 8, "ABC", 12, 1);  //6*12 “ABC”
		OLED_ShowString(0, 20, "ABC", 16, 1); //8*16 “ABC”
		OLED_ShowString(0, 36, "ABC", 24, 1); //12*24 “ABC”
		OLED_Refresh();
		HAL_Delay(500);
		OLED_ScrollDisplay(11, 4, 1);
    /* USER CODE END WHILE */
```

之后就可以编译代码下载测试效果了

![OLED效果演示](assets\OLED效果演示.gif)

## 主要API

| 函数             | 功能       | 参数                      |
| ---------------- | ---------- | ------------------------- |
| OLED_Clear       | 清屏       | 无                        |
| OLED_Refresh     | 刷屏       | 无                        |
| OLED_ShowPicture | 显示图片   | x，y，宽，高，黑/白       |
| OLED_ShowChinese | 显示汉字   | x，y，编号，大小，黑/白   |
| OLED_ShowString  | 显示字符串 | x，y，字符串，大小，黑/白 |
| OLED_DrawLine    | 画线       | x1，y1，x2，y2，黑/白     |
| OLED_DrawCircle  | 画圆       | 圆心x，圆心y，半径        |

默认提供的驱动代码显示汉字时需要**自行取模**，绘制图形的函数也不够丰富，后面会介绍结合了[B站up开源代码](https://www.bilibili.com/video/BV1EC4y1872W?from=search&seid=18236455494321671647&spm_id_from=333.337.0.0)的字库图形库

# One more thing
## 字库图形库的使用
## API介绍

