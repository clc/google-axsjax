// Copyright 2007 Google Inc.
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

// ==UserScript==
// @name          Google Reader Accessibility Improvement
// @namespace     http://www.google.com/accessible/
// @description   Uses WAI-ARIA live regions to enhance Google Reader accessibility in Fire Vox.
// @include       http://www.google.com/reader/*
// ==/UserScript==

function loadScript(){
  var theScript = document.createElement('script');
  theScript.type = 'text/javascript';
  theScript.src = 'http://google-axsjax.googlecode.com/svn/trunk/reader/axsEnableReader.js';
  document.getElementsByTagName('head')[0].appendChild(theScript);
}

loadScript();