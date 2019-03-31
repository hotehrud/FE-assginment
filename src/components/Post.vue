<template>
  <div @click="enter" class="post-container">
    <div class="post-box">
      <div class="post-head px-4 py-2">
        <span>{{cagetoryName}}</span>
        <span>{{categoryId}}</span>
      </div>
      <div class="post-content pt-4">
        <div class="content-head px-4">
          <span class="by-author">{{email}}</span>
          <span>|</span>
          <span class="date">{{date}}</span>
        </div>
        <div class="content">
          <p class="content-title px-4">{{title}}</p>
          <p class="content-desc px-4">{{contents}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object
    },
    category: {
      type: Array
    }
  },
  data() {
    return {
      postId: this.info.no,
      title: this.info.title,
      contents: this.info.contents,
      userId: this.info.user_no,
      email: this.info.email,
      date: this.info.updated_at,
      categoryId: this.info.category_no
    };
  },
  computed: {
    cagetoryName() {
      const item = this.category.find(v => v.no === this.categoryId);
      if (item) {
        return item.name;
      }
    }
  },
  methods: {
    enter() {
      this.$emit("clickEvent", {
        id: this.postId
      });
    }
  }
};
</script>

<style scoped lang="less">
@background-color: #fff;

.post-container {
  position: relative;
  cursor: pointer;
  .post-box {
    .post-head {
      display: flex;
      justify-content: space-between;
      background: @background-color;
      border-bottom: 1px solid #e5e5e5;
    }

    .post-content {
      background: @background-color;
      font-size: 15px;
      color: #595959;
      .content-head {
        margin-bottom: 10px;
        span {
          margin: 0 5px;
        }
      }
      .content {
        position: relative;
        > p {
          position: relative;
          overflow: hidden;
          &:before {
            content: "...";
            position: absolute;
            font-weight: bold;
            right: 0;
            bottom: 0;
          }

          &:after {
            content: "";
            position: absolute;
            right: 0;
            width: 1em;
            height: 1em;
            background-color: @background-color;
          }
        }
        .content-title {
          height: 1rem;
        }
        .content-desc {
          height: 4rem;
        }
      }
    }
  }
}
</style>