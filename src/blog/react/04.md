# React 中 class 与 hooks 的结合使用

最近在做全 hooks 的项目的时候，发现有些情况下使用 hooks 的难度很大，很难完全的将 hooks 分离开来，因此也在思考，hooks 的边界究竟是什么，我们是否真的需要全 hooks 的解决方案，能否在 react 的基础之上更抽象一层，接下来我们不妨来聊聊

## hooks 的局限

hooks 很强这是毫无疑问的，但是在使用的时候我们也会遇到一些很棘手的事情，举个例子：

复杂的列表页面基本上有以下几个方法，新增，修改，删除，查询，批量修改，批量删除，全部修改，全部删除，同时还有一些外部的交互，比如说操作等等；

假如我们用 hooks 来展示，一般都会先抽象出一个 useMethods 方法，然后页面直接调用这个方法即可，代码如下：

```js
export const useMethods = initialState => {
  const [state, setState] = useSavedState(initialState);

  const [loading, setLoading] = useListLoading();
  const [select, setSelect] = useSelect();

  const init = useCallback(async () => {}, []);

  const update = useCallback(async values => {}, []);

  const updateMany = useCallback(async values => {}, []);

  const remove = useCallback(async id => {}, []);

  const removeMany = useCallback(async () => {}, []);

  const reset = useCallback(() => {}, []);

  const methods = useMemo(() => ({ init, update, updateMany, remove, removeMany, reset }), [
    init,
    update,
    updateMany,
    remove,
    removeMany,
    reset,
  ]);

  return [state, methods];
};
```

需要注意的是，上面还提取了一些状态，包括 loading 以及 select,loading 则是每次获取列表的时候需要加载的，而 select 则是批量操作的时候勾选的数据

每次删除修改等操作之后都要调用 init 方法，所以此外有的时候还有将 select 清空，所以这两个状态与方法则是强绑定了，当然我们也能将状态放在外面，但是这也意味着我们的方法就是调用 service，这是没有任何意义的；

其实上面只是举个例子，但是这也是我们面临的一个问题，虽然我们可以将操作逻辑抽象出来，但是不可避免的需要将一些状态也组合进来，这些状态同时又是与 hooks 强绑定，导致最终写出来的 hooks 没有抽象性；

抽象性这个我们不妨来思考下，假如说 A 页面需要所有的方法，B 页面不需要批量方法，那么 select 的变化对于 B 来说是完全没有必要的，还会加深 B 页面的渲染次数，尽管对于纯函数来说，多几次不算什么，但是这意味着我们引入了额外的变量

此外如说 C 页面需要改变其中的一些方法，那我们只能增加 useMethods 的抽象性来应对更多的需求，这样就会导致整个 hook 越来越复杂，当然理论上也可以再包一层，但是这样会导致我们的项目复杂性越来越高；

而且所有的方法如果都包裹上 useCallback 会导致里面的逻辑都是偏 react 的，我们很难再去用纯 js 的方法去调整，这个是比较麻烦的，我们可能希望的是能够抽离出业务的逻辑，同时保证它尽可能的纯粹以及独立；

综上：hooks 在抽象业务逻辑的方面其实还是比较弱的；

## class 的优势

这里说的 class 并不是指 react 的 class 组件，而是 es6 的 class 类

其实通过 java 我们也知道，class 在抽象以及组合继承方面功能很强，甚至有大把的设计模式可供借鉴，尽管 es6 的 class 比较弱，但是大部分的模式还是可以参考的

所以我们也在思考，如何能够将业务逻辑抽象出来，这样 react 只关注交互层面的东西，尽可能的简化整体的结构

假设这样，我们业务逻辑直接处理所有的情况，然后通过一定的方式暴露出内部的状态，这样我们只需要使用 hooks 来监听需要的状态，只有需要使用的时候才去进行处理，这样我们就能将业务与交互分离开来

初步的代码实现如下：

```js

class Component<T extends Record<string, any>> {
  state: T;
  constructor(
    data: T,
    handler: <K extends keyof T>(propKey: K, value: T[K]) => void,
  ) {
    this.state = new Proxy(data, {
      set: <K extends keyof T>(target: T, propKey: K, value: T[K]) => {
        Reflect.set(target, propKey, value);
        handler(propKey, value);
        return true;
      },
    });
  }
}

interface Props {
  loading: boolean;
  select: string[];
}
export class Modules extends Component<Props> {
  init = async () => {
    this.state.loading = true;
    await sleep().finally(() => (this.state.loading = false));
    this.state.select = [];
  };

  update = async () => {
    this.state.select = ['1', '2', '3'];
    await sleep();
    this.init();
  };
}

export default function IndexPage() {

  const [loading,setLoading] = useState(false);
  const [select,setSelect] = useState([]);

  const handler = (propKey: string | number | symbol, value: unknown)=>{
    switch(propKey){
      case 'loading':
        setLoading(value);
      break;
      case 'select':
        setSelect(value);
        break;
      default:
        break;
    }
  }
  const {current:module} = useRef(new Modules({loading:false,select:[]},handler))
}

```

上述则是利用了 proxy 对 state 进行监听，这样 state 的变化就会触发 handler 函数，我们只需要在外部拦截处理即可

当然 proxy 的兼容性并不好，所以也是要视情况而定，当然我们也可以采用 react 的 setState 的方式，这样的话就能完全控制所有的状态变化，或者模仿 angular 的脏检查来对所有的状态进行监听，这样就不用局限于 this.state 了，或者模仿 vue 的 Object.defineProperties, 这样可以覆盖到 IE 浏览器

上述还能再进一步简化，useReducer 可以说是处理这种情况的最佳方法，这样一来我们的代码就会显得比较简洁

## 思考

当然，我们可能还是会有疑问，比如说 loading 的变化，这个其实是 UI 的状态，但是我们还是不可避免的要将其引入到业务逻辑中，而业务中的 select 变化，也是需要同步到 UI 中，所以 UI 与业务是无法完全分离开来的，那这样做还有意义吗

我觉得吧，目前的方案其实只是一个单纯的尝试，那就是如何将业务脱离开来，react 很强，但是最终都是在 react 的生态下打转，假如将业务完全的解耦，那完全可以借鉴后台的思想来处理业务数据，而交互则交给底层的渲染层，这样前端的上限就会高很多，而不是天天在写页面

上述的思想其实也就是监听业务的流程然后进行对应的处理，UI 则是由业务的流程来控制，而 UI 又会触发业务的流程，这样的话就相当于在 react 的上层抽象了一层业务层，可以尝试的还是很多的
