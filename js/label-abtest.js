function AbTest (slug, variations) {

  this.sendEvent = function(action, label, value) {
    var path = window.location.pathname;
    var interactiveName = path.indexOf('senate') >= 0 ? 'senate-2016' : path.indexOf('articles') >= 0 ? 'forecast-analysis' : 'general-forecast';
    window.ga('send', 'event',
      interactiveName, action, label, value,
      { 'page': '/' + interactiveName, 'title': interactiveName }
    );
  },

  this.load = function() {
    if (!this.runnable || this.loaded) return;
    this.loaded = true;
    this.sendEvent('abtest: ' + this.slug, 'load-' + this.variation);
  }

  this.pass = function() {
    if (!this.runnable || this.passed) return;
    this.passed = true;
    this.sendEvent('abtest: ' + this.slug, 'pass-' + this.variation);
  }

  this.setVariation = function() {
    var variationKey = "abtest-" + this.slug;
    if (!this.runnable) return;

    var pVariation = this.paramVariation();
    if (pVariation) {
      this.variation = parseInt(pVariation);
      return;
    }

    if (localStorage.getItem(variationKey) === null) {
      var variation = 0,
          sum = 0.0,
          rand = Math.random();
      for (var i = 0; i < this.variations.length; i++) {
        sum += this.variations[i];
        if (rand < sum) {
          variation = i;
          break;
        }
      }
      try {
        localStorage.setItem(variationKey, variation);
      } catch(err) {
        this.runnable = false;
      }
    }

    if (this.runnable) {
      this.variation = parseInt(localStorage.getItem(variationKey));
    }
  }

  this.paramVariation = function() {
    var params = window.location.search.substr(1).split('&');
    for (var i = 0; i < params.length; i++) {
      var p = params[i].split('=');
      if (p.length == 2 && p[0] == this.slug)
        return p[1];
    }
    return null;
  }

  this.slug = slug;
  this.variations = typeof(variations) !== 'undefined' ? variations : [0.5, 0.5];
  this.variation = 0;
  this.runnable = typeof(localStorage) !== 'undefined';
  this.loaded = false;
  this.passed = false;

  this.setVariation();
  this.load();
}

var abTest = new AbTest('articles-label', [1/3, 1/3, 1/3]);
var els = document.getElementsByClassName('tab-label-analysis');
for (var i = 0; i < els.length; i++) {
  els[i].textContent = ['Articles', 'Analysis', 'Read More'][abTest.variation];
  els[i].onmousedown = function() {
    abTest.pass();
  };
}
