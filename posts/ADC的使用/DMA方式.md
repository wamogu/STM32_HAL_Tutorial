#DMA简介

在前两种方式中，都是由**CPU搬运外设数据到内存**的方式，小的数据还好，大的数据会占用很长的处理周期，即使使用中断处理也会有很多的中断请求需要处理。那么可不可以让外设数据自动跑到我们指定的内存呢，这个时候就需要使用DMA传输了。

DMA **(Direct Memory Access 直接内存存取)**是一种可以大大减轻CPU工作量的数据转移方式。简单来说开始DMA传输后我们就像是给数据两段打开了一个溜槽，让大量数据可以自动地跑到另一边，这个过程不需要CPU的参与。以ADC的值为例：

![](图片\DMA示意图.png)

当然，DMA不仅可以用于外设到内存，也可以自定义其他方向：

- 外设到内存
- 外设到外设
- 内存到外设
- 内存到内存

可以广泛用于LCD屏幕的刷新，大量数据的采样分析等场景。



本章我们先试试ADC的DMA的使用，而使用了DMA的好处是，采样值的读取不需要我们再去调用函数读取，这个时候我们可以放着ADC一直转换，把数据放到我们定义的一个缓存区，我们只需要定时读取缓冲区即可

#单通道ADC的DMA

开启DMA传输后我们可以对单个通道进行多次的采样取平均值，并且这个采样的过程不需要我们的参与

##单通道DMA传输CubeMX配置

和阻塞方式以及中断的略有不同，我们需要先打开ADC的DMA：

![](图片\打开DMA.png)

对其进行一些配置：

![](图片\DMA配置.png)

其中：

- 请求外设：默认设置，规定当前配置的DMA用于哪个外设
- 传输流：默认设置，和ADC的概念类似，STM32有若干个DMA，每个DMA有若干个数据量可以用于配置传输
- 传输方向：自定义，可以选择是把外设的数据移动内存还是永内存通过DMA传输更新到外设
- 优先级：当使用了同个DMA并且同时有传输请求时，优先处理哪一个

- 传输模式：可以设置只传输一次还是一直传输
- 地址自动累加：传输如数组一类数据时，可以逐个发送
- 数据宽度：通常和外设的数据程度对应，如ADC的返回值是一个16bit的数据

接着配置ADC的**连续转换**模式以及**使能DMA请求**：

![](图片\DMA单通道配置.png)

另外，需要检查代码生成时，DMA的初始化是否在ADC之前，如果不在可以按如下方式调整：

![](图片\DMA初始化顺序调整.png)

##代码编写

定义一个缓冲区用于存放采样值，**建议采样数大于20**，因为DMA方式读取时也会产生大量的中断请求，如果采样数太少主线程会因为一直响应请求而卡死：

```c
/* USER CODE BEGIN PFP */
#define BUF_LEN 100
uint16_t adcValue[BUF_LEN] = {0};
/* USER CODE END PFP */
```

在主函数中调用一次DMA即可，使用`HAL_ADC_Start_DMA()`函数，该函数和之前的传输函数很像，分别是**句柄、接收缓存区、长度**，而while(1)中100ms计算一次采样的平均值：

```c
  uint32_t adcAvg = 0;
  HAL_ADC_Start_DMA(&hadc1, (uint32_t *)adcValue, BUF_LEN);
  while (1)
  {
    for (int i = 0; i < BUF_LEN; i++)
      adcAvg += adcValue[i];
    adcAvg = adcAvg / BUF_LEN;
    log_i("adc: %d >> %dmv", adcAvg, (int)(adcAvg * 0.805));
    HAL_Delay(500);
    /* USER CODE END WHILE */

    /* USER CODE BEGIN 3 */
  }
```

测试效果如下：

![](图片\ADC单通道DMA方式.png)

#多通道ADC的DMA

多通道类似，直接上教程：

##多通道DMA传输CubeMX配置

和阻塞以及中断方式一样，需要打开扫描模式以及DMA相关的连续转换和DMA请求，以及配置相应通道：

> **再次提醒，ADC悬空时会发生串扰，此时测的值不准**

![](图片\ADC多通道DMA配置.png)

##代码编写

和单通道相比，需要分别计算多个通道的采样平均值，简单验证代码如下：

```c
/* USER CODE BEGIN WHILE */
  uint32_t adcAvg[4] = {0};
  HAL_ADC_Start_DMA(&hadc1, (uint32_t *)adcValue, BUF_LEN);
  while (1)
  {
    for (int i = 0; i < BUF_LEN; i += 4)
    {
      adcAvg[0] += adcValue[i];
      adcAvg[1] += adcValue[i + 1];
      adcAvg[2] += adcValue[i + 2];
      adcAvg[3] += adcValue[i + 3];
    }
    for(int i = 0; i < 4; i++)
    {
      adcAvg[i] = adcAvg[i] * 4 / BUF_LEN;
      log_i("adc%d: %d >> %dmv", i, adcAvg[i], (int)(adcAvg[i] * 0.805));
      adcAvg[i] = 0;
    }
    log_i("complete\n\n");
    HAL_Delay(500);
    /* USER CODE END WHILE */

    /* USER CODE BEGIN 3 */
  }
```

效果如下：

![](图片\ADC多通道DMA方式.png)

#One more thing

##给ADC的DMA测个速

我们在中断中设置一个times用于计数，计算一秒内ADC能完成多少次转换：

在可以ADC的DMA传输实现的基础下，接收长度改为10，定义一个times用于计数；在while(1)中定时计算打印；在回调函数中计数。

定义如下全局变量：

```c
/* USER CODE BEGIN PFP */
#define BUF_LEN 10
uint16_t adcValue[BUF_LEN] = {0};
uint32_t times = 0;
/* USER CODE END PFP */

```

在主函数里：

```c
HAL_ADC_Start_DMA(&hadc1, (uint32_t *)adcValue, BUF_LEN);
  while (1)
  {
    log_i("times = %d\n", times * BUF_LEN);
    times = 0;
    HAL_Delay(1000);
    /* USER CODE END WHILE */

    /* USER CODE BEGIN 3 */
  }
```

在回调函数中：

```c
/* USER CODE BEGIN 4 */
void HAL_ADC_ConvCpltCallback(ADC_HandleTypeDef *hadc)
{
  times++;
}
/* USER CODE END 4 */
```

测试结果：

![](图片\DMA测速.png)

可以看到，ADC在当前配置下每秒可以完成1.4M次转换，这个数据量是相当惊人的。如果保持那么高的一个采样速率，需要大量的缓存或者高速的处理频率，这对简单实用场景来说有点大材小用。

因此，我们可以改变分频数或延长采样时间来降低速度，提高稳定性：

![](图片\ADC降速.png)

##更好的触发方式

直到目前，所有的ADC转换都是软件触发的，这在一些时间精度高的场景不是很好，因此可以选用定时器触发的方式，这些内容会在[应用示例章节](应用示例.md)教给大家。