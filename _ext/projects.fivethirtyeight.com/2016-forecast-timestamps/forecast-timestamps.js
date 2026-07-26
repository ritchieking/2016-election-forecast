// Generated at 2016-11-09 20:15:02 -0500
var ForecastTimestamps = {};
ForecastTimestamps['presidency'] = {"timestamp":1478615931000,"formatted":false};
ForecastTimestamps['senate'] = {"timestamp":1478617403000,"formatted":false};
ForecastTimestamps['analysis'] = {"timestamp":1478737019000,"formatted":false};
ForecastTimestamps.timeago = function() {

  var o = {
    second: 1000,
    minute: 60 * 1000,
    hour: 60 * 1000 * 60,
    day: 24 * 60 * 1000 * 60,
    week: 7 * 24 * 60 * 1000 * 60,
    month: 30 * 24 * 60 * 1000 * 60,
    year: 365 * 24 * 60 * 1000 * 60
  };
  var obj = {};

  obj.ago = function(nd) {
    var r = Math.round,
        pl = function(v, n) {
          var out = n + ' ' + v + (n > 1 ? 's' : '') + ' ago';
          if (out === '60 seconds ago') {
            return '1 minute ago';
          }
          if (out === '60 minutes ago') {
            return '1 hour ago';
          }
          return out;
        },
        ts = new Date().getTime() - new Date(nd).getTime(),
        ii,
        i;
    for (i in o) {
      if (r(ts) < o[i]) return pl(ii || 'm', r(ts / (o[ii] || 1)))
        ii = i;
    }
    return pl(i, r(ts / o[i]));
  }

  return obj;
}

var ts, tstring, fmt, els, numEls, el, pageTs;

var key = 'forecast-timestamps',
    storedTimestamps;
try {
  storedTimestamps = localStorage.getItem(key);
} catch(err) {}

if (storedTimestamps) {
  storedTimestamps = JSON.parse(storedTimestamps);
  for (var k in storedTimestamps) {
    if (storedTimestamps[k].formatted === false && storedTimestamps[k].timestamp > ForecastTimestamps[k].timestamp) {
      ForecastTimestamps[k] = storedTimestamps[k];
    }
  }
}

var toStore = {};


for (var k in ForecastTimestamps) {
  if (typeof ForecastTimestamps[k] !== 'object') {
    continue;
  }
  els = document.querySelectorAll('.timestamp-time-' + k);
  numEls = els.length;
  if (numEls > 0) {
    ts = ForecastTimestamps[k];
    toStore[k] = ts;
    if (ts.formatted) {
      tstring = ts.timestamp;
    } else {
      tstring = ForecastTimestamps.timeago().ago(ts.timestamp).replace(/minutes?/, 'min.').replace(/seconds?/, 'sec.');
    }
    for (var i=0; i<numEls; i++) {
      el = els[i];
      if (el) {
        pageTs = el.getAttribute("data-timestamp");
        if (pageTs && +pageTs > ts.timestamp) {
          tstring = ForecastTimestamps.timeago().ago(+pageTs).replace(/minutes?/, 'min.').replace(/seconds?/, 'sec.');
          toStore[k] = {"timestamp": +pageTs, "formatted": false};
        }
        if (!tstring.match(/^-/)) {
          el.innerHTML = tstring;
          el.parentNode.className = el.parentNode.className.replace(/tab-timestamp-not-updated/, '');
        }
      }
    }
  }
}

try {
  localStorage.setItem(key, JSON.stringify(toStore));
} catch(err) {}
