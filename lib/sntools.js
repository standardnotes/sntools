class SNTools {

  generateUUID() {
    let crypto = window.crypto || window.msCrypto;
    if (crypto) {
      let buf = new Uint32Array(4);
      crypto.getRandomValues(buf);
      let idx = -1;
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        idx++;
        let r = (buf[idx>>3] >> ((idx%8)*4))&15;
        let v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    } else {
      let d = new Date().getTime();
      if (window.performance && typeof window.performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
      }
      let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    }
  }

  strip(html) {
    let tmp = document.implementation.createHTMLDocument('New').body;
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  loadXMLString(string, type) {
    let xmlDoc;
    if (window.DOMParser) {
      let parser = new DOMParser();
      xmlDoc = parser.parseFromString(string, 'text/' + type);
    } else {
      // Internet Explorer
      xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
      xmlDoc.async = false;
      xmlDoc.loadXML(string);
    }

    return xmlDoc;
  }

  downloadSNData(data, filename) {
    let textFile = null;
    let makeTextFile = function (text) {
      let data = new Blob([text], { type: 'text/json' });

      // If we are replacing a previously generated file we need to
      // manually revoke the object URL to avoid memory leaks.
      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }

      textFile = window.URL.createObjectURL(data);

      // returns a URL you can use as a href
      return textFile;
    };

    let file = makeTextFile(JSON.stringify(data, null, 2 /* pretty print */));

    let link = document.createElement('a');
    link.setAttribute('download', filename);
    link.href = file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  convertENEXDatatoSN(data, stripHTML = false, defaultTagName = 'evernote') {
    let xmlDoc = this.loadXMLString(data, 'xml');
    let xmlNotes = xmlDoc.getElementsByTagName('note');
    let notes = [];
    let tags = [];
    let defaultTag;

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
      return tags.filter(function(tag){
        return tag.content.title == title;
      })[0];
    }

    function addTag(tag) {
      tags.push(tag);
    }

    for (let xmlNote of xmlNotes) {
      let title = xmlNote.getElementsByTagName('title')[0].childNodes[0].nodeValue;
      let created = xmlNote.getElementsByTagName('created')[0].childNodes[0].nodeValue;
      let updatedNodes = xmlNote.getElementsByTagName('updated');
      let updated = updatedNodes.length ? updatedNodes[0].childNodes[0].nodeValue : null;
      let contentNode = xmlNote.getElementsByTagName('content')[0];
      let contentXmlString;
      /** Find the node with the content */
      for (let node of contentNode.childNodes) {
        if (node instanceof CDATASection) {
          contentXmlString = node.nodeValue;
          break;
        }
      }
      let contentXml = this.loadXMLString(contentXmlString, 'html');
      let contentHTML = contentXml.getElementsByTagName('en-note')[0].innerHTML;
      if (stripHTML) {
        contentHTML = contentHTML.replace(/<br[^>]*>/g, '\n\n');
        contentHTML = contentHTML.replace(/<li[^>]*>/g, '\n');
      }
      let text = stripHTML ? this.strip(contentHTML) : contentHTML;

      let note = {
        created_at: moment(created).toDate(),
        updated_at: updated ? moment(updated).toDate() : moment(created).toDate(),
        uuid: this.generateUUID(),
        content_type: 'Note',
        content: {
          title: title,
          text: text,
          references: [],
        }
      };

      this.setClientUpdatedAt(note, note.updated_at);

      if (defaultTag) {
        defaultTag.content.references.push({
          content_type: 'Note',
          uuid: note.uuid
        });
      }

      let xmlTags = xmlNote.getElementsByTagName('tag');
      for (let tagXml of xmlTags) {
        let tagName = tagXml.childNodes[0].nodeValue;
        let tag = findTag(tagName);
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

        note.content.references.push({ content_type: tag.content_type, uuid: tag.uuid });
        tag.content.references.push({ content_type: note.content_type, uuid: note.uuid });
      }

      notes.push(note);
    }

    let allItems = notes.concat(tags);
    if (defaultTag) {
      allItems.push(defaultTag);
    }

    let itemsData = {
      items: allItems
    };

    return itemsData;
  }

  convertGKeepNotes(rawNotes, stripHTML = false) {
    // Final notes array
    let notes = [];

    for (let note of rawNotes) {
      const jsonNoteContent = this.parseJsonGKeepNote(note.content);
      if (jsonNoteContent) {
        notes.push(jsonNoteContent);
        continue;
      }

      // Parse note html
      let el = document.createElement('html');
      el.innerHTML = note.content;

      // Try to get note content
      let content;
      try {
        let contentElement = el.getElementsByClassName('content')[0];

        // Replace <br> with \n so line breaks get recognised
        contentElement.innerHTML = contentElement.innerHTML.replace(/<br>/g, '\n');

        // Get note content, removing newline from todo lists
        if (stripHTML) {
          content = contentElement.innerText.replace(/☐\n/g, '☐').replace(/☑\n/g, '☑');
        } else {
          content = contentElement.innerHTML;
        }
      } catch (e) {
        // Invalid note, continue
        console.log(note.name, 'is an invalid note (no content)');
        continue;
      }

      // Try to get note title
      let title;
      try {
        title = el.getElementsByTagName('title')[0].innerText;
      } catch (e) {
        // Invalid note, continue
        console.log(note.name, 'is an invalid note (no title)');
        continue;
      }

      // Check if title is date (default if no title is set). If so, use empty string
      if (title !== '' && !isNaN(new Date(title))) {
        title = '';
      }

      // Try to find creation date, usually before div.content or div.title
      const date = this.getDateFromGKeepNote(true, note.content) ||
        this.getDateFromGKeepNote(false, note.content) ||
        new Date();

      let noteResult = {
        created_at: date,
        updated_at: date,
        uuid: this.generateUUID(),
        content_type: 'Note',
        content: {
          title,
          text: content,
          references: [],
        },
      };

      this.setClientUpdatedAt(noteResult, date);
      notes.push(noteResult);
    }
    return {
      'items': notes
    };
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

  parseJsonGKeepNote(content) {
    try {
      const parsed = JSON.parse(content);
      const date = new Date(parsed.userEditedTimestampUsec / 1000);
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
              pinned: Boolean(parsed.isPinned),
            }
          }
        },
      };
    } catch (e) {
      return null;
    }
  }

  setClientUpdatedAt(item, date) {
    item.content.appData = {
      'org.standardnotes.sn': {
        'client_updated_at': date
      }
    };
  }

  convertPlaintextFiles(files, completion) {
    let index = 0;
    let processedData = [];

    const dateString = new Date().toLocaleDateString().replace(/\//g, '-');
    const defaultTag = {
      uuid: this.generateUUID(),
      content_type: 'Tag',
      content: {
        title: `${dateString}-import`,
        references: []
      }
    };
    processedData.push(defaultTag);

    const readNext = function() {
      let file = files[index];
      index++;
      let reader = new FileReader();

      reader.onload = function(e) {
        let data = e.target.result;
        let note = {
          created_at: new Date(file.lastModified),
          updated_at: new Date(file.lastModified),
          uuid: this.generateUUID(),
          content_type: 'Note',
          content: {
            title: file.name.split('.')[0],
            text: data,
            references: [],
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
          completion({ items: processedData });
        }
      }.bind(this);
      reader.readAsText(file);
    }.bind(this);

    readNext();
  }

  convertSimplenoteFiles(files, completion) {
    let index = 0;
    let processedData = [];

    let tags = new Map();

    const readNext = function() {
      let file = files[index];
      index++;
      let reader = new FileReader();

      reader.onload = function(e) {
        let title = file.name.split('.')[0];

        let data = e.target.result;
        let tagsMarker = '\nTags:\n  ';
        let [newData, currentTags] = (data
          .replaceAll('\r\n', '\n')
          .substring(title.concat('\n').length)
          .split(tagsMarker)
        );

        currentTags = currentTags ?  currentTags.split(', ') : [];

        let note = {
          created_at: new Date(file.lastModified),
          updated_at: new Date(file.lastModified),
          uuid: this.generateUUID(),
          content_type: 'Note',
          content: {
            title: title,
            text: newData,
            references: [],
          }
        };
        this.setClientUpdatedAt(note, note.updated_at);
        processedData.push(note);

        let noteReference = {
          content_type: 'Note',
          uuid: note.uuid,
        };

        currentTags.forEach(tag => {
          if (!tags.has(tag)) {
            tags.set(tag, {
              uuid: this.generateUUID(),
              content_type: 'Tag',
              content: {
                title: tag,
                references: [noteReference],
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
}

window.SNTools = new SNTools();
