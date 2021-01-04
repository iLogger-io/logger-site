<template>
  <div class="login">
    <el-card>
      <h2>Login</h2>
      <el-form
        class="login-form"
        :model="form"
        :rules="rules"
        ref="form"
        @submit.native.prevent="login"
      >
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="Email" prefix-icon="fas fa-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="Password"
            type="password"
            prefix-icon="fas fa-lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            class="login-button"
            type="primary"
            native-type="submit"
            block
            >Login</el-button
          >
        </el-form-item>
        <div>
          <router-link to="/signup">Sign up a new Account</router-link>
        </div>
        <div>
          <router-link to="/forgotpassword">Forgot password ?</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Action, State } from "vuex-class";
import { Component, Vue } from "vue-property-decorator";
import serverstatus from "@/utils/status";

interface LoginType extends Vue {
  validate(): any;
}

@Component
export default class Login extends Vue {
  @Action("user/Login") Login: any;
  @State((state) => state.user.token) Token: any;

  $refs!: {
    form: LoginType;
  };

  form: any = {
    email: "",
    password: "",
  };
  loading = false;
  rules: any = {
    email: [
      {
        required: true,
        message: "Please input email address",
        trigger: "blur",
      },
      {
        type: "email",
        message: "Please input correct email address",
        trigger: ["blur", "change"],
      },
    ],
    password: [
      { required: true, message: "Password is required", trigger: "blur" },
      {
        min: 5,
        message: "Password length should be at least 5 characters",
        trigger: "blur",
      },
    ],
  };

  beforeMount(): void {
    if (this.Token !== null && this.Token !== "") {
      this.$router.push("/");
    }
  }

  async login() {
    const valid = await this.$refs.form.validate();
    if (!valid) {
      return;
    }
    this.loading = true;
    await this.Login(this.form)
      .then((data: any) => {
        if (data.status === serverstatus.SUCCESS) {
          (this as any).$axios.defaults.headers["Authorization"] = `Bearer ${data.user.token}`;
          this.$message.success(data.msg);
          // this.$router.push("/");
          window.location.reload();
        } else {
          this.$message.error(data.msg);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
    this.loading = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button {
  width: 100%;
  margin-top: 40px;
}
.login-form {
  width: 290px;
}
.forgot-password {
  margin-top: 10px;
}
</style>
<style lang="scss">
$teal: rgb(0, 124, 137);
.el-button--primary {
  background: $teal;
  border-color: $teal;

  &:hover,
  &.active,
  &:focus {
    background: lighten($teal, 7);
    border-color: lighten($teal, 7);
  }
}
.login .el-input__inner:hover {
  border-color: $teal;
}
.login .el-input__prefix {
  background: rgb(238, 237, 234);
  left: 0;
  height: calc(100% - 2px);
  left: 1px;
  top: 1px;
  border-radius: 3px;
  .el-input__icon {
    width: 30px;
  }
}
.login .el-input input {
  padding-left: 35px;
}
.login .el-card {
  padding-top: 0;
  padding-bottom: 30px;
}
h2 {
  font-family: "Open Sans";
  letter-spacing: 1px;
  font-family: Roboto, sans-serif;
  padding-bottom: 20px;
}
a {
  color: $teal;
  text-decoration: none;
  &:hover,
  &:active,
  &:focus {
    color: lighten($teal, 7);
  }
}
.login .el-card {
  width: 340px;
  display: flex;
  justify-content: center;
}
</style>
