<template>
  <div class="animated fadeIn">
    <h2>Programmazione Termostato</h2>
    <p>Seleziona il dispositivo da programmare.</p>

    <p>
      Come funziona:<br />
      1) Aggiorna la configurazione corrente<br />
      2) Aggiungi un nuova programmazione
    </p>
    <div v-if="showPage">
      <div>
        <h3>Programmazione Base</h3>
        <b-card>
          <b-form-group
            label-cols-sm="3"
            label="Programmazione"
            label-for="selProg"
            label-class="font-weight-bold"
          >
            <b-form-select
              id="selProg"
              v-model="programmaSelezionato"
              :options="optionsElencoProgrammi"
              @change="showDettaglioDispositivo"
            ></b-form-select>
          </b-form-group>
          <b-row>
            <b-col sm="3">
              <label class="font-weight-bold">Ultimo Aggiornamento</label>
            </b-col>
            <b-col sm="4">
              <label>{{ dettaglioProgramma.lastUpdateD }}</label>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="text-right">
              <b-button variant="primary" v-on:click="addProgramming"
                >Aggiungi</b-button
              >
            </b-col>
          </b-row>
        </b-card>
      </div>
      <div>
        <h3>
          Programma <b>{{ programName }}</b>
        </h3>
        <b-card>
          <b-form-group
            label-cols-sm="3"
            label="Nome"
            label-class="font-weight-bold"
          >
            <b-form-input
              type="text"
              id="location"
              @input.native="checkUpdateField"
              v-model="dettaglioProgramma.name"
              required
              trim
            ></b-form-input>
          </b-form-group>

          <b-row>
            <b-col sm="3">
              <b-row>
                <b-col>
                  <slider
                    v-model="dettaglioProgramma.minTemp"
                    :min="minTemp"
                    :max="maxTemp"
                    :interval="intTemp"
                    @change="checkUpdateField"
                  ></slider>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <label class="font-weight-bold">{{
                    dettaglioProgramma.minTemp
                  }}</label>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <label class="font-weight-bold">Temperatura Minima</label>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="3">
              <b-row>
                <b-col>
                  <slider
                    v-model="dettaglioProgramma.minTempManual"
                    :min="minTemp"
                    :max="maxTemp"
                    :interval="intTemp"
                    @change="checkUpdateField"
                  ></slider>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <label class="font-weight-bold">{{
                    dettaglioProgramma.minTempManual
                  }}</label>
                </b-col>
              </b-row>

              <b-row>
                <b-col>
                  <label class="font-weight-bold"
                    >Temperatura Minima In Manuale</label
                  >
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="text-right">
              <b-button
                variant="primary"
                v-on:click="addProgramming"
                :disabled="disableElimina"
                >Elimina</b-button
              >
            </b-col>
            <b-col class="text-right" sm="1">
              <b-button
                variant="primary"
                v-on:click="addProgramming"
                :disabled="disableAttiva"
                >Attiva</b-button
              >
            </b-col>
          </b-row>

          <b-row>
            //@input="checkUpdateField"
            <b-col sm="4">
              <datetime
                v-model="dateOn"
                type="time"
                :minute-step="10"
                :hour-step="1"
                title="Imposta Ora Accensione"
                :phrases="{ ok: 'Continua', cancel: 'Esci' }"
              />
            </b-col>
            <b-col sm="4">
              <datetime
                v-model="dateOff"
                type="time"
                :minute-step="10"
                :hour-step="1"
                title="Imposta Ora Spegnimento"
                :min-datetime="dateOn"
                :phrases="{ ok: 'Continua', cancel: 'Esci' }"
              />
            </b-col>
          </b-row>
          <div slot="header">
            Tabs
          </div>
          <b-tabs>
            <b-tab title="Lunedi'" active> </b-tab>
            <b-tab title="Martedi'"> </b-tab>
            <b-tab title="Mercoledi'"> </b-tab>
            <b-tab title="Giovedi'"> </b-tab>
            <b-tab title="Venerdi'"> </b-tab>
            <b-tab title="Sabato"> </b-tab>
            <b-tab title="Domenica"> </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import HttpServer from "@/services/httpMonitorRest";
import ModalConfiguration from "@/components/common/ModalConfiguration";
import { TypeDeviceType, TypeProgramming } from "@/services/config";
import { Datetime } from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

export default {
  name: "TemperatureProgramming",
  components: { datetime: Datetime, slider: VueSlider },
  data: function() {
    return {
      programmazioneCompleta: null,
      elencoProgrammi: [],
      dettaglioProgramma: null,
      programmaSelezionato: null,
      optionsElencoProgrammi: [],
      showPage: false,
      programName: "",
      // valori default
      maxTemp: 25,
      minTemp: 10,
      intTemp: 0.5,
      value: 10,
      dateOn: "00:00",
      dateOff: "23:50",
      //
      disableAggiorna: true,
      disableElimina: false,
      disableAttiva: false
    };
  },
  mounted: function() {
    this.getProgramming();
  },
  computed: {},
  methods: {
    checkUpdateField(value) {
      console.log("Changed = " + value);
      this.disableAggiorna = false;
    },
    showDettaglioDispositivo(ix) {
      console.log("Selezionato " + ix);
      if (ix !== null) {
        var cfg = this.elencoDispositivi[ix];
        console.log("VisualiSelezionato " + cfg.macAddress);
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
    addProgramming() {},
    updateProgramming() {
      this.$bvModal
        .msgBoxConfirm("Confermi l'aggiornamento ?")
        .then(value => {
          if (value) {
            const httpService = new HttpServer();
            httpService
              .updateProgramming(this.programmazioneCompleta)
              .then(response => {
                let dati = response.data;
                if (dati.error.code === 0) {
                  this.showMsgConfermaEsecuzione(
                    "Aggiornamento effettuato con successo"
                  );
                  // this.elencoProgrammi =  [];
                  // this.dettaglioProgramma= null;
                  // this.programmaSelezionato= null;
                  this.getProgramming();
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
          console.log("Error callig service 'updateProgramming' : " + error);
          this.showMsgConfermaEsecuzione("Servizio non disponibile : " + error);
        });
    },
    updateProgrammingView(data, index) {
      let ed = [];
      var programming = data.programming;
      this.programmaSelezionato = index; // data.activeProg;
      this.dettaglioProgramma = programming[index];
      this.programName = this.dettaglioProgramma.name;
      this.dettaglioProgramma.lastUpdateD = moment(data.lastUpdate).format(
        "DD/MM/YYYY HH:mm"
      );
      for (let ix = 0; ix < programming.length; ix++) {
        ed.push({
          value: ix,
          text: programming[ix].name
        });
      }
      this.optionsElencoProgrammi = ed;
      this.disableAggiorna = true;
      this.showPage = true;
      this.disableAttiva = index === data.activeProg;
      this.disableElimina = index === data.activeProg;
    },
    getProgramming() {
      const httpService = new HttpServer();
      httpService
        .getProgramming(TypeProgramming.THEMP)
        .then(response => {
          let dati = response.data;
          if (dati.error.code === 0) {
            this.programmazioneCompleta = dati.data;
            this.updateProgrammingView(dati.data, dati.data.activeProg);
          } else {
            console.log("Nessun dato da visualizzare");
            this.showMsgConfermaEsecuzione("Nessun data da visualizzare!");
          }
          //this.disableAggiorna = true;
          //this.showPage = true;
        })
        .catch(error => {
          console.log("Error callig service 'getProgramming' : " + error);
          this.showMsgConfermaEsecuzione("Servizio non disponibile : " + error);
        });
    }
  }
};
</script>
