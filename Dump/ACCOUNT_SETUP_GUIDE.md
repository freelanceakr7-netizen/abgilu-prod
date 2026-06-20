# Firebase Account Setup Guide

## Overview
This guide will help you set up admin and test accounts in your Firebase project.

## Prerequisites
- Access to Firebase Console: https://console.firebase.google.com/project/haathsaga/overview
- Admin privileges for the Firebase project

## Account Credentials

### Admin Account
- **Email:** admin@haathsaga.com
- **Password:** admin123456
- **Display Name:** Admin User
- **Role:** Admin

### Test Account
- **Email:** test@haathsaga.com
- **Password:** test123456
- **Display Name:** Test User
- **Role:** User

## Step-by-Step Setup Instructions

### 1. Create Users in Firebase Authentication

1. Go to Firebase Console: https://console.firebase.google.com/project/haathsaga/authentication/users
2. Click on "Add user" button
3. For Admin Account:
   - Email: admin@haathsaga.com
   - Password: admin123456
   - Display name: Admin User
   - Check "Email verified" box
   - Click "Add user"
4. Repeat for Test Account:
   - Email: test@haathsaga.com
   - Password: test123456
   - Display name: Test User
   - Check "Email verified" box
   - Click "Add user"

### 2. Create User Documents in Firestore

After creating users in Authentication, you need to create their documents in Firestore:

1. Go to Firestore Database: https://console.firebase.google.com/project/haathsaga/firestore/data
2. Click on "Start collection" (if not already created) or navigate to existing "users" collection
3. Create a document for Admin User:
   - Collection: `users`
   - Document ID: (Copy the UID from Authentication tab for admin@haathsaga.com)
   - Fields:
     ```
     uid: (paste the UID)
     email: "admin@haathsaga.com"
     displayName: "Admin User"
     isAdmin: true
     isActive: true
     memberSince: "January 2026"
     createdAt: (current timestamp)
     updatedAt: (current timestamp)
     ```
4. Create a document for Test User:
   - Collection: `users`
   - Document ID: (Copy the UID from Authentication tab for test@haathsaga.com)
   - Fields:
     ```
     uid: (paste the UID)
     email: "test@haathsaga.com"
     displayName: "Test User"
     isAdmin: false
     isActive: true
     memberSince: "January 2026"
     createdAt: (current timestamp)
     updatedAt: (current timestamp)
     ```

### 3. Verify Setup

1. Test Admin Account:
   - Go to your application login page
   - Login with admin@haathsaga.com / admin123456
   - Verify you can access the Admin Dashboard
   - Verify admin features are available

2. Test User Account:
   - Logout from admin account
   - Login with test@haathsaga.com / test123456
   - Verify you can access user features (browsing, cart, checkout)
   - Verify admin features are NOT accessible

## Alternative: Using Firebase CLI (Requires Service Account Key)

If you have a service account key, you can use the setup-accounts.js script:

1. Download service account key from Firebase Console:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save as `service-account-key.json` in project root

2. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="service-account-key.json"
   ```

3. Run the setup script:
   ```bash
   node setup-accounts.js
   ```

## Troubleshooting

### Issue: User already exists in Authentication
- This is normal if you're re-running setup
- The script will update the Firestore document instead

### Issue: Cannot access Admin Dashboard
- Verify the `isAdmin` field is set to `true` in Firestore
- Check that the user UID in Firestore matches the Authentication UID
- Clear browser cache and try logging in again

### Issue: User Search Index not updating
- The Cloud Functions should automatically update the search index
- Check Cloud Functions logs for any errors
- Manually trigger the rebuild function if needed

## Security Notes

- Change default passwords before production deployment
- Enable email verification for new user registrations
- Consider implementing password strength requirements
- Regularly review user access and permissions

## Next Steps

After setting up accounts:
1. Test all admin features (product management, order management, etc.)
2. Test user features (browsing, cart, checkout)
3. Verify Cloud Functions are working correctly
4. Test Storage access for product images
5. Review and adjust Firestore security rules if needed
