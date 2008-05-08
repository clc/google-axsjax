/*

  SoundManager 2 Demo: Play MP3 links "in-place"
  ----------------------------------------------

  http://schillmania.com/projects/soundmanager2/

  A simple demo making MP3s playable "inline"
  and easily styled/customizable via CSS.

  Requires SoundManager 2 Javascript API.

*/

function InlinePlayer() {
  var self = this;
  var pl = this;
  var sm = soundManager; // soundManager instance
  this.links = [];
  this.sounds = [];
  this.soundsByURL = [];
  this.lastSound = null;
  this.soundCount = 0;

  this.css = {
    // CSS class names appended to link during various states
    sDefault: 'sm2_link', // default state
    sLoading: 'sm2_loading',
    sPlaying: 'sm2_playing',
    sPaused: 'sm2_paused'
  }

  this.addEventHandler = function(o,evtName,evtHandler) {
    typeof(attachEvent)=='undefined'?o.addEventListener(evtName,evtHandler,false):o.attachEvent('on'+evtName,evtHandler);
  }

  this.removeEventHandler = function(o,evtName,evtHandler) {
    typeof(attachEvent)=='undefined'?o.removeEventListener(evtName,evtHandler,false):o.detachEvent('on'+evtName,evtHandler);
  }

  this.classContains = function(o,cStr) {
    return (typeof(o.className)!='undefined'?o.className.indexOf(cStr)+1:false);
  }

  this.addClass = function(o,cStr) {
    if (!o || !cStr) return false; // safety net
    if (self.classContains(o,cStr)) return false;
    o.className = (o.className?o.className+' ':'')+cStr;
  }

  this.removeClass = function(o,cStr) {
    if (!o || !cStr) return false; // safety net
    if (!self.classContains(o,cStr)) return false;
    o.className = o.className.replace(new RegExp('( '+cStr+')|('+cStr+')','g'),'');
  }

  this.getSoundByURL = function(sURL) {
    return (typeof self.soundsByURL[sURL] != 'undefined'?self.soundsByURL[sURL]:null);
  }

  this.events = {

    // handlers for sound events as they're started/stopped/played

    play: function() {
      pl.removeClass(this._data.oLink,this._data.className);
      this._data.className = pl.css.sPlaying;
      pl.addClass(this._data.oLink,this._data.className);
    },

    stop: function() {
      pl.removeClass(this._data.oLink,this._data.className);
      this._data.className = '';
    },

    pause: function() {
      pl.removeClass(this._data.oLink,this._data.className);
      this._data.className = pl.css.sPaused;
      pl.addClass(this._data.oLink,this._data.className);
    },

    finish: function() {
      pl.removeClass(this._data.oLink,this._data.className);
      this._data.className = '';
    }

  }

  this.getTheDamnLink = (navigator.userAgent.match(/MSIE/i))?function() {
    // I really didn't want to have to do this.
    return window.event.srcElement;
  }:function(e) {
    return e.target;
  }

  this.handleClick = function(e) {
    // a sound link was clicked
    var o = self.getTheDamnLink(e); // (e&&(!navigator.userAgent.match(/MSIE/i))?e.target:window.event.srcElement); 
    var sURL = o.getAttribute('href');
    if (!o.href || !o.href.match(/.mp3$/i)) return true; // pass-thru for non-MP3/non-links
    sm._writeDebug('handleClick()');
    var soundURL = (o.href);
    var thisSound = self.getSoundByURL(soundURL);
    sm._writeDebug('click: thisSound:'+thisSound);
    if (thisSound) {
      // already exists
      sm._writeDebug('sound exists');
      if (thisSound == self.lastSound) {
        // and was playing (or paused)
        sm._writeDebug('toggling pause');
        thisSound.togglePause();
      } else {
        // different sound
        thisSound.togglePause(); // start playing current
        sm._writeDebug('sound different than last sound: '+self.lastSound.sID);
        if (self.lastSound) self.stopSound(self.lastSound);
      }
    } else {
      // create sound
      thisSound = sm.createSound({id:'mp3Sound'+(self.soundCount++),url:soundURL,onplay:self.events.play,onstop:self.events.stop,onpause:self.events.pause,onfinish:self.events.finish});
      // tack on some custom data
      thisSound._data = {
        oLink: o, // DOM node for reference within SM2 object event handlers
        className: self.css.sPlaying
      };
      self.soundsByURL[soundURL] = thisSound;
      self.sounds.push(thisSound);
      if (self.lastSound) self.stopSound(self.lastSound);
      thisSound.play();
      // stop last sound
    }

    self.lastSound = thisSound; // reference for next call

    if (typeof e != 'undefined' && typeof e.preventDefault != 'undefined') {
      e.preventDefault();
    } else {
      event.returnValue = false;
    }
    return false;
  }

  this.stopSound = function(oSound) {
    sm._writeDebug('stopping sound: '+oSound.sID);
    soundManager.stop(oSound.sID);
    soundManager.unload(oSound.sID);
  }

  this.init = function() {
    sm._writeDebug('inlinePlayer.init()');
    var oLinks = document.getElementsByTagName('a');
    // grab all links, look for .mp3
    var foundItems = 0;
    for (var i=0; i<oLinks.length; i++) {
      if (oLinks[i].href.match(/.mp3$/i)) {
        self.addClass(oLinks[i],self.css.sDefault); // add default CSS decoration
        foundItems++;
      }
    }
    if (foundItems>0) {
      self.addEventHandler(document,'click',self.handleClick);
    }
    sm._writeDebug('inlinePlayer.init(): Found '+foundItems+' relevant items.');
  }

  this.init();

}

var inlinePlayer = null;

soundManager.debugMode = true; // disable or enable debug output

soundManager.url = '../../soundmanager2.swf'; // path to movie

soundManager.onload = function() {
  // soundManager.createSound() etc. may now be called
  inlinePlayer = new InlinePlayer();
}

