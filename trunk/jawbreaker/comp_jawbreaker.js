(function() { 
var a=false,g=null,h=true,k=function(b){this.T=0;this.D=g;this.P=a;this.s=g;this.K=a;var c=this,e=function(f){c.s=f.target;if(f.target.tagName=="INPUT"||f.target.tagName=="SELECT"||f.target.tagName=="TEXTAREA")c.K=h;return h};document.addEventListener("focus",e,h);var d=function(f){c.M(c.s,"aria-activedescendant");c.s=g;if(f.target.tagName=="INPUT"||f.target.tagName=="SELECT"||f.target.tagName=="TEXTAREA")c.K=a;return h};document.addEventListener("blur",d,h);if(b){this.P=h;document.addEventListener("keypress",
function(f){c.ea(f,c)},h);document.body.ga=h}this.u=document.body};k.prototype.r=function(){var b=this.u;while(b.nodeType!=9)b=b.parentNode;return b};
k.prototype.O=function(b,c){b.id||this.F(b);if(c){this.n(b,"live","rude");this.n(b,"atomic","true");var e=this.r(),d=e.createElement("div");d.textContent=" ";d.name="AxsJAX_dummyNode";b.lastChild&&b.lastChild.name&&b.lastChild.name==d.name&&b.removeChild(b.lastChild);b.appendChild(d)}else{var f=this.Y(b,"role");this.n(b,"role","row");var j=this.s;if(!j||j.nodeType==9){this.u.tabIndex=-1;j=this.u}this.n(j,"activedescendant",g);j.focus();this.n(j,"activedescendant",b.id);var i=this;window.setTimeout(function(){f?
i.n(b,"role",f):i.M(b,"role")},0)}};
k.prototype.g=function(b,c){var e="AxsJAX_pixelAudioNode",d="AxsJAX_pixelAudioNode",f="data:image/gif;base64,R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",j=this.r(),i=g;if(c){if(c.previousSibling&&c.previousSibling.name==d)i=c.previousSibling;else{i=j.createElement("img");i.name=d;i.setAttribute("tabindex",0);i.style.outline="none";i.src=f;c.parentNode.insertBefore(i,c);this.X(i)}i.setAttribute("alt",b);i.setAttribute("title",b);window.setTimeout(function(){i.blur();i.focus()},0)}else{i=
j.getElementById(e);if(i&&i.alt==b)b=b+" ";if(!i){i=j.createElement("img");i.id=e;i.src=f;j.body.appendChild(i)}i.setAttribute("alt",b);i.setAttribute("title",b);this.O(i)}};
k.prototype.v=function(b,c){var e=this.r(),d=e.createEvent("MouseEvents");d.initMouseEvent("mousedown",h,h,e.defaultView,1,0,0,0,0,a,a,c,a,0,g);try{b.dispatchEvent(d)}catch(f){}d=e.createEvent("MouseEvents");d.initMouseEvent("mouseup",h,h,e.defaultView,1,0,0,0,0,a,a,c,a,0,g);try{b.dispatchEvent(d)}catch(f){}d=e.createEvent("MouseEvents");d.initMouseEvent("click",h,h,e.defaultView,1,0,0,0,0,a,a,c,a,0,g);try{b.dispatchEvent(d)}catch(f){}if(b.tagName=="A"&&b.href&&(b.href.indexOf("http")===0||b.href.indexOf("javascript:")===
0))if(c)window.open(b.href);else document.location=b.href};k.prototype.F=function(b,c){if(!b)return"";if(b.id)return b.id;var e=c||"AxsJAX_ID_";b.id=e+this.T++;return b.id};k.prototype.ea=function(b,c){if(!c.P)return h;if(b.keyCode==9&&c.D){c.D.focus();c.D=g}return h};k.prototype.n=function(b,c,e){if(!b)return;c=c.toLowerCase();switch(c){case "live":c="aria-live";break;case "activedescendant":c="aria-activedescendant";break;case "atomic":c="aria-atomic";break;default:break}b.setAttribute(c,e)};
k.prototype.Y=function(b,c){return b.getAttribute(c)};k.prototype.M=function(b,c){b&&b.removeAttribute&&b.removeAttribute(c)};k.prototype.X=function(b){var c=this.F(b),e=this.r(),d=e.baseURI,f=d.indexOf("#");if(f!=-1)d=d.substring(0,f);e.location=d+"#"+c};var l=function(b){var c="http://google-axsjax.googlecode.com/svn/trunk/";this.W=c+"common/earcons/axsEarcons.swf?sound=";this.i=g;this.q=b;this.C=c+"thirdparty/soundmanager2/";this.e=g;this.m=a;this.R="minimal";this.p=a;this.A=0};
l.prototype.z=function(){if(this.q)return;if(this.m)return;if(this.p)return;this.p=h;this.A=0;if(this.e!==g){this.e.parentNode.removeChild(this.e);this.e=g}this.e=document.createElement("iframe");var b=document.location.toString();if(b.indexOf("#")!=-1)b=b.substring(0,b.indexOf("#"));this.e.src=this.C+"AxsJAX_SM2_Linker.html#Verbosity="+this.R+",Parent="+b;this.e.width="0%";this.e.height="0%";this.e.style.top="-1000";this.e.style.left="-1000";this.e.style.position="absolute";document.getElementsByTagName("body")[0].appendChild(this.e);
this.G()};l.prototype.G=function(){if(document.location.hash=="#InitSuccess"){this.m=h;this.p=a;return}if(this.R=="none"&&this.A>0){this.m=h;this.p=a;return}var b=this;window.setTimeout(function(){b.G()},100);this.A++};l.prototype.play=function(b){var c=this.aa(b);if(this.q||c)return;if(!this.m){this.z();var e=this;window.setTimeout(function(){e.play(b)},500);return}this.e.src=this.C+"AxsJAX_SM2_Linker.html#AxsSoundCmd=Play("+b+")"};
l.prototype.stop=function(){if(this.i){this.i.parentNode.removeChild(this.i);this.i=g}if(this.q)return;if(!this.m)return;this.e.src=this.C+"AxsJAX_SM2_Linker.html#AxsSoundCmd=Stop()"};l.prototype.getTime=function(){if(this.q)return-1;if(!this.m)return-1;var b="Time=",c=unescape(document.location.hash);if(c.indexOf(b)==-1)return-1;var e=c.indexOf(b)+b.length,d=parseInt(c.substring(e),10);return d};
l.prototype.aa=function(b){var c="";switch(b){case "alert":c="alert";break;case "deselect":c="deselect";break;case "item":c="item";break;case "list":c="list";break;case "select":c="select";break;case "success":c="success";break;case "wrap":c="wrap";break;default:}if(c==="")return;if(this.i===g){this.i=document.createElement("embed");this.i.height=0;this.i.width=0;document.body.appendChild(this.i)}this.i.src=this.W+c};var m={};m.B=a;m.b=0;m.a=0;m.l=11;m.k=10;m.S="The following keys are available. N, start a new game. Arrow keys or H,J,K,L, navigate the board one ball at a time. A,E,T,B, jump to the edges of the board. Capital R,G,B,Y,P, jump to the next ball of that color. R, read the current row. C, read the current column. S, read the current stats. Equals, read the current number of balls remaining for each color. Space, click on the current ball. The first click selects the group and the second click confirms the selection.D, deselect the unconfirmed selection.U, undoes the last confirmed selection.";
m.t=g;m.d=new k(a);m.c=new l(h);m.f=function(){m.t.style.outline="none";var b=m.h(m.b,m.a),c=m.w(b),e=c+m.b+", "+m.a+".";b.alt=e;b.style.outline="black solid thin";m.t=b;m.d.O(b)};m.U={"s_green.gif":"Selected Green. ","s_blue.gif":"Selected Blue. ","s_purple.gif":"Selected Purple. ","s_red.gif":"Selected  Red. ","s_yellow.gif":"Selected Yellow. ","p_green.gif":"Green, ","p_blue.gif":"Blue, ","p_purple.gif":"Purple, ","p_red.gif":"Red, ","p_yellow.gif":"Yellow, ","p_white.gif":"dot, "};
m.w=function(b){var c=m.U[m.j(b)];return c};m.j=function(b){var c=b.src.toString(),e=c.lastIndexOf("/");return c.substring(e+1)};m.h=function(b,c){var e=b.toString(),d=c.toString();if(e.length<2)e="0"+e;if(d.length<2)d="0"+d;var f="r"+e+"c"+d;return document.getElementById(f)};
m.N=function(){var b=document.getElementById("blockcount").textContent,c=document.getElementById("blockscore").textContent,e=document.getElementById("userscore").textContent;b===0?m.d.g("Score is "+e):m.d.g(b+" blocks add "+c+" to "+e)};
m.ba=function(){var b=document.getElementById("red").textContent,c=document.getElementById("yellow").textContent,e=document.getElementById("green").textContent,d=document.getElementById("blue").textContent,f=document.getElementById("purple").textContent;m.d.g(b+" reds, "+c+" yellows, "+e+" greens, "+d+" blues, "+f+" purples.")};m.da=function(){var b="R "+m.b+": ",c=m.J();if(c==-1){b=b+"all blank!";c=m.k+1}else if(c>1)b=b+c+" blanks, ";else c=0;for(var e=c;e<=m.k;e++)b=b+m.w(m.h(m.b,e));m.d.g(b)};
m.ca=function(){var b="C "+m.a+": ",c=m.I();if(c==-1){b=b+"all blank!";c=m.l+1}else if(c>1)b=b+c+" blanks, ";else c=0;for(var e=c;e<=m.l;e++)b=b+m.w(m.h(e,m.a));m.d.g(b)};m.I=function(){for(var b=0;b<=m.l;b++){var c=m.h(b,m.a);if(m.j(c)!="p_white.gif")return b}return-1};m.J=function(){for(var b=0;b<=m.k;b++){var c=m.h(m.b,b);if(m.j(c)!="p_white.gif")return b}return-1};m.L=function(b,c){var e=m.h(b,c),d=m.j(e);if(d.indexOf("s_")===0)return h;return a};
m.o=function(b){var c="p_"+b+".gif",e="s_"+b+".gif",d=m.a,f=m.b,j=g;d++;for(;d<=m.k;d++){j=m.h(f,d);if(m.j(j)==c||m.j(j)==e){d+1==m.a||d-1==m.a?m.c.play("item"):m.c.play("list");m.a=d;m.b=f;m.f();return}}f++;for(;f<=m.l;f++)for(d=0;d<=m.k;d++){j=m.h(f,d);if(m.j(j)==c||m.j(j)==e){d==m.a&&(f+1==m.b||f-1==m.b)?m.c.play("item"):m.c.play("list");m.a=d;m.b=f;m.f();return}}f=0;for(;f<=m.l;f++)for(d=0;d<=m.k;d++){j=m.h(f,d);if(m.j(j)==c||m.j(j)==e){m.c.play("wrap");m.a=d;m.b=f;m.f();return}}m.d.g("No "+b+
" left.")};m.fa=function(){var b=document.getElementById("menu-undo");if(b.disabled===h)m.d.g("Nothing to undo.");else{m.d.v(b,a);m.d.g("Last action undone.")}};m.Q=function(){m.b--;if(m.b<0){m.c.play("alert");m.b=0}else m.c.play("item");m.f()};m.H=function(){m.b++;if(m.b>m.l){m.c.play("alert");m.b=m.l}else m.c.play("item");m.f()};m.left=function(){m.a--;if(m.a<0){m.c.play("alert");m.a=0}else m.c.play("item");m.f()};
m.right=function(){m.a++;if(m.a>m.k){m.c.play("alert");m.a=m.k}else m.c.play("item");m.f()};m.$=function(b){if(b.charCode==110){m.b=0;m.a=0;m.d.v(document.getElementById("menu-start"),a);m.f();m.B=a}b.charCode==63&&m.d.g(m.S);if(m.B===h)return a;var c=m.Z[b.keyCode]||m.V[b.charCode];if(c)return c();return a};m.z=function(){m.t=m.h(m.b,m.a);m.t.style.outline="black solid thin";document.addEventListener("keypress",m.$,h);alert=function(b){m.B=h;window.setTimeout(function(){m.d.g(b)},0)}};
m.Z={38:m.Q,40:m.H,37:m.left,39:m.right};
m.V={117:m.fa,97:function(){m.c.play("list");var b=m.J();if(b!=-1)m.a=b;m.f()},101:function(){m.c.play("list");m.a=m.k;m.f()},116:function(){m.c.play("list");var b=m.I();if(b!=-1)m.b=b;m.f()},98:function(){m.c.play("list");m.b=m.l;m.f()},61:m.ba,107:m.Q,104:m.left,106:m.H,108:m.right,32:function(){var b=a;if(m.L(m.b,m.a))b=h;m.d.v(m.h(m.b,m.a),a);if(m.L(m.b,m.a)){m.c.play("select");m.N()}else{b?m.c.play("success"):m.c.play("alert");var c=document.getElementById("userscore").textContent;m.d.g("Total "+
c)}},115:m.N,99:m.ca,114:m.da,100:function(){m.c.play("deselect");jb.ha();m.d.g("Deselected. ")},82:function(){m.o("red")},71:function(){m.o("green")},66:function(){m.o("blue")},89:function(){m.o("yellow")},80:function(){m.o("purple")}};m.z();
 })();
