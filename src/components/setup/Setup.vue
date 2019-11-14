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
          label="Luogo di misurazione"
          label-class="font-weight-bold"
        >
          <b-form-input
            type="text"
            id="location"
            @change.native="checkUpdateField"
            v-model="elencoDispositivi[dispositivoSelezionato].location"
            required
            trim
          ></b-form-input>
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
              elencoDispositivi[dispositivoSelezionato].lastUpdateD
            }}</label>
          </b-col>
        </b-row>
      </b-card>
      <h3>Dati Sensori</h3>
      <b-card>
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
                  elencoDispositivi[dispositivoSelezionato].flagReleLight === 0
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
                  elencoDispositivi[dispositivoSelezionato].flagLightSensor ===
                  0
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
                grayscale: false
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
                grayscale: false
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
                grayscale: false
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
                  elencoDispositivi[dispositivoSelezionato].flagMotionSensor ===
                  0
              }"
            />
          </b-col>
        </b-row>
      </b-card>
      <div v-if="elencoDispositivi[dispositivoSelezionato].flagReleTemp">
        <h3>Controllo Thermostato</h3>
        <b-card>
          <b-row>
            <b-col sm="6">
              <b-form-group
                label-cols-sm="2"
                label="Modalità"
                label-class="font-weight-bold"
              >
                <b-form-select
                  id="selDisp"
                  v-model="elencoDispositivi[dispositivoSelezionato].status"
                  :options="{ '1': 'One', '2': 'Two', '3': 'Three' }"
                  @change="showDettaglioDispositivo"
                ></b-form-select>
              </b-form-group>
            </b-col>
            <b-col sm="6">
              <b-form-group
                label-cols-sm="2"
                label="Tipo Misurazione"
                label-class="font-weight-bold"
              >
                <b-form-input
                  type="text"
                  id="location"
                  @change.native="checkUpdateField"
                  v-model="elencoDispositivi[dispositivoSelezionato].location"
                  required
                  trim
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
        </b-card>
      </div>

      <div>
        <button></button>
        <button></button>
      </div>
    </div>
  </div>
</template>
// https://icons8.com/icons/set/thermostat
<script>
import moment from "moment";
import HttpServer from "@/services/httpMonitorRest";
import ModalConfiguration from "@/components/common/ModalConfiguration";

export default {
  name: "Setup",
  components: {},
  data: function() {
    return {
      field: {
        id: "1",
        value: true,
        label: "label"
      },

      showListDispositivi: false,
      showDispositivo: false,
      elencoDispositivi: [],
      optionsElencoDispositivi: [],
      dispositivoSelezionato: null
    };
  },
  mounted: function() {
    this.getConfiguration();
  },
  computed: {},
  methods: {
    checkUpdateField(element, id) {
      console.log(element);
    },
    showDettaglioDispositivo(ix) {
      console.log("Selezionato " + ix);
      if (ix !== null) {
        var cfg = this.elencoDispositivi[ix];
        console.log("VisualiSelezionato " + cfg.macAddress);
        this.showDispositivo = true;
      } else this.showDispositivo = false;
    },
    getConfiguration() {
      const httpService = new HttpServer();
      httpService
        .getConfiguration()
        .then(response => {
          let dati = response.data;
          if (dati.error.code === 0) {
            this.elencoDispositiviOrig = dati.data;
            this.elencoDispositivi = JSON.parse(JSON.stringify(dati.data));
            var data = dati.data;
            let ed = [];
            ed.push({
              value: null,
              text: "Seleziona un dispositivo"
            });
            for (let ix = 0; ix < data.length; ix++) {
              ed.push({
                value: ix,
                text: data[ix].macAddress + " -" + data[ix].location
              });
              this.elencoDispositivi[ix].lastAccessD = moment(
                data[ix].lastAccess
              ).format("DD/MM/YYYY HH:mm");
              this.elencoDispositivi[ix].lastUpdateS = moment(
                data[ix].lastUpdate
              ).format("DD/MM/YYYY HH:mm");
            }
            if (data.length === 1) {
              this.showListDispositivi = false;
              showDettaglioDispositivo(0);
            } else {
              this.optionsElencoDispositivi = ed;
              this.showListDispositivi = true;
            }
          } else {
            console.log("Nessun dato da visualizzare");
          }
        })
        .catch(error => {
          console.log("Error callig service 'getConfiguration' : " + error);
        });
    }
  }
};
</script>
