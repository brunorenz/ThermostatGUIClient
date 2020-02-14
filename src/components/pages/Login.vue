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
                  ><b-input-group-text
                    ><i class="fa fa-user"></i></b-input-group-text
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
                  ><b-input-group-text
                    ><i class="fa fa-lock"></i></b-input-group-text
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
                  <b-button variant="primary" class="px-4" @click="handleSubmit"
                    >Login</b-button
                  >
                </b-col>
                <b-col cols="6" class="text-right">
                  <b-button variant="link" class="px-0"
                    >Password dimenticata?</b-button
                  >
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
import HttpServer from "@/services/httpMonitorRest";
import router from "@/router/index";
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    showMsgConfermaEsecuzione(message) {
      this.$bvModal
        .msgBoxOk(message, {
          //          title: "Please Confirm",
          //          okVariant: "danger"
        })
        .then(value => {})
        .catch(err => {
          // An error occurred
        });
    },

    handleSubmit(e) {
      e.preventDefault();

      const httpService = new HttpServer();
      try {
        httpService
          .login(this.email, this.password)
          .then(response => {
            let dati = response.data;
            if (dati.error.code === 0) {
              window.sessionStorage.setItem("jwt", JSON.stringify(dati.data));
              window.sessionStorage.setItem("jwttoken", dati.data.token);
              let r = router.history.current;
              let redirect = "/";
              if (typeof r.query.redirect != "undefined")
                redirect = r.query.redirect;
              router.push(redirect);
            } else {
              //   console.log(
              //     "Errore in fase di autenticazione! " + dati.error.message
              //   );
              this.showMsgConfermaEsecuzione(
                "Errore in fase di logon : " + dati.error.message
              );
            }
          })
          .catch(error => {
            //            console.log("Error callig service 'getConfiguration' : " + error);
            this.showMsgConfermaEsecuzione(
              "Servizio non disponibile : " + error
            );
          });
      } catch (error) {
        this.showMsgConfermaEsecuzione("Servizio non disponibile : " + error);
      }
    }
  }
};
</script>
