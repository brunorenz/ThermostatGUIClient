<template>
  <div class="animated fadeIn">
    <h2>Gestione Dispositivi</h2>
    <p>Seleziona il dispositivo da configurare.</p>

    <p>
      E' possibile:
      <br />1) Aggiornare il nome del dispositivo <br />2) Impostare modalità di
      funzionamento del dispositivo <br />3) Impostare modalità di relevazione
      temperatura
    </p>

    <b-form-group
      v-if="showListDispositivi"
      label-cols-sm="2"
      label="Dispositivo"
      label-for="selDisp"
      label-class="font-weight-bold"
    >
      <b-form-select
        id="selDisp"
        v-model="dispositivoSelezionato"
        :options="optionsElencoDispositivi"
        @change="showDettaglioDispositivo"
      ></b-form-select>
    </b-form-group>
    <div v-if="showDispositivo">
      <h3>Dati Dispositivo</h3>
      <b-card>
        <b-row>
          <b-col sm="2">
            <label class="font-weight-bold">Tipo</label>
          </b-col>
          <b-col sm="4">
            <label>{{
              elencoDispositivi[dispositivoSelezionato].deviceTypeName
            }}</label>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="2">
            <label class="font-weight-bold">MacAddress</label>
          </b-col>
          <b-col sm="4">
            <label>{{
              elencoDispositivi[dispositivoSelezionato].macAddress
            }}</label>
          </b-col>
          <b-col sm="2">
            <label class="font-weight-bold">IP Address</label>
          </b-col>
          <b-col sm="4">
            <label>{{
              elencoDispositivi[dispositivoSelezionato].ipAddress
            }}</label>
          </b-col>
        </b-row>
        <b-form-group
          label-cols-sm="2"
          label="Posizione"
          label-class="font-weight-bold"
        >
          <b-form-input
            type="text"
            id="location"
            @input.native="checkUpdateField"
            v-model="elencoDispositivi[dispositivoSelezionato].location"
            required
            trim
          ></b-form-input>
        </b-form-group>
        <b-form-group
          v-if="
            elencoDispositivi[dispositivoSelezionato].deviceType === type.SHELLY
          "
          label-cols-sm="2"
          label="Sensore di riferimento"
          label-for="selDisp"
          label-class="font-weight-bold"
        >
          <b-form-select
            id="selDisp"
            v-model="sensoreSelezionato"
            :options="optionsElencoSensori"
            @change="checkUpdateField"
          ></b-form-select>
        </b-form-group>
        <b-row>
          <b-col sm="2">
            <label class="font-weight-bold">Ultimo Accesso</label>
          </b-col>
          <b-col sm="4">
            <label>{{
              elencoDispositivi[dispositivoSelezionato].lastAccessD
            }}</label>
          </b-col>
          <b-col sm="2">
            <label class="font-weight-bold">Ultimo Contatto</label>
          </b-col>
          <b-col sm="4">
            <label>{{
              elencoDispositivi[dispositivoSelezionato].lastCheckD
            }}</label>
          </b-col>
        </b-row>
        <div
          v-if="
            elencoDispositivi[dispositivoSelezionato].deviceType === type.SHELLY
          "
        >
          <b-row>
            <b-col sm="2">
              <label class="font-weight-bold">ID Dispositivo</label>
            </b-col>
            <b-col sm="4">
              <label>{{
                elencoDispositivi[dispositivoSelezionato].shellyMqttId
              }}</label>
            </b-col>
          </b-row>
        </div>
      </b-card>
      <div
        v-if="
          elencoDispositivi[dispositivoSelezionato].deviceType === type.SHELLY
        "
      >
        <h3>Dati Controlli</h3>
        <b-card>
          <b-form-group
            label-cols-sm="2"
            label="Utilizzo"
            label-class="font-weight-bold"
          >
            <b-form-select
              id="selReleType"
              v-model="elencoDispositivi[dispositivoSelezionato].tipoRele"
              :options="{
                '0': 'Non definito',
                '1': 'Contollo accensione termosifone',
                '2': 'Contollo accensione luce'
              }"
              @change="checkUpdateField"
            ></b-form-select>
          </b-form-group>
          <b-row>
            <b-col sm="2">
              <label class="font-weight-bold">Controlli</label>
            </b-col>
            <b-col sm="2">
              <img
                src="img/light.png"
                class="section5"
                v-b-tooltip.hover
                title="Contollo accensione luce"
                v-bind:class="{
                  grayscale:
                    elencoDispositivi[dispositivoSelezionato].flagReleLight ===
                    0
                }"
              />
            </b-col>
            <b-col sm="2">
              <img
                src="img/water-heater.png"
                class="section5"
                v-b-tooltip.hover
                title="Contollo accensione termosifone"
                v-bind:class="{
                  grayscale:
                    elencoDispositivi[dispositivoSelezionato].flagReleTemp === 0
                }"
              />
            </b-col>
          </b-row>
        </b-card>
      </div>
      <div
        v-if="
          elencoDispositivi[dispositivoSelezionato].deviceType === type.ARDUINO
        "
      >
        <h3>Dati Sensori</h3>
        <b-card>
          <b-row>
            <b-col sm="2">
              <label class="font-weight-bold">Sensori</label>
            </b-col>
            <b-col sm="2">
              <img
                src="img/sun-star.png"
                class="section5"
                v-b-tooltip.hover
                title="Sensore luce"
                v-bind:class="{
                  grayscale:
                    elencoDispositivi[dispositivoSelezionato]
                      .flagLightSensor === 0
                }"
              />
            </b-col>
            <b-col sm="2">
              <img
                src="img/temperature.png"
                class="section5"
                v-b-tooltip.hover
                title="Sensore temperatura"
                v-bind:class="{
                  grayscale:
                    elencoDispositivi[dispositivoSelezionato]
                      .flagTemperatureSensor === 0
                }"
              />
            </b-col>
            <b-col sm="2">
              <img
                src="img/atmospheric-pressure.png"
                class="section5"
                v-b-tooltip.hover
                title="Sensore pressione atmosferica"
                v-bind:class="{
                  grayscale:
                    elencoDispositivi[dispositivoSelezionato]
                      .flagPressureSensor === 0
                }"
              />
            </b-col>
            <b-col sm="2">
              <img
                src="img/partly-cloudy-day.png"
                class="section5"
                v-b-tooltip.hover
                title="Sensore umidità"
                v-bind:class="{
                  grayscale:
                    elencoDispositivi[dispositivoSelezionato]
                      .flagHumiditySensor === 0
                }"
              />
            </b-col>
            <b-col sm="2">
              <img
                src="img/electrical-sensor.png"
                class="section5"
                v-b-tooltip.hover
                title="Sensore prossimità"
                v-bind:class="{
                  grayscale:
                    elencoDispositivi[dispositivoSelezionato]
                      .flagMotionSensor === 0
                }"
              />
            </b-col>
          </b-row>
        </b-card>
      </div>

      <div v-if="elencoDispositivi[dispositivoSelezionato].flagReleTemp">
        <h3>Controllo Termostato</h3>
        <b-card>
          <b-row>
            <b-col sm="6">
              <b-form-group
                label-cols-sm="2"
                label="Modalità"
                label-class="font-weight-bold"
              >
                <b-form-select
                  id="selStatus"
                  v-model="
                    elencoDispositivi[dispositivoSelezionato].statusThermostat
                  "
                  :options="{
                    '0': 'SPENTO',
                    '1': 'ACCESO',
                    '2': 'MANUALE',
                    '3': 'AUTOMATICO'
                  }"
                  @change="checkUpdateField"
                ></b-form-select>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group
                label-cols-sm="2"
                label="Tipo Misurazione"
                label-class="font-weight-bold"
              >
                <b-form-select
                  id="selTempMeasure"
                  v-model="
                    elencoDispositivi[dispositivoSelezionato].temperatureMeasure
                  "
                  :options="{
                    '1': 'LOCALE',
                    '2': 'MEDIA',
                    '3': 'CON PRIORITA\''
                  }"
                  @change="checkUpdateField"
                ></b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
        </b-card>
      </div>
      <b-row class="justify-content-md-center">
        <b-col sm="3"> </b-col>
        <b-col class="text-center">
          <b-button class="px-4" variant="primary" v-on:click="getConfiguration"
            >Ricarica</b-button
          >
        </b-col>
        <b-col class="text-center">
          <b-button
            class="px-4"
            id="btnAggiorna"
            variant="primary"
            :disabled="disableAggiorna"
            v-on:click="updateConfiguration"
            >Aggiorna</b-button
          >
        </b-col>
        <b-col sm="3"> </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import HttpServer from "@/services/httpMonitorRest";
