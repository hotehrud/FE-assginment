<template>
  <div>
    <b-button @click="toggle">필터</b-button>
    <div v-if="isOpened && !list" class="filter-container">
      <b-spinner label="Loading..."></b-spinner>
    </div>
    <div v-else v-show="isOpened" data-validator-key="selector" class="filter-container">
      <div class="filter-box">
        <h4>카테고리</h4>
        <ul>
          <li v-for="(item, index) of list" :key="index" class="control">
            <input
              type="checkbox"
              name="selector"
              :id="'checkbox-' + index"
              :value="item.name"
              v-model="selector"
              v-validate="'required'"
            >
            <label :for="'checkbox-' + index">{{item.name}}</label>
            <div class="check check-checkbox"></div>
          </li>
        </ul>
        <p v-if="hasError" class="error-text">{{errorMessage}}</p>
        <b-button @click="save" class="w-25">저장</b-button>
        <button @click="toggle(false)" type="button" class="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import validate from "@/directives/validate";
import validator from "@/js/validator";

export default {
  directives: {
    validate
  },
  props: {
    list: {
      type: Array,
      value: null
    }
  },
  data() {
    return {
      selector: [],
      isOpened: false,
      hasError: false,
      errors: {}
    };
  },
  created() {
    this.indexStore = {};
  },
  computed: {
    errorMessage() {
      return this.errors.toString();
    }
  },
  methods: {
    toggle(status = true) {
      if (status) {
        this.prevSelectorData = this.selector.slice(0);
      } else {
        this.selector = [...this.prevSelectorData];
      }
      this.isOpened = status;
    },
    save() {
      this.prevSelectorData = this.selector.slice(0);
      if (!this.isValid()) {
        return;
      }

      this.$emit("statusSelector", this.selector.map(v => this.indexStore[v]));
      this.isOpened = false;
    },
    isValid() {
      const container = this.$el.querySelector(".filter-container");
      const dataset = container.dataset;
      const key = dataset.validatorKey;

      this.errors = [...validator.start(key, this[key])];
      if (this.errors.length === 0) {
        return true;
      }
      this.hasError = true;
      return false;
    }
  },
  watch: {
    list(v) {
      // called only once && for default-true
      if (Array.isArray(v) && v.length > 0) {
        v.forEach(item => {
          this.indexStore[item.name] = item.no;
          this.selector.push(item.name);
        });
      }
    },
    isOpened(v) {
      if (v) {
        this.hasError = false;
      }
    }
  }
};
</script>

<style scoped lang="less">
@import "../../less/variables.less";

.filter-container {
  .filter-box {
    position: relative;
    text-align: center;
    padding: 30px 50px;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.7), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
    width: 70%;
    background-color: #fff;
    @media @phone-down {
      width: 90%;
      padding: 10px 20px;
    }
    .close {
      position: absolute;
      top: 0;
      right: 0;
      margin: 10px;
    }
  }
  li.control {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100px;
    border-bottom: 1px solid #333;
    color: #aaaaaa;
    input[type="radio"],
    input[type="checkbox"] {
      position: absolute;
      visibility: hidden;
    }
    label {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      height: 30px;
      font-weight: 300;
      font-size: 1.35em;
      padding: 25px 25px 25px 80px;
      margin: 10px auto;
      z-index: 9;
      cursor: pointer;
      transition: all 0.25s linear;
    }
    &:hover label {
      color: #000;
    }
    .check {
      position: absolute;
      height: 30px;
      width: 30px;
      left: 20px;
      transition: border 0.25s linear;
      &:before {
        content: "";
        position: absolute;
        display: block;
      }
    }

    .check-checkbox {
      border: 5px solid transparent;
      background: #aaa;
      &:before {
        opacity: 0;
        left: 6px;
        top: 1px;
        width: 8px;
        height: 15px;
        border: solid #fff;
        border-width: 0 3px 3px 0;
        transform: rotate(45deg);
      }
    }

    input:checked ~ .check {
      border: 5px solid @completed-color;
    }

    input:checked ~ .check::before {
      background: @completed-color;
    }

    input:checked ~ label {
      color: @completed-color;
    }

    input:checked ~ .check-checkbox {
      background: @completed-color;
      &:before {
        opacity: 1;
      }
    }
  }

  .error-text {
    color: red;
  }
}
</style>