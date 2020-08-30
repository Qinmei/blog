# qinPlayer

[查看项目](https://github.com/Qinmei/qinPlayer)

基于 react + ts 的 html5 播放器, 借鉴了 B 站的播放器设计, 将播放器分成几个核心组件, 方便每个组件自由更换, 包括主题也可以自由更换

### 代码结构

```jsx
<PlayerProvider>
  <Theme>
    <Danmu />
    <Sub />
    <Core />
  </Theme>
</PlayerProvider>
```

- `<PlayerProvider />` 是数据收集与分发的中心, 主要是将数据与方法分发至不同的组件, 然后各组件根据数据调整状态, 或者执行方法改变核心的状态;
- `<Core />` 是对 HTML5 的 video 更进一步的封装, 主要是将状态回传至 provider , 并监听状态的改变去执行暂停快进等, 以后可能会加个拓展层去支持更多的格式;
- `<Theme />` 是目前的默认主题, 主要是参考了 B 站的设计, 但是实际上是完全解耦的, 可以根据移动端的来源自动切换另一套主题, 同时也可以实现多套主题相互切换;
- `<Danmu />` 是弹幕的处理层, 他覆盖在 video 上面, 但是在点击层的下面, 所以暂时无法点击到, 它可以获取弹幕列表, 并渲染弹幕, 而发送弹幕这个则以 children 的形式传入进去, 外部自行处理逻辑,
- `<Sub />` 是字幕层, 它主要是获取字幕然后解析 WEBVTT 的格式并动态渲染到底部, 由于没有采用原生的字幕显示, 所以在表现上也更加丰富生动, 后续如果想要解析其他格式的话, 也只需要对这一层加强即可;

### 图片预览

![qinplayer](https://assets.qinmei.org/images/qinplayer-demo-1.png)
![qinplayer](https://assets.qinmei.org/images/qinplayer-demo-2.png)
![qinplayer](https://assets.qinmei.org/images/qinplayer-demo-3.png)
![qinplayer](https://assets.qinmei.org/images/qinplayer-demo-4.png)
![qinplayer](https://assets.qinmei.org/images/qinplayer-demo-5.png)