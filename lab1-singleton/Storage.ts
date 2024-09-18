abstract class FileStorage {
    constructor() {
        if (this.constructor === FileStorage) {
            throw new Error("Cannot instantiate abstract class FileStorage")
        }
    }

    getType() { }
}

class LocalFileStorage extends FileStorage {
    constructor() {
        super()
    }

    getType() {
        console.log('Local storage')        
     }
}

class AmazonS3FileStorage extends FileStorage {
    constructor() {
        super()
    }

    getType() {
        console.log('AmazonS3 storage') 
    }
}

class UserFileStorageManager {
    static #instance: UserFileStorageManager
    #userStorages: { [userId: string]: FileStorage } = {}

    private constructor() { }

    public static get instance(): UserFileStorageManager {
        if (!UserFileStorageManager.#instance) {
            UserFileStorageManager.#instance = new UserFileStorageManager()
        }

        return UserFileStorageManager.#instance;
    }

    public connectToFileStorage(userId: string, storageType: string) {
        let storage: FileStorage | null = null

        switch (storageType) {
            case 'local':
                storage = new LocalFileStorage()
                break;

            case 'amazonS3':
                storage = new AmazonS3FileStorage()
                break;

            default:
                throw new Error(`Unknown storage type: ${storageType}`);
        }

        this.#userStorages[userId] = storage
        return storage
    }

    public getUserFileStorage(userId: string): FileStorage {
        const storage = this.#userStorages[userId]
        if (!storage) {
            throw new Error(`No file storage found for user ID: ${userId}`)
        }
        return storage
    }
}

// example
const manager = UserFileStorageManager.instance;

const storage1 = manager.connectToFileStorage("user1", "local");
manager.getUserFileStorage("user1").getType()

const storage2 = manager.connectToFileStorage("user2", "amazonS3");
manager.getUserFileStorage("user2").getType()