require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "my_app_db";

if (!uri) {
	throw new Error("MONGODB_URI is missing in environment variables");
}

let client = null;
let database = null;
let dbConnectionError = null;

const connectDB = async () => {
	if (database) {
		return database;
	}

	if (dbConnectionError) {
		throw dbConnectionError;
	}

	client = new MongoClient(uri, {
		serverApi: {
			version: ServerApiVersion.v1,
			strict: true,
			deprecationErrors: true
		}
	});

	try {
		await client.connect();
		database = client.db(dbName);
		await database.command({ ping: 1 });

		console.log(`MongoDB connected: ${dbName}`);
		dbConnectionError = null;
		return database;
	} catch (error) {
		dbConnectionError = error;

		if (error.message && error.message.includes("querySrv ECONNREFUSED")) {
			console.error(
				"Atlas DNS lookup failed. Check internet/DNS or use a non-SRV mongodb:// URI."
			);
		}

		throw error;
	}
};

const getDb = () => {
	if (!database) {
		throw new Error("Database not connected. Call connectDB() first.");
	}

	return database;
};

const getCollection = (collectionName) => {
	return getDb().collection(collectionName);
};

const isDbConnected = () => {
	return Boolean(database);
};

const getDbConnectionError = () => {
	return dbConnectionError ? dbConnectionError.message : null;
};

const closeDB = async () => {
	if (client) {
		await client.close();
		client = null;
		database = null;
	}
};

module.exports = {
	connectDB,
	getDb,
	getCollection,
	isDbConnected,
	getDbConnectionError,
	closeDB
};
