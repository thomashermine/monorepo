import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "../../data/feedback.db");

let db: Database.Database;

function getDb(): Database.Database {
    if (!db) {
        db = new Database(DB_PATH);
        db.pragma("journal_mode = WAL");
        db.exec(`
            CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                image_id TEXT NOT NULL,
                x REAL NOT NULL,
                y REAL NOT NULL,
                author TEXT NOT NULL,
                text TEXT NOT NULL,
                created_at TEXT DEFAULT (datetime('now'))
            )
        `);
    }
    return db;
}

export interface Comment {
    id: number;
    image_id: string;
    x: number;
    y: number;
    author: string;
    text: string;
    created_at: string;
}

export function getComments(imageId: string): Comment[] {
    return getDb()
        .prepare("SELECT * FROM comments WHERE image_id = ? ORDER BY created_at ASC")
        .all(imageId) as Comment[];
}

export function createComment(data: {
    imageId: string;
    x: number;
    y: number;
    author: string;
    text: string;
}): Comment {
    const stmt = getDb().prepare(
        "INSERT INTO comments (image_id, x, y, author, text) VALUES (?, ?, ?, ?, ?)"
    );
    const result = stmt.run(data.imageId, data.x, data.y, data.author, data.text);
    return getDb()
        .prepare("SELECT * FROM comments WHERE id = ?")
        .get(result.lastInsertRowid) as Comment;
}
