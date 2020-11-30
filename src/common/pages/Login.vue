<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="4">
          <b-card no-body class="p-4">
            <b-form>
              <h1>Login</h1>
              <p class="text-muted">Effettua il login al tuo account</p>
              <b-input-group class="mb-3">
                <b-input-group-prepend
                  ><b-input-group-text><i class="fa fa-user"></i></b-input-group-text
                ></b-input-group-prepend>
                <b-form-input
                  type="text"
                  class="form-control"
                  placeholder="Email"
                  autocomplete="username email"
                  v-model="email"
                  required
                  autofocus
                />
              </b-input-group>
              <b-input-group class="mb-4">
                <b-input-group-prepend
                  ><b-input-group-text><i class="fa fa-lock"></i></b-input-group-text
                ></b-input-group-prepend>
                <b-form-input
                  type="password"
                  class="form-control"
                  placeholder="Password"
                  autocomplete="current-password"
                  v-model="password"
                  required
                />
              </b-input-group>
              <b-row>
                <b-col cols="6">
                  <b-button variant="primary" class="px-4" @click="handleSubmit">Login</b-button>
                </b-col>
                <b-col cols="6" class="text-right">
                  <b-button variant="link" class="px-0">Password dimenticata?</b-button>
                </b-col>
              </b-row>
            </b-form>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import HttpManager from "@/services/HttpManager";
import { LOGIN, getServiceInfo } from "@/services/restServices";
import { doLogon } from "@/services/security";
import { showMsgErroreEsecuzione } from "@/services/utilities";
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    // showMsgConfermaEsecuzione(message) {
    //   this.$bvModal
    //     .msgBoxOk(message, {})
    //     .then((value) => {})
    //     .catch((err) => {
    //       // An error occurred
    //     });
    // },

    handleSubmit(e) {
      e.preventDefault();
      const httpService = new HttpManager();
      let info = getServiceInfo(LOGIN);
      let hash = this.$crypto.MD5(this.password);
      info.request = {
        email: this.email,
        password: this.password,
        passwordMd5: hash.toString(this.$crypto.enc.Hex).toUpperCase(),
        application: "MyBank",
      };

      //const httpService = new HttpServer();
      try {
        httpService
          .callNodeServer(info)
          .then((response) => {
            let dati = response.data;
            if (dati.error.code === 0) {
              doLogon(dati.data.uniqueId);
              // this.$store.commit("updateKeyStorage", {
              //   key: "uid",
              //   value: dati.data.uniqueId,
              // });
              //this.$store.commit("logon", dati.data.uniqueId);
              //this.$root.$emit("MyBankLogon", "logon");
              let r = router.history.current;
              let redirect = "/";
              if (typeof r.query.redirect != "undefined") redirect = r.query.redirect;
              router.push(redirect);
            } else {
              showMsgErroreEsecuzione(this);
            }
          })
          .catch((error) => {
            showMsgErroreEsecuzione(this, error);
          });
      } catch (error) {
        showMsgErroreEsecuzione(this, error);
      }
    },
  },
};
</script>
