# React 中的组件继承

由于 hooks 的火热，一时之间 class 仿佛人人喊打，很多文章都会列举 class 的几大罪状，什么编译后文件太大啦，语法不够简洁啦等等；

但是我一直觉得，这些理由其实很不靠谱，用不用某个 API 首先应该考虑的是场景，开发没有什么是 100%的，所以接下来就来聊聊组件中的继承；

## class 与 hooks 的区别

首先需要确认的一点就是，hooks 与 class 的本质区别是什么

```js
function Component(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};
```

上面就是`Component`的代码，实际上就是个构造函数，然后原型上内置了 setState 的函数；

深入 react 源码，就会发现，class 组件其实有两个更新步骤，首先是初始化，其次才是更新，而函数组件则只有一个更新阶段，也就是说每次都是直接 Update，而 hooks 则是有初始化以及更新两个阶段；

从写法上来看，函数组件更简洁，但是 hooks 内部的逻辑其实与 class 是一致的，先初始化，然后再更新

所以在我看来，函数组件更简洁只是相对 class 组件，而 hooks 的内部并不比 class 简单；

## class 的继承

尽管 react 官方文档上说，没有必要去使用继承，组合就够了，但是组件最大的特点其实在于组件之间的状态是相互隔离的；

```js
const Parent = () => {
  return <Child />;
};
```

就以这个为例，Parent 获取不到 Child 的 state 以及方法，而 Child 想要获取 Parent 的 state 以及方法那就必须使用 props，正常来说这是完全没问题的，但是假如我们需要将二者的状态进行混合呢？

举个例子，我们有一些逻辑都是一样的，比如说所有的列表页都有`[page, size, loading, search]`这几个 state，同时这些 state 每次更新的时候都需要将状态存储在 url 上，刷新页面的时候再将 url 中的参数取回初始化，此外还有重置参数，更新参数，用参数获取数据等等方法；

如果是使用 class，我们的伪代码如下：

```js
class Layout extends Component {
  state = {
    page: 1,
    size: 10,
    loading: false,
    search: null,
  };

  getUrlState = () => {};
  setUrlState = () => {};
  resetState = () => {};
  syncState = () => {};
  initData = () => {};

  componentDidMounted() {
    initData();
  }
}
```

这些代码所有的页面都需要写一遍，最起码就 100~200 行代码了，更别说每个页面都有自己的其他逻辑，轻轻松松就上千行了，假如我们使用继承来写，那么我们的代码就如下：

```js
class Layout extends Component {
  getUrlState = () => {};
  setUrlState = () => {};
  resetState = () => {};
  syncState = () => {};
  initData = () => {};
}

class RealLayout extends layout {
  state = {
    page: 1,
    size: 10,
    loading: false,
    search: null,
  };

  componentDidMounted() {
    initData();
  }
}
```

这里图方便直接将 state 定义在了外面，这样 Layout 以及 RealLayout 使用的其实是同一份 state，函数也是通用的，我们还能重写 Layout 里面的方法；

当然，有人也会说，我用 hooks 也能实现啊，代码示例如下：

```js
const useLayout = props => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(null);

  getUrlState = () => {};
  setUrlState = () => {};
  resetState = () => {};
  syncState = () => {};
  initData = () => {};

  return {
    page,
    size,
    loading,
    search,
  };
};

const Layout = () => {
  const { page, size } = useLayout();
};
```

确实，这样够简洁而且能够完美将二者之间的状态分离开来，但是我们思考一个问题，假如我这个组件需要重写 syncState, 那个组件需要重写 initData，也就是说复用并不是完全重合的，那这个时候 hooks 也就丧失了抽象逻辑的功能；

## 总结

在我看来，继承的作用远不如此，当然个人也没深入研究，因为 react 的思想就有点类似函数式编程，数据驱动页面，一切皆数据，class 还是有点 OOP 的

函数式的编程尽管看上去很美好，但是在实际的业务中还是要结合自己的需求去开发，容纳百家，最后形成自己的思想
