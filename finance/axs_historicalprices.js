(function() { var h=true,i=null,j=false,l,n=function(a){this.Qb=0;this.ba=i;this.Db=j;this.C=i;this.na=j;var b=this;this.wa=document.body;this.fc();if(a){this.Db=h;document.addEventListener("keypress",function(d){b.jd(d,b)},h);document.body.kd=h}this.M(document.body,"role","application")};l=n.prototype;
l.fc=function(){var a=this.v(),b=this,d=function(c){b.C=c.target;if(c.target.tagName=="INPUT"||c.target.tagName=="SELECT"||c.target.tagName=="TEXTAREA")b.na=h;return h};a.addEventListener("focus",d,h);d=function(c){b.Qa(b.C,"aria-activedescendant");b.C=i;if(c.target.tagName=="INPUT"||c.target.tagName=="SELECT"||c.target.tagName=="TEXTAREA")b.na=j;return h};a.addEventListener("blur",d,h)};l.v=function(){for(var a=this.wa;a.nodeType!=9;)a=a.parentNode;return a};
l.Va=function(a,b){a.id||this.db(a);if(b){this.M(a,"live","rude");this.M(a,"atomic","true");var d=this.v();d=d.createElement("div");d.textContent=" ";d.name="AxsJAX_dummyNode";a.lastChild&&a.lastChild.name&&a.lastChild.name==d.name&&a.removeChild(a.lastChild);a.appendChild(d)}else{var c=this.yc(a,"role");this.M(a,"role","row");d=this.C;if(!d||d.nodeType==9){this.wa.tabIndex=-1;d=this.wa}this.M(d,"activedescendant",i);d.focus&&d.focus();this.M(d,"activedescendant",a.id);var e=this;window.setTimeout(function(){c?
e.M(a,"role",c):e.Qa(a,"role")},0)}};
l.r=function(a,b){var d="AxsJAX_pixelAudioNode",c="AxsJAX_pixelAudioNode",e="data:image/gif;base64,R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",f=this.v(),g=i;if(b){if(b.previousSibling&&b.previousSibling.name==c)g=b.previousSibling;else{g=f.createElement("img");g.name=c;g.setAttribute("tabindex",0);g.style.outline="none";g.src=e;b.parentNode.insertBefore(g,b);this.vc(g)}g.setAttribute("alt",a);g.setAttribute("title",a);window.setTimeout(function(){g.blur();g.focus()},0)}else{if((g=
f.getElementById(d))&&g.alt==a)a+=" ";if(!g){g=f.createElement("img");g.id=d;g.src=e;f.body.appendChild(g)}g.setAttribute("alt",a);g.setAttribute("title",a);this.Va(g)}};
l.pc=function(a,b){var d=this.v(),c=d.createEvent("MouseEvents");c.initMouseEvent("mousedown",h,h,d.defaultView,1,0,0,0,0,j,j,b,j,0,i);try{a.dispatchEvent(c)}catch(e){}c=d.createEvent("MouseEvents");c.initMouseEvent("mouseup",h,h,d.defaultView,1,0,0,0,0,j,j,b,j,0,i);try{a.dispatchEvent(c)}catch(f){}c=d.createEvent("MouseEvents");c.initMouseEvent("click",h,h,d.defaultView,1,0,0,0,0,j,j,b,j,0,i);try{a.dispatchEvent(c)}catch(g){}d=a.getAttribute("href");if(a.tagName=="A"&&d&&d!="#")if(b)window.open(a.href);
else document.location=a.href};l.db=function(a,b){if(!a)return"";if(a.id)return a.id;var d=b||"AxsJAX_ID_";a.id=d+this.Qb++;return a.id};l.pa=function(a){if(!a)return j;if(a.tagName=="A"||a.tagName=="INPUT"){this.ba=a;return h}a=a.getElementsByTagName("*");for(var b=0,d;d=a[b];b++)if(d.tagName=="A"||d.tagName=="INPUT"||d.hasAttribute("tabindex")&&d.tabIndex!=-1){this.ba=d;return h}return j};l.jd=function(a,b){if(!b.Db)return h;if(a.keyCode==9&&b.ba){b.ba.focus();b.ba=i}return h};
l.Cc=function(a){this.Va(a);a.scrollIntoView(h);this.pa(a)};l.M=function(a,b,d){if(a){b=b.toLowerCase();switch(b){case "live":b="aria-live";break;case "activedescendant":b="aria-activedescendant";break;case "atomic":b="aria-atomic";break;default:break}a.setAttribute(b,d)}};l.yc=function(a,b){return a.getAttribute(b)};l.Qa=function(a,b){a&&a.removeAttribute&&a.removeAttribute(b)};
l.vc=function(a){a=this.db(a);var b=this.v(),d=b.baseURI,c=d.indexOf("#");if(c!=-1)d=d.substring(0,c);b.location=d+"#"+a};l.A=function(a,b){try{var d=b.ownerDocument.evaluate(a,b,i,XPathResult.ORDERED_NODE_ITERATOR_TYPE,i)}catch(c){return[]}for(var e=[],f=d.iterateNext();f;f=d.iterateNext())e.push(f);return e};n.Ed=function(a){window.addEventListener("load",function(){a()},h)};var o=function(a){this.ra=this.qa="";this.c=[];this.a=0;this.g=[];this.p=i;this.ca=[];this.I={};this.J={};this.K=[];this.H=[];this.e=a;this.F=this.w=this.D=i;this.Sb="list";this.Ya="item";this.cb="wrap";this.P=i};o.b={Tb:"next list",Vb:"previous list",Ob:"go forward",Nb:"go backwards",Hb:"cycle next",Ib:"cycle previous",$b:"Select available action",Ub:"No available actions",ab:"Page up",$a:"Page down",S:"Enter",od:"Escape",nd:"Delete",ga:"Up",da:"Down",Za:"Left",bb:"Right"};l=o.prototype;
l.bd=function(a,b){if(b){this.w=a;this.w.i===i&&this.sc();var d=this,c=new Array(b);this.t(c,this.I,this.J,function(){d.ed()})}};l.sa=function(a){var b=h;if(a.type=="dynamic"&&a.k.length===0){this.D!==i&&this.D.view(i);a.k=this.oa(a.aa);a.o=this.wb(a.aa);if(this.c[this.a]===a)this.g[this.a]=-1;else for(var d=0,c;c=this.c[d];d++)if(c===a){this.g[d]=-1;break}}if(a.k.length===0&&a.Aa===i)b=j;return b};
l.jb=function(){var a=this.O();a=a.Aa;var b=i;if(a!==i){this.ha(a);b=this.Ca(a.action)}if(b===i){this.hc();this.F!==i&&this.F.play(this.Sb)}};l.Mc=function(){if(this.c.length<1)return i;for(var a=0;this.c[a];a++){this.a++;if(this.a>=this.c.length)this.a=0;if(this.sa(this.c[this.a]))break}return this.O()};l.Rc=function(){if(this.c.length<1)return i;for(var a=0;this.c[a];a++){this.a--;if(this.a<0)this.a=this.c.length-1;if(this.sa(this.c[this.a]))break}return this.O()};l.O=function(){return this.c[this.a]};
l.hc=function(){this.e.r(this.O().title)};l.Ia=function(){if(this.c.length<1)return i;var a=this.c[this.a],b=a.k;if(b.length<1)return i;if(this.p){var d=this.Ea(a);d=this.p.l.R[d];if(typeof d!="undefined")this.g[this.a]=d}this.g[this.a]++;d=j;if(this.g[this.a]>=b.length){this.g[this.a]=0;d=h}var c=this.g[this.a];if(b[c].l.parentNode===i){this.D!==i&&this.D.view(i);a.k=this.oa(a.aa);this.g[this.a]=0;c=this.g[this.a]}this.p=b[c];if(this.F!==i)d?this.F.play(this.cb):this.F.play(this.Ya);return this.p};
l.xc=function(){var a=this.c[this.a],b=this.g[this.a];if(a.Wa!==i&&b+1>=a.k.length){this.ha(a.Wa);this.g[this.a]=0;return i}return a=this.Ia()};
l.zb=function(){if(this.c.length<1)return i;var a=this.c[this.a],b=a.k;if(b.length<1)return i;if(this.p){var d=this.Ea(a);d=this.p.l.R[d];if(typeof d!="undefined")this.g[this.a]=d}this.g[this.a]--;d=j;if(this.g[this.a]<0){this.g[this.a]=b.length-1;d=h}var c=this.g[this.a];if(b[c].l.parentNode===i){this.D!==i&&this.D.view(i);a.k=this.oa(a.aa);this.g[this.a]=a.k.length;c=this.g[this.a]}this.p=b[c];if(this.F!==i)d?this.F.play(this.cb):this.F.play(this.Ya);return this.p};
l.mc=function(){var a=this.c[this.a],b=this.g[this.a];if(a.Ga!==i&&b<=0){this.ha(a.Ga);this.g[this.a]=a.k.length-1;return i}return a=this.zb()};l.ib=function(){if(this.c.length<1)return i;var a=this.c[this.a];if(this.p){var b=this.Ea(a);b=this.p.l.R[b];if(typeof b!="undefined")this.g[this.a]=b}a=a.k;b=this.g[this.a];return this.p=a[b]};l.Ca=function(a){var b=i;if(a!==i&&a.indexOf&&a.indexOf("CALL:")===0&&a.indexOf("(")===-1)try{b=eval(a.substring(5))}catch(d){}return b};
l.T=function(a){if(a!==i){var b=this,d=function(){var f=b.Ca(a.action);if(f)f(a);else{b.D!==i&&b.D.view(a.l);b.e.Cc(a.l)}};if(this.e.C&&this.e.C.blur){var c=this.e.C;this.e.C=i;c.removeAttribute&&this.e.Qa(c,"aria-activedescendant");var e=function(f){f.target.removeEventListener("blur",e,h);d()};c.addEventListener("blur",e,h);c.blur()}else d()}else{c=this.c[this.a];c.type=="dynamic"&&this.e.r(c.onEmpty)}};
l.t=function(a,b,d,c){for(var e=0,f;f=a[e];e++)if(f=="LEFT")d[37]=c;else if(f=="UP")d[38]=c;else if(f=="RIGHT")d[39]=c;else if(f=="DOWN")d[40]=c;else if(f=="PGUP")d[33]=c;else if(f=="PGDOWN")d[34]=c;else if(f=="ENTER")d[13]=c;else if(f=="ESC")d[27]=c;else if(f=="DEL")d[46]=c;else b[f.charCodeAt(0)]=c};
l.ja=function(a,b,d){var c=[];if(a!==""){c=a.split(" ");var e=this;if(d=="prev")this.t(c,this.K[b],this.H[b],function(){e.T(e.zb())});else if(d=="next")this.t(c,this.K[b],this.H[b],function(){e.T(e.Ia())});else d=="back"?this.t(c,this.K[b],this.H[b],function(){var f=e.mc();f!==i&&e.T(f)}):this.t(c,this.K[b],this.H[b],function(){var f=e.xc();f!=i&&e.T(f)})}};l.kc=function(a,b,d){var c=[];if(a!==""){c=a.split(" ");var e=this;this.t(c,this.I,this.J,function(){if(e.sa(e.c[b])){e.a=b;e.T(e.Ia())}else e.e.r(d)})}};
l.jc=function(a,b){var d=[];if(a!==""){d=a.split(" ");var c=this;this.t(d,this.I,this.J,function(){c.e.r(b)})}};l.eb=function(a,b,d){var c=[];if(a.hotkey!==""){c=a.hotkey.split(" ");var e=this;this.t(c,b,d,function(){e.ha(a)})}};l.ha=function(a){a.action=="click"?this.qc(a):this.nc(a)};l.nc=function(a){var b=this.mb(a);if(b.length<1)this.e.r(a.onEmpty);else{var d=this.Ca(a.action);if(d){var c={};c.action=a.action;c.l=b[0];d(c);this.e.pa(b[0])}else throw new Error("Invalid action: "+a.action);}};
l.qc=function(a){var b=this.mb(a);if(b.length<1)this.e.r(a.onEmpty);else{this.e.pc(b[0],j);b[0].scrollIntoView(h);this.e.pa(b[0])}};l.mb=function(a){a=a.s;var b=this.e.v().documentElement;if(a.indexOf(".")===0)b=this.ib().l;return this.e.A(a,b)};l.nb=function(a,b){var d=i,c=this.a;if(c<this.H.length)d=this.H[c][a]||this.K[c][b]||i;if(d===i)d=this.J[a]||this.I[b];return d};
l.Lc=function(a,b){var d={};d.ub=[];var c=new DOMParser,e=c.parseFromString(a,"text/xml"),f=e.getElementsByTagName("list"),g;for(c=0;g=f[c];c++){var k={};k.title=g.getAttribute("title");k.hotkey=g.getAttribute("hotkey");k.next=g.getAttribute("next");k.Oa=g.getAttribute("prev");k.wc=g.getAttribute("fwd");k.back=g.getAttribute("back");k.onEmpty=g.getAttribute("onEmpty");k.type=g.getAttribute("type");var p,m,r,q;k.k=[];var s=g.getElementsByTagName("item");for(p=0;m=s[p];p++){var u={};u.s=m.textContent;
if(m.attributes instanceof NamedNodeMap){r=m.attributes;q=r.length;for(m=0;m<q;m++){var t=r.item(m);u[t.nodeName]=t.value}}k.k.push(u)}k.o=[];s=g.getElementsByTagName("target");for(p=0;m=s[p];p++){g={};g.s=m.textContent;if(m.attributes instanceof NamedNodeMap){r=m.attributes;q=r.length;for(m=0;m<q;m++){t=r.item(m);g[t.nodeName]=t.value}}k.o.push(g)}d.ub.push(k)}d.o=[];var v=e.firstChild;for(c=0;e=v.childNodes[c];c++)if(e.tagName=="target"){g={};g.s=e.textContent;if(e.attributes instanceof NamedNodeMap){r=
e.attributes;q=r.length;for(m=0;m<q;m++){t=r.item(m);g[t.nodeName]=t.value}}d.o.push(g)}d.next=v.getAttribute("next");d.Oa=v.getAttribute("prev");if(b===i||typeof b=="undefined")this.xb(d,b);else{c=new (function(C,z,A,B){b(v,z,A,B)});this.xb(d,c)}};
l.Bc=function(){for(var a=this.Da(),b="",d=0,c;c=a[d];d++)b=b+c.Y+", "+c.title+". ";b=b+this.qa+", "+o.b.Tb;b=b+this.ra+", "+o.b.Vb;b=b.replace("PGUP",o.b.ab);b=b.replace("PGDOWN",o.b.$a);b=b.replace("ENTER",o.b.S);b=b.replace("DEL",o.b.Jb);b=b.replace("UP",o.b.ga);b=b.replace("DOWN",o.b.da);b=b.replace("LEFT",o.b.Za);return b=b.replace("RIGHT",o.b.bb)};
l.Ic=function(){for(var a=this.Fa(),b="",d=0,c;c=a[d];d++)b=b+c.Y+", "+c.title+". ";a=this.O();if(a.Ja!=="")b=b+a.Ja+", "+o.b.Hb+". ";if(a.Pa!=="")b=b+a.Pa+", "+o.b.Ib+". ";if(a.Ba!=="")b=b+a.Ba+", "+o.b.Ob+". ";if(a.xa!=="")b=b+a.xa+", "+o.b.Nb+". ";b=b.replace("PGUP",o.b.ab);b=b.replace("PGDOWN",o.b.$a);b=b.replace("ENTER",o.b.S);b=b.replace("DEL",o.b.Jb);b=b.replace("UP",o.b.ga);b=b.replace("DOWN",o.b.da);b=b.replace("LEFT",o.b.Za);return b=b.replace("RIGHT",o.b.bb)};l.ad=function(a){this.D=a};
l.cd=function(a){this.F=a};l.Tc=function(a){if(a===i)return j;var b=j;a=this.uc(a);if(a>-1){b=this.c[a];b.k=[];b.o=[];b=this.sa(b)}return b};l.ed=function(){if(this.w!==i){var a=this.Da(),b=this.Fa();if(a.length+b.length===0)this.e.r(o.b.Ub);else{var d=[],c=0,e="";for(c=0;e=b[c];c++)d.push(e.title);for(c=0;e=a[c];c++)d.push(e.title);this.w.Zc(d);this.w.Eb("visible",h,40,20)}}};
l.Da=function(){for(var a=[],b,d=0,c;c=this.c[d];d++)if(c.X!==""){b={};b.title=c.title;b.Y=c.X;a.push(b)}for(d=0;c=this.ca[d];d++)if(this.sb(c)){b={};b.title=c.title;b.Y=c.hotkey;a.push(b)}return a};l.Fa=function(){for(var a=[],b=this.O(),d=0,c;c=b.o[d];d++)if(this.sb(c)){var e={};e.title=c.title;e.Y=c.hotkey;a.push(e)}return a};
l.sc=function(){var a=this.e.v().body,b=this,d=function(c,e){var f=b.Fa(),g=b.Da();f=f.concat(g);f=f[e].Y;f=f.split(" ")[0];var k=g=-1;if(f=="LEFT")g=37;else if(f=="UP")g=38;else if(f=="RIGHT")g=39;else if(f=="DOWN")g=40;else if(f=="PGUP")g=33;else if(f=="PGDOWN")g=34;else if(f=="ENTER")g=13;else if(f=="DEL")g=46;else if(f=="ESC")g=27;else k=f.charCodeAt(0);b.w.i.blur();(f=b.nb(g,k))&&f()};this.w.rc(a,50,d,i,this.wd,j);this.w.$c(o.b.$b);this.w.Xc(h);this.w.Ra()};
l.sb=function(a){var b=j;if(a.hotkey!==""){a=a.s;var d=this.e.v().body;if(a.indexOf(".")===0){var c=this.ib();if(c)d=c.l}a=this.e.A(a,d);if(a.length>0)b=h}return b};
l.xb=function(a,b){this.c=[];this.a=0;this.g=[];var d=[],c,e;for(c=0;e=a.ub[c];c++){var f={};e.Ha=c;f.Ad=i;f.aa=e;f.title=e.title||"";f.X=e.hotkey||"";f.Ja=e.next||"";f.Pa=e.Oa||"";f.Ba=e.wc||"";f.xa=e.back||"";f.onEmpty=e.onEmpty||"";f.type=e.type||"";f.Wa=i;f.Ga=i;f.Aa=i;f.k=this.oa(e);f.o=this.wb(e);e=0;for(var g;g=f.o[e];e++)if(g.trigger=="listTail")f.Wa=g;else if(g.trigger=="listHead")f.Ga=g;else if(g.trigger=="listEntry")f.Aa=g;if(f.k.length>0||f.type=="dynamic"){this.c.push(f);this.g.push(-1)}else f.X!==
""&&d.push(f)}this.ca=[];this.Hd=0;if(a.o)for(c=0;f=a.o[c];c++){e={};e.s=f.s;e.s=e.s.replace(/^\s\s*/,"").replace(/\s\s*$/,"");e.title=f.title||"";e.trigger=f.trigger||"key";e.hotkey=f.hotkey||"";e.action=f.action||"click";e.onEmpty=f.onEmpty||"";this.ca.push(e)}this.P!==i&&document.removeEventListener("keypress",this.P,h);b===i||typeof b=="undefined"?this.dd(a,d):b(a,this.c,d,this.ca)};
l.oa=function(a){var b=[];if(!a.k)return b;for(var d=0,c;c=a.k[d];d++)try{var e=c.s.replace(/^\s\s*/,"").replace(/\s\s*$/,""),f=this.e.v().documentElement,g=this.e.A(e,f),k=c.index||"0",p=parseInt(k,10),m=g.length-p,r=c.Bd||"*";if(r!="*")m=parseInt(r,10);for(var q=m+p,s=c.action||i;p<q;){c={};c.action=s;c.l=g[p];if(typeof c.l!="undefined"){if(typeof c.l.R=="undefined")c.l.R={};if(typeof a.Ha=="undefined")throw new Error("list does not have an id");c.l.R[a.Ha]=b.length;b.push(c)}p++}}catch(u){}return b};
l.wb=function(a){var b=[];if(!a.o)return b;for(var d=0,c;c=a.o[d];d++){var e={};e.s=c.s.replace(/^\s\s*/,"").replace(/\s\s*$/,"");e.title=c.title||"";e.trigger=c.trigger||"key";e.hotkey=c.hotkey||"";e.action=c.action||"click";e.onEmpty=c.onEmpty||"";b.push(e)}return b};
l.dd=function(a,b){var d=this,c;this.I={};this.J={};this.K=[];this.H=[];var e;for(c=0;e=this.ca[c];c++)this.eb(e,this.I,this.J);c=[];this.qa=a.next||"";if(this.qa!=="")c=this.qa.split(" ");this.t(c,this.I,this.J,function(){d.Mc();d.jb()});c=[];this.ra=a.Oa||"";if(this.ra!=="")c=this.ra.split(" ");this.t(c,this.I,this.J,function(){d.Rc();d.jb()});var f;for(c=0;f=this.c[c];c++){var g={},k={};this.K.push(g);this.H.push(k);this.ja(f.Ja,c,"next");this.ja(f.Pa,c,"prev");this.ja(f.Ba,c,"fwd");this.ja(f.xa,
c,"back");this.kc(f.X,c,f.onEmpty);var p;for(p=0;e=f.o[p];p++)this.eb(e,g,k)}for(c=0;e=b[c];c++)this.jc(e.X,e.onEmpty);this.P=function(m){if(m.ctrlKey)return h;if(d.e.na)return h;if(m=d.nb(m.keyCode,m.charCode))return m()};document.addEventListener("keypress",this.P,h)};l.Ea=function(a){return a.aa.Ha};l.uc=function(a){for(var b=0;b<this.c.length;b++){var d=this.c[b];if(d.title==a)break}return b<this.c.length?b:-1};var w=function(a){this.j=a;this.$=1.5;this.padding=-1;this.Wc=0;this.ia=a.v();this.d=this.ia.createElement("span");this.d.style.backgroundColor="#CCE6FF";this.d.style.borderColor="#0000CC";this.d.style.borderWidth="medium";this.d.style.borderStyle="groove";this.d.style.position="absolute";this.d.style.display="none";this.ia.body.appendChild(this.d);this.fb=function(){}};w.ac={sd:0,Lb:1};l=w.prototype;
l.view=function(a){for(;this.d.firstChild;)this.d.removeChild(this.d.firstChild);if(a===i)this.d.style.display="none";else{var b=0,d=0,c=a;if(c.offsetParent){b=c.offsetLeft;d=c.offsetTop;for(c=c.offsetParent;c!==i;){b+=c.offsetLeft;d+=c.offsetTop;c=c.offsetParent}}this.d.appendChild(a.cloneNode(h));this.d.style.top=d+"px";this.d.style.left=b+"px";this.d.style.zIndex=999;this.d.style.display="block";this.vb()}};l.Sa=function(a){this.$=a;this.vb()};
l.vb=function(){this.ia.body.removeChild(this.d);this.Jc();this.tc();this.gc();this.ia.body.appendChild(this.d);this.fb&&this.fb(this.d);if(this.Wc==w.ac.Lb){var a=this;window.setTimeout(function(){a.d.scrollIntoView(h)},0)}};l.gc=function(){if(!(this.padding<0)){var a="//*[not(.//*)]";a=this.j.A(a,this.d);for(var b=0,d;d=a[b];b++)d.style.padding=this.padding+"px"}};
l.tc=function(){for(var a=this.d.getElementsByTagName("img"),b=0,d;d=a[b];b++){if(!d.hasAttribute("Axs_OrigHeight")){d.setAttribute("Axs_OrigHeight",d.height);d.setAttribute("Axs_OrigWidth",d.width)}d.height=d.getAttribute("Axs_OrigHeight")*this.$;d.width=d.getAttribute("Axs_OrigWidth")*this.$}};
l.Jc=function(){var a="fontSizeAdjust"in this.d.style;if(a){var b=this.$*0.52;this.d.style.fontSizeAdjust=b}else{b=this.$*100+"%";this.d.style.setProperty("font-size",b,"important")}b=this.d.getElementsByTagName("*");for(var d=0,c;c=b[d];d++){c.style.setProperty("line-height","normal","important");a||c.style.setProperty("font-size","100%","important")}};var x=function(a){var b="http://google-axsjax.googlecode.com/svn/trunk/";this.Cd=b+"common/earcons/axsEarcons.swf?sound=";this.la=i;this.kb=a;this.fd=b+"thirdparty/soundmanager2/";this.gd=i;this.rb=j;this.Id="minimal";this.zd=j;this.Dd=0};x.prototype.play=function(){};x.prototype.stop=function(){if(this.la){this.la.parentNode.removeChild(this.la);this.la=i}if(!this.kb)if(this.rb)this.gd.src=this.fd+"AxsJAX_SM2_Linker.html#AxsSoundCmd=Stop()"};
x.prototype.getTime=function(){if(this.kb)return-1;if(!this.rb)return-1;var a="Time=",b=unescape(document.location.hash);if(b.indexOf(a)==-1)return-1;a=b.indexOf(a)+a.length;return b=parseInt(b.substring(a),10)};var y=function(a,b){this.W=a;this.gb=this.n=this.u=this.i=this.q=i;this.ka="Enter Completion";this.Oc="No completions found";this.V=i;this.z=[];this.Kc={};this.h=-1;this.Ta=this.qb=j;this.ya="#000000";this.za=0;this.Gc={};this.ma={};this.yd={};if(b&&y.L)this.V=b;var d=this;this.U(window,y.ta.Xb,function(c){d.Pc.call(d,c)},i)};y.Fb=/^\<[A-Z|a-z|0-9|\-|\_]+\>$/;y.Rb=/^(\s|\r|\n)+/;y.Zb=/(\s|\r|\n)+$/;l=y.prototype;
l.U=function(a,b,d,c){if(y.L&&d)a.addEventListener(b,d,h);else y.m&&d&&a.attachEvent(b,function(g){d(g)});if(c){var e=new y.Xa(c),f=this;this.U(a,b,function(g){e.Fc(g,e,f)},i)}};
l.rc=function(a,b,d,c,e,f){var g=this,k,p,m,r,q;this.q&&this.q.parentNode.removeChild(this.q);do{k="completionField_"+Math.floor(Math.random()*1001);p="txt_"+k;r="div_"+k;q="bgdiv_"+k;m=document.getElementById(k)}while(m);m=document.createElement("div");m.id=q;m.style.display="none";q=document.createElement("div");q.id=k;q.style.position="absolute";k=document.createElement("input");k.type="text";k.id=p;k.size=b;k.value="";k.setAttribute("aria-owns",r);if(y.L)k.onkeypress=function(s){s.stopPropagation();
if(s.keyCode==y.B.ua)return j};if(k.readOnly=f)k.style.fontSize=0;b=document.createElement("div");b.id=r;b.setAttribute("tabindex",0);b.setAttribute("role","row");q.appendChild(b);q.appendChild(k);a.appendChild(m);a.appendChild(q);this.q=q;this.i=k;this.u=m;this.gb=b;this.q.className="pkHiddenStatus";this.i.className="pkOpaqueCompletionText";this.u.className="pkBackgroundHide";if(e){this.z=e;this.Kc[this.W]=[e,this.ka];this.f=this.z;for(a=0;e=this.z[a];a++)this.ma[e.toLowerCase()]=a;this.h=-1}this.U(this.i,
y.ta.fa,function(s){g.Ec.call(g,s,c,d)},i);this.U(this.i,y.ta.ea,function(s){g.Dc.call(g,s)},i);this.U(this.i,"blur",function(){g.qb&&g.Eb("hidden")},i)};l.Xc=function(a){this.qb=a};l.$c=function(a){this.ka=a};l.Zc=function(a){this.f=this.z=a;this.ma={};a=0;for(var b;b=this.z[a];a++)this.ma[b.toLowerCase()]=a;this.h=-1};
l.Eb=function(a,b,d,c){if(a=="visible"){this.q.className=="pkHiddenStatus"&&this.Q(this.ka);this.Ua(this.Ta,this.ya,this.za);this.q.className="pkVisibleStatus";var e=this.i;window.setTimeout(function(){e.focus()},0)}else if(a=="hidden"){if(y.m&&this.n)this.n.innerText="";else if(this.n)if(y.m)this.n.innerText="";else this.n.textContent="";this.Ua(j,this.ya,this.za);this.q.className="pkHiddenStatus";this.i.value="";this.h=-1}if(b){a=y.ob();d||(d=a.height-this.q.offsetHeight);c||(c=0);this.q.style.top=
d;this.q.style.left=c}};l.Pc=function(){var a=this;window.setTimeout(function(){a.Ta&&a.u.style.display=="block"&&a.Ua(a.Ta,a.ya,a.za)},0)};
l.Ec=function(a,b,d){if(this.i.value.length===0)this.f=this.z;if(a.keyCode!=y.B.fa&&a.keyCode!=y.B.ea&&a.keyCode!=y.B.S&&a.keyCode!=y.B.ua)if(this.i.value.length){this.f=this.pb(this.z,this.i.value,50);this.h=-1;if(this.f.length>0){this.Q(this.f[0]);this.h=0}else this.Q(this.Oc)}else this.Q(this.ka);if(a.keyCode==y.B.S)if(!this.i.readOnly){if(this.f&&this.f.length>0&&this.h>=0&&this.i.value!=this.f[this.h]&&(this.f[this.h].indexOf("<")<0||this.f[this.h].indexOf("<")>=0&&this.f[this.h].split(" ").length>
this.i.value.split(" ").length))this.Bb();var c=this.i.value;a=(y.m?this.n.innerText:this.n.textContent).toLowerCase();var e=a.indexOf("<"),f;if(e>=0){f=c.substr(0,e-1).toLowerCase();c=f+" "+c.substr(e)}else f=c=c.toLowerCase();e=j;if(b)e=this.ec.call(this,c,a,b);if(d&&!e){b=this.lb(c,a);d(f,this.ma[a],this.Gc[a],b)}this.i.value=""}};
l.Dc=function(a){if(a.keyCode==y.B.fa&&this.f&&this.f.length>0)this.Sc();else if(a.keyCode==y.B.ea&&this.f&&this.f.length>0)this.Nc();else a.keyCode==y.B.ua&&this.f&&this.f.length>0&&this.Bb()};l.Ua=function(a,b,d){if(a){this.u.className="pkBackgroundShow";this.u.style.display="block";a=y.ob();this.u.style.width=a.width+"px";this.u.style.height=a.height+"px";if(b)this.u.style.backgroundColor=b;d&&this.u.style.setProperty("-moz-opacity",d/100,"")}else this.u.style.display="none"};
l.pb=function(a,b,d){for(var c=a,e=a,f=b.split(" "),g=0,k;k=f[g];g++){e=c;c=[];if(k!==""){k=y.Vc(k);var p=new RegExp("(^|\\W+)"+k,"i");k=0;for(var m;m=e[k];k++)String(m).match(p)&&c.push(m)}}e=a;for(k=0;m=e[k];k++){a=m.split(" ");f=[];for(g=0;p=a[g];g++){if(p.charAt(0)=="<")break;f.push(p)}g=f.join(" ");b.indexOf(g)===0&&c.push(m)}c.length>d&&c.slice(0,d-1);return c};
l.lb=function(a,b){a=a.replace(/\s+/g," ");b=b.replace(/\s+/g," ");var d=b.indexOf("<");if(d<0)return[];b=b.substr(d);a=a.substr(d);d=a.split(",");var c=b.split(",");if(d.length!=c.length)return[];for(var e=[],f=0,g,k;(g=d[f])&&(k=c[f]);f++){g=y.tb(y.Ab(g));k=y.tb(y.Ab(k));k.match(y.Fb)&&e.push(g)}return e};l.ec=function(a,b,d){this.lb(a,b);if((a=d[b])&&a[this.W]){a=a[this.W]+"(args);";window.setTimeout(a,0);return h}else return j};
l.Sc=function(){if(this.h<0)this.h=0;this.h=(this.h||this.f.length)-1;this.h>=0&&this.Q(this.f[this.h])};l.Nc=function(){this.h=(this.h+1)%this.f.length;this.h<this.f.length&&this.Q(this.f[this.h])};l.Bb=function(){this.i.value=this.f[this.h>=0?this.h:0];this.f=this.pb(this.z,this.i.value,50);this.V&&y.L&&this.V.r(this.i.value);this.h=0};
l.Q=function(a){if(!this.n){this.n=document.createElement("div");this.n.id="listElem_"+Math.floor(Math.random()*1001);this.gb.appendChild(this.n)}if(y.m)this.n.innerText=a;else this.n.textContent=a;this.V&&y.L&&this.V.Va(this.n,j)};l.Ra=function(){y.Ra()};y.Xa=function(a){this.va=a};
y.Xa.prototype.Fc=function(a,b,d){if(b.va)if(a.keyCode){var c=""+a.keyCode,e=String.fromCharCode(a.keyCode).toLowerCase();if(a.ctrlKey){c="Ctrl+"+c;e="Ctrl+"+e}if(a.altKey){c="Alt+"+c;e="Alt+"+e}if(a.shiftKey){c="Shift+"+c;e="Shift+"+e}a=i;(a=b.va[e])||(a=b.va[c]);if(a)(b=a[d.W]?a[d.W]:a["*"])&&b()}};y.dc=function(a,b){this.width=a?a:undefined;this.height=b?b:undefined};y.tb=function(a){return a.replace(y.Rb,"")};y.Ab=function(a){return a.replace(y.Zb,"")};
y.Vc=function(a){return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08")};
y.ob=function(){var a=0,b=0;if(typeof window.innerWidth=="number"){a=window.innerWidth;b=window.innerHeight}else if(document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)){a=document.documentElement.clientWidth;b=document.documentElement.clientHeight}else if(document.body&&(document.body.clientWidth||document.body.clientHeight)){a=document.body.clientWidth;b=document.body.clientHeight}return new y.dc(a,b)};y.m=j;y.L=j;
y.Yc=function(){var a=navigator.userAgent.toLowerCase();y.L=a.indexOf("gecko")!=-1;y.m=a.indexOf("msie")!=-1&&a.indexOf("opera")==-1};y.Yc();y.ta={fa:y.m?"onkeyup":"keyup",ea:y.m?"onkeydown":"keydown",rd:y.m?"onkeypress":"keypress",md:y.m?"onclick":"click",Xb:y.m?"onresize":"resize",pd:y.m?"onfocus":"focus",ld:y.m?"onblur":"blur"};y.hb=".pkHiddenStatus {display: none; position: absolute;}.pkVisibleStatus {display: block; position: absolute; left: 2px; top: 2px; line-height: 1.2em; z-index: 10001; background-color: #000000; padding: 2px; color: #fff; font-family: Arial, Sans-serif; font-size: 20px; filter: alpha(opacity=80); -moz-opacity: .80;}.pkOpaqueCompletionText {border-style: none; background-color:transparent; font-family: Arial, Helvetica, sans-serif; font-size: 35px; font-weight: bold; color: #fff; width: 1000px; height: 50px;}.pkBackgroundShow {position: absolute; width: 0px;height: 0px; background-color: #000000; filter: alpha(opacity=70);  -moz-opacity: .70; left: 0px; top: 0px; z-index: 10000;}";
y.Ra=function(){var a,b;if(a=document.getElementsByTagName("head")[0]){b=document.createElement("style");b.type="text/css";if(y.m)b.Fd=y.hb;else if(y.L)b.innerHTML=y.hb;a.appendChild(b)}};y.vd=function(a){var b=document.getElementsByTagName("head")[0],d=document.createElement("link");d.type="text/css";d.rel="stylesheet";d.href=a;b.appendChild(d)};y.B={fa:38,ea:40,S:13,ua:9};var axsFinance={};axsFinance.b={td:"+",ga:"up by ",Kb:"-",da:"down by ",cc:"-",bc:"to ",Wb:"{0}, {1}, change {2}.",Mb:"Google Finance",Yb:"results from",Pb:"{0}, open {1}, high {2}, low {3}, close {4}, volume {5}."};axsFinance.Gb='<cnr next="RIGHT l" prev="LEFT h"><target title="Markets" hotkey="m">(//li[@class="nav-item"])[1]//a</target><target title="News" hotkey="e">(//li[@class="nav-item"])[2]//a</target><target title="Portfolios" hotkey="o">(//li[@class="nav-item"])[3]//a</target><target title="Stock screener" hotkey="s">(//li[@class="nav-item"])[4]//a</target><target title="Google domestic trends" hotkey="g">(//li[@class="nav-item"])[5]//a</target><target title="Create portfolio from quotes" hotkey="t" onEmpty="No recent quotes.">id("rq-create")</target><target title="Go to link" hotkey="ENTER">.//descendant-or-self::a</target><list title="Recent quotes" next="DOWN j" prev="UP k" fwd="n" back="p" type="dynamic" onEmpty="No recent quotes"><item action="CALL:axsFinance.readRecentQuote">id("rq")//tr</item></list><list title="Recent activity" next="DOWN j" prev="UP k" fwd="n" back="p" type="dynamic" onEmpty="No recent activities"><item>//li[@class="ra-entry"]//a</item></list><list title="Historical prices" next="DOWN j" prev="UP k" fwd="n" back="p" type="dynamic" onEmpty="No historical prices"><item action="CALL:axsFinance.readHistoricalPrice">id("historical_price")//tr[not(@class="bb" or @class="tptr")]</item><target title="Begin date" hotkey="b" onEmpty="No recent quotes.">id("fromdate")</target><target title="End date" hotkey="d" onEmpty="No recent quotes.">id("todate")</target><target title="Daily" hotkey="y">//div[contains(@class,"gf-table-control")]//a[contains(@href,"daily")]</target><target title="Weekly" hotkey="w">//div[contains(@class,"gf-table-control")]//a[contains(@href,"weekly")]</target><target title="Next page wrap" trigger="listTail">//div[@class="SP_arrow_next"]</target><target title="Previous page wrap" trigger="listHead">//div[@class="SP_arrow_previous"]</target><target title="Next page" hotkey="x">//div[@class="SP_arrow_next"]</target><target title="Previous page" hotkey="r">//div[@class="SP_arrow_previous"]</target><target title="Last page" hotkey="]">//div[@class="SP_arrow_last"]</target><target title="First page" hotkey="[" onEmpty="No previous pate">//div[@class="SP_arrow_first"]</target></list></cnr>';
axsFinance.Ma={};axsFinance.Ma[axsFinance.b.cc]=axsFinance.b.bc;axsFinance.Na={};axsFinance.Na[axsFinance.b.Kb]=axsFinance.b.da;axsFinance.Na[axsFinance.b.ud]=axsFinance.b.ga;axsFinance.hd={};axsFinance.j=i;axsFinance.G=i;axsFinance.N=i;axsFinance.xd=i;axsFinance.Gd=i;axsFinance.Z=2.5;
axsFinance.Hc=function(){axsFinance.j=new n(h);axsFinance.G=new o(axsFinance.j);axsFinance.G.Lc(axsFinance.Gb,i);axsFinance.N=new w(axsFinance.j);axsFinance.G.ad(axsFinance.N);axsFinance.N.Sa(axsFinance.Z);axsFinance.lc=new x(h);axsFinance.G.cd(axsFinance.lc);axsFinance.Qc=new y("list",axsFinance.j);axsFinance.G.bd(axsFinance.Qc,".");document.addEventListener("keypress",axsFinance.P,h);document.addEventListener("DOMNodeInserted",axsFinance.Uc,j);axsFinance.ic()};
axsFinance.ic=function(){var a='//h3[following-sibling::a[@class="norm"]]',b=axsFinance.j.A(a,document.body)[0];a='//div[contains(@class,"gf-table-control")]//a';a=axsFinance.j.A(a,document.body)[0];b=axsFinance.b.Mb+", "+axsFinance.Ka(b.textContent)+", "+axsFinance.Ka(a.textContent)+"  "+axsFinance.b.Yb+" "+axsFinance.zc();axsFinance.j.r(b,j)};axsFinance.Uc=function(a){a.target.className==="d-quotes"&&axsFinance.G.Tc("Recent quotes")};
axsFinance.zc=function(){var a='//div[@class="tpsd"]';a=axsFinance.j.A(a,document.body)[0];return axsFinance.La(a.textContent)};axsFinance.readHistoricalPrice=function(a){a=a.l;for(var b=[],d=1,c;c=a.childNodes[d];d++)b.push(axsFinance.La(c.textContent));b=axsFinance.yb(axsFinance.b.Pb,b);axsFinance.Cb(a,b)};
axsFinance.readRecentQuote=function(a){a=a.l;var b="./td[not(.//b)]";b=axsFinance.j.A(b,a);for(var d=[],c=0,e=b.length;c<e;c++){d[c]=axsFinance.Ac(b[c]);d[c]=axsFinance.La(d[c])}b=axsFinance.yb(axsFinance.b.Wb,d);axsFinance.Cb(a,b)};axsFinance.Ac=function(a){var b="",d='.//descendant-or-self::*[not(contains(@style,"display: none;"))]/text()';a=axsFinance.j.A(d,a);d=0;for(var c=a.length;d<c;d++)b=b+a[d].textContent+" ";return b};
axsFinance.Cb=function(a,b){axsFinance.N.view(a);axsFinance.j.r(b);a.scrollIntoView(h);axsFinance.j.pa(a)};axsFinance.yb=function(a,b){for(var d=new String(a),c=0;c<b.length;c++){var e=new RegExp("{("+c+")}","g");d=d.replace(e,b[c])}return d};
axsFinance.La=function(a){var b="";if(a==="")return a;a=axsFinance.Ka(a);var d=axsFinance.Ma[a];if(d!=undefined)return d;a=a.split(" ");for(d=0;a[d];d++){var c=a[d],e=axsFinance.Ma[c];if(e!=undefined)c=e;else{if(c.length>0&&c.charAt(0)==="(")c=c.substring(1);if(c.length>1&&c.charAt(c.length-1)===")")c=c.substring(0,c.length-1);e=axsFinance.Na[c.charAt(0)];if(e!=undefined)c=e+" "+c.substring(1);e=c.charAt(c.length-1);e=axsFinance.hd[e];if(e!=undefined)c=c.substring(0,c.length-1)+" "+e}b=b+" "+c}return b};
axsFinance.Ka=function(a){a=a.replace(/^\s\s*/,"").replace(/\s\s*$/,"");a=a.replace(/\s+/g," ");return a.replace(/\n+/g,"").replace(/\r+/g,"")};axsFinance.P=function(a){if(a.ctrlKey)return h;if(a.keyCode==27){axsFinance.j.C.blur();return j}if(axsFinance.j.na)return h;if(a=axsFinance.oc[a.charCode])return a();return h};
axsFinance.oc={47:function(){document.getElementById("searchbox").focus();document.getElementById("searchbox").select();return j},63:function(){var a=axsFinance.qd+axsFinance.G.Ic()+axsFinance.G.Bc();axsFinance.j.r(a);return j},45:function(){axsFinance.Z-=0.1;axsFinance.N.Sa(axsFinance.Z);return j},61:function(){axsFinance.Z+=0.1;axsFinance.N.Sa(axsFinance.Z);return j}};window.addEventListener("load",axsFinance.Hc,h); })();
