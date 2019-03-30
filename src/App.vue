<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
@import "./less/variables.less";

* {
  margin: 0;
  padding: 0;
}

html {
  box-sizing: border-box;
  background-color: @background-color;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

#app {
  position: absolute;
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #3d454d;
  font-size: 16px;
}

ul {
  list-style-type: none;
}
</style>
