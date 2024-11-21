#回调函数

和以往接触到的中断服务函数不同的是，HAL库下的中断处理并不是直接进入中断服务程序并在其中进行相应中断处理，而是**进入中断服务程序后，清除相应标志位，进入回调函数中处理**

如在`stm32f4xx_it.c`跳转到`HAL_GPIO_EXTI_IRQHandler(GPIO_PIN_0)`中有：

```c
void HAL_GPIO_EXTI_IRQHandler(uint16_t GPIO_Pin)
{
  /* EXTI line interrupt detected */
  if(__HAL_GPIO_EXTI_GET_IT(GPIO_Pin) != RESET)
  {
    __HAL_GPIO_EXTI_CLEAR_IT(GPIO_Pin);
    HAL_GPIO_EXTI_Callback(GPIO_Pin);
  }
}
```

以上是HAL中的中断服务程序，可以看出在`__HAL_GPIO_EXTI_CLEAR_IT()`清除相应标志位后，程序进入了一个叫做`HAL_GPIO_EXTI_Callback()`的回调函数，并传入了一个触发的引脚`(GPIO_Pin)`

#用户的中断服务程序

HAL库中所需要用到的中断回调函数都是弱定义，格式为`HAL_(中断的外设)_Callback(用于区分的参数)`我们可以在别的地方再次声明，添加自己的代码，如在`main.c`下方我们可以添加如下程序，实现按键切换灯的闪烁状态：

```c
/* USER CODE BEGIN 4 */
void HAL_GPIO_EXTI_Callback(uint16_t GPIO_Pin)
{
  static uint8_t tick = 0;
  if (GPIO_Pin == KEY_Pin)
  {
    tick = !tick;
    if (tick)
      LedStates = 0xAA;
    else
      LedStates = 0x0F;
  }
}
/* USER CODE END 4 */
```
主程序保持和以往课程一样即可：
```c
while (1)
{
  Led_Tick();
  HAL_Delay(5);
  /* USER CODE END WHILE */

  /* USER CODE BEGIN 3 */
}
```
#应用拓展
现在所配置的是按下按键触发的中断，那么该如何配置使其编程松手触发的中断？多个外部中断是否公用一个回调函数？