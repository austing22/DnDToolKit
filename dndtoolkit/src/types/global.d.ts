import type { MongoClient } from "mongodb";

declare global {
  // Allow globalThis._mongoClientPromise in development
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// This makes the file a module and avoids global scope errors
export {};
