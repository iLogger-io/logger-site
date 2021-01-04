<template>
  <div class="signup">
    <el-card>
      <h2>Signup</h2>
      <el-form
        class="signup-form"
        :model="model"
        :rules="rules"
        ref="form"
        @submit.native.prevent="signup"
      >
        <el-form-item prop="displayName">
          <el-input
            v-model="model.displayName"
            placeholder="Display Name"
            prefix-icon="fas fa-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input
            v-model="model.email"
            placeholder="Email"
            prefix-icon="far fa-envelope"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="model.password"
            placeholder="Password"
            type="password"
            prefix-icon="fas fa-lock"
          ></el-input>
        </el-form-item>
        <el-form-item prop="passwordConfirm">
          <el-input
            v-model="model.passwordConfirm"
            placeholder="Confirm Password"
            type="password"
            prefix-icon="fas fa-lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            class="signup-button"
            type="primary"
            native-type="submit"
            block
            >Signup</el-button
          >
        </el-form-item>
        <div>
          <router-link to="/login">Login</router-link>
        </div>
        <div>
          <router-link to="/forgotpassword">Forgot password ?</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Action } from "vuex-class";
import { Component, Vue } from "vue-property-decorator";

interface SignupType extends Vue {
  validate(): any;
}

@Component
export default class Signup extends Vue {
  @Action("user/Signup") Signup: any;

  $refs!: {
    form: SignupType;
  };

  model: any = {
    displayName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  };
  loading = false;
  rules: any = {
    displayName: [
      {
        required: true,
        message: "Display Name is required",
        trigger: "blur",
      },
      {
        min: 3,
        message: "Display Name length should be at least 3 characters",
        trigger: "blur",
      },
    ],
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
        min: 8,
        message: "Password length should be at least 8 characters",
        trigger: "blur",
      },
    ],
    passwordConfirm: [
      {
        required: true,
        message: "Password confirmation is required",
        trigger: "blur",
      },
      {
        min: 8,
        message: "Password confirmation length should be at least 8 characters",
        trigger: "blur",
      },
    ],
  };

  async signup() {
    const valid = await this.$refs.form.validate();
    if (!valid) {
      return;
    }
    if (this.model.password !== this.model.passwordConfirm) {
      return;
    }

    delete this.model.passwordConfirm;
    this.loading = true;
    await this.Signup(this.model)
      .then((data: any) => {
        if (data.status === 0) {
          this.$message.success(data.msg);
          this.$router.push("/login");
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
.signup {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.signup-button {
  width: 100%;
  margin-top: 40px;
}
.signup-form {
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
.signup .el-input__inner:hover {
  border-color: $teal;
}
.signup .el-input__prefix {
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
.signup .el-input input {
  padding-left: 35px;
}
.signup .el-card {
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
.signup .el-card {
  width: 340px;
  display: flex;
  justify-content: center;
}
</style>