import ModalConfiguration from "@/components/common/ModalConfiguration";
import { TypeDeviceType } from "@/services/config";

export default {
  name: "Setup",
  components: {},
  data: function() {
    return {
      showListDispositivi: false,
      showDispositivo: false,
      elencoDispositivi: [],
      elencoDispositiviOrig: [],
      optionsElencoDispositivi: [],
      optionsElencoSensori: [],
      sensoreSelezionato: null,
      dispositivoSelezionato: null,
      disableAggiorna: true,
      type: TypeDeviceType
    };
  },
  mounted: function() {
    this.getConfiguration();
  },
  computed: {},
  methods: {
    checkUpdateField(value) {
      let changed = false;

      // gestione SHELLY
      if (
        this.elencoDispositivi[this.dispositivoSelezionato].tipoRele !=
        this.elencoDispositiviOrig[this.dispositivoSelezionato].tipoRele
      ) {
        let tipo = this.elencoDispositivi[this.dispositivoSelezionato].tipoRele;
        this.elencoDispositivi[this.dispositivoSelezionato].flagReleTemp =
          tipo === "1" ? 1 : 0;
        this.elencoDispositivi[this.dispositivoSelezionato].flagReleLight =
          tipo === "2" ? 1 : 0;
        changed = true;
      }
      if (!changed) {
        this.elencoDispositivi[
          this.dispositivoSelezionato
        ].primarySensor = this.sensoreSelezionato;
        changed =
          this.elencoDispositivi[this.dispositivoSelezionato].primarySensor !=
          this.elencoDispositiviOrig[this.dispositivoSelezionato].primarySensor;
      }
      if (!changed) {
        changed =
          this.elencoDispositivi[this.dispositivoSelezionato]
            .temperatureMeasure !=
          this.elencoDispositiviOrig[this.dispositivoSelezionato]
            .temperatureMeasure;
      }
      if (!changed)
        changed =
          this.elencoDispositivi[this.dispositivoSelezionato]
            .statusThermostat !=
          this.elencoDispositiviOrig[this.dispositivoSelezionato]
            .statusThermostat;
      if (!changed)
        changed =
          this.elencoDispositivi[this.dispositivoSelezionato].location !=
          this.elencoDispositiviOrig[this.dispositivoSelezionato].location;
      console.log("Changed = " + changed);
      this.disableAggiorna = !changed; // === 1;
    },
    showDettaglioDispositivo(ix) {
      console.log("Selezionato " + ix);
      if (ix !== null) {
        var cfg = this.elencoDispositivi[ix];
        console.log("VisualizzaSelezionato " + cfg.macAddress);
        this.showDispositivo = true;
        this.dispositivoSelezionato = ix;
      } else this.showDispositivo = false;
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
    updateConfiguration() {
      this.$bvModal
        .msgBoxConfirm("Confermi l'aggiornamento ?")
        .then(value => {
          if (value) {
            const httpService = new HttpServer();
            httpService
              .updateConfiguration(
                this.elencoDispositivi[this.dispositivoSelezionato]
              )
              .then(response => {
                let dati = response.data;
                if (dati.error.code === 0) {
                  this.showMsgConfermaEsecuzione(
                    "Aggiornamento effettuato con successo"
                  );
                  this.dispositivoSelezionato = null;
                  this.optionsElencoDispositivi = [];
                  this.getConfiguration();
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
    },
    getConfiguration() {
      const httpService = new HttpServer();
      try {
        httpService
          .getConfiguration()
          .then(response => {
            let dati = response.data;
            if (dati.error.code === 0) {
              this.elencoDispositiviOrig = dati.data;
              let elencoDispositivi = JSON.parse(JSON.stringify(dati.data));
              var data = dati.data;
              let es = [];

              let ed = [];
              ed.push({
                value: null,
                text: "Seleziona un dispositivo"
              });
              es.push({
                value: "",
                text: "Seleziona un sensore"
              });
              let iy = 0;
              for (let ix = 0; ix < data.length; ix++) {
                ed.push({
                  value: ix,
                  text:
                    data[ix].location +
                    (data[ix].deviceType === 1 ? " (SENSORE)" : " (RELE')")
                });
                let deviceName = "NON DEFINITO";
                switch (data[ix].deviceType) {
                  case 1:
                    deviceName = "ARDUINO";
                    es.push({
                      value: data[ix].macAddress,
                      text: data[ix].location
                    });
                    break;
                  case 2:
                    deviceName = "SHELLY";
                    if (elencoDispositivi[ix].flagReleTemp === 1)
                      elencoDispositivi[ix].tipoRele = "1";
                    else if (elencoDispositivi[ix].flagReleLight === 1)
                      elencoDispositivi[ix].tipoRele = "2";
                    else elencoDispositivi[ix].tipoRele = "0";
                    //
                    if (
                      typeof elencoDispositivi[ix].primarySensor ===
                        "undefined" ||
                      elencoDispositivi[ix].primarySensor === ""
                    ) {
                      this.sensoreSelezionato = "";
                      // dato aggiunto
                      elencoDispositivi[ix].primarySensor = "";
                      this.elencoDispositiviOrig[ix].primarySensor = "";
                    } else
                      this.sensoreSelezionato =
                        elencoDispositivi[ix].primarySensor;
                    break;
                }
                // propago in copia
                this.elencoDispositiviOrig[ix].tipoRele =
                  elencoDispositivi[ix].tipoRele;
                elencoDispositivi[ix].deviceTypeName = deviceName;
                elencoDispositivi[ix].lastAccessD = moment(
                  data[ix].lastAccess
                ).format("DD/MM/YYYY HH:mm");
                elencoDispositivi[ix].lastUpdateD = moment(
                  data[ix].lastUpdate
                ).format("DD/MM/YYYY HH:mm");
                elencoDispositivi[ix].lastCheckD = moment(
                  data[ix].lastCheck
                ).format("DD/MM/YYYY HH:mm");
              }
              this.elencoDispositivi = elencoDispositivi;
              this.optionsElencoSensori = es;
              if (data.length === 1) {
                this.showListDispositivi = false;
                this.showDispositivo = true;
                this.showDettaglioDispositivo(0);
              } else {
                this.optionsElencoDispositivi = ed;
                this.showListDispositivi = true;
                this.showDispositivo = false;
                //this.optionsElencoSensori = es;
              }
            } else {
              console.log("Nessun dato da visualizzare");
            }
            this.disableAggiorna = true;
          })
          .catch(error => {
            console.log("Error callig service 'getConfiguration' : " + error);
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
