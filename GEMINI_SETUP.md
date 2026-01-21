# 🤖 Gemini AI Integration Setup Guide

## Step 1: Get Your Gemini API Key (FREE)

### Visit Google AI Studio:
1. Go to: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click the blue **"Create API Key"** button
4. Select **"Create API key in new project"** (or use existing project)
5. Copy the API key that appears (starts with `AIza...`)

**Important:** Keep this key secure! Don't commit it to GitHub.

---

## Step 2: Add API Key to Your Project

1. In your project root (`c:\Users\le\Downloads\port\`), create a file named `.env`
   
2. Add this line to the `.env` file:
   ```
   GEMINI_API_KEY=AIzaSy...your_actual_key_here
   ```

3. Save the file

**Note:** The `.env` file is already in `.gitignore`, so it won't be committed to GitHub.

---

## Step 3: Run AI Analysis

### Analyze your articles:
```bash
npm run analyze
```

This will:
- Fetch all markdown files from your GitHub repo
- Send each article to Gemini AI for analysis
- Extract skills, tools, topics, difficulty level
- Generate a summary for each article
- Save results to `src/data/analyzed-content.json`

**Expected output:**
```
🚀 Starting content analysis with Gemini AI...

📚 Fetching articles from GitHub...
✅ Found 5 markdown articles

🔍 Analyzing articles with Gemini AI...

  🤖 Analyzing: SQL Injection Basics...
  ✅ Analyzed successfully
  
  🤖 Analyzing: Web Security Guide...
  ✅ Analyzed successfully

✨ Analysis complete!

📊 Results:
   - Articles analyzed: 5
   - Unique skills found: 23
   - Tools identified: 12
   - Topics covered: 8

💾 Data saved to: src/data/analyzed-content.json
```

---

## Step 4: Build Your Portfolio

### Regular build (without AI analysis):
```bash
npm run build
```

This runs AI analysis automatically before building.

### Development mode (uses cached analysis):
```bash
npm run dev
```

---

## How It Works

### 1. **Build Time Analysis** (Recommended)
- Run `npm run analyze` whenever you add new articles
- AI extracts metadata once
- Results are cached in `analyzed-content.json`
- **Cost:** FREE (within Gemini's 60 requests/min limit)

### 2. **Manual Analysis**
- Run the script when you update articles
- Only analyze new/changed content
- Keep the JSON file in version control

---

## What Gemini AI Extracts

For each article, the AI analyzes and extracts:

✅ **Topics** - Main categories (e.g., "Web Security", "Penetration Testing")  
✅ **Skills** - Technical skills mentioned (e.g., "Python", "SQL", "Burp Suite")  
✅ **Tools** - Specific tools discussed (e.g., "Metasploit", "Wireshark")  
✅ **Concepts** - Security concepts (e.g., "XSS", "Authentication", "Encryption")  
✅ **Summary** - One-sentence description  
✅ **Difficulty** - Beginner/Intermediate/Advanced  
✅ **Read Time** - Estimated minutes based on word count  

---

## Portfolio Features

Once analysis completes, your portfolio will show:

📚 **Enhanced Blog Section** with:
- AI-generated summaries
- Skill tags automatically extracted
- Difficulty levels
- Category filters
- "Skills Covered" overview panel
- Click to read full articles in a modal

🎯 **Dynamic Skills Section** showing:
- All unique skills from your articles
- Automatically updated when you add content

---

## Troubleshooting

### "GEMINI_API_KEY not found"
✅ Make sure you created the `.env` file in the project root  
✅ Check that the key starts with `AIza`  
✅ No quotes needed around the key

### "Failed to fetch articles"
✅ Check your GitHub username in `scripts/analyze-content.js` (line 10)  
✅ Make sure your repo is public  
✅ Verify the repo name is correct

### "Rate limit exceeded"
✅ Free tier: 60 requests/minute  
✅ Add delays between analyses (already built in)  
✅ Wait a minute and try again

---

## Cost Breakdown

### Gemini AI (Recommended):
- **Free Tier:** 60 requests/minute, 1,500/day
- **Your Use Case:** ~5-10 articles = 5-10 API calls
- **Monthly Cost:** $0 (well within free tier)

### When to Re-analyze:
- When you publish new articles
- When you update existing articles
- Before deploying to production

**Typical workflow:**
1. Write article in GitHub repo
2. Run `npm run analyze`
3. Review extracted skills/topics
4. Deploy portfolio

---

## Next Steps

1. ✅ Get your Gemini API key
2. ✅ Create `.env` file
3. ✅ Run `npm run analyze`
4. ✅ Check the generated `src/data/analyzed-content.json`
5. ✅ Test locally with `npm run dev`
6. ✅ Deploy!

---

**Need help?** Check the console output for detailed error messages.

**API Key issues?** Visit: https://aistudio.google.com/app/apikey
