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


/**
 * @fileoverview This script decides which of the Google Books
 * subpages the user is on and loads the appropriate script for the subpage.
 * @author clchen@google.com (Charles L. Chen)
 */



function pickBooksScript(){
  var shouldInsertScripts = false;
  var baseURL = 'http://google-axsjax.googlecode.com/svn/trunk/';
  var theScript = document.createElement('script');
  theScript.type = 'text/javascript';
  var currentURL = document.baseURI;

  //Do URL matching to figure out which subpage of books is being used.
  if ( ((currentURL.indexOf('http://books.google.com/books?id=') === 0) &&
        (currentURL.indexOf('&printsec=') == -1)) ||
       (currentURL.indexOf('http://books.google.com/books?as_brr=') === 0) ) {
    theScript.src = baseURL + 'books/axsEnableBooksAbout.js';
    shouldInsertScripts = true;
  } else if ((currentURL.indexOf('http://books.google.com/books?id=') === 0) && (currentURL.indexOf('&printsec=') != -1)){
    theScript.src = baseURL + 'books/axsEnableBooksPreview.js';
    shouldInsertScripts = true;
  } else if (currentURL.indexOf('http://books.google.com/books?q=') === 0){
    theScript.src = baseURL + 'books/axsEnableBooksResults.js';
    shouldInsertScripts = true;
  }
  if (shouldInsertScripts){
    document.getElementsByTagName('head')[0].appendChild(theScript);
  }
}

pickBooksScript();
