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
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  convertENEXDatatoSN(data, stripHTML = false, defaultTagName = "evernote") {
    var xmlDoc = this.loadXMLString(data, "xml");
    var xmlNotes = xmlDoc.getElementsByTagName("note");
    var notes = [];
    var tags = [];
    var defaultTag;

    if(defaultTagName) {
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
      if(stripHTML) {
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
          references: [],
        }
      };

      if(defaultTag) {
        defaultTag.content.references.push({
          content_type: "Note",
          uuid: note.uuid
        })
      }

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

    var allItems = notes.concat(tags);
    if(defaultTag) {
      allItems.push(defaultTag);
    }

    var itemsData = {
      items: allItems
    }

    return itemsData;
  }

  convertGKeepNotes(rawNotes, stripHTML = false) {
    // Final notes array
    let notes = [];

    for (let note of rawNotes) {
      // Parse note html
      let el = document.createElement('html');
      el.innerHTML = note.content;

      // Try to get note content
      let content;
      try {
        let contentElement = el.getElementsByClassName('content')[0];

        // Replace <br> with \n so line breaks get recognised
        contentElement.innerHTML = contentElement.innerHTML.replace(/<br>/g, "\n");

        // Get note content, removing newline from todo lists
        if(stripHTML) {
          content = contentElement.innerText.replace(/☐\n/g, '☐').replace(/☑\n/g, '☑');
        } else {
          content = contentElement.innerHTML;
        }
      } catch(e) {
        // Invalid note, continue
        console.log(note.name, "is an invalid note (no content)");
        continue;
      }

      // Try to get note title
      let title;
      try {
        title = el.getElementsByTagName('title')[0].innerText;
      } catch(e) {
        // Invalid note, continue
        console.log(note.name, "is an invalid note (no title)");
        continue;
      }

      // Check if title is date (default if no title is set). If so, use empty string
      if (title !== '' && !isNaN(new Date(title))) {
        title = '';
      }

      // Try to find creation date, usually before div.content or div.title
      const date =
        this.getDateFromGKeepNote(true, note.content) || 
        this.getDateFromGKeepNote(false, note.content) ||
        new Date();


      notes.push({
        created_at: date,
        updated_at: date,
        uuid: this.generateUUID(),
        content_type: 'Note',
        content: {
          title,
          text: content,
          references: [],
        },
      });
    }
    return {
      "items": notes
    }
  }
  getDateFromGKeepNote(withTitle, note) {
    let regex;
    if (withTitle) {
      regex = /.*(?=<\/div>\n<div class="title">)/;
    } else {
      regex = /.*(?=<\/div>\n\n<div class="content">)/;
    }
    const dateString = regex.exec(note);
    // Check if string exists at all
    if (dateString && dateString[0]) {
      // Check if string is valid date
      if (!isNaN(new Date(dateString))) {
        return new Date(dateString);
      }
    }
    return false;
  }

  convertPlaintextFiles(files, completion) {
    var index = 0;
    var processedData = [];

    var readNext = function() {
      var file = files[index];
      index++;
      var reader = new FileReader();

      reader.onload = function(e) {

        var data = e.target.result;
        var note = {
          created_at: new Date(file.lastModified),
          updated_at: new Date(file.lastModified),
          uuid: this.generateUUID(),
          content_type: "Note",
          content: {
            title: file.name.split(".")[0],
            text: data,
            references: [],
          }
        };
        processedData.push(note);

        if(index < files.length) {
          readNext();
        } else {
          completion({items: processedData});
        }
      }.bind(this)
      reader.readAsText(file);
    }.bind(this);

    readNext();
  }
}

window.SNTools = new SNTools()
