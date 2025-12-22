/* ===== STORAGE UTILS ===== */

const Storage = {
    // Save data to LocalStorage
    save(key, data) {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(key, serializedData);
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    // Get data from LocalStorage
    get(key) {
        try {
            const serializedData = localStorage.getItem(key);
            if (serializedData === null) {
                return null;
            }
            return JSON.parse(serializedData);
        } catch (error) {
            console.error('Error getting from localStorage:', error);
            return null;
        }
    },

    // Remove data from LocalStorage
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    // Clear all app data (optional prefix check could be added)
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Export for use in other modules (if using ES modules, otherwise global)
// window.Storage = Storage; 
