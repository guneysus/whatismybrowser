import UaParser from "ua-parser-js";
import ClipboardJS from "clipboard";

import "./sass/styles.scss";

var UaParse = require("ua-parser-js");

export class WhatIs {
  constructor() {
    this._result = new UaParser(navigator.userAgent).getResult();

    var linkInputs = document.querySelectorAll(".my-result-link");
    // linkInputs.setAttribute("text", this.link);

    linkInputs.forEach(linkInput => {
      linkInput.innerText = this.link;
    })

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
      v: this._result.browser.version
    };
  }

  get browser_encoded() {
    var _ = {
      b: this.browser,
      s: this.screen
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
    document.querySelectorAll(".my-browser").forEach(x => {
      x.innerHTML = result.b.n;
    });
    document.querySelectorAll(".my-version").forEach(x => {
      x.innerHTML = result.b.v;
    });

    document.querySelectorAll(".my-screen-height").forEach(x => {
      x.innerHTML = result.s.h;
    });
    document.querySelectorAll(".my-screen-width").forEach(x => {
      x.innerHTML = result.s.w;
    });

    document.querySelectorAll(".my-screen-available-height").forEach(x => {
      x.innerHTML = result.s.ah;
    });
    document.querySelectorAll(".my-screen-available-width").forEach(x => {
      x.innerHTML = result.s.aw;
    });
    document.querySelectorAll(".my-screen-orientation").forEach(x => {
      var orientation = result.s.o;
      document.querySelector(`.${orientation}`).classList.remove("hidden");
      x.innerHTML = orientation;
    });
    document.querySelectorAll(".my-result").forEach(x => {
      x.classList.remove("hidden");
    });
  }

  render_another(result) {
    document.querySelector(".another-browser").innerHTML = result.b.n;
    document.querySelector(".another-version").innerHTML = result.b.v;

    document.querySelector(".another-screen-height").innerHTML = result.s.h;
    document.querySelector(".another-screen-width").innerHTML = result.s.w;

    document.querySelector(".another-screen-available-height").innerHTML =
      result.s.ah;
    document.querySelector(".another-screen-available-width").innerHTML =
      result.s.aw;

    document.querySelector(".another-screen-orientation").innerHTML =
      result.s.o;

    document.querySelector(".another-result").classList.remove("hidden");
  }
}

window.go = function() {
  var url = document.querySelector(".my-result-link").value;
  window.open(url, "_blank");
};

window.goToMyResults = function() {
  location = "/";
};

(function() {
  window.$ua = new WhatIs();

  new ClipboardJS(".copy-to-clipboard");
})();
