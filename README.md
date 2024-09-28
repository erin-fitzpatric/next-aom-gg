## Getting Started

### Step 1: Install MongoDB

1. Go to the [MongoDB Download Center](https://www.mongodb.com/try/download/community).
2. Select your operating system and download the installer.
3. Follow the installation instructions for your OS.

### Step 2: Install MongoDB Compass (GUI)

1. Download MongoDB Compass from the [MongoDB Compass Download Page](https://www.mongodb.com/try/download/compass).
2. Install Compass by following the provided instructions.

### Step 3: Connect to MongoDB using Compass

1. Open MongoDB Compass.
2. In the connection window, enter your connection string:
   - For a local instance, use: `mongodb://localhost:27017`
   - For a remote instance, use your provided connection string (e.g., `mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>`).
3. Click "Connect" to establish the connection.
4. Once connected, you can create a new database by clicking on "Create Database" and entering the database name and collection name.

### Step 4: Install Required Packages

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
MONGO_USER= sharedDevReader
MONGO_PASSWORD= QqPqkj27BDTqymuT
MONGODB_URI="mongodb+srv://sharedDevReader:QqPqkj27BDTqymuT@>@dev.yjhvu.mongodb.net/"
MONGO_APPNAME= Dev
MONGO_HOST= "dev.yjhvu.mongodb.net/"
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