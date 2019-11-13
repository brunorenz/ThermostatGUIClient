export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function mapGet(map, key) {
  var ret;
  if (map) {
    for (var i = 0, len = map.length; i < len; i++) {
      var entry = map[i];
      if (entry.key === key) {
        ret = entry.value;
        break;
      }
    }
    /*
     * map.forEach(function f(entry) { if (entry.key === key) { ret =
     * entry.value; } });
     */
  }
  return ret;
}

export function mapValues(map) {
  var out = [];
  if (map) for (var i = 0; i < map.length; i++) out.push(map.value);

  return out;
}

export function mapPut(map, key, value) {
  if (map) {
    var found = false;
    for (
      var i = 0, len = map.length;
      i < len;
      i++ // for (var entry in map)
    ) {
      var entry = map[i];
      if (entry.key === key) {
        found = true;
        entry.value = value;
        break;
      }
    }
    /*
     * map.forEach(function f(entry) { if (entry.key === key) { found = true;
     * entry.value = value; } });
     */
    if (!found) {
      var entry = {
        key: key,
        value: value
      };
      map.push(entry);
    }
  }
}
