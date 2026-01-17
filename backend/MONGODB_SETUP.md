# 🍃 MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with your email or Google account
3. Complete the registration process

## Step 2: Create a New Cluster

1. After logging in, click **"Build a Database"**
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to you
5. Name your cluster (e.g., "SkillSphere")
6. Click **"Create Cluster"** (takes 3-5 minutes)

## Step 3: Create Database User

1. Click **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username (e.g., `skillsphere_admin`)
5. Set a strong password (save it!)
6. Set privileges to **"Read and write to any database"**
7. Click **"Add User"**

## Step 4: Whitelist Your IP Address

1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Option A: Click **"Allow Access from Anywhere"** (0.0.0.0/0) - for development
4. Option B: Click **"Add Current IP Address"** - for production
5. Click **"Confirm"**

## Step 5: Get Your Connection String

1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **Driver: Node.js** and **Version: 5.5 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your .env File

1. Open `backend/.env`
2. Replace the connection string:
   ```env
   MONGODB_URI=mongodb+srv://skillsphere_admin:YOUR_PASSWORD@cluster.mongodb.net/skillsphere?retryWrites=true&w=majority
   ```
3. Replace:
   - `skillsphere_admin` with your username
   - `YOUR_PASSWORD` with your actual password
   - `skillsphere` is your database name

## Step 7: Test Connection

Run the backend server:
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
🚀 Server running on port 5000
```

## Troubleshooting

### Error: "Authentication failed"
- Check your username and password in the connection string
- Make sure you created a database user (not your Atlas account)

### Error: "Connection timeout"
- Check Network Access settings
- Make sure your IP is whitelisted
- Try "Allow Access from Anywhere" for development

### Error: "Cannot connect to cluster"
- Wait 3-5 minutes after cluster creation
- Check if cluster is active in Atlas dashboard

## Database Structure

Your databases will be automatically created when you insert data:

- **Database**: `skillsphere`
  - Collection: `users`
  - Collection: `studentprofiles`
  - Collection: `activitylogs`
  - Collection: `skillframeworks` (to be added)
  - Collection: `recommendations` (to be added)

## Viewing Your Data

1. Go to MongoDB Atlas Dashboard
2. Click **"Browse Collections"**
3. You'll see all your data here after registration/login

---

**Need Help?** Check [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
