import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)
const dbName = 'Tourist'

export async function connectDB() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect()
  }
  return client.db(dbName)
}
