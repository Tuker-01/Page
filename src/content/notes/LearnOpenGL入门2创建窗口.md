---
title: LearnOpenGL入门2创建窗口
summary: 创建窗口
category: LearnOpenGL
date: 2026-11-25
tags:
  - OpenGL
---

## 正文标题
正文里的 `##` 和 `###` 标题会自动生成右侧目录大纲。
### 窗口
1.新建一个CPP文件然后复制下面的代码
确保包含GLFW的头文件之前包含了GLAD的头文件
```
#include <glad/glad.h> 
#include <GLFW/glfw3.h>
```

2.创建main函数，实例化GLFW窗口
```
int main() 
{ 
glfwInit(); 
glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3); //主版本  glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);//次版本
glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);//核心模式    glfwWindowHint(GLFW_RESIZABLE, GL_FALSE); //禁止调整窗口大小

return 0; 
}
```
	1.调用glfwInit()函数来初始化GLFW，使用glfwWindowHint函数来配置GLFW
	2.glfwWindowHint函数第一个参数代表选项的名称，第二个参数接受一个整形设置这个选项的值
	3.因为使用的是OpenGL3.3，因此使用主版本MAJOR和次版本号MINOR都设为3。
	4.使用核心模式
	5.禁止调整窗口大小

3.创建窗口对象，存放所有和窗口相关的数据，而且会被GLFW的其他函数频繁使用到

```
GLFWwindow* window = glfwCreateWindow(800, 600, "LearnOpenGL", nullptr, nullptr); if (window == nullptr) 
{ 
	std::cout << "Failed to create GLFW window" << std::endl; 
	glfwTerminate(); 
	return -1; 
} 
glfwMakeContextCurrent(window);
```
	1.glfwCreateWindow函数需要窗口的宽和高作为它的前两个参数，第三个参数表示这个窗口的标题
	最后两个参数暂时忽略
	2.GLFWwindow对象的指针会在其他的GLFW操作中使用到

#### GLAD
GLAD是用来管理OpenGL函数指针的，调用任何OpenGL的函数之前需要初始化GLEW
```
if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) 
{ 
	std::cout << "Failed to initialize GLAD" << std::endl;
	return -1; 
}
```
	1.给GLAD传入了用来加载系统相关的OpenGL函数指针地址的函数glfwGetProcAddress，根据编译的系统定义正确的函数


#### 视口
告诉OpenGL渲染窗口的尺寸大小，这样OpenGL才能知道如何显示窗口大小之类的数据与坐标
通过glViewport函数来设置窗口的维度
```
glViewport(0, 0, 800, 600);
```
	1.glViewport函数前两个参数控制窗口左下角的位置，第三个和第四个参数控制渲染窗口的宽度和高度（像素）


当用户调整窗口时，视口也应该被调整，因此注册一个回调函数framebuffer_size_callback，每次窗口改变的时候被调用，
	输入：GLFWwindow作为它的第一个参数，以及两个整数表示窗口的新维度。每当窗口改变大小，GLFW会调用这个函数并填充相应的参数供你处理。
	输出：新的窗口数据
```
void framebuffer_size_callback(GLFWwindow* window, int width, int height) 
{ 
	glViewport(0, 0, width, height);
}
```

调用这个函数
```
glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
```

### 准备好你的引擎
希望程序在明确关闭之前不断绘制图像并且能够接受用户输入，因此需要添加循环让GLFW退出之前也一直保持运行。
```
while(!glfwWindowShouldClose(window)) 
{ 
	glfwSwapBuffers(window);
	glfwPollEvents();
}
```
	1.glfwWindowShouldClose函数在循环开始前检查一次GLFW是否要求退出，如果是的化返回ture
	   就可以关闭程序了
	2.glfwPollEvents函数用来检查有没有触发什么事件，然后调用对应的回调函数
	3.glfwSwapBuffers函数会交换颜色缓冲，它在这一迭代中被用来绘制，并且将会作为输出显示在屏幕上

### 渲染结束之后

渲染循环结束后需要正确释放/删除之前的分配的所有资源。在main函数的最后调用glfwTerminate函数来完成。
```
glfwTerminate(); 
return 0;
```


输入


本节具体代码如下:

```
#include <iostream>

// 1.先导入GLAD
#include <glad/glad.h>

// 1.再导入GLFW
#include <GLFW/glfw3.h>

// Function prototypes
void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode);

// Window dimensions
const GLuint WIDTH = 800, HEIGHT = 600;

// 2.创建main()函数，实例化窗口
int main()
{
    std::cout << "Starting GLFW context, OpenGL 3.3" << std::endl;
    
    // 2.初始化GLFW
    glfwInit();
    
    // 2.设置主次版本号/核心模式/禁止调整窗口大小
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);

    // 3.创建GLFW窗口对象
    GLFWwindow* window = glfwCreateWindow(WIDTH, HEIGHT, "LearnOpenGL", nullptr, nullptr);//3.glfwCreateWindow接受参数为宽、高、窗口名称、后两个参数暂时忽略
    if (window == nullptr)
    {
        std::cout << "Failed to create GLFW window" << std::endl;
        glfwTerminate();
        return -1;
    }
    glfwMakeContextCurrent(window);
    // Set the required callback functions
    glfwSetKeyCallback(window, key_callback);

    // 4.初始化GLAD
    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
    {
        std::cout << "Failed to initialize GLAD" << std::endl;
        glfwTerminate();
        return -1;
    }

    // Define the viewport dimensions
    int width, height;
    glfwGetFramebufferSize(window, &width, &height);
    glViewport(0, 0, width, height);

    // Game loop
    while (!glfwWindowShouldClose(window))
    {
        // Check if any events have been activiated (key pressed, mouse moved etc.) and call corresponding response functions
        glfwPollEvents();

        // Render
        // Clear the colorbuffer
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        // Swap the screen buffers
        glfwSwapBuffers(window);
    }

    // Terminate GLFW, clearing any resources allocated by GLFW.
    glfwTerminate();
    return 0;
}

// Is called whenever a key is pressed/released via GLFW
void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode)
{
    std::cout << key << std::endl;
    if (key == GLFW_KEY_ESCAPE && action == GLFW_PRESS)
        glfwSetWindowShouldClose(window, GL_TRUE);
}
```


