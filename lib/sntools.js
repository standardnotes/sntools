const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const utc = require('dayjs/plugin/utc');
dayjs.extend(customParseFormat);
dayjs.extend(utc);

const dateFormat = 'YYYYMMDDTHHmmss';

export class Tools {
  generateUUID() {
    const crypto = window.crypto || window.msCrypto;
    if (crypto) {
      const buf = new Uint32Array(4);
      crypto.getRandomValues(buf);
      let idx = -1;
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        idx++;
        const r = (buf[idx>>3] >> ((idx%8)*4))&15;
        const v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    } else {
      let date = new Date().getTime();
      if (window.performance && typeof window.performance.now === 'function'){
        date += performance.now(); //use high-precision timer if available
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (date + Math.random()*16)%16 | 0;
        date = Math.floor(date/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
    }
  }

  strip(html) {
    if (typeof html !== 'string') {
      return '';
    }
    const tmp = document.implementation.createHTMLDocument('New').body;
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  loadXMLString(string, type) {
    let xmlDoc;
    if (window.DOMParser) {
      const parser = new DOMParser();
      xmlDoc = parser.parseFromString(string, `text/${type}`);
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
    const makeTextFile = function (text) {
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

    const file = makeTextFile(JSON.stringify(data, null, 2 /* pretty print */));

    const link = document.createElement('a');
    link.setAttribute('download', filename);
    link.href = file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  convertENEXDatatoSN(data, stripHTML = false, defaultTagName = 'evernote') {
    const xmlDoc = this.loadXMLString(data, 'xml');
    const xmlNotes = xmlDoc.getElementsByTagName('note');
    const notes = [];
    const tags = [];
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

    for (const [index, xmlNote] of [...xmlNotes].entries()) {
      const title = xmlNote.getElementsByTagName('title')[0].textContent;
      const created = xmlNote.getElementsByTagName('created')[0].textContent;
      const updatedNodes = xmlNote.getElementsByTagName('updated');
      const updated = updatedNodes.length ? updatedNodes[0].textContent : null;
      const contentNode = xmlNote.getElementsByTagName('content')[0];
      let contentXmlString;
      /** Find the node with the content */
      for (const node of contentNode.childNodes) {
        if (node instanceof CDATASection) {
          contentXmlString = node.nodeValue;
          break;
        }
      }
      const contentXml = this.loadXMLString(contentXmlString, 'html');
      let contentHTML = contentXml.getElementsByTagName('en-note')[0].innerHTML;
      if (stripHTML) {
        contentHTML = contentHTML.replace(/<\/div>/g, '</div>\n');
        contentHTML = contentHTML.replace(/<li[^>]*>/g, '\n');
        contentHTML = contentHTML.trim();
      }
      const text = stripHTML ? this.strip(contentHTML) : contentHTML;
      const note = {
        created_at: dayjs.utc(created, dateFormat).toDate(),
        updated_at: updated ? dayjs.utc(updated, dateFormat).toDate() : dayjs.utc(created, dateFormat).toDate(),
        uuid: this.generateUUID(),
        content_type: 'Note',
        content: {
          title: !title ? `Imported note ${index + 1} from Evernote` : title,
          text,
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

      const xmlTags = xmlNote.getElementsByTagName('tag');
      for (const tagXml of xmlTags) {
        const tagName = tagXml.childNodes[0].nodeValue;
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
    const finalNotes = [];

    for (const [index, note] of rawNotes.entries()) {
      const jsonNoteContent = this.parseJsonGKeepNote(note.content);
      if (jsonNoteContent) {
        finalNotes.push(jsonNoteContent);
        continue;
      }

      // Parse note html
      const element = document.createElement('html');
      element.innerHTML = note.content;

      // Try to get note content
      let content;
      try {
        const contentElement = element.getElementsByClassName('content')[0];
        // Replace <br> with \n so line breaks get recognised
        contentElement.innerHTML = contentElement.innerHTML.replace(/<br>/g, '\n');

        // Get note content, removing newline from todo lists
        if (stripHTML) {
          content = contentElement.textContent;
        } else {
          content = contentElement.innerHTML;
        }
      } catch (e) {
        // Invalid note, continue
        console.log(note.name, 'is an invalid note (no content)');
        continue;
      }

      let title = element.getElementsByClassName('title')[0]?.textContent;
      if (!title) {
        title = `Imported note ${index + 1} from Google Keep`;
      }

      // Try to find creation date, usually before div.content or div.title
      const date = this.getDateFromGKeepNote(true, note.content) ||
        this.getDateFromGKeepNote(false, note.content) ||
        new Date();


      const noteResult = {
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
      finalNotes.push(noteResult);
    }
    return {
      'items': finalNotes
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
      const parsedDate = dayjs.utc(dateString).toDate();
      // Check if string is valid date
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    return false;
  }

  parseJsonGKeepNote(content) {
    try {
      const parsed = JSON.parse(content);
      const date = dayjs(parsed.userEditedTimestampUsec / 1000).toDate();
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
    const processedData = [];

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
      const file = files[index];
      index++;
      const reader = new FileReader();

      reader.onload = function(e) {
        const data = e.target.result;
        const note = {
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

  convertSimplenoteFiles(rawNotes) {
    const finalNotes = [];

    for (const note of rawNotes) {
      const jsonNoteContent = this.parseJsonSimplenote(note);
      if (jsonNoteContent) {
        finalNotes.push(...jsonNoteContent);
        continue;
      }
    }
    return {
      'items': finalNotes
    };
  }

  parseJsonSimplenote(note) {
    const processParsedNotes = (notes, trashed = false) => {
      return notes.reverse().map((noteItem) => {
        const createDate = dayjs.utc(noteItem.creationDate, dateFormat).toDate();
        const updateDate = dayjs.utc(noteItem.lastModified, dateFormat).toDate();
        const noteContent = noteItem.content.split('\r\n');

        let title;
        let content;

        if (noteContent.length === 2 && noteContent[1].length > 0) {
          title = noteContent[0];
          content = noteContent[1];
        } else {
          title = note.name.split('.')[0];
          content = noteItem.content;
        }

        return {
          created_at: createDate,
          updated_at: updateDate,
          uuid: this.generateUUID(),
          content_type: 'Note',
          content: {
            title,
            text: content,
            references: [],
            appData: {
              'org.standardnotes.sn': {
                'client_updated_at': updateDate,
                trashed
              }
            }
          },
        };
      });
    };

    try {
      const parsed = JSON.parse(note.content);
      const activeNotes = processParsedNotes(parsed.activeNotes);
      const trashedNotes = processParsedNotes(parsed.trashedNotes, true);

      return [
        ...activeNotes,
        ...trashedNotes
      ];
    } catch (e) {
      return null;
    }
  }
}
