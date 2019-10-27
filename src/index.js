import UaParser from "ua-parser-js";
import ClipboardJS from "clipboard";

import { library, dom } from "@fortawesome/fontawesome-svg-core";

// Import solid weight icons
import {
  faGlobe as fasGlobe,
  faCodeBranch as fasCodeBranch,
  faDesktop,
  faWindowRestore,
  faArrowsAltH,
  faArrowsAltV,
  faExternalLinkAlt,
  faClipboard
} from "@fortawesome/free-solid-svg-icons";

// // Import regular weight icons
// import {
//     faUser as farUser,
//     faUserCircle as farUserCircle
// } from '@fortawesome/free-regular-svg-icons'

// Import brand icons
import {
  faLinux as fabLinux,
  faWindows as fabWindows,
  faAndroid as fabAndroid,
  faApple as fabApple,
  faOpera as fabOpera, 
  faFirefox as fabFirefox, 
  faInternetExplorer as fabInternetExplorer,
  faSafari as fabSafari,
  faChrome as fabChrome
} from "@fortawesome/free-brands-svg-icons";

// Add icons to library
library.add(
  fasGlobe,
  fasCodeBranch,
  faDesktop,
  faWindowRestore,
  faArrowsAltH,
  faArrowsAltV,
  faExternalLinkAlt,
  faClipboard,
  fabLinux,
  fabWindows,
  fabAndroid,
  fabApple,
  fabOpera,
  fabFirefox,
  fabInternetExplorer,
  fabSafari,
  fabChrome
);

// Replace any existing <i> tags with <svg> and set up a MutationObserver to
// continue doing this as the DOM changes.
dom.watch();

import "./sass/styles.sass";
import LZString from "lz-string";

var UaParse = require("ua-parser-js");

var encode = function(data) {

  var s = `${data.b.n}|${data.b.v}|${data.s.ah}|${data.s.aw}|${data.s.h}|${
    data.s.w
  }|${data.s.o}|${data.o.n}`;
  var json = JSON.stringify(data);

  return LZString.compressToBase64(s);
};

var decode = function(s) {
  var arr = LZString.decompressFromBase64(s).split("|");
  var result = {
    b: {
      n: arr[0],
      v: arr[1]
    },
    s: {
      ah: arr[2],
      aw: arr[3],
      h: arr[4],
      w: arr[5],
      o: arr[6].substring(0, 1)
    },
    o: {
      n: arr[7]
    }
  };
  return result;
  return JSON.parse(LZString.decompressFromBase64(s));
};

export class WhatIs {
  constructor() {
    this._result = new UaParser(navigator.userAgent).getResult();

    var linkInputs = Array.from(document.querySelectorAll(".my-result-link"));
    // linkInputs.setAttribute("text", this.link);

    linkInputs.forEach(linkInput => {
      linkInput.innerText = this.link;
    });

    if (this.resultId != "") {
      this.showAnotherResult();
    } else {
      this.showMyResult();
    }
  }

  showAnotherResult() {
    var result = decode(this.resultId.replace("#", ""));
    this.render_another(result);
  }

  showMyResult() {
    var result = decode(this.browser_encoded);
    this.render_my(result);
  }

  get browser() {
    return {
      n: this._result.browser.name,
      v: this._result.browser.version
    };
  }

  get os() {
    return {
      n: this._result.os.name
    };
  }

  get browser_encoded() {
    var data = {
      b: this.browser,
      s: this.screen,
      o: this.os
    };

    return encode(data);
  }

  get resultId() {
    return window.location.hash.replace("#", "");
  }

  get my_hash() {
    var hash = this.browser_encoded;
    return `${hash}`;
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
      var result = JSON.parse(LZString.decompressFromBase64(s));
    } catch (ex) {
      throw ex;
    }

    return result;
  }

  render_my(result) {
    Array.from(document.querySelectorAll(".my-browser")).forEach(x => {
      x.innerHTML = result.b.n;
    });

    Array.from(document.querySelectorAll(".my-version")).forEach(x => {
      x.innerHTML = result.b.v;
    });

    Array.from(document.querySelectorAll(".my-screen-height")).forEach(x => {
      x.innerHTML = result.s.h;
    });

    Array.from(document.querySelectorAll(".my-screen-width")).forEach(x => {
      x.innerHTML = result.s.w;
    });

    Array.from(document.querySelectorAll(".my-screen-available-height")).forEach(x => {
      x.innerHTML = result.s.ah;
    });

    Array.from(document.querySelectorAll(".my-screen-available-width")).forEach(x => {
      x.innerHTML = result.s.aw;
    });

    Array.from(document.querySelectorAll(".my-screen-orientation")).forEach(x => {
      var orientation = result.s.o;
      document.querySelector(`.orientation-${orientation}`).classList.remove("hidden");
      // x.innerHTML = orientation;
    });

    // var selector = `.os-${result.o.n}`.replace(/\s/g, "");
    Array.from(document.querySelectorAll(`.os-${result.o.n}`.replace(/\s/g, ""))).forEach(el => {
      el.classList.remove("hidden");
    });

    Array.from(document.querySelectorAll(`.browser-${result.b.n}`.replace(/\s/g, ""))).forEach(el => {
      el.classList.remove("hidden");
    });


    Array.from(document.querySelectorAll(".my-result")).forEach(x => {
      x.classList.remove("hidden");
    });
  }

  render_another(result) {

    document.querySelector("body").classList.add("has-background-warning");

    document.querySelector(".another-browser").innerHTML = result.b.n;
    document.querySelector(".another-version").innerHTML = result.b.v;

    document.querySelector(".another-screen-height").innerHTML = result.s.h;
    document.querySelector(".another-screen-width").innerHTML = result.s.w;

    document.querySelector(".another-screen-available-height").innerHTML =
      result.s.ah;
    document.querySelector(".another-screen-available-width").innerHTML =
      result.s.aw;

      document.querySelectorAll(".another-screen-orientation").forEach(x => {
        var orientation = result.s.o;
        var orientationEls = document.querySelectorAll(`.orientation-${orientation}`);
        orientationEls.forEach(e => {
          e.classList.remove("hidden")
        });

        // x.innerHTML = orientation;
      });
    document.querySelector(".another-result").classList.remove("hidden");


    // var selector = `.os-${result.o.n}`.replace(/\s/g, "");
    document.querySelectorAll(`.another-os-${result.o.n}`.replace(/\s/g, "")).forEach(el => {
      el.classList.remove("hidden");
    });

    document.querySelectorAll(`.another-browser-${result.b.n}`.replace(/\s/g, "")).forEach(el => {
      el.classList.remove("hidden");
    });


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
