-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "partnerAvatar" TEXT,
    "unreadCount" INTEGER NOT NULL DEFAULT 0,
    "statusBarTime" TEXT NOT NULL DEFAULT '',
    "fontScale" REAL NOT NULL DEFAULT 1,
    "avatarColor" TEXT NOT NULL DEFAULT 'mint',
    "batteryLevel" INTEGER NOT NULL DEFAULT 76,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChatRoom_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChatRoom" ("avatarColor", "batteryLevel", "createdAt", "fontScale", "id", "partnerAvatar", "partnerName", "profileId", "statusBarTime", "unreadCount", "updatedAt") SELECT "avatarColor", "batteryLevel", "createdAt", "fontScale", "id", "partnerAvatar", "partnerName", "profileId", "statusBarTime", "unreadCount", "updatedAt" FROM "ChatRoom";
DROP TABLE "ChatRoom";
ALTER TABLE "new_ChatRoom" RENAME TO "ChatRoom";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

