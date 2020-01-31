<template>
  <div class="animated fadeIn">
    <h2>Programmazione Termostato</h2>
    <p>Seleziona il dispositivo da programmare.</p>

    <p>
      Come funziona:
      <br />1) Aggiorna la configurazione corrente <br />2) Aggiungi un nuova
      programmazione
    </p>
    <div v-if="showPage">
      <div>
        <b-card>
          <div slot="header">
            <h5>Programmazione Base</h5>
          </div>
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
              @change="showDettaglioProgrammazione"
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
              <b-button-group>
                <b-button
                  variant="primary"
                  v-on:click="addProgramming"
                  class="mr-2"
                  style="width: 90px;"
                  >Aggiungi</b-button
                >
                <b-button
                  variant="primary"
                  v-on:click="deleteProgramming"
                  :disabled="disableElimina"
                  class="mr-2"
                  style="width: 90px;"
                  >Elimina</b-button
                >
                <b-button
                  variant="primary"
                  v-on:click="attivaProgramming"
                  :disabled="disableAttiva"
                  class="mr-2"
                  style="width: 90px;"
                  >Attiva</b-button
                >
              </b-button-group>
            </b-col>
          </b-row>
        </b-card>
      </div>
      <div>
        <h3></h3>
        <b-card>
          <div slot="header">
            <h5>
              Programma
              <b v-bind:style="defProgStyle">{{ programName }}</b>
            </h5>
          </div>

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
                  <label class="font-weight-bold">
                    {{ dettaglioProgramma.minTemp }}
                  </label>
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
                  <label class="font-weight-bold">
                    {{ dettaglioProgramma.minTempManual }}
                  </label>
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

          <div>
            <h5>Programmazione Giornaliera</h5>
          </div>

          <b-tabs justified v-model="tabIndex">
            <b-tab title="Lunedi'" active>
              <dayProgramming
                :model="programmaGiornaliero[0]"
                v-on:updateConfiguration="updateDayProgramming"
                :key="programmaSelezionato"
              ></dayProgramming>
            </b-tab>
            <b-tab title="Martedi'">
              <dayProgramming
                :model="programmaGiornaliero[1]"
                v-on:updateConfiguration="updateDayProgramming"
                :key="programmaSelezionato"
              ></dayProgramming>
            </b-tab>
            <b-tab title="Mercoledi'">
              <dayProgramming
                :model="programmaGiornaliero[2]"
                v-on:updateConfiguration="updateDayProgramming"
                :key="programmaSelezionato"
              ></dayProgramming>
            </b-tab>
            <b-tab title="Giovedi'">
              <dayProgramming
                :model="programmaGiornaliero[3]"
                v-on:updateConfiguration="updateDayProgramming"
                :key="programmaSelezionato"
              ></dayProgramming>
            </b-tab>
            <b-tab title="Venerdi'">
              <dayProgramming
                :model="programmaGiornaliero[4]"
                v-on:updateConfiguration="updateDayProgramming"
                :key="programmaSelezionato"
              ></dayProgramming>
            </b-tab>
            <b-tab title="Sabato">
              <dayProgramming
                :model="programmaGiornaliero[5]"
                v-on:updateConfiguration="updateDayProgramming"
                :key="programmaSelezionato"
              ></dayProgramming>
            </b-tab>
            <b-tab title="Domenica">
              <dayProgramming
                :model="programmaGiornaliero[6]"
                v-on:updateConfiguration="updateDayProgramming"
                :key="programmaSelezionato"
              ></dayProgramming>
            </b-tab>
          </b-tabs>
          <b-row>
            <b-col class="text-right">
              <b-button-group>
                <b-button
                  variant="primary"
                  v-on:click="copyProgramming"
                  class="mr-2"
                  style="width: 90px;"
                  >Copia</b-button
                >
                <b-button
                  variant="primary"
                  class="mr-2"
                  style="width: 90px;"
                  v-on:click="getProgramming"
                  :disabled="disableAggiorna"
                  >Ricarica</b-button
                >
                <b-button
                  variant="primary"
                  class="mr-2"
                  style="width: 90px;"
                  v-on:click="updateProgramming"
                  :disabled="disableAggiorna"
                  >Salva</b-button
                >
              </b-button-group>
            </b-col>
          </b-row>
        </b-card>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import HttpServer from "@/services/httpMonitorRest";
import ModalConfiguration from "@/components/common/ModalConfiguration";
import { TypeAction, TypeDeviceType, TypeProgramming } from "@/services/config";
import { Datetime } from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import DayProgramming from "@/components/common/DayProgramming";
export default {
  name: "TemperatureProgramming",
  components: {
    datetime: Datetime,
    slider: VueSlider,
    dayProgramming: DayProgramming
  },
  data: function() {
    return {
      programmazioneCompleta: null,
      elencoProgrammi: [],
      dettaglioProgramma: null,
      programmaSelezionato: null,
      optionsElencoProgrammi: [],
      showPage: false,
      programName: "",
      tabIndex: 0,
      defProgStyle: "",
      // valori default
      maxTemp: 25,
      minTemp: 10,
      intTemp: 0.5,
      //value: 10,
      //dateOn: "00:00",
      //dateOff: "23:50",
      programmaGiornaliero: {},
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
    showDettaglioProgrammazione(ix) {
      console.log("Selezionato " + ix);
      let idProg = this.programmazioneCompleta.programming[ix].idProg;
      this.updateProgrammingView(this.programmazioneCompleta, idProg);
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
    /**
     * Add programming record
     */
    addProgramming() {
      this.manageProgramming(TypeAction.ADD);
    },
    /**
     *
     */
    attivaProgramming() {
      this.programmazioneCompleta.activeProg = this.getProgramIndex(
        this.programmazioneCompleta,
        this.programmaSelezionato
      );
      this.manageProgramming(TypeAction.UPDATE);
    },
    updateProgramming() {
      this.manageProgramming(TypeAction.UPDATE);
    },
    updateDayProgramming() {
      console.log("Update Day programming");
    },
    copyProgramming() {
      console.log("Copy programming");
    },
    deleteProgramming() {
      console.log(
        "Delete programming with id " + this.dettaglioProgramma.idProg
      );
      this.manageProgramming(TypeAction.DELETE);
    },
    manageProgramming(action) {
      const httpService = new HttpServer();
      let msg;
      let inputData = { type: TypeProgramming.THEMP, action: action };
      switch (action) {
        case TypeAction.ADD:
          msg = "l'inserimento di un nuovo programma";
          break;
        case TypeAction.UPDATE:
          msg = "l'aggiornamento del programma selezionato";
          inputData.programm = this.programmazioneCompleta;
          break;
        case TypeAction.DELETE:
          msg = "la cancellazione del programma selezionato";
          inputData.id = this.dettaglioProgramma.idProg;
          break;
      }
      this.$bvModal
        .msgBoxConfirm("Confermi " + msg + " ?")
        .then(value => {
          if (value) {
            const httpService = new HttpServer();
            httpService
              .manageProgramming(inputData)
              .then(response => {
                let dati = response.data;
                if (dati.error.code === 0) {
                  this.showMsgConfermaEsecuzione(
                    "Operazione effettuata con successo!"
                  );
                  // rileggo dati
                  this.getProgramming();
                } else {
                  this.showMsgConfermaEsecuzione(
                    "Operazione terminata in errore  : " + dati.error.message
                  );
                }
              })
              .catch(error => {
                this.showMsgConfermaEsecuzione(
                  "Operazione terminata in errore  : " + error
                );
              });
          }
        })
        .catch(error => {
          console.log("Error generico : " + error);
          this.showMsgConfermaEsecuzione("Servizio non disponibile : " + error);
        });
    },
    /**
     * Update programming record

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
        .catch(error => {
          console.log("Error callig service 'updateProgramming' : " + error);
          this.showMsgConfermaEsecuzione("Servizio non disponibile : " + error);
        });
    },
     */
    getProgramIndex(progRecord, index) {
      return progRecord.programming[index].idProg;
    },
    getIndexProgram(progRecord, idProg) {
      if (typeof idProg === "undefined") idProg = progRecord.activeProg;
      let programming = progRecord.programming;
      let index = 0;
      for (let ix = 0; ix < programming.length; ix++) {
        if (programming[ix].idProg === idProg) {
          index = ix;
          break;
        }
      }
      return index;
    },
    /**
     * Update view after any programming change
     */
    updateProgrammingView(data, idProg) {
      let ed = [];
      let programming = data.programming;
      // let index = 0;
      // for (let ix = 0; ix < programming.length; ix++) {
      //   if (programming[ix].idProg === idProg) {
      //     index = ix;
      //     break;
      //   }
      // }
      let index = this.getIndexProgram(data, idProg);
      let indexDefault = this.getIndexProgram(data);
      this.programmaSelezionato = index;
      this.dettaglioProgramma = programming[index];
      this.programName = this.dettaglioProgramma.name;
      this.dettaglioProgramma.lastUpdateD = moment(data.lastUpdate).format(
        "DD/MM/YYYY HH:mm"
      );
      for (let ix = 0; ix < programming.length; ix++) {
        let opt = { value: ix };
        if (ix === indexDefault) opt.text = programming[ix].name + " (ATTIVO)";
        else opt.text = programming[ix].name;
        ed.push(opt);
      }
      this.programmaGiornaliero = {
        changed: false,
        data: programming[index].dayProgramming
      };
      let programmaAttivo = index === indexDefault;
      this.programmaGiornaliero = programming[index].dayProgramming;
      this.optionsElencoProgrammi = ed;
      this.disableAggiorna = true;
      this.showPage = true;
      this.disableAttiva = programmaAttivo;
      this.disableElimina = programmaAttivo;
      this.tabIndex = 0;
      this.defProgStyle = programmaAttivo ? "color: green;" : "";
    },
    /**
     * Leggi record programmazione
     */
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
        })
        .catch(error => {
          console.log("Error callig service 'getProgramming' : " + error);
          this.showMsgConfermaEsecuzione("Servizio non disponibile : " + error);
        });
    }
  }
};
</script>
