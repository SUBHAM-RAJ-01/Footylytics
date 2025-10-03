# Squad Section Troubleshooting

## Can't See Squad Section?

### Quick Checks:

1. **Open Browser Console** (F12)

   - Look for "Team Info:" and "Squad:" logs
   - Check if squad data is being returned

2. **Check Team Selection**

   - Make sure you've selected a team
   - Try selecting a different team (e.g., Arsenal, Man City)

3. **Check API Response**
   - Open Network tab in browser (F12)
   - Look for `/api/teams/{teamId}` request
   - Check if response includes `squad` array

### Common Issues:

#### Issue 1: Squad Data Not Available

**Symptom**: See message "Squad information not available"

**Cause**: Some teams don't have squad data in the API

**Solution**: Try these teams (known to have squad data):

- Arsenal FC (ID: 57)
- Manchester City FC (ID: 65)
- Liverpool FC (ID: 64)
- Chelsea FC (ID: 61)
- Real Madrid CF (ID: 86)
- FC Barcelona (ID: 81)

#### Issue 2: Flags Not Showing

**Symptom**: Player cards show but no flags

**Cause**:

- Package not installed
- Country not in mapping

**Solution**:

```bash
cd frontend
npm install country-flag-icons
```

Then restart dev server:

```bash
npm run dev
```

#### Issue 3: Jersey Numbers Not Showing

**Symptom**: Flags show but no numbers

**Cause**: API doesn't provide shirt numbers for some players

**Solution**: This is normal - not all players have assigned numbers

### Debug Steps:

1. **Check Console Logs**

```javascript
// Should see in console:
Team Info: { name: "Arsenal FC", squad: [...], ... }
Squad: [{ name: "Player Name", shirtNumber: 7, ... }]
```

2. **Verify API Call**

```
GET http://localhost:5000/api/teams/57
Response should include:
{
  "name": "Arsenal FC",
  "squad": [
    {
      "id": 123,
      "name": "Player Name",
      "position": "Midfield",
      "dateOfBirth": "2000-01-01",
      "nationality": "England",
      "shirtNumber": 7
    }
  ]
}
```

3. **Check Backend**

```bash
cd backend
npm run dev
```

Make sure backend is running on port 5000

### Still Not Working?

1. **Clear Cache**

   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Clear browser cache
   - Restart dev server

2. **Check Environment Variables**

```env
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

3. **Verify Football-Data API Key**

```env
# backend/.env
FOOTBALL_API_KEY=your_actual_api_key
```

4. **Test API Directly**

```bash
# Test if backend can fetch team data
curl http://localhost:5000/api/teams/57
```

### Expected Behavior:

When working correctly, you should see:

- ✅ Squad section appears below "Upcoming Fixtures"
- ✅ Position filter buttons (All, GK, Def, Mid, Att)
- ✅ Player cards with:
  - Avatar with initials
  - Player name
  - Position badge (color-coded)
  - Nationality text
  - Age
  - Country flag (top right)
  - Jersey number (below flag)

### Quick Test:

1. Go to My Team page
2. Select "Arsenal FC"
3. Wait for data to load
4. Scroll down past "Upcoming Fixtures"
5. Should see "Squad" section with ~25 players

If you see "Squad information not available", try a different team!

### Need More Help?

Check browser console for errors:

- Red errors = something broke
- Yellow warnings = might be okay
- Blue logs = debug info

Look for:

- Network errors (API not responding)
- CORS errors (backend not configured)
- 404 errors (wrong API endpoint)
- 500 errors (backend crashed)
