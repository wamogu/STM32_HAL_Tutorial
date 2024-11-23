# STM32 HAL库入门教程介绍

> 使用`CubeMX`生成初始化代码，在`VScode`中使用EIDE插件编译，编译链为GCC，版本控制使用Git和可视化GUI（SourceTree）

## 开发方式
目前STM32有四种的开发方式，即寄存器、标准库、HAL库、LL库：

| 库类型 | 可移植性 | 优化 | 上手 | 可读性 | 支持范围 |
| :----: | :------: | :--: | :--: | :----: | :------: |
| 寄存器 |          | +++  |      |        |    +     |
| 标准库 |    ++    |  ++  |  +   |   ++   |    ++    |
| HAL库  |   +++    |  +   |  ++  |  +++   |   +++    |
|  LL库  |    +     | +++  |  +   |   ++   |    ++    |

以往教程中，诸如正点原子F1系列的教程，基本上是以标准库为主要开发方式，辅以寄存器理解进行初始化配置和开发。这样讲课可以讲得很细，能深入到MCU的内核中，了解各个外设的工作方式，但代价是课程时间长，及时视频资源丰富也难以坚持下来。加上目前F1系列的32单片机价格居高不下，在一些初始配置时标准库也很头疼。本篇文章主要以**HAL库**的入门开发教程为主，辅以一些偏应用的程序讲解，以为了更快应用的到实际的项目中

**正点原子学习路线：** 运作原理→初始化配置方式→简单应用→应用拓展

**本篇教程学习路线:**    外设功能→应用需求→快速初始化配置→应用拓展

因此，本篇课程强调应用和程序逻辑，受限于作者开发水平，想学习单片机底层工作方式或有更复杂项目需求还请浏览其他资料

## HAL库和CubeMX

HAL库大致原理上和标准库类似，都是将底层寄存器操作利用函数进行封装，用户初始化或者使用时利用声明结构体的方式进行初始化或者使用。不过HAL的封装程度更高，将一些外设配置进行了整合，随之而来的是代码运行效率的降低。好在现在单片机性能都很强，可选型号丰富，暂时不用过于担心代码程序臃肿效率低，或者交叉使用HAL库和LL库开发也可以

即便如此，各种初始化配置还是离不开翻阅数据手册或者阅读文章，当涉及到IO口的复用和映射时更是如此。为了解决这个问题，本教程示例的所有代码工程均由CubeMX生成初始化项目，淡化初始化的原理转而强调代码逻辑

## VS code 和 GCC

通常编译开发STM32项目我们使用的MDK软件，作为一个老牌的开发环境，MDK资料丰富，调试清晰bug较少，完成破解后就可以流畅开发。不过它存在开发界面有点老旧，对一些新功能的支持性不是很好，默认使用的AC5编译器编译大项目速度慢，AC6编译警告较多等一些不便。

对比之下，VS code的开发界面清晰软件开源免费，支持多种插件，使用GCC时编译速度很快，整体码代码体验较好。虽然也有着诸如插件环境配置繁琐，出问题后网上资料案例较少，调试起来不如MDK清晰明确等弊端。但本教程将尽力讲清楚开发过程的各个注意事项，尽可能多地解决各类问题。

故开发环境使用VS code配合EIDE等插件开发，在后续应用中稍微提及MDK以方便旧工程项目的移植

## 版本控制管理Git

Git作为一个优秀的版本控制管理软件在实际公司生产开发环节有着广泛的使用，配合云端代码托管平台（GitHub、Gitee）可以实现代码的云端备份或多人协同开发，对我们的实际开发学习过程有着很大的帮助。

不过因为其操作都在命令行中进行，新手难以入门，遇上当前版本和云端不匹配或分支、合并操作时更是让人头疼，最后这个软件在大学一般教学中并不是很能推广开来。因此，本教程会在搭建环境时，教会各位使用SourceTree软件对Git进行可视化操作管理，课程中的代码demo也会同步到作者的个人Gitee，希望各位能养成良好的工程项目习惯

# 教程索引
