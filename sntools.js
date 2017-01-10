(function(root, factory) {
  // CommonJS
  if (typeof exports == 'object') {
    module.exports = factory();
  }
  // AMD module
  else if (typeof define == 'function' && define.amd) {
    define(factory);
  }
  // Browser global
  else {
    root.SNTools = factory();
  }
}
(this, function() {
  "use strict";

  function SNTools() {}

  function strip(html) {
     var tmp = document.implementation.createHTMLDocument("New").body;
     tmp.innerHTML = html;
     return tmp.textContent || tmp.innerText || "";
  }

  var loadXMLString = function(string) {
    var xmlDoc;
    if (window.DOMParser) {
      var parser = new DOMParser();
      xmlDoc = parser.parseFromString(string, "text/xml");
    } else {
      // Internet Explorer
      xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = false;
      xmlDoc.loadXML(string);
    }

    return xmlDoc;
  }

  SNTools.downloadSNData = function(data, filename) {
    var textFile = null;
    var makeTextFile = function (text) {
      var data = new Blob([text], {type: 'text/json'});

      // If we are replacing a previously generated file we need to
      // manually revoke the object URL to avoid memory leaks.
      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }

      textFile = window.URL.createObjectURL(data);

      // returns a URL you can use as a href
      return textFile;
    }.bind(this);

    var file = makeTextFile(JSON.stringify(data, null, 2 /* pretty print */));

    var link = document.createElement('a');
    link.setAttribute('download', filename);
    link.href = file;
    link.click();
  }

  SNTools.convertENEXDatatoSN = function(data) {
    var xmlDoc = loadXMLString(data);
    console.log(xmlDoc);
    var xmlNotes = xmlDoc.getElementsByTagName("note");
    var notes = [];

    xmlNotes.forEach(function(xmlNote){
      var title = xmlNote.getElementsByTagName("title")[0].childNodes[0].nodeValue;
      var created = xmlNote.getElementsByTagName("created")[0].childNodes[0].nodeValue;
      var updated = xmlNote.getElementsByTagName("updated")[0].childNodes[0].nodeValue;

      var contentXml = loadXMLString(xmlNote.getElementsByTagName("content")[0].childNodes[0].nodeValue);
      var text = strip(contentXml.getElementsByTagName("en-note")[0].innerHTML);

      var note = {
        created_at: moment(created).toDate(),
        updated_at: moment(updated).toDate(),
        content_type: "Note",
        content: {
          title: title,
          text: text,
        }
      };

      notes.push(note);
    })

    var itemsData = {
      items: notes
    }

    return itemsData
  }

  return SNTools
}));
