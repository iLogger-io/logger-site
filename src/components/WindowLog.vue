<template>
  <div class="windowlog">
    <div>
      <el-collapse accordion>
        <el-collapse-item name="1">
          <template slot="title">
            <i class="fas fa-search" style="margin: 0 4px;"></i>
            <div>Query</div>
          </template>
          <div class="chart-container">
            <canvas id="query-chart"></canvas>
          </div>
          <div class="query-data">
            <el-date-picker
              v-model="QueryTime"
              type="datetimerange"
              align="right"
              start-placeholder="Start Date"
              end-placeholder="End Date"
              :default-time="['12:00:00', '08:00:00']"
            >
            </el-date-picker>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="windowlogFix">
      <div class="timelogfix"></div>
      <div class="mainlogfix"></div>
      <el-button
        class="settingsFix"
        style="top: 10px; right: 10px;"
        type="primary"
        icon="fas fa-tools"
        circle
        size="mini"
        @click="handleSettingsBT()"
      ></el-button>

      <div
        class="settingsFix"
        style="bottom: 10px; right: 10px;"
        @click="handleScrollToBottom()"
      >
        <i class="fas fa-angle-down fa-3x"></i>
      </div>

      <el-dialog
        title="Settings"
        :visible.sync="SettingsBTdialogVisible"
        width="40%"
      >
        <el-form
          ref="Settingsform"
          :model="Settingsform"
          label-width="140px"
          size="mini"
          :label-position="'left'"
        >
          <el-form-item label="Device ID">{{ deviceid }}</el-form-item>
          <el-form-item label="Push Notifications:"></el-form-item>
          <el-form-item label="Email">
            <el-col :span="3">
              <el-switch
                v-model="Settingsform.PushNotifications.Email"
              ></el-switch>
            </el-col>
          </el-form-item>
          <el-form-item label="Browser">
            <el-col :span="3">
              <el-switch
                v-model="Settingsform.PushNotifications.Browser"
              ></el-switch>
            </el-col>
          </el-form-item>
          <el-form-item label="Trigger Events:"></el-form-item>
          <el-form-item label="Error Log">
            <el-col :span="1">
              <el-checkbox
                v-model="Settingsform.TriggerEvents.ErrorLog"
              ></el-checkbox>
            </el-col>
          </el-form-item>
          <el-form-item label="Warning Log">
            <el-col :span="1">
              <el-checkbox
                v-model="Settingsform.TriggerEvents.WarningLog"
              ></el-checkbox>
            </el-col>
          </el-form-item>
          <el-form-item label="Match Case">
            <el-input
              size="mini"
              v-model="Settingsform.TriggerEvents.Matchcase"
            ></el-input>
          </el-form-item>
          <el-form-item label="Regex">
            <el-input
              size="mini"
              v-model="Settingsform.TriggerEvents.Regex"
              type="textarea"
              :rows="4"
            ></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="SettingsBTdialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleSaveSettings()">
            Save
          </el-button>
        </span>
      </el-dialog>
      <div class="windowlogmain" ref="windowlogref" @scroll="handleScroll">
        <div class="timelog">
          <div
            class="timelogchild"
            ref="timeref"
            v-for="item in DeviceLog[deviceid]"
            v-bind:key="item._id"
          >
            {{ HourMinuteSecondsOnly(item.time) }}
          </div>
        </div>
        <div class="mainlog">
          <PRE
            class="log"
            ref="logref"
            v-for="(item, index) in DeviceLog[deviceid]"
            v-bind:style="item.style"
            v-bind:key="item._id"
          >
            {{ ColorParser(item.stylelog, index) }}
          </PRE>
        </div>
      </div>
    </div>
    <div class="windowlogCommand">
      <div class="CommandLine">
        <el-row
          type="flex"
          class="row-bg"
          justify="start"
          style="margin: 10px 0 0 0;"
        >
          <el-col :span="4"
            ><el-checkbox
              v-model="Newline.CR"
              label="CR \r"
              name="type"
            ></el-checkbox
          ></el-col>
          <el-col :span="10"
            ><el-checkbox
              v-model="Newline.LF"
              label="LF \n"
              name="type"
            ></el-checkbox
          ></el-col>
        </el-row>
        <el-input
          type="textarea"
          :rows="4"
          placeholder="Send command to device"
          v-model="Commandline"
          style="margin: 10px 0;"
        >
        </el-input>
        <el-button type="primary" icon="fas fa-paper-plane" @click="handleCommandline()"></el-button>
      </div>
      <div class="Macro">
        <!-- <el-button
          type="primary"
          icon="fas fa-box"
          circle
          size="mini"
          @click="handleTest()"
        ></el-button> -->
        <el-form ref="Macroform" size="mini" :label-position="'left'">
          <el-form-item label="Reset">
            <el-col :span="1">
              <el-button
                type="primary"
                icon="fas fa-redo-alt"
                size="mini"
                @click="handleCommands('reset')"
              ></el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Action, Getter } from "vuex-class";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import serverstatus from "../utils/status";
import { num2buf } from "../utils/convert";
import Chart from "chart.js";

@Component({
  components: {}
})
export default class WindowLog extends Vue {
  @Prop() private deviceid!: string;
  @Prop() private currentdeviceid!: string;
  @Getter("device/DeviceLog") DeviceLog: any;
  @Getter("device/NewLog") NewLog: any;
  @Getter("device/DeviceSettings") DeviceSettings: any;
  @Action("device/GetLogs") GetLogs: any;
  @Action("device/UpdateDeviceLog") UpdateDeviceLog: any;
  @Action("device/LoadSettings") LoadSettings: any;
  @Action("device/SaveSettings") SaveSettings: any;
  @Action("device/SendCommand") SendCommand: any;
  @Action("device/SendCommandline") SendCommandline: any;

  InitLogValue = true;
  scrollPosition = 0;
  ChechFullHistory = false;
  SettingsBTdialogVisible = false;
  Commandline = "";
  QueryTime = "";

  Settingsform = {
    PushNotifications: {
      Email: false,
      Browser: false
    },
    TriggerEvents: {
      ErrorLog: false,
      WarningLog: false,
      Matchcase: "",
      Regex: ""
    }
  };

  Newline = {
    CR: false,
    LF: true
  };

  barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
      label: 'Dataset 1',
      backgroundColor: 'rgba(79, 226, 21, 0.5)',
      data: [
        1,
        5,
        1,
        10,
        3,
        4,
        6
      ]
    }, {
      label: 'Dataset 2',
      backgroundColor: 'rgba(255, 251, 10, 0.5)',
      data: [
        3,
        2,
        7,
        9,
        9,
        1,
        2
      ]
    }, {
      label: 'Dataset 3',
      backgroundColor: 'rgba(209, 5, 9, 0.5)',
      data: [
        3,
        1,
        2,
        5,
        9,
        8,
        7
      ]
    }]
  };

  @Watch("currentdeviceid")
  onPropertyChanged(currentdeviceid: any) {
    if (this.InitLogValue) {
      if (this.deviceid === currentdeviceid) {
        this.InitLog();
        this.InitLogValue = false;
      }
    }
  }

  @Watch("NewLog")
  onPropertyChanged2(NewLog: any) {
    if (this.deviceid === NewLog.deviceid) {
      for (const i in this.$refs!.logref) {
        const LogsHeight = window
          .getComputedStyle((this as any).$refs!.logref[i])
          .getPropertyValue("height");
        (this as any).$refs!.timeref[i].style.lineHeight = LogsHeight;
      }

      /* Scroll to bottom */
      if (Object.keys(this.DeviceLog[this.deviceid]).length > 0) {
        (this as any).$refs.logref[
          (this as any).$refs!.logref.length - 1
        ].scrollIntoView();
      }
    }
  }

  @Watch("DeviceSettings")
  onPropertyChanged3(DeviceSettings: any) {
    if (this.deviceid === this.currentdeviceid) {
      this.Settingsform = DeviceSettings[this.deviceid];
    }
  }

  beforeMount(): void {
    if (this.deviceid === this.currentdeviceid) {
      this.InitLog();
      this.InitLogValue = false;
    }
  }

  mounted(): void {
    this.createChart("query-chart", this.barChartData);
  }

  async handleScroll(event: any) {
    if (event.srcElement.scrollTop === 0) {
      console.log("onTOP");

      if (!this.ChechFullHistory) {
        /* Get first Device id */
        const lt = this.DeviceLog[this.deviceid][0]._id;
        let result: any;
        await this.GetLogs({ deviceid: this.deviceid, lt: lt }).then(
          (data: any) => {
            result = data;
          }
        );

        if (result.status === serverstatus.SUCCESS) {
          if (result.logs.length === 0) {
            this.ChechFullHistory = true;
          }
          this.DeviceLog[this.deviceid] = result.logs.concat(
            this.DeviceLog[this.deviceid]
          );
          await this.UpdateDeviceLog({
            deviceid: this.deviceid,
            logs: this.DeviceLog[this.deviceid]
          });

          for (const i in this.$refs!.logref) {
            const LogsHeight = window
              .getComputedStyle((this as any).$refs!.logref[i])
              .getPropertyValue("height");
            (this as any).$refs!.timeref[i].style.lineHeight = LogsHeight;
          }
        }
      }
    }
  }

  async InitLog() {
    let result: any;
    await this.GetLogs({ deviceid: this.deviceid }).then((data: any) => {
      result = data;
    });

    // console.log("result", result)
    if (result!.status === serverstatus.SUCCESS) {
      await this.UpdateDeviceLog({
        deviceid: this.deviceid,
        logs: result!.logs
      });
      const jsonToken = JSON.stringify({
        path: "/registerDeviceID",
        deviceid: this.deviceid
      });

      const jsonTokenBuffer = Buffer.from(jsonToken);
      const jsonTokenLengthBuffer = num2buf(jsonTokenBuffer.length);
      const sendBuf = Buffer.concat(
        [jsonTokenLengthBuffer, jsonTokenBuffer],
        2 + jsonTokenBuffer.length
      );
      await (this as any).$wss.send(sendBuf);
      this.LoadSettings(this.deviceid);
      this.updateLogStyle();
    }
  }

  updateLogStyle() {
    for (const i in this.$refs!.logref) {
      const LogsHeight = window
        .getComputedStyle((this as any).$refs!.logref[i])
        .getPropertyValue("height");
      (this as any).$refs!.timeref[i].style.lineHeight = LogsHeight;
    }

    /* Scroll to bottom */
    if (Object.keys(this.DeviceLog[this.deviceid]).length > 0) {
      (this as any).$refs.logref[
        (this as any).$refs!.logref.length - 1
      ].scrollIntoView();
    }
  }

  handleSettingsBT() {
    this.SettingsBTdialogVisible = true;
  }

  handleSaveSettings() {
    this.SettingsBTdialogVisible = false;
    this.SaveSettings({
      deviceid: this.deviceid,
      settings: this.DeviceSettings[this.deviceid]
    });
  }

  handleScrollToBottom() {
    if (Object.keys(this.DeviceLog[this.deviceid]).length > 0) {
      (this as any).$refs.logref[
        (this as any).$refs!.logref.length - 1
      ].scrollIntoView();
    }
  }

  handleTest() {
    console.log("handleTest");
  }

  handleCommandline() {
    if (this.Commandline !== "") {
      let str = this.Commandline + "\n";
      if (this.Newline.CR && this.Newline.LF) {
        str = str.replace(/\n/g, "\r\n");
      } else if (this.Newline.CR && !this.Newline.LF) {
        str = str.replace(/\n/g, "\r");
      } else if (!this.Newline.CR && this.Newline.LF) {
        str = str.replace(/\n/g, "\n");
      }

      this.SendCommandline({
        deviceid: this.deviceid,
        string: str
      });
    }
  }

  handleCommands(command: string) {
    console.log("handleCommands", command);
    this.SendCommand({
      deviceid: this.deviceid,
      command: command
    });
  }

  HourMinuteSecondsOnly(DateString: string) {
    const date = new Date(DateString);
    const hours = date
      .getHours()
      .toString()
      .padStart(2, "0");
    const minutes = date
      .getMinutes()
      .toString()
      .padStart(2, "0");
    const seconds = date
      .getSeconds()
      .toString()
      .padStart(2, "0");
    const miliseconds = date
      .getMilliseconds()
      .toString()
      .padStart(3, "0");
    return `${hours}:${minutes}:${seconds}.${miliseconds}`;
  }

  ColorParser(text: string, index: number) {
    return text;
  }

  createChart(chartId: string, chartData: any) {
    const ctx = document.getElementById(chartId) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        title: {
          display: false,
          text: 'Chart.js Bar Chart - Stacked'
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: true
            }
          ],
          yAxes: [
            {
              stacked: true
            }
          ]
        }
      }
    });
  }
}
</script>

<style lang="scss">
.windowlog {
  flex: 1;
  display: flex;
  flex-direction: column;

  .el-collapse-item__header {
    height: 20px;
  }

  .el-collapse-item__content {
    padding-bottom: 5px;
  }

  .chart-container {
    width: 100%;
    height: 200px;
  }

  .query-data {
    margin: 4px;
  }

  .windowlogFix {
    flex: 1;
    display: flex;
    flex-direction: row;
    overflow-y: hidden;
    position: relative;

    .windowlogmain {
      z-index: 101;
      flex: 1;
      display: flex;
      overflow-y: scroll;
      color: #657c80;
      .timelog {
        flex-basis: 100px;
        .timelogchild {
          text-align: center;
          vertical-align: top;
        }
      }
      .mainlog {
        flex: 1;
        .log {
          white-space: pre-wrap;
          text-align: left;
          line-height: 20px;
          font-size: 14px;
          margin: 0;
        }
        .log:hover {
          background-color: #004352;
        }
      }
    }

    .settingsFix {
      z-index: 1001;
      position: absolute;
    }

    .timelogfix {
      z-index: 100;
      background-color: #01232c;
      position: absolute;
      height: 100%;
      width: 100px;
    }

    .mainlogfix {
      z-index: 100;
      background-color: #002b35;
      position: absolute;
      left: 100px;
      height: 100%;
      width: calc(100% - 100px);
    }
  }
  .windowlogCommand {
    background-color: #b3c0d1;
    flex-basis: 200px;
    display: flex;
    .CommandLine {
      flex: 1;
      background-color: white;
      margin: 2px;
      padding: 4px;
    }
    .Macro {
      flex: 2;
      background-color: white;
      margin: 2px 2px 2px 0;
      padding: 10px;
    }
  }
}
</style>
