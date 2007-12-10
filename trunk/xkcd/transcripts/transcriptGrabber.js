// This code will generate a version of the ohnorobot.com browse page
// that is ready to be used for AxsJAXing a webcomic with its transcriptions.
// Try running this code on: http://www.ohnorobot.com/archive.pl?comic=56&page=&show=2
//
var theTable = window.content.document.getElementsByTagName('TABLE')[0];
var theRows = theTable.getElementsByTagName('TR');

var outputString = "xkcdTranscriptions = new Array(); <br/>";

var SYNTAX_00_STRING = "xkcdTranscriptions[";
var SYNTAX_01_STRING = "] = '";
var SYNTAX_02_STRING = "'; <br/>";


for (var i=0, currentRow; currentRow = theRows[i]; i++){
  var theCells = currentRow.getElementsByTagName('TD');
  var theMessage = "";
  try{
    theTranscription = SYNTAX_00_STRING + theCells[0].firstChild.href.substring(16,theCells[0].firstChild.href.length-1) + SYNTAX_01_STRING;
    for (var j=0, currentChar; currentChar = theCells[1].firstChild.textContent[j]; j++){
      if (currentChar != "'"){
        theTranscription = theTranscription + currentChar;
      }
    }
    theTranscription = theTranscription + SYNTAX_02_STRING;
    outputString = outputString + theTranscription;
  } catch (e){}
}

window.content.document.body.innerHTML = outputString;