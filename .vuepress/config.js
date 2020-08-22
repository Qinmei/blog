module.exports = {
  plugins: ["@vuepress/back-to-top", "@vuepress/pwa"],
  title: "Qinmei",
  dest: "dist",
  description: "一个写博客的地方",
  head: [["link", { rel: "icon", href: `/logo.svg` }]],
  themeConfig: {
    repo: "Qinmei",
    editLinks: false,
    sidebarDepth: 2,
    editLinkText: "在 GitHub 上编辑此页",
    lastUpdated: "上次更新",
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
      "/blog/": ["", "react", "algorithms"],
      "/video/": [""],
    },
  },
};
