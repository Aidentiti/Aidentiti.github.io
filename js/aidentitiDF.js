/*
* AidentitDF 0.2.0 - Modern & flexible browser fingerprint library
* 
* Copyright (c) 2015 Andreas Wagner (anwaatwork@gmail.com)
*/
(function (name, context, definition) {
  "use strict";
  if (typeof module !== "undefined" && module.exports) { module.exports = definition(); }
  else if (typeof define === "function" && define.amd) { define(definition); }
  else { context[name] = definition(); }
})("DF", this, function() {
  "use strict";    
    
  var DEBUG = true;
  var DF = function(options) {
    var defaultOptions = {
      swfContainerId: "fingerprintjs2",
      swfPath: "flash/compiled/FontList.swf"
    };
    this.options = this.extend(options, defaultOptions);
    this.nativeForEach = Array.prototype.forEach;
    this.nativeMap = Array.prototype.map;        
  }; 
      
  DF.prototype = {
    extend: function(source, target) {
      if (source == null) { return target; }
      for (var k in source) {
        if(source[k] != null && target[k] !== source[k]) {
          target[k] = source[k];
        }
      }
      return target;
    },
    log: function(msg){
      if(window.console){
        console.log(msg);
      }
    },
    get: function(done){
      var keys = [];          
      //1.DRK - done
      keys = this.canvasKey(keys);
      keys = this.webglKey(keys);
      //2.DTK - done
      keys = this.deviceTypeKey(keys);
      keys = this.deviceKey(keys); 
      keys = this.browserKey(keys);
      keys = this.engineKey(keys); 
      keys = this.javaKey(keys); 
      keys = this.flashKey(keys);         
      keys = this.silverlightKey(keys);
      //3.RTC
      //keys = this.webRTCKey(keys);        
      //4.CSK - done    
      keys = this.sessionStorageKey(keys);
      keys = this.localStorageKey(keys);
      keys = this.indexedDbKey(keys);
      keys = this.addBehaviorKey(keys);
      keys = this.openDatabaseKey(keys);
      keys = this.cookieKey(keys);             
      //5.DHK - done    
      keys = this.colorDepthKey(keys);      
      keys = this.cpuClassKey(keys);
      keys = this.hardwareConcurrencyKey(keys); 
      keys = this.platformKey(keys);
      keys = this.operatingSystemKey(keys);
      keys = this.maxTouchPointsKey(keys);               
      //6.DSK
      keys = this.doNotTrackKey(keys);        
      //keys = this.CFPDKey(keys);                 
      //7.DEK               
      keys = this.pluginsKey(keys);
      keys = this.pluginsLengthKey(keys);
      //keys = this.fontsKey(keys);
      //keys = this.fontsLengthKey(keys);
      //8.TLK - done
      keys = this.userlanguageKey(keys); 
      keys = this.systemlanguageKey(keys);
      keys = this.timezoneOffsetKey(keys);     
      //9.DRK - done
      //keys = this.screenResolutionKey(keys);
      //keys = this.availScreenResolutionKey(keys);     
      //10.DVK      
      //keys = this.browserVersion(keys);       -Probleme
      //keys = this.engineVersion(keys); 
      //keys = this.browserVersion(keys);
      //keys = this.osVersion(keys);
      //keys = this.javaVersion(keys);          -Probleme
      //keys = this.flashVersion(keys);         -Probleme
      //keys = this.silverlightVersion(keys);   -Probleme
      //keys = this.pluginVersion(keys);  
    
      //11.UAK
      //keys = this.userAgentKey(keys); 
        
        
      var that = this;
      this.fontsKey(keys, function(newKeys){         
        var murmur = that.x64hash128(newKeys.join("~~~"), 31);
        return done(murmur);
      });        
      console.log(keys.toString());
    },      
    getBrowserData: function () {
        return browserData;
    },    
    //1.DRK----------------------------------------------------------------------------------  
    canvasKey: function(keys) {
      if(!this.options.excludeCanvas && this.isCanvasSupported()) {
        keys.push(this.getCanvasFp());
      }
      return keys;
    },
    webglKey: function(keys) {
      if(!this.options.excludeWebGL && this.isCanvasSupported()) {
        keys.push(this.getWebglFp());
      }
      return keys;
    },  
    //2.DTK----------------------------------------------------------------------------------
    deviceTypeKey: function(keys) {
      if(!this.options.excludeUserAgent) {
        keys.push(this.getDeviceType());
      }
      return keys;
    },
    deviceKey: function(keys) {
      if(!this.options.excludeUserAgent) {
        keys.push(this.getDevice());
      }
      return keys;
    },  
    browserKey: function(keys) {
      if(!this.options.excludeUserAgent) {
        keys.push(this.getBrowser());
      }
      return keys;
    },
    engineKey: function(keys) {
      if(!this.options.excludeUserAgent) {
        keys.push(this.getEngine());
      }
      return keys;
    },     
    javaKey: function(keys) {
      if(!this.options.excludeJava && navigator.javaEnabled()) {
        keys.push("1");
      } else {
        keys.push("0");
      }
      return keys;
    },
    flashKey: function(keys) {
      if(!this.options.excludeFlash && this.hasFlashEnabled()) {
        keys.push("1");
      } else {
        keys.push("0");
      }
      return keys;
    },  
    silverlightKey: function(keys) {
      if(!this.options.excludeSilverlight && this.hasSilverlightEnabled()) {
        keys.push("1");
      } else {
        keys.push("0");
      }
      return keys;
    },
    //3.RTC----------------------------------------------------------------------------------
      
    //4.CSK----------------------------------------------------------------------------------  
    sessionStorageKey: function(keys) {
      if(!this.options.excludeSessionStorage && this.hasSessionStorage()) {
        keys.push("1");
      } else {
        keys.push("0"); 
      }      
      return keys;
    },
    localStorageKey: function(keys) {
      if(!this.options.excludeSessionStorage && this.hasLocalStorage()) {
        keys.push("1");
      } else {
        keys.push("0"); 
      }  
      return keys;
    },
    indexedDbKey: function(keys) {
      if(!this.options.excludeIndexedDB && this.hasIndexedDB()) {
        keys.push("1");
      } else {
        keys.push("0"); 
      }  
      return keys;
    },
    addBehaviorKey: function(keys) {      
      if(document.body && !this.options.excludeAddBehavior && document.body.addBehavior) {
        keys.push("1");
      } else {
        keys.push("0"); 
      }  
      return keys;
    },
    openDatabaseKey: function(keys) {
      if(!this.options.excludeOpenDatabase && window.openDatabase) {
        keys.push("1");
      } else {
        keys.push("0"); 
      }  
      return keys;
    },
    cookieKey: function(keys) {
      if(!this.options.excludeCookie && navigator.cookieEnabled) {
        keys.push("1");
      } else {
        keys.push("0"); 
      }  
      return keys;
    },    
    //5.DHK----------------------------------------------------------------------------------  
    colorDepthKey: function(keys) {
      if(!this.options.excludeColorDepth) {
        keys.push(screen.colorDepth);
      }
      return keys;
    },    
    cpuClassKey: function(keys) {
      if(!this.options.excludeCpuClass) {
        keys.push(this.getNavigatorCpuClass());
      }
      return keys;
    },
    hardwareConcurrencyKey: function(keys) {
      if(!this.options.excludeHardwareConcurrency) {
        keys.push(this.getNavigatorHardwareConcurrency());
      }
      return keys;
    },  
    platformKey: function(keys) {
      if(!this.options.excludePlatform) {
        keys.push(this.getNavigatorPlatform());
      }
      return keys;
    },
    operatingSystemKey: function(keys) {
      if(!this.options.excludeOperatingSystem) {
        keys.push(this.getOperatingSystem());
      }
      return keys;
    },  
    maxTouchPointsKey: function(keys) {
      if(!this.options.maxTouchPoints) {
        keys.push(this.getNavigatorMaxTouchPoints());
      }
      return keys;
    },    
    //6.DSK----------------------------------------------------------------------------------  
    doNotTrackKey: function(keys) {
      if(!this.options.excludeDoNotTrack && !this.getDoNotTrack()) {
        keys.push("1");
      } else {
        keys.push("0"); 
      }  
      return keys;
    },      
    //7.DEK----------------------------------------------------------------------------------      
    fontsKey: function(keys, done) {
      if(this.options.excludeFlashFonts) {
        if(DEBUG){
          this.log("Skipping flash fonts detection per excludeFlashFonts configuration option");
        }
        if(this.options.excludeJsFonts) {
          if(DEBUG) {
            this.log("Skipping js fonts detection per excludeJsFonts configuration option");
          }
          return done(keys);
        }
        return done(this.jsFontsKey(keys));
      }      
      if(!this.hasSwfObjectLoaded()){
        if(DEBUG){
          this.log("Swfobject is not detected, Flash fonts enumeration is skipped");
        }
        return done(this.jsFontsKey(keys));
      }
      if(!this.hasMinFlashInstalled()){
        if(DEBUG){
          this.log("Flash is not installed, skipping Flash fonts enumeration");
        }
        return done(this.jsFontsKey(keys));
      }
      if(typeof this.options.swfPath === "undefined"){
        if(DEBUG){
          this.log("To use Flash fonts detection, you must pass a valid swfPath option, skipping Flash fonts enumeration");
        }
        return done(this.jsFontsKey(keys));
      }
      return this.flashFontsKey(keys, done);
    },
    // flash fonts (will increase fingerprinting time 20X to ~ 130-150ms)
    flashFontsKey: function(keys, done) {
      this.loadSwfAndDetectFonts(function(fonts){
        keys.push(fonts.join(";"));
        done(keys);
      });
    },    
    jsFontsKey: function(keys) {     
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
        "Abadi MT Condensed Light", "Academy Engraved LET",
        "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO",
        "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium",
        "Algerian", "Amazone BT", "American Typewriter",
        "American Typewriter Condensed", "AmerType Md BT", "Andale Mono",
        "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita",
        "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo",
        "Arabic Typesetting", "ARCHER", "Arial", "Arial Black", "Arial Hebrew",
        "Arial MT", "Arial Narrow", "Arial Rounded MT Bold",
        "Arial Unicode MS", "ARNO PRO", "Arrus BT", "Aurora Cn BT",
        "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy",
        "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville",
        "Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni",
        "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT",
        "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed",
        "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD",
        "Bitstream Vera Sans Mono", "Blackadder ITC", "BlairMdITC TT",
        "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT",
        "Bodoni MT Black", "Bodoni MT Condensed",
        "Bodoni MT Poster Compressed", "Book Antiqua", "Bookman Old Style",
        "Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC",
        "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New",
        "BrowalliaUPC", "Brush Script MT", "Calibri", "Californian FB",
        "Calisto MT", "Calligrapher", "Cambria", "Cambria Math", "Candara",
        "CaslonOpnface BT", "Castellar", "Centaur", "Century",
        "Century Gothic", "Century Schoolbook", "Cezanne", "CG Omega",
        "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster",
        "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer",
        "ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed",
        "CloisterBlack BT", "Cochin", "Colonna MT", "Comic Sans",
        "Comic Sans MS", "Consolas", "Constantia", "Cooper Black",
        "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold",
        "Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel",
        "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Courier",
        "Courier New", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David",
        "DB LCD Temp", "DELICIOUS", "Denmark", "Devanagari Sangam MN",
        "DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum",
        "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant",
        "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT",
        "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC",
        "Estrangelo Edessa", "EucrosiaUPC", "Euphemia", "Euphemia UCAS",
        "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys",
        "FONTIN", "Footlight MT Light", "Forte", "Franklin Gothic",
        "Franklin Gothic Book", "Franklin Gothic Demi",
        "Franklin Gothic Demi Cond", "Franklin Gothic Heavy",
        "Franklin Gothic Medium", "Franklin Gothic Medium Cond", "FrankRuehl",
        "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script",
        "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER",
        "Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT",
        "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT",
        "Garamond", "Gautami", "Geeza Pro", "Geneva", "Geometr231 BT",
        "Geometr231 Hv BT", "Geometr231 Lt BT", "Georgia", "GeoSlab 703 Lt BT",
        "GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT",
        "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold",
        "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha",
        "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD",
        "Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT",
        "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe",
        "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington",
        "Heather", "Heiti SC", "Heiti TC", "HELV", "Helvetica",
        "Helvetica Neue", "Herald", "High Tower Text",
        "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text",
        "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Impact",
        "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT",
        "Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT",
        "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET",
        "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT",
        "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN",
        "Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC",
        "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script",
        "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT",
        "LilyUPC", "Lithograph", "Lithograph Light", "Long Island",
        "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax",
        "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans",
        "Lucida Sans Typewriter", "Lucida Sans Unicode", "Lydian BT",
        "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic",
        "Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett",
        "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI",
        "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue",
        "Microsoft PhagsPa", "Microsoft Sans Serif", "Microsoft Tai Le",
        "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU",
        "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion",
        "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern",
        "Modern No. 20", "Mona Lisa Solid ITC TT", "Monaco", "Mongolian Baiti",
        "MONO", "Monotype Corsiva", "MoolBoran", "Mrs Eaves", "MS Gothic",
        "MS LineDraw", "MS Mincho", "MS Outlook", "MS PGothic", "MS PMincho",
        "MS Reference Sans Serif", "MS Reference Specialty", "MS Sans Serif",
        "MS Serif", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli", "MYRIAD",
        "MYRIAD PRO", "Nadeem", "Narkisim", "NEVIS", "News Gothic",
        "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid",
        "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century",
        "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN",
        "OSAKA", "OzHandicraft BT", "Palace Script MT", "Palatino",
        "Palatino Linotype", "Papyrus", "Parchment", "Party LET", "Pegasus",
        "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick",
        "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB",
        "Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET",
        "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic",
        "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed",
        "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla",
        "Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold",
        "SCRIPTINA", "Segoe Print", "Segoe Script", "Segoe UI",
        "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol", "Serifa",
        "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood",
        "Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard",
        "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed",
        "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell",
        "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket",
        "Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook",
        "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen",
        "Symbol", "Synchro LET", "System", "Tahoma", "Tamil Sangam MN",
        "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC",
        "Terminal", "Thonburi", "Times", "Times New Roman",
        "Times New Roman PS", "Traditional Arabic", "Trajan", "TRAJAN PRO",
        "Trebuchet MS", "Tristan", "Tubular", "Tunga", "Tw Cen MT",
        "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold",
        "TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium",
        "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Verdana", "Vijaya",
        "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda",
        "Webdings", "Westminster", "WHITNEY", "Wide Latin", "Wingdings",
        "Wingdings 2", "Wingdings 3", "ZapfEllipt BT", "ZapfHumnst BT",
        "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT",
        "ZWAdobeF"];

      var available = [];
      for (var i = 0, l = fontList.length; i < l; i++) {
        if(detect(fontList[i])) {
          available.push(fontList[i]);
        }
      }
      keys.push(available.join(";"));      
      return keys;        
    },
    fontsLengthKey: function(keys) {      
      return String(fontsKey).replace(/[^;]+/g, '').length;
    },      
      
    pluginsKey: function(keys) {
      if(this.isIE()){
        keys.push(this.getIEPluginsString());
      } else {
        keys.push(this.getRegularPluginsString());
      }
      return keys;
    },    
    getRegularPluginsString: function () {
        var pluginsList = "";
        var plL = "";
        for (var i=0; i<navigator.plugins.length; i++) {
                if( i == navigator.plugins.length-1 ) {
                    plL = navigator.plugins[i].name;
                    pluginsList += plL.replace(/[0-9,\.]+/g,'');
                    
                }else{
                    plL = navigator.plugins[i].name;
                    pluginsList += plL.replace(/[0-9,\.]+/g,'') + ", ";                    
                }
        }
        return pluginsList;
    },
    pluginsLengthKey: function(keys) {
      if(!this.options.excludePluginsLegth && navigator.plugins.length) {
        keys.push(navigator.plugins.length);
      } else {
        keys.push("unknown"); 
      }  
      return keys;
    },            
    getIEPluginsString: function () {
      if(window.ActiveXObject){
        var names = [
          "AcroPDF.PDF", // Adobe PDF reader 7+
          "Adodb.Stream",
          "AgControl.AgControl", // Silverlight
          "DevalVRXCtrl.DevalVRXCtrl.1",
          "MacromediaFlashPaper.MacromediaFlashPaper",
          "Msxml2.DOMDocument",
          "Msxml2.XMLHTTP",
          "PDF.PdfCtrl", // Adobe PDF reader 6 and earlier, brrr
          "QuickTime.QuickTime", // QuickTime
          "QuickTimeCheckObject.QuickTimeCheck.1",
          "RealPlayer",
          "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)",
          "RealVideo.RealVideo(tm) ActiveX Control (32-bit)",
          "Scripting.Dictionary",
          "SWCtl.SWCtl", // ShockWave player
          "Shell.UIHelper",
          "ShockwaveFlash.ShockwaveFlash", //flash plugin
          "Skype.Detection",
          "TDCCtl.TDCCtl",
          "WMPlayer.OCX", // Windows media player
          "rmocx.RealPlayer G2 Control",
          "rmocx.RealPlayer G2 Control.1"
        ];        
        return this.map(names, function(name){
          try{
            new ActiveXObject(name);
            return name;
          } catch(e){
            return null;
          }
        }).join(";");
      } else {
        return "";
      }
    },
    //8.TLK----------------------------------------------------------------------------------  
    userlanguageKey: function(keys) {
      if(!this.options.excludeLanguage) {
        keys.push(navigator.language);
      }
      return keys;
    },
    systemlanguageKey: function(keys) {
      if(!this.options.excludeLanguage) {
        keys.push(this.getSystemLanguage());
      }
      return keys;
    },
    timezoneOffsetKey: function(keys) {
      if(!this.options.excludeTimezoneOffset) {
        keys.push(new Date().getTimezoneOffset());
      }
      return keys;
    },     
    //9.DRK----------------------------------------------------------------------------------
    screenResolutionKey: function(keys) {
      if(!this.options.excludeScreenResolution) {
        var resolution = this.getScreenResolution();
        if (typeof resolution !== "undefined"){ 
          keys.push(resolution.join("x"));
        }
      }
      return keys;
    },
    availScreenResolutionKey: function(keys) {
      if(!this.options.excludeScreenResolution) {
        var availresolution = this.getAvailableResolution();
        if (typeof availresolution !== "undefined"){ 
          keys.push(availresolution.join("x"));
        }
      }
      return keys;
    },
    getScreenResolution: function () {
      var resolution;
      if(this.options.detectScreenOrientation) {
        resolution = (screen.height > screen.width) ? [screen.height, screen.width] : [screen.width, screen.height];
      } else {
        resolution = [screen.height, screen.width];
      }
      return resolution;
    },
    getAvailableResolution: function () {
      var availresolution;
      if(this.options.detectScreenOrientation) {
        availresolution = (screen.availHeight > screen.availWidth) ? [screen.availHeight, screen.availWidth] : [screen.availWidth, screen.availHeight];
      } else {
        availresolution = [screen.availHeight, screen.availWidth];
      }
      return availresolution;             
    },        
    //10.DVK---------------------------------------------------------------------------------- 
    browserVersionKey: function(keys) {
      if(!this.options.excludeLanguage) {
        keys.push(this.getBrowserVersion);
      }
      return keys;
    },
      
    javaVersionKey: function(keys) {
      if(!this.options.excludeJava && navigator.javaEnabled()) {
        keys.push(deployJava.getJREs().toString());
      } else {
        keys.push("0");
      }        
      return keys;
    },
        
    silverlightVersionKey: function(keys) {
      if(!this.options.excludeSilverlight && this.hasSilverlightEnabled() && this.getSilverlightVersion()) {
        keys.push("1");
      } else {
        keys.push("0");
      }
      return keys;
    },      
    //?.UAK----------------------------------------------------------------------------------
    userAgentKey: function(keys) {
      if(!this.options.excludeUserAgent) {
        keys.push(navigator.userAgent);
      }
      return keys;
    },  
          
    //Routines----------------------------------------------------------------------------------  
    getDeviceType: function () {
      if(!!navigator.userAgent.match(/(Android|iPad|SCH-I800|xoom|kindle|PlayBook|kindle fire)/i)){
        return "tablet";
      } 
      if (!!navigator.userAgent.match(/(Android.*Mobile|iPhone|iPod|blackberry|bb10|android 0.5|htc|lg|midp|mmp|mobile|nokia|opera mini|palm|pocket|psp|sgh|smartphone|symbian|treo mini|Playstation Portable|SonyEricsson|Samsung|MobileExplorer|PalmSource|rim|Benq|Windows Phone|Windows Mobile|IEMobile|Windows CE|Nintendo Wii)/i)){
        return "phone";
      }
      else {
        return "PC";
      }      
    },
    getDevice: function () {
      if(!!navigator.userAgent.match(/(iPad)/i)){
        return "iPad";
      } 
      if (!!navigator.userAgent.match(/(iPhone)/i)){
        return "iPhone";
      }
        if (!!navigator.userAgent.match(/(iPod)/i)){
        return "iPod";
      }
      else {
        return "unknown";
      }      
    },       
    getBrowser: function () {
      if(!!navigator.userAgent.match(/(Opera)/i)){
        return "Opera";
      } 
      if (!!navigator.userAgent.match(/(MSIE|Trident)/i)){
        return "Microsoft Internet Explorer";
      }
      if (!!navigator.userAgent.match(/(Chrome|CriOS)/i)){
        return "Chrome";
      }
      if (!!navigator.userAgent.match(/(Safari)/i)){
        return "Safari";
      }
      if (!!navigator.userAgent.match(/(Firefox)/i)){
        return "Firefox";
      }
      else {
        return "unknown";
      }      
    },               
    //ToDo       
    getEngine: function () {  
      if(!!navigator.userAgent.match(/(Amaya\/)/i)){
        return "Amaya";
      }
      if(!!navigator.userAgent.match(/(Blink\/)/i)){
        return "Blink";
      }     
      if (!!navigator.userAgent.match(/(Gecko\/)/i)){
        return "Gecko";
      }
      if (!!navigator.userAgent.match(/(iCab\/)/i)){
        return "iCab";
      }
      if (!!navigator.userAgent.match(/(KHTML\/)/i)){
        return "KHTML";
      }
      if (!!navigator.userAgent.match(/(Links\/)/i)){
        return "Links";
      }
      if (!!navigator.userAgent.match(/(Lynx\/)/i)){
        return "Lynx";
      }
      if (!!navigator.userAgent.match(/(NetFront\/)/i)){
        return "NetFront";
      }
      if (!!navigator.userAgent.match(/(NetSurf\/)/i)){
        return "NetSurf";
      }
      if (!!navigator.userAgent.match(/(Presto)/i)){
        return "Presto";
      }
      if (!!navigator.userAgent.match(/(Tasman\/)/i)){
        return "Tasman";
      }
      if (!!navigator.userAgent.match(/(Trident\/)/i)){
        return "Trident";
      }
      if (!!navigator.userAgent.match(/(w3m\/)/i)){
        return "w3m";
      }
      if (!!navigator.userAgent.match(/(WebKit\/)/i)){
        return "WebKit";
      }       
      else {
        return "unknown";
      }      
    },
    //ToDo  
      getEngineVersion: function () {  
      if(browserData.engine.version) {
        return browserData.engine.version;
      } else {
        return "unknown";
      }
    },
    hasFlashEnabled: function () {
      var objPlugin = navigator.plugins["Shockwave Flash"];
      if (objPlugin) {
        return true;
        }
        return false;
    },
    hasSilverlightEnabled: function () {
      var objPlugin = navigator.plugins["Silverlight Plug-In"];
      if (objPlugin) {
        return true;
        }
        return false;
    },
    //ToDo  
    getSilverlightVersion: function () {
      if (this.isSilverlight()) {
        var objPlugin = navigator.plugins["Silverlight Plug-In"];
        return objPlugin.description;
        }
        return "";
    },  
    hasSessionStorage: function () {
      try {
        return !!window.sessionStorage;
      } catch(e) {
        return true; 
      }
    },    
    hasLocalStorage: function () {
      try {
        return !!window.localStorage;
      } catch(e) {
        return true; 
      }
    },
    hasIndexedDB: function (){
      return !!window.indexedDB;
    },
    getNavigatorCpuClass: function () {
      if(navigator.cpuClass){
        return navigator.cpuClass;
      } else {
        return "unknown";
      }
    },
    getNavigatorHardwareConcurrency: function () {
      if(navigator.hardwareConcurrency){
        return navigator.hardwareConcurrency;
      } else {
        return "unknown";
      }
    },      
    getNavigatorPlatform: function () {
      if(navigator.platform) {
        return navigator.platform;
      } else {
        return "unknown";
      }
    },
    getOperatingSystem: function () {
      var nVer = navigator.appVersion;
            var nAgt = navigator.userAgent;
            var osVersion = "unknown";
            var os = "unknown";            
            var clientStrings = [
                { s: 'Windows 3.11', r: /Win16/ },
                { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
                { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
                { s: 'Windows 98', r: /(Windows 98|Win98)/ },
                { s: 'Windows CE', r: /Windows CE/ },
                { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
                { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
                { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
                { s: 'Windows Vista', r: /Windows NT 6.0/ },
                { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
                { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
                { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
                { s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
                { s: 'Windows ME', r: /Windows ME/ },
                { s: 'Android', r: /Android/ },
                { s: 'Open BSD', r: /OpenBSD/ },
                { s: 'Sun OS', r: /SunOS/ },
                { s: 'Linux', r: /(Linux|X11)/ },
                { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
                { s: 'Mac OS X', r: /Mac OS X/ },
                { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
                { s: 'QNX', r: /QNX/ },
                { s: 'UNIX', r: /UNIX/ },
                { s: 'BeOS', r: /BeOS/ },
                { s: 'OS/2', r: /OS\/2/ },
                { s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }
            ];
            for (var id in clientStrings) {
                var cs = clientStrings[id];
                if (cs.r.test(nAgt)) {
                    os = cs.s;
                    break;
                }
            }           

            if (/Windows/.test(os)) {
                osVersion = /Windows (.*)/.exec(os)[1];
                os = 'Windows';
            }
            switch (os) {
                case 'Mac OS X':
                    osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                    break;

                case 'Android':
                    osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                    break;

                case 'iOS':
                    osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                    osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                    break;
            }
        return os;     
    },  
    getNavigatorMaxTouchPoints: function () {
      if(navigator.maxTouchPoints) {
        return navigator.maxTouchPoints;
      } else {
        return "unknown";
      }
    },  
    getSystemLanguage: function () {
      if(navigator.systemLanguage) {
        return navigator.systemLanguage;
      } else {
        return "unknown";
      }
    },  
    getDoNotTrack: function () {
      if(navigator.doNotTrack) {
        return navigator.doNotTrack;
      } else {
        return "unknown";
      }
    },
      
    getCanvasFp: function() {      
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");      
      var txt = "Cwm fjordbank glyphs vext quiz, https://aidentiti.github.io/ ὠ";
      ctx.textBaseline = "top";
      ctx.font = "70px 'Arial'";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText(txt, 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText(txt, 4, 17);
      return canvas.toDataURL();
    },

    getWebglFp: function() {
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
      gl = this.getWebglCanvas();
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
      if (gl.canvas != null) result.push(gl.canvas.toDataURL());
      result.push("extensions:" + gl.getSupportedExtensions().join(";"));
      result.push("webgl aliased line width range:" + fa2s(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)));
      result.push("webgl aliased point size range:" + fa2s(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)));
      result.push("webgl alpha bits:" + gl.getParameter(gl.ALPHA_BITS));
      result.push("webgl antialiasing:" + (gl.getContextAttributes().antialias ? "yes" : "no"));
      result.push("webgl blue bits:" + gl.getParameter(gl.BLUE_BITS));
      result.push("webgl depth bits:" + gl.getParameter(gl.DEPTH_BITS));
      result.push("webgl green bits:" + gl.getParameter(gl.GREEN_BITS));
      result.push("webgl max anisotropy:" + maxAnisotropy(gl));
      result.push("webgl max combined texture image units:" + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
      result.push("webgl max cube map texture size:" + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
      result.push("webgl max fragment uniform vectors:" + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
      result.push("webgl max render buffer size:" + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
      result.push("webgl max texture image units:" + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
      result.push("webgl max texture size:" + gl.getParameter(gl.MAX_TEXTURE_SIZE));
      result.push("webgl max varying vectors:" + gl.getParameter(gl.MAX_VARYING_VECTORS));
      result.push("webgl max vertex attribs:" + gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
      result.push("webgl max vertex texture image units:" + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
      result.push("webgl max vertex uniform vectors:" + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
      result.push("webgl max viewport dims:" + fa2s(gl.getParameter(gl.MAX_VIEWPORT_DIMS)));
      result.push("webgl red bits:" + gl.getParameter(gl.RED_BITS));
      result.push("webgl renderer:" + gl.getParameter(gl.RENDERER));
      result.push("webgl shading language version:" + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
      result.push("webgl stencil bits:" + gl.getParameter(gl.STENCIL_BITS));
      result.push("webgl vendor:" + gl.getParameter(gl.VENDOR));
      result.push("webgl version:" + gl.getParameter(gl.VERSION));
      //TODO: implement vertex shader & fragment shader precision
      return result.join("§");
    },
    isCanvasSupported: function () {
      var elem = document.createElement("canvas");
      return !!(elem.getContext && elem.getContext("2d"));
    },
    isIE: function () {
      if(navigator.appName === "Microsoft Internet Explorer") {
        return true;
      } else if(navigator.appName === "Netscape" && /Trident/.test(navigator.userAgent)) { // IE 11
        return true;
      }
      return false;
    },
    hasSwfObjectLoaded: function(){
      return typeof window.swfobject !== "undefined";
    },
    hasMinFlashInstalled: function () {
      return swfobject.hasFlashPlayerVersion("9.0.0");
    },
    addFlashDivNode: function() {
      var node = document.createElement("div");
      node.setAttribute("id", this.options.swfContainerId);
      document.body.appendChild(node);
    },
    loadSwfAndDetectFonts: function(done) {
      var hiddenCallback = "___fp_swf_loaded";
      window[hiddenCallback] = function(fonts) {
        done(fonts);
      };
      var id = this.options.swfContainerId;
      this.addFlashDivNode();
      var flashvars = { onReady: hiddenCallback};
      var flashparams = { allowScriptAccess: "always", menu: "false" };
      swfobject.embedSWF(this.options.swfPath, id, "1", "1", "9.0.0", false, flashvars, flashparams, {});
    },
    getWebglCanvas: function() {
      var canvas = document.createElement("canvas");
      var gl = null;
      try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      } catch(e) {}
      if(!gl){gl = null;}
      return gl;
    },
    each: function (obj, iterator, context) {
      if (obj === null) {
        return;
      }
      if (this.nativeForEach && obj.forEach === this.nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (iterator.call(context, obj[i], i, obj) === {}) { return; }
        }
      } else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (iterator.call(context, obj[key], key, obj) === {}) { return; }
          }
        }
      }
    },

    map: function(obj, iterator, context) {
      var results = [];      
      if (obj == null) { return results; }
      if (this.nativeMap && obj.map === this.nativeMap) { return obj.map(iterator, context); }
      this.each(obj, function(value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
      });
      return results;
    },

    /// MurmurHash3 related functions
    
    x64Add: function(m, n) {
      m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
      n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
      var o = [0, 0, 0, 0];
      o[3] += m[3] + n[3];
      o[2] += o[3] >>> 16;
      o[3] &= 0xffff;
      o[2] += m[2] + n[2];
      o[1] += o[2] >>> 16;
      o[2] &= 0xffff;
      o[1] += m[1] + n[1];
      o[0] += o[1] >>> 16;
      o[1] &= 0xffff;
      o[0] += m[0] + n[0];
      o[0] &= 0xffff;
      return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    },
    
    x64Multiply: function(m, n) {
      m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
      n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
      var o = [0, 0, 0, 0];
      o[3] += m[3] * n[3];
      o[2] += o[3] >>> 16;
      o[3] &= 0xffff;
      o[2] += m[2] * n[3];
      o[1] += o[2] >>> 16;
      o[2] &= 0xffff;
      o[2] += m[3] * n[2];
      o[1] += o[2] >>> 16;
      o[2] &= 0xffff;
      o[1] += m[1] * n[3];
      o[0] += o[1] >>> 16;
      o[1] &= 0xffff;
      o[1] += m[2] * n[2];
      o[0] += o[1] >>> 16;
      o[1] &= 0xffff;
      o[1] += m[3] * n[1];
      o[0] += o[1] >>> 16;
      o[1] &= 0xffff;
      o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
      o[0] &= 0xffff;
      return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
    },
    
    x64Rotl: function(m, n) {
      n %= 64;
      if (n === 32) {
        return [m[1], m[0]];
      }
      else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
      }
      else {
        n -= 32;
        return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
      }
    },
    
    x64LeftShift: function(m, n) {
      n %= 64;
      if (n === 0) {
        return m;
      }
      else if (n < 32) {
        return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
      }
      else {
        return [m[1] << (n - 32), 0];
      }
    },
    
    x64Xor: function(m, n) {
      return [m[0] ^ n[0], m[1] ^ n[1]];
    },
    
    x64Fmix: function(h) {
      h = this.x64Xor(h, [0, h[0] >>> 1]);
      h = this.x64Multiply(h, [0xff51afd7, 0xed558ccd]);
      h = this.x64Xor(h, [0, h[0] >>> 1]);
      h = this.x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
      h = this.x64Xor(h, [0, h[0] >>> 1]);
      return h;
    },
    
    x64hash128: function (key, seed) {
      key = key || "";
      seed = seed || 0;
      var remainder = key.length % 16;
      var bytes = key.length - remainder;
      var h1 = [0, seed];
      var h2 = [0, seed];
      var k1 = [0, 0];
      var k2 = [0, 0];
      var c1 = [0x87c37b91, 0x114253d5];
      var c2 = [0x4cf5ad43, 0x2745937f];
      for (var i = 0; i < bytes; i = i + 16) {
        k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)];
        k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)];
        k1 = this.x64Multiply(k1, c1);
        k1 = this.x64Rotl(k1, 31);
        k1 = this.x64Multiply(k1, c2);
        h1 = this.x64Xor(h1, k1);
        h1 = this.x64Rotl(h1, 27);
        h1 = this.x64Add(h1, h2);
        h1 = this.x64Add(this.x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
        k2 = this.x64Multiply(k2, c2);
        k2 = this.x64Rotl(k2, 33);
        k2 = this.x64Multiply(k2, c1);
        h2 = this.x64Xor(h2, k2);
        h2 = this.x64Rotl(h2, 31);
        h2 = this.x64Add(h2, h1);
        h2 = this.x64Add(this.x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
      }
      k1 = [0, 0];
      k2 = [0, 0];
      switch(remainder) {
        case 15:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 14)], 48));
        case 14:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 13)], 40));
        case 13:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 12)], 32));
        case 12:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 11)], 24));
        case 11:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 10)], 16));
        case 10:
          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 9)], 8));
        case 9:
          k2 = this.x64Xor(k2, [0, key.charCodeAt(i + 8)]);
          k2 = this.x64Multiply(k2, c2);
          k2 = this.x64Rotl(k2, 33);
          k2 = this.x64Multiply(k2, c1);
          h2 = this.x64Xor(h2, k2);
        case 8:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 7)], 56));
        case 7:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 6)], 48));
        case 6:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 5)], 40));
        case 5:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 4)], 32));
        case 4:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 3)], 24));
        case 3:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 2)], 16));
        case 2:
          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 1)], 8));
        case 1:
          k1 = this.x64Xor(k1, [0, key.charCodeAt(i)]);
          k1 = this.x64Multiply(k1, c1);
          k1 = this.x64Rotl(k1, 31);
          k1 = this.x64Multiply(k1, c2);
          h1 = this.x64Xor(h1, k1);
      }
      h1 = this.x64Xor(h1, [0, key.length]);
      h2 = this.x64Xor(h2, [0, key.length]);
      h1 = this.x64Add(h1, h2);
      h2 = this.x64Add(h2, h1);
      h1 = this.x64Fmix(h1);
      h2 = this.x64Fmix(h2);
      h1 = this.x64Add(h1, h2);
      h2 = this.x64Add(h2, h1);
      return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
    }
  };
  return DF;
});