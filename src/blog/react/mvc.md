# React 中的 MVC 模式尝试

根据上一篇的文章，我们可以初步的将业务逻辑抽象出来，然后使用 react 的 hooks 来进行了 UI 的渲染以及交互展示

但是这展示了一个方向，那就是我们将业务的逻辑全部抽象出来之后，UI 其实就是很浅的一层

那这样我们就能利用 MVC 的模式来进行彻底的分层处理，业务不再与 UI 混合

## 现存问题

前端一个很麻烦的点在于，逻辑并不是那么的重，大部分的代码都是 UI 状态以及业务状态的混杂，举个例子，当需要发送请求的时候，必然要写一些 loading 变化的代码，以及错误的展示代码，成功的回调等等

但是不同的框架对于这些状态的处理是不一样的，比如 vue 直接对状态变量进行赋值即可，react 中 class 则需要调用 setState 函数,而 hooks 中则需要调用 setCount 这类的返回函数

尽管我们选定了一种框架之后一般就不会进行改变，但是框架的语法却会限制我们的代码形式，当你使用 hooks 的时候，那你必须要遵循 hooks 的语法规则，并在 hooks 的限定条件下进行补充开发，我们会很频繁的使用 useState,useRef,useEffect,但是这其实会限制我们的思想

此外函数式的编程在 js 中的占比并不高，react 只能说是拓展了 js 的使用，但是却不能代表 js 的全部

## 模式探索

我们不妨来思考下前端的形式，UI = F(state)， 这是基本上前端的共识，三大框架走的都是这样的形式，我们使用变量来控制 UI 的展示

但是是每个框架使用的方式都不一样，angular 是脏检查，vue 是对象劫持，react 是赋值控制，但是不管是什么方式，最终的目的只有一个，那就是触发 UI 的变化，假如我们能够自己写一套自洽的框架，最终只要能够对接到外部并触发 UI 的变化，那么我们就能摆脱框架的局限，从而实现更上层的抽象

举个例子，当我们提交表单的时候，我们的业务其实并不关心表单的形式，不管你是弹窗还是新页面，我们最终的目的只有一个，校验数据并提交，但是在 react 中，我们必须要根据具体的形式来处理，loading，error 的展示，弹窗的显示，路由的变化等等

所以可以设想下，我们的业务模块只需要暴露出当前的状态，然后根据当前的状态去触发 react 的状态变化即可，也就是说我们需要实现一套状态的自动同步机制，这样虽然会多一层转换，但是由于无法直接深入到 react 的内部中去，所以也就只能如此处理，如果后续这套框架成熟了，那我们完全可以将 react 替换成 vue，因为我们的业务是不涉及 UI 的

## 分层设计

- controller
- service
- methods

service 则是请求层，这个大部分的项目都有，就不用多说了，controller 则是仿照后台的设计，是我们的主要业务层，主要是调用 service 然后进行处理，而 methods 则是一些抽象的函数方法

controller 示例如下

```js
export class AnimateController extends Controller<StateType> {
  set = (value: Partial<CommonType.ListQuery>) => {
    const { state } = this;

    const difference = Object.entries(value).some(item =>
      equals(state.query[item[0] as keyof CommonType.ListQuery], item[1])
    );

    if (!difference) return;
    state.query = {
      ...state.query,
      ...value,
    };
  };

  init = async () => {
    const { state } = this;
    state.loading = true;
    await actions.animate.getAnimateList(state.query).finally(() => (state.loading = false));
    state.select = [];
  };

  update = async (values: AnimateType.UpdateItemReq) => {
    await actions.animate.updateAnimateItem({ ...values });
    this.init();
  };

  updateMany = async (values: Partial<AnimateType.UpdateItemReq>) => {
    const { select } = this.state;
    await actions.animate.updateAnimateList({ ids: select, ...values });
    this.init();
  };

  remove = async (id: string) => {
    await actions.animate.deleteAnimateItem({ id });
    this.init();
  };

  removeMany = async () => {
    const { select } = this.state;
    await actions.animate.deleteAnimateList({ ids: select });
    this.init();
  };

  reset = () => this.set(this.initialState.query);
}
```

可以看出，controller 就是一个完成的模块，完全不依赖交互，同时假如我们完成了依赖注入的部分，那么 service 也可以直接注入进来，而不是需要手动引入

最关键的部分在于状态的同步，我们内部定义的状态如何同步到外部去，我们并不能简单粗暴的直接将每次变化的状态全部抛出去，因为很多时候都需要精细化的状态控制，最理想的情况其实是外部直接观察到变化，然后根据每个细微的变化直接操作，但是从语法的角度上来说很难实现，所以我们将内部的状态变化通过回调函数抛出去，这样外部直接监听需要的状态即可

但是不妨思考一些问题，为了能够让外部的观察足够的细致，我们需要暴露出很多的东西，这样就必然导致内部的操作十分的繁琐，如何将这些观察抽象成底层才是最大的考验，这样的话我们就不用手动控制状态了，业务模块的流程自动暴露所有的状态，然后我们在 react 拦截出需要关注的状态同步到 UI 上，这样就彻底实现了逻辑与 UI 的分离

虽然我们还需要再编写一些组件，但是我们将其当作 UI 组件来编写，这样的话就不用担心混杂业务

## 思考

从目前的情况上来说，我们需要完善的有：

- 依赖注入
- 状态的自动收集
- 状态的同步

此外还有找到合适的模式来实践
