//AxsJAX script for Jawbreaker game at:
//http://www.minijuegosgratis.com/juegos/jawbreaker/jawbreaker.htm

var axsJb = {};
                                
axsJb.keyboardLocked = false;
axsJb.row = 0;
axsJb.col = 0;
axsJb.MAXROW = 11;
axsJb.MAXCOL = 10;
axsJb.HELP_STRING = 'The following keys are available. ' +
                        'N, start a new game. ' +
                        'Arrow keys or H,J,K,L, navigate the board one ball at a time. ' +
                        'A,E,T,B, jump to the edges of the board. ' +
                        'Capital R,G,B,Y,P, jump to the next ball of that color. ' +
                        'R, read the current row. ' +
                        'C, read the current column. ' +
                        'S, read the current stats. ' +
                        'Equals, read the current number of balls remaining for each color. ' +
                        'Space, click on the current ball. The first click selects the group and the second click confirms the selection.' +
                        'D, deselect the unconfirmed selection.' +
                        'U, undoes the last confirmed selection.';

axsJb.prevBallImg = null;

axsJb.axsJaxObj = new AxsJAX(false);


axsJb.getCurrentPosition = function(){
  axsJb.prevBallImg.style.outline = 'none';
  var ballImg = axsJb.getBallImgNode(axsJb.row,axsJb.col);
  var color = axsJb.getColorOfBallImg(ballImg);
  var message = color + axsJb.row + ', ' + axsJb.col + '.';
  ballImg.alt = message;
  ballImg.style.outline = 'black solid thin';
  axsJb.prevBallImg = ballImg;
  axsJb.axsJaxObj.speakNode(ballImg);
};

/*
 * Dictionary mapping  image names to color names
 */
axsJb.Img2ColorMap = {
  's_green.gif' : 'Selected Green. ',
  's_blue.gif' : 'Selected Blue. ',
  's_purple.gif' : 'Selected Purple. ',
  's_red.gif' : 'Selected  Red. ',
  's_yellow.gif' : 'Selected Yellow. ',
  'p_green.gif' : 'Green, ',
  'p_blue.gif' : 'Blue, ',
  'p_purple.gif' : 'Purple, ',
  'p_red.gif' : 'Red, ',
  'p_yellow.gif' : 'Yellow, ',
  'p_white.gif' : 'dot, '
};

axsJb.getColorOfBallImg = function(ballImg){
  var color = axsJb.Img2ColorMap[axsJb.getUrlOfBallImg(ballImg)];
  return color;
};

axsJb.getUrlOfBallImg = function(ballImg){
  var url = ballImg.src.toString();
  var slashPos = url.lastIndexOf('/');
  return url.substring(slashPos+1);
};

axsJb.getBallImgNode = function(row,col){
  var rowString = row.toString();
  var colString = col.toString();
  if (rowString.length < 2){
    rowString = '0' + rowString;
  }
  if (colString.length < 2){
    colString = '0' + colString;
  }
  var targetId = 'r'+ rowString + 'c' + colString;
  return document.getElementById(targetId);
};

axsJb.sayStats = function(){
  var blockCount = document.getElementById('blockcount').textContent;
  var blockScore = document.getElementById('blockscore').textContent;
  var totalScore = document.getElementById('userscore').textContent;
  if (blockCount === 0 ) {
      axsJb.axsJaxObj.speakTextViaNode('Score is ' + totalScore );
  } else {
      axsJb.axsJaxObj.speakTextViaNode(blockCount + ' blocks add '  + blockScore + ' to ' + totalScore);
  }
};


axsJb.sayColorCounts = function(){
  var redCount = document.getElementById('red').textContent;
  var yellowCount = document.getElementById('yellow').textContent;
  var greenCount = document.getElementById('green').textContent;
  var blueCount = document.getElementById('blue').textContent;
  var purpleCount = document.getElementById('purple').textContent;
  axsJb.axsJaxObj.speakTextViaNode( redCount + ' reds, ' +
                                     yellowCount + ' yellows, ' +
                                     greenCount + ' greens, ' +
                                     blueCount + ' blues, ' +
                                     purpleCount + ' purples.');
  
};

