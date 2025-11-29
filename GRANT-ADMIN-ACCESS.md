# How to Grant Admin Access

## Quick Solution (Development Mode)

**Good news!** I've updated the code so that **in development mode, all authenticated users can access the admin panel**.

Just refresh your browser and you should have access to `/admin`!

## Permanent Solution (Add Your Email as Admin)

### Option 1: Using Environment Variable

1. **Add to `.env.local`** (create if doesn't exist):
   ```env
   NEXT_PUBLIC_ADMIN_EMAIL=your-email@gmail.com
   ```

2. **Restart your dev server**:
   ```bash
   pnpm dev
   ```

3. **Sign in again** - your user will get ADMIN role automatically

### Option 2: Hardcode Your Email

1. **Edit `lib/firebase.ts`** - Find this section (around line 80):
   ```typescript
   const adminEmails = [
     process.env.NEXT_PUBLIC_ADMIN_EMAIL || "",
     // Add your email here for admin access:
     // "your-email@gmail.com",
   ]
   ```

2. **Uncomment and add your email**:
   ```typescript
   const adminEmails = [
     process.env.NEXT_PUBLIC_ADMIN_EMAIL || "",
     "your-actual-email@gmail.com",  // <-- Add your email here
   ]
   ```

3. **Edit `app/admin/layout.tsx`** - Find this section (around line 27):
   ```typescript
   const adminEmails = [
     process.env.NEXT_PUBLIC_ADMIN_EMAIL || "",
     // Add your email here:
     // "your-email@gmail.com",
   ]
   ```

4. **Uncomment and add your email**:
   ```typescript
   const adminEmails = [
     process.env.NEXT_PUBLIC_ADMIN_EMAIL || "",
     "your-actual-email@gmail.com",  // <-- Add your email here
   ]
   ```

5. **Save files and refresh browser**

## How It Works

- When you sign in with Google, the system checks if your email is in the admin list
- If yes, you get `ADMIN` role added to your user
- The admin layout checks for `ADMIN` or `PROFESSOR` role OR your email in the admin list
- In development mode, all authenticated users can access admin (for testing)

## Check Your Current Access

1. **Open browser console** (F12)
2. **Check localStorage**:
   ```javascript
   JSON.parse(localStorage.getItem('user'))
   ```
3. **Look at `roles`** - should include `"ADMIN"` if you're an admin

## Update Existing User in Firestore

If you already signed in before adding admin access:

1. **Go to Firestore Console**:
   https://console.firebase.google.com/u/0/project/microservice-e-learning/firestore/databases/-default-/data

2. **Find your user** in `students` collection

3. **Edit the document**:
   - Click on your user document
   - Click "Edit document"
   - Find `roles` field
   - Change from `["ROLE_STUDENT"]` to `["ROLE_STUDENT", "ADMIN"]`
   - Click "Update"

4. **Refresh your browser** - you should now have admin access!

## Test Admin Access

1. Go to: http://localhost:3000/admin
2. You should see the admin dashboard instead of "Access Denied"
3. You can now manage courses, professors, categories, etc.

