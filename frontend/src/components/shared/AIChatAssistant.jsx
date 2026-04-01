import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, BookOpen, Briefcase, FileText, GraduationCap, CheckCircle, LayoutGrid, Zap, Sparkles, TrendingUp, Award, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API } from '@/config/api';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#121218",
  surface: "#1A1A24",
  surfaceLight: "#252532",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDark: "#B8923F",
  ivory: "#F5F0E6",
  ivoryMuted: "#A8A099",
  goldBorder: "rgba(212,168,83,0.15)",
  goldDim: "rgba(212,168,83,0.08)",
};

// Comprehensive AI Knowledge Base
const AI_KNOWLEDGE = {
  welcome: {
    message: `Welcome to GrowX AI Assistant! I'm here to help you navigate our platform and advance your career.

WHAT I CAN HELP WITH:

🔐 LOGGED-IN USERS:
📚 Learning - Course recommendations & strategies
🧠 Quizzes - Test-taking & certification prep
📋 Kanban - Project management tips
💼 Internships - Application & career guidance
🎯 Jobs - Search strategies & negotiation
📄 Resume - Professional writing & templates
✓ ATS Checker - Resume optimization

🔓 AVAILABLE TO ALL:
📞 Contact Us - Get support
💰 Pricing - View our plans

How can I help you today?`,
    suggestions: ['How do I use this platform?', 'Getting started guide', 'What features are available?']
  },

  learning: {
    basics: {
      title: '📚 Learning Platform - Basics',
      content: `Welcome to GrowX Learning!

GETTING STARTED:
1. Visit /learning to access courses
2. Browse categories: Development, Design, Business, Data Science
3. Click on any course to view details
4. Enroll with one click
5. Start learning immediately

FEATURES AVAILABLE:
• Video lessons with captions
• Interactive quizzes after each module
• Downloadable resources & code
• Progress tracking dashboard
• Certificates of completion
• Discussion forums per course
• Mobile-friendly design

LEARNING PATHS:
→ Beginner: Start here if new to the topic
→ Intermediate: For those with some experience
→ Advanced: Deep dives for experts
→ Project-Based: Build real-world applications

TIPS FOR SUCCESS:
✓ Set daily learning goals (30-60 min recommended)
✓ Take notes while watching
✓ Practice coding alongside tutorials
✓ Complete all quizzes before moving on
✓ Review previous lessons before new ones
✓ Join community discussions`
    },
    advanced: {
      title: '📚 Learning Platform - Advanced',
      content: `Master the Learning Platform:

SPACED REPETITION SYSTEM:
Review material at optimal intervals for 80% better retention.
Our system automatically schedules reviews based on your performance.

SKILL TRACKS (6-Month Career Paths):

FRONTEND DEVELOPER:
Month 1-2: HTML, CSS, JavaScript Basics
Month 3: React.js Fundamentals
Month 4: Advanced React + State Management
Month 5: TypeScript + Testing
Month 6: Deployment + Portfolio

BACKEND DEVELOPER:
Month 1-2: Node.js, Express, Databases
Month 3: Authentication, Security
Month 4: REST APIs, GraphQL
Month 5: Cloud Services, Docker
Month 6: Scaling, Portfolio Projects

DATA SCIENCE:
Month 1-2: Python, Statistics
Month 3: Machine Learning Basics
Month 4: Deep Learning
Month 5: NLP & Computer Vision
Month 6: Real-world Projects

PRO FEATURES:
• 1-on-1 mentor matching
• Live coding sessions weekly
• Industry project submissions
• LinkedIn skill endorsements
• Job interview guarantees*`
    },
    tips: {
      title: '💡 Learning Success Strategies',
      content: `MAXIMIZE YOUR LEARNING:

1. ACTIVE RECALL
Don't just re-read. Close the material and write down everything you remember. This strengthens memory pathways.

2. ELABORATION
Explain concepts in your own words as if teaching someone else. Gaps in your explanation reveal knowledge gaps.

3. INTERLEAVING
Mix different topics during study sessions. Study math, then coding, then design. This improves discrimination.

4. PRACTICE TESTING
Take practice quizzes even when you think you know the material. Testing is training for the real thing.

5. DAILY HABITS:
• Morning: Review previous day's learning
• Mid-day: New lesson with active notes
• Evening: Practice problems + quiz

6. ENVIRONMENT OPTIMIZATION:
• Dedicated study space
• Phone on silent/airplane mode
• Pomodoro technique: 25 min study, 5 min break
• Background lo-fi music (optional)

7. TRACK & REFLECT:
• Weekly progress reviews
• Identify weak areas
• Adjust pace accordingly

Remember: "It's not about how much you know, it's about how well you can apply what you know."`
    }
  },

  quiz: {
    basics: {
      title: '🧠 Quiz Platform - Basics',
      content: `QUIZ PLATFORM OVERVIEW:

HOW QUIZZES WORK:
1. Browse quiz categories at /quiz
2. Select difficulty level
3. Answer timed questions
4. Get instant results
5. Review explanations
6. Track progress over time

QUESTION TYPES:
• Multiple Choice (single answer)
• Multiple Select (multiple answers)
• True/False
• Fill in the blank
• Code completion (for coding quizzes)

DIFFICULTY LEVELS:
🟢 Beginner: 10 questions, no time limit
🟡 Intermediate: 15 questions, 1 min/question
🔴 Advanced: 20 questions, 45 sec/question
⚫ Expert: 25 questions, 30 sec/question

FEATURES:
✓ Detailed explanations for each answer
✓ Progress bar during quiz
✓ Flag questions for review
✓ Skip and return to questions
✓ Leaderboard rankings
✓ Performance analytics

SCORING:
• Correct answer: +10 points
• Time bonus: +1-5 points (faster = more)
• Streak bonus: +2 points per consecutive correct
• Perfect score bonus: +20 points`
    },
    advanced: {
      title: '🧠 Quiz Analytics & Mastery',
      content: `BECOME A QUIZ MASTER:

PERFORMANCE ANALYTICS:
Your dashboard shows:
• Overall accuracy percentage
• Performance by category
• Time management stats
• Improvement trends
• Strengths & weaknesses
• vs. peer comparison

WEAK AREA IDENTIFICATION:
AI analyzes your incorrect answers to:
• Identify topic gaps
• Recommend specific lessons
• Generate targeted practice
• Track improvement over time

SPACED REPETITION QUIZZING:
• Incorrect questions reappear at intervals
• Frequency increases if answered wrong again
• Questions you master are shown less often
• Review sessions available anytime

CUSTOM QUIZ CREATION:
Build your own quizzes for:
• Interview preparation
• Certification exams
• Team training
• Self-assessment
• Teaching others

CERTIFICATION PATHS:
We offer certifications in:
🏆 HTML/CSS Developer
🏆 JavaScript Specialist
🏆 React Developer
🏆 Node.js Backend
🏆 Python Data Analyst
🏆 SQL Expert

Each cert requires:
1. Course completion (80%+)
2. Practice quiz (70%+)
3. Final exam (80%+)
4. Capstone project

Badges display on your profile!`
    },
    tips: {
      title: '🎯 Quiz-Taking Strategies',
      content: `ACE YOUR QUIZZES:

BEFORE THE QUIZ:
✅ Study the material thoroughly
✅ Review previous mistakes
✅ Get adequate sleep
✅ Stay hydrated
✅ Avoid cramming

DURING THE QUIZ:

READING QUESTIONS:
• Read twice before answering
• Identify what's being asked
• Look for key words: NOT, EXCEPT, ALWAYS
• Eliminate clearly wrong answers first

TIME MANAGEMENT:
• Don't spend too long on one question
• Use all time available
• For hard questions, make educated guess
• Flag and return if time permits

STRATEGIES FOR DIFFERENT TYPES:

Multiple Choice:
1. Cover answers, recall your answer
2. Read all options before deciding
3. When in doubt, go with your first instinct

True/False:
• Look for absolute words: ALWAYS, NEVER
• Questions with "all" or "none" are usually false
• If any part is false, the whole is false

Multiple Select:
• Each option is independent
• Partial credit may be given
• Don't overthink combinations

AFTER THE QUIZ:
• Review all explanations, even correct ones
• Understand WHY wrong answers are wrong
• Note recurring mistake patterns
• Schedule review sessions`
    }
  },

  resume: {
    basics: {
      title: '📄 Resume Builder - Basics',
      content: `CREATE YOUR PROFESSIONAL RESUME:

GETTING STARTED:
1. Go to /resume
2. Choose from 5+ templates
3. Fill in your information
4. Customize sections
5. Preview in real-time
6. Download as PDF/DOCX

ESSENTIAL SECTIONS:

CONTACT INFO:
• Full name (large, bold)
• Phone number
• Email address
• Location (City, State)
• LinkedIn URL
• Portfolio/Website (optional)

PROFESSIONAL SUMMARY (3-4 sentences):
• Years of experience
• Key skills/expertise
• Notable achievements
• Career objective

WORK EXPERIENCE:
• Company name, location
• Job title
• Dates (Month/Year)
• Bullet points (3-5 per job)
• Use action verbs + metrics

EDUCATION:
• Degree, major
• Institution name
• Graduation date
• GPA (if 3.5+, mention it)
• Relevant coursework

SKILLS:
• Technical skills (languages, tools)
• Soft skills (leadership, communication)
• Languages spoken

RESUME LENGTH:
• Entry-level: 1 page
• Mid-level: 1-2 pages
• Senior: 2 pages max`
    },
    advanced: {
      title: '📄 ATS-Optimized Resume Writing',
      content: `PASS ATS SYSTEMS & IMPRESS RECRUITERS:

WHAT IS ATS?
Applicant Tracking Systems filter 75% of resumes before human review. Your resume must be ATS-friendly.

ATS-OPTIMIZED FORMATTING:
✅ Use standard section headers
✅ Choose simple fonts (Arial, Calibri, Times)
✅ Avoid tables, columns, graphics
✅ Don't use headers/footers
✅ Save as .docx or .pdf (check job posting)
✅ Use standard bullet points (•, -, *)
✅ Include keywords naturally

KEYWORD STRATEGY:
1. Analyze job description
2. Identify required skills (hard skills)
3. Note soft skills mentioned
4. Include industry terms
5. Use both abbreviated & full forms:
   • SEO (Search Engine Optimization)
   • B2B (Business to Business)
   • API (Application Programming Interface)

QUANTIFY YOUR ACHIEVEMENTS:

❌ "Improved sales"
✅ "Increased quarterly sales by 35% ($120K growth)"

❌ "Managed team"
✅ "Led cross-functional team of 8, delivering 3 major projects on time"

❌ "Responsible for customer service"
✅ "Maintained 98% customer satisfaction rating, handling 50+ daily inquiries"

STAR METHOD FOR BULLETS:
Situation: Set the scene
Task: Your responsibility
Action: What you specifically did
Result: Quantifiable outcome

RESUME TYPES:
1. Chronological: Work history (career gaps ok)
2. Functional: Skills focus (career changers)
3. Combination: Best of both (recommended)`
    },
    templates: {
      title: '🎨 Resume Templates Guide',
      content: `CHOOSE THE PERFECT TEMPLATE:

MODERN TEMPLATE ⭐ BEST SELLER
Best for: Tech, Startups, Creative
• Clean, minimalist design
• Strong visual hierarchy
• Icon-based skills section
• Easy scanning by recruiters
• ATS-friendly layout

PROFESSIONAL TEMPLATE
Best for: Corporate, Finance, Law, Healthcare
• Traditional two-column option
• Conservative design
• Focus on content
• Professional font pairing
• Industry-standard format

CREATIVE TEMPLATE
Best for: Design, Marketing, Media, Art
• Bold typography
• Color accents
• Unique layout
• Showcases creativity
• Portfolio elements

EXECUTIVE TEMPLATE
Best for: C-Suite, Directors, Managers
• Premium, authoritative design
• Career summary focus
• Leadership emphasis
• Achievement-driven
• Board-ready appearance

MINIMAL TEMPLATE
Best for: Academic, Government, Legal
• Maximum whitespace
• Content-focused
• Ultra-clean layout
• Traditional formatting
• Maximum readability

TEMPLATE SELECTION TIPS:
• Match your industry norms
• Consider ATS compatibility
• Your experience level
• Role seniority
• When in doubt, go modern/professional`
    },
    coverLetter: {
      title: '✉️ Cover Letter Writing',
      content: `CRAFT A COMPELLING COVER LETTER:

STRUCTURE:

PARAGRAPH 1 - HOOK:
• Position you for
• How you found the role
• One compelling qualification
• Enthusiasm for the company

Example:
"I'm excited to apply for the Senior Developer position at GrowX. With 8+ years building scalable web applications and a track record of reducing load times by 60%, I'm eager to contribute to your innovative team."

PARAGRAPH 2-3 - PROOF:
• 2-3 specific achievements
• Quantify your impact
• Connect skills to job requirements
• Show culture fit

Example:
"At my current role at TechCorp, I led a team of 5 to rebuild our customer portal, resulting in a 40% increase in user engagement and a 25% reduction in support tickets."

PARAGRAPH 4 - CLOSE:
• Reiterate interest
• Reference attached resume
• Call to action
• Thank them

Example:
"I'd love to discuss how my skills align with GrowX's goals. I've attached my resume and am available for an interview at your convenience. Thank you for considering my application."

TIPS:
✓ Keep it to 3-4 paragraphs
✓ Customize for each application
✓ Use company's tone (formal vs casual)
✓ Avoid generic phrases
✓ Show, don't tell
✓ Proofread twice!`
    }
  },

  ats: {
    basics: {
      title: '✓ ATS Checker - Basics',
      content: `UNDERSTAND THE ATS CHECKER:

WHAT IS ATS?
Applicant Tracking System software that:
• Screens resumes automatically
• Scores candidates
• Filters qualified applicants
• Ranks by match percentage

HOW TO USE OUR ATS CHECKER:
1. Visit /atschecker
2. Upload your resume (PDF, DOCX)
3. Paste the job description
4. Click "Analyze"
5. Review your score & suggestions
6. Implement recommendations
7. Re-upload to check improvement

YOUR SCORE BREAKDOWN:

📊 OVERALL SCORE (0-100)
This is your ATS compatibility rating

📋 KEYWORD MATCH (0-100)
Keywords from job description found in resume

📝 FORMAT SCORE (0-100)
How well your resume format is parsed

🎯 SKILLS ALIGNMENT (0-100)
Your skills match job requirements

💼 EXPERIENCE RELEVANCE (0-100)
Years & type match requirements

🎓 EDUCATION FIT (0-100)
Degree/certifications alignment

SCORE INTERPRETATION:
90-100: Excellent - High chance of passing
70-89: Good - Likely to advance
50-69: Average - Needs improvement
Below 50: Poor - Major revisions needed`
    },
    advanced: {
      title: '✓ ATS Deep Optimization',
      content: `MASTER ATS OPTIMIZATION:

KEYWORD PLACEMENT STRATEGY:

CRITICAL SECTION: SKILLS
Match exact wording from job posting:
Job says: "Proficiency in JavaScript and React.js"
Your skills: JavaScript, React.js, React

HIGH-IMPACT SECTIONS:
• First bullet of each job
• Skills section (top 10)
• Summary statement
• Throughout experience

LOCATION IN RESUME:
📍 Top 1/3 of resume: Most important
📍 Skills section: Must have keywords
📍 Experience bullets: Natural placement

SKILLS CATEGORIES:

HARD SKILLS (Technical):
• Programming languages
• Software/tools proficiency
• Certifications
• methodologies (Agile, Scrum)

SOFT SKILLS (Transferable):
• Leadership
• Communication
• Problem-solving
• Team collaboration

INDUSTRY-SPECIFIC:
• Healthcare: HIPAA, EMR
• Finance: GAAP, SEC compliance
• Tech: CI/CD, Cloud platforms

AVOID THESE ATS KILLERS:
❌ Images or graphics
❌ Headers and footers
❌ Multiple columns
❌ Tables (parse as images)
❌ Uncommon fonts
❌ Special characters (!@#$%)
❌ Too much formatting
❌ Missing contact info`
    },
    scoreGuide: {
      title: '📊 ATS Score Interpretation',
      content: `UNDERSTAND YOUR SCORE:

90-100: EXCELLENT
✓ Your resume likely passes ATS
✓ High chance of human review
✓ You're a strong candidate
Action: Submit confidently!

80-89: STRONG
✓ Good chance of advancement
✓ Minor optimizations possible
✓ Most requirements met
Action: Consider adding more keywords

70-79: ABOVE AVERAGE
✓ Will likely pass initial screening
✓ Some gaps to address
✓ Room for improvement
Action: Review suggestions, add keywords

60-69: AVERAGE
⚠️ May or may not pass
⚠️ Several improvements needed
⚠️ Review top suggestions
Action: Optimize before applying

50-59: BELOW AVERAGE
❌ Significant optimization needed
❌ Likely filtered out
❌ Major keyword gaps
Action: Revise thoroughly, re-check

BELOW 50: POOR
❌ Very low chance of passing
❌ Major restructuring needed
❌ Missing critical elements
Action: Complete rebuild recommended

QUICK WINS TO BOOST SCORE:
1. Add missing keywords from job
2. Fix format issues
3. Expand skills section
4. Quantify more achievements
5. Ensure contact info complete
6. Use standard section headers`
    }
  },

  kanban: {
    basics: {
      title: '📋 Kanban Board - Basics',
      content: `ORGANIZE TASKS WITH KANBAN:

WHAT IS KANBAN?
A visual workflow system using boards, columns, and cards to manage tasks efficiently.

CORE PRINCIPLES:
1. Visualize work
2. Limit work in progress
3. Focus on flow
4. Continuous improvement

DEFAULT COLUMNS:

📝 TO DO
Tasks waiting to be started
Add new tasks here

⏳ IN PROGRESS
Currently working on
Limit to 2-3 tasks max

✅ DONE
Completed tasks
Archive weekly

GETTING STARTED:
1. Visit /KanbanBoard
2. Create your first board
3. Add task cards
4. Move cards as you work
5. Celebrate completions!

TASK CARD ELEMENTS:
• Title (clear, concise)
• Description (details)
• Due date (optional)
• Priority (low/med/high)
• Labels (categorize)
• Assignee (if team)

BENEFITS OF KANBAN:
✓ See all tasks at a glance
✓ Know what's in progress
✓ Identify bottlenecks
✓ Reduce overwhelm
✓ Track completion rates
✓ Build momentum`
    },
    advanced: {
      title: '📋 Kanban Productivity Systems',
      content: `MASTER ADVANCED KANBAN:

EXPANDED WORKFLOW:

BACKLOG 📚
Future tasks, ideas, nice-to-haves
Weekly review to prioritize

READY 🚦
Prepped for work, all info gathered
Clear next actions defined

TODO 📋
Committed to this sprint/week
Must be completed

IN PROGRESS 🔨
Actively working on
WIP limit: 1-3 tasks

REVIEW 👀
Waiting for feedback
External dependencies resolved

DONE ✅
Completed, shipped, verified
Move to archive monthly

WIP LIMITS (CRITICAL):
Limit tasks per column to prevent:
• Context switching
• Quality drops
• Missed deadlines

Recommended limits:
• In Progress: 2-3 max
• Review: 2 max
• High Priority: 3 max

CYCLE TIME TRACKING:
Time in each column reveals:
• Average completion time
• Bottlenecks
• Process improvements
• Realistic estimates

LABEL SYSTEM:
🔴 URGENT - Drop everything
🟠 HIGH - Today/this week
🟡 MEDIUM - This sprint
🟢 LOW - When possible
🔵 FEATURE - New functionality
🟣 BUG - Fix required
⚫ RESEARCH - Investigation

DAILY STANDUP:
1. What did I complete?
2. What am I working on?
3. Any blockers?`
    },
    productivity: {
      title: '⚡ Kanban Productivity Hacks',
      content: `DOUBLE YOUR PRODUCTIVITY:

MORNING ROUTINE:
1. Open Kanban board
2. Review today's tasks
3. Check for blockers
4. Prioritize top 3
5. Start with hardest first

TASK BREAKDOWN METHOD:
Large task → Small chunks
❌ "Build website"
✅ "Design homepage mockup"
✅ "Set up React project"
✅ "Create navbar component"
✅ "Add hero section"

EISENHOWER MATRIX ON KANBAN:
• Urgent + Important → HIGH priority
• Not Urgent + Important → MEDIUM
• Urgent + Not Important → DELEGATE
• Not + Not Urgent/Important → DELETE

FOCUS TECHNIQUES:
🍅 Pomodoro: 25 min work, 5 min break
• 4 pomodoros = 25 min break
• Move one card per pomodoro

⏱️ TIME BLOCKING:
• Morning: Deep work (hard tasks)
• Afternoon: Meetings & admin
• Evening: Light tasks & planning

FLOW STATE TIPS:
✓ Single-tasking only
✓ Phone on silent
✓ Close extra browser tabs
✓ One task card visible
✓ Celebrate micro-wins

WEEKLY REVIEW (Sunday):
1. Archive completed tasks
2. Review what didn't get done
3. Analyze bottlenecks
4. Plan next week
5. Clear the backlog

METRICS TO TRACK:
📈 Throughput: Tasks/week
⏱️ Lead time: Create to complete
📊 WIP average: Should be low
🎯 Completion rate: Done/Total

BATCH PROCESSING:
Group similar tasks:
• All emails at once
• All calls at once
• All coding reviews together
• All design tasks together`
    }
  },

  internship: {
    basics: {
      title: '💼 Internship Program - Overview',
      content: `LAUNCH YOUR CAREER WITH INTERNSHIPS:

AVAILABLE DEPARTMENTS:

💻 ENGINEERING
• Frontend Development
• Backend Development
• Mobile Development
• QA/Testing
• DevOps

📊 DATA & ANALYTICS
• Data Science
• Data Engineering
• Business Intelligence
• Analytics

🎨 DESIGN & PRODUCT
• UI/UX Design
• Product Management
• Graphic Design

📢 MARKETING & SALES
• Digital Marketing
• Content Creation
• Sales Development
• Customer Success

OPERATIONS
• Project Coordination
• Quality Assurance
• Human Resources

WHAT YOU GET:
✓ Real-world projects
✓ Mentorship from experts
✓ Professional feedback
✓ Networking opportunities
✓ Certificate of completion
✓ Referral for full-time roles
✓ Stipend (select programs)

APPLICATION PROCESS:
1. Browse /internship
2. Select department
3. Complete application form
4. Take assessment (if required)
5. Phone/Video interview
6. Offer letter
7. Onboarding`
    },
    application: {
      title: '📝 Internship Application Guide',
      content: `STAND OUT FROM OTHER APPLICANTS:

RESUME FOR INTERNSHIPS:

WHAT TO HIGHLIGHT:
• Relevant coursework
• Projects (class/personal)
• GitHub contributions
• Volunteer experience
• Extracurricular activities
• Any industry exposure

EXPERIENCE SECTION:
Even without formal work:
• Teaching assistant roles
• Club leadership positions
• Hackathon participation
• Open source contributions
• Personal projects

SKILLS SECTION:
Include both:
• Technical: Python, SQL, Java, etc.
• Tools: Git, VS Code, Figma, etc.
• Soft: Communication, Teamwork

COVER LETTER TIPS:
• Research the company deeply
• Show genuine interest
• Connect your skills to role
• Share specific examples
• End with clear CTA

COMMON INTERVIEW QUESTIONS:

1. "Tell me about yourself"
   → 2 min pitch: Background + Relevance + Goals

2. "Why this internship?"
   → Company mission + Role fit + Your interest

3. "Your greatest strength/weakness?"
   → Real strength + Example + How you develop weakness

4. "Where do you see yourself in 5 years?"
   → Realistic goal + How this helps + Growth mindset

5. "Describe a challenge you overcame"
   → Use STAR method (Situation, Task, Action, Result)`
    },
    interview: {
      title: '🎤 Internship Interview Prep',
      content: `ACE YOUR INTERNSHIP INTERVIEW:

BEFORE THE INTERVIEW:

RESEARCH:
• Company products/services
• Recent news/press releases
• Mission and values
• Team you'll join
• Interviewer's background (LinkedIn)

PREPARE STORIES:
Using STAR Method:
Situation: Set the scene
Task: Your responsibility
Action: What you specifically did
Result: Outcome (quantify if possible)

COMMON QUESTIONS BY CATEGORY:

TECHNICAL:
• "Explain [concept] to me"
• "Write pseudocode for [problem]"
• "Debug this code"
• "What happens when you type google.com?"

BEHAVIORAL:
• "Tell me about a time you failed"
• "Describe working in a team"
• "How do you handle feedback?"
• "Give an example of leadership"

CULTURE FIT:
• "Why do you want to work here?"
• "What are your values?"
• "How do you stay organized?"
• "What excites you about tech?"

QUESTIONS TO ASK THEM:
• "What does a typical day look like?"
• "What projects would I work on?"
• "How is performance evaluated?"
• "What's the team culture like?"
• "What do you enjoy about working here?"

AFTER THE INTERVIEW:
✓ Send thank-you email within 24 hours
✓ Reference specific conversation points
✓ Reiterate your interest
✓ Ask about next steps`
    }
  },

  job: {
    basics: {
      title: '🎯 Job Portal - Getting Started',
      content: `FIND YOUR DREAM JOB:

HOW THE PORTAL WORKS:
1. Browse jobs at /browse or /job
2. Use filters to narrow down
3. Save interesting positions
4. View full job descriptions
5. Apply directly through portal
6. Track application status

FILTER OPTIONS:
📍 Location: Remote, On-site, Hybrid
🏢 Company: Size, Industry, Rating
💼 Type: Full-time, Part-time, Contract
📊 Level: Entry, Mid, Senior, Lead
💰 Salary: Range filters
🛠️ Skills: Required technologies

JOB TYPES EXPLAINED:

FULL-TIME:
• 40+ hours/week
• Benefits included
• Permanent position
• Standard onboarding

PART-TIME:
• Under 40 hours
• May have benefits
• Flexible schedule
• Often can convert to FT

CONTRACT:
• Fixed term (3-12 months)
• Higher hourly rate
• Often no benefits
• Renewable or convert

INTERNSHIP:
• Temporary program
• Training-focused
• May convert to FT
• Learning opportunity

REMOTE/HYBRID:
• Remote: 100% from home
• Hybrid: Mix of office/home
• Location-based: Near office
• Global: Any timezone`

    },
    search: {
      title: '🔍 Advanced Job Search',
      content: `FIND JOBS OTHERS MISS:

BOOLEAN SEARCH TECHNIQUES:

AND - Must include both:
"Software Engineer" AND "React"
Results: Jobs requiring BOTH terms

OR - Include either:
"Designer" OR "UI Developer"
Results: Jobs with EITHER term

NOT - Exclude:
"Manager" NOT "Sales Manager"
Results: Manager jobs, but not sales

QUOTATIONS - Exact phrase:
"Product Manager" (with quotes)
Results: Exactly that phrase

PARENTHESES - Complex:
("Python" OR "Java") AND "Remote"

JOB BOARD STRATEGY:
Daily routine:
• Indeed: Bulk applications
• LinkedIn: Networking + applications
• Glassdoor: Research + reviews
• Company sites: Direct applications
• Referrals: 40% of hires come from referrals

HIDDEN JOB MARKET:
65% of jobs are never posted!
Find them through:
✓ LinkedIn connections
✓ Company career pages
✓ Employee referrals
✓ Recruiter outreach
✓ Industry events
✓ Professional associations

SAVE TIME WITH:
• Job alert setup
• One-click apply profiles
• Resume optimization
• Cover letter templates
• Application tracker

TRACK EVERY APPLICATION:
• Company name
• Position title
• Date applied
• Point of contact
• Follow-up date
• Status`
    },
    interview: {
      title: '💼 Interview Mastery',
      content: `SECURE THE JOB OFFER:

BEFORE INTERVIEW:

RESEARCH (3 layers):
1. Company: Products, mission, culture
2. Role: Job description, requirements
3. Interviewer: LinkedIn, background

PREPARE 10 STORIES:
• 3 about achievements
• 3 about challenges overcome
• 2 about leadership
• 2 about failure/learning

DURING INTERVIEW:

FIRST 5 MINUTES MATTER:
• Professional appearance
• Firm handshake
• Genuine smile
• Enthusiastic energy

ANSWERING QUESTIONS:

STAR Method for All Stories:
Situation: "At my previous job..."
Task: "I was responsible for..."
Action: "I created a system that..."
Result: "Which increased efficiency by 40%"

Common Mistakes:
❌ Not answering the question
❌ Being too vague
❌ Talking too much
❌ Badmouthing previous employers
❌ Forgetting to ask questions

QUESTIONS TO ASK:
• "What does success look like in 90 days?"
• "What's the biggest challenge facing the team?"
• "How has this role evolved?"
• "What's the team dynamic?"
• "What do you enjoy about working here?"

COMPENSATION DISCUSSION:
• Let them bring up salary first
• Know your worth (research levels.fyi, Glassdoor)
• Consider total comp: base + bonus + equity + benefits
• Have a range in mind
• Negotiate respectfully

AFTER INTERVIEW:
✓ Send thank-you email SAME DAY
✓ Reference specific conversation points
✓ Express continued enthusiasm
✓ Ask about timeline if not mentioned`
    },
    salary: {
      title: '💰 Salary Negotiation Guide',
      content: `NEGOTIATE YOUR BEST OFFER:

KNOW YOUR WORTH:

RESEARCH TOOLS:
• levels.fyi (tech salaries)
• Glassdoor.com
• salary.com
• Payscale.com
• Blind (tech)

FACTORS THAT AFFECT SALARY:
✓ Experience level
✓ Location (cost of living)
✓ Company size
✓ Industry
✓ Skills in demand
✓ Education
✓ Negotiation skills!

WHEN TO NEGOTIATE:
After receiving an offer, NOT before

HOW TO NEGOTIATE:

1. EXPRESS ENTHUSIASM:
"I'm excited about this opportunity..."

2. PRESENT YOUR CASE:
"Based on my research and experience..."

3. STATE YOUR NUMBER:
"I was hoping for $X, based on..."

4. BE READY TO JUSTIFY:
• "I bring 5 years of experience in..."
• "My skills in X are in high demand..."
• "I've received another offer at $Y..."

5. NEGOTIATE TOTAL COMP:
If base is firm, negotiate:
• Signing bonus
• Equity/stock options
• Vacation days
• Remote work flexibility
• Professional development budget
• Equipment allowance

COMMON MISTAKES:
❌ Not negotiating at all
❌ Lowballing yourself
❌ Being aggressive
❌ Lying about other offers
❌ Accepting immediately
❌ Being too rigid

REMEMBER:
• 85% of employers expect negotiation
• 1 negotiation = 10-20% increase
• Most don't rescind offers for negotiating
• It's a normal part of the process

Script: "I appreciate the offer. Given my experience and the market rate, I was hoping we could discuss [benefit/pay]. Is that something we could explore?"`
    }
  },

  account: {
    profile: '👤 Profile Management\n\nKeep your GrowX profile updated to maximize opportunities.\n\nESSENTIAL SECTIONS:\n• Professional photo\n• Contact information\n• Professional headline\n• About/bio section\n• Skills list\n• Resume upload\n\nOPTIONAL ENHANCEMENTS:\n• Portfolio links\n• GitHub profile\n• LinkedIn URL\n• Certifications\n• Languages\n• Volunteer experience\n\nTIPS:\n✓ Use a clear, professional photo\n✓ Write a compelling headline\n✓ Add all relevant skills\n✓ Keep information current\n✓ Enable notifications\n✓ Complete at least 80% to appear in searches'
  },

  pricing: {
    free: '💰 Free Features\n\nAll users get FREE access to:\n\n✓ Learning platform (all courses)\n✓ Video tutorials\n✓ Basic quizzes\n✓ Resume builder (2 templates)\n✓ ATS Checker (3 analyses/month)\n✓ Kanban board (1 project)\n✓ Job browsing\n✓ Community forums\n✓ Performance analytics\n\nNo credit card required!',

    premium: '⭐ Premium Features (Coming Soon)\n\nEnhanced tools for serious professionals:\n\n• Unlimited resume downloads\n• All resume templates\n• Unlimited ATS checks\n• Cover letter builder\n• LinkedIn optimization\n• Priority support\n• Advanced analytics\n• Export to multiple formats\n• 1-on-1 career coaching\n\nEarly bird pricing available!\nStay tuned for announcements.'
  },

  interview: {
    basics: {
      title: '🎤 Interview Basics',
      content: `MASTER INTERVIEW SKILLS:

WHAT TO EXPECT:
• Phone/Video screening (20-30 min)
• Technical interview (45-60 min)
• Behavioral interview (30-45 min)
• Final round/Onsite (2-4 hours)

INTERVIEW TYPES:

TECHNICAL:
• Coding challenges
• System design
• Problem-solving
• Domain knowledge

BEHAVIORAL:
• Past experiences
• Teamwork scenarios
• Conflict resolution
• Leadership examples

HOW TO PREPARE:
1. Study the job description
2. Research the company
3. Practice common questions
4. Prepare your own questions
5. Test your setup (for virtual)

RECOMMENDED NEXT STEPS:
• Visit /quiz to practice technical questions
• Check out coding challenges in the platform
• Review your resume for consistency`
    },
    questions: {
      title: '🎯 Common Interview Questions',
      content: `MUST-KNOW INTERVIEW QUESTIONS:

TELL ME ABOUT YOURSELF (2-3 min)
Focus: Present → Past → Future
Example: "I'm a software developer with 3 years of experience..."

WHY THIS COMPANY?
Focus: Company values, products, mission
Research: Recent news, culture, growth

STRENGTHS & WEAKNESSES
Strength: Real example + impact
Weakness: Real weakness + how you're improving

GREATEST ACHIEVEMENT
Use STAR: Situation, Task, Action, Result
Quantify: Numbers, percentages, outcomes

CHALLENGE/Failure
Focus: What you learned, how you grew
Never blame others

TEAM CONFLICT
Focus: Communication, resolution, growth

WHY SHOULD WE HIRE YOU?
Unique value proposition
Key skills + experience match

QUESTIONS TO ASK:
• "What does success look like in 90 days?"
• "What's the biggest challenge the team faces?"
• "How do you measure performance?"
• "What's the team culture like?"`
    },
    coding: {
      title: '💻 Coding Interview Prep',
      content: `CRACK THE CODING INTERVIEW:

TOPIC PRIORITY:
1. Arrays & Strings (40%)
2. Hash Tables (30%)
3. Linked Lists (20%)
4. Trees & Graphs (30%)
5. Dynamic Programming (20%)
6. Sorting & Searching (25%)

ALGORITHMS TO MASTER:
• Two pointers
• Sliding window
• BFS/DFS
• Recursion
• Binary search
• Sorting algorithms

DATA STRUCTURES:
• Arrays & Strings
• Hash Maps/Sets
• Stacks & Queues
• Linked Lists
• Trees (BST, Trie)
• Graphs

PRACTICE PLATFORMS:
• LeetCode (recommended)
• HackerRank
• CodeSignal
• InterviewCake

TIPS:
✓ Start with Easy problems
✓ Time yourself (30 min max)
✓ Think out loud
✓ Test your code with edge cases
✓ Review optimal solutions

RECOMMENDED:
Practice 2-3 problems daily
Focus on medium difficulty
Join our coding quiz section!`
    },
    salary: {
      title: '💰 Salary Negotiation',
      content: `NEGOTIATE YOUR BEST OFFER:

WHEN TO NEGOTIATE:
After receiving offer, NOT before

RESEARCH:
• levels.fyi (tech salaries)
• Glassdoor
• Blind app
• Payscale

HOW TO NEGOTIATE:
1. Express enthusiasm
2. Present your case with data
3. State your expected range
4. Justify with experience/skills
5. Consider total comp

TOTAL COMPONENTS:
• Base salary
• Bonus (annual)
• Equity/Stock
• Benefits
• Signing bonus
• Remote work

NEGOTIATE TIPS:
✓ Let them make first offer
✓ Have a number in mind
✓ Don't accept immediately
✓ Consider non-monetary perks

COMMON MISTAKE:
Not negotiating = leaving money on table
Average negotiation: 10-20% increase

Script: "I'm excited about this opportunity. Based on my research and experience, I was hoping we could discuss [benefit/pay]. Is that possible?"`
    }
  },

  coding: {
    basics: {
      title: '💻 Coding Fundamentals',
      content: `START YOUR CODING JOURNEY:

LANGUAGES TO LEARN:
• Python (beginner-friendly)
• JavaScript (web dev)
• Java (enterprise)
• C++ (systems/programming)

FIRST STEPS:
1. Learn syntax basics
2. Understand data types
3. Control flow (if/else, loops)
4. Functions
5. Basic data structures

PLATFORM RESOURCES:
• /learning - Interactive courses
• /quiz - Practice questions
• Code editor in browser

RECOMMENDED LEARNING PATH:
Week 1-2: Variables, operators
Week 3-4: Control flow, functions
Week 5-6: Arrays, strings
Week 7-8: Basic algorithms

TIPS:
✓ Code daily (30 min minimum)
✓ Build small projects
✓ Don't fear errors
✓ Join community forums
✓ Review and refactor code`
    },
    algorithms: {
      title: '🔢 Algorithms & Data Structures',
      content: `MASTER ALGORITHMS:

COMPLEXITY ANALYSIS:
• O(1) - Constant
• O(log n) - Logarithmic
• O(n) - Linear
• O(n log n) - Linearithmic
• O(n²) - Quadratic

KEY ALGORITHMS:

SORTING:
• Quick Sort
• Merge Sort
• Bubble Sort
• Insertion Sort

SEARCHING:
• Binary Search
• Linear Search

GRAPHS:
• BFS (Breadth-First)
• DFS (Depth-First)
• Dijkstra's Algorithm

DYNAMIC PROGRAMMING:
• Memoization
• Tabulation

DATA STRUCTURES:
• Arrays (O(1) access)
• Linked Lists (O(1) insert)
• Hash Tables (O(1) lookup)
• Stacks (LIFO)
• Queues (FIFO)
• Trees (hierarchical)
• Graphs (relationships)

PRACTICE:
Use /quiz for algorithm practice
Start with easy, progress to medium`
    },
    projects: {
      title: '🚀 Build Projects',
      content: `BUILD YOUR PORTFOLIO:

BEGINNER PROJECTS:
• Calculator app
• Todo list
• Weather app
• Portfolio website

INTERMEDIATE PROJECTS:
• E-commerce site
• Blog with CMS
• REST API
• Chat application

ADVANCED PROJECTS:
• Full-stack app
• Machine learning model
• Mobile app
• Real-time dashboard

PROJECT STRUCTURE:
1. Plan features
2. Design database
3. Build UI
4. Implement backend
5. Test thoroughly
6. Deploy

SHOWCASE YOUR WORK:
• GitHub profile
• Live demos
• Documentation
• README files

TIPS:
✓ One project > many tutorials
✓ Focus on quality
✓ Solve real problems
✓ Learn new technologies
✓ Build consistently`
    },
    practice: {
      title: '📝 Practice Coding',
      content: `PRACTICE EFFECTIVELY:

DAILY ROUTINE:
• 30 min LeetCode
• 1 hour building
• Review solutions

PLATFORM FEATURES:
• /quiz - Topic-based questions
• /learning - Structured courses
• Code editor available
• Progress tracking

PROBLEM-SOLVING APPROACH:
1. Read problem twice
2. Identify input/output
3. Consider brute force first
4. Optimize step by step
5. Write clean code
6. Test edge cases

DIFFICULTY PROGRESSION:
Easy (1-2 weeks) → Medium (1-2 months) → Hard (ongoing)

COMMON TOPICS:
• Arrays & Strings
• Two Pointers
• Sliding Window
• Hash Tables
• Recursion
• Trees
• Dynamic Programming

JOIN:
• Community forums
• Study groups
• Pair programming`
    }
  }
};

