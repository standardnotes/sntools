import { readFileSync, statSync } from 'fs';
import { join } from 'path';
import { Tools } from './sntools';

const uuidFormat = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

const sleep = async (seconds) => {
  await new Promise(resolve => setTimeout(resolve, seconds * 1000));
};

describe('sn-tools', () => {

  const tools = new Tools();

  describe('generateUUID()', () => {
    test('length should be 36 characters', () => {
      const uuid = tools.generateUUID();
      expect(uuid.length).toEqual(36);
    });

    it('should have a valid format', () => {
      const uuid = tools.generateUUID();
      expect(uuid).toEqual(expect.stringMatching(uuidFormat));
    });
  });

  describe('strip()', () => {
    it('should strip html from string', () => {
      expect(tools.strip('')).toBe('');
      expect(tools.strip('<div>Test</div>')).toBe('Test');
      expect(tools.strip('<p>Test')).toBe('Test');
      expect(tools.strip('Test')).toBe('Test');
    });

    it('should return an empty string if anything other than a string is passed', () => {
      expect(tools.strip(null)).toBe('');
      expect(tools.strip(false)).toBe('');
      expect(tools.strip(1)).toBe('');
      expect(tools.strip(undefined)).toBe('');
    });
  });

  describe('loadXMLString()', () => {
    it('should load HTML string', () => {
      const htmlString = '<p>This is a simple HTML document</p>';
      const result = tools.loadXMLString(htmlString, 'html');
      expect(result instanceof HTMLDocument).toBe(true);
      expect(result.getElementsByTagName('p')[0].textContent).toBe('This is a simple HTML document');
    });

    it('should load XML string', () => {
      const xmlString = '<note>This is a simple XML document</note>';
      const result = tools.loadXMLString(xmlString, 'xml');
      expect(result instanceof Document).toBe(true);
      expect(result.getElementsByTagName('note')[0].textContent).toBe('This is a simple XML document');
    });
  });

  describe('convertENEXDatatoSN()', () => {
    const filePath = join(__dirname, '../test/data/evernote/exported-notes.enex');
    const exportFile = readFileSync(filePath);
    const parsedFileWithHTML = tools.convertENEXDatatoSN(exportFile, false);
    const parsedFileWithoutHTML = tools.convertENEXDatatoSN(exportFile, true);

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
          title: 'Imported note 2 from Evernote',
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
          title: 'Imported note 2 from Evernote',
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

  describe('convertAegisToSN()', () => {
    const filePath = join(__dirname, '../test/data/aegis/backup.json');
    const content = readFileSync(filePath);
    const metadata = statSync(filePath);
    const parsedFile = tools.convertAegisFile({
      name: 'backup.json',
      lastModified: metadata.mtime,
      content,
    });

    it('should return 2 valid items', () => {
      expect(parsedFile).not.toBe(undefined);
      expect(parsedFile.items).toBeDefined();
      expect(parsedFile.items.length).toBe(2); // 1 Note and 1 Tag

      expect(parsedFile).not.toBe(undefined);
      expect(parsedFile.items).toBeDefined();
      expect(parsedFile.items.length).toBe(2); // 1 Note and 1 Tag
    });

    const { items } = parsedFile;

    const firstItem = items[0];
    const secondItem = items[1];
    
    test("first item should be a Tag", () => {
      expect(firstItem).toEqual({
        uuid: expect.stringMatching(uuidFormat),
        content_type: 'Tag',
        content: {
          title: `${new Date('2022-03-13').toLocaleDateString().replace(/\//g, '-')}-import`,
          references: [
            {
              content_type: 'Note',
              uuid: secondItem.uuid
            }
          ]
        }
      });
    });

    test("second item should be a Note", () => {
      expect(secondItem).toEqual({
        created_at: new Date(metadata.mtime),
        updated_at: new Date(metadata.mtime),
        uuid: expect.stringMatching(uuidFormat),
        content_type: "Note",
        content: {
          title: "backup",
          text: "[{\"service\":\"TestMail\",\"account\":\"test@test.com\",\"secret\":\"TESTMAILTESTMAILTESTMAILTESTMAIL\",\"notes\":\"Some note\"},{\"service\":\"Some Service\",\"account\":\"test@test.com\",\"secret\":\"SOMESERVICESOMESERVICESOMESERVIC\",\"notes\":\"Some other service\"}]",
          references: [],
          appData: {
            "org.standardnotes.sn": {
              client_updated_at: new Date(metadata.mtime),
            },
          },
        },
      });
    });
  });

  describe('convertGKeepNotes()', () => {
    const filesPath = join(__dirname, '../test/data/google-keep');
    const exportFile1 = readFileSync(join(filesPath, 'note-1.json'));
    const exportFile2 = readFileSync(join(filesPath, 'note-2.html'), 'utf-8');

    test('first item should be a Note', () => {
      const data = [
        {
          content: exportFile1,
          name: 'note-1.json'
        }
      ];

      const { items } = tools.convertGKeepNotes(data);
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

      const { items } = tools.convertGKeepNotes(data);
      const secondNote = items[0];

      expect(secondNote).toBeDefined();
      expect(secondNote).toEqual({
        created_at: new Date('2021-04-15T19:07:43.000Z'),
        updated_at: new Date('2021-04-15T19:07:43.000Z'),
        uuid: expect.stringMatching(uuidFormat),
        content_type: 'Note',
        content: {
          title: 'Testing 2',
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          references: [],
          appData: {
            'org.standardnotes.sn': {
              client_updated_at: new Date('2021-04-15T19:07:43.000Z'),
            }
          }
        }
      });
    });
  });

  describe('convertPlaintextFiles()', () => {
    const filesPath = join(__dirname, '../test/data/plaintext');
    const plainTextFile = readFileSync(join(filesPath, 'my-note.md'), 'utf-8');

    const data = [
      new File([plainTextFile], 'my-note.md')
    ];

    let result;

    tools.convertPlaintextFiles(data, (data) => {
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
    const filesPath = join(__dirname, '../test/data/simplenote');
    const jsonFile = readFileSync(join(filesPath, 'notes.json'));

    const data = [
      {
        content: jsonFile,
        name: 'notes.json'
      }
    ];

    const { items } = tools.convertSimplenoteFiles(data);

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
