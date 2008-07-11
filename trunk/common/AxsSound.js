// Copyright 2008 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview AxsSound - JavaScript library for playing sound from a URL.
 * This library uses SoundManager2 (http://www.schillmania.com/projects/soundmanager2/).
 * @author clchen@google.com (Charles L. Chen)
 */

/**
 * Class for playing sound from a URL.
 * @constructor
 */
var AxsSound = function(earconsOnly){
  this.earconsSwf = 'http://google-axsjax.googlecode.com/svn/trunk/common/earcons/axsEarcons.swf?sound=';
  this.earconsObj = null;
  this.earconsOnly = earconsOnly;
  this.sm2BaseURL = 'http://google-axsjax.googlecode.com/svn/trunk/thirdparty/soundmanager2/';
  this.sm2LinkerFrame = null;
  this.initSucceeded = false;
  this.verbosity = 'minimal';
  this.busyInitializing = false;
  this.initChecks = 0;
};


// Verbosity can be:
// "verbose", "minimal" or "none"
AxsSound.prototype.setVerbosity = function(verbosity){
  this.verbosity = verbosity;
};

AxsSound.prototype.init = function(){
  //Earcons do not need initialization
  if (this.earconsOnly){
    return;
  }
  if (this.initSucceeded){
    return;
  }	
  if (this.busyInitializing){
    return;
  }
  this.busyInitializing = true;
  this.initChecks = 0;
  if (this.sm2LinkerFrame !== null){
    this.sm2LinkerFrame.parentNode.removeChild(this.sm2LinkerFrame);
	this.sm2LinkerFrame = null;
  }
  this.sm2LinkerFrame = document.createElement('iframe');
  var loc = document.location.toString();
  if (loc.indexOf('#') != -1){
    loc = loc.substring(0,loc.indexOf('#'));
  }
  this.sm2LinkerFrame.src = this.sm2BaseURL + 'AxsJAX_SM2_Linker.html' + '#Verbosity=' + this.verbosity + ',Parent=' + loc;
  this.sm2LinkerFrame.width = '0%';
  this.sm2LinkerFrame.height = '0%';
  this.sm2LinkerFrame.style.top = '-1000';
  this.sm2LinkerFrame.style.left = '-1000';
  this.sm2LinkerFrame.style.position = 'absolute';
  document.getElementsByTagName('body')[0].appendChild(this.sm2LinkerFrame);  
  this.checkInitStatus();
};

AxsSound.prototype.checkInitStatus = function(){
  if (document.location.hash == '#InitSuccess'){
    this.initSucceeded = true;
	this.busyInitializing = false;
	return;	
  }
  if ((this.verbosity == 'none') && (this.initChecks > 0)){
    this.initSucceeded = true;
	this.busyInitializing = false;
	return;	  
  }
  var self = this;
  window.setTimeout(function(){self.checkInitStatus();},100);
  this.initChecks++;
};

AxsSound.prototype.play = function(url){
  var playedEarcon = this.playEarcon(url);
  if (this.earconsOnly || playedEarcon){
    return;
  }
  if (!this.initSucceeded){
    this.init();
	var self = this;
    window.setTimeout(function(){self.play(url);},500);
	return;
  }
  this.sm2LinkerFrame.src = this.sm2BaseURL + 'AxsJAX_SM2_Linker.html' + '#AxsSoundCmd=Play(' + url + ')'; 
};

AxsSound.prototype.playSeg = function(url,startTime,endTime){
  var playedEarcon = this.playEarcon(url);
  if (this.earconsOnly || playedEarcon){
    return;
  }
  if (!this.initSucceeded){
    this.init();
	var self = this;
    window.setTimeout(function(){self.playSeg(url,startTime,endTime);},500);
	return;
  }
  this.sm2LinkerFrame.src = this.sm2BaseURL + 'AxsJAX_SM2_Linker.html' + '#AxsSoundCmd=PlaySeg(' + url + ',' + startTime + ',' + endTime + ')'; 
};

AxsSound.prototype.stop = function(){
  if (this.earconsObj){
    this.earconsObj.parentNode.removeChild(this.earconsObj);
	this.earconsObj = null;
  }
  if (this.earconsOnly){
    return;
  }
  if (!this.initSucceeded){
	return;
  }
  this.sm2LinkerFrame.src = this.sm2BaseURL + 'AxsJAX_SM2_Linker.html' + '#AxsSoundCmd=Stop()';  
};

AxsSound.prototype.getTime = function(){
  if (this.earconsOnly){
    return -1;
  }
  if (!this.initSucceeded){
	return -1;
  }
  var timeKeyword = 'Time=';
  var timeStr = unescape(document.location.hash);
  if (timeStr.indexOf(timeKeyword) == -1){
	return -1;  
  }
  var timeStart = timeStr.indexOf(timeKeyword) + timeKeyword.length;
  var time = parseInt(timeStr.substring(timeStart),10);
  return time;
};

AxsSound.prototype.isPlaying = function(){
  if (this.getTime() == -1){
    return false;
  }
  return true;
};


AxsSound.prototype.playEarcon = function(earcon){
  var earconCMD = '';
  switch (earcon){
    case 'alert':
      earconCMD = 'alert';
      break;
    case 'deselect':
      earconCMD = 'deselect';
      break;
    case 'item':
      earconCMD = 'item';
      break;
    case 'list':
      earconCMD = 'list';
      break;
    case 'select':
      earconCMD = 'select';
      break;
    case 'success':
      earconCMD = 'success';
      break;
    case 'wrap':
      earconCMD = 'wrap';
      break;
    default:
  }
  if (earconCMD === ''){
    return false;
  }
  if (this.earconsObj === null){
    this.earconsObj = document.createElement('embed');
    this.earconsObj.height = 0;
    this.earconsObj.width = 0;	
	document.body.appendChild(this.earconsObj);
  }
  this.earconsObj.src = this.earconsSwf + earconCMD;
};