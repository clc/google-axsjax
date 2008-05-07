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
 * @param {Object} axsJAXObj  An instance of an AxsJAX object.
 * @constructor
 */
var AxsSound = function(axsJAXObj){
  this.sm2BaseURL = 'http://google-axsjax.googlecode.com/svn/trunk/thirdparty/soundmanager2/';
  this.axsJAXObj = axsJAXObj;
  this.sm2LinkerFrame = null;
};

AxsSound.prototype.init = function(){
  var activeDoc = this.axsJAXObj.getActiveDocument();
  this.sm2LinkerFrame = activeDoc.createElement('iframe');
  this.sm2LinkerFrame.src = this.sm2BaseURL + 'AxsJAX_SM2_Linker.html';
  this.sm2LinkerFrame.width = '0%';
  this.sm2LinkerFrame.height = '0%';
  this.sm2LinkerFrame.style.top = '-1000';
  this.sm2LinkerFrame.style.left = '-1000';
  this.sm2LinkerFrame.style.position = 'absolute';
  activeDoc.getElementsByTagName('body')[0].appendChild(this.sm2LinkerFrame);    
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

AxsSound.prototype.stop = function(){
  if (this.sm2LinkerFrame === null){
	return;
  }
  this.sm2LinkerFrame.src = this.sm2BaseURL + 'AxsJAX_SM2_Linker.html' + '#AxsSoundCmd=Stop()';  
};