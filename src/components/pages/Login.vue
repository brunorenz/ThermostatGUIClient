<template>
  <div>
    <h4>Login</h4>
    <form>
      <label for="email">E-Mail Address</label>
      <div>
        <input id="email" type="email" v-model="email" required autofocus />
      </div>
      <div>
        <label for="password">Password</label>
        <div>
          <input id="password" type="password" v-model="password" required />
        </div>
      </div>
      <div>
        <button type="submit" @click="handleSubmit">
          Login
        </button>
      </div>
    </form>
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
