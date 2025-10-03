# API Diagnostic Guide

## 🔍 Quick Checks

### 1. Test API Connection

Open your browser and go to:

```
http://localhost:5000/api/matches/test
```

You should see:

```json
{
  "success": true,
  "message": "API connection successful!",
  "competitionsCount": 20+
}
```

If you see an error, check your `FOOTBALL_API_KEY` in `backend/.env`.

### 2. Test Live Matches Endpoint

```
http://localhost:5000/api/matches/live
```

This should return today's matches. If empty, it means no matches today.

### 3. Test Fixtures Endpoint

```
http://localhost:5000/api/matches/fixtures/2021
```

This should return Premier League fixtures.

## 🐛 Common Issues

### Issue: "No matches found"

**Cause:** No matches scheduled for today

**Solution:** This is normal! Football matches aren't every day.

**Check fixtures instead:**

- Go to `/fixtures` page
- Select a league
- You'll see upcoming matches

### Issue: "API key not configured"

**Cause:** Missing or invalid API key

**Solution:**

1. Go to https://www.football-data.org/client/register
2. Sign up (free)
3. Get your API key
4. Add to `backend/.env`:
   ```env
   FOOTBALL_API_KEY=your_key_here
   ```
5. Restart backend

### Issue: "Rate limit exceeded"

**Cause:** Too many API requests (free tier: 10/minute)

**Solution:**

- Wait 1 minute
- The app uses caching to prevent this
- Check backend console for cache hits

## 📊 Understanding the Data

### Live Scores Page:

- Shows matches happening TODAY
- If no matches today, shows "No live matches"
- This is NORMAL on non-match days

### Fixtures Page:

- Shows UPCOMING matches (next 2 weeks)
- Always has data
- Use this to see future matches

### Home Page:

- Shows today's matches
- Falls back to mock data if API fails
- Should always show something

## ✅ Quick Fix for "No Matches"

If you're not seeing any matches:

1. **Check if there are matches today:**

   - Go to https://www.football-data.org
   - Check if there are matches scheduled

2. **Use Fixtures page instead:**

   - Go to `/fixtures`
   - Select Premier League or Champions League
   - You'll see upcoming matches

3. **Check backend console:**
   - Look for API errors
   - Check for "Cache hit" messages
   - Verify API key is working

## 🔧 Backend Console Messages

### Good signs:

```
✅ Fetching: https://api.football-data.org/v4/matches...
✅ Cache hit (DB): matches_2024-01-15
✅ Live scores fetched successfully
```

### Bad signs:

```
❌ SportsDB API error: Request failed with status code 403
❌ API key not configured
❌ Rate limit exceeded
```

## 💡 Pro Tips

1. **Fixtures page is more reliable** - Always has data
2. **Live scores only work on match days** - Normal to be empty
3. **API caches data** - Reduces API calls
4. **Free tier limits** - 10 requests/minute
5. **Check backend logs** - Shows what's happening

## 🎯 Expected Behavior

### On Match Days:

- Live Scores: Shows matches
- Home: Shows matches
- Fixtures: Shows upcoming

### On Non-Match Days:

- Live Scores: Empty (normal!)
- Home: Shows mock data or empty
- Fixtures: Shows upcoming (always works)

## 🚀 Quick Test

Run this in your browser console on any page:

```javascript
// Test API
fetch("http://localhost:5000/api/matches/test")
  .then((r) => r.json())
  .then((d) => console.log("API Test:", d));

// Test Live Matches
fetch("http://localhost:5000/api/matches/live")
  .then((r) => r.json())
  .then((d) => console.log("Live Matches:", d));

// Test Fixtures
fetch("http://localhost:5000/api/matches/fixtures/2021")
  .then((r) => r.json())
  .then((d) => console.log("Fixtures:", d));
```

Check the console for results!

---

**Most likely:** There are simply no matches today. Use the Fixtures page to see upcoming matches! 📅
