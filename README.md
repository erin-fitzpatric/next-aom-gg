# AoM.gg - Online video game hub for Age of Mythology

### Overview and Technology
AoM.gg offers real-time leaderboards, in-depth game statistics, and user-generated content such as game replays and YouTube guides. 
Players can track rankings, analyze match data, and engage with the vibrant strategy gaming community.

### Technology 🔨
Next.js, Vercel, TypeScript, Tailwind CSS, MongoDB, AWS S3, Lambdas

### Home Page 🏠
The landing page of AoM.gg features leaderboard statistics, with the ability to filter by game mode or player name. Leaderboard data is refreshed every 3 minutes by a Lambda service that is extracting leaderboard data from the Athens API (see [aom-lambda](https://github.com/erin-fitzpatric/aom-lambda/blob/main/extract-leaderboard/app.mjs)). Top Reddit posts are queried via the [Reddit API](https://www.reddit.com/dev/api/) from r/AgeOfMythology. Featured YouTube Videos are fetched via the [YouTube Data API v3](https://developers.google.com/youtube/v3/docs), returning 6 of the top viewed Age of Mythology videos from the last 7 days. Live broadcasts and YouTube shorts are filtered out via post processing.

![image](https://github.com/user-attachments/assets/bd68d15c-7c33-4c4a-b272-6033b4d4e02d)

## Player Profile
Players can click on their name on the leaderboard to navigate to their profile. Here they can view their personal game stats and match history. Historical match data is extracted via the Athens API and stored in MongoDB by [aom-lambda](https://github.com/erin-fitzpatric/aom-lambda/blob/main/extract-matches/app.mjs). Since launch in September of 2024, AoM.gg has captured and analyzed over 1 million games!
![image](https://github.com/user-attachments/assets/d5324db2-b8c4-472c-b246-e22ffcf4e868)
![image](https://github.com/user-attachments/assets/6a5bb41d-6e68-4a97-82cb-bbecfa8efb92)

### Recorded Games ⏺️
Players are able to upload recorded game files (.mythrec) that can be downloaded and viewed by other users via the AoM game client. Uploaded files are stored in AWS S3 storage, and are downloaded via signed URLs. Filter options include text search, god selection, map selection, and patch number.

![image](https://github.com/user-attachments/assets/eb286254-2d5e-41af-8224-bd19fbe39fb5)

Users can easily share links to uploaded games by clicking on the link button in the bottom right. Games files can also be downloaded, incrementing the total download count. The videos that are downloaded the most are featured on the home page for hightened discovery.

![image](https://github.com/user-attachments/assets/38bb36c5-d74e-4f23-8a94-e749b5994262)

When uploading a file, a sidebar form is displayed to the user. 

![image](https://github.com/user-attachments/assets/dfcbf069-e3b6-44e4-b387-c7ed76c27f46)

### Authentication 🔒
Users must be signed in via their Steam or Xbox account to upload games. Sign in options include Steam and Xbox via oauth. 

![image](https://github.com/user-attachments/assets/707cda57-34e0-4f70-8982-815b97a312ca)

### Statistics 📊
Various game statistics are available with filters by skill level and path number. Stats are updated once a day by the and stored to MongoDB (see [aom-lambda](https://github.com/erin-fitzpatric/aom-lambda/blob/main/extract-stats/civs_stats.py)).

![image](https://github.com/user-attachments/assets/c4471487-973c-446d-8cd2-6fe84c4f19f3)

### Resources 📖
The resources page provides additional information such as hotkey configurations and a taunt repository. This is the home for statically rendered data.
![image](https://github.com/user-attachments/assets/547f330c-d05d-4acc-905b-c696d0060b19)


## How to Run Locally 💻

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
MONGO_USER= ask in discord
MONGO_PASSWORD= ask in discord
MONGODB_URI="ask in discord"
MONGO_APPNAME= Dev
MONGO_HOST= " ask in discord"
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
