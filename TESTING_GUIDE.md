# 🧪 Manual Testing Guide - Sweet Shop Management System

## Quick Start Testing

### 1. **Verify Servers Are Running**
- Backend: Open `http://localhost:3000` in browser - should see "Sweet Shop API is running!"
- Frontend: Open `http://localhost:5173` in browser - should see the login page

### 2. **Test Authentication**

#### Login as Admin
1. Go to `http://localhost:5173/login`
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
3. Click "Login" button
4. **Expected**: Redirect to Dashboard with admin features visible

#### Register New User
1. Click "Register" link on login page
2. Enter new username and password
3. Click "Register"
4. **Expected**: Success message, redirect to login

### 3. **Test Admin Dashboard Features**

#### Verify Stats Panel (Admin Only)
After logging in as admin, you should see three stat cards at the top:
- ✅ **Total Products**: Shows count of all sweets
- ✅ **Total Inventory Value**: Shows $ value (price × quantity)
- ✅ **Low Stock Alerts**: Shows count of items with quantity < 10

#### Test CRUD Operations

**Add Sweet:**
1. Click "+ Add Sweet" button
2. Fill in form:
   - Name: "Test Chocolate"
   - Category: "Chocolate"
   - Price: 5.99
   - Quantity: 50
3. Click "Save"
4. **Expected**: Green toast notification "Sweet added successfully"
5. **Expected**: "Test Chocolate" appears in product list

**Edit Sweet:**
1. Find "Test Chocolate" in the list
2. Click "Edit" button
3. Change price to 7.99
4. Click "Update"
5. **Expected**: Green toast "Sweet updated successfully"
6. **Expected**: Price shows as $7.99

**Search Sweet:**
1. Type "chocolate" in search box
2. Click "Search"
3. **Expected**: Only chocolate items shown
4. Click "Clear" to see all items again

**Purchase Sweet:**
1. Click "Purchase" on any item
2. **Expected**: Green toast "Purchase successful!"
3. **Expected**: Quantity decreases by 1

**Restock Sweet (Admin):**
1. Click "Restock" on any item
2. Enter quantity (e.g., 20)
3. Click OK
4. **Expected**: Green toast "Restock successful"
5. **Expected**: Quantity increases

**Delete Sweet (Admin):**
1. Click "Delete" on "Test Chocolate"
2. Confirm deletion
3. **Expected**: Green toast "Sweet deleted successfully"
4. **Expected**: Item removed from list

### 4. **Test Visual Features**

#### Toast Notifications
- Should appear in bottom-right corner
- Green border for success
- Red border for errors
- Auto-dismiss after 3 seconds
- Smooth slide-in animation

#### Stock Indicators
- **Green badge**: In stock (quantity ≥ 10)
- **Orange badge**: Low stock (quantity < 10)
- **Red badge**: Out of stock (quantity = 0)

#### Animations
- Cards fade in on page load
- Buttons glow on hover
- Modals slide in smoothly
- Stats cards lift on hover

### 5. **Test User vs Admin Differences**

**As Regular User:**
- ❌ No stats panel visible
- ❌ No "+ Add Sweet" button
- ❌ No Edit/Delete/Restock buttons
- ✅ Can browse and purchase only

**As Admin:**
- ✅ Stats panel visible
- ✅ All management buttons visible
- ✅ Full CRUD access

### 6. **Test Edge Cases**

**Out of Stock Purchase:**
1. Find item with 0 quantity
2. Try to click "Purchase"
3. **Expected**: Button is disabled (grayed out)

**Low Stock Warning:**
1. Reduce item quantity to below 10
2. **Expected**: Orange "Low Stock" badge
3. **Expected**: Card border turns orange
4. **Expected**: Low Stock Alerts count increases in stats

**Invalid Login:**
1. Enter wrong password
2. **Expected**: Red toast "Invalid credentials"

## ✅ Success Checklist

Mark each item as you test:

- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 5173
- [ ] Admin login works
- [ ] User registration works
- [ ] Stats panel shows for admin
- [ ] Add sweet works with toast
- [ ] Edit sweet works with toast
- [ ] Search functionality works
- [ ] Purchase decreases quantity
- [ ] Restock increases quantity
- [ ] Delete removes item
- [ ] Toast notifications appear
- [ ] Stock color indicators work
- [ ] Animations are smooth
- [ ] Mobile responsive (resize browser)

## 🐛 Common Issues & Fixes

**Login fails:**
- Run: `node backend/reset_admin.js` to reset admin password

**No stats showing:**
- Ensure logged in as `admin` (not regular user)

**Toast not appearing:**
- Check browser console for errors
- Ensure `Toast.tsx` component exists

**Backend not responding:**
- Check terminal for errors
- Restart: `npm run dev` in backend folder

---

**All features working?** ✨ Your project is ready for submission!
