/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 484:
/***/ (function(module) {

!function(t,e){ true?module.exports=e():0}(this,function(){"use strict";var t="millisecond",e="second",n="minute",r="hour",i="day",s="week",u="month",a="quarter",o="year",f="date",h=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,c=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,d={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},$=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},l={s:$,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+$(r,2,"0")+":"+$(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,u),s=n-i<0,a=e.clone().add(r+(s?-1:1),u);return+(-(r+(n-i)/(s?i-a:a-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return{M:u,y:o,w:s,d:i,D:f,h:r,m:n,s:e,ms:t,Q:a}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},y="en",M={};M[y]=d;var m=function(t){return t instanceof S},D=function(t,e,n){var r;if(!t)return y;if("string"==typeof t)M[t]&&(r=t),e&&(M[t]=e,r=t);else{var i=t.name;M[i]=t,r=i}return!n&&r&&(y=r),r||!n&&y},v=function(t,e){if(m(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new S(n)},g=l;g.l=D,g.i=m,g.w=function(t,e){return v(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var S=function(){function d(t){this.$L=D(t.locale,null,!0),this.parse(t)}var $=d.prototype;return $.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(g.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(h);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init()},$.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},$.$utils=function(){return g},$.isValid=function(){return!("Invalid Date"===this.$d.toString())},$.isSame=function(t,e){var n=v(t);return this.startOf(e)<=n&&n<=this.endOf(e)},$.isAfter=function(t,e){return v(t)<this.startOf(e)},$.isBefore=function(t,e){return this.endOf(e)<v(t)},$.$g=function(t,e,n){return g.u(t)?this[e]:this.set(n,t)},$.unix=function(){return Math.floor(this.valueOf()/1e3)},$.valueOf=function(){return this.$d.getTime()},$.startOf=function(t,a){var h=this,c=!!g.u(a)||a,d=g.p(t),$=function(t,e){var n=g.w(h.$u?Date.UTC(h.$y,e,t):new Date(h.$y,e,t),h);return c?n:n.endOf(i)},l=function(t,e){return g.w(h.toDate()[t].apply(h.toDate("s"),(c?[0,0,0,0]:[23,59,59,999]).slice(e)),h)},y=this.$W,M=this.$M,m=this.$D,D="set"+(this.$u?"UTC":"");switch(d){case o:return c?$(1,0):$(31,11);case u:return c?$(1,M):$(0,M+1);case s:var v=this.$locale().weekStart||0,S=(y<v?y+7:y)-v;return $(c?m-S:m+(6-S),M);case i:case f:return l(D+"Hours",0);case r:return l(D+"Minutes",1);case n:return l(D+"Seconds",2);case e:return l(D+"Milliseconds",3);default:return this.clone()}},$.endOf=function(t){return this.startOf(t,!1)},$.$set=function(s,a){var h,c=g.p(s),d="set"+(this.$u?"UTC":""),$=(h={},h[i]=d+"Date",h[f]=d+"Date",h[u]=d+"Month",h[o]=d+"FullYear",h[r]=d+"Hours",h[n]=d+"Minutes",h[e]=d+"Seconds",h[t]=d+"Milliseconds",h)[c],l=c===i?this.$D+(a-this.$W):a;if(c===u||c===o){var y=this.clone().set(f,1);y.$d[$](l),y.init(),this.$d=y.set(f,Math.min(this.$D,y.daysInMonth())).$d}else $&&this.$d[$](l);return this.init(),this},$.set=function(t,e){return this.clone().$set(t,e)},$.get=function(t){return this[g.p(t)]()},$.add=function(t,a){var f,h=this;t=Number(t);var c=g.p(a),d=function(e){var n=v(h);return g.w(n.date(n.date()+Math.round(e*t)),h)};if(c===u)return this.set(u,this.$M+t);if(c===o)return this.set(o,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var $=(f={},f[n]=6e4,f[r]=36e5,f[e]=1e3,f)[c]||1,l=this.$d.getTime()+t*$;return g.w(l,this)},$.subtract=function(t,e){return this.add(-1*t,e)},$.format=function(t){var e=this;if(!this.isValid())return"Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",r=g.z(this),i=this.$locale(),s=this.$H,u=this.$m,a=this.$M,o=i.weekdays,f=i.months,h=function(t,r,i,s){return t&&(t[r]||t(e,n))||i[r].substr(0,s)},d=function(t){return g.s(s%12||12,t,"0")},$=i.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:g.s(a+1,2,"0"),MMM:h(i.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:g.s(this.$D,2,"0"),d:String(this.$W),dd:h(i.weekdaysMin,this.$W,o,2),ddd:h(i.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:g.s(s,2,"0"),h:d(1),hh:d(2),a:$(s,u,!0),A:$(s,u,!1),m:String(u),mm:g.s(u,2,"0"),s:String(this.$s),ss:g.s(this.$s,2,"0"),SSS:g.s(this.$ms,3,"0"),Z:r};return n.replace(c,function(t,e){return e||l[t]||r.replace(":","")})},$.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},$.diff=function(t,f,h){var c,d=g.p(f),$=v(t),l=6e4*($.utcOffset()-this.utcOffset()),y=this-$,M=g.m(this,$);return M=(c={},c[o]=M/12,c[u]=M,c[a]=M/3,c[s]=(y-l)/6048e5,c[i]=(y-l)/864e5,c[r]=y/36e5,c[n]=y/6e4,c[e]=y/1e3,c)[d]||y,h?M:g.a(M)},$.daysInMonth=function(){return this.endOf(u).$D},$.$locale=function(){return M[this.$L]},$.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=D(t,e,!0);return r&&(n.$L=r),n},$.clone=function(){return g.w(this.$d,this)},$.toDate=function(){return new Date(this.valueOf())},$.toJSON=function(){return this.isValid()?this.toISOString():null},$.toISOString=function(){return this.$d.toISOString()},$.toString=function(){return this.$d.toUTCString()},d}(),p=S.prototype;return v.prototype=p,[["$ms",t],["$s",e],["$m",n],["$H",r],["$W",i],["$M",u],["$y",o],["$D",f]].forEach(function(t){p[t[1]]=function(e){return this.$g(e,t[0],t[1])}}),v.extend=function(t,e){return t.$i||(t(e,S,v),t.$i=!0),v},v.locale=D,v.isDayjs=m,v.unix=function(t){return v(1e3*t)},v.en=M[y],v.Ls=M,v.p={},v});


/***/ }),

/***/ 285:
/***/ (function(module) {

!function(t,e){ true?module.exports=e():0}(this,function(){"use strict";var t={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},e=function(e,n){return e.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,function(e,r,i){var o=i&&i.toUpperCase();return r||n[i]||t[i]||n[o].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,function(t,e,n){return e||n.slice(1)})})},n=/(\[[^[]*\])|([-:/.()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,r=/\d\d/,i=/\d\d?/,o=/\d*[^\s\d-_:/()]+/,s={};var a=function(t){return function(e){this[t]=+e}},f=[/[+-]\d\d:?(\d\d)?/,function(t){(this.zone||(this.zone={})).offset=function(t){if(!t)return 0;var e=t.match(/([+-]|\d\d)/g),n=60*e[1]+(+e[2]||0);return 0===n?0:"+"===e[0]?-n:n}(t)}],u=function(t){var e=s[t];return e&&(e.indexOf?e:e.s.concat(e.f))},h=function(t,e){var n,r=s.meridiem;if(r){for(var i=1;i<=24;i+=1)if(t.indexOf(r(i,0,e))>-1){n=i>12;break}}else n=t===(e?"pm":"PM");return n},d={A:[o,function(t){this.afternoon=h(t,!1)}],a:[o,function(t){this.afternoon=h(t,!0)}],S:[/\d/,function(t){this.milliseconds=100*+t}],SS:[r,function(t){this.milliseconds=10*+t}],SSS:[/\d{3}/,function(t){this.milliseconds=+t}],s:[i,a("seconds")],ss:[i,a("seconds")],m:[i,a("minutes")],mm:[i,a("minutes")],H:[i,a("hours")],h:[i,a("hours")],HH:[i,a("hours")],hh:[i,a("hours")],D:[i,a("day")],DD:[r,a("day")],Do:[o,function(t){var e=s.ordinal,n=t.match(/\d+/);if(this.day=n[0],e)for(var r=1;r<=31;r+=1)e(r).replace(/\[|\]/g,"")===t&&(this.day=r)}],M:[i,a("month")],MM:[r,a("month")],MMM:[o,function(t){var e=u("months"),n=(u("monthsShort")||e.map(function(t){return t.substr(0,3)})).indexOf(t)+1;if(n<1)throw new Error;this.month=n%12||n}],MMMM:[o,function(t){var e=u("months").indexOf(t)+1;if(e<1)throw new Error;this.month=e%12||e}],Y:[/[+-]?\d+/,a("year")],YY:[r,function(t){t=+t,this.year=t+(t>68?1900:2e3)}],YYYY:[/\d{4}/,a("year")],Z:f,ZZ:f};var c=function(t,r,i){try{var o=function(t){for(var r=(t=e(t,s&&s.formats)).match(n),i=r.length,o=0;o<i;o+=1){var a=r[o],f=d[a],u=f&&f[0],h=f&&f[1];r[o]=h?{regex:u,parser:h}:a.replace(/^\[|\]$/g,"")}return function(t){for(var e={},n=0,o=0;n<i;n+=1){var s=r[n];if("string"==typeof s)o+=s.length;else{var a=s.regex,f=s.parser,u=t.substr(o),h=a.exec(u)[0];f.call(e,h),t=t.replace(h,"")}}return function(t){var e=t.afternoon;if(void 0!==e){var n=t.hours;e?n<12&&(t.hours+=12):12===n&&(t.hours=0),delete t.afternoon}}(e),e}}(r)(t),a=o.year,f=o.month,u=o.day,h=o.hours,c=o.minutes,m=o.seconds,l=o.milliseconds,M=o.zone,Y=new Date,v=u||(a||f?1:Y.getDate()),p=a||Y.getFullYear(),D=0;a&&!f||(D=f>0?f-1:Y.getMonth());var y=h||0,L=c||0,g=m||0,$=l||0;return M?new Date(Date.UTC(p,D,v,y,L,g,$+60*M.offset*1e3)):i?new Date(Date.UTC(p,D,v,y,L,g,$)):new Date(p,D,v,y,L,g,$)}catch(t){return new Date("")}};return function(t,e,n){n.p.customParseFormat=!0;var r=e.prototype,i=r.parse;r.parse=function(t){var e=t.date,r=t.utc,o=t.args;this.$u=r;var a=o[1];if("string"==typeof a){var f=!0===o[2],u=!0===o[3],h=f||u,d=o[2];u&&(d=o[2]),s=this.$locale(),!f&&d&&(s=n.Ls[d]),this.$d=c(e,a,r),this.init(),d&&!0!==d&&(this.$L=this.locale(d).$L),h&&e!==this.format(a)&&(this.$d=new Date("")),s={}}else if(a instanceof Array)for(var m=a.length,l=1;l<=m;l+=1){o[1]=a[l-1];var M=n.apply(this,o);if(M.isValid()){this.$d=M.$d,this.$L=M.$L,this.init();break}l===m&&(this.$d=new Date(""))}else i.call(this,t)}}});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var dayjs = __webpack_require__(484);

var customParseFormat = __webpack_require__(285);

dayjs.extend(customParseFormat);

var SNTools = /*#__PURE__*/function () {
  function SNTools() {
    _classCallCheck(this, SNTools);
  }

  _createClass(SNTools, [{
    key: "generateUUID",
    value: function generateUUID() {
      var crypto = window.crypto || window.msCrypto;

      if (crypto) {
        var buf = new Uint32Array(4);
        crypto.getRandomValues(buf);
        var idx = -1;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          idx++;
          var r = buf[idx >> 3] >> idx % 8 * 4 & 15;
          var v = c == 'x' ? r : r & 0x3 | 0x8;
          return v.toString(16);
        });
      } else {
        var date = new Date().getTime();

        if (window.performance && typeof window.performance.now === 'function') {
          date += performance.now(); //use high-precision timer if available
        }

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (date + Math.random() * 16) % 16 | 0;
          date = Math.floor(date / 16);
          return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
        });
      }
    }
  }, {
    key: "strip",
    value: function strip(html) {
      var tmp = document.implementation.createHTMLDocument('New').body;
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    }
  }, {
    key: "loadXMLString",
    value: function loadXMLString(string, type) {
      var xmlDoc;

      if (window.DOMParser) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(string, 'text/' + type);
      } else {
        // Internet Explorer
        xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
        xmlDoc.async = false;
        xmlDoc.loadXML(string);
      }

      return xmlDoc;
    }
  }, {
    key: "downloadSNData",
    value: function downloadSNData(data, filename) {
      var textFile = null;

      var makeTextFile = function makeTextFile(text) {
        var data = new Blob([text], {
          type: 'text/json'
        }); // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.

        if (textFile !== null) {
          window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data); // returns a URL you can use as a href

        return textFile;
      };

      var file = makeTextFile(JSON.stringify(data, null, 2
      /* pretty print */
      ));
      var link = document.createElement('a');
      link.setAttribute('download', filename);
      link.href = file;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, {
    key: "convertENEXDatatoSN",
    value: function convertENEXDatatoSN(data) {
      var stripHTML = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var defaultTagName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'evernote';
      var xmlDoc = this.loadXMLString(data, 'xml');
      var xmlNotes = xmlDoc.getElementsByTagName('note');
      var notes = [];
      var tags = [];
      var defaultTag;

      if (defaultTagName) {
        defaultTag = {
          uuid: this.generateUUID(),
          content_type: 'Tag',
          content: {
            title: defaultTagName,
            references: []
          }
        };
      }

      function findTag(title) {
        return tags.filter(function (tag) {
          return tag.content.title == title;
        })[0];
      }

      function addTag(tag) {
        tags.push(tag);
      }

      var _iterator = _createForOfIteratorHelper(xmlNotes),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var xmlNote = _step.value;
          var title = xmlNote.getElementsByTagName('title')[0].childNodes[0].nodeValue;
          var created = xmlNote.getElementsByTagName('created')[0].childNodes[0].nodeValue;
          var updatedNodes = xmlNote.getElementsByTagName('updated');
          var updated = updatedNodes.length ? updatedNodes[0].childNodes[0].nodeValue : null;
          var contentNode = xmlNote.getElementsByTagName('content')[0];
          var contentXmlString = void 0;
          /** Find the node with the content */

          var _iterator2 = _createForOfIteratorHelper(contentNode.childNodes),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var node = _step2.value;

              if (node instanceof CDATASection) {
                contentXmlString = node.nodeValue;
                break;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }

          var contentXml = this.loadXMLString(contentXmlString, 'html');
          var contentHTML = contentXml.getElementsByTagName('en-note')[0].innerHTML;

          if (stripHTML) {
            contentHTML = contentHTML.replace(/<br[^>]*>/g, '\n\n');
            contentHTML = contentHTML.replace(/<li[^>]*>/g, '\n');
          }

          var text = stripHTML ? this.strip(contentHTML) : contentHTML;
          var dateFormat = 'YYYYMMDDTHHmmss';
          var note = {
            created_at: dayjs(created, dateFormat).toDate(),
            updated_at: updated ? dayjs(updated, dateFormat).toISOString() : dayjs(created, dateFormat).toISOString(),
            uuid: this.generateUUID(),
            content_type: 'Note',
            content: {
              title: title,
              text: text,
              references: []
            }
          };
          this.setClientUpdatedAt(note, note.updated_at);

          if (defaultTag) {
            defaultTag.content.references.push({
              content_type: 'Note',
              uuid: note.uuid
            });
          }

          var xmlTags = xmlNote.getElementsByTagName('tag');

          var _iterator3 = _createForOfIteratorHelper(xmlTags),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var tagXml = _step3.value;
              var tagName = tagXml.childNodes[0].nodeValue;
              var tag = findTag(tagName);

              if (!tag) {
                tag = {
                  uuid: this.generateUUID(),
                  content_type: 'Tag',
                  created_at: new Date(),
                  updated_at: new Date(),
                  content: {
                    title: tagName,
                    references: []
                  }
                };
                addTag(tag);
              }

              note.content.references.push({
                content_type: tag.content_type,
                uuid: tag.uuid
              });
              tag.content.references.push({
                content_type: note.content_type,
                uuid: note.uuid
              });
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }

          notes.push(note);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var allItems = notes.concat(tags);

      if (defaultTag) {
        allItems.push(defaultTag);
      }

      var itemsData = {
        items: allItems
      };
      return itemsData;
    }
  }, {
    key: "convertGKeepNotes",
    value: function convertGKeepNotes(rawNotes) {
      var stripHTML = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      // Final notes array
      var notes = [];

      var _iterator4 = _createForOfIteratorHelper(rawNotes),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var note = _step4.value;
          var jsonNoteContent = this.parseJsonGKeepNote(note.content);

          if (jsonNoteContent) {
            notes.push(jsonNoteContent);
            continue;
          } // Parse note html


          var element = document.createElement('html');
          element.innerHTML = note.content; // Try to get note content

          var content = void 0;

          try {
            var contentElement = element.getElementsByClassName('content')[0]; // Replace <br> with \n so line breaks get recognised

            contentElement.innerHTML = contentElement.innerHTML.replace(/<br>/g, '\n'); // Get note content, removing newline from todo lists

            if (stripHTML) {
              content = contentElement.innerText.replace(/☐\n/g, '☐').replace(/☑\n/g, '☑');
            } else {
              content = contentElement.innerHTML;
            }
          } catch (e) {
            // Invalid note, continue
            console.log(note.name, 'is an invalid note (no content)');
            continue;
          } // Try to get note title


          var title = void 0;

          try {
            title = element.getElementsByTagName('title')[0].innerText;
          } catch (e) {
            // Invalid note, continue
            console.log(note.name, 'is an invalid note (no title)');
            continue;
          } // Check if title is date (default if no title is set). If so, use empty string


          if (title !== '' && !isNaN(new Date(title))) {
            title = '';
          } // Try to find creation date, usually before div.content or div.title


          var date = this.getDateFromGKeepNote(true, note.content) || this.getDateFromGKeepNote(false, note.content) || new Date();
          var noteResult = {
            created_at: date,
            updated_at: date,
            uuid: this.generateUUID(),
            content_type: 'Note',
            content: {
              title: title,
              text: content,
              references: []
            }
          };
          this.setClientUpdatedAt(noteResult, date);
          notes.push(noteResult);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return {
        'items': notes
      };
    }
  }, {
    key: "getDateFromGKeepNote",
    value: function getDateFromGKeepNote(withTitle, note) {
      var regex;

      if (withTitle) {
        regex = /.*(?=<\/div>\n<div class="title">)/;
      } else {
        regex = /.*(?=<\/div>\n\n<div class="content">)/;
      }

      var dateString = regex.exec(note); // Check if string exists at all

      if (dateString && dateString[0]) {
        // Check if string is valid date
        if (!isNaN(new Date(dateString))) {
          return new Date(dateString);
        }
      }

      return false;
    }
  }, {
    key: "parseJsonGKeepNote",
    value: function parseJsonGKeepNote(content) {
      try {
        var parsed = JSON.parse(content);
        var date = new Date(parsed.userEditedTimestampUsec / 1000);
        return {
          created_at: date,
          updated_at: date,
          uuid: this.generateUUID(),
          content_type: 'Note',
          content: {
            title: parsed.title,
            text: parsed.textContent,
            references: [],
            appData: {
              'org.standardnotes.sn': {
                'client_updated_at': date,
                archived: Boolean(parsed.isArchived),
                trashed: Boolean(parsed.isTrashed),
                pinned: Boolean(parsed.isPinned)
              }
            }
          }
        };
      } catch (e) {
        return null;
      }
    }
  }, {
    key: "setClientUpdatedAt",
    value: function setClientUpdatedAt(item, date) {
      item.content.appData = {
        'org.standardnotes.sn': {
          'client_updated_at': date
        }
      };
    }
  }, {
    key: "convertPlaintextFiles",
    value: function convertPlaintextFiles(files, completion) {
      var index = 0;
      var processedData = [];
      var dateString = new Date().toLocaleDateString().replace(/\//g, '-');
      var defaultTag = {
        uuid: this.generateUUID(),
        content_type: 'Tag',
        content: {
          title: "".concat(dateString, "-import"),
          references: []
        }
      };
      processedData.push(defaultTag);

      var readNext = function () {
        var file = files[index];
        index++;
        var reader = new FileReader();

        reader.onload = function (e) {
          var data = e.target.result;
          var note = {
            created_at: new Date(file.lastModified),
            updated_at: new Date(file.lastModified),
            uuid: this.generateUUID(),
            content_type: 'Note',
            content: {
              title: file.name.split('.')[0],
              text: data,
              references: []
            }
          };
          this.setClientUpdatedAt(note, note.updated_at);
          processedData.push(note);
          defaultTag.content.references.push({
            content_type: 'Note',
            uuid: note.uuid
          });

          if (index < files.length) {
            readNext();
          } else {
            completion({
              items: processedData
            });
          }
        }.bind(this);

        reader.readAsText(file);
      }.bind(this);

      readNext();
    }
  }, {
    key: "convertSimplenoteFiles",
    value: function convertSimplenoteFiles(files, completion) {
      var index = 0;
      var processedData = [];
      var tags = new Map();

      var readNext = function () {
        var file = files[index];
        index++;
        var reader = new FileReader();

        reader.onload = function (e) {
          var _this = this;

          var title = file.name.split('.')[0];
          var data = e.target.result;
          var tagsMarker = '\nTags:\n  ';

          var _data$replaceAll$subs = data.replaceAll('\r\n', '\n').substring(title.concat('\n').length).split(tagsMarker),
              _data$replaceAll$subs2 = _slicedToArray(_data$replaceAll$subs, 2),
              newData = _data$replaceAll$subs2[0],
              currentTags = _data$replaceAll$subs2[1];

          currentTags = currentTags ? currentTags.split(', ') : [];
          var note = {
            created_at: new Date(file.lastModified),
            updated_at: new Date(file.lastModified),
            uuid: this.generateUUID(),
            content_type: 'Note',
            content: {
              title: title,
              text: newData,
              references: []
            }
          };
          this.setClientUpdatedAt(note, note.updated_at);
          processedData.push(note);
          var noteReference = {
            content_type: 'Note',
            uuid: note.uuid
          };
          currentTags.forEach(function (tag) {
            if (!tags.has(tag)) {
              tags.set(tag, {
                uuid: _this.generateUUID(),
                content_type: 'Tag',
                content: {
                  title: tag,
                  references: [noteReference]
                }
              });
            } else {
              tags.get(tag).content.references.push(noteReference);
            }
          });

          if (index < files.length) {
            readNext();
          } else {
            console.log(Array.from(tags.values()));
            completion({
              items: Array.from(tags.values()).concat(processedData)
            });
          }
        }.bind(this);

        reader.readAsText(file);
      }.bind(this);

      readNext();
    }
  }]);

  return SNTools;
}();

window.SNTools = new SNTools();
})();

/******/ })()
;