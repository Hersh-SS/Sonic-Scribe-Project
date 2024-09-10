export var db;

const DB_NAME = "NoteSequencesDB";
const DB_VERSION = 1;
const DB_STORE_NAME = "scores";
const MAX_STORAGE = 12; // Maximum number of note sequences that can be stored

openNoteSequenceDB();
function openNoteSequenceDB() {
	console.log("openNoteSequenceDB ...");
	if (typeof indexedDB !== 'undefined') {
		// Use indexedDB
		var req = indexedDB.open(DB_NAME, DB_VERSION);

		req.onsuccess = function (evt) {
			db = this.result;
			console.log("openNoteSequenceDB DONE");
		};

		req.onerror = function (evt) {
			console.error("openNoteSequenceDB:", evt.target.errorCode);
		};

		req.onupgradeneeded = function (evt) {
			console.log("openNoteSequenceDB.onupgradeneeded");
			var store = evt.currentTarget.result.createObjectStore(DB_STORE_NAME, { keyPath: "id", autoIncrement: true });
		};
	  } else {
		// Provide a fallback or do nothing
	  }
}

export function pushNoteSequence(noteSequence) {
	// Open a transaction to the database
	var transaction = db.transaction([DB_STORE_NAME], "readwrite");

	// Get the object store from the transaction
	var objstore = transaction.objectStore(DB_STORE_NAME);

	// Count the objects in the store
	var countRequest = objstore.count();
	countRequest.onsuccess = function () {
		if (countRequest.result >= MAX_STORAGE) {
			// If there are too many objects in the store, delete the oldest one
			// Open a cursor that starts at the beginning of the store
			var cursorRequest = objstore.openCursor();
			cursorRequest.onsuccess = function (e) {
				var cursor = e.target.result;
				if (cursor) {
					// Delete the object that the cursor is pointing to
					objstore.delete(cursor.primaryKey);
				}
			};
		}
	};

	// Use the add method to add the noteSequence to the object store
	objstore.add(noteSequence);
}

export function getCachedNoteSequences() {
	return new Promise((resolve, reject) => {
		try {
			// Open a transaction to the database
			var transaction = db.transaction([DB_STORE_NAME], "readonly");

			// Get the object store from the transaction
			var objstore = transaction.objectStore(DB_STORE_NAME);

			// Create a cursor request to get all items in the store
			var request = objstore.openCursor();

			// This array will hold all the note sequences
			var noteSequences = [];

			request.onsuccess = function (event) {
				var cursor = event.target.result;
				if (cursor) {
					// If the cursor isn't null, we got an IndexedDB row. Add it to the note sequence array
					noteSequences.push(cursor.value);
					// Ask for the next data item in the object store
					cursor.continue();
				} else {
					// If we have a null cursor, it means we've got all the data in the store
					console.log(noteSequences);
					resolve(noteSequences);
				}
			};

			request.onerror = function (event) {
				// Handle errors!
				console.log("Database error: " + event.target.errorCode);
				reject(event.target.errorCode);
			};
		} catch (err) {
			openNoteSequenceDB();
		}
	});
}
