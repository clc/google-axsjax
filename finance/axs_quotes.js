(function() { var h=true,i=null,j=false,l,n=function(a){this.yc=0;this.ea=i;this.Pb=j;this.A=i;this.sa=j;var b=this;this.Ba=document.body;this.md();if(a){this.Pb=h;document.addEventListener("keypress",function(d){b.le(d,b)},h);document.body.oe=h}this.P(document.body,"role","application")};l=n.prototype;
l.md=function(){var a=this.z(),b=this,d=function(c){b.A=c.target;if(c.target.tagName=="INPUT"||c.target.tagName=="SELECT"||c.target.tagName=="TEXTAREA")b.sa=h;return h};a.addEventListener("focus",d,h);d=function(c){b.Ta(b.A,"aria-activedescendant");b.A=i;if(c.target.tagName=="INPUT"||c.target.tagName=="SELECT"||c.target.tagName=="TEXTAREA")b.sa=j;return h};a.addEventListener("blur",d,h)};l.z=function(){for(var a=this.Ba;a.nodeType!=9;)a=a.parentNode;return a};
l.Ya=function(a,b){a.id||this.jb(a);if(b){this.P(a,"live","rude");this.P(a,"atomic","true");var d=this.z();d=d.createElement("div");d.textContent=" ";d.name="AxsJAX_dummyNode";a.lastChild&&a.lastChild.name&&a.lastChild.name==d.name&&a.removeChild(a.lastChild);a.appendChild(d)}else{var c=this.Ed(a,"role");this.P(a,"role","row");d=this.A;if(!d||d.nodeType==9){this.Ba.tabIndex=-1;d=this.Ba}this.P(d,"activedescendant",i);d.focus&&d.focus();this.P(d,"activedescendant",a.id);var e=this;window.setTimeout(function(){c?
e.P(a,"role",c):e.Ta(a,"role")},0)}};
l.p=function(a,b){var d="AxsJAX_pixelAudioNode",c="AxsJAX_pixelAudioNode",e="data:image/gif;base64,R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",f=this.z(),g=i;if(b){if(b.previousSibling&&b.previousSibling.name==c)g=b.previousSibling;else{g=f.createElement("img");g.name=c;g.setAttribute("tabindex",0);g.style.outline="none";g.src=e;b.parentNode.insertBefore(g,b);this.Ad(g)}g.setAttribute("alt",a);g.setAttribute("title",a);window.setTimeout(function(){g.blur();g.focus()},0)}else{if((g=
f.getElementById(d))&&g.alt==a)a+=" ";if(!g){g=f.createElement("img");g.id=d;g.src=e;f.body.appendChild(g)}g.setAttribute("alt",a);g.setAttribute("title",a);this.Ya(g)}};
l.nb=function(a,b){var d=this.z(),c=d.createEvent("MouseEvents");c.initMouseEvent("mousedown",h,h,d.defaultView,1,0,0,0,0,j,j,b,j,0,i);try{a.dispatchEvent(c)}catch(e){}c=d.createEvent("MouseEvents");c.initMouseEvent("mouseup",h,h,d.defaultView,1,0,0,0,0,j,j,b,j,0,i);try{a.dispatchEvent(c)}catch(f){}c=d.createEvent("MouseEvents");c.initMouseEvent("click",h,h,d.defaultView,1,0,0,0,0,j,j,b,j,0,i);try{a.dispatchEvent(c)}catch(g){}d=a.getAttribute("href");if(a.tagName=="A"&&d&&d!="#")if(b)window.open(a.href);
else document.location=a.href};l.jb=function(a,b){if(!a)return"";if(a.id)return a.id;var d=b||"AxsJAX_ID_";a.id=d+this.yc++;return a.id};l.ua=function(a){if(!a)return j;if(a.tagName=="A"||a.tagName=="INPUT"){this.ea=a;return h}a=a.getElementsByTagName("*");for(var b=0,d;d=a[b];b++)if(d.tagName=="A"||d.tagName=="INPUT"||d.hasAttribute("tabindex")&&d.tabIndex!=-1){this.ea=d;return h}return j};l.le=function(a,b){if(!b.Pb)return h;if(a.keyCode==9&&b.ea){b.ea.focus();b.ea=i}return h};
l.Hd=function(a){this.Ya(a);a.scrollIntoView(h);this.ua(a)};l.P=function(a,b,d){if(a){b=b.toLowerCase();switch(b){case "live":b="aria-live";break;case "activedescendant":b="aria-activedescendant";break;case "atomic":b="aria-atomic";break;default:break}a.setAttribute(b,d)}};l.Ed=function(a,b){return a.getAttribute(b)};l.Ta=function(a,b){a&&a.removeAttribute&&a.removeAttribute(b)};
l.Ad=function(a){a=this.jb(a);var b=this.z(),d=b.baseURI,c=d.indexOf("#");if(c!=-1)d=d.substring(0,c);b.location=d+"#"+a};l.t=function(a,b){try{var d=b.ownerDocument.evaluate(a,b,i,XPathResult.ORDERED_NODE_ITERATOR_TYPE,i)}catch(c){return[]}for(var e=[],f=d.iterateNext();f;f=d.iterateNext())e.push(f);return e};n.Me=function(a){window.addEventListener("load",function(){a()},h)};var o=function(a){this.wa=this.va="";this.e=[];this.b=0;this.i=[];this.q=i;this.fa=[];this.J={};this.K={};this.M=[];this.I=[];this.g=a;this.G=this.B=this.F=i;this.Bc="list";this.bb="item";this.ib="wrap";this.R=i};o.a={Mc:"next list",Uc:"previous list",wc:"go forward",vc:"go backwards",ec:"cycle next",fc:"cycle previous",ad:"Select available action",Oc:"No available actions",eb:"Page up",db:"Page down",U:"Enter",ue:"Escape",re:"Delete",la:"Up",ha:"Down",cb:"Left",hb:"Right"};l=o.prototype;
l.fe=function(a,b){if(b){this.B=a;this.B.k===i&&this.xd();var d=this,c=new Array(b);this.v(c,this.J,this.K,function(){d.Ob()})}};l.$a=function(a){var b=h;if(a.type=="dynamic"&&a.m.length===0){this.F!==i&&this.F.view(i);a.m=this.ta(a.ca);a.r=this.Fb(a.ca);if(this.e[this.b]===a)this.i[this.b]=-1;else for(var d=0,c;c=this.e[d];d++)if(c===a){this.i[d]=-1;break}}if(a.m.length===0&&a.Ga===i)b=j;return b};
l.rb=function(){var a=this.Q();a=a.Ga;var b=i;if(a!==i){this.ma(a);b=this.Ia(a.action)}if(b===i){this.od();this.G!==i&&this.G.play(this.Bc)}};l.Rd=function(){if(this.e.length<1)return i;for(var a=0;this.e[a];a++){this.b++;if(this.b>=this.e.length)this.b=0;if(this.$a(this.e[this.b]))break}return this.Q()};l.Wd=function(){if(this.e.length<1)return i;for(var a=0;this.e[a];a++){this.b--;if(this.b<0)this.b=this.e.length-1;if(this.$a(this.e[this.b]))break}return this.Q()};l.Q=function(){return this.e[this.b]};
l.od=function(){this.g.p(this.Q().title)};l.Oa=function(){if(this.e.length<1)return i;var a=this.e[this.b],b=a.m;if(b.length<1)return i;if(this.q){var d=this.Ka(a);d=this.q.l.T[d];if(typeof d!="undefined")this.i[this.b]=d}this.i[this.b]++;d=j;if(this.i[this.b]>=b.length){this.i[this.b]=0;d=h}var c=this.i[this.b];if(b[c].l.parentNode===i){this.F!==i&&this.F.view(i);a.m=this.ta(a.ca);this.i[this.b]=0;c=this.i[this.b]}this.q=b[c];if(this.G!==i)d?this.G.play(this.ib):this.G.play(this.bb);return this.q};
l.Cd=function(){var a=this.e[this.b],b=this.i[this.b];if(a.Za!==i&&b+1>=a.m.length){this.ma(a.Za);this.i[this.b]=0;return i}return a=this.Oa()};
l.Jb=function(){if(this.e.length<1)return i;var a=this.e[this.b],b=a.m;if(b.length<1)return i;if(this.q){var d=this.Ka(a);d=this.q.l.T[d];if(typeof d!="undefined")this.i[this.b]=d}this.i[this.b]--;d=j;if(this.i[this.b]<0){this.i[this.b]=b.length-1;d=h}var c=this.i[this.b];if(b[c].l.parentNode===i){this.F!==i&&this.F.view(i);a.m=this.ta(a.ca);this.i[this.b]=a.m.length;c=this.i[this.b]}this.q=b[c];if(this.G!==i)d?this.G.play(this.ib):this.G.play(this.bb);return this.q};
l.sd=function(){var a=this.e[this.b],b=this.i[this.b];if(a.Ma!==i&&b<=0){this.ma(a.Ma);this.i[this.b]=a.m.length-1;return i}return a=this.Jb()};l.qb=function(){if(this.e.length<1)return i;var a=this.e[this.b];if(this.q){var b=this.Ka(a);b=this.q.l.T[b];if(typeof b!="undefined")this.i[this.b]=b}a=a.m;b=this.i[this.b];return this.q=a[b]};l.Ia=function(a){var b=i;if(a!==i&&a.indexOf&&a.indexOf("CALL:")===0&&a.indexOf("(")===-1)try{b=eval(a.substring(5))}catch(d){}return b};
l.V=function(a){if(a!==i){var b=this,d=function(){var f=b.Ia(a.action);if(f)f(a);else{b.F!==i&&b.F.view(a.l);b.g.Hd(a.l)}};if(this.g.A&&this.g.A.blur){var c=this.g.A;this.g.A=i;c.removeAttribute&&this.g.Ta(c,"aria-activedescendant");var e=function(f){f.target.removeEventListener("blur",e,h);d()};c.addEventListener("blur",e,h);c.blur()}else d()}else{c=this.e[this.b];c.type=="dynamic"&&this.g.p(c.onEmpty)}};
l.v=function(a,b,d,c){for(var e=0,f;f=a[e];e++)if(f=="LEFT")d[37]=c;else if(f=="UP")d[38]=c;else if(f=="RIGHT")d[39]=c;else if(f=="DOWN")d[40]=c;else if(f=="PGUP")d[33]=c;else if(f=="PGDOWN")d[34]=c;else if(f=="ENTER")d[13]=c;else if(f=="ESC")d[27]=c;else if(f=="DEL")d[46]=c;else b[f.charCodeAt(0)]=c};
l.oa=function(a,b,d){var c=[];if(a!==""){c=a.split(" ");var e=this;if(d=="prev")this.v(c,this.M[b],this.I[b],function(){e.V(e.Jb())});else if(d=="next")this.v(c,this.M[b],this.I[b],function(){e.V(e.Oa())});else d=="back"?this.v(c,this.M[b],this.I[b],function(){var f=e.sd();f!==i&&e.V(f)}):this.v(c,this.M[b],this.I[b],function(){var f=e.Cd();f!=i&&e.V(f)})}};l.rd=function(a,b,d){var c=[];if(a!==""){c=a.split(" ");var e=this;this.v(c,this.J,this.K,function(){if(e.$a(e.e[b])){e.b=b;e.V(e.Oa())}else e.g.p(d)})}};
l.qd=function(a,b){var d=[];if(a!==""){d=a.split(" ");var c=this;this.v(d,this.J,this.K,function(){c.g.p(b)})}};l.kb=function(a,b,d){var c=[];if(a.hotkey!==""){c=a.hotkey.split(" ");var e=this;this.v(c,b,d,function(){e.ma(a)})}};l.ma=function(a){a.action=="click"?this.vd(a):this.td(a)};l.td=function(a){var b=this.ub(a);if(b.length<1)this.g.p(a.onEmpty);else{var d=this.Ia(a.action);if(d){var c={};c.action=a.action;c.l=b[0];d(c);this.g.ua(b[0])}else throw new Error("Invalid action: "+a.action);}};
l.vd=function(a){var b=this.ub(a);if(b.length<1)this.g.p(a.onEmpty);else{this.g.nb(b[0],j);b[0].scrollIntoView(h);this.g.ua(b[0])}};l.ub=function(a){a=a.u;var b=this.g.z().documentElement;if(a.indexOf(".")===0)b=this.qb().l;return this.g.t(a,b)};l.vb=function(a,b){var d=i,c=this.b;if(c<this.I.length)d=this.I[c][a]||this.M[c][b]||i;if(d===i)d=this.K[a]||this.J[b];return d};
l.Qd=function(a,b){var d={};d.Db=[];var c=new DOMParser,e=c.parseFromString(a,"text/xml"),f=e.getElementsByTagName("list"),g;for(c=0;g=f[c];c++){var k={};k.title=g.getAttribute("title");k.hotkey=g.getAttribute("hotkey");k.next=g.getAttribute("next");k.Ra=g.getAttribute("prev");k.Bd=g.getAttribute("fwd");k.back=g.getAttribute("back");k.onEmpty=g.getAttribute("onEmpty");k.type=g.getAttribute("type");var p,m,r,q;k.m=[];var s=g.getElementsByTagName("item");for(p=0;m=s[p];p++){var u={};u.u=m.textContent;
if(m.attributes instanceof NamedNodeMap){r=m.attributes;q=r.length;for(m=0;m<q;m++){var t=r.item(m);u[t.nodeName]=t.value}}k.m.push(u)}k.r=[];s=g.getElementsByTagName("target");for(p=0;m=s[p];p++){g={};g.u=m.textContent;if(m.attributes instanceof NamedNodeMap){r=m.attributes;q=r.length;for(m=0;m<q;m++){t=r.item(m);g[t.nodeName]=t.value}}k.r.push(g)}d.Db.push(k)}d.r=[];var v=e.firstChild;for(c=0;e=v.childNodes[c];c++)if(e.tagName=="target"){g={};g.u=e.textContent;if(e.attributes instanceof NamedNodeMap){r=
e.attributes;q=r.length;for(m=0;m<q;m++){t=r.item(m);g[t.nodeName]=t.value}}d.r.push(g)}d.next=v.getAttribute("next");d.Ra=v.getAttribute("prev");if(b===i||typeof b=="undefined")this.Gb(d,b);else{c=new (function(C,z,A,B){b(v,z,A,B)});this.Gb(d,c)}};
l.Gd=function(){for(var a=this.Ja(),b="",d=0,c;c=a[d];d++)b=b+c.$+", "+c.title+". ";b=b+this.va+", "+o.a.Mc;b=b+this.wa+", "+o.a.Uc;b=b.replace("PGUP",o.a.eb);b=b.replace("PGDOWN",o.a.db);b=b.replace("ENTER",o.a.U);b=b.replace("DEL",o.a.ic);b=b.replace("UP",o.a.la);b=b.replace("DOWN",o.a.ha);b=b.replace("LEFT",o.a.cb);return b=b.replace("RIGHT",o.a.hb)};
l.Nd=function(){for(var a=this.La(),b="",d=0,c;c=a[d];d++)b=b+c.$+", "+c.title+". ";a=this.Q();if(a.Pa!=="")b=b+a.Pa+", "+o.a.ec+". ";if(a.Sa!=="")b=b+a.Sa+", "+o.a.fc+". ";if(a.Ha!=="")b=b+a.Ha+", "+o.a.wc+". ";if(a.Ca!=="")b=b+a.Ca+", "+o.a.vc+". ";b=b.replace("PGUP",o.a.eb);b=b.replace("PGDOWN",o.a.db);b=b.replace("ENTER",o.a.U);b=b.replace("DEL",o.a.ic);b=b.replace("UP",o.a.la);b=b.replace("DOWN",o.a.ha);b=b.replace("LEFT",o.a.cb);return b=b.replace("RIGHT",o.a.hb)};l.ee=function(a){this.F=a};
l.ge=function(a){this.G=a};l.Ob=function(){if(this.B!==i){var a=this.Ja(),b=this.La();if(a.length+b.length===0)this.g.p(o.a.Oc);else{var d=[],c=0,e="";for(c=0;e=b[c];c++)d.push(e.title);for(c=0;e=a[c];c++)d.push(e.title);this.B.ce(d);this.B.Qb("visible",h,40,20)}}};l.Ja=function(){for(var a=[],b,d=0,c;c=this.e[d];d++)if(c.Z!==""){b={};b.title=c.title;b.$=c.Z;a.push(b)}for(d=0;c=this.fa[d];d++)if(this.Bb(c)){b={};b.title=c.title;b.$=c.hotkey;a.push(b)}return a};
l.La=function(){for(var a=[],b=this.Q(),d=0,c;c=b.r[d];d++)if(this.Bb(c)){var e={};e.title=c.title;e.$=c.hotkey;a.push(e)}return a};
l.xd=function(){var a=this.g.z().body,b=this,d=function(c,e){var f=b.La(),g=b.Ja();f=f.concat(g);f=f[e].$;f=f.split(" ")[0];var k=g=-1;if(f=="LEFT")g=37;else if(f=="UP")g=38;else if(f=="RIGHT")g=39;else if(f=="DOWN")g=40;else if(f=="PGUP")g=33;else if(f=="PGDOWN")g=34;else if(f=="ENTER")g=13;else if(f=="DEL")g=46;else if(f=="ESC")g=27;else k=f.charCodeAt(0);b.B.k.blur();(f=b.vb(g,k))&&f()};this.B.wd(a,50,d,i,this.Ee,j);this.B.de(o.a.ad);this.B.ae(h);this.B.Ua()};
l.Bb=function(a){var b=j;if(a.hotkey!==""){a=a.u;var d=this.g.z().body;if(a.indexOf(".")===0){var c=this.qb();if(c)d=c.l}a=this.g.t(a,d);if(a.length>0)b=h}return b};
l.Gb=function(a,b){this.e=[];this.b=0;this.i=[];var d=[],c,e;for(c=0;e=a.Db[c];c++){var f={};e.Na=c;f.He=i;f.ca=e;f.title=e.title||"";f.Z=e.hotkey||"";f.Pa=e.next||"";f.Sa=e.Ra||"";f.Ha=e.Bd||"";f.Ca=e.back||"";f.onEmpty=e.onEmpty||"";f.type=e.type||"";f.Za=i;f.Ma=i;f.Ga=i;f.m=this.ta(e);f.r=this.Fb(e);e=0;for(var g;g=f.r[e];e++)if(g.trigger=="listTail")f.Za=g;else if(g.trigger=="listHead")f.Ma=g;else if(g.trigger=="listEntry")f.Ga=g;if(f.m.length>0||f.type=="dynamic"){this.e.push(f);this.i.push(-1)}else f.Z!==
""&&d.push(f)}this.fa=[];this.Oe=0;if(a.r)for(c=0;f=a.r[c];c++){e={};e.u=f.u;e.u=e.u.replace(/^\s\s*/,"").replace(/\s\s*$/,"");e.title=f.title||"";e.trigger=f.trigger||"key";e.hotkey=f.hotkey||"";e.action=f.action||"click";e.onEmpty=f.onEmpty||"";this.fa.push(e)}this.R!==i&&document.removeEventListener("keypress",this.R,h);b===i||typeof b=="undefined"?this.he(a,d):b(a,this.e,d,this.fa)};
l.ta=function(a){var b=[];if(!a.m)return b;for(var d=0,c;c=a.m[d];d++)try{var e=c.u.replace(/^\s\s*/,"").replace(/\s\s*$/,""),f=this.g.z().documentElement,g=this.g.t(e,f),k=c.index||"0",p=parseInt(k,10),m=g.length-p,r=c.Ie||"*";if(r!="*")m=parseInt(r,10);for(var q=m+p,s=c.action||i;p<q;){c={};c.action=s;c.l=g[p];if(typeof c.l!="undefined"){if(typeof c.l.T=="undefined")c.l.T={};if(typeof a.Na=="undefined")throw new Error("list does not have an id");c.l.T[a.Na]=b.length;b.push(c)}p++}}catch(u){}return b};
l.Fb=function(a){var b=[];if(!a.r)return b;for(var d=0,c;c=a.r[d];d++){var e={};e.u=c.u.replace(/^\s\s*/,"").replace(/\s\s*$/,"");e.title=c.title||"";e.trigger=c.trigger||"key";e.hotkey=c.hotkey||"";e.action=c.action||"click";e.onEmpty=c.onEmpty||"";b.push(e)}return b};
l.he=function(a,b){var d=this,c;this.J={};this.K={};this.M=[];this.I=[];var e;for(c=0;e=this.fa[c];c++)this.kb(e,this.J,this.K);c=[];this.va=a.next||"";if(this.va!=="")c=this.va.split(" ");this.v(c,this.J,this.K,function(){d.Rd();d.rb()});c=[];this.wa=a.Ra||"";if(this.wa!=="")c=this.wa.split(" ");this.v(c,this.J,this.K,function(){d.Wd();d.rb()});var f;for(c=0;f=this.e[c];c++){var g={},k={};this.M.push(g);this.I.push(k);this.oa(f.Pa,c,"next");this.oa(f.Sa,c,"prev");this.oa(f.Ha,c,"fwd");this.oa(f.Ca,
c,"back");this.rd(f.Z,c,f.onEmpty);var p;for(p=0;e=f.r[p];p++)this.kb(e,g,k)}for(c=0;e=b[c];c++)this.qd(e.Z,e.onEmpty);this.R=function(m){if(m.ctrlKey)return h;if(d.g.sa)return h;if(m=d.vb(m.keyCode,m.charCode))return m()};document.addEventListener("keypress",this.R,h)};l.Ka=function(a){return a.ca.Na};var w=function(a){this.f=a;this.ba=1.5;this.padding=-1;this.Zd=0;this.na=a.z();this.d=this.na.createElement("span");this.d.style.backgroundColor="#CCE6FF";this.d.style.borderColor="#0000CC";this.d.style.borderWidth="medium";this.d.style.borderStyle="groove";this.d.style.position="absolute";this.d.style.display="none";this.na.body.appendChild(this.d);this.mb=function(){}};w.cd={Ae:0,rc:1};l=w.prototype;
l.view=function(a){for(;this.d.firstChild;)this.d.removeChild(this.d.firstChild);if(a===i)this.d.style.display="none";else{var b=0,d=0,c=a;if(c.offsetParent){b=c.offsetLeft;d=c.offsetTop;for(c=c.offsetParent;c!==i;){b+=c.offsetLeft;d+=c.offsetTop;c=c.offsetParent}}this.d.appendChild(a.cloneNode(h));this.d.style.top=d+"px";this.d.style.left=b+"px";this.d.style.zIndex=999;this.d.style.display="block";this.Eb()}};l.Va=function(a){this.ba=a;this.Eb()};
l.Eb=function(){this.na.body.removeChild(this.d);this.Od();this.zd();this.nd();this.na.body.appendChild(this.d);this.mb&&this.mb(this.d);if(this.Zd==w.cd.rc){var a=this;window.setTimeout(function(){a.d.scrollIntoView(h)},0)}};l.nd=function(){if(!(this.padding<0)){var a="//*[not(.//*)]";a=this.f.t(a,this.d);for(var b=0,d;d=a[b];b++)d.style.padding=this.padding+"px"}};
l.zd=function(){for(var a=this.d.getElementsByTagName("img"),b=0,d;d=a[b];b++){if(!d.hasAttribute("Axs_OrigHeight")){d.setAttribute("Axs_OrigHeight",d.height);d.setAttribute("Axs_OrigWidth",d.width)}d.height=d.getAttribute("Axs_OrigHeight")*this.ba;d.width=d.getAttribute("Axs_OrigWidth")*this.ba}};
l.Od=function(){var a="fontSizeAdjust"in this.d.style;if(a){var b=this.ba*0.52;this.d.style.fontSizeAdjust=b}else{b=this.ba*100+"%";this.d.style.setProperty("font-size",b,"important")}b=this.d.getElementsByTagName("*");for(var d=0,c;c=b[d];d++){c.style.setProperty("line-height","normal","important");a||c.style.setProperty("font-size","100%","important")}};var x=function(a){var b="http://google-axsjax.googlecode.com/svn/trunk/";this.Je=b+"common/earcons/axsEarcons.swf?sound=";this.qa=i;this.sb=a;this.ie=b+"thirdparty/soundmanager2/";this.je=i;this.Ab=j;this.Pe="minimal";this.Ge=j;this.Le=0};x.prototype.play=function(){};x.prototype.stop=function(){if(this.qa){this.qa.parentNode.removeChild(this.qa);this.qa=i}if(!this.sb)if(this.Ab)this.je.src=this.ie+"AxsJAX_SM2_Linker.html#AxsSoundCmd=Stop()"};
x.prototype.getTime=function(){if(this.sb)return-1;if(!this.Ab)return-1;var a="Time=",b=unescape(document.location.hash);if(b.indexOf(a)==-1)return-1;a=b.indexOf(a)+a.length;return b=parseInt(b.substring(a),10)};var y=function(a,b){this.Y=a;this.ob=this.o=this.w=this.k=this.s=i;this.pa="Enter Completion";this.Td="No completions found";this.X=i;this.C=[];this.Pd={};this.j=-1;this.Wa=this.zb=j;this.Da="#000000";this.Ea=0;this.Ld={};this.ra={};this.Fe={};if(b&&y.N)this.X=b;var d=this;this.W(window,y.ya.Yc,function(c){d.Ud.call(d,c)},i)};y.cc=/^\<[A-Z|a-z|0-9|\-|\_]+\>$/;y.Ac=/^(\s|\r|\n)+/;y.Zc=/(\s|\r|\n)+$/;l=y.prototype;
l.W=function(a,b,d,c){if(y.N&&d)a.addEventListener(b,d,h);else y.n&&d&&a.attachEvent(b,function(g){d(g)});if(c){var e=new y.ab(c),f=this;this.W(a,b,function(g){e.Kd(g,e,f)},i)}};
l.wd=function(a,b,d,c,e,f){var g=this,k,p,m,r,q;this.s&&this.s.parentNode.removeChild(this.s);do{k="completionField_"+Math.floor(Math.random()*1001);p="txt_"+k;r="div_"+k;q="bgdiv_"+k;m=document.getElementById(k)}while(m);m=document.createElement("div");m.id=q;m.style.display="none";q=document.createElement("div");q.id=k;q.style.position="absolute";k=document.createElement("input");k.type="text";k.id=p;k.size=b;k.value="";k.setAttribute("aria-owns",r);if(y.N)k.onkeypress=function(s){s.stopPropagation();
if(s.keyCode==y.D.za)return j};if(k.readOnly=f)k.style.fontSize=0;b=document.createElement("div");b.id=r;b.setAttribute("tabindex",0);b.setAttribute("role","row");q.appendChild(b);q.appendChild(k);a.appendChild(m);a.appendChild(q);this.s=q;this.k=k;this.w=m;this.ob=b;this.s.className="pkHiddenStatus";this.k.className="pkOpaqueCompletionText";this.w.className="pkBackgroundHide";if(e){this.C=e;this.Pd[this.Y]=[e,this.pa];this.h=this.C;for(a=0;e=this.C[a];a++)this.ra[e.toLowerCase()]=a;this.j=-1}this.W(this.k,
y.ya.ja,function(s){g.Jd.call(g,s,c,d)},i);this.W(this.k,y.ya.ia,function(s){g.Id.call(g,s)},i);this.W(this.k,"blur",function(){g.zb&&g.Qb("hidden")},i)};l.ae=function(a){this.zb=a};l.de=function(a){this.pa=a};l.ce=function(a){this.h=this.C=a;this.ra={};a=0;for(var b;b=this.C[a];a++)this.ra[b.toLowerCase()]=a;this.j=-1};
l.Qb=function(a,b,d,c){if(a=="visible"){this.s.className=="pkHiddenStatus"&&this.S(this.pa);this.Xa(this.Wa,this.Da,this.Ea);this.s.className="pkVisibleStatus";var e=this.k;window.setTimeout(function(){e.focus()},0)}else if(a=="hidden"){if(y.n&&this.o)this.o.innerText="";else if(this.o)if(y.n)this.o.innerText="";else this.o.textContent="";this.Xa(j,this.Da,this.Ea);this.s.className="pkHiddenStatus";this.k.value="";this.j=-1}if(b){a=y.xb();d||(d=a.height-this.s.offsetHeight);c||(c=0);this.s.style.top=
d;this.s.style.left=c}};l.Ud=function(){var a=this;window.setTimeout(function(){a.Wa&&a.w.style.display=="block"&&a.Xa(a.Wa,a.Da,a.Ea)},0)};
l.Jd=function(a,b,d){if(this.k.value.length===0)this.h=this.C;if(a.keyCode!=y.D.ja&&a.keyCode!=y.D.ia&&a.keyCode!=y.D.U&&a.keyCode!=y.D.za)if(this.k.value.length){this.h=this.yb(this.C,this.k.value,50);this.j=-1;if(this.h.length>0){this.S(this.h[0]);this.j=0}else this.S(this.Td)}else this.S(this.pa);if(a.keyCode==y.D.U)if(!this.k.readOnly){if(this.h&&this.h.length>0&&this.j>=0&&this.k.value!=this.h[this.j]&&(this.h[this.j].indexOf("<")<0||this.h[this.j].indexOf("<")>=0&&this.h[this.j].split(" ").length>
this.k.value.split(" ").length))this.Nb();var c=this.k.value;a=(y.n?this.o.innerText:this.o.textContent).toLowerCase();var e=a.indexOf("<"),f;if(e>=0){f=c.substr(0,e-1).toLowerCase();c=f+" "+c.substr(e)}else f=c=c.toLowerCase();e=j;if(b)e=this.kd.call(this,c,a,b);if(d&&!e){b=this.tb(c,a);d(f,this.ra[a],this.Ld[a],b)}this.k.value=""}};
l.Id=function(a){if(a.keyCode==y.D.ja&&this.h&&this.h.length>0)this.Xd();else if(a.keyCode==y.D.ia&&this.h&&this.h.length>0)this.Sd();else a.keyCode==y.D.za&&this.h&&this.h.length>0&&this.Nb()};l.Xa=function(a,b,d){if(a){this.w.className="pkBackgroundShow";this.w.style.display="block";a=y.xb();this.w.style.width=a.width+"px";this.w.style.height=a.height+"px";if(b)this.w.style.backgroundColor=b;d&&this.w.style.setProperty("-moz-opacity",d/100,"")}else this.w.style.display="none"};
l.yb=function(a,b,d){for(var c=a,e=a,f=b.split(" "),g=0,k;k=f[g];g++){e=c;c=[];if(k!==""){k=y.Yd(k);var p=new RegExp("(^|\\W+)"+k,"i");k=0;for(var m;m=e[k];k++)String(m).match(p)&&c.push(m)}}e=a;for(k=0;m=e[k];k++){a=m.split(" ");f=[];for(g=0;p=a[g];g++){if(p.charAt(0)=="<")break;f.push(p)}g=f.join(" ");b.indexOf(g)===0&&c.push(m)}c.length>d&&c.slice(0,d-1);return c};
l.tb=function(a,b){a=a.replace(/\s+/g," ");b=b.replace(/\s+/g," ");var d=b.indexOf("<");if(d<0)return[];b=b.substr(d);a=a.substr(d);d=a.split(",");var c=b.split(",");if(d.length!=c.length)return[];for(var e=[],f=0,g,k;(g=d[f])&&(k=c[f]);f++){g=y.Cb(y.Lb(g));k=y.Cb(y.Lb(k));k.match(y.cc)&&e.push(g)}return e};l.kd=function(a,b,d){this.tb(a,b);if((a=d[b])&&a[this.Y]){a=a[this.Y]+"(args);";window.setTimeout(a,0);return h}else return j};
l.Xd=function(){if(this.j<0)this.j=0;this.j=(this.j||this.h.length)-1;this.j>=0&&this.S(this.h[this.j])};l.Sd=function(){this.j=(this.j+1)%this.h.length;this.j<this.h.length&&this.S(this.h[this.j])};l.Nb=function(){this.k.value=this.h[this.j>=0?this.j:0];this.h=this.yb(this.C,this.k.value,50);this.X&&y.N&&this.X.p(this.k.value);this.j=0};
l.S=function(a){if(!this.o){this.o=document.createElement("div");this.o.id="listElem_"+Math.floor(Math.random()*1001);this.ob.appendChild(this.o)}if(y.n)this.o.innerText=a;else this.o.textContent=a;this.X&&y.N&&this.X.Ya(this.o,j)};l.Ua=function(){y.Ua()};y.ab=function(a){this.Aa=a};
y.ab.prototype.Kd=function(a,b,d){if(b.Aa)if(a.keyCode){var c=""+a.keyCode,e=String.fromCharCode(a.keyCode).toLowerCase();if(a.ctrlKey){c="Ctrl+"+c;e="Ctrl+"+e}if(a.altKey){c="Alt+"+c;e="Alt+"+e}if(a.shiftKey){c="Shift+"+c;e="Shift+"+e}a=i;(a=b.Aa[e])||(a=b.Aa[c]);if(a)(b=a[d.Y]?a[d.Y]:a["*"])&&b()}};y.hd=function(a,b){this.width=a?a:undefined;this.height=b?b:undefined};y.Cb=function(a){return a.replace(y.Ac,"")};y.Lb=function(a){return a.replace(y.Zc,"")};
y.Yd=function(a){return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08")};
y.xb=function(){var a=0,b=0;if(typeof window.innerWidth=="number"){a=window.innerWidth;b=window.innerHeight}else if(document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)){a=document.documentElement.clientWidth;b=document.documentElement.clientHeight}else if(document.body&&(document.body.clientWidth||document.body.clientHeight)){a=document.body.clientWidth;b=document.body.clientHeight}return new y.hd(a,b)};y.n=j;y.N=j;
y.be=function(){var a=navigator.userAgent.toLowerCase();y.N=a.indexOf("gecko")!=-1;y.n=a.indexOf("msie")!=-1&&a.indexOf("opera")==-1};y.be();y.ya={ja:y.n?"onkeyup":"keyup",ia:y.n?"onkeydown":"keydown",ze:y.n?"onkeypress":"keypress",qe:y.n?"onclick":"click",Yc:y.n?"onresize":"resize",we:y.n?"onfocus":"focus",pe:y.n?"onblur":"blur"};y.pb=".pkHiddenStatus {display: none; position: absolute;}.pkVisibleStatus {display: block; position: absolute; left: 2px; top: 2px; line-height: 1.2em; z-index: 10001; background-color: #000000; padding: 2px; color: #fff; font-family: Arial, Sans-serif; font-size: 20px; filter: alpha(opacity=80); -moz-opacity: .80;}.pkOpaqueCompletionText {border-style: none; background-color:transparent; font-family: Arial, Helvetica, sans-serif; font-size: 35px; font-weight: bold; color: #fff; width: 1000px; height: 50px;}.pkBackgroundShow {position: absolute; width: 0px;height: 0px; background-color: #000000; filter: alpha(opacity=70);  -moz-opacity: .70; left: 0px; top: 0px; z-index: 10000;}";
y.Ua=function(){var a,b;if(a=document.getElementsByTagName("head")[0]){b=document.createElement("style");b.type="text/css";if(y.n)b.Ne=y.pb;else if(y.N)b.innerHTML=y.pb;a.appendChild(b)}};y.De=function(a){var b=document.getElementsByTagName("head")[0],d=document.createElement("link");d.type="text/css";d.rel="stylesheet";d.href=a;b.appendChild(d)};y.D={ja:38,ia:40,U:13,za:9};var axsFinance={};axsFinance.xc="The following shortcut keys are available. ";
axsFinance.a={la:" up by ",dd:"+",ha:" down by ",kc:"-",fb:" percent",gb:"%",Ic:" million",Jc:"M",Xb:" billion",Yb:"B",Pc:"New York Stock Exchange",Qc:"NYSE",Kc:"NASDAQ Stock Market",Lc:"NASDAQ",Cc:"London Stock Exchange",Fc:"LON",Sc:"Over the counter",Tc:"OTC",Rb:"American Stock Exchange",Sb:"AMEX",pc:"Euronext Paris Stock Exchange",qc:"EPA",Tb:"Australian Securities Exchange",Ub:"ASX",Vc:"Price to earnings",Wc:"P/E",sc:"Forward price to earnings",tc:"F P/E:",ed:"Volume",fd:"Vol:",$c:"selected",
Nc:"not selected",gc:"dash",hc:"-",bc:"Chg",ac:"Change",Ec:"Lt",Dc:"Long term",Hc:"Mkt",Gc:"Market",$b:"Cap",Zb:"capitalization",Wb:"avg",Vb:"average",oc:"EBITD",lc:"Earnings before interest, tax, and depreciation",nc:"EBITDA",mc:"Earnings before interest, tax, depreciation and amortization",uc:"Google Finance Quotes",Xc:"{0}, {1}, change {2}.",zc:"{0}, last quarter {1}, last year {2}.",bd:"Select which columns to be shown and press Enter when ready.",gd:"Press v to save or c to cancel.",jc:"- Disclaimer",
ka:"PM",ga:"AM",Rc:"or"};axsFinance.c={};axsFinance.c[axsFinance.a.Be]=axsFinance.a.jd;axsFinance.c[axsFinance.a.Qc]=axsFinance.a.Pc;axsFinance.c[axsFinance.a.Lc]=axsFinance.a.Kc;axsFinance.c[axsFinance.a.Fc]=axsFinance.a.Cc;axsFinance.c[axsFinance.a.Tc]=axsFinance.a.Sc;axsFinance.c[axsFinance.a.Sb]=axsFinance.a.Rb;axsFinance.c[axsFinance.a.qc]=axsFinance.a.pc;axsFinance.c[axsFinance.a.Ub]=axsFinance.a.Tb;axsFinance.c[axsFinance.a.Ce]=axsFinance.a.jd;axsFinance.c[axsFinance.a.Wc]=axsFinance.a.Vc;
axsFinance.c[axsFinance.a.tc]=axsFinance.a.sc;axsFinance.c[axsFinance.a.fd]=axsFinance.a.ed;axsFinance.c[axsFinance.a.ne]=axsFinance.a.me;axsFinance.c[axsFinance.a.ye]=axsFinance.a.xe;axsFinance.c[axsFinance.a.te]=axsFinance.a.se;axsFinance.c[axsFinance.a.gb]=axsFinance.a.fb;axsFinance.c[axsFinance.a.hc]=axsFinance.a.gc;axsFinance.c[axsFinance.a.bc]=axsFinance.a.ac;axsFinance.c[axsFinance.a.Ec]=axsFinance.a.Dc;axsFinance.c[axsFinance.a.Hc]=axsFinance.a.Gc;axsFinance.c[axsFinance.a.$b]=axsFinance.a.Zb;
axsFinance.c[axsFinance.a.Wb]=axsFinance.a.Vb;axsFinance.c[axsFinance.a.oc]=axsFinance.a.lc;axsFinance.c[axsFinance.a.nc]=axsFinance.a.mc;axsFinance.c[axsFinance.a.ka]=axsFinance.a.ka;axsFinance.c[axsFinance.a.ga]=axsFinance.a.ga;axsFinance.Qa={};axsFinance.Qa[axsFinance.a.kc]=axsFinance.a.ha;axsFinance.Qa[axsFinance.a.dd]=axsFinance.a.la;axsFinance.xa={};axsFinance.xa[axsFinance.a.Yb]=axsFinance.a.Xb;axsFinance.xa[axsFinance.a.Jc]=axsFinance.a.Ic;axsFinance.xa[axsFinance.a.gb]=axsFinance.a.fb;
axsFinance.dc='<cnr next="RIGHT l" prev="LEFT h"><target title="Read current quote" hotkey="q" action="CALL:axsFinance.readCurrentQuote">id("price-panel")</target><target title="Markets" hotkey="m">(//li[@class="nav-item"])[1]//a</target><target title="News" hotkey="e">(//li[@class="nav-item"])[2]//a</target><target title="Portfolios" hotkey="o">(//li[@class="nav-item"])[3]//a</target><target title="Stock screener" hotkey="s">(//li[@class="nav-item"])[4]//a</target><target title="Google domestic trends" hotkey="g">(//li[@class="nav-item"])[5]//a</target><target title="Financials" hotkey="f">id("nav-cf")</target><target title="Go to link" hotkey="ENTER">.//descendant-or-self::a</target><list title="Recent quotes" next="DOWN j" prev="UP k" fwd="n" back="p" type="dynamic" onEmpty="No recent quotes"><item action="CALL:axsFinance.readRecentQuote">id("rq")//tr</item><target title="Go to section" trigger="listEntry">id("rq-box")</target><target title="Create portfolio from quotes" hotkey="p" onEmpty="No recent quotes.">id("rq-create")</target></list><list title="Recent activity" next="DOWN j" prev="UP k" fwd="n" back="p" type="dynamic"><item>//li[@class="ra-entry"]//a</item><target title="Go to section" trigger="listEntry">id("rq-src")</target></list><list title="Market data" next="DOWN j" prev="UP k" fwd="n" back="p"><item action="CALL:axsFinance.readMarketData">id("snap-data")/li</item><target title="Go to section" trigger="listEntry">id("companyheader")</target></list><list title="News" next="DOWN j" prev="UP k" fwd="n" back="p" type="dynamic"><item>//div[@class="cluster"]</item><target title="View all news" hotkey="a">(id("news-sidebar-footer")//a[text()])[1]</target><target title="Subscribe" hotkey="u">(id("news-sidebar-footer")//a[text()])[2]</target><target title="Go to section" trigger="listEntry">id("companyheader")</target></list><list title="Related companies" next="DOWN j" prev="UP k" fwd="n" type ="dynamic" back="p"><item action="CALL:axsFinance.readRelCompDesc">id("cc-table")//tr[./td]</item><target title="Go to section" trigger="listEntry">id("related")</target><target title="Add or remove columns" hotkey="a" action="CALL:axsFinance.focusOnColumnSelectionCategry">id("related-edit-col")</target><target title="Cancel" hotkey="v">id("related-save")</target><target title="Cancel" hotkey="c">id("related-cancel")</target></list><list title="Discussed on blogs" next="DOWN j" prev="UP k" fwd="n" back="p"><item>id("blogs")//div[@class="item"]</item><target title="Go to section" trigger="listEntry">id("blogs")</target><target title="All blog discussions" hotkey="a" onEmpty="No more blog discussions">id("b-m-")</target></list><list title="Events" next="DOWN j" prev="UP k" fwd="n" back="p"><item>//div[@class="event"]</item><target title="Go to section" trigger="listEntry">//div[@class="g-section g-tpl-25-75 g-split hdg"]</target><target title="All events from AOL" hotkey="a" onEmpty="No more events">//div[@class="events sfe-section"]//table//a</target></list><list title="Discussions" next="DOWN j" prev="UP k" fwd="n" back="p"><item>id("groups")//div[@class="item"]</item><target title="Go to section" trigger="listEntry">id("groups")</target><target title="All discussions" hotkey="a" onEmpty="No more discussions">id("groups")//div[@class="sfe-break-top"]//a</target></list><list title="Key statistics and ratios" next="DOWN j" prev="UP k" fwd="n" back="p"><item action="CALL:axsFinance.readKeyStatisticAndRatio">//table[@class="quotes rgt nwp"]//tbody/tr</item><target title="More ratios from Thomson Reuters" hotkey="a" onEmpty="No more ratios">id("m-rratio")</target><target title="Go to section" trigger="listEntry">//table[@class="quotes rgt nwp"]</target><target title="All ratios" hotkey="a" onEmpty="No more ratios">id("m-rratio")</target></list><list title="Address" next="DOWN j" prev="UP k" fwd="n" back="p"><item>(//div[@class="hdg" and .//h3[contains(text(),"Address")]]//following-sibling::div)[1]</item><target title="Go to section" trigger="listEntry">//div[@class="hdg"]//h3[contains(text(),"Address")]</target></list><list title="Description" next="DOWN j" prev="UP k" fwd="n" back="p"><item>id("summary")</item><target title="More from Reuters" hotkey="a">id("m-rprofile")</target><target title="Go to section" trigger="listEntry">id("summary-section")</target></list><list title="Officers and directors" next="DOWN j" prev="UP k" fwd="n" back="p"><item>id("management")//tr[@class]</item><target title="Full list on Reuters" hotkey="a">id("management")//div[@class="gb"]//a</target><target title="Go to section" trigger="listEntry">id("management")</target></list><list title="Website links" next="DOWN j" prev="UP k" fwd="n" back="p"><item>(//div[@class="hdg" and .//h3[contains(text(),"Website links")]]//following-sibling::div)[1]//a</item><target title="Go to section" trigger="listEntry">//div[@class="hdg"]//h3[contains(text(),"Website links")]</target></list><list title="External links" next="DOWN j" prev="UP k" fwd="n" back="p"><item>(//div[@class="hdg" and .//h3[contains(text(),"External links")]]//following-sibling::div)[1]//div[@class="item"]</item><target title="Go to section" trigger="listEntry">//div[@class="hdg"]//h3[contains(text(),"External links")]</target></list></cnr>';
axsFinance.f=i;axsFinance.H=i;axsFinance.L=i;axsFinance.lb=i;axsFinance.Ib=i;axsFinance.aa=2.5;axsFinance.Mb=j;axsFinance.ve=300;axsFinance.Ke={};
axsFinance.Md=function(){axsFinance.f=new n(h);axsFinance.H=new o(axsFinance.f);axsFinance.H.Qd(axsFinance.dc,i);axsFinance.L=new w(axsFinance.f);axsFinance.H.ee(axsFinance.L);axsFinance.L.Va(axsFinance.aa);axsFinance.lb=new x(h);axsFinance.H.ge(axsFinance.lb);axsFinance.Ib=new y("list",axsFinance.f);axsFinance.H.fe(axsFinance.Ib,".");document.addEventListener("keypress",axsFinance.R,h);var a=axsFinance.yd;document.addEventListener("DOMNodeInserted",a,h);a=document.getElementById("searchbox");a.addEventListener("focus",
axsFinance.$d,j);axsFinance.pd()};axsFinance.pd=function(){var a='id("companyheader")//h3';if(a=axsFinance.f.t(a,document.body)[0]){a=axsFinance.O(a.textContent);a=axsFinance.a.uc+". "+a;var b=axsFinance.wb();a=a+" "+b;b=document.getElementById("price-panel");axsFinance.da(b,a)}};
axsFinance.wb=function(){var a=document.getElementById("price-panel");a=axsFinance.Hb(a.textContent);a=a.replace(axsFinance.a.jc,"");a=a.replace(axsFinance.a.ga," "+axsFinance.a.ga);a=a.replace(axsFinance.a.ka," "+axsFinance.a.ka);a=a.replace(" ("," "+axsFinance.a.Rc+" ");return axsFinance.O(a)};axsFinance.readCurrentQuote=function(a){var b=axsFinance.wb();axsFinance.da(a.l,b)};axsFinance.readRecentQuote=function(a){axsFinance.Kb(a.l,"./td[not(.//b)]",axsFinance.a.Xc)};
axsFinance.readKeyStatisticAndRatio=function(a){axsFinance.Kb(a.l,"./td",axsFinance.a.zc)};axsFinance.Kb=function(a,b,d){b=axsFinance.f.t(b,a);for(var c=[],e=0,f=b.length;e<f;e++){c[e]=axsFinance.Fd(b[e]);c[e]=axsFinance.O(c[e])}d=axsFinance.Vd(d,c);axsFinance.da(a,d)};axsFinance.Fd=function(a){var b="",d='.//descendant-or-self::*[not(contains(@style,"display: none;"))]/text()';a=axsFinance.f.t(d,a);d=0;for(var c;c=a[d];d++)b=b+c.textContent+" ";return b};
axsFinance.readMarketData=function(a){a=a.l;var b=axsFinance.O(a.textContent);axsFinance.da(a,b)};axsFinance.readRelCompDesc=function(a){a=a.l;var b='id("cc-table")//th[contains(@class,"cth-sec") and not(./a)]',d=axsFinance.f.t(b,document.body);b='.//td[not(.//span[@class="sparkline"])]';b=axsFinance.f.t(b,a);for(var c="",e=0,f=d.length;e<f;e++)c=c+axsFinance.O(d[e].textContent)+": "+axsFinance.O(b[e].textContent)+", ";axsFinance.da(a,c)};
axsFinance.focusOnColumnSelectionCategry=function(a){axsFinance.L.view(i);axsFinance.f.nb(a.l,j)};axsFinance.Dd=function(){var a=axsFinance.f.A,b=".//ancestor::th";b=axsFinance.f.t(b,a)[0];b=axsFinance.O(b.textContent);return b=a.checked?b+" "+axsFinance.a.$c:b+" "+axsFinance.a.Nc};axsFinance.yd=function(a){var b=a.target;b.id&&b.id==="cc-table"&&axsFinance.ld(a)};
axsFinance.ld=function(){var a='id("cc-table")/thead//th//input';a=axsFinance.f.t(a,document.body);if(a.length>0){axsFinance.Fa=a;for(var b=function(){var f=axsFinance.Dd();axsFinance.f.p(f)},d=function(f){if(f.keyCode==13){f.target.blur();axsFinance.f.p(axsFinance.a.gd);f.stopPropagation();f.preventDefault()}},c=0,e;e=a[c];c++){e.removeEventListener("focus",b,h);e.addEventListener("focus",b,h);e.removeEventListener("keypress",d,h);e.addEventListener("keypress",d,h)}axsFinance.f.p(axsFinance.a.bd)}else axsFinance.Fa=
i};axsFinance.$d=function(a){if(!axsFinance.Mb){axsFinance.f.p(" ");a.target.blur()}};axsFinance.da=function(a,b){axsFinance.L.view(a);axsFinance.f.p(b);a.scrollIntoView(h);axsFinance.f.ua(a)};axsFinance.Vd=function(a,b){for(var d=new String(a),c=0,e=b.length;c<e;c++)d=d.replace("{"+c+"}",b[c]);return d};
axsFinance.O=function(a){var b="";if(a==="")return a;a=axsFinance.Hb(a);var d=axsFinance.c[a];if(d!=undefined)return d;a=a.split(" ");for(d=0;a[d];d++){var c=a[d],e=axsFinance.c[c];if(e!=undefined)c=e;else{if(c.length>0&&c.charAt(0)==="(")c=c.substring(1);if(c.length>1&&c.charAt(c.length-1)===")")c=c.substring(0,c.length-1);e=axsFinance.Qa[c.charAt(0)];if(e!=undefined)c=e+" "+c.substring(1);e=c.charAt(c.length-1);e=axsFinance.xa[e];if(e!=undefined)c=c.substring(0,c.length-1)+" "+e}b=b+" "+c}return b};
axsFinance.Hb=function(a){a=a.replace(/^\s\s*/,"").replace(/\s\s*$/,"");a=a.replace(/\s+/g," ");return a.replace(/\n+/g,"").replace(/\r+/g,"")};axsFinance.ke=function(a){for(var b=a.target,d=axsFinance.Fa,c=d.length,e=-1,f=0,g;g=d[f];f++)if(b===g){e=f;break}if(a.shiftKey){e--;if(e<0)e=c-1}else{e++;if(e==c)e=0}b=d[e];b.focus();b.tagName=="INPUT"&&b.select();a.stopPropagation();a.preventDefault()};
axsFinance.R=function(a){if(a.ctrlKey)return h;if(a.keyCode==27){axsFinance.f.A.blur();return j}a.keyCode==9&&axsFinance.Fa!==i&&axsFinance.ke(a);if(axsFinance.f.sa)return h;a.charCode==46&&axsFinance.H.Ob();if(a=axsFinance.ud[a.charCode])return a();return h};
axsFinance.ud={47:function(){axsFinance.Mb=h;document.getElementById("searchbox").focus();document.getElementById("searchbox").select();return j},63:function(){var a=axsFinance.xc+axsFinance.H.Nd()+axsFinance.H.Gd();axsFinance.f.p(a);return j},45:function(){axsFinance.aa-=0.1;axsFinance.L.Va(axsFinance.aa);return j},61:function(){axsFinance.aa+=0.1;axsFinance.L.Va(axsFinance.aa);return j}};window.addEventListener("load",axsFinance.Md,h); })();