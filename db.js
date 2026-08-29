const DB_NAME = 'SerboLingoDB';
const DB_VERSION = 4;

const db = {
    _db: null,

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const database = event.target.result;
                if (database.objectStoreNames.contains('dictionary')) {
                    database.deleteObjectStore('dictionary'); // Clear out the old version
                }
                const store = database.createObjectStore('dictionary', { keyPath: 'id' });
                store.createIndex('category', 'category', { unique: false });
            };

            request.onsuccess = async (event) => {
                this._db = event.target.result;
                try {
                    const count = await this.countWords();
                    if (count === 0) {
                        await this.seedDatabase();
                    }
                } catch (seedErr) {
                    console.warn("DB seeding skipped:", seedErr);
                }
                resolve();
            };

            request.onerror = (event) => {
                console.error("IndexedDB error:", event.target.error);
                reject(event.target.error);
            };
        });
    },

    async seedDatabase() {
        try {
            const data = window.SEED_DATA || [];
            
            return new Promise((resolve, reject) => {
                const transaction = this._db.transaction(['dictionary'], 'readwrite');
                const store = transaction.objectStore('dictionary');

                data.forEach(word => {
                    store.put(word);
                });

                transaction.oncomplete = () => {
                    console.log("Database seeded successfully.");
                    resolve();
                };

                transaction.onerror = (event) => {
                    console.error("Error seeding database:", event.target.error);
                    reject(event.target.error);
                };
            });
        } catch (error) {
            console.error("Failed to fetch seed data:", error);
        }
    },

    countWords() {
        return new Promise((resolve, reject) => {
            const transaction = this._db.transaction(['dictionary'], 'readonly');
            const store = transaction.objectStore('dictionary');
            const countRequest = store.count();

            countRequest.onsuccess = () => resolve(countRequest.result);
            countRequest.onerror = () => reject(countRequest.error);
        });
    },

    getAllWords() {
        return new Promise((resolve, reject) => {
            const transaction = this._db.transaction(['dictionary'], 'readonly');
            const store = transaction.objectStore('dictionary');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    getWordsByCategory(category) {
        return new Promise((resolve, reject) => {
            const transaction = this._db.transaction(['dictionary'], 'readonly');
            const store = transaction.objectStore('dictionary');
            const index = store.index('category');
            const request = index.getAll(category);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
};

window.appDb = db;