// Intelligent Response Router
const getResponse = (message) => {
  const msg = message.toLowerCase();

  // Greetings
  if (/\b(hi|hello|hey|good morning|good evening|howdy|greetings|start|help)\b/.test(msg) && !/\b(about|explain|tell)\b/.test(msg)) {
    return AI_KNOWLEDGE.welcome;
  }

  // Contact
  if (/\b(contact|email|phone|support|help|reach|speak.*someone)\b/.test(msg)) {
    return { message: '📞 Contact Us\n\nEmail: hello@growx.com\nSupport: Available 24/7\n\nI\'m here to help with any GrowX questions!' };
  }

  // Thanks
  if (/\b(thank.*you|thanks|thx|ty|appreciate)\b/.test(msg)) {
    return { message: "You're welcome! 😊\n\nIs there anything else I can help you with? Feel free to ask about:\n• Learning & Courses\n• Quizzes & Assessments\n• Resume Building & ATS\n• Kanban Boards\n• Internships & Jobs\n• Career Advice\n\nHappy to assist!" };
  }

  // Default
  return AI_KNOWLEDGE.welcome;
};

const quickTopics = [
  { label: 'Learning', icon: BookOpen, color: '#60a5fa', query: 'Tell me about Learning' },
  { label: 'Quiz', icon: CheckCircle, color: '#34d399', query: 'Tell me about Quiz' },
  { label: 'Resume', icon: FileText, color: '#f472b6', query: 'Tell me about Resume' },
  { label: 'ATS', icon: Award, color: '#818cf8', query: 'Tell me about ATS' },
  { label: 'Kanban', icon: LayoutGrid, color: '#fbbf24', query: 'Tell me about Kanban' },
  { label: 'Internship', icon: GraduationCap, color: '#38bdf8', query: 'Tell me about Internship' },
  { label: 'Job', icon: Briefcase, color: '#4ade80', query: 'Tell me about Job Portal' },
];

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: AI_KNOWLEDGE.welcome.message, timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveChatToBackend = async (allMessages) => {
    try {
      const isUserGuest = !user?.id;
      const chatData = {
        messages: allMessages.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp || new Date()
        })),
        topic: 'general',
        sessionId,
        userId: user?.id || null,
        userEmail: user?.email || null,
        userName: user?.fullname || null,
        isGuest: isUserGuest
      };

      if (sessionId) {
        await axios.put(`${API.aiChat}/${sessionId}`, { messages: allMessages.slice(-2) }, {
          withCredentials: true
        });
      } else {
        const res = await axios.post(`${API.aiChat}`, chatData, {
          withCredentials: true
        });
        if (res.data.data?._id) {
          setSessionId(res.data.data._id);
        }
      }
    } catch (error) {
      console.log('Failed to save chat:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    const msgLower = input.toLowerCase();
    
    const isProtectedQuery = 
      /\b(learning|quiz|test|exam|course|education|study|training|tutorial)\b/.test(msgLower) ||
      /\b(kanban|task.*board|project.*board|trello|workflow)\b/.test(msgLower) ||
      /\b(interview|code.*interview|technical.*interview|algorithm.*interview)\b/.test(msgLower) ||
      /\b(coding|programming|code.*learn|learn.*code|start.*code|beginner.*code)\b/.test(msgLower) ||
      /\b(internship|intern|training.*program)\b/.test(msgLower) ||
      /\b(job|career|employment|work.*position|apply.*job)\b/.test(msgLower) ||
      /\b(resume|cv|curriculum.*vitae|build.*resume|create.*resume)\b/.test(msgLower) ||
      /\b(ats|ats.*checker|applicant.*tracking|scanner)\b/.test(msgLower);
    
    const isLoggedIn = user?.id && user?.fullname;

    if (isProtectedQuery && !isLoggedIn) {
      const guestMessage = {
        role: 'assistant',
        content: "I'm sorry! 🔒\n\nThis feature is available for logged-in users only.\n\nPlease login or register to access:\n• Learning & Courses\n• Quizzes & Tests\n• Kanban Boards\n• Internships & Jobs\n• Resume Builder & ATS Checker\n\nClick the profile icon to login or register. I look forward to helping you once you're signed in!",
        timestamp: new Date()
      };

      setInput('');
      setMessages(prev => [...prev, userMessage, guestMessage]);
      return;
    }

    setInput('');
    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      saveChatToBackend(newMessages);
      return newMessages;
    });
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(userMessage.content);
      const content = response.message || response.content || response;
      const assistantMessage = {
        role: 'assistant',
        content: content,
        timestamp: new Date()
      };

      setMessages(prev => {
        const newMessages = [...prev, assistantMessage];
        saveChatToBackend(newMessages);
        return newMessages;
      });
      setIsTyping(false);
    }, 500 + Math.random() * 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickTopic = (topic) => {
    setIsPanelOpen(false);
    setInput(topic.query);
    setTimeout(handleSend, 100);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50"
        style={{
          background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`,
          boxShadow: `0 4px 20px ${C.goldBorder}`,
        }}
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="w-6 h-6 text-gray-900" />
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse"
          style={{ background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[440px] h-[80vh] sm:h-[600px] max-h-[700px] rounded-2xl overflow-hidden z-50 flex flex-col"
            style={{
              background: C.charcoal,
              border: `1px solid ${C.goldBorder}`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${C.goldDim}`,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{ background: `linear-gradient(135deg, ${C.surface} 0%, ${C.charcoal} 100%)`, borderBottom: `1px solid ${C.goldBorder}` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)` }}>
                  <Bot className="w-5 h-5 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: C.ivory }}>GrowX AI Assistant</h3>
                  <p className="text-xs flex items-center gap-1" style={{ color: '#10B981' }}>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Advanced AI - Deep Trained
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsPanelOpen(!isPanelOpen)}
                  className="p-2 rounded-lg transition-colors duration-200"
                  style={{ color: C.ivoryMuted }}
                  onMouseEnter={(e) => e.currentTarget.style.background = C.goldDim}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  title="Quick Topics"
                >
                  <Zap className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg transition-colors duration-200"
                  style={{ color: C.ivoryMuted }}
                  onMouseEnter={(e) => e.currentTarget.style.background = C.goldDim}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Topics Panel */}
            <AnimatePresence>
              {isPanelOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                  style={{ background: C.surface, borderBottom: `1px solid ${C.goldBorder}` }}
                >
                  <div className="p-3">
                    <p className="text-xs font-semibold mb-2" style={{ color: C.gold }}>
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      Quick Topics
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickTopics.map((topic) => (
                        <button
                          key={topic.label}
                          onClick={() => handleQuickTopic(topic)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                          style={{
                            background: C.surfaceLight,
                            border: `1px solid ${C.goldBorder}`,
                            color: C.ivory,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = `${topic.color}22`;
                            e.currentTarget.style.borderColor = topic.color;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = C.surfaceLight;
                            e.currentTarget.style.borderColor = C.goldBorder;
                          }}
                        >
                          <topic.icon className="w-4 h-4" style={{ color: topic.color }} />
                          {topic.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`
                }>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 shrink-0"
                      style={{ background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)` }}>
                      <Bot className="w-4 h-4 text-gray-900" />
                    </div>
                  )}
                  <div
                    className="max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={{
                      background: msg.role === 'user'
                        ? `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)`
                        : C.surface,
                      color: msg.role === 'user' ? C.obsidian : C.ivory,
                      border: msg.role === 'user' ? 'none' : `1px solid ${C.goldBorder}`,
                      borderRadius: msg.role === 'user'
                        ? '16px 16px 4px 16px'
                        : '16px 16px 16px 4px',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center ml-2 shrink-0"
                      style={{ background: C.surfaceLight }}>
                      <User className="w-4 h-4" style={{ color: C.ivoryMuted }} />
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-start"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-2"
                    style={{ background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldDark} 100%)` }}>
                    <Bot className="w-4 h-4 text-gray-900" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-none"
                    style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: C.gold, animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: C.gold, animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: C.gold, animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 pt-2 shrink-0" style={{ borderTop: `1px solid ${C.goldBorder}` }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything about GrowX..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: C.surfaceLight,
                    border: `1px solid ${C.goldBorder}`,
                    color: C.ivory,
                  }}
                />
                <motion.button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldLight} 100%)`,
                  }}
                >
                  {isTyping ? (
                    <Loader2 className="w-4 h-4 text-gray-900 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-gray-900" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 sm:hidden"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatAssistant;
