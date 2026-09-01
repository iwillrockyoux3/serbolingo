const DB_NAME = 'SerboLingoDB';
const DB_VERSION = 5;

const db = {
    _db: null,

    async init() {
        return new Promise((resolve, reject) => {
            // Global timeout for the entire IndexedDB init sequence to prevent silent hangs on file:///
            const timeoutId = setTimeout(() => {
                console.warn("IndexedDB init timed out (likely a file:/// transaction hang). Using fallback.");
                resolve(); // Resolve to let app.js continue
            }, 1000); // 1 second is plenty for local DB init

            try {
                const request = indexedDB.open(DB_NAME, DB_VERSION);

                request.onupgradeneeded = (event) => {
                    const database = event.target.result;
                    if (database.objectStoreNames.contains('dictionary')) {
                        database.deleteObjectStore('dictionary');
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
                    clearTimeout(timeoutId); // Only clear when EVERYTHING is fully done
                    resolve();
                };

                request.onerror = (event) => {
                    clearTimeout(timeoutId);
                    console.error("IndexedDB error:", event.target.error);
                    resolve();
                };
                
                request.onblocked = () => {
                    clearTimeout(timeoutId);
                    console.warn("IndexedDB blocked.");
                    resolve();
                };
            } catch (e) {
                clearTimeout(timeoutId);
                console.warn("IndexedDB access error:", e);
                resolve();
            }
        });
    },

    async seedDatabase() {
        try {
            const data = window.SEED_DATA || [];
            
            return new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => resolve(), 2000);
                try {
                    const transaction = this._db.transaction(['dictionary'], 'readwrite');
                    const store = transaction.objectStore('dictionary');

                    data.forEach(word => {
                        store.put(word);
                    });

                    transaction.oncomplete = () => {
                        clearTimeout(timeoutId);
                        console.log("Database seeded successfully.");
                        resolve();
                    };

                    transaction.onerror = (event) => {
                        clearTimeout(timeoutId);
                        console.error("Error seeding database:", event.target.error);
                        resolve();
                    };
                } catch(e) {
                    clearTimeout(timeoutId);
                    resolve();
                }
            });
        } catch (error) {
            console.error("Failed to fetch seed data:", error);
        }
    },

    countWords() {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => resolve(0), 1000);
            try {
                const transaction = this._db.transaction(['dictionary'], 'readonly');
                const store = transaction.objectStore('dictionary');
                const countRequest = store.count();

                countRequest.onsuccess = () => { clearTimeout(timeoutId); resolve(countRequest.result); };
                countRequest.onerror = () => { clearTimeout(timeoutId); resolve(0); };
            } catch (e) {
                clearTimeout(timeoutId);
                resolve(0);
            }
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
