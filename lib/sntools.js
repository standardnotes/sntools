class SNTools {

  generateUUID() {
    var crypto = window.crypto || window.msCrypto;
    if(crypto) {
      var buf = new Uint32Array(4);
      crypto.getRandomValues(buf);
      var idx = -1;
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          idx++;
          var r = (buf[idx>>3] >> ((idx%8)*4))&15;
          var v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
    } else {
      var d = new Date().getTime();
      if(window.performance && typeof window.performance.now === "function"){
        d += performance.now(); //use high-precision timer if available
      }
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    }
  }

  strip(html) {
     var tmp = document.implementation.createHTMLDocument("New").body;
     tmp.innerHTML = html;
     return tmp.textContent || tmp.innerText || "";
  }

  loadXMLString(string, type) {
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

  downloadSNData(data, filename) {
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
    }

    var file = makeTextFile(JSON.stringify(data, null, 2 /* pretty print */));

    var link = document.createElement('a');
    link.setAttribute('download', filename);
    link.href = file;
    link.click();
  }

  convertENEXDatatoSN(data) {
    var xmlDoc = this.loadXMLString(data, "xml");
    var xmlNotes = xmlDoc.getElementsByTagName("note");
    var notes = [];
    var tags = [];

    function findTag(title) {
      return tags.filter(function(tag){
        return tag.content.title == title;
      })[0];
    }

    function addTag(tag) {
      tags.push(tag);
    }

    for(var xmlNote of xmlNotes) {
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
          references: [],
        }
      };

      var xmlTags = xmlNote.getElementsByTagName("tag");
      for(var tagXml of xmlTags) {
        var tagName = tagXml.childNodes[0].nodeValue;
        var tag = findTag(tagName);
        if(!tag) {
          tag = {
            uuid: this.generateUUID(),
            content_type: "Tag",
            created_at: new Date(),
            updated_at: new Date(),
            content: {
              title: tagName,
              references: []
            }
          }
          addTag(tag);
        }

        note.content.references.push({content_type: tag.content_type, uuid: tag.uuid})
        tag.content.references.push({content_type: note.content_type, uuid: note.uuid})
      }

      notes.push(note);
    }

    var itemsData = {
      items: notes.concat(tags)
    }

    return itemsData;
  }
}

window.SNTools = new SNTools()
