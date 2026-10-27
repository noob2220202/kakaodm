-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatRoom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "partnerAvatar" TEXT,
    "unreadCount" INTEGER NOT NULL DEFAULT 0,
    "statusBarTime" TEXT NOT NULL DEFAULT '9:41',
    "platform" TEXT NOT NULL DEFAULT 'ios',
    "fontScale" REAL NOT NULL DEFAULT 1,
    "avatarColor" TEXT NOT NULL DEFAULT 'teal',
    "batteryLevel" INTEGER NOT NULL DEFAULT 73,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChatRoom_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChatRoom" ("createdAt", "id", "partnerAvatar", "partnerName", "profileId", "statusBarTime", "unreadCount", "updatedAt") SELECT "createdAt", "id", "partnerAvatar", "partnerName", "profileId", "statusBarTime", "unreadCount", "updatedAt" FROM "ChatRoom";
DROP TABLE "ChatRoom";
ALTER TABLE "new_ChatRoom" RENAME TO "ChatRoom";
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chatRoomId" TEXT NOT NULL,
    "sender" TEXT NOT NULL DEFAULT 'ME',
    "type" TEXT NOT NULL DEFAULT 'TEXT',
    "content" TEXT NOT NULL,
    "timeLabel" TEXT NOT NULL,
    "unread" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("chatRoomId", "content", "createdAt", "id", "order", "sender", "timeLabel", "type") SELECT "chatRoomId", "content", "createdAt", "id", "order", "sender", "timeLabel", "type" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
