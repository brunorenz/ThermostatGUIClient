<template>
  <b-div>
    <h5 class="card-title mb-1">Temperatura Esterna</h5>
    <b-row>
      <b-col class="text-left" sm="2">
        <h1>
          <strong>{{ dati.name }}</strong>
        </h1>
      </b-col>
      <b-col sm="1">
        <img style="width: 48px;" src="img/temperature.png" />
      </b-col>
      <b-col sm="2">
        <h1>
          <strong> {{ dati.main.temp }}° </strong>
        </h1>
      </b-col>
      <b-col sm="1">
        <img
          style="width: 48px;"
          :src="'img/openweather/' + dati.weather[0].icon + '@2x.png'"
        />
      </b-col>
      <b-col>
        <h1>
          <strong> {{ dati.weather[0].description }}</strong>
        </h1>
      </b-col>
    </b-row>
    <b-modal
      v-model="tmpModalData.showUpdateModal"
      id="modalAggiornaStato"
      title="Aggiorna Stato Relè"
      @ok="updateStatus"
      :ok-disabled="tmpModalData.disable"
    >
      <b-form-group label-cols-lg="6" label="Imposta tipo programma">
        <div sm="1">
          <b-form-radio-group
            id="idXX"
            v-model="tmpModalData.currentProg"
            placeholder="Imposta stato Relè"
          >
            <b-row>
              <b-form-radio class="mx-2" value="0">SPENTO</b-form-radio>
            </b-row>
            <b-row>
              <b-form-radio class="mx-2" value="1">ACCESO</b-form-radio>
            </b-row>
            <b-row>
              <b-form-radio class="mx-2" value="2">MANUALE</b-form-radio>
            </b-row>
            <b-row>
              <b-form-radio class="mx-2" value="3">AUTOMATICO</b-form-radio>
            </b-row>
          </b-form-radio-group>
        </div>
      </b-form-group>
    </b-modal>
  </b-div>
</template>

<script>
import moment from "moment";
import ModalConfiguration from "@/components/common/ModalConfiguration";
import HttpServer from "@/services/httpMonitorRest";
import { setTimeout, clearTimeout, setImmediate } from "timers";
import { getConfiguration, TypeStatus, checkSecurity } from "@/services/config";
import router from "@/router/index";

export default {
  name: "WeatherMonitor",
  components: {
    ModalConfiguration
  },
  data: function() {
    return {
      timerId: null,
      datiServers: [],
      tmpModalData: {
        disable: false,
        windowsOpen: true,
        showUpdateModal: false,
        currentProg: 0
      },
      model: {
        title: "Configurazione Grafici Sensori",
        fields: []
      },
      dati: {}
    };
  },
  created: function() {
    let name = `${this.$options.name}`;
    console.log("Create component " + name + " .. TIMER : " + this.timerId);
    this.tmpModalData.windowsOpen = true;
  },
  beforeDestroy: function() {
    let name = `${this.$options.name}`;
    console.log("Destroy component " + name + " .. ");
    clearTimeout(this.timerId);
    this.timerId = null;
    this.tmpModalData.windowsOpen = false;
  },
  beforeMount: function() {
    console.log("Load configuration..");
    this.configuration = getConfiguration();
    this.resetConfiguration();
  },
  mounted: function() {
    this.getWeatherData();
  },
  methods: {
    updateStatus(model) {
      let macAddress = this.tmpModalData.currentConfig.macAddress;
      let newStatus = this.tmpModalData.currentProg;
      let oldStatus = this.tmpModalData.currentConfig.statusThermostat;
      if (newStatus != oldStatus) {
        this.$bvModal
          .msgBoxConfirm("Confermi l'aggiornamento ?")
          .then(value => {
            if (value) {
              const httpService = new HttpServer();
              httpService
                .updateStatus({
                  macAddress: macAddress,
                  statusThermostat: newStatus
                })
                .then(response => {
                  let dati = response.data;
                  if (dati.error.code === 0) {
                    this.showMsgConfermaEsecuzione(
                      "Aggiornamento effettuato con successo"
                    );
                    //                    this.tmpModalData.currentConfig = null;
                    this.getReleData();
                  } else {
                    this.showMsgConfermaEsecuzione(
                      "Errore in fase di aggiornamento : " + dati.error.message
                    );
                  }
                })
                .catch(error => {
                  this.showMsgConfermaEsecuzione(
                    "Errore in fase di aggiornamento : " + error
                  );
                });
            }
          })
          .catch(err => {
            // An error occurred
          });
      }
    },
    updateConfiguration(model) {
      if (model.length) {
        for (var ix = 0; ix < model.length; ix++) {
          // valuta ix
          var entry = model[ix];
          switch (entry.id) {
            case "ID0":
              this.tmpModalData.timeout = entry.value;
              break;
          }
        }
        this.refreshConfiguration();
        console.log(
          "update configuration : " + JSON.stringify(this.tmpModalData)
        );
        this.restartTimer();
      }
    },
    refreshConfiguration() {
      console.log("refresh configuration");
      this.model.fields[0].value = this.tmpModalData.timeout;
      for (var ix = 0; ix < this.model.fields.length; ix++) {
        this.model.fields[ix].id = "ID" + ix;
        this.model.fields[ix].state = true;
      }
    },
    resetConfiguration() {
      console.log("reset configuration");
      this.tmpModalData.timeout = this.configuration.releStatus.timeout;
      this.model.fields = [
        {
          label: "Timeout in millisecondi",
          type: "number",
          min: 10000
        }
      ];
      this.refreshConfiguration();
    },
    getServerIndex(serverName) {
      for (let y = 0; y < this.configuration.server.length; y++)
        if (this.configuration.server[y].name === serverName) return y;
      return -1;
    },
    restartTimer() {
      console.log("Clear Timer ID = " + this.timerId);
      clearTimeout(this.timerId);
      console.log("Start immediate getReleData");
      setImmediate(this.getReleData());
    },
    programSwitch(config) {
      checkSecurity(router);
      this.tmpModalData.currentConfig = config;
      this.tmpModalData.showUpdateModal = true;
    },
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
    getWeatherData() {
      const httpService = new HttpServer();
      try {
        httpService
          .getWeatherInfo()
          .then(response => {
            let sd = [];
            this.dati = response.data;
          })
          .catch(error => {
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
