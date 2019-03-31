<template>
  <div @click="enter" class="post-container">
    <div class="post-header">
      <span>{{email}}</span>
      <span>{{postId}}</span>
    </div>
    <div class="post-section">
      <div class="section-header">
        <span>{{email}}</span>
        <span>{{date}}</span>
      </div>
      <div class="section-body">
        <div class="section-body-header">
          <span>{{email}}</span>
          <span>{{date}}</span>
        </div>
        <div class="section-body-content">
          {{title}}
          {{contents}}
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
      return this.category.find({ no: this.categoryId });
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
.post-container {
  border: 1px solid #000;
  cursor: pointer;
}
</style>