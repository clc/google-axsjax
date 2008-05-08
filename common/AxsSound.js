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
var AxsSound = function(){
  this.sm2BaseURL = 'http://google-axsjax.googlecode.com/svn/trunk/thirdparty/soundmanager2/';
  this.sm2LinkerFrame = null;
};

AxsSound.prototype.init = function(){
  this.sm2LinkerFrame = document.createElement('iframe');
  this.sm2LinkerFrame.src = this.sm2BaseURL + 'AxsJAX_SM2_Linker.html' + '#Parent=' + document.location.toString();
  this.sm2LinkerFrame.width = '0%';
  this.sm2LinkerFrame.height = '0%';
  this.sm2LinkerFrame.style.top = '-1000';
  this.sm2LinkerFrame.style.left = '-1000';
  this.sm2LinkerFrame.style.position = 'absolute';
  document.getElementsByTagName('body')[0].appendChild(this.sm2LinkerFrame);   
};

AxsSound.prototype.play = function(url){
  if (this.sm2LinkerFrame === null){
    this.init();
	var self = this;
    window.setTimeout(function(){self.play(url);},500);
	return;
  }
  this.sm2LinkerFrame.src = this.sm2BaseURL + 'AxsJAX_SM2_Linker.html' + '#AxsSoundCmd=Play(' + url + ')'; 
};

AxsSound.prototype.playSeg = function(url,startTime,endTime){
  if (this.sm2LinkerFrame === null){
    this.init();
	var self = this;
    window.setTimeout(function(){self.playSeg(url,startTime,endTime);},500);
	return;
  }
  this.sm2LinkerFrame.src = this.sm2BaseURL + 'AxsJAX_SM2_Linker.html' + '#AxsSoundCmd=PlaySeg(' + url + ',' + startTime + ',' + endTime + ')'; 
};

AxsSound.prototype.stop = function(){
  if (this.sm2LinkerFrame === null){
	return;
  }
  this.sm2LinkerFrame.src = this.sm2BaseURL + 'AxsJAX_SM2_Linker.html' + '#AxsSoundCmd=Stop()';  
};

AxsSound.prototype.getTime = function(){
  if (this.sm2LinkerFrame === null){
	return -1;
  }
  var timeKeyword = 'Time=';
  var timeStr = unescape(document.location.hash);
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