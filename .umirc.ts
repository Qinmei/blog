import { defineConfig } from 'dumi';
import config from './config';

export default defineConfig({
  title: 'Qinmei',
  favicon: config.favicon,
  logo: config.logo,
  outputPath: 'dist',
  mode: 'site',
  navs: [
    {
      title: '博客',
      path: '/blog',
    },
    {
      title: 'React源码',
      path: '/react',
    },
    {
      title: 'QinVideo',
      path: config.qinVideo,
    },
    {
      title: 'Github',
      path: config.github,
    },
  ],
  menus: {
    '/blog': [
      {
        title: 'React进阶',
        children: [
          'blog/react/cra-init',
          'blog/react/component-extend',
          'blog/react/error-throw',
          'blog/react/class-and-hook',
          'blog/react/mvc',
        ],
      },
    ],
    '/react': [
      {
        title: '总览',
        children: ['react/code/overview', 'react/code/process'],
      },
      {
        title: '架构设计',
        children: ['react/status/todo'],
      },
      {
        title: '理论实战',
        children: ['react/status/todo'],
      },
    ],
  },
  hash: true,
  ssr: {},
  exportStatic: {},
  styles: [`*{box-sizing: border-box;color:#2c3e50} strong{color:#4569d4} img{width:100%}`],
});
