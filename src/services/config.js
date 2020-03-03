import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";

const local = false;
const serverUrlP = "/therm/rest/";
const serverUrlR = "http://srvwas1.bpbari.it:8099/rest/";
const serverUrlD = local
  ? "http://localhost:8101/therm/rest/"
  : "http://192.168.0.120:8101/therm/rest/";

let configuration = {
  serverUrl: process.env.NODE_ENV === "production" ? serverUrlP : serverUrlD,
  releStatistics: {
    timeout: 30000,
    hourInterval: 5,
    dayInterval: 15,
    type: "day"
  },
  sensorStatistics: {
    timeout: 30000,
    hourInterval: 5,
    dayInterval: 15,
    type: "day",
    full: false
  },
  releStatus: {
    timeout: 30000
  },
  sensorStatus: {
    timeout: 30000
  }
};

export function getConfiguration() {
  return JSON.parse(JSON.stringify(configuration));
}

export function getInitialRBUSGraphConfiguration() {
  var dati = [];
  for (var i = 0; i < configuration.rbusServer.length; i++) {
    var entry = {
      name: configuration.rbusServer[i].name,
      label: configuration.rbusServer[i].label,
      tot: 0,
      ok: 0,
      ko: 0
      //perServer: 0
    };
    dati.push(entry);
  }
  return dati;
}

export function getInitialHTTPGraphConfiguration() {
  var dati = [];
  for (var i = 0; i < configuration.server.length; i++) {
    var entry = {
      name: configuration.server[i].name,
      type: configuration.server[i].type,
      label: configuration.server[i].label,
      tot: 0,
      ok: 0,
      ko: 0
      //perServer: 0
    };
    dati.push(entry);
  }
  return dati;
}

export function getDefaultLineOptions() {
  var options = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: "index",
      position: "nearest",
      callbacks: {
        labelColor: function(tooltipItem, chart) {
          return {
            backgroundColor:
              chart.data.datasets[tooltipItem.datasetIndex].borderColor
          };
        }
      }
    },
    title: {
      display: false,
      text: "Custom Chart Title"
    },
    maintainAspectRatio: false,
    legend: {
      display: true
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            drawOnChartArea: true
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5
            //stepSize: Math.ceil(maxG / 10)
            //max: maxG
          },
          gridLines: {
            display: true
          }
        }
      ]
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3
      }
    }
  };
  return options;
}
//https://code.tutsplus.com/it/tutorials/getting-started-with-chartjs-line-and-bar-charts--cms-28384
export function getDefaultBarOptions() {
  var options = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: "index",
      position: "nearest",
      callbacks: {
        labelColor: function(tooltipItem, chart) {
          return {
            backgroundColor:
              chart.data.datasets[tooltipItem.datasetIndex].borderColor
          };
        }
      }
    },
    title: {
      display: false,
      text: "Custom Chart Title"
    },
    maintainAspectRatio: false,
    legend: {
      display: true
    },
    scales: {
      xAxes: [{ stacked: true, barPercentage: 0.9, categoryPercentage: 1 }],
      yAxes: [{ stacked: true, id: "y-axis-ok" }]
      //yAxes: [{ stacked: true ,id: "y-axis-ok" },{ stacked: true ,id: "y-axis-ko" }]
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3
      }
    },
    animation: {
      duration: 0,
      easing: "linear"
    }
  };
  return options;
}

export function checkSecurity(router) {
  if (SecurityConfiguration.jwtRequired) {
    let token = window.sessionStorage.getItem("jwttoken");
    if (token === null) {
      //let a = router;
      router.push("/login");
    }
  }
}
// Definizioni da Server

export var TypeStatus = { OFF: 0, ON: 1, MANUAL: 2, AUTO: 3 };
export var TypeMeasure = { LOCAL: 1, MEDIUM: 2, PRIORITY: 2 };
export var TypeProgramming = { THEMP: 1, LIGTH: 2 };
export var TypeDeviceType = { ANY: 0, ARDUINO: 1, SHELLY: 2 };
export var TypeAction = { ADD: 0, UPDATE: 1, DELETE: 2, READ: 3 };

// Sicurezza
export var SecurityConfiguration = {
  basicAuth: "Basic YWRtaW46YWgwNjB2eUEu",
  basicAuthRequired: true,
  jwtRequired: true
};
