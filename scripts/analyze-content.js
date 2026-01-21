import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const GITHUB_USERNAME = 'liohunter1';
const ARTICLES_REPO = 'MyArticles-Blogs';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// If no key is present, skip analysis but do NOT fail the build
if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not found; skipping content analysis. Build will continue.');
  process.exit(0);
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

/**
 * Fetch markdown files from GitHub repository
 */
async function fetchArticlesFromGitHub() {
  try {
    console.log('📚 Fetching articles from GitHub...');
    
    // Setup headers with authentication if token exists
    const headers = {};
    if (process.env.VITE_GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.VITE_GITHUB_TOKEN}`;
    }

    // Get repository contents from posts folder
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${ARTICLES_REPO}/contents/posts`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const files = await response.json();
    const markdownFiles = files.filter(file => 
      file.name.endsWith('.md') && file.type === 'file'
    );
    
    console.log(`✅ Found ${markdownFiles.length} markdown articles`);
    
    // Fetch content of each markdown file
    const articles = await Promise.all(
      markdownFiles.map(async (file) => {
        const contentResponse = await fetch(file.download_url);
        const content = await contentResponse.text();
        
        return {
          filename: file.name,
          title: file.name.replace('.md', '').replace(/-/g, ' '),
          content: content,
          url: file.html_url,
        };
      })
    );
    
    return articles;
  } catch (error) {
    console.error('❌ Error fetching articles:', error.message);
    return [];
  }
}

/**
 * Analyze article content with Gemini API
 */
async function analyzeArticleWithGemini(article) {
  try {
    const prompt = `Analyze this cybersecurity article and extract the following information in JSON format:

Article Title: ${article.title}

Content:
${article.content.substring(0, 4000)} // Limit content to avoid token limits

Please extract:
1. Main topics/categories (array of strings, max 3)
2. Technical skills mentioned (array of strings, max 5)
3. Tools and technologies discussed (array of strings, max 5)
4. Security concepts explained (array of strings, max 3)
5. A brief 1-sentence summary
6. Estimated difficulty level (Beginner/Intermediate/Advanced)
7. Estimated read time in minutes (based on word count)

Return ONLY a valid JSON object with this structure:
{
  "topics": ["topic1", "topic2"],
  "skills": ["skill1", "skill2"],
  "tools": ["tool1", "tool2"],
  "concepts": ["concept1", "concept2"],
  "summary": "Brief summary here",
  "difficulty": "Intermediate",
  "readTime": 8
}`;

    console.log(`  🤖 Analyzing: ${article.title}...`);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response (remove markdown code blocks if present)
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const analysis = JSON.parse(jsonText);
    
    console.log(`  ✅ Analyzed successfully`);
    
    return analysis;
  } catch (error) {
    console.error(`  ❌ Error analyzing ${article.title}:`, error.message);
    
    // Return default structure on error
    return {
      topics: ['Security'],
      skills: [],
      tools: [],
      concepts: [],
      summary: article.content.substring(0, 150) + '...',
      difficulty: 'Intermediate',
      readTime: Math.ceil(article.content.split(' ').length / 200),
    };
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting content analysis with Gemini AI...\n');
  
  // Fetch articles
  const articles = await fetchArticlesFromGitHub();
  
  if (articles.length === 0) {
    console.log('⚠️  No articles found. Using fallback data.');
    
    // Create fallback data structure
    const fallbackData = {
      articles: [],
      skills: new Set(),
      tools: new Set(),
      topics: new Set(),
      lastUpdated: new Date().toISOString(),
    };
    
    saveAnalysisResults(fallbackData);
    return;
  }
  
  // Analyze each article with Gemini
  console.log('\n🔍 Analyzing articles with Gemini AI...\n');
  
  const analyzedArticles = [];
  const allSkills = new Set();
  const allTools = new Set();
  const allTopics = new Set();
  
  for (const article of articles) {
    const analysis = await analyzeArticleWithGemini(article);
    
    // Combine article data with analysis
    const enrichedArticle = {
      id: article.filename.replace('.md', ''),
      title: article.title,
      excerpt: analysis.summary,
      topics: analysis.topics,
      skills: analysis.skills,
      tools: analysis.tools,
      concepts: analysis.concepts,
      difficulty: analysis.difficulty,
      readTime: `${analysis.readTime} min read`,
      url: article.url,
      category: analysis.topics[0] || 'Security',
      date: new Date().toISOString().split('T')[0], // You can extract from file metadata if available
    };
    
    analyzedArticles.push(enrichedArticle);
    
    // Collect all unique skills, tools, topics
    analysis.skills.forEach(skill => allSkills.add(skill));
    analysis.tools.forEach(tool => allTools.add(tool));
    analysis.topics.forEach(topic => allTopics.add(topic));
    
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Create final data structure
  const analysisResults = {
    articles: analyzedArticles,
    skills: Array.from(allSkills),
    tools: Array.from(allTools),
    topics: Array.from(allTopics),
    lastUpdated: new Date().toISOString(),
    totalArticles: analyzedArticles.length,
  };
  
  // Save results
  saveAnalysisResults(analysisResults);
  
  console.log('\n✨ Analysis complete!\n');
  console.log(`📊 Results:`);
  console.log(`   - Articles analyzed: ${analyzedArticles.length}`);
  console.log(`   - Unique skills found: ${allSkills.size}`);
  console.log(`   - Tools identified: ${allTools.size}`);
  console.log(`   - Topics covered: ${allTopics.size}`);
  console.log(`\n💾 Data saved to: src/data/analyzed-content.json\n`);
}

/**
 * Save analysis results to JSON file
 */
function saveAnalysisResults(data) {
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  const outputPath = path.join(dataDir, 'analyzed-content.json');
  
  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`\n💾 Analysis saved to: ${outputPath}`);
}

// Run the script
main().catch(console.error);
