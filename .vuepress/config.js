module.exports = {
  plugins: [
    "@vuepress/back-to-top",
    "vuepress-plugin-mermaidjs",
    [
      require("./plugins/right-anchor"),
      {
        showLevel: 2,
      },
    ],
  ],
  title: "Qinmei",
  dest: "dist",
  description: "一个写博客的地方",
  head: [["link", { rel: "icon", href: `/logo.svg` }]],
  themeConfig: {
    repo: "Qinmei",
    editLinks: false,
    sidebarDepth: 0,
    nextLinks: "",
    prevLinks: "",
    smoothScroll: true,
    nav: [
      {
        text: "博客",
        link: "/blog/",
      },
      {
        text: "视频",
        link: "/video/",
      },
      {
        text: "项目",
        items: [
          {
            text: "qinVideo",
            link: "https://qinvideo.org",
          },
          {
            text: "qinPlayer",
            link: "https://qinvideo.org/player.html",
          },
        ],
      },
    ],
    sidebar: {
      "/blog/": [
        {
          title: "Js基础",
          collapsable: true,
          children: [
            "/blog/javascript/01",
            "/blog/javascript/02",
            "/blog/javascript/03",
          ],
        },
        {
          title: "React进阶",
          collapsable: true,
          children: ["/blog/react/01"],
        },
        {
          title: "React源码",
          collapsable: true,
          children: ["/blog/code/01", "/blog/code/02"],
        },
        {
          title: "leetcode",
          collapsable: true,
          children: ["/blog/leetcode/01"],
        },
        {
          title: "开源项目",
          collapsable: true,
          children: ["/blog/github/qinvideo", "/blog/github/qinplayer"],
        },
      ],
      "/video/": [""],
    },
  },
};
