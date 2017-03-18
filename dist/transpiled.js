(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SNTools = function () {
  function SNTools() {
    _classCallCheck(this, SNTools);
  }

  _createClass(SNTools, [{
    key: 'generateUUID',
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
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
          d += performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
        });
        return uuid;
      }
    }
  }, {
    key: 'strip',
    value: function strip(html) {
      var tmp = document.implementation.createHTMLDocument("New").body;
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    }
  }, {
    key: 'loadXMLString',
    value: function loadXMLString(string, type) {
      var xmlDoc;
      if (window.DOMParser) {
        var parser = new DOMParser();
        xmlDoc = parser.parseFromString(string, "text/" + type);
      } else {
        // Internet Explorer
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(string);
      }

      return xmlDoc;
    }
  }, {
    key: 'downloadSNData',
    value: function downloadSNData(data, filename) {
      var textFile = null;
      var makeTextFile = function makeTextFile(text) {
        var data = new Blob([text], { type: 'text/json' });

        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (textFile !== null) {
          window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);

        // returns a URL you can use as a href
        return textFile;
      };

      var file = makeTextFile(JSON.stringify(data, null, 2 /* pretty print */));

      var link = document.createElement('a');
      link.setAttribute('download', filename);
      link.href = file;
      link.click();
    }
  }, {
    key: 'convertENEXDatatoSN',
    value: function convertENEXDatatoSN(data) {
      var xmlDoc = this.loadXMLString(data, "xml");
      var xmlNotes = xmlDoc.getElementsByTagName("note");
      var notes = [];
      var tags = [];

      function findTag(title) {
        return tags.filter(function (tag) {
          return tag.content.title == title;
        })[0];
      }

      function addTag(tag) {
        tags.push(tag);
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = xmlNotes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var xmlNote = _step.value;

          var title = xmlNote.getElementsByTagName("title")[0].childNodes[0].nodeValue;
          var created = xmlNote.getElementsByTagName("created")[0].childNodes[0].nodeValue;
          var updatedNodes = xmlNote.getElementsByTagName("updated");
          var updated = updatedNodes.length ? updatedNodes[0].childNodes[0].nodeValue : null;

          var contentXmlString = xmlNote.getElementsByTagName("content")[0].childNodes[0].nodeValue;
          var contentXml = this.loadXMLString(contentXmlString, "html");
          var contentHTML = contentXml.getElementsByTagName("en-note")[0].innerHTML;
          var text = this.strip(contentHTML);

          var note = {
            created_at: moment(created).toDate(),
            updated_at: updated ? moment(updated).toDate() : null,
            uuid: this.generateUUID(),
            content_type: "Note",
            content: {
              title: title,
              text: text,
              references: []
            }
          };

          var xmlTags = xmlNote.getElementsByTagName("tag");
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = xmlTags[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var tagXml = _step2.value;

              var tagName = tagXml.childNodes[0].nodeValue;
              var tag = findTag(tagName);
              if (!tag) {
                tag = {
                  uuid: this.generateUUID(),
                  content_type: "Tag",
                  created_at: new Date(),
                  updated_at: new Date(),
                  content: {
                    title: tagName,
                    references: []
                  }
                };
                addTag(tag);
              }

              note.content.references.push({ content_type: tag.content_type, uuid: tag.uuid });
              tag.content.references.push({ content_type: note.content_type, uuid: note.uuid });
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          notes.push(note);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var itemsData = {
        items: notes.concat(tags)
      };

      return itemsData;
    }
  }, {
    key: 'convertPlaintextFiles',
    value: function convertPlaintextFiles(files, completion) {
      var index = 0;
      var processedData = [];

      var readNext = function () {
        var file = files[index];
        index++;
        var reader = new FileReader();

        reader.onload = function (e) {

          var data = e.target.result;
          var note = {
            created_at: new Date(),
            updated_at: new Date(),
            uuid: this.generateUUID(),
            content_type: "Note",
            content: {
              title: file.name.split(".")[0],
              text: data,
              references: []
            }
          };
          processedData.push(note);

          if (index < files.length) {
            readNext();
          } else {
            completion({ items: processedData });
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


},{}]},{},[1]);
