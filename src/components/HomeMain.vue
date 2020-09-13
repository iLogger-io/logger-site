<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-drawer
      title="Notifications"
      :visible.sync="drawerNotifications"
      :with-header="true"
    >
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
      class="device-list"
      width="200px"
      style="background-color: rgb(238, 241, 246); border-right: 1px solid rgba(120, 153, 182, 0.507); color: #333;"
    >
      <div v-if="DeviceListMenuShow">
        <el-menu
          :default-active="activeIndexSelectDevice"
          :default-openeds="['1']"
          @select="handleSelectDevice"
        >
          <el-submenu index="1">
            <template slot="title"
              >Device list <i class="fas fa-microchip"></i
            ></template>
            <el-tooltip
              placement="right"
              effect="light"
              v-for="(item, index) in DeviceID"
              v-bind:item="item"
              v-bind:key="item.id"
            >
              <div slot="content">Device ID:<br />{{ item.id }}</div>
              <el-menu-item v-bind:index="`1-${index}`">{{
                item.name
              }}</el-menu-item>
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
              <div slot="content" style="font-size:14px">
                Register new device
              </div>
              <el-popover
                placement="bottom"
                width="200"
                v-model="VisibleRegisterDevice"
              >
                <p>Register new device</p>
                <div style="text-align: right; margin: 0">
                  <el-input
                    size="mini"
                    placeholder="Please give it a short name"
                    style="margin: 0px 40px 20px 0px;"
                    v-model="InputRegisterDevice"
                    clearable
                  ></el-input>
                  <el-button
                    size="mini"
                    type="text"
                    @click="VisibleRegisterDevice = false"
                    >cancel</el-button
                  >
                  <el-button
                    type="primary"
                    size="mini"
                    @click="handleRegisterDevice()"
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
              <div slot="content" style="font-size:14px">Remove device</div>
              <el-button
                type="primary"
                icon="fas fa-minus-circle"
                circle
                size="mini"
                @click="handleRemoveDevice()"
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
              @click="handleTest()"
            ></el-button>
          </div>
          <div class="iconblock-small">
            <el-tooltip placement="top">
              <div slot="content" style="font-size:14px">Notifications</div>
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
      <el-main style="padding: 0; background-color: #002b35; display: flex;">
        <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
        <WindowLog
          v-for="item in DeviceID"
          v-bind:key="item.id"
          :deviceid="item.id"
          :currentdeviceid="DeviceIDSelected"
          v-show="DeviceIDSelected === item.id"
          v-if="checkRemoveDevice()"
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

@Component({
  components: {
    WindowLog,
    NotificationComponent
  }
})
export default class HomeMain extends Vue {
  @Action("device/Register") RegisterDevice: any;
  @Action("device/Remove") RemoveDevice: any;
  @Action("device/List") ListDevice: any;
  @Getter("device/DeviceID") DeviceID: any;
  @Action("device/RemoveDeviceID") RemoveDeviceID: any;
  @Action("device/UpdateDeviceLog") UpdateDeviceLog: any;
  @Getter("device/DeviceLog") DeviceLog: any;
  @Getter("ui/UIstatus") UIstatus: any;
  @Getter("ui/Notifications") Notifications: any;
  @Getter("device/DeviceSettings") DeviceSettings: any;

  activeIndexSelectDevice = "0";
  VisibleRegisterDevice = false;
  InputRegisterDevice = "";
  DeviceIDSelected = "";
  DeviceListMenuShow = true;
  drawerNotifications = false;
  msg = "Push";

  @Watch("DeviceID")
  onPropertyChanged(deviceid: any) {
    for (const i in deviceid) {
      this.UpdateDeviceLog({
        deviceid: deviceid[i].id,
        logs: null
      });
    }
  }

  beforeMount(): void {
    this.ListDevice();
  }

  handleRegisterDevice() {
    this.RegisterDevice(this.InputRegisterDevice);
    this.InputRegisterDevice = "";
    this.VisibleRegisterDevice = false;
  }

  handleTest() {
    // console.log("DeviceSettings", this.DeviceSettings);
    console.log(this.DeviceLog);
  }

  handleNotificationsBT() {
    console.log("handleNotificationsBT");
    this.drawerNotifications = true;
    console.log("Notifications", this.Notifications);
  }

  handleSelectDevice(index: string) {
    const numberIndex = parseInt(index.split("-")[1]);
    this.DeviceIDSelected = this.DeviceID[numberIndex].id;
  }

  RerenderDeviceListMenu() {
    this.DeviceListMenuShow = false;
    this.$nextTick(() => {
      this.DeviceListMenuShow = true;
      this.$nextTick();
    });
  }

  checkRemoveDevice() {
    const deviceArray = [];
    for (const id in this.DeviceLog) {
      deviceArray.push(id);
    }
    return deviceArray.includes(this.DeviceIDSelected);
  }

  async handleRemoveDevice() {
    this.activeIndexSelectDevice = "0";
    await this.RemoveDevice(this.DeviceIDSelected).then((data: any) => {
      if (data.status === serverstatus.SUCCESS) {
        this.RemoveDeviceID(this.DeviceIDSelected);
      }
    });
    this.DeviceIDSelected = "";
    this.RerenderDeviceListMenu();
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