axsJb.speakRow = function(){
  var speechString = "R " +  axsJb.row + ": ";
  var startPos = axsJb.findFirstBallInRow();
  if (startPos == -1){
    speechString = speechString + 'all blank!';
    startPos = axsJb.MAXCOL + 1;
  } else if (startPos > 1){
    speechString = speechString + startPos + ' blanks, ';
  } else {
    startPos = 0;
  }     
  for (var col = startPos; col <= axsJb.MAXCOL; col++){
    speechString = speechString + axsJb.getColorOfBallImg(axsJb.getBallImgNode(axsJb.row,col));
  }
  axsJb.axsJaxObj.speakTextViaNode(speechString);
};

axsJb.speakCol = function(){
  var speechString = "C " +  axsJb.col + ": ";
  var startPos = axsJb.findFirstBallInCol();
  if (startPos == -1){
    speechString = speechString + 'all blank!';
    startPos = axsJb.MAXROW + 1;
  } else if (startPos > 1){
    speechString = speechString + startPos + ' blanks, ';
  } else {
    startPos = 0;
  }       
  for (var row = startPos; row <= axsJb.MAXROW; row++){
    speechString = speechString + axsJb.getColorOfBallImg(axsJb.getBallImgNode(row,axsJb.col));
  }
  axsJb.axsJaxObj.speakTextViaNode(speechString);
};

axsJb.findFirstBallInCol = function(){
  for (var row = 0; row <= axsJb.MAXROW; row++){
    var ballImg = axsJb.getBallImgNode(row,axsJb.col);
    if (axsJb.getUrlOfBallImg(ballImg) != 'p_white.gif'){
      return row;
    }  
  }
  return -1;
};

axsJb.findFirstBallInRow = function(){
  for (var col = 0; col <= axsJb.MAXCOL; col++){
    var ballImg = axsJb.getBallImgNode(axsJb.row,col);
    if (axsJb.getUrlOfBallImg(ballImg) != 'p_white.gif'){
      return col;
    }  
  }
  return -1;
};

axsJb.gotoNext = function(color){
  var uTargetImgUrl = 'p_' + color + '.gif';
  var sTargetImgUrl = 's_' + color + '.gif';
  var col = axsJb.col;
  var row = axsJb.row;
  var ballImg = null;
  //Look for another ball of the specified color in the same row in a column
  //after the current column.
  col++;
  for ( ; col <= axsJb.MAXCOL; col++){
    ballImg = axsJb.getBallImgNode(row,col);
    if ((axsJb.getUrlOfBallImg(ballImg) == uTargetImgUrl) || (axsJb.getUrlOfBallImg(ballImg) == sTargetImgUrl)){
      axsJb.col = col;
      axsJb.row = row;
      axsJb.getCurrentPosition();
      return;
    }
  }
  //No balls of the specified color in the current row. Look for one in rows and
  //columns after the current row.
  row++;
  for ( ; row <= axsJb.MAXROW; row++){
    for (col = 0; col <= axsJb.MAXCOL; col++){
      ballImg = axsJb.getBallImgNode(row,col);
      if ((axsJb.getUrlOfBallImg(ballImg) == uTargetImgUrl) || (axsJb.getUrlOfBallImg(ballImg) == sTargetImgUrl)){
        axsJb.col = col;
        axsJb.row = row;
        axsJb.getCurrentPosition();
        return;
      }
    }
  }
  //No balls of the specified color in the rows and columns after the current
  //row. Start looking from the very top of the board (0,0).
  row = 0;
  for ( ; row <= axsJb.MAXROW; row++){
    for (col = 0; col <= axsJb.MAXCOL; col++){
      ballImg = axsJb.getBallImgNode(row,col);
      if ((axsJb.getUrlOfBallImg(ballImg) == uTargetImgUrl) || (axsJb.getUrlOfBallImg(ballImg) == sTargetImgUrl)){
        axsJb.col = col;
        axsJb.row = row;
        axsJb.getCurrentPosition();
        return;
      }
    }
  }
  //There are no balls of the specified color left on the board.
  axsJb.axsJaxObj.speakTextViaNode('No ' + color + ' left.');
};


axsJb.undo = function(){
  var undoButton = document.getElementById('menu-undo');
  if (undoButton.disabled === true){
    axsJb.axsJaxObj.speakTextViaNode('Nothing to undo.');
  } else {
    axsJb.axsJaxObj.clickElem(undoButton, false);
    axsJb.axsJaxObj.speakTextViaNode('Last action undone.');
  }
};

