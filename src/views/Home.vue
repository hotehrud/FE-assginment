<template>
  <div class="container">
    <nav>
      <filter-modal v-on:statusSelector="updateCategory" :list="filterData" class="filter-voc"/>
      <div class="sort-box">
        <span @click="order('asc')" :class="{active: postParams.ord === 'asc'}">오름차순</span>
        <span @click="order('desc')" :class="{active: postParams.ord === 'desc'}">내림차순</span>
      </div>
    </nav>
    <section>
      <div class="list-container">
        <post
          v-for="(item,index) of posts"
          :key="index + '-' + item.no"
          :category="filterData"
          :info="item"
        />
      </div>
    </section>
  </div>
</template>

<script>
import Post from "@/components/Post.vue";
import FilterModal from "@/components/modal/Filter.vue";
import { BASE_URI, CATEGORY_PATH, POSTS_PATH } from "@/config/constant";

export default {
  components: {
    FilterModal,
    Post
  },
  data() {
    return {
      filterData: null,
      posts: [],
      postParams: {
        page: 1,
        ord: "asc",
        category: [1, 2, 3]
      }
    };
  },
  async created() {
    await this.getCategory();
    this.getPostList();
  },
  methods: {
    updateCategory(category) {
      console.log("updateCategory", category);
    },
    getCategory() {
      return new Promise(resolve => {
        // Get, Category
        this.$http.get(`${BASE_URI}/${CATEGORY_PATH}`).then(result => {
          const data = result.data;
          const code = data.code;

          if (code === 200) {
            this.filterData = data.list;
          }
          resolve();
        });
      });
    },
    getPostList() {
      // Get, Posts
      let url = `${BASE_URI}/${POSTS_PATH}?`;

      for (let key in this.postParams) {
        let value = this.postParams[key];
        value = Array.isArray(value) ? value.join(",") : value;
        url += `&${key}=${value}`;
      }

      console.log(url);

      this.$http.get(url).then(result => {
        const data = result.data;
        const code = data.code;

        if (code === 200) {
          this.posts = data.list;
        }
      });
    },
    order(v) {
      this.postParams.ord = v;
    }
  },
  watch: {
    "postParams.ord"(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.posts.reverse();
      }
    }
  }
};
</script>

<style lang="less">
.container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
      margin: 10px 20px;
    }
    .sort-box {
      span {
        margin: 10px;
      }
    }
  }

  .filter-voc {
    .filter-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9;
    }
  }
  .active {
    color: red;
  }
}
</style>