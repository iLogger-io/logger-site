<template>
  <div class="verifyemail">
    <h1>This is an verify email page</h1>
  </div>
</template>

<script lang="ts">
import { Action } from "vuex-class";
import { Component, Vue } from "vue-property-decorator";
import serverstatus from "@/utils/status";

@Component({
  components: {},
})
export default class LoginPage extends Vue {
  @Action("user/VerifyEmail") VerifyEmail: any;

  beforeMount(): void {
    this.VerifyEmail({
      VerifyEmailId: this.$route.query.id,
    })
      .then((data: any) => {
        if (data.status === serverstatus.SUCCESS) {
          this.$message.success(data.msg);
          this.$router.push("/login");
        } else {
          this.$message.error(data.msg);
        }
      })
      .catch((error: unknown) => {
        console.log(error);
      });
  }
}
</script>
