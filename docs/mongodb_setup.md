# MongoDB Setup Guide

## Prerequisites

1. **System Requirements**
   - Windows 10 or later
   - At least 4GB RAM
   - 5GB+ free disk space

## Installation Steps

### 1. Download MongoDB Community Server
1. Visit https://www.mongodb.com/try/download/community
2. Select the following options:
   - Version: Latest version (6.0+)
   - Platform: Windows
   - Package: MSI
3. Click Download

### 2. Install MongoDB
1. Run the downloaded MSI installer
2. Accept the license agreement
3. Choose "Complete" installation type
4. Select "Install MongoDB as a Service"
5. Install MongoDB Compass (GUI tool) when prompted
6. Complete the installation

### 3. Verify Installation
1. Open Command Prompt as Administrator
2. Verify MongoDB service is running:
   ```bash
   sc query MongoDB
   ```
3. If not running, start the service:
   ```bash
   net start MongoDB
   ```

### 4. Create Project Database

#### Using MongoDB Compass:
1. Open MongoDB Compass
2. Click "New Connection"
3. Use connection string: `mongodb://localhost:27017`
4. Click "Connect"
5. Click "Create Database"
6. Enter database name: `escrow-p2p`
7. Create initial collection: `users`

#### Using MongoDB Shell:
1. Open Command Prompt
2. Start MongoDB shell:
   ```bash
   mongosh
   ```
3. Create and use database:
   ```javascript
   use escrow-p2p
   ```
4. Create initial collections:
   ```javascript
   db.createCollection('users')
   db.createCollection('orders')
   ```

### 5. Configure Security

1. Create Admin User:
   ```javascript
   use admin
   db.createUser(
     {
       user: "adminUser",
       pwd: "your_secure_password",
       roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
     }
   )
   ```

2. Create Application User:
   ```javascript
   use escrow-p2p
   db.createUser(
     {
       user: "escrowApp",
       pwd: "your_app_password",
       roles: [ { role: "readWrite", db: "escrow-p2p" } ]
     }
   )
   ```

### 6. Update Environment Variables

1. Navigate to your project's backend directory
2. Open `.env` file
3. Update MongoDB connection string:
   ```
   MONGO_URI=mongodb://escrowApp:your_app_password@localhost:27017/escrow-p2p
   ```

## Verification

1. Start your backend application
2. Check console for successful MongoDB connection message
3. Try registering a test user through the API
4. Verify user appears in MongoDB Compass

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Verify MongoDB service is running
   - Check if port 27017 is not blocked by firewall

2. **Authentication Failed**
   - Double-check username and password in connection string
   - Verify user has correct database permissions

3. **Port Already in Use**
   - Check if another MongoDB instance is running
   - Verify no other service is using port 27017

### Getting Help

- Official MongoDB Documentation: https://docs.mongodb.com/manual/
- MongoDB Community Forums: https://www.mongodb.com/community/forums/
- Stack Overflow: https://stackoverflow.com/questions/tagged/mongodb