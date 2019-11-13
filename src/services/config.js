import { CustomTooltips } from "@coreui/coreui-plugin-chartjs-custom-tooltips";

const serverUrlP = "/httpMonitor/rest/";
const serverUrlR = "http://srvwas1.bpbari.it:8099/rest/";
const serverUrlD = "http://localhost:8099/rest/";

var configuration = {
  serverUrl: process.env.NODE_ENV === "production" ? serverUrlP : serverUrlD,
  httpPerformace: {
    timeout: 5000,
    depth: 60
  },
  httpStatistics: {
    timeout: 15000,
    hourInterval: 2,
    dayInterval: 15,
    type: "hour"
  },
  rbusStatistics: {
    timeout: 60000,
    parent: true,
    depth: 20,
    onlyKo: false,
    avg: false
  },
  rbusPerformance: {
    transaction: {
      depth: 20,
      interval: 1,
      timeout: 1000
    },
    responseTime: {
      depth: 200,
      interval: 5,
      timeout: 5000
    }
  },
  rbusServer: [
    {
      name: "Errori",
      index: 2,
      color: "#ff0000",
      label: "TRX in ERRORE"
    },
    {
      name: "serverRBUS_01",
      index: 0,
      color: "#24d654",
      label: "RBUS CED 01"
    },
    {
      name: "serverRBUS_02",
      index: 1,
      color: "#90e4a7",
      label: "RBUS CED 02"
    },
    {
      name: "serverRBUS_01B",
      index: 2,
      color: "#d1f3c8",
      label: "RBUS BPB 01"
    }
  ],
  server: [
    {
      name: "HTTPAEM1",
      type: "WEB",
      index: 0,
      color: "#F7347A",
      label: "HTTP AEM 01"
    },
    {
      name: "HTTPAEM2",
      type: "WEB",
      index: 1,
      color: "#F53C55",
      label: "HTTP AEM 02"
    },
    {
      name: "HTTPCED1",
      type: "APP",
      index: 2,
      color: "#4FECAE",
      label: "HTTP CED 01"
    },
    {
      name: "HTTPCED2",
      type: "APP",
      index: 3,
      color: "#5AC18E",
      label: "HTTP CED 02"
    },
    {
      name: "HTTPWAS1",
      type: "APP",
      index: 4,
      color: "#F2F022",
      label: "HTTP WAS 01"
    }
  ]
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
