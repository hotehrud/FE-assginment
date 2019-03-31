<template>
  <div class="main-container">
    <nav class="sticky">
      <filter-modal v-on:statusSelector="updateCategory" :list="filterData" class="filter-voc"/>
      <div class="sort-box">
        <span @click="order('asc')" :class="{active: postParams.ord === 'asc'}">오름차순</span>
        <span @click="order('desc')" :class="{active: postParams.ord === 'desc'}">내림차순</span>
      </div>
    </nav>
    <section v-scroll="loadMore">
      <div class="list-container">
        <post
          v-on:clickEvent="enterDetailPage"
          v-for="(item, index) of postsWithAds"
          :key="index + '-' + item.no"
          :category="filterData"
          :info="item"
          :class="{ad: item.kind === 'ad'}"
          :data-post-no="item.no"
          class="post"
        >
          <div v-if="item.kind === 'ad'" slot="image" class="ad-box">
            <p>Sponsored</p>
            <img :src="item.imagePath">
          </div>
        </post>
      </div>
    </section>
  </div>
</template>

<script>
import scroll from "@/directives/scroll";
import Post from "@/components/Post.vue";
import FilterModal from "@/components/modal/Filter.vue";
import { AD_CYCLE, AD_LIMIT, POST_LIMIT } from "@/config/constant";
import {
  BASE_URI,
  CATEGORY_PATH,
  POSTS_PATH,
  AD_PATH,
  IMAGE_PATH
} from "@/config/api";

export default {
  directives: {
    scroll
  },
  components: {
    FilterModal,
    Post
  },
  data() {
    return {
      filterData: null,
      posts: [],
      ads: [],
      postParams: {
        page: 1,
        ord: "asc",
        category: [1, 2, 3],
        limit: POST_LIMIT,
        next: true
      }
    };
  },
  async created() {
    this.adParams = {
      page: 1,
      limit: AD_LIMIT,
      next: true
    };

    const promises = [this.getCategory(), this.getAdList()];
    await Promise.all(promises);
    await this.getPostList();
  },
  computed: {
    postsWithAds() {
      const merge = [];
      let i = 0;
      let adIndex = 0;
      let adCycle = AD_CYCLE;
      for (const item of this.posts) {
        merge.push(item);

        if ((i % adCycle) + 1 === adCycle) {
          if (adIndex < this.ads.length) {
            this.ads[adIndex].kind = "ad";
            this.ads[adIndex].imagePath = `${BASE_URI}${IMAGE_PATH}/${
              this.ads[adIndex].img
            }`;
            merge.push(this.ads[adIndex++]);
          }
        }
        i++;
      }
      return merge;
    }
  },
  methods: {
    updateCategory(v) {
      const same = this.postParams.category.equals(v);
      if (!same) {
        // reload post-list
        this.postParams.category = v;
        this.postParams.page = 1;
        this.posts = [];
        this.getPostList();
      }
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
      return new Promise(resolve => {
        // Get, Posts
        let url = `${BASE_URI}/${POSTS_PATH}?`;

        for (let key in this.postParams) {
          let value = this.postParams[key];
          value = Array.isArray(value) ? value.join(",") : value;
          url += `&${key}=${value}`;
        }

        this.$http.get(url).then(result => {
          const data = result.data;
          const code = data.code;

          if (code === 200) {
            for (let item of data.list) {
              this.posts.push(item);
            }
            // check, next api exist
            if (data.list.length < this.postParams.limit) {
              this.postParams.next = false;
            }
            ++this.postParams.page;
          }
          resolve();
        });
      });
    },
    getAdList() {
      return new Promise(resolve => {
        console.log("getAdList");
        // Get, Ads
        let url = `${BASE_URI}/${AD_PATH}?`;

        for (let key in this.adParams) {
          let value = this.adParams[key];
          value = Array.isArray(value) ? value.join(",") : value;
          url += `&${key}=${value}`;
        }

        this.$http.get(url).then(result => {
          const data = result.data;
          const code = data.code;

          if (code === 200) {
            for (let item of data.list) {
              this.ads.push(item);
            }
            // check, next api exist
            if (data.list.length < this.adParams.limit) {
              this.adParams.next = false;
            }
            ++this.adParams.page;
          }
          resolve();
        });
      });
    },
    async loadMore() {
      if (this.postParams.next) {
        await this.getPostList();
        // need additional ad
        const possible = this.posts.length / AD_CYCLE;
        if (possible >= this.ads.length) {
          if (this.adParams.next) {
            this.getAdList();
          }
        }
      }
    },
    order(v) {
      this.postParams.ord = v;
    },
    enterDetailPage({ id }) {
      console.log("!@");
      this.$router.push({
        name: "detail",
        query: {
          id: id
        }
      });
    }
  },
  watch: {
    "postParams.ord"(newVal, oldVal) {
      const target = "no";
      let an = -1;
      let bn = 1;

      if (newVal !== oldVal) {
        if (newVal === "asc") {
          this.posts.sort(mySort);
        } else {
          an = 1;
          bn = -1;
          this.posts.sort(mySort);
        }
      }

      function mySort(a, b) {
        const convertA = Number(a[target]);
        const convertB = Number(b[target]);
        if (convertA === convertB) {
          return 0;
        } else {
          return convertA < convertB ? an : bn;
        }
      }
    }
  }
};
</script>

<style lang="less">
@import "../less/variables.less";

.main-container {
  position: relative;
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
  background-color: #fff;
  @media @phone-down {
    max-width: 450px;
  }
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.7);
    + section {
      padding-top: 70px;
      padding: 70px 20px 0 20px;
    }
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
  .list-container {
    .post {
      border-radius: 2px;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.21);
      transition: all 1s ease; /* Standard */
      &:hover {
        top: -10px;
        -webkit-border-bottom-left-radius: 70px 20px; /* WebKit */
        -moz-border-bottom-left-radius: 70px 20px; /* Firefox */
        -o-border-bottom-left-radius: 70px 20px; /* Opera */
        border-bottom-left-radius: 70px 20px; /* Standard */
        -webkit-box-shadow: -10px 10px 35px #888; /* WebKit */
        -moz-box-shadow: -10px 10px 35px #888; /* Firefox */
        -o-box-shadow: -10px 10px 35px #888; /* Opera */
        box-shadow: -10px 10px 35px #888; /* Standard */
      }
      margin-bottom: 20px;
      > div {
        padding: 25px 20px;
      }
    }
    .ad {
      .post-box {
        flex-direction: row;
        @media @phone-down {
          flex-direction: column;
        }
        > div {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .ad-box {
          flex-direction: column;
          flex-basis: 40%;
          @media @phone-down {
            flex-basis: 100%;
          }
          img {
            position: relative;
            width: 100%;
          }
        }
        .post-content {
          flex-basis: 60%;
          @media @phone-down {
            flex-basis: 100%;
          }
        }
      }
    }
  }
  .by-author {
    color: #03658c;
  }

  .date {
    color: #999;
  }

  .active {
    color: red;
  }

  .sticky {
    position: fixed;
    top: 0;
    max-width: 1140px;
    width: 100%;
    z-index: 9;
  }
}
</style>