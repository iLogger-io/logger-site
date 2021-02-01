<template>
  <div class="notification">
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="1">
        <div v-html="getIcon(type)"></div>
      </el-col>
      <el-col :span="5">
        {{ getText(type) }}
      </el-col>
    </el-row>
    <div style="margin-top: 10px">
      {{ msg }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Login extends Vue {
  @Prop() private type!: number;
  @Prop() private msg!: string;
  @Prop() private data!: any;
  @Prop() private index!: number;

  getIcon(type: number) {
    let icon;
    switch (type) {
      case 0:
        icon = `<div><i class="far fa-user" style="color: black;"></i></div>`;
        break;
      case 1:
        icon = `<div><i class="fas fa-times" style="color: red;"></i></div>`;
        break;
      case 2:
        icon = `<div><i class="fas fa-exclamation-triangle" style="color: yellow;></i></div>`;
        break;
    }
    return icon;
  }

  getText(type: number) {
    let text;
    switch (type) {
      case 0:
        text = "USER";
        break;
      case 1:
        text = "ERROR";
        break;
      case 2:
        text = "WARNING";
        break;
    }
    return text;
  }
}
</script>

<style lang="scss">
.notification {
  margin: 10px 20px 0 20px;
  padding: 5px;
  border: 1px solid rgb(94, 175, 241);
}
</style>
