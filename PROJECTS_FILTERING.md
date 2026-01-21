# 🎯 Projects Filtering Guide

## Problem Solved

Now your portfolio will **only show specific projects** instead of all public repos. You have **3 ways** to control which repos appear:

---

## Method 1: Topic-Based Filtering (⭐ Recommended)

This is the **cleanest** approach. Add a specific topic to repos you want to showcase.

### How to Use:

1. Go to your GitHub repo
2. Click **Settings** → **Topics**
3. Add a topic like: `portfolio` or `showcase`
4. Repeat for other portfolio projects

### In Code:

In `src/components/Projects.tsx`, find line ~30:

```typescript
// 🎯 PORTFOLIO FILTER: Only show repos with these topics
const PORTFOLIO_TOPICS: string[] = ['portfolio', 'showcase'];
```

**Result:** Only repos tagged with `portfolio` or `showcase` will appear!

**To show ALL repos:** Leave empty:
```typescript
const PORTFOLIO_TOPICS: string[] = [];
```

---

## Method 2: Repo Whitelist (For Specific Repos)

If you want **only specific repo names** to show up, use the whitelist.

### In Code:

In `src/components/Projects.tsx`, find line ~37:

```typescript
// Alternative: Repo name whitelist
const REPO_WHITELIST: string[] = ['MyArticles-Blogs', 'security-scanner', 'pen-test-framework'];
```

**Result:** Only repos named in this list will appear!

**To disable:** Leave empty:
```typescript
const REPO_WHITELIST: string[] = [];
```

---

## Method 3: Combine Both (Most Flexible)

Use **both** filters together:

```typescript
// Show repos that have BOTH:
// 1. One of these topics AND
// 2. One of these exact names

const PORTFOLIO_TOPICS: string[] = ['portfolio'];
const REPO_WHITELIST: string[] = ['MyArticles-Blogs', 'security-scanner'];
```

**Result:** Only repos with "portfolio" topic AND matching the names!

---

## How It Works (Technical)

```
GitHub Fetches → Remove Forked → Remove 'config' → Apply Topics Filter → Apply Name Filter → Display
     100 repos                                       (if specified)        (if specified)
```

---

## New Features

### ✨ Topic Filter Buttons
Your Projects section now shows:
- `All Projects (5)` - Shows all filtered projects
- `security (3)` - Shows only security-related projects
- `web (2)` - Shows only web projects
- etc.

### ✨ Smart Counting
- Each filter button shows how many projects match
- "All Projects" shows total filtered count

---

## Examples

### Example 1: Show Only Portfolio Projects

**Your GitHub repos:**
- MyArticles-Blogs (topic: portfolio)
- security-scanner (topic: portfolio)
- experimental-tool (no topic)
- fork-of-something (forked)

**Config:**
```typescript
const PORTFOLIO_TOPICS: string[] = ['portfolio'];
const REPO_WHITELIST: string[] = [];
```

**Result:** Shows 2 projects ✅

---

### Example 2: Show Specific Repos Only

**Config:**
```typescript
const PORTFOLIO_TOPICS: string[] = [];
const REPO_WHITELIST: string[] = ['MyArticles-Blogs', 'security-scanner'];
```

**Result:** Shows these 2 repos regardless of topic ✅

---

### Example 3: Show All Repos (Current)

**Config:**
```typescript
const PORTFOLIO_TOPICS: string[] = [];
const REPO_WHITELIST: string[] = [];
```

**Result:** Shows all non-forked, non-config repos ✅

---

## Step-by-Step Setup

### Option A: Using GitHub Topics (Easiest)

1. **Go to each portfolio repo on GitHub**
   - Click Settings
   - Scroll to "Topics"
   - Add: `portfolio`
   - Save

2. **Update code:**
   ```typescript
   // In src/components/Projects.tsx (line ~30)
   const PORTFOLIO_TOPICS: string[] = ['portfolio'];
   ```

3. **Done!** Only repos with "portfolio" topic appear

---

### Option B: Using Repo Names

1. **Find your portfolio repo names:**
   - MyArticles-Blogs
   - security-scanner
   - etc.

2. **Update code:**
   ```typescript
   // In src/components/Projects.tsx (line ~37)
   const REPO_WHITELIST: string[] = ['MyArticles-Blogs', 'security-scanner'];
   ```

3. **Done!** Only these specific repos appear

---

## Testing

After updating the config:

1. Go to http://localhost:5173/
2. Scroll to Projects section
3. Check filter buttons appear
4. Click different topics
5. Projects should filter correctly

---

## Benefits

✅ **Control** - Decide exactly which projects show  
✅ **Dynamic** - Auto-discovers all topics from selected repos  
✅ **Flexible** - Use topics, names, or both  
✅ **Clean** - No hardcoding descriptions/images  
✅ **Scalable** - Works with any number of projects  

---

## Troubleshooting

### "No projects appear"
- Check PORTFOLIO_TOPICS matches actual GitHub topics
- Check REPO_WHITELIST has correct repo names
- Make sure repos are **not forked**
- Remove "config" from repo names

### "Too many projects showing"
- Add more specific topics: `['portfolio', 'showcase']`
- Or use whitelist with exact names

### "I want to see all repos"
- Leave both arrays empty: `[]`

---

**That's it!** Your Projects section now intelligently filters which repos appear. 🚀
