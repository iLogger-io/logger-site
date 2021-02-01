<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-drawer title="Notifications" :visible.sync="drawerNotifications" :with-header="true">
      <NotificationComponent
        v-for="(item, index) in Notifications"
        v-bind:key="index"
        :index="item.index"
        :type="item.type"
        :msg="item.msg"
        :data="item.data"
      >
      </NotificationComponent>
    </el-drawer>
    <el-dialog
      title="Retrying connect to server"
      :visible.sync="UIstatus.InternetDialog"
      width="30%"
    >
      <i class="fas fa-spinner fa-spin fa-3x"></i>
    </el-dialog>
    <el-aside
      class="client-list"
      width="200px"
      style="
        background-color: rgb(238, 241, 246);
        border-right: 1px solid rgba(120, 153, 182, 0.507);
        color: #333;
      "
    >
      <div v-if="ClientListMenuShow">
        <el-menu
          :default-active="activeIndexSelectClient"
          :default-openeds="['1']"
          @select="handleSelectClient"
        >
          <el-submenu index="1">
            <template slot="title">Client list <i class="fas fa-microchip"></i></template>
            <el-tooltip
              placement="right"
              effect="light"
              v-for="(item, index) in ClientID"
              v-bind:item="item"
              v-bind:key="item.id"
            >
              <div slot="content">Client ID:<br />{{ item.id }}</div>
              <el-menu-item v-bind:index="`1-${index}`">{{ item.name }}</el-menu-item>
            </el-tooltip>
          </el-submenu>
        </el-menu>
      </div>
    </el-aside>

    <div class="right-main">
      <div class="right-main-header">
        <div class="header-left">
          <div class="iconblock-small">
            <el-tooltip placement="top">
              <div slot="content" style="font-size: 14px">Register new client</div>
              <el-popover placement="bottom" width="200" v-model="VisibleRegisterClient">
                <p>Register new client</p>
                <div style="text-align: right; margin: 0">
                  <el-input
                    size="mini"
                    placeholder="Please give it a short name"
                    style="margin: 0px 40px 20px 0px"
                    v-model="InputRegisterClient"
                    clearable
                  ></el-input>
                  <el-button size="mini" type="text" @click="VisibleRegisterClient = false"
                    >cancel</el-button
                  >
                  <el-button type="primary" size="mini" @click="handleRegisterClient()"
                    >confirm</el-button
                  >
                </div>
                <el-button
                  slot="reference"
                  type="primary"
                  icon="fas fa-plus-circle"
                  circle
                  size="mini"
                ></el-button>
              </el-popover>
            </el-tooltip>
          </div>

          <div class="iconblock-small">
            <el-tooltip placement="top">
              <div slot="content" style="font-size: 14px">Remove client</div>
              <el-button
                type="primary"
                icon="fas fa-minus-circle"
                circle
                size="mini"
                @click="handleRemoveClient()"
              ></el-button>
            </el-tooltip>
          </div>
        </div>
        <div class="header-right">
          <div class="iconblock-small">
            <el-button
              type="primary"
              icon="fas fa-box"
              circle
              size="mini"
              @click="refreshApp()"
            ></el-button>
          </div>
          <div class="iconblock-small">
            <el-tooltip placement="top">
              <div slot="content" style="font-size: 14px">Notifications</div>
              <el-button
                type="primary"
                icon="fas fa-bell"
                circle
                size="mini"
                @click="handleNotificationsBT()"
              ></el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
      <el-main style="padding: 0; background-color: #002b35; display: flex">
        <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
        <WindowLog
          v-for="item in ClientID"
          v-bind:key="item.id"
          :clientid="item.id"
          :currentclientid="ClientIDSelected"
          v-show="ClientIDSelected === item.id"
          v-if="checkRemoveClient()"
        >
        </WindowLog>
      </el-main>
    </div>
  </el-container>
</template>

<script lang="ts">
import { Action, Getter } from "vuex-class";
import { Component, Vue, Watch } from "vue-property-decorator";
import WindowLog from "@/components/WindowLog.vue";
import NotificationComponent from "@/components/Notification.vue";
import serverstatus from "@/utils/status";
import update from "@/mixins/update";

@Component({
  components: {
    WindowLog,
    NotificationComponent,
  },
  mixins: [update],
})
export default class HomeMain extends Vue {
  @Action("client/Register") RegisterClient: any;
  @Action("client/Remove") RemoveClient: any;
  @Action("client/List") ListClient: any;
  @Getter("client/ClientID") ClientID: any;
  @Action("client/RemoveClientID") RemoveClientID: any;
  @Action("client/UpdateClientLog") UpdateClientLog: any;
  @Getter("client/ClientLog") ClientLog: any;
  @Getter("ui/UIstatus") UIstatus: any;
  @Getter("ui/Notifications") Notifications: any;
  @Getter("client/ClientSettings") ClientSettings: any;

  activeIndexSelectClient = "0";
  VisibleRegisterClient = false;
  InputRegisterClient = "";
  ClientIDSelected = "";
  ClientListMenuShow = true;
  drawerNotifications = false;
  msg = "Push";

  @Watch("ClientID")
  onPropertyChanged(clientid: any) {
    for (const i in clientid) {
      this.UpdateClientLog({
        clientid: clientid[i].id,
        logs: null,
      });
    }
  }

  beforeMount(): void {
    this.ListClient();
  }

  handleRegisterClient() {
    this.RegisterClient(this.InputRegisterClient);
    this.InputRegisterClient = "";
    this.VisibleRegisterClient = false;
  }

  handleTest() {
    // console.log("ClientSettings", this.ClientSettings);
    console.log(this.ClientLog);
  }

  handleNotificationsBT() {
    console.log("handleNotificationsBT");
    this.drawerNotifications = true;
    console.log("Notifications", this.Notifications);
  }

  handleSelectClient(index: string) {
    const numberIndex = parseInt(index.split("-")[1]);
    this.ClientIDSelected = this.ClientID[numberIndex].id;
  }

  RerenderClientListMenu() {
    this.ClientListMenuShow = false;
    this.$nextTick(() => {
      this.ClientListMenuShow = true;
      this.$nextTick();
    });
  }

  checkRemoveClient() {
    const clientArray = [];
    for (const id in this.ClientLog) {
      clientArray.push(id);
    }
    return clientArray.includes(this.ClientIDSelected);
  }

  async handleRemoveClient() {
    this.activeIndexSelectClient = "0";
    await this.RemoveClient(this.ClientIDSelected).then((data: any) => {
      if (data.status === serverstatus.SUCCESS) {
        this.RemoveClientID(this.ClientIDSelected);
      }
    });
    this.ClientIDSelected = "";
    this.RerenderClientListMenu();
  }
}
</script>

<style lang="scss">
.right-main {
  display: flex;
  flex-direction: column;
  flex: auto;

  .iconblock-small {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto 10px;
  }

  .iconblock-small:hover {
    color: RoyalBlue;
  }

  .right-main-header {
    display: flex;
    flex-direction: row;
    background-color: #b3c0d1;
    color: white;
    box-shadow: 0 0 15px rgba(4, 4, 4, 0.3);
    z-index: 1;
    line-height: 60px;
    font-size: 12px;
    height: 46px;

    .header-left {
      display: flex;
      flex-direction: row;
    }

    .header-right {
      display: flex;
      flex-direction: row;
      margin-left: auto;
    }
  }
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
