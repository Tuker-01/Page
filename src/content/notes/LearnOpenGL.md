---
title: LearnOpenGL——1
summary: 记录LearnOpenGL网站上的内容
category: OpenGL
date: 2026-11-24
tags:
  - OpenGL
---

## 什么是OpenGL
一般认为是API（Application Programming Interface, 应用程序编程接口），包含一系列可以操作图形、图像的函数，然而OpenGL本身并不是API,仅仅是由Khronos组织制定并维护的规范。

1.OpenGL严格规定每个函数如何输出，如何执行。
2.每个函数如何实现由OpenGL库的开发者实现，实际的OpenGL库的开发者通常是显卡的生产商编写
3.所有版本的OpenGL规范文档都被公开的寄存在Khronos那里

### 核心模式与立即渲染模式

早期的OpenGL使用立即渲染模式（也就是固定渲染管线），这个模式下绘制图形方便。但是OpenGL的大多数功能都被库隐藏起来，开发者很少能控制OpenGL进行计算的自由。
随着时间的推移，规范越来越灵活，开发者对绘图细节有了更多的掌控。

	1.立即渲染模式确实容易使用和理解，但是效率太低。从OpenGL3.2开始，规范文档开始废弃立即渲染模式，推出核心模式(Core-profile)，这个模式完全移除了旧的特性。

使用OpenGL的核心模式时，OpenGL迫使我们使用现代的函数。当我们试图使用一个已废弃的函数时，会抛出一个错误并终止绘图。

	1.现代函数的优势是更高的灵活性和效率，然而也更难于学习。

### 扩展

OpenGL的一大特性就是对扩展(Extension)的支持，当一个显卡公司提出一个新特性或者渲染上的大优化，通常会以扩展的方式在驱动中实现。（类似插件，只需要检查是否支持就行了）
使用的扩展的代码大多看上去如下
```
if(GL_ARB_extension_name) 
{ 
// 使用一些新的特性 
} 
else 
{ 
// 不支持此扩展: 用旧的方式去做
}
```

### 状态机

OpenGL自身是一个巨大的状态机：一系列变量描述OpenGL现在应当如何运行。
OpenGL的状态通常被称为OpenGL上下文

	通常使用如下途径去更改OpenGL的状态
	1.设置选项
	2.操作缓冲
最后使用OpenGL上下文（状态）来渲染。

### 对象

OpenGL内核是一个C库，因为C的一些语言结构不易背翻译到其他高级语言，所以引入抽象层，对象是其中一个

OpenGL中一个对象是指一些选项的集合，代表OpenGL状态的一个子集。例如可以用一个对象来代表绘图窗口的设置，之后就可以设置它的大小、颜色等。把对象看做一个C风格的结构体
```
struct object_name
{ 
 GLfloat option1;
 GLuint option2; 
 GLchar[] name; 
};
```

基元类型：使用OpenGL定义基元类型时。使用float加上前缀GLfloat。int、uint、char、bool等也类似

使用对象时，看起来如下
```
struct OpenGL_Context
{
	object * object_Window_Target;
}
```

```
// 创建对象 
GLuint objectId = 0;       //uint类型对象
glGenObject(1, &objectId); 

// 绑定对象至上下文 
glBindObject(GL_WINDOW_TARGET, objectId);
 
// 设置当前绑定到 GL_WINDOW_TARGET 的对象的一些选项 glSetObjectOption(GL_WINDOW_TARGET, GL_OPTION_WINDOW_WIDTH, 800); 
glSetObjectOption(GL_WINDOW_TARGET, GL_OPTION_WINDOW_HEIGHT, 600); 

// 将上下文对象设回默认
glBindObject(GL_WINDOW_TARGET, 0);
```
1.首先创建一个对象objcrtid
2.用id保存它的引用，实际数据存在后台
3.然后将对象绑定至上下文的目标位置，（例子中窗口对象目标的位置被定义成GL_WINDOW_TARGET）
4.设置窗口选项
5.将目标位置对象id设回0，解绑这个对象

### 创建窗口

#### GLFW

GLFW提供了一些渲染物体所需的最低限度的接口。
	1.允许用户创建OpenGL上下文
