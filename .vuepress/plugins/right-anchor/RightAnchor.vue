<template>
  <ul class="right-anchor">
    <li
      class="right-anchor-item"
      v-for="(item, index) in listData"
      :key="index"
      @click="itemClick(index, item.slug)"
      :class="{ active: index === activeIndex, ['level' + item.level]: true }"
    >
      {{ item.title }}
    </li>
  </ul>
</template>

<script>
export default {
  name: "right-anchor",
  data() {
    return {
      listData: [],
      activeIndex: null,
    };
  },
  watch: {
    "$page.regularPath": function() {
      this.filterDataByLevel();
    },
  },
  methods: {
    itemClick(index, slug) {
      this.activeIndex = index;

      window.scrollTo({
        top: document.getElementById(slug).offsetTop,
        behavior: "smooth",
      });
    },
    filterDataByLevel() {
      this.listData = [];

      if (this.$page.rightAnchor.isIgnore || !this.$page.headers) return;

      this.$page.headers.map((item) => {
        if (item.level <= this.$page.rightAnchor.showLevel) {
          this.listData.push(item);
        }
      });

      this.$nextTick(() => {
        this.listData.map((item) => {
          this.getEleById(item.slug).then((el) => {
            item.offsetTop = el.offsetTop;
          });
        });
      });
    },
    getEleById(id) {
      return new Promise((resolve) => {
        const t = setInterval(() => {
          const el = document.getElementById(id);

          if (el) {
            clearInterval(t);
            resolve(el);
          }
        }, 100);
      });
    },
    getScrollTop() {
      return (
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      );
    },
  },
  mounted() {
    this.filterDataByLevel();

    window.addEventListener("scroll", () => {
      const scrollTop = this.getScrollTop();

      this.listData.map((item, index) => {
        if (item.offsetTop && scrollTop >= item.offsetTop)
          this.activeIndex = index;
      });
    });
  },
};
</script>

<style lang="stylus">
.right-anchor {
  position: fixed;
  padding: 0;
  top: $navbarHeight + 2rem;
  right: 0;
  width: 220px;
  border-left: 2px solid #eaecef;
  z-index: 9;
  background-color: $rightAnchorBgColor;

  &-item {
    display: block;
    padding: 4px 12px;
    font-size: 14px;
    font-weight: bold;
    margin-left: -2px;
    text-decoration: none;
    display: block;
    cursor: pointer;
    border-left: 2px solid transparent;
    opacity: 0.9;

    &:hover, &.active {
      color: $accentColor;
      border-color: $accentColor;
    }

    &.level3 {
      padding-left: 24px;
      opacity: 0.7;
    }
  }
}

@media (max-width: 1199px) {
  .right-anchor {
    display: none;
  }
}

@media (min-width: 1200px) {
  .theme-default-content:not(.custom) {
    padding-right: 240px !important;
  }
}

@media (min-width: 1920px) {
  .right-anchor {
    right: calc((100vw - 1400px) / 2 - 250px);
  }
}
</style>
