// device.js - Version: 1.1.1
/*
 * Copyright (c) 2010-2015 by Andreas Wagner. ALL RIGHTS RESERVED.
 * This document contains CONFIDENTIAL, PROPRIETARY, PATENTABLE 
 * and/or TRADE SECRET information belonging to Andreas Wagner and may
 * not be reproduced or adapted, in whole or in part, without prior
 * written permission from Andreas Wagner.
 * 
 * Check if murmurhash should really be used for canvas and WebGL - add battery level and detect private mode
 */

(function() {
    var DFcv = {}
    DFcv.DEBUG = false;
    DFcv.cache = {};
    DFcv.clearCache = function() {
      this.cache = {}
    }
    
    setCookie = function(a, b, c) {
        "use strict";
        var d, e;
        try {
            d = new Date, d.setDate(d.getDate() + c), e = escape(b) + (null === c ? "" : "; expires=" + d.toUTCString()), document.cookie = a + "=" + e
        } catch (f) {
            return glbOnError
        }
    }

    getCookie = function(a) {
        "use strict";
        var b, c, d;
        try {
            return b = document.cookie, c = b.indexOf(" " + a + "="), -1 === c && (c = b.indexOf(a + "=")), -1 === c ? b = null : (c = b.indexOf("=", c) + 1, d = b.indexOf(";", c), -1 === d && (d = b.length), b = unescape(b.substring(c, d))), b
        } catch (e) {
            return "NA"
        }
    }
    
    /* UUID */

    DFcv.uuid = function() {
        if (window.name.match(/-|-/)) {
        return window.name
        }
        var d = performance.now();
        var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        uuid = "DID:" + DFcv.cid() + "," + "DT:" + uid;
        window.name = uuid;
        return uuid;
        }
    perfnow = function (window) {
      if (!('performance' in window)) {
        window.performance = {};
      }
      var perf = window.performance;
      window.performance.now = perf.now ||
        perf.mozNow ||
        perf.msNow ||
        perf.oNow ||
        perf.webkitNow ||
        Date.now || function () {
          return new Date().getTime();
        };
    }
    perfnow(window);
    
    /* CIDs */   

    DFcv.cid = function() {  
      var did = mmh3(JSON.stringify(DFcv.device()) + ":" + JSON.stringify(DFcv.scrdepth()));
      var sid = mmh3(JSON.stringify(DFcv.scrdepth()) + ":" + JSON.stringify(DFcv.scrres()));
      var fid = mmh3(JSON.stringify(DFcv.fonts())); 
      var bid = mmh3(JSON.stringify(DFcv.browser()));
      var gid = mmh3(JSON.stringify(DFcv.canvas3d()));
      var wid = mmh3(JSON.stringify(DFcv.webgl()));
      var rid = mmh3(JSON.stringify(DFcv.r()));    
      return did + "-" + sid + ":" + fid + ":" + bid + "-" + gid + "-" + wid + "-" + rid
    }

    /* Get Features */

    DFcv.ddata = function() {
        var a = Date.now(); 
      return { 
        device: DFcv.device(),      
        scrdepth: DFcv.scrdepth(),
        scrres: DFcv.scrres(),   
        fonts: DFcv.fonts(),       
        browser: DFcv.browser(),      
        canvas: DFcv.canvas(),
        canvas2d: DFcv.canvas2d(),
        canvas3d: DFcv.canvas3d(),   
        webgl: DFcv.webgl(), 
        rtc: DFcv.r(),
        rtc1: DFcv.r1(),        
        t0: ((Date.now() - a) / 1e3).toFixed(3) 
      }  
    }
    
    DFcv.cdata = function() {
        var b = Date.now(); 
      return {
        dt: DFcv.uuid(),
        cookie: DFcv.cookie(),
        context: DFcv.context(),   
        connection: DFcv.connection(),                           
        t1: ((Date.now() - b) / 1e3).toFixed(3) 
      }  
    }

    /* Device features */

    DFcv.device = function() {
        a = window.navigator;
      return {
        gpu: gpu(),    
        platform: a.platform,
        touch: touch(),
        type: type()  
      }
    }
        gpu = function() {
            function a(a) {
                    return "[" + a[0] + ", " + a[1] + "]"
                }
                function b(a) {
                    var b, c = a.getExtension("EXT_texture_filter_anisotropic") || a.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || a.getExtension("MOZ_EXT_texture_filter_anisotropic");
                    return c ? (b = a.getParameter(c.MAX_TEXTURE_MAX_ANISOTROPY_EXT), b || (b = 2), b) : null
                }
                function c(a, b) {
                    return b ? "" + Math.pow(2, a) : "2^" + a
                }
                function e(a, b) {
                    return "[-" + c(a.rangeMin, b) + ", " + c(a.rangeMax, b) + "] (" + a.precision + (b ? " bit mantissa" : "") + ")"
                }
                function f(a, b) {
                    var c = b.getShaderPrecisionFormat(a, b.HIGH_FLOAT),
                        d = b.getShaderPrecisionFormat(a, b.MEDIUM_FLOAT);
                    return {
                        High: e(c, 1),
                        Medium: e(d, 1),
                        Low: e(b.getShaderPrecisionFormat(a, b.LOW_FLOAT), 1),
                        Best: e(c.precision ? c : d, 0)
                    }
                }
                function g(a) {
                    var b = a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.HIGH_FLOAT);
                    return (b.precision ? "highp/" : "mediump/") + (b = a.getShaderPrecisionFormat(a.FRAGMENT_SHADER, a.HIGH_INT) && b.rangeMax ? "highp" : "lowp")
                }
                function h(a) {
                    return a && 0 === (a & a - 1)
                }
                function i(b) {
                    var c = a(b.getParameter(b.ALIASED_LINE_WIDTH_RANGE)),
                        d = "Win32" == navigator.platform && "Internet Explorer" != b.getParameter(b.RENDERER) && c == a([1, 1]);
                    return d ? h(b.getParameter(b.MAX_VERTEX_UNIFORM_VECTORS)) && h(b.getParameter(b.MAX_FRAGMENT_UNIFORM_VECTORS)) ? 2 : 1 : 0
                }
            if (window.WebGLRenderingContext) {
                    for (var k, l, j = 4, m = document.createElement("canvas"), n = ["webkit-3d", "moz-webgl", "experimental-webgl", "webgl"]; j--;) try {
                        if ((k = m.getContext(l = n[j])) && "function" == typeof k.getParameter) return {
                            contextName: l,                        
                            antialias: k.getContextAttributes().antialias ? "1" : "0",                        
                            redBits: k.getParameter(k.RED_BITS),
                            greenBits: k.getParameter(k.GREEN_BITS),
                            blueBits: k.getParameter(k.BLUE_BITS),
                            alphaBits: k.getParameter(k.ALPHA_BITS),
                            depthBits: k.getParameter(k.DEPTH_BITS),
                            stencilBits: k.getParameter(k.STENCIL_BITS),
                            maxViewportDimensions: k.getParameter(k.MAX_VIEWPORT_DIMS),                        
                            maxTextureImageUnits: k.getParameter(k.MAX_TEXTURE_IMAGE_UNITS),                        
                            maxAnisotropy: b(k),                        
                            maxFragmentUniformVectors: k.getParameter(k.MAX_FRAGMENT_UNIFORM_VECTORS),
                            fragmentShaderBestPrecision: JSON.stringify(f(k.FRAGMENT_SHADER, k)),
                            fragmentShaderFloatIntPrecision: g(k),
                            maxVertexUniformVectors: k.getParameter(k.MAX_VERTEX_UNIFORM_VECTORS),
                            maxVertexTextureImageUnits: k.getParameter(k.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
                            vertexShaderBestPrecision: JSON.stringify(f(k.VERTEX_SHADER, k)) 
                        }
                    } catch (o) {
                        contextName: "NA"
                    }
                    return {
                        contextName: "Supported. Disabled"
                    }
                }
                return {
                    contextName: "WebGL not supported"
                }
        }    
        touch = function() {
            a = window.navigator;
            var maxTouchPoints = 0;
            var touchEvent = false;
            if(typeof a.maxTouchPoints !== "undefined") {
                maxTouchPoints = a.maxTouchPoints;
            } else if (typeof a.msMaxTouchPoints !== "undefined") {
                maxTouchPoints = a.msMaxTouchPoints;
            }
            try {
                document.createEvent("TouchEvent");
                touchEvent = true;
            } catch(e) {}
              var touchStart = "ontouchstart" in window;
              return [maxTouchPoints, touchEvent, touchStart];
        }
        type = function() {
          a = window.navigator; 
          b = window.navigator.userAgent.toLowerCase();    
          var os;
          if(b.indexOf("windows phone") >= 0){
            os = "Windows Phone";
          } else if(b.indexOf("win") >= 0){
            os = "Windows";
          } else if(b.indexOf("android") >= 0){
            os = "Android";
          } else if(b.indexOf("linux") >= 0){
            os = "Linux";
          } else if(b.indexOf("iphone") >= 0 || b.indexOf("ipad") >= 0 || b.indexOf("ipod") >= 0){
            os = "iOS";
          } else if(b.indexOf("mac") >= 0){
            os = "Mac";
          } else{
            os = "Other";
          }     
          var smartDevice;
          if (("ontouchstart" in window) ||
               (a.maxTouchPoints > 0) ||
               (a.msMaxTouchPoints > 0)) {
                smartDevice = true;
          } else{
            smartDevice = false;      
          }   
          if(smartDevice && os !== "Windows" && os !== "Linux" && os !== "Mac"){
            return "smartMobile";
          }
          else{
            return "desktop";
          }    
        }

    /* Screen features */  

    DFcv.scrdepth = function() {
        e = window.screen;
      return {
        colorDepth: e.colorDepth,
        pixelDepth: e.pixelDepth,
        dpi: DPI()     
      }
    }
        DPI = function() {
            var dpi;
            try {
                var a = document.createElement("div");
                a.style.position = "absolute", a.style.left = "-100%", a.style.top = "-100%", a.style.width = "1in", a.style.height = "1in", a.id = "dpi", document.getElementsByTagName("body")[0].appendChild(a)
            } catch (o) {
                document.write('<div id="dpi" style="position:absolute; left:-100%; top:-100%; width:1in; height:1in"></div>')
            }
            try {
                return dpi = document.getElementById("dpi").offsetWidth + "x" + document.getElementById("dpi").offsetHeight;
            } catch (o) {
                return dpi = "NA";
            }
        }
    DFcv.scrres = function() {
        e = window.screen;
      return {      
        resolution: e.width + "x" + e.height,
        availresolution: e.availWidth + "x" + e.availHeight, 
        winpos: winpos()  
      }
    } 
        winpos = function() {
          e = window;
          var pos;
          if(e.screenTop && e.screenLeft) {
            pos = e.screenTop + "x" + e.screenLeft;
          }        
            else {
            pos = e.screenY + "x" + e.screenX;
          }
          return pos;
        }

    /* Font features */

    DFcv.fonts = function() {
      if (this.cache.fonts !== undefined) {
        return this.cache.fonts
      }
        var baseFonts = ["monospace", "sans-serif", "serif"];        
            var testString = "mmmmmmmmmmlli";
            var testSize = "72px";
            var h = document.getElementsByTagName("body")[0];
            var s = document.createElement("span");
            s.style.fontSize = testSize;
            s.innerHTML = testString;
            var defaultWidth = {};
            var defaultHeight = {};
            for (var index in baseFonts) {
                s.style.fontFamily = baseFonts[index];
                h.appendChild(s);
                defaultWidth[baseFonts[index]] = s.offsetWidth; 
                defaultHeight[baseFonts[index]] = s.offsetHeight; 
                h.removeChild(s);
            }
            var detect = function (font) {
                var detected = false;
                for (var index in baseFonts) {
                    s.style.fontFamily = font + "," + baseFonts[index]; 
                    h.appendChild(s);
                    var matched = (s.offsetWidth !== defaultWidth[baseFonts[index]] || s.offsetHeight !== defaultHeight[baseFonts[index]]);
                    h.removeChild(s);
                    detected = detected || matched;
                }
                return detected;
            };
            var fontList = [
              "Abadi MT Condensed Light", "Adobe Fangsong Std", "Adobe Hebrew", "Adobe Ming Std", "Agency FB", "Arab", "Arabic Typesetting", "Arial Black", "Batang", "Bauhaus 93", "Bell MT", "Bitstream Vera Serif", "Bodoni MT", "Bookman Old Style", "Braggadocio", "Broadway", "Calibri", "Californian FB", "Castellar", "Casual", "Centaur", "Century Gothic", "Chalkduster", "Colonna MT", "Copperplate Gothic Light", "DejaVu LGC Sans Mono", "Desdemona", "DFKai-SB", "Dotum", "Engravers MT", "Eras Bold ITC", "Eurostile", "FangSong", "Forte", "Franklin Gothic Heavy", "French Script MT", "Gabriola", "Gigi", "Gisha", "Goudy Old Style", "Gulim", "GungSeo", "Haettenschweiler", "Harrington", "Hiragino Sans GB", "Impact", "Informal Roman", "KacstOne", "Kino MT", "Kozuka Gothic Pr6N", "Lohit Gujarati", "Loma", "Lucida Bright", "Lucida Fax", "Magneto", "Malgun Gothic", "Matura MT Script Capitals", "Menlo", "MingLiU-ExtB", "MoolBoran", "MS PMincho", "MS Reference Sans Serif", "News Gothic MT", "Niagara Solid", "Nyala", "Palace Script MT", "Papyrus", "Perpetua", "Playbill", "PMingLiU", "Rachana", "Rockwell", "Sawasdee", "Script MT Bold", "Segoe Print", "Showcard Gothic", "SimHei", "Snap ITC", "TlwgMono", "Tw Cen MT Condensed Extra Bold", "Ubuntu", "Umpush", "Univers", "Utopia", "Vladimir Script", "Wide Latin"];
            var available = [];
            for (var i = 0, l = fontList.length; i < l; i++) {
              if(detect(fontList[i])) {
                available.push(fontList[i]);
              }
            }
        var length = available.length
      var output = length + "," +available.join(",")
      this.cache.fonts = output
      return output
    }

    /* Browser features */  

    DFcv.browser = function() {
        c = window.navigator;    
      return {
        cpuClass: c.cpuClass,
        language: c.language || c.browserLanguage,    
        systemLanguage: c.systemLanguage,
        userLanguage: c.userLanguage,
        prefLanguages: c.languages,
        timezone: (new Date).getTimezoneOffset() / -60,  
        appName: c.appName,
        appCodeName: c.appCodeName,
        appVersion: c.appVersion,
        appMinorVersion: c.appMinorVersion,
        cookieEnabled: cookieEnabled(),
        doNotTrack: c.doNotTrack || c.msDoNotTrack,
        AdBlock: adBlock(),  
        hardwareConcurrency: c.hardwareConcurrency,
        javaEnabled: c.javaEnabled() ? 1 : 0,
        mimeTypes: c.mimeTypes.length,
        oscpu: c.oscpu,
        plgins: c.plugins.length,  
        plugins: plugins(),    
        product: c.product,
        productSub: c.productSub,
        vendor: c.vendor,
        vendorSub: c.vendorSub,
        userAgent: c.userAgent,
        systemColors: systemColors(),  
        browserFeatures: browserFeatures()    
      }
    }
        cookieEnabled = function() {
            "use strict";
            var a, b, c;
            try {
                return a = navigator.cookieEnabled ? 1 : 0, b = typeof navigator.cookieEnabled, "undefined" !== b || a || (document.cookie = "testcookie", a = -1 !== document.cookie.indexOf("testcookie") ? 1 : 0), c = a
            } catch (e) {
                return "NA"
            }
        }
        adBlock = function() {
          var ads = document.createElement("div");
          ads.setAttribute("id", "ads");
          document.body.appendChild(ads);
          return document.getElementById("ads") ? 0 : 1;
        }
        plugins = function() {
                e = window.navigator; 
                for (var c, a = e.plugins, b = a.length, d = ""; b--;) d += (c = a[b]).name + c.description + c.filename + c.length;
                return d.replace(/\s/g, "")
        }    
        systemColors = function() {        
              var div = document.createElement("div"),
              colors = {},
              elements = ["ActiveBorder", "ActiveCaption", "AppWorkspace", "Background", "ButtonFace", "ButtonHighlight", "ButtonShadow", "ButtonText", "CaptionText", "GrayText", "Highlight", "HighlightText", "InactiveBorder", "InactiveCaption", "InactiveCaptionText", "InfoBackground", "InfoText", "Menu", "MenuText", "Scrollbar", "ThreeDDarkShadow", "ThreeDFace", "ThreeDHighlight", "ThreeDLightShadow", "ThreeDShadow", "Window", "WindowFrame", "WindowText"];
            try {
              if (!window.getComputedStyle) return colors;
              for (var i = 0; i < elements.length; i++) document.body.appendChild(div), div.style.color = elements[i], colors[elements[i]] = window.getComputedStyle(div).getPropertyValue("color"), document.body.removeChild(div);
              return colors
            } catch (e) {}  
        }  
        browserFeatures = function() {
            var a = function(a, b, c) {
                function d(a) {
                    q.cssText = a
                }
                function f(a, b) {
                    return typeof a === b
                }
                function g(a, b) {
                    return !!~("" + a).indexOf(b)
                }
                function h(a, b) {
                    for (var d in a) {
                        var e = a[d];
                        if (!g(e, "-") && q[e] !== c) return "pfx" == b ? e : !0
                    }
                    return !1
                }
                function i(a, b, d) {
                    for (var e in a) {
                        var g = b[a[e]];
                        if (g !== c) return d === !1 ? a[e] : f(g, "function") ? g.bind(d || b) : g
                    }
                    return !1
                }
                function j(a, b, c) {
                    var d = a.charAt(0).toUpperCase() + a.slice(1),
                        e = (a + " " + v.join(d + " ") + d).split(" ");
                    return f(b, "string") || f(b, "undefined") ? h(e, b) : (e = (a + " " + w.join(d + " ") + d).split(" "), i(e, b, c))
                }
                function k() {
                    m.input = function(c) {
                        for (var d = 0, e = c.length; e > d; d++) z[c[d]] = c[d] in r;
                        return z.list && (z.list = !!b.createElement("datalist") && !!a.HTMLDataListElement), z
                    }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")), m.inputtypes = function(a) {
                        for (var e, f, g, d = 0, h = a.length; h > d; d++) r.setAttribute("type", f = a[d]), e = "text" !== r.type, e && (r.value = s, r.style.cssText = "position:absolute;visibility:hidden;", /^range$/.test(f) && r.style.WebkitAppearance !== c ? (n.appendChild(r), g = b.defaultView, e = g.getComputedStyle && "textfield" !== g.getComputedStyle(r, null).WebkitAppearance && 0 !== r.offsetHeight, n.removeChild(r)) : /^(search|tel)$/.test(f) || (e = /^(url|email)$/.test(f) ? r.checkValidity && r.checkValidity() === !1 : r.value != s)), y[a[d]] = !!e;
                        return y
                    }("search tel url email datetime date month week time datetime-local number range color".split(" "))
                    }
                    var C, F, l = "2.8.2",
                        m = {},
                        n = b.documentElement,
                        o = "modernizr",
                        p = b.createElement(o),
                        q = p.style,
                        r = b.createElement("input"),
                        s = ":)",
                        u = ({}.toString, "Webkit Moz O ms"),
                        v = u.split(" "),
                        w = u.toLowerCase().split(" "),
                        x = {},
                        y = {},
                        z = {},
                        A = [],
                        B = A.slice,
                        D = function() {
                            function a(a, e) {
                                e = e || b.createElement(d[a] || "div"), a = "on" + a;
                                var g = a in e;
                                return g || (e.setAttribute || (e = b.createElement("div")), e.setAttribute && e.removeAttribute && (e.setAttribute(a, ""), g = f(e[a], "function"), f(e[a], "undefined") || (e[a] = c), e.removeAttribute(a))), e = null, g
                            }
                            var d = {
                                select: "input",
                                change: "input",
                                submit: "form",
                                reset: "form",
                                error: "img",
                                load: "img",
                                abort: "img"
                            };
                            return a
                        }(),
                        E = {}.hasOwnProperty;
                    F = f(E, "undefined") || f(E.call, "undefined") ? function(a, b) {
                        return b in a && f(a.constructor.prototype[b], "undefined")
                    } : function(a, b) {
                        return E.call(a, b)
                    }, Function.prototype.bind || (Function.prototype.bind = function(a) {
                        var b = this;
                        if ("function" != typeof b) throw new TypeError;
                        var c = B.call(arguments, 1),
                            d = function() {
                                if (this instanceof d) {
                                    var e = function() {};
                                    e.prototype = b.prototype;
                                    var f = new e,
                                        g = b.apply(f, c.concat(B.call(arguments)));
                                    return Object(g) === g ? g : f
                                }
                                return b.apply(a, c.concat(B.call(arguments)))
                            };
                        return d
                    }), x.canvas = function() {
                        var a = b.createElement("canvas");
                        return !!a.getContext && !!a.getContext("2d")
                    }, x.canvastext = function() {
                        return !!m.canvas && !!f(b.createElement("canvas").getContext("2d").fillText, "function")
                    }, x.postmessage = function() {
                        return !!a.postMessage
                    }, x.websqldatabase = function() {
                        return !!a.openDatabase
                    }, x.indexedDB = function() {
                        return !!j("indexedDB", a)
                    }, x.hashchange = function() {
                        return D("hashchange", a) && (b.documentMode === c || b.documentMode > 7)
                    }, x.history = function() {
                        return !!a.history && !!history.pushState
                    }, x.draganddrop = function() {
                        var a = b.createElement("div");
                        return "draggable" in a || "ondragstart" in a && "ondrop" in a
                    }, x.websockets = function() {
                        return "WebSocket" in a || "MozWebSocket" in a
                    }, x.video = function() {
                        var a = b.createElement("video"),
                            c = !1;
                        try {
                            (c = !!a.canPlayType) && (c = new Boolean(c), c.ogg = a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, ""), c.h264 = a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, ""), c.webm = a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, ""))
                        } catch (d) {}
                        return c
                    }, x.audio = function() {
                        var a = b.createElement("audio"),
                            c = !1;
                        try {
                            (c = !!a.canPlayType) && (c = new Boolean(c), c.ogg = a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""), c.mp3 = a.canPlayType("audio/mpeg;").replace(/^no$/, ""), c.wav = a.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""), c.m4a = (a.canPlayType("audio/x-m4a;") || a.canPlayType("audio/aac;")).replace(/^no$/, ""))
                        } catch (d) {}
                        return c
                    }, x.localstorage = function() {
                        try {
                            return localStorage.setItem(o, o), localStorage.removeItem(o), !0
                        } catch (a) {
                            return !1
                        }
                    }, x.sessionstorage = function() {
                        try {
                            return sessionStorage.setItem(o, o), sessionStorage.removeItem(o), !0
                        } catch (a) {
                            return !1
                        }
                    }, x.webworkers = function() {
                        return !!a.Worker
                    }, x.applicationcache = function() {
                        return !!a.applicationCache
                    };
                    for (var G in x) F(x, G) && (C = G.toLowerCase(), m[C] = x[G](), A.push((m[C] ? "" : "no-") + C));
                    return m.input || k(), m.addTest = function(a, b) {
                        if ("object" == typeof a)
                            for (var d in a) F(a, d) && m.addTest(d, a[d]);
                        else {
                            if (a = a.toLowerCase(), m[a] !== c) return m;
                            b = "function" == typeof b ? b() : b, "undefined" != typeof enableClasses && enableClasses && (n.className += " " + (b ? "" : "no-") + a), m[a] = b
                        }
                        return m
                    }, d(""), p = r = null, m._version = l, m._domPrefixes = w, m._cssomPrefixes = v, m.hasEvent = D, m.testProp = function(a) {
                        return h([a])
                    }, m.testAllProps = j, m
                }(window, window.document);
                return {
                    applicationcache: a.applicationcache,
                    audio: a.audio,
                    canvas: a.canvas,
                    canvastext: a.canvastext,
                    draganddrop: a.draganddrop,
                    hashchange: a.hashchange,
                    history: a.history,
                    indexeddb: a.indexeddb,
                    input: JSON.stringify(a.input),
                    inputtypes: JSON.stringify(a.inputtypes),
                    localstorage: a.localstorage,
                    postmessage: a.postmessage,
                    sessionstorage: a.sessionstorage,
                    video: a.video,
                    websockets: a.websockets,
                    websqldatabase: a.websqldatabase,
                    webworkers: a.webworkers
                }
            }

    /* Canvas Features */

    DFcv.canvas = function() {
      if (DFcv.cache.canvas !== undefined) {
        return DFcv.cache.canvas;
      }
        var result = [];      
          var canvas = document.createElement("canvas");
          canvas.width = 2000;
          canvas.height = 200;
          canvas.style.display = "inline";
          var ctx = canvas.getContext("2d");      
          ctx.rect(0, 0, 10, 10);
          ctx.rect(2, 2, 6, 6);
          result.push("canvas winding:" + ((ctx.isPointInPath(5, 5, "evenodd") === false) ? "1" : "0"));
          ctx.textBaseline = "alphabetic";
          ctx.fillStyle = "#f60";
          ctx.fillRect(125, 1, 62, 20);
          ctx.fillStyle = "#069";
          ctx.font = "11pt no-real-font-123";      
          ctx.fillText("PR flacks quiz gym: TV DJ box when? â˜ ", 2, 15);
          ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
          ctx.font = "18pt Arial";
          ctx.fillText("PR flacks quiz gym: TV DJ box when? â˜ ", 4, 45);      
          ctx.globalCompositeOperation = "multiply";
          ctx.fillStyle = "rgb(255,0,255)";
          ctx.beginPath();
          ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = "rgb(0,255,255)";
          ctx.beginPath();
          ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = "rgb(255,255,0)";
          ctx.beginPath();
          ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = "rgb(255,0,255)";      
          ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
          ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
          ctx.fill("evenodd");
          result.push("canvas" + canvas.toDataURL());
          var e = result.join("~");         
          var f = mmh3(e)
      DFcv.cache.canvas = f
      return f
    }
    DFcv.canvas2d = function() {
        var canvas, context;
         try {
            canvas = document.createElement("canvas"), context = canvas.getContext("2d")
        } catch (e) {}
        if (context) return context.fillStyle = "red", context.fillRect(30, 10, 200, 100), context.strokeStyle = "#1a3bc1", context.lineWidth = 6, context.lineCap = "round", context.arc(50, 50, 20, 0, Math.PI, !1), context.stroke(), context.fillStyle = "#42e1a2", context.font = "15.4px 'Arial'", context.textBaseline = "alphabetic", context.fillText("PR flacks quiz gym: TV DJ box when? â˜ ", 15, 60), context.shadowOffsetX = 1, context.shadowOffsetY = 2, context.shadowColor = "white", context.fillStyle = "rgba(0, 0, 200, 0.5)", context.font = "60px 'Not a real font'", context.fillText("Noéª—", 40, 80), mmh3(canvas.toDataURL())       
    }
    DFcv.canvas3d = function() {
        for (var b, c, a = ['18pt "Arial"', '20px "Arial"', "DEFAULT FONT"], e = "", f = 3, g = "PR flacks quiz gym: TV DJ box when? â˜ "; f--;) b = document.createElement("canvas"), c = b.getContext("2d"), c.textBaseline = "top", c.font = a[f], c.textBaseline = "alphabetic", c.fillStyle = "#f60", c.fillRect(125, 1, 62, 20), c.fillStyle = "#069", c.fillText(g, 2, 15), c.fillStyle = "rgba(102, 204, 0, 0.7)", c.fillText(g, 4, 17), e += b.toDataURL();
            return mmh3(e)       
    }

    /* WebGL Features */

    DFcv.webgl = function() {
        var gl;
          var fa2s = function(fa) {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            return "[" + fa[0] + ", " + fa[1] + "]";
          };
          var maxAnisotropy = function(gl) {
            var anisotropy, ext = gl.getExtension("EXT_texture_filter_anisotropic") || gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
            return ext ? (anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 0 === anisotropy && (anisotropy = 2), anisotropy) : null;
          };
          gl = getWebglCanvas();
          if(!gl) { return null; }      
          var result = [];
          var vShaderTemplate = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
          var fShaderTemplate = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
          var vertexPosBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
          var vertices = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]);
          gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
          vertexPosBuffer.itemSize = 3;
          vertexPosBuffer.numItems = 3;
          var program = gl.createProgram(), vshader = gl.createShader(gl.VERTEX_SHADER);
          gl.shaderSource(vshader, vShaderTemplate);
          gl.compileShader(vshader);
          var fshader = gl.createShader(gl.FRAGMENT_SHADER);
          gl.shaderSource(fshader, fShaderTemplate);
          gl.compileShader(fshader);
          gl.attachShader(program, vshader);
          gl.attachShader(program, fshader);
          gl.linkProgram(program);
          gl.useProgram(program);
          program.vertexPosAttrib = gl.getAttribLocation(program, "attrVertex");
          program.offsetUniform = gl.getUniformLocation(program, "uniformOffset");
          gl.enableVertexAttribArray(program.vertexPosArray);
          gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0);
          gl.uniform2f(program.offsetUniform, 1, 1);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
          if (gl.canvas != null) { result.push(mmh3(gl.canvas.toDataURL())); }
          result.push(gl.getSupportedExtensions().join(";"));
          result.push(fa2s(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)));
          result.push(fa2s(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)));      
          result.push(gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
          result.push(gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));      
          result.push(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
          result.push(gl.getParameter(gl.MAX_TEXTURE_SIZE));
          result.push(gl.getParameter(gl.MAX_VARYING_VECTORS));
          result.push(gl.getParameter(gl.MAX_VERTEX_ATTRIBS));      
          result.push(gl.getParameter(gl.RENDERER));
          result.push(gl.getParameter(gl.SHADING_LANGUAGE_VERSION));      
          result.push(gl.getParameter(gl.VENDOR));
          result.push(gl.getParameter(gl.VERSION));
          if (!gl.getShaderPrecisionFormat) {
            if (typeof NODEBUG === "undefined") {
              this.log("getShaderPrecisionFormat not supported");
            }
            return result.join(";");
          }
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).precision);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).rangeMin);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).rangeMax);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).precision);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).rangeMin);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).rangeMax);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).precision);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).rangeMin);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).rangeMax);
          result.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).precision);
          result.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).rangeMin);
          result.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).rangeMax);
          result.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).precision);
          result.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).rangeMin);
          result.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).rangeMax);
          result.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).precision);
          result.push(+ gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).rangeMin);
          result.push(+ gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).rangeMax);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).precision);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).rangeMin);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).rangeMax);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).precision);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).rangeMin);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).rangeMax);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).precision);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).rangeMin);
          result.push(gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).rangeMax);
          result.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).precision);
          result.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).rangeMin);
          result.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).rangeMax);
          result.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).precision);
          result.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).rangeMin);
          result.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).rangeMax);
          result.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).precision);
          result.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).rangeMin);
          result.push(gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).rangeMax);
          return result.join(";");
        }
        getWebglCanvas = function() {
          var canvas = document.createElement("canvas");
          var gl = null;
          try {
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
          } catch(e) { }
          if (!gl) { gl = null; }
          return gl;
        }

    /* Cookie Features */
        
    /* Connection Features */
        
    DFcv.cookie = function() {     
      "use strict";
        var a, b, c;
        try {
            return a = DFcv.uuid(), b = getCookie("DT"), null === b && (setCookie("DT", a, 365), c = "new" + "=" + a), b === a && (setCookie("DT", a, 365),  c = "existing" + "=" + a), b !== a && (setCookie("DT", a, 365), c = "replace" + "=" + b + "/" + a), c            
        } catch (e) {
            return "NA"
        }
    }   

    DFcv.connection = function() {     
      return {     
        connectionType: connectionType(),  
        timing: timing()     
      }
    }    
        connectionType = function() {        
            var a, b;
            try {
                a = navigator.connection.type, b = a
            } catch (c) {
                b = "NA"
            }
            return b
        }
        timing = function() {
        if (window.performance && window.performance.timing) {
            c = window.performance;
            d = window.performance.timing;
              return {  
                    fetchStart: d.fetchStart,
                    transfer: d.responseEnd - d.responseStart, 
                    DnsStart: d.domainLookupStart,
                    DnsEnd: d.domainLookupEnd,  
                    TcpStart: d.connectStart,
                    TcpEnd: d.connectEnd, 
                    requestStart: d.requestStart,
                    responseStart: d.responseStart, 
                    responseEnd: d.responseEnd,  
                    domLoading: d.domLoading            
                    }
        }    
        return "NA";
    }    

    /* R Features */

    probeIp = function(ip, timeout, cb) {
      var start = Date.now();
      var done = false;
      var img = document.createElement('img');
      var clean = function() {
        if (!img) return;
        document.body.removeChild(img);
        img = null;
      };
      var onResult = function(success) {
        if (done) return;
        done = true;
        clean();
        cb(ip, Date.now() - start < timeout);
      };
      document.body.appendChild(img);
      img.style.display = 'none';
      img.onload = function() { onResult(true); };
      img.onerror = function() { onResult(false); };
      img.src = 'https://' + ip + ':' + ~~(1024+1024*Math.random()) + '/I_DO_NOT_EXIST?' + Math.random();
      setTimeout(function() { if (img) img.src = ''; }, timeout + 500);
    }    
    enumLocalIPs = function(cb) {
      var RTCPeerConnection = window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
      if (!RTCPeerConnection) return false;
      var addrs = Object.create(null);
      addrs['0.0.0.0'] = false;
      function addAddress(newAddr) {
        if (newAddr in addrs) return;
        addrs[newAddr] = true;
        cb(newAddr);
      }
      function grepSDP(sdp) {
        var hosts = [];
        sdp.split('\r\n').forEach(function (line) {
          if (~line.indexOf('a=candidate')) {
            var parts = line.split(' '),
                addr = parts[4],
                type = parts[7];
            if (type === 'host') addAddress(addr);
          } else if (~line.indexOf('c=')) {
            var parts = line.split(' '),
            addr = parts[2];
            addAddress(addr);
          }
        });
      }
      var rtc = new RTCPeerConnection({iceServers:[]});
      rtc.createDataChannel('', {reliable:false});
      rtc.onicecandidate = function (evt) {
        if (evt.candidate) grepSDP('a='+evt.candidate.candidate);
      };
      setTimeout(function() {
        rtc.createOffer(function (offerDesc) {
          grepSDP(offerDesc.sdp);
          rtc.setLocalDescription(offerDesc);
        }, function (e) {});
      }, 500);
      return true;
    }

    DFcv.r = function() {       
        try {
              enumLocalIPs(function(localIp) {
              console.log(localIp);  

                });    
            } catch (e) {
                return "NA";
            }
        return "dummy";
    } 
    DFcv.r1 = function(callback) {
            b = window;
            if (b.MediaStreamTrack) {            
                MediaStreamTrack.getSources || (MediaStreamTrack.getSources = MediaStreamTrack.getMediaDevices);
                b.MediaStreamTrack && MediaStreamTrack.getSources;
                try {
                    MediaStreamTrack.getSources(function(sources) {
                    var c = sources.length; 
                    var h;    
                    console.log("Total Devices: "+ c);    
                    for(var i=0, f = []; i<c; i++) {
                        var source = sources[i];
                        f.push(source.kind + ":" + source.id)            
                    }
                        h = f.join("|");
                            console.log(h);                  

                    })
                    } catch (e) {
                        return "NA"
                    }
                    } else 
                        return "Disabled"
    }  

    /* Context Features */

    DFcv.context = function() {
        "use strict";
        a = window;
        b = window.document;
        return {
            ref: b.referrer,
            loc: a.location.href
        }
    }

    /* Export */

    if (typeof module !== "undefined" && module.exports) {
      module.exports = DFcv
    }
    else {
      window.DFcv = DFcv
    }

    /* Libs */

    // murmurhash implementation modified for size    

    mmh3 = function(a) {
                    for (var h, k, b = 3 & a.length, c = a.length - b, d = 1, e = 3432918353, f = 461845907, g = 0; c > g;) k = 255 & a.charCodeAt(g) | (255 & a.charCodeAt(++g)) << 8 | (255 & a.charCodeAt(++g)) << 16 | (255 & a.charCodeAt(++g)) << 24, ++g, k = 4294967295 & (65535 & k) * e + ((65535 & (k >>> 16) * e) << 16), k = k << 15 | k >>> 17, k = 4294967295 & (65535 & k) * f + ((65535 & (k >>> 16) * f) << 16), d ^= k, d = d << 13 | d >>> 19, h = 4294967295 & 5 * (65535 & d) + ((65535 & 5 * (d >>> 16)) << 16), d = (65535 & h) + 27492 + ((65535 & (h >>> 16) + 58964) << 16);
                    switch (k = 0, b) {
                        case 3:
                            k ^= (255 & a.charCodeAt(g + 2)) << 16;
                        case 2:
                            k ^= (255 & a.charCodeAt(g + 1)) << 8;
                        case 1:
                            k ^= 255 & a.charCodeAt(g), k = 4294967295 & (65535 & k) * e + ((65535 & (k >>> 16) * e) << 16), k = k << 15 | k >>> 17, k = 4294967295 & (65535 & k) * f + ((65535 & (k >>> 16) * f) << 16), d ^= k
                    }
                    return d ^= a.length, d ^= d >>> 16, d = 4294967295 & 2246822507 * (65535 & d) + ((65535 & 2246822507 * (d >>> 16)) << 16), d ^= d >>> 13, d = 4294967295 & 3266489909 * (65535 & d) + ((65535 & 3266489909 * (d >>> 16)) << 16), d ^= d >>> 16, d >>> 0
        }    
})()