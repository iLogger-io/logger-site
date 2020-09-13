<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Action, State, Getter } from "vuex-class";
import { Component, Vue } from "vue-property-decorator";
import serverstatus from "./utils/status";
import { num2buf } from "./utils/convert";
import { msleep } from "./utils/helper";
import pushNotificationBrowser from "./utils/pushNotification";

@Component({})
export default class App extends Vue {
  @Getter("user/Token") Token: any;
  @Action("ui/UpdateInternetDialog") UpdateInternetDialog: any;
  @Action("ui/PushNotification") PushNotification: any;

  @Getter("device/DeviceLog") DeviceLog: any;
  @Getter("device/DeviceSettings") DeviceSettings: any;
  @Action("device/GetLogs") GetLogs: any;
  @Action("device/UpdateDeviceLog") UpdateDeviceLog: any;
  @Action("device/UpdateNewLogTrigger") UpdateNewLogTrigger: any;

  WSS_DOMAIN = "";
  QueueRerender: any[] = [];
  TRUE = true;

  async ThreadQueueRerender() {
    while (this.TRUE) {
      if (this.QueueRerender.length > 0) {
        this.UpdateNewLog(this.QueueRerender.pop());
      }
      await msleep(100);
    }
  }

  async UpdateNewLog(wsMessage: any) {
    /* Get last Device id */
    wsMessage.deviceid = wsMessage.deviceid.replace(/ /g, "+");
    let gt = null;
    if (Object.values(this.DeviceLog[wsMessage.deviceid]).length > 0) {
      gt = this.DeviceLog[wsMessage.deviceid].slice(-1)[0]._id;
    }
    let result: any;
    await this.GetLogs({ deviceid: wsMessage.deviceid, gt: gt }).then(
      (data: any) => {
        result = data;
      }
    );
    if (result.status === serverstatus.SUCCESS) {
      for (const i in result.logs) {
        this.DeviceLog[wsMessage.deviceid].push(result.logs[i]);
      }
      await this.UpdateDeviceLog({
        deviceid: wsMessage.deviceid,
        logs: this.DeviceLog[wsMessage.deviceid]
      });
      this.UpdateNewLogTrigger(wsMessage);
    }
  }

  async wssOpen() {
    console.log("wssOpen");

    const jsonToken = JSON.stringify({
      path: "/token",
      token: this.Token
    });

    const jsonTokenBuffer = Buffer.from(jsonToken);
    const jsonTokenLengthBuffer = num2buf(jsonTokenBuffer.length);
    const sendBuf = Buffer.concat(
      [jsonTokenLengthBuffer, jsonTokenBuffer],
      2 + jsonTokenBuffer.length
    );
    await (this as any).$wss.send(sendBuf);

    this.UpdateInternetDialog(false);
    this.$message({
      message: "Connect to the server successfully",
      type: "success"
    });

    for (const key in this.DeviceLog) {
      if (this.DeviceLog[key] !== null) {
        const jsonToken = JSON.stringify({
          path: "/registerDeviceID",
          deviceid: key
        });

        const jsonTokenBuffer = Buffer.from(jsonToken);
        const jsonTokenLengthBuffer = num2buf(jsonTokenBuffer.length);
        const sendBuf = Buffer.concat(
          [jsonTokenLengthBuffer, jsonTokenBuffer],
          2 + jsonTokenBuffer.length
        );
        await (this as any).$wss.send(sendBuf);
      }
    }
  }

  wssOnMessage(event: any) {
    const wsMessage = JSON.parse(event.data);
    switch (wsMessage.command) {
      case "pushlog":
        this.QueueRerender.push(wsMessage);
        break;
      case "pushNotification":
        this.PushNotification(wsMessage.messages);
        if (Object.values(this.DeviceSettings).length > 0) {
          if (wsMessage.deviceid !== null) {
            if (
              this.DeviceSettings[wsMessage.deviceid].PushNotifications
                .Browser === true
            ) {
              pushNotificationBrowser(
                "ILogger Notifications",
                wsMessage.messages.msg
              );
            }
          }
        }
        break;
    }
  }

  wssOnClose(event: any) {
    if (event.wasClean) {
      console.log(
        `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
      );
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      console.log("[close] Connection died");
      this.UpdateInternetDialog(true);
      if (this.Token !== null && this.Token !== "") {
        setTimeout(() => {
          console.log("Reconnect to websockket server");
          Vue.prototype.$wss = new WebSocket(this.WSS_DOMAIN);
          (this as any).$wss.onopen = this.wssOpen;
          (this as any).$wss.onmessage = this.wssOnMessage;
          (this as any).$wss.onclose = this.wssOnClose;
        }, 10000);
      }
    }
  }

  beforeMount(): void {
    if (process.env.NODE_ENV === "development") {
      this.WSS_DOMAIN = "ws://localhost:3000";
    } else if (process.env.NODE_ENV === "production") {
      this.WSS_DOMAIN = "wss://api.ilogger.io";
    }
    if (
      (this.Token === null || this.Token === "") &&
      this.$router.currentRoute.path !== "/signup" &&
      this.$router.currentRoute.path !== "/verifyemail"
    ) {
      this.$router.push("/login");
    } else {
      if (
        this.$router.currentRoute.path !== "/signup" &&
        this.$router.currentRoute.path !== "/verifyemail"
      ) {
        Vue.prototype.$wss = new WebSocket(this.WSS_DOMAIN);
        (this as any).$wss.onopen = this.wssOpen;
        (this as any).$wss.onmessage = this.wssOnMessage;
        (this as any).$wss.onclose = this.wssOnClose;
        Notification.requestPermission(function(status) {
          console.log("Notification permission status:", status);
        });

        this.ThreadQueueRerender();
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #102a43;
  background-image: url("./assets/LVs7-dots.png");
  background-size: contain;
}

body {
  margin: 0;
}
</style>
