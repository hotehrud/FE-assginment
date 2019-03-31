<template>
  <div class="detail-container">
    <div
      v-if="!article"
      class="position-fixed w-100 h-100 d-flex justify-content-center align-items-center"
    >
      <b-spinner label="Loading..."></b-spinner>
    </div>
    <div
      v-else
      :data-category-no="article.category_no"
      :data-post-no="article.no"
      class="article px-4 py-3"
    >
      <h1>{{article.title}}</h1>
      <div class="post-box">
        <div class="post-head px-3 py-2">
          <h6 class="by-author">{{article.email}}</h6>
          <span class="date">{{article.updated_at}}</span>
        </div>
        <div class="post-content p-3">{{article.contents}}</div>
      </div>
      <div v-if="replies" class="replies">
        <h2 class="mb-3">Comments</h2>
        <ul class="reply-list">
          <li
            v-for="(item, index) of replies"
            :key="index"
            :data-user-no="item.user_no"
            :data-post-no="item.no"
            class
          >
            <div class="reply-box">
              <div class="reply-head px-3 py-2">
                <h6 class="by-author">{{item.email}}</h6>
                <span class="date">{{item.updated_at}}</span>
              </div>
              <div class="reply-content p-3">{{item.contents}}</div>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="replies">
        <h4>No comments</h4>
      </div>
    </div>
  </div>
</template>

<script>
import { BASE_URI, DETAIL_PATH } from "@/config/api";
import { setTimeout } from "timers";

export default {
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      article: null,
      replies: null
    };
  },
  created() {
    this.$http
      .get(`${BASE_URI}/${DETAIL_PATH}?&req_no=${this.id}`)
      .then(result => {
        const data = result.data;
        const code = data.code;

        if (code === 200) {
          const detail = data.detail;
          this.article = Object.assign({}, this.article, detail.article);
          if (detail.replies && detail.replies.length > 0) {
            this.replies = detail.replies;
          }
        }
      });
  }
};
</script>

<style scoped lang="less">
@import "../less/variables.less";

.detail-container {
  margin: 0 auto;
  max-width: 740px;
  min-height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  padding: 0 20px;
  @media @phone-down {
    width: 100%;
    padding: 0;
  }
}

.replies {
  margin: 60px auto 15px;
  width: 100%;
  @media @phone-down {
    margin: 30px auto 5px;
    width: 100%;
  }
  .reply-list {
    > li {
      margin-bottom: 15px;
    }
  }

  .post-box,
  .reply-box {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.7);
    .post-head,
    .reply-head {
      background: #fcfcfc;
      border-bottom: 1px solid #e5e5e5;
      border-radius: 4px 4px 0 0;
    }

    .post-head,
    .reply-content {
      background: #fff;
      font-size: 15px;
      color: #595959;
      border-radius: 0 0 4px 4px;
    }
  }
}
</style>