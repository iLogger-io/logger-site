<template>
  <div id="signup">
    <div class="header">
      <h2 class="logo"></h2>
    </div>
    <Signup />

    <div class="footer">
      <div class="links">
        <!-- <span>Feature 1</span>
        <span>Feature 2</span>
        <span>Feature 3</span> -->
      </div>
      <div class="version">Version 1.0.01</div>
    </div>
  </div>
</template>

<script lang="ts">
import Signup from "@/components/Signup.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {
    Signup,
  },
})
export default class SignupPage extends Vue {}
</script>

<style lang="scss">
#signup {
  padding: 0;
}
.footer,
.header {
  padding: 20px 20px;
  color: #f0f4f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1,
  h2,
  h3 {
    color: #f0f4f8;
    padding: 0;
    margin: 0;
  }
  .links {
    display: flex;
    font-family: "Open Sans";
    span {
      padding: 0 10px;
      font-size: 18px;
      border-right: 1px solid #9fb3c8;
      &:last-child {
        border-right: none;
      }
    }
  }
  .version {
    font-family: "Open Sans";
    padding: 0 10px;
    color: #9fb3c8;
    font-size: 12px;
    margin-top: 5px;
  }
}
.header {
  padding: 10px 20px;
  .logo {
    font-family: "Open Sans";
    letter-spacing: 3px;
    padding-top: 15px;
    padding-bottom: 15px;
  }
  .logo .part-2 {
    color: #d64545;
  }
}
</style>
