<template>
  <div class="container">
    <nav>
      <filter-modal :list="filterData" class="filter-voc"/>
      <div class="sort-box">
        <span>오름차순</span>
        <span>내림차순</span>
      </div>
    </nav>
    <section></section>
  </div>
</template>

<script>
// @ is an alias to /src
import FilterModal from "@/components/modal/Filter.vue";
import { baseURI } from "@/config/constant";

export default {
  name: "home",
  components: {
    FilterModal
  },
  data() {
    return {
      filterData: null
    };
  },
  created() {
    this.$http.get(`${baseURI}/category.php`).then(result => {
      const data = result.data;
      const code = data.code;

      if (code === 200) {
        this.filterData = data.list;
      }
    });
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
}
</style>