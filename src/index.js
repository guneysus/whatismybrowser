import UaParser from "ua-parser-js";

var UaParse = require("ua-parser-js");

export class WhatIs {
  constructor() {
    this._result = new UaParser(navigator.userAgent).getResult();

    var linkInput = document.querySelector("#my-result-link");
    linkInput.setAttribute("value", this.link);

    if (this.resultId != "") {
      console.info("Showing another result");
      this.showAnotherResult();
    } else {
      console.info("Showing my result");
      this.showMyResult();
    }
  }

  showAnotherResult() {
    var result = this.decode(this.resultId.replace("#", ""));
    this.render_another(result);
    console.log(result);
  }

  showMyResult() {
    var result = this.decode(this.browser_encoded);
    this.render_my(result);
    console.log(result);
  }

  get browser() {
    return {
      n: this._result.browser.name,
      v:this._result.browser.version
    }
  }

  get browser_encoded() {
    var _  = {
      b:  this.browser,
      s:   this.screen
    };

    return btoa(JSON.stringify(_));
  }

  get resultId() {
    return window.location.hash.replace("#", "");
  }

  get my_hash() {
    return `${this.browser_encoded}`;
  }
  get link() {
    return `${location.origin}${location.pathname}#${this.my_hash}`;
  }

  get screen() {
    return {
      ah: window.screen.availHeight,
      aw: window.screen.availWidth,
      h: window.screen.height,
      w: window.screen.width,
      o: window.screen.orientation.type
    };
  }
  
  decode(s) {
    try {
      var decoded = atob(s);
      var result = JSON.parse(decoded);
    } catch (ex) {
      debugger; // TODO The string to be decoded is not correctly encoded.
      throw ex;
    }

    return result;
  }

  render_my(result) {
    document.querySelector("#my-browser").innerHTML = result.b.n;
    document.querySelector("#my-version").innerHTML = result.b.v;

    document.querySelector("#my-screen-height").innerHTML = result.s.h;
    document.querySelector("#my-screen-width").innerHTML = result.s.w;

    document.querySelector("#my-screen-available-height").innerHTML = result.s.ah;
    document.querySelector("#my-screen-available-width").innerHTML = result.s.aw;
    
    document.querySelector("#my-screen-orientation").innerHTML = result.s.o;

    document.querySelector("#my-result").classList.remove("hidden");
  }

  render_another(result) {
    document.querySelector("#another-browser").innerHTML = result.b.n;
    document.querySelector("#another-version").innerHTML = result.b.v;

    document.querySelector("#another-screen-height").innerHTML = result.s.h;
    document.querySelector("#another-screen-width").innerHTML = result.s.w;

    document.querySelector("#another-screen-available-height").innerHTML = result.s.ah;
    document.querySelector("#another-screen-available-width").innerHTML = result.s.aw;
    
    document.querySelector("#another-screen-orientation").innerHTML = result.s.o;

    document.querySelector("#another-result").classList.remove("hidden");
  }
}

(function() {
  window.$ua = new WhatIs();
})();
