<template>
  <div class="animated fadeIn">
    <h2>Gestione Dispositivi</h2>
    <p>Seleziona il dispositivo da configurare.</p>

    <p>
      E' possibile:
      <br />1) Aggiornare il nome del dispositivo
      <br />2) Impostare modalità di funzionamento del dispositivo
      <br />3)
      Impostare modalità di relevazione temperatura
    </p>

    <b-form-group
      id="fieldset-horizontal"
      label-cols-sm="4"
      label-cols-lg="3"
      description="Let us know your name."
      label="Enter your name"
      label-for="input-horizontal"
    >
      <b-form-input id="input-horizontal"></b-form-input>
    </b-form-group>
    <b-form-group label-cols-lg="12" :label-for="field.id" :label="field.label">
      <b-form-checkbox :id="field.id" v-model="field.value" :placeholder="field.label"></b-form-checkbox>

      <b-row>
        <b-col sm="6"></b-col>
        <b-col sm="6">
          <b-card></b-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="12">
          <b-card></b-card>
        </b-col>
      </b-row>
    </b-form-group>
  </div>
</template>




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
      }
    };
  },
  mounted: function() {
    this.getConfiguration();
  },
  computed: {},
  methods: {
    getConfiguration() {
      const httpService = new HttpServer();
      httpService.getConfiguration().then(response =>{
        var data = response.data;
      })
      .catch(error => {
          console.log(
            "Error callig service 'getConfiguration' : " +
              error
          );
        });
    }
  }
};
</script>