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
    return this._result.browser;
  }

  get browser_encoded() {
    let b = this.browser;
    var _ = `${b.name};${b.version}`;
    return btoa(_);
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

  decode(s) {
    try {
      var decoded = atob(s);
    } catch (ex) {
      debugger; // TODO The string to be decoded is not correctly encoded.
      throw ex;
    }

    var parsedResult = decoded.split(";");
    var result = { browser: parsedResult[0], version: parsedResult[1] };
    return result;
  }

  render_my(result) {
    document.querySelector("#my-browser").innerHTML = result.browser;
    document.querySelector("#my-version").innerHTML = result.version;
    document.querySelector("#my-result").classList.remove("hidden");
  }

  render_another(result) {
    document.querySelector("#another-browser").innerHTML = result.browser;
    document.querySelector("#another-version").innerHTML = result.version;
    document.querySelector("#another-result").classList.remove("hidden");
  }
}

(function() {
  window.$ua = new WhatIs();
})();
