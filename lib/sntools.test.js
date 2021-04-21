const fs = require('fs');
const path = require('path');

require('./sntools');

const uuidFormat = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

const sleep = async (seconds) => {
  await new Promise(resolve => setTimeout(resolve, seconds * 1000));
};

describe('sn-tools', () => {
  describe('generateUUID()', () => {
    test('length should be 36 characters', () => {
      const uuid = SNTools.generateUUID();
      expect(uuid.length).toEqual(36);
    });

    it('should have a valid format', () => {
      const uuid = SNTools.generateUUID();
      expect(uuid).toEqual(expect.stringMatching(uuidFormat));
    });
  });

  describe('strip()', () => {
    it('should strip html from string', () => {
      expect(SNTools.strip('')).toBe('');
      expect(SNTools.strip('<div>Test</div>')).toBe('Test');
      expect(SNTools.strip('<p>Test')).toBe('Test');
      expect(SNTools.strip('Test')).toBe('Test');
    });

    it('should return an empty string if anything other than a string is passed', () => {
      expect(SNTools.strip(null)).toBe('');
      expect(SNTools.strip(false)).toBe('');
      expect(SNTools.strip(1)).toBe('');
      expect(SNTools.strip(undefined)).toBe('');
    });
  });

  describe('loadXMLString()', () => {
    it('should load HTML string', () => {
      const htmlString = '<p>This is a simple HTML document</p>';
      const result = SNTools.loadXMLString(htmlString, 'html');
      expect(result instanceof HTMLDocument).toBe(true);
      expect(result.getElementsByTagName('p')[0].textContent).toBe('This is a simple HTML document');
    });

    it('should load XML string', () => {
      const xmlString = '<note>This is a simple XML document</note>';
      const result = SNTools.loadXMLString(xmlString, 'xml');
      expect(result instanceof Document).toBe(true);
      expect(result.getElementsByTagName('note')[0].textContent).toBe('This is a simple XML document');
    });
  });

  describe('convertENEXDatatoSN()', () => {
    const filePath = path.join(__dirname, '../test/data/evernote/exported-notes.enex');
    const exportFile = fs.readFileSync(filePath);
    const parsedFileWithHTML = SNTools.convertENEXDatatoSN(exportFile, false);
    const parsedFileWithoutHTML = SNTools.convertENEXDatatoSN(exportFile, true);

    it('should return 3 valid items', () => {
      expect(parsedFileWithHTML).not.toBe(undefined);
      expect(parsedFileWithHTML.items).toBeDefined();
      expect(parsedFileWithHTML.items.length).toBe(3); // 2 Notes and 1 Tag

      expect(parsedFileWithoutHTML).not.toBe(undefined);
      expect(parsedFileWithoutHTML.items).toBeDefined();
      expect(parsedFileWithoutHTML.items.length).toBe(3); // 2 Notes and 1 Tag
    });

    const { items: itemsWithHTML } = parsedFileWithHTML;
    const { items: itemsWithoutHTML } = parsedFileWithoutHTML;

    const firstNoteWithHTML = itemsWithHTML[0];
    const secondNoteWithHTML = itemsWithHTML[1];
    const firstTagWithHTML = itemsWithHTML[2];

    const firstNoteWithoutHTML = itemsWithoutHTML[0];
    const secondNoteWithoutHTML = itemsWithoutHTML[1];

    test('first item should be a Note', () => {
      expect(firstNoteWithHTML).toEqual({
        created_at: new Date('2021-03-08T05:16:14.000Z'),
        updated_at: new Date('2021-03-08T05:18:55.000Z'),
        uuid: expect.stringMatching(uuidFormat),
        content_type: 'Note',
        content: {
          title: 'Testing 1',
          text: '<div>This is a test.</div>',
          references: [],
          appData: {
            'org.standardnotes.sn': {
              client_updated_at: new Date('2021-03-08T05:18:55.000Z')
            }
          }
        }
      });

      expect(firstNoteWithoutHTML).toEqual({
        created_at: new Date('2021-03-08T05:16:14.000Z'),
        updated_at: new Date('2021-03-08T05:18:55.000Z'),
        uuid: expect.stringMatching(uuidFormat),
        content_type: 'Note',
        content: {
          title: 'Testing 1',
          text: 'This is a test.',
          references: [],
          appData: {
            'org.standardnotes.sn': {
              client_updated_at: new Date('2021-03-08T05:18:55.000Z')
            }
          }
        }
      });
    });

    test('second item should be a Note', () => {
      expect(secondNoteWithHTML).toEqual({
        created_at: new Date('2020-05-08T23:48:29.000Z'),
        updated_at: new Date('2020-05-08T23:52:33.000Z'),
        uuid: expect.stringMatching(uuidFormat),
        content_type: 'Note',
        content: {
          title: 'Imported note 2 from ENote',
          text: '<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>',
          references: [],
          appData: {
            'org.standardnotes.sn': {
              client_updated_at: new Date('2020-05-08T23:52:33.000Z')
            }
          }
        }
      });

      expect(secondNoteWithoutHTML).toEqual({
        created_at: new Date('2020-05-08T23:48:29.000Z'),
        updated_at: new Date('2020-05-08T23:52:33.000Z'),
        uuid: expect.stringMatching(uuidFormat),
        content_type: 'Note',
        content: {
          title: 'Imported note 2 from ENote',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          references: [],
          appData: {
            'org.standardnotes.sn': {
              client_updated_at: new Date('2020-05-08T23:52:33.000Z')
            }
          }
        }
      });
    });

    test('third item should be a Tag', () => {
      expect(firstTagWithHTML).toEqual({
        uuid: expect.stringMatching(uuidFormat),
        content_type: 'Tag',
        content: {
          title: 'evernote',
          references: [
            {
              content_type: 'Note',
              uuid: firstNoteWithHTML.uuid
            },
            {
              content_type: 'Note',
              uuid: secondNoteWithHTML.uuid
            }
          ]
        }
      });
    });
  });

  describe('convertGKeepNotes()', () => {
    const filesPath = path.join(__dirname, '../test/data/google-keep');
    const exportFile1 = fs.readFileSync(path.join(filesPath, 'note-1.json'));
    const exportFile2 = fs.readFileSync(path.join(filesPath, 'note-2.html'), 'utf-8');

    test('first item should be a Note', () => {
      const data = [
        {
          content: exportFile1,
          name: 'note-1.json'
        }
      ];

      const { items } = SNTools.convertGKeepNotes(data);
      const firstNote = items[0];

      expect(firstNote).toBeDefined();
      expect(firstNote).toEqual({
        created_at: new Date('2021-04-15T23:07:30.144Z'),
        updated_at: new Date('2021-04-15T23:07:30.144Z'),
        uuid: expect.stringMatching(uuidFormat),
        content_type: 'Note',
        content: {
          title: 'Testing 1',
          text: 'This is a test.',
          references: [],
          appData: {
            'org.standardnotes.sn': {
              client_updated_at: new Date('2021-04-15T23:07:30.144Z'),
              archived: false,
              pinned: false,
              trashed: false
            }
          }
        }
      });
    });

    test('second item should be a Note', () => {
      const data = [
        {
          content: exportFile2,
          name: 'note-2.html'
        }
      ];

      const { items } = SNTools.convertGKeepNotes(data);
      const secondNote = items[0];

      expect(secondNote).toBeDefined();
      expect(secondNote).toEqual({
        created_at: new Date('2021-04-15T23:07:43.000Z'),
        updated_at: new Date('2021-04-15T23:07:43.000Z'),
        uuid: expect.stringMatching(uuidFormat),
        content_type: 'Note',
        content: {
          title: 'Testing 2',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          references: [],
          appData: {
            'org.standardnotes.sn': {
              client_updated_at: new Date('2021-04-15T23:07:43.000Z'),
            }
          }
        }
      });
    });
  });

  describe('convertPlaintextFiles()', () => {
    const filesPath = path.join(__dirname, '../test/data/plaintext');
    const plainTextFile = fs.readFileSync(path.join(filesPath, 'my-note.md'), 'utf-8');

    const data = [
      new File([plainTextFile], 'my-note.md')
    ];

    let result;

    SNTools.convertPlaintextFiles(data, (data) => {
      result = data;
    });

    it('should contain a Note and a Tag', async () => {
      await sleep(0.5);

      const tag = result.items[0];
      const note = result.items[1];

      expect(tag).toBeDefined();
      expect(tag).toEqual({
        uuid: expect.stringMatching(uuidFormat),
        content_type: 'Tag',
        content: {
          title: `${new Date().toLocaleDateString().replace(/\//g, '-')}-import`,
          references: [
            {
              uuid: note.uuid,
              content_type: 'Note'
            }
          ],
        }
      });

      expect(note).toBeDefined();
      expect(note).toEqual({
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        uuid: expect.stringMatching(uuidFormat),
        content_type: 'Note',
        content: {
          title: 'my-note',
          text: '# Testing\n\nThis is the note\'s content.\n',
          references: [],
          appData: {
            'org.standardnotes.sn': {
              client_updated_at: expect.any(Date),
            }
          }
        }
      });
    });
  });

  describe('convertSimplenoteFiles()', () => {
    const filesPath = path.join(__dirname, '../test/data/simplenote');
    const jsonFile = fs.readFileSync(path.join(filesPath, 'notes.json'));

    const data = [
      {
        content: jsonFile,
        name: 'notes.json'
      }
    ];

    const { items } = SNTools.convertSimplenoteFiles(data);

    it('should contain Notes and a Tag', async () => {
      await sleep(0.5);

      const firstNote = items[0];

      expect(firstNote).toBeDefined();
      expect(firstNote).toEqual({
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        uuid: expect.stringMatching(uuidFormat),
        content_type: 'Note',
        content: {
          title: 'Testing 1',
          text: 'This is the 1st note\'s content.',
          references: [],
          appData: {
            'org.standardnotes.sn': {
              client_updated_at: expect.any(Date),
              trashed: false
            }
          }
        }
      });

      const secondNote = items[1];

      expect(secondNote).toBeDefined();
      expect(secondNote).toEqual({
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        uuid: expect.stringMatching(uuidFormat),
        content_type: 'Note',
        content: {
          title: 'Testing 2',
          text: 'This is the 2nd note\'s content.',
          references: [],
          appData: {
            'org.standardnotes.sn': {
              client_updated_at: expect.any(Date),
              trashed: false
            }
          }
        }
      });

      const thirdNote = items[2];

      expect(thirdNote).toBeDefined();
      expect(thirdNote).toEqual({
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        uuid: expect.stringMatching(uuidFormat),
        content_type: 'Note',
        content: {
          title: 'notes',
          text: 'Welcome to Simplenote!',
          references: [],
          appData: {
            'org.standardnotes.sn': {
              client_updated_at: expect.any(Date),
              trashed: true
            }
          }
        }
      });
    });
  });
});
