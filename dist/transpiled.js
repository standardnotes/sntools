(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, {
    key: 'convertENEXDatatoSN',
    value: function convertENEXDatatoSN(data) {
      var stripHTML = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var defaultTagName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "evernote";

      var xmlDoc = this.loadXMLString(data, "xml");
      var xmlNotes = xmlDoc.getElementsByTagName("note");
      var notes = [];
      var tags = [];
      var defaultTag;

      if (defaultTagName) {
        defaultTag = {
          uuid: this.generateUUID(),
          content_type: "Tag",
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
          var contentNode = xmlNote.getElementsByTagName("content")[0];
          var contentXmlString = void 0;
          /** Find the node with the content */
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = contentNode.childNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var node = _step2.value;

              if (node instanceof CDATASection) {
                contentXmlString = node.nodeValue;
                break;
              }
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

          var contentXml = this.loadXMLString(contentXmlString, "html");
          var contentHTML = contentXml.getElementsByTagName("en-note")[0].innerHTML;
          if (stripHTML) {
            contentHTML = contentHTML.replace(/<br[^>]*>/g, "\n\n");
            contentHTML = contentHTML.replace(/<li[^>]*>/g, "\n");
          }
          var text = stripHTML ? this.strip(contentHTML) : contentHTML;

          var note = {
            created_at: moment(created).toDate(),
            updated_at: updated ? moment(updated).toDate() : moment(created).toDate(),
            uuid: this.generateUUID(),
            content_type: "Note",
            content: {
              title: title,
              text: text,
              references: []
            }
          };

          this.setClientUpdatedAt(note, note.updated_at);

          if (defaultTag) {
            defaultTag.content.references.push({
              content_type: "Note",
              uuid: note.uuid
            });
          }

          var xmlTags = xmlNote.getElementsByTagName("tag");
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = xmlTags[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var tagXml = _step3.value;

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
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
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
    key: 'convertGKeepNotes',
    value: function convertGKeepNotes(rawNotes) {
      var stripHTML = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      // Final notes array
      var notes = [];

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = rawNotes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var note = _step4.value;

          var jsonNoteContent = this.parseJsonGKeepNote(note.content);
          if (jsonNoteContent) {
            notes.push(jsonNoteContent);
            continue;
          }

          // Parse note html
          var el = document.createElement('html');
          el.innerHTML = note.content;

          // Try to get note content
          var content = void 0;
          try {
            var contentElement = el.getElementsByClassName('content')[0];

            // Replace <br> with \n so line breaks get recognised
            contentElement.innerHTML = contentElement.innerHTML.replace(/<br>/g, "\n");

            // Get note content, removing newline from todo lists
            if (stripHTML) {
              content = contentElement.innerText.replace(/☐\n/g, '☐').replace(/☑\n/g, '☑');
            } else {
              content = contentElement.innerHTML;
            }
          } catch (e) {
            // Invalid note, continue
            console.log(note.name, "is an invalid note (no content)");
            continue;
          }

          // Try to get note title
          var title = void 0;
          try {
            title = el.getElementsByTagName('title')[0].innerText;
          } catch (e) {
            // Invalid note, continue
            console.log(note.name, "is an invalid note (no title)");
            continue;
          }

          // Check if title is date (default if no title is set). If so, use empty string
          if (title !== '' && !isNaN(new Date(title))) {
            title = '';
          }

          // Try to find creation date, usually before div.content or div.title
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
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return {
        "items": notes
      };
    }
  }, {
    key: 'getDateFromGKeepNote',
    value: function getDateFromGKeepNote(withTitle, note) {
      var regex = void 0;
      if (withTitle) {
        regex = /.*(?=<\/div>\n<div class="title">)/;
      } else {
        regex = /.*(?=<\/div>\n\n<div class="content">)/;
      }
      var dateString = regex.exec(note);
      // Check if string exists at all
      if (dateString && dateString[0]) {
        // Check if string is valid date
        if (!isNaN(new Date(dateString))) {
          return new Date(dateString);
        }
      }
      return false;
    }
  }, {
    key: 'parseJsonGKeepNote',
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
              "org.standardnotes.sn": {
                "client_updated_at": date,
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
    key: 'setClientUpdatedAt',
    value: function setClientUpdatedAt(item, date) {
      item.content.appData = {
        "org.standardnotes.sn": {
          "client_updated_at": date
        }
      };
    }
  }, {
    key: 'convertPlaintextFiles',
    value: function convertPlaintextFiles(files, completion) {
      var index = 0;
      var processedData = [];

      var dateString = new Date().toLocaleDateString().replace(/\//g, '-');
      var defaultTag = {
        uuid: this.generateUUID(),
        content_type: "Tag",
        content: {
          title: dateString + '-import',
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
            content_type: "Note",
            content: {
              title: file.name.split(".")[0],
              text: data,
              references: []
            }
          };
          this.setClientUpdatedAt(note, note.updated_at);
          processedData.push(note);
          defaultTag.content.references.push({
            content_type: "Note",
            uuid: note.uuid
          });

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
  }, {
    key: 'convertSimplenoteFiles',
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

          var title = file.name.split(".")[0];

          var data = e.target.result;
          var tagsMarker = "\nTags:\n  ";

          var _data$replaceAll$subs = data.replaceAll("\r\n", "\n").substring(title.concat("\n").length).split(tagsMarker),
              _data$replaceAll$subs2 = _slicedToArray(_data$replaceAll$subs, 2),
              newData = _data$replaceAll$subs2[0],
              currentTags = _data$replaceAll$subs2[1];

          currentTags = currentTags ? currentTags.split(", ") : [];

          var note = {
            created_at: new Date(file.lastModified),
            updated_at: new Date(file.lastModified),
            uuid: this.generateUUID(),
            content_type: "Note",
            content: {
              title: title,
              text: newData,
              references: []
            }
          };
          this.setClientUpdatedAt(note, note.updated_at);
          processedData.push(note);

          var noteReference = {
            content_type: "Note",
            uuid: note.uuid
          };

          currentTags.forEach(function (tag) {
            if (!tags.has(tag)) {
              tags.set(tag, {
                uuid: _this.generateUUID(),
                content_type: "Tag",
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
            completion({ items: Array.from(tags.values()).concat(processedData) });
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
