# Firebase Realtime Database Security Rules Setup

## Current Issue
The application is encountering "Permission denied" errors because the Firebase Realtime Database security rules are not configured to allow authenticated users to access their workout data.

## Required Firebase Security Rules

To fix this issue, you need to update your Firebase Realtime Database security rules in the Firebase Console:

1. Go to your Firebase project console
2. Navigate to "Realtime Database" section
3. Click on the "Rules" tab
4. Replace the existing rules with the following:

```json
{
  "rules": {
    "workouts": {
      "plans": {
        "$uid": {
          ".read": "auth != null && auth.uid == $uid",
          ".write": "auth != null && auth.uid == $uid"
        }
      },
      "sessions": {
        "$uid": {
          ".read": "auth != null && auth.uid == $uid",
          ".write": "auth != null && auth.uid == $uid"
        }
      },
      "achievements": {
        "$uid": {
          ".read": "auth != null && auth.uid == $uid",
          ".write": "auth != null && auth.uid == $uid"
        }
      }
    }
  }
}
```

## What These Rules Do

- **Authentication Required**: `auth != null` ensures only authenticated users can access data
- **User Isolation**: `auth.uid == $uid` ensures users can only access their own data
- **Path Structure**: Data is organized under `/workouts/{plans|sessions|achievements}/{userId}/`

## Data Structure
With these rules, your data will be stored as:
```
/workouts/
  /plans/
    /{userId}/
      /{planId}/
        - name, exercises, etc.
  /sessions/
    /{userId}/
      /{sessionId}/
        - planId, exercises, duration, etc.
  /achievements/
    /{userId}/
      /{achievementId}/
        - type, unlockedAt, etc.
```

## Testing the Rules
After updating the rules:
1. Click "Publish" in the Firebase Console
2. Refresh your application
3. The permission errors should be resolved

## Security Benefits
- Users can only access their own workout data
- Prevents unauthorized access to other users' information
- Maintains data privacy and security