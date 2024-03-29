# 概览

react 的版本更新较快, 目前是以 16.13 版本为主, 所以如果发现有不一样的地方, 请以最新的版本为主;

### 阅读准备

在阅读 react 源码之前, 需要注意以下几点:

- 全局变量, react 都是直接给全局变量赋值然后调用函数时再去判断, 初期看起来会很累, 不要在意这些细节;
- 位运算, react 中的 lane 就是使用位运算做了大量的处理;
- 链表, react 中用到了很多链表, 一些看上去很复杂的东西可能就是在构建循环链表, 了解下思想就行;

### 文件目录

react 的东西很多, 目前都是分包加载的, 都在 packages 文件夹内, 我们主要关注一下几个文件夹即可

```
react: 元素定义
react-art: 渲染器
react-dom: dom 树的渲染器
react-native-renderer: 将 React 组件渲染为 Native 视图。此渲染器在 React Native 内部使用
react-test-renderer: 将 React 组件渲染为 JSON 树
react-reconciler: 协调算法，如 fiber 等这些更新渲染机制等
schedular: 任务调度
legacy-events: 合成事件
```

### 架构概览

我们都知道 react 有虚拟 dom, 实际上我们所写的 div 这些都是抽象的语法, 在虚拟层处理完毕后会由对应的渲染器渲染, 这也是 react 宣传的 learn once, write anywhere, 只要核心通用, 移植到其他平台只需要加一层渲染层即可;

以浏览器端为例, 我们写的代码首先会通过 react-reconciler 构建, 然后使用 react-dom 渲染到 DOM 里, 每次 setState 的时候会在当前节点上打上标记, 然后向上返回到 root 节点, 开始从上往下的比对更新, 然后将需要更新的节点串联起来, 等收集完所有需要更新的节点后, 然后将需要更新的内容 commit 出去, 也就是只更新改变的地方;

schedular 其实也是配合 react-reconciler 的, 不能算是单独的一层, 它是 react 的时间切片的处理机制, 会根据浏览器的刷新率中断遍历, 留出页面渲染时间, 同时也会根据优先级安排任务的执行顺序;

### 更新阶段

react 的组件更新很明显是分成三个阶段的:

- schedular, 任务调度, 紧急的更新会排到前面去, 不紧急的更新会排到后面去, 主要根据内部的优先级划分
- reconciler, 内部比对, 也就是组件的遍历以及 diff, 引进时间切片后可中断, 同时可能会分成多次去遍历
- commit, 最终渲染, 一旦进入此阶段就会确定最终的结果

但是就目前而言, schedular 的意义不大, 因为现在都是同步任务, 所以主要还是关注 reconciler 以及 commit 两个阶段, 这也涉及到了 16 版本废弃的生命周期, 因为有些生命周期是 reconciler 阶段的, 可能会多次执行, 所以有副作用的函数只能放在 commit 阶段去做;

### fiber

fiber 这是个很大的更新, 但是很多文章的理解都有点偏差, 所以这里也着重解释一下;

fiber 其实是个类型定义, react 将每个组件都抽象成了 fiber 对象, 然后通过链表将他们串联起来, 举个例子:

```js
<Parent>
  <Child1>
    <SubChild1 />
  </Child1>
  <Child2 />
</Parent>
```

当遍历 Parent 组件时, 会先遍历 child, 没有 child 则遍历 sibling, 两者都没有则 return 返回上一个节点;

下面是伪代码, 实际上这就是深度优先遍历, 只不过 react 新增几个指针将其设计为可以中断的, 也就是说我们的虚拟 DOM 的比对随时可以中止, 下次还能继续从中断的地方继续比对, 给浏览器渲染留下时间;

```js
let current = Parent;
while (current) {
  diff(current);
  if (current.child) {
    current = current.child;
  } else if (current.sibling) {
    current = current.sibling;
  } else {
    current = current.return;
  }
}
```

很遗憾 fiber 实际上的工作就只有这么点, 至于很多人宣传的时间切片, 实际上是 concurrent 的功能, fiber 只是为它提供了基础, 所以有人说 fiber 就是时间切片, 这个其实是不准确的;

### concurrent

实际上 concurrent 就是一个模式, 也就是一个 tag, 它决定了组件的更新方式, 仔细看源码的话, 目前只有 concurrent 模式的组件才能中止遍历, 给浏览器留出渲染的时间, 而正常的 setState 都是直接一次性遍历完的, 时间切片是一个大的更新, 应该会在 17 版本上线, 目前只是打基础而已;

想要实现时间切片并不是将遍历可中断这么简单, 因为就我们操作而言, 所有的任务都是相同优先级, 并不需要我们手动去传递优先级参数, react concurrent 将更新划分的十分细致, 甚至可以将一次更新拆分成多个, 输入等高及时性的则这些优先响应, 低优先级的则延迟更新甚至可以废弃, 可以说是功能强大, 但是也没这么简单就能完成, 内部设计也是一改再改, 迟迟没有发布;
