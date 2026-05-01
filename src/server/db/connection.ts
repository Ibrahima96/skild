import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	throw new Error("MONGODB_URI is not defined in the environment");
}

type MongooseCache = {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
};

declare global {
	// Cache the connection across hot reloads in development.
	// eslint-disable-next-line no-var
	var mongooseCache: MongooseCache | undefined;
}

const cached = globalThis.mongooseCache ?? {
	conn: null,
	promise: null,
};

globalThis.mongooseCache = cached;

export async function connectToDatabase() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URI!, {
			bufferCommands: false,
			dbName: "Skild",
		});
	}

	cached.conn = await cached.promise;
	return cached.conn;
}

export async function disconnectFromDatabase() {
	if (!cached.conn) {
		return;
	}

	await mongoose.disconnect();
	cached.conn = null;
	cached.promise = null;
}