axsJb.up = function(){
  axsJb.row--;
  if (axsJb.row < 0){ axsJb.row = 0; }
  axsJb.getCurrentPosition();
};
axsJb.down = function(){
  axsJb.row++;
  if (axsJb.row > axsJb.MAXROW){  axsJb.row = axsJb.MAXROW; }
  axsJb.getCurrentPosition();
};
axsJb.left = function(){
  axsJb.col--;
  if (axsJb.col < 0){ axsJb.col = 0; }
  axsJb.getCurrentPosition();
};
axsJb.right = function(){
  axsJb.col++;
  if (axsJb.col > axsJb.MAXCOL){ axsJb.col = axsJb.MAXCOL; }
  axsJb.getCurrentPosition();
};

axsJb.keyboardHandler = function(evt){
  if (evt.charCode == 110){ // n
    axsJb.row = 0;
    axsJb.col = 0;
    axsJb.axsJaxObj.clickElem(document.getElementById('menu-start'), false);
    axsJb.getCurrentPosition();
    axsJb.keyboardLocked = false;
  }
  if (evt.charCode == 63){ // ? (question mark)
    axsJb.axsJaxObj.speakTextViaNode(axsJb.HELP_STRING);
  }

  if (axsJb.keyboardLocked === true) return false;
  
  var command =  axsJb.keyCodeMap[evt.keyCode] ||
                 axsJb.charCodeMap[evt.charCode];

  if (command)  return  command();
  return false;
};

axsJb.init = function(){
  axsJb.prevBallImg = axsJb.getBallImgNode(axsJb.row,axsJb.col);
  axsJb.prevBallImg.style.outline = 'black solid thin';
  document.addEventListener('keypress', axsJb.keyboardHandler, true);

  //Rewrite the native alert function so that it speaks through AxsJAX and
  //does NOT popup a JavaScript alert window.
  //Lock the keyboard so that the user doesn't accidentally
  //cancel this message out.
  alert = function(textStr){
    axsJb.keyboardLocked = true;
    window.setTimeout(function(){axsJb.axsJaxObj.speakTextViaNode(textStr);},0);
  };
};

axsJb.keyCodeMap = {
  38 : axsJb.up,    // Up arrow
  40 : axsJb.down,    // Down arrow
  37 : axsJb.left,    // Left arrow
  39 : axsJb.right    // Right arrow
};

axsJb.charCodeMap = {
  117 : axsJb.undo,   // u
   97 : function() {    // a
          var targCol = axsJb.findFirstBallInRow();
          if (targCol != -1) axsJb.col = targCol;
          axsJb.getCurrentPosition();
        },
  101 : function() {    // e
          axsJb.col = axsJb.MAXCOL;
          axsJb.getCurrentPosition();
        },
  116 : function() {    // t
          var targRow = axsJb.findFirstBallInCol();
          if (targRow != -1) axsJb.row = targRow;
          axsJb.getCurrentPosition();
        },
   98 : function() {    // b
          axsJb.row = axsJb.MAXROW;
          axsJb.getCurrentPosition();
        },
   61 : axsJb.sayColorCounts,    // =
  107 : axsJb.up,    // k
  104 : axsJb.down,    // h
  106 : axsJb.left,    // j
  108 : axsJb.right,    // l
   32 : function() {    // SPACE
          axsJb.axsJaxObj.clickElem(axsJb.getBallImgNode(axsJb.row,axsJb.col), false);
          if (axsJb.getUrlOfBallImg(axsJb.getBallImgNode(axsJb.row,axsJb.col)).indexOf('s_') === 0){
            axsJb.sayStats();
          } else {
            var totalScore = document.getElementById('userscore').textContent;
            axsJb.axsJaxObj.speakTextViaNode('Total ' + totalScore);
          }
        },
  115 : axsJb.sayStats,    // s
   99 : axsJb.speakCol,    // c
  114 : axsJb.speakRow,    // r
  100 : function() {    // d
          jb.deselectBlocks();
          axsJb.axsJaxObj.speakTextViaNode('Deselected. ');
        },
   82 :  function() { axsJb.gotoNext('red'); },    // R
   71 :  function() { axsJb.gotoNext('green'); },    // G
   66 :  function() { axsJb.gotoNext('blue'); },    // B
   89 :  function() { axsJb.gotoNext('yellow'); },    // Y
   80 :  function() { axsJb.gotoNext('purple'); }    // P
};


axsJb.init();