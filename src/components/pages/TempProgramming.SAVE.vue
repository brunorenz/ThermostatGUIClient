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
              <b-button
                variant="primary"
                v-on:click="addProgramming"
                class="mx-1"
                style="width: 90px;"
                >Aggiungi</b-button
              >
              <b-button
                variant="primary"
                v-on:click="deleteProgramming"
                :disabled="disableElimina"
                class="mx-1"
                style="width: 90px;"
                >Elimina</b-button
              >
              <b-button
                variant="primary"
                v-on:click="attivaProgramming"
                :disabled="disableAttiva"
                class="mx-1"
                style="width: 90px;"
                >Attiva</b-button
              >
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
              <b v-bind:style="defProgStyle">{{ dettaglioProgramma.name }}</b>
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
            <b-col sm="4">
              <b-row>
                <b-col>
                  <label class="font-weight-bold"
                    >Temperatura Minima in Automatico</label
                  >
                </b-col>
              </b-row>
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
                <b-col sm="1">
                  <i class="fa fa-thermometer-1"></i>
                </b-col>
                <b-col sm="1">
                  <label class="font-weight-bold">
                    {{ dettaglioProgramma.minTemp }}
                  </label>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="4">
              <b-row>
                <b-col>
                  <label class="font-weight-bold"
                    >Temperatura Minima In Manuale</label
                  >
                </b-col>
              </b-row>
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
                <b-col sm="1">
                  <i class="fa fa-thermometer-1"></i>
                </b-col>
                <b-col sm="1">
                  <label class="font-weight-bold">
                    {{ dettaglioProgramma.minTempManual }}
                  </label>
                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <div class="my-1">
            <h5>Programmazione Giornaliera</h5>
          </div>

          <b-tabs justified v-model="tabIndex">
            <b-tab title="Lunedi'" active>
              <dayProgramming
                :model="programmazioneGiornaliera[0]"
                :deviceList="listaSensori"
                v-on:updateConfiguration="updateDayProgramming"
              ></dayProgramming>
            </b-tab>
            <b-tab title="Martedi'">
              <dayProgramming
                :model="programmazioneGiornaliera[1]"
                :deviceList="listaSensori"
                v-on:updateConfiguration="updateDayProgramming"
              ></dayProgramming>
            </b-tab>
            <b-tab title="Mercoledi'">
              <dayProgramming
                :model="programmazioneGiornaliera[2]"
                :deviceList="listaSensori"
                v-on:updateConfiguration="updateDayProgramming"
              ></dayProgramming>
            </b-tab>
            <b-tab title="Giovedi'">
              <dayProgramming
                :model="programmazioneGiornaliera[3]"
                :deviceList="listaSensori"
                v-on:updateConfiguration="updateDayProgramming"
              ></dayProgramming>
            </b-tab>
            <b-tab title="Venerdi'">
              <dayProgramming
                :model="programmazioneGiornaliera[4]"
                :deviceList="listaSensori"
                v-on:updateConfiguration="updateDayProgramming"
              ></dayProgramming>
            </b-tab>
            <b-tab title="Sabato">
              <dayProgramming
                v-bind:model="programmazioneGiornaliera[5]"
                :deviceList="listaSensori"
                v-on:updateConfiguration="updateDayProgramming"
              ></dayProgramming>
            </b-tab>
            <b-tab title="Domenica">
              <dayProgramming
                :model="programmazioneGiornaliera[6]"
                :deviceList="listaSensori"
                v-on:updateConfiguration="updateDayProgramming"
              ></dayProgramming>
            </b-tab>
          </b-tabs>
          <b-row>
            <b-col class="text-right my-1">
              <b-button
                variant="primary"
                v-on:click="copyProgramming"
                class="mx-1"
                style="width: 90px;"
                >Copia</b-button
              >
              <b-button
                variant="primary"
                class="mx-1"
                style="width: 90px;"
                v-on:click="getProgramming"
                :disabled="disableAggiorna"
                >Ricarica</b-button
              >
              <b-button
                variant="primary"
                class="mx-1"
                style="width: 90px;"
                v-on:click="updateProgramming"
                :disabled="disableAggiorna"
                >Salva</b-button
              >
            </b-col>
          </b-row>
        </b-card>
      </div>
    </div>
    <b-modal
      v-model="showCopyModal"
      id="modalConfiguration"
      :title="copyModel.title"
      @ok="updateAfterCopy"
      :ok-disabled="copyModel.disable"
    >
      <div v-for="field in copyModel.fields" :key="field.id">
        <b-form-group
          label-cols-lg="8"
          :label="field.label"
          v-if="field.id != tabIndex"
        >
          <div>
            <b-form-checkbox
              :id="'ID' + field.id"
              v-model="field.value"
              :placeholder="field.label"
              @input="changeAfterCopy"
            ></b-form-checkbox>
          </div>
        </b-form-group>
      </div>
    </b-modal>
  </div>
</template>
<script>
import moment from "moment";
import HttpServer from "@/services/httpMonitorRest";
import { TypeAction, TypeDeviceType, TypeProgramming } from "@/services/config";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import DayProgramming from "@/components/common/DayProgramming";
export default {
  name: "TemperatureProgramming",
  components: {
    slider: VueSlider,
    dayProgramming: DayProgramming
  },
  data: function() {
    return {
      copyModel: {
        title:
          "Seleziona i giorni un cui copiare la programmazione selezionata",
        fields: []
      },
      showCopyModal: false,
      listaSensori: [],
      programmazioneCompleta: null,
      programmazioneGiornaliera: [],
      dettaglioProgramma: null,
      programmaSelezionato: 0,
      optionsElencoProgrammi: [],
      showPage: false,
      tabIndex: 0,
      defProgStyle: "",
      // valori default
      maxTemp: 25,
      minTemp: 10,
      intTemp: 0.5,
      disableAggiorna: true,
      disableElimina: false,
      disableAttiva: false
    };
  },
  beforeMount: function() {
    this.recuperaElencoSensori();
    this.getProgramming();
    this.copyModel.fields.push({
      label: "Lunedì",
      id: 0
    });
    this.copyModel.fields.push({
      id: 1,
      label: "Martedì"
    });
    this.copyModel.fields.push({
      id: 2,
      label: "Mercoledì"
    });
    this.copyModel.fields.push({
      id: 3,
      label: "Giovedì"
    });
    this.copyModel.fields.push({
      id: 4,
      label: "Venerdì"
    });
    this.copyModel.fields.push({
      id: 5,
      label: "Sabato"
    });
    this.copyModel.fields.push({
      id: 6,
      label: "Domenica"
    });
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
    /**
     * Aggiornamento programmazione giornaliera
     */
    updateDayProgramming(model) {
      console.log(
        "updateDayProgramming : Indice Programma selezionato " +
          this.programmaSelezionato
      );
      let record = {
        idDay: model.idDay,
        prog: []
      };
      for (let ix = 0; ix < model.prog.length; ix++) {
        let rec = model.prog[ix];
        record.prog.push({
          minTemp: rec.minTemp,
          timeStart: rec.timeStart,
          timeEnd: rec.timeEnd,
          priorityDisp: rec.priorityDisp
        });
      }
      // console.log(
      //   "Update  Day programming BEFORE :" +
      //     JSON.stringify(
      //       this.programmazioneCompleta.programming[this.programmaSelezionato]
      //         .dayProgramming[model.idDay]
      //     )
      // );
      this.reorganizeDayProgrammingModel(record);
      this.programmazioneCompleta.programming[
        this.programmaSelezionato
      ].dayProgramming[model.idDay] = record;
      // console.log(
      //   "Update  Day programming AFTER : " +
      //     JSON.stringify(
      //       this.programmazioneCompleta.programming[this.programmaSelezionato]
      //         .dayProgramming[model.idDay]
      //     )
      // );
      this.disableAggiorna = false;
    },
    copyProgramming() {
      console.log("Copy programming");
      for (let i = 0; i < this.copyModel.fields.length; i++) {
        this.copyModel.fields[i].value = false;
      }
      this.copyModel.disable = false;
      this.showCopyModal = true;
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
    changeAfterCopy() {
      let dis = true;
      for (let i = 0; i < this.copyModel.fields.length; i++)
        if (this.copyModel.fields[i].value) {
          dis = false;
          break;
        }
      this.copyModel.disable = dis;
    },
    updateAfterCopy() {
      let current = this.programmazioneGiornaliera[this.tabIndex];
      for (let i = 0; i < this.copyModel.fields.length; i++)
        if (this.copyModel.fields[i].value) {
          console.log("Copio Giorno " + i);
          this.programmazioneGiornaliera[i].prog = current.prog;
          this.updateDayProgramming(this.programmazioneGiornaliera[i]);
        }
    },
    /**
     * Update view after any programming change
     */
    updateProgrammingView(data, idProg) {
      console.log("Update Programming View !");
      let ed = [];
      let programming = data.programming;
      let index = this.getIndexProgram(data, idProg);
      let indexDefault = this.getIndexProgram(data);
      this.programmaSelezionato = index;
      this.dettaglioProgramma = programming[index];
      this.dettaglioProgramma.lastUpdateD = moment(data.lastUpdate).format(
        "DD/MM/YYYY HH:mm"
      );
      for (let ix = 0; ix < programming.length; ix++) {
        let opt = { value: ix };
        if (ix === indexDefault) opt.text = programming[ix].name + " (ATTIVO)";
        else opt.text = programming[ix].name;
        ed.push(opt);
      }
      let programmaAttivo = index === indexDefault;
      this.optionsElencoProgrammi = ed;
      this.disableAggiorna = true;
      this.showPage = true;
      this.disableAttiva = programmaAttivo;
      this.disableElimina = programmaAttivo;
      this.tabIndex = 0;
      this.defProgStyle = programmaAttivo ? "color: green;" : "";
      console.log(
        "updateProgrammingView - Indice Programma selezionato " +
          this.programmaSelezionato
      );
      // praparo dati per DayProgramming

      let dp = JSON.parse(JSON.stringify(programming[index].dayProgramming));
      for (let iy = 0; iy < dp.length; iy++) {
        this.reorganizeDayProgrammingModel(dp[iy]);
        // for (let ix = 0; ix < dp[iy].prog.length; ix++) {
        //   let rec = dp[iy].prog[ix];
        //   rec.oraOn = this.getDataFromNum(rec.timeStart);
        //   rec.oraOff = this.getDataFromNum(rec.timeEnd);
        //   rec.idOraOn = "on_" + iy + "_" + ix;
        //   rec.idOraOff = "off_" + iy + "_" + ix;
        //   rec.ix = ix;
        //   //console.log("Record : " + JSON.stringify(rec));
        // }
      }
      this.programmazioneGiornaliera = dp;
    },
    reorganizeDayProgrammingModel(model) {
      for (let ix = 0; ix < model.prog.length; ix++) {
        let rec = model.prog[ix];
        rec.oraOn = this.getDataFromNum(rec.timeStart);
        rec.oraOff = this.getDataFromNum(rec.timeEnd);
        rec.idOraOn = "on_" + model.idDay + "_" + ix;
        rec.idOraOff = "off_" + model.idDay + "_" + ix;
        rec.ix = ix;
        //console.log("Record : " + JSON.stringify(rec));
      }
    },
    getDataFromNum(num) {
      let h = "00" + ((num / 60) >> 0);
      let m = "00" + (num - h * 60);
      let now = new Date();
      now.setHours(h);
      now.setMinutes(m);
      now.setSeconds(0);
      now.setMilliseconds(0);
      now.getHours;
      return moment(now).format();
      //return h.substring(h.length - 2) + ":" + m.substring(m.length - 2);
    },
    recuperaElencoSensori() {
      const httpService = new HttpServer();
      httpService
        .getConfiguration()
        .then(response => {
          let dati = response.data;
          let es = [];
          es.push({
            value: "",
            text: "Nessuna"
          });
          if (dati.error.code === 0) {
            let data = dati.data;

            for (let ix = 0; ix < data.length; ix++) {
              if (data[ix].deviceType === 1) {
                es.push({
                  value: data[ix].macAddress,
                  text: data[ix].location
                });
              }
            }
          } else {
            console.log("Nessun dato da visualizzare");
            this.showMsgConfermaEsecuzione("Nessun Sensore definito!");
          }
          this.listaSensori = es;
        })
        .catch(error => {
          console.log("Error callig service 'getConfiguration' : " + error);
          this.showMsgConfermaEsecuzione("Servizio non disponibile : " + error);
        });
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
