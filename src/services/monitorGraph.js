export function getGraphStructureIndex(initialDate, currentDate, interval) {
  return (
    (currentDate.getTime() - initialDate.getTime()) / (interval * 1000 * 60)
  );
}

/**
 * Create a structure for a Graphic
 * @param {*} config
 * @param {*} intervalMinutes
 */
export function createGraphStructure(config, intervalMinutes) {
  var out = [];
  // Create scructure
  for (var i = 0; i < config.servers.length; i++) {
    var rec = {
      server: config.servers[i],
      dati: []
    };
    out.push(rec);
  }
  let interval = config.interval * 1000;
  if (intervalMinutes) interval = interval * 60;
  // create empty record
  var n =
    (config.finalDate.getTime() - config.initialDate.getTime()) / interval;
  var dt = config.initialDate.getTime();
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < out.length; j++) {
      var rec = {
        time: new Date(dt),
        value: 0
      };
      out[j].dati.push(rec);
    }
    dt += interval;
  }
  //console.log(JSON.stringify(out));
  return out;
}

/**
 * Create a structure for a singol Graphic
 * @param {*} config
 * @param {*} intervalMinutes
 */
export function createSingleGraphStructure(config, intervalMinutes) {

  // Create scructure
  var outRec = {
    dati: [] ,
    label : []
  };
  let interval = config.interval * 1000;
  if (intervalMinutes) interval = interval * 60;
  // create empty record
  var n =
    (config.finalDate.getTime() - config.initialDate.getTime()) / interval;
  var dt = config.initialDate.getTime();
  for (var i = 0; i < n; i++) {
    // var rec = {
    //   time: new Date(dt),
    //   value: 0
    // };
    outRec.dati.push(0);
    outRec.label.push(dt);
    dt += interval;
  }
  return outRec;
}
