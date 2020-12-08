<template>
  <div class="hello"></div>
</template>
<script>
import HttpManager from "@/common/services/HttpManager";
import { LOGOUT, getServiceInfo } from "@/common/services/commonRestServices";
import { showMsgErroreEsecuzione } from "@/common/services/utilities";
import { doLogoff } from "@/common/services/security";
import router from "@/router";
export default {
  mounted: function () {
    doLogoff();
    this.handleSubmit();
    router.push("/login");
  },
  methods: {
    handleSubmit() {
      const httpService = new HttpManager();
      let info = getServiceInfo(LOGOUT);
      new HttpManager()
        .callNodeServer(info)
        .then((response) => {
          let dati = response.data;
          if (dati.error.code != 0) {
            showMsgErroreEsecuzione(this);
          }
        })
        .catch((error) => {
          showMsgErroreEsecuzione(this, error);
        });
    },
  },
};
</script>
