/*

  SoundManager 2 Demo: "Page as playlist"
  ----------------------------------------------

  http://schillmania.com/projects/soundmanager2/

  An example of a Muxtape.com-style UI, where an
  unordered list of MP3 links becomes a playlist

  Requires SoundManager 2 Javascript API.

*/

function PagePlayer() {
  var self = this;
  var pl = this;
  var sm = soundManager;   // soundManager instance

  this.config = {
    useThrottling: false,  // try to rate-limit potentially-expensive calls (eg. dragging position around)
    playNext: true,        // stop after one sound, or play through list until end
    updatePageTitle: true, // change the page title while playing sounds
    emptyTime: '-:--'      // null/undefined timer values (before data is available)
  }

  this.css = {             // CSS class names appended to link during various states
    sDefault: 'sm2_link',  // default state
    sLoading: 'sm2_loading',
    sPlaying: 'sm2_playing',
    sPaused: 'sm2_paused'
  }

  this.links = [];
  this.sounds = [];
  this.soundsByURL = [];
  this.lastSound = null;
  this.soundCount = 0;
  this.strings = [];
  this.dragActive = false;
  this.dragExec = new Date();
  this.dragTimer = null;
  this.pageTitle = document.title;

  this.oControls = document.getElementById('control-template').cloneNode(true);
  this.oControls.id = '';

  this.addEventHandler = function(o,evtName,evtHandler) {
    typeof(attachEvent)=='undefined'?o.addEventListener(evtName,evtHandler,false):o.attachEvent('on'+evtName,evtHandler);
  }

  this.removeEventHandler = function(o,evtName,evtHandler) {
    typeof(attachEvent)=='undefined'?o.removeEventListener(evtName,evtHandler,false):o.detachEvent('on'+evtName,evtHandler);
  }

  this.hasClass = function(o,cStr) {
    return (typeof(o.className)!='undefined'?o.className.indexOf(cStr)+1:false);
  }

  this.addClass = function(o,cStr) {
    if (!o || !cStr) return false; // safety net
    if (self.hasClass(o,cStr)) return false;
    o.className = (o.className?o.className+' ':'')+cStr;
  }

  this.removeClass = function(o,cStr) {
    if (!o || !cStr) return false; // safety net
    if (!self.hasClass(o,cStr)) return false;
    o.className = o.className.replace(new RegExp('( '+cStr+')|('+cStr+')','g'),'');
  }

  this.getElementsByClassName = function(className,tagNames,oParent) {
    var doc = (oParent||document);
    var matches = [];
    var i,j;
    var nodes = [];
    if (typeof(tagNames)!='undefined' && typeof(tagNames)!='string') {
      for (i=tagNames.length; i--;) {
        if (!nodes || !nodes[tagNames[i]]) {
          nodes[tagNames[i]] = doc.getElementsByTagName(tagNames[i]);
        }
      }
    } else if (tagNames) {
      nodes = doc.getElementsByTagName(tagNames);
    } else {
      nodes = doc.all||doc.getElementsByTagName('*');
    }
    if (typeof(tagNames)!='string') {
      for (i=tagNames.length; i--;) {
        for (j=nodes[tagNames[i]].length; j--;) {
          if (self.hasClass(nodes[tagNames[i]][j],className)) {
            matches[matches.length] = nodes[tagNames[i]][j];
          }
        }
      }
    } else {
      for (i=0; i<nodes.length; i++) {
        if (self.hasClass(nodes[i],className)) {
          matches[matches.length] = nodes[i];
        }
      }
    }
    return matches;
  }
  
  this.getOffX = function(o) {
    // http://www.xs4all.nl/~ppk/js/findpos.html
    var curleft = 0;
    if (o.offsetParent) {
      while (o.offsetParent) {
        curleft += o.offsetLeft;
        o = o.offsetParent;
      }
    }
    else if (o.x) curleft += o.x;
    return curleft;
  }
  
  this.getTime = function(nMSec,bAsString) {
    // convert milliseconds to mm:ss, return as object literal or string
    var nSec = Math.floor(nMSec/1000);
    var min = Math.floor(nSec/60);
    var sec = nSec-(min*60);
    // if (min == 0 && sec == 0) return null; // return 0:00 as null
    return (bAsString?(min+':'+(sec<10?'0'+sec:sec)):{'min':min,'sec':sec});
  }

  this.getSoundByURL = function(sURL) {
    return (typeof self.soundsByURL[sURL] != 'undefined'?self.soundsByURL[sURL]:null);
  }

  this.getSoundIndex = function(sURL) {
    for (var i=self.links.length; i--;) {
      if (self.links[i].href == sURL) return i;
    }
    return -1;
  }

  this.setPageTitle = function(sTitle) {
    if (!self.config.updatePageTitle) return false;
    try {
      document.title = (sTitle?sTitle+' - ':'')+self.pageTitle;
    } catch(e) {
      // oh well
      self.setPageTitle = function() {return false;}
    }
  }

  this.events = {

    // handlers for sound events as they're started/stopped/played

    play: function() {
      pl.removeClass(this._data.oLI,this._data.className);
      this._data.className = pl.css.sPlaying;
      pl.addClass(this._data.oLI,this._data.className);
      self.setPageTitle(this._data.oLink.innerHTML);
    },

    stop: function() {
      pl.removeClass(this._data.oLI,this._data.className);
      this._data.className = '';
      this._data.oPosition.style.width = '0px';
      self.setPageTitle();
    },

    pause: function() {
      pl.removeClass(this._data.oLI,this._data.className);
      this._data.className = pl.css.sPaused;
      pl.addClass(this._data.oLI,this._data.className);
      self.setPageTitle();
    },

    finish: function() {
      pl.removeClass(this._data.oLI,this._data.className);
      this._data.className = '';
      this._data.oPosition.style.width = '0px';
      // play next if applicable
      if (self.config.playNext && this._data.nIndex<pl.links.length-1) {
        pl.handleClick({target:pl.links[this._data.nIndex+1]}); // fake a click event - aren't we sneaky. ;)
      } else {
        self.setPageTitle();
      }
    },

    whileloading: function() {
      this._data.oLoading.style.width = (((this.bytesLoaded/this.bytesTotal)*100)+'%'); // theoretically, this should work.
    },

    onload: function() {
	  if (!this.loaded) {
		var oTemp = this._data.oLI.getElementsByTagName('a')[0];
		var oString = oTemp.innerHTML;
		var oThis = this;
		oTemp.innerHTML = oString+' <span style="font-size:0.5em"> | Load failed, d\'oh! '+(sm.sandbox.noRemote?' Possible cause: Flash sandbox is denying remote URL access.':(sm.sandbox.noLocal?'Flash denying local filesystem access':'404?'))+'</span>';
		setTimeout(function(){
		  oTemp.innerHTML = oString;
		  // pl.events.finish.apply(oThis); // load next
		},5000);
	  }
    },

    whileplaying: function() {
      this._data.oPosition.style.width = (((this.position/this.durationEstimate)*100)+'%');
      self.updateTime.apply(this);
    }
	
  }
  
  this.updateTime = function() {
    var str = self.strings['timing'].replace('%s1',self.getTime(this.position,true));
    str = str.replace('%s2',self.getTime(this.durationEstimate,true));
    this._data.oTiming.innerHTML = str;
  }

  this.getTheDamnTarget = function(e) {
    return (e.target||e.srcElement||window.event.srcElement);
  }
  
  this.withinStatusBar = function(o) {
    return (o.className && (self.hasClass(o,'statusbar')||self.hasClass(o,'loading')||self.hasClass(o,'position')));
  }

  this.handleClick = function(e) {
    // a sound (or something) was clicked - determine what and handle appropriately
    var o = self.getTheDamnTarget(e);
    if (self.dragActive) self.stopDrag(); // to be safe
    if (self.withinStatusBar(o)) {
      self.handleStatusClick(e);
      return false;
    }
    var sURL = o.getAttribute('href');
    if (!o.href || !o.href.match(/.mp3$/i)) return true; // pass-thru for non-MP3/non-links
    sm._writeDebug('handleClick()');
    var soundURL = (o.href);
    var thisSound = self.getSoundByURL(soundURL);
    sm._writeDebug('click: thisSound:'+thisSound);
    if (thisSound) {
      // sound already exists
      sm._writeDebug('sound exists');
      self.setPageTitle(thisSound._data.oLink.innerHTML);
      if (thisSound == self.lastSound) {
        // ..and was playing (or paused) and isn't in an error state
		if (thisSound.readyState != 2) {
          sm._writeDebug('toggling pause');
          thisSound.togglePause();
		  if (thisSound.paused) {
		    self.events.pause.apply(thisSound);
		  } else {
		    self.events.play.apply(thisSound);
		  }
		} else {
		  sm._writeDebug('Warning: sound failed to load (security restrictions or 404)',2);
		}
      } else {
        // ..different sound
        sm._writeDebug('sound different than last sound: '+self.lastSound.sID);
        if (self.lastSound) self.stopSound(self.lastSound);
        thisSound.togglePause(); // start playing current
      }
    } else {
      // create sound
      thisSound = sm.createSound({
        id:'mp3Sound'+(self.soundCount++),
        url:soundURL,
        onplay:self.events.play,
        onstop:self.events.stop,
        // onpause:self.events.pause, // oops, not (yet) implemented. :D
        onfinish:self.events.finish,
        whileloading:self.events.whileloading,
        whileplaying:self.events.whileplaying,
        onload:self.events.onload
      });
      // append control template
      var oControls = self.oControls.cloneNode(true);
      o.parentNode.appendChild(oControls);
      self.soundsByURL[soundURL] = thisSound;
      // tack on some custom data
      thisSound._data = {
        oLink: o, // DOM reference within SM2 object event handlers
        oLI: o.parentNode,
        oLoading: self.getElementsByClassName('loading','div',o.parentNode)[0],
        oPosition: self.getElementsByClassName('position','div',o.parentNode)[0],
        oTiming: self.getElementsByClassName('timing','div',o.parentNode)[0].getElementsByTagName('div')[0],
        nIndex: self.getSoundIndex(soundURL),
        className: self.css.sPlaying
      };
      // set initial timer stuff (before loading)
      var str = self.strings['timing'].replace('%s1',self.config.emptyTime);
      str = str.replace('%s2',self.config.emptyTime);
      thisSound._data.oTiming.innerHTML = str;
      self.sounds.push(thisSound);
      if (self.lastSound) self.stopSound(self.lastSound);
      thisSound.play();
    }
    self.lastSound = thisSound; // reference for next call
    return self.stopEvent(e);
  }
  
  this.handleMouseDown = function(e) {
    // a sound link was clicked
    var o = self.getTheDamnTarget(e);
    if (!self.withinStatusBar(o)) return true;
    self.setPosition(e);
    self.addEventHandler(document,'mousemove',self.handleMouseMove);
    self.dragActive = true;
    self.addEventHandler(document,'mouseup',self.stopDrag);
    self.stopEvent(e);
    return false;
  }
  
  this.handleMouseMove = function(e) {
    // set position accordingly
    if (self.dragActive) {
      if (self.config.useThrottling) {
        // be nice to CPU/externalInterface
        var d = new Date();
        if (d-self.dragExec>20) {
          self.setPosition(e);
        } else {
          window.clearTimeout(self.dragTimer);
          self.dragTimer = window.setTimeout(function(){self.setPosition(e)},20);
        }
        self.dragExec = d;
      } else {
        // oh the hell with it
        self.setPosition(e);
      }
    } else {
      self.stopDrag();
    }
	return false;
  }
  
  this.handleMouseUp = function(e) {
    // a sound link was clicked
    var o = self.getTheDamnTarget(e);
  }
  
  this.stopDrag = function(e) {
    if (self.dragActive) {
      self.dragActive = false;
      self.removeEventHandler(document,'mousemove',self.handleMouseMove);
      self.removeEventHandler(document,'mouseup',self.handleMouseMove);
      self.stopEvent(e);
      return false;
    }
  }
  
  this.handleStatusClick = function(e) {
    self.setPosition(e);
    return self.stopEvent(e);
  }
  
  this.stopEvent = function(e) {
   if (typeof e != 'undefined' && typeof e.preventDefault != 'undefined') {
      e.preventDefault();
    } else if (typeof event != 'undefined' && typeof event.returnValue != 'undefined') {
      event.returnValue = false;
    }
    return false;
  }
 
  this.setPosition = function(e) {
    // called from slider control
    var oThis = self.getTheDamnTarget(e);
    var oControl = oThis;
    while (!self.hasClass(oControl,'controls') && oControl.parentNode) {
      oControl = oControl.parentNode;
    }
    var oSound = self.lastSound;
    var x = parseInt(e.clientX);
    // play sound at this position
    var nMsecOffset = Math.floor((x-self.getOffX(oControl)-4)/(oControl.offsetWidth)*oSound.durationEstimate);
    if (!isNaN(nMsecOffset)) oSound.setPosition(nMsecOffset);
  }

  this.stopSound = function(oSound) {
    sm._writeDebug('stopping sound: '+oSound.sID);
    soundManager.stop(oSound.sID);
    soundManager.unload(oSound.sID);
  }

  this.init = function() {
    sm._writeDebug('pagePlayer.init()');
    var oLinks = document.getElementsByTagName('a');
    // grab all links, look for .mp3
    var foundItems = 0;
    for (var i=0; i<oLinks.length; i++) {
      if (oLinks[i].href.match(/.mp3$/i)) {
        self.links[self.links.length] = oLinks[i];
        self.addClass(oLinks[i],self.css.sDefault); // add default CSS decoration
        foundItems++;
      }
    }
    if (foundItems>0) {
      var oTiming = document.getElementById('sm2_timing');
      self.strings['timing'] = oTiming.innerHTML;
      oTiming.innerHTML = '';
      oTiming.id = '';
      self.addEventHandler(document,'click',self.handleClick);
      self.addEventHandler(document,'mousedown',self.handleMouseDown);
    }
    sm._writeDebug('pagePlayer.init(): Found '+foundItems+' relevant items.');
  }

  this.init();

}

var pagePlayer = null;

soundManager.debugMode = (window.location.href.toString().match(/debug=1/i)?true:false); // enable with #debug=1 for example

soundManager.url = '../../soundmanager2.swf'; // path to movie

soundManager.onload = function() {
  // soundManager.createSound() etc. may now be called
  pagePlayer = new PagePlayer();
}