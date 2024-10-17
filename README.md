## Getting Started



### Step 1: Install MongoDB Compass (GUI)

1. Download MongoDB Compass from the [MongoDB Compass Download Page](https://www.mongodb.com/try/download/compass).
2. Install Compass by following the provided instructions.

### Step 2: Connect to MongoDB using Compass

1. Open MongoDB Compass.
2. In the connection window, enter your connection string:
   - For a local instance, use: `mongodb://localhost:27017`
   - For a remote instance, use your provided connection string (e.g., `mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>`).
3. Click "Connect" to establish the connection.
4. Once connected, you can create a new database by clicking on "Create Database" and entering the database name and collection name.

### Step 3: Install Required Packages

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

You will need to set up the following environment variables in your `.env` file for MongoDB:

```
MONGO_USER= https://discord.gg/53NxUdAD5F
MONGO_PASSWORD= https://discord.gg/53NxUdAD5F
MONGODB_URI= https://discord.gg/53NxUdAD5F
MONGO_APPNAME= Dev
MONGO_HOST= "https://discord.gg/53NxUdAD5F"
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev