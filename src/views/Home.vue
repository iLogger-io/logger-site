<template>
  <div class="home">
    <div class="navigation_hiden"></div>
    <div class="navigation">
      <div class="navitop">
        <div class="iconblock">
          <i class="fas fa-chart-pie fa-2x" style="color: white"></i>
        </div>
      </div>
      <div class="navibot">
        <div class="iconblock">
          <el-dropdown @command="handleUserDropdown">
            <div>
              <i class="fas fa-user-circle fa-3x" style="color: white; font-size: 38px"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="profile"
                ><i class="fas fa-user fa-lg" style="color: rgb(2, 117, 216)"></i>User
                Profile</el-dropdown-item
              >
              <el-dropdown-item command="settings"
                ><i class="fas fa-cogs fa-lg" style="color: rgb(2, 117, 216)"></i
                >Settings</el-dropdown-item
              >
              <el-dropdown-item command="logout"
                ><i class="fas fa-sign-out-alt fa-lg" style="color: rgb(2, 117, 216)"></i
                >Logout</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="main">
      <HomeMain></HomeMain>
    </div>
  </div>
</template>

<script lang="ts">
import { Action } from "vuex-class";
import { Component, Vue } from "vue-property-decorator";
import Cookies from "js-cookie";
import HomeMain from "@/components/HomeMain.vue";

@Component({
  components: {
    HomeMain,
  },
})
export default class Home extends Vue {
  @Action("user/SetToken") SetToken: any;
  @Action("ws/InitWs") InitWs: any;

  beforeMount(): void {
    this.InitWs();
  }

  async handleUserDropdown(command: string) {
    switch (command) {
      case "logout":
        await Cookies.remove("token");
        window.location.reload();
        break;
    }
  }
}
</script>

<style lang="scss">
.home {
  display: flex;
  flex-direction: row;

  .iconblock {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px auto;
  }
  .navigation_hiden {
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 15px rgba(4, 4, 4, 0.3);
    width: 60px;
    height: 100vh;
    z-index: 1;
  }
  .navigation {
    display: flex;
    flex-direction: column;
    background-color: rgb(24, 48, 70);
    box-shadow: 0 0 15px rgba(4, 4, 4, 0.3);
    width: 60px;
    height: 100vh;
    position: fixed;
    z-index: 1;

    .navitop {
      display: flex;
      flex-direction: column;
    }

    .navibot {
      display: flex;
      flex-direction: column;
      margin-top: auto;
    }
  }

  .main {
    width: 100vw;
    height: 100vh;
    background: #ffffff;
    background-image: url("../assets/LVs7-dots.png");
  }
}
</style>
