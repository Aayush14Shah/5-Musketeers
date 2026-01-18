const pptxgen = require('pptxgenjs');

const pptx = new pptxgen();

pptx.author = 'SkillSphere Team';
pptx.title = 'SkillSphere - AU Hackathon 2026';
pptx.subject = 'Hackathon Presentation';

const colors = {
  primary: '6366F1',
  secondary: '8B5CF6',
  accent: '06B6D4',
  dark: '1E293B',
  light: 'F8FAFC',
  success: '10B981',
  warning: 'F59E0B',
  danger: 'EF4444',
};

// ===== SLIDE 1: Title + Team Info =====
let slide1 = pptx.addSlide();
slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { type: 'solid', color: colors.primary } });
slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 4.2, w: '100%', h: 1.8, fill: { type: 'solid', color: colors.secondary } });

slide1.addText('SkillSphere', {
  x: 0.5, y: 1.2, w: '90%', h: 0.9,
  fontSize: 52, bold: true, color: 'FFFFFF',
  fontFace: 'Arial',
});
slide1.addText('Holistic Academic & Professional Skill Intelligence System', {
  x: 0.5, y: 2.1, w: '90%', h: 0.5,
  fontSize: 20, color: 'E0E7FF',
  fontFace: 'Arial',
});
slide1.addText('AU Hackathon 2026', {
  x: 0.5, y: 2.8, w: '90%', h: 0.4,
  fontSize: 16, color: 'C4B5FD', bold: true,
  fontFace: 'Arial',
});

slide1.addText('Team Name: SkillSphere', {
  x: 0.5, y: 4.4, w: '45%', h: 0.35,
  fontSize: 14, bold: true, color: 'FFFFFF',
  fontFace: 'Arial',
});
slide1.addText('Team Leader: Kirtan Patel', {
  x: 0.5, y: 4.75, w: '45%', h: 0.35,
  fontSize: 13, color: 'E0E7FF',
  fontFace: 'Arial',
});
slide1.addText('Email: kirtan.patel@example.com', {
  x: 0.5, y: 5.05, w: '45%', h: 0.35,
  fontSize: 12, color: 'C4B5FD',
  fontFace: 'Arial',
});

slide1.addText('Team Members:', {
  x: 5.2, y: 4.4, w: '45%', h: 0.35,
  fontSize: 14, bold: true, color: 'FFFFFF',
  fontFace: 'Arial',
});
slide1.addText('Member 1, Member 2, Member 3', {
  x: 5.2, y: 4.75, w: '45%', h: 0.6,
  fontSize: 12, color: 'E0E7FF',
  fontFace: 'Arial',
});

// ===== SLIDE 2: Problem Statement =====
let slide2 = pptx.addSlide();
slide2.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.1, fill: { type: 'solid', color: colors.danger } });
slide2.addText('Problem Statement', {
  x: 0.5, y: 0.3, w: '90%', h: 0.5,
  fontSize: 30, bold: true, color: 'FFFFFF',
  fontFace: 'Arial',
});

const problems = [
  { num: '01', title: 'Skill Gap Blindness', desc: 'Students are unaware of specific skills they lack for their desired careers in emerging tech sectors' },
  { num: '02', title: 'Information Overload', desc: 'Overwhelming number of courses, certifications & resources with no clear direction or personalization' },
  { num: '03', title: 'Academia-Industry Disconnect', desc: 'Academic curricula lag behind rapidly evolving industry requirements in Healthcare, AgriTech & Smart Cities' },
  { num: '04', title: 'No Intelligent Guidance', desc: 'Generic career advice fails to account for individual backgrounds, existing skills & career aspirations' },
];

problems.forEach((p, i) => {
  const yPos = 1.3 + (i * 1.1);
  slide2.addShape(pptx.ShapeType.rect, { 
    x: 0.4, y: yPos, w: 9.2, h: 0.95, 
    fill: { type: 'solid', color: i % 2 === 0 ? 'FEE2E2' : 'FEF2F2' },
    line: { color: colors.danger, pt: 1 }
  });
  slide2.addText(p.num, {
    x: 0.6, y: yPos + 0.25, w: 0.6, h: 0.5,
    fontSize: 18, bold: true, color: colors.danger,
    fontFace: 'Arial',
  });
  slide2.addText(p.title, {
    x: 1.3, y: yPos + 0.1, w: 3.5, h: 0.35,
    fontSize: 14, bold: true, color: colors.dark,
    fontFace: 'Arial',
  });
  slide2.addText(p.desc, {
    x: 1.3, y: yPos + 0.48, w: 8, h: 0.45,
    fontSize: 11, color: '64748B',
    fontFace: 'Arial',
  });
});

// ===== SLIDE 3: Ideation & Approach =====
let slide3 = pptx.addSlide();
slide3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.1, fill: { type: 'solid', color: colors.success } });
slide3.addText('Ideation & Approach', {
  x: 0.5, y: 0.3, w: '90%', h: 0.5,
  fontSize: 30, bold: true, color: 'FFFFFF',
  fontFace: 'Arial',
});

slide3.addText('Our Solution: AI-Powered Skill Intelligence Platform', {
  x: 0.5, y: 1.25, w: '90%', h: 0.4,
  fontSize: 16, color: colors.dark, bold: true,
  fontFace: 'Arial',
});

const approaches = [
  { icon: '1', text: 'KNN-based ML Algorithm for intelligent project recommendations using cosine similarity' },
  { icon: '2', text: 'Industry framework mapping (SFIA, NICE, Custom) for standardized skill assessment' },
  { icon: '3', text: 'TF-IDF + Hybrid Content-Based Filtering for course recommendations' },
  { icon: '4', text: 'Dynamic skill gap analysis with weighted scoring system' },
  { icon: '5', text: 'Personalized 4-week learning roadmap generation' },
  { icon: '6', text: 'Real-time progress tracking with career readiness scores' },
];

approaches.forEach((a, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const xPos = 0.5 + (col * 4.8);
  const yPos = 1.75 + (row * 1.05);
  
  slide3.addShape(pptx.ShapeType.ellipse, { 
    x: xPos, y: yPos + 0.1, w: 0.4, h: 0.4, 
    fill: { type: 'solid', color: colors.success },
  });
  slide3.addText(a.icon, {
    x: xPos, y: yPos + 0.15, w: 0.4, h: 0.35,
    fontSize: 12, bold: true, color: 'FFFFFF',
    fontFace: 'Arial', align: 'center',
  });
  slide3.addText(a.text, {
    x: xPos + 0.5, y: yPos, w: 4.1, h: 0.9,
    fontSize: 11, color: colors.dark,
    fontFace: 'Arial',
  });
});

slide3.addShape(pptx.ShapeType.rect, { 
  x: 0.5, y: 5.0, w: 9, h: 0.6, 
  fill: { type: 'solid', color: 'DCFCE7' },
});
slide3.addText('Target Domains: Healthcare Tech | Agricultural Tech | Smart Cities', {
  x: 0.5, y: 5.1, w: 9, h: 0.4,
  fontSize: 13, color: colors.success, bold: true,
  fontFace: 'Arial', align: 'center',
});

// ===== SLIDE 4: Challenges =====
let slide4 = pptx.addSlide();
slide4.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.1, fill: { type: 'solid', color: colors.warning } });
slide4.addText('Challenges Faced', {
  x: 0.5, y: 0.3, w: '90%', h: 0.5,
  fontSize: 30, bold: true, color: 'FFFFFF',
  fontFace: 'Arial',
});

const challenges = [
  { title: 'Algorithm Optimization', desc: 'Balancing accuracy vs performance in KNN with large skill vocabularies. Solved using weighted scoring with cosine similarity.', solution: 'Implemented 4-factor weighted scoring' },
  { title: 'Skill Normalization', desc: 'Handling variations in skill names (React vs ReactJS vs React.js). Created comprehensive normalization pipeline.', solution: 'Fuzzy matching + vocabulary mapping' },
  { title: 'Framework Integration', desc: 'Mapping diverse industry frameworks (SFIA, NICE) into unified skill taxonomy.', solution: 'Custom category-based architecture' },
  { title: 'Real-time Gap Analysis', desc: 'Computing skill gaps dynamically with changing user profiles and framework updates.', solution: 'Efficient caching + incremental updates' },
];

challenges.forEach((c, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const xPos = 0.4 + (col * 4.8);
  const yPos = 1.3 + (row * 2.0);
  
  slide4.addShape(pptx.ShapeType.rect, { 
    x: xPos, y: yPos, w: 4.5, h: 1.8, 
    fill: { type: 'solid', color: 'FFFBEB' },
    line: { color: colors.warning, pt: 1 },
  });
  slide4.addText(c.title, {
    x: xPos + 0.15, y: yPos + 0.1, w: 4.2, h: 0.35,
    fontSize: 13, bold: true, color: colors.dark,
    fontFace: 'Arial',
  });
  slide4.addText(c.desc, {
    x: xPos + 0.15, y: yPos + 0.5, w: 4.2, h: 0.75,
    fontSize: 10, color: '64748B',
    fontFace: 'Arial',
  });
  slide4.addText('Solution: ' + c.solution, {
    x: xPos + 0.15, y: yPos + 1.3, w: 4.2, h: 0.35,
    fontSize: 10, bold: true, color: colors.success,
    fontFace: 'Arial',
  });
});

// ===== SLIDE 5: Workflow & Architecture =====
let slide5 = pptx.addSlide();
slide5.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.1, fill: { type: 'solid', color: colors.accent } });
slide5.addText('Workflow & Architecture', {
  x: 0.5, y: 0.3, w: '90%', h: 0.5,
  fontSize: 30, bold: true, color: 'FFFFFF',
  fontFace: 'Arial',
});

const workflow = [
  { num: '1', title: 'User Profile', desc: 'Skills, Education, Goals' },
  { num: '2', title: 'Framework Select', desc: 'SFIA/NICE/Custom' },
  { num: '3', title: 'Gap Analysis', desc: 'AI-driven identification' },
  { num: '4', title: 'KNN Recommender', desc: 'Projects & Courses' },
  { num: '5', title: 'Roadmap', desc: '4-week learning path' },
];

workflow.forEach((w, i) => {
  const xPos = 0.25 + (i * 1.95);
  
  slide5.addShape(pptx.ShapeType.ellipse, { 
    x: xPos + 0.5, y: 1.35, w: 0.6, h: 0.6, 
    fill: { type: 'solid', color: colors.primary },
  });
  slide5.addText(w.num, {
    x: xPos + 0.5, y: 1.45, w: 0.6, h: 0.45,
    fontSize: 16, bold: true, color: 'FFFFFF',
    fontFace: 'Arial', align: 'center',
  });
  
  if (i < 4) {
    slide5.addText('→', {
      x: xPos + 1.3, y: 1.45, w: 0.4, h: 0.45,
      fontSize: 20, color: colors.primary,
      fontFace: 'Arial',
    });
  }
  
  slide5.addText(w.title, {
    x: xPos, y: 2.1, w: 1.75, h: 0.4,
    fontSize: 10, bold: true, color: colors.dark,
    fontFace: 'Arial', align: 'center',
  });
  slide5.addText(w.desc, {
    x: xPos, y: 2.45, w: 1.75, h: 0.45,
    fontSize: 9, color: '64748B',
    fontFace: 'Arial', align: 'center',
  });
});

slide5.addShape(pptx.ShapeType.rect, { 
  x: 0.4, y: 3.1, w: 9.2, h: 2.5, 
  fill: { type: 'solid', color: 'F0F9FF' },
  line: { color: colors.accent, pt: 1 }
});

slide5.addText('System Architecture', {
  x: 0.6, y: 3.2, w: 8.8, h: 0.35,
  fontSize: 12, bold: true, color: colors.accent,
  fontFace: 'Arial',
});

const archText = `┌─────────────┐    HTTP/JSON    ┌──────────────┐    Mongoose    ┌─────────────┐
│   React     │ ◄────────────► │  Express.js  │ ◄────────────► │  MongoDB    │
│  Frontend   │    REST API    │   Backend    │      ODM       │   Atlas     │
└─────────────┘                └──────────────┘                └─────────────┘
      │                              │
      │ Context API               JWT Auth + Middleware
      │ Axios Client              KNN Recommender Engine
      │ TailwindCSS               TF-IDF Course Matching`;

slide5.addText(archText, {
  x: 0.6, y: 3.55, w: 8.8, h: 2.0,
  fontSize: 9, color: colors.dark,
  fontFace: 'Consolas',
});

// ===== SLIDE 6: Tech Stack =====
let slide6 = pptx.addSlide();
slide6.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.1, fill: { type: 'solid', color: colors.dark } });
slide6.addText('Tech Stack', {
  x: 0.5, y: 0.3, w: '90%', h: 0.5,
  fontSize: 30, bold: true, color: 'FFFFFF',
  fontFace: 'Arial',
});

const techCategories = [
  { 
    title: 'Frontend', 
    color: '3B82F6',
    items: ['React 19', 'TailwindCSS', 'React Router v6', 'Context API', 'Axios', 'Recharts']
  },
  { 
    title: 'Backend', 
    color: '10B981',
    items: ['Node.js', 'Express.js', 'JWT Auth', 'bcryptjs', 'express-validator', 'CORS']
  },
  { 
    title: 'Database', 
    color: '8B5CF6',
    items: ['MongoDB Atlas', 'Mongoose ODM', 'Cloud Hosted', 'Indexing', 'Aggregation']
  },
  { 
    title: 'ML/Algorithms', 
    color: 'F59E0B',
    items: ['KNN Algorithm', 'Cosine Similarity', 'TF-IDF', 'Euclidean Distance', 'Hybrid Filtering']
  },
];

techCategories.forEach((cat, i) => {
  const xPos = 0.35 + (i * 2.45);
  
  slide6.addShape(pptx.ShapeType.rect, { 
    x: xPos, y: 1.3, w: 2.3, h: 4.2, 
    fill: { type: 'solid', color: 'FFFFFF' },
    line: { color: cat.color, pt: 2 },
  });
  slide6.addShape(pptx.ShapeType.rect, { 
    x: xPos, y: 1.3, w: 2.3, h: 0.55, 
    fill: { type: 'solid', color: cat.color },
  });
  slide6.addText(cat.title, {
    x: xPos, y: 1.4, w: 2.3, h: 0.4,
    fontSize: 13, bold: true, color: 'FFFFFF',
    fontFace: 'Arial', align: 'center',
  });
  
  cat.items.forEach((item, j) => {
    slide6.addText('• ' + item, {
      x: xPos + 0.1, y: 1.95 + (j * 0.5), w: 2.1, h: 0.4,
      fontSize: 10, color: colors.dark,
      fontFace: 'Arial',
    });
  });
});

// ===== SLIDE 7: Code Snippet - KNN Algorithm =====
let slide7 = pptx.addSlide();
slide7.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.1, fill: { type: 'solid', color: colors.primary } });
slide7.addText('Code Snippet: KNN Recommender', {
  x: 0.5, y: 0.3, w: '90%', h: 0.5,
  fontSize: 30, bold: true, color: 'FFFFFF',
  fontFace: 'Arial',
});

const knnCode = `// KNN Project Recommender - Core Algorithm
cosineSimilarity(vec1, vec2) {
  let dotProduct = 0, norm1 = 0, norm2 = 0;
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

recommend(userGapSkills, options = {}) {
  const userVector = this.createFeatureVector(userGapSkills, domain);
  
  const scoredProjects = filteredProjects.map(project => {
    const similarity = this.cosineSimilarity(userVector, projectVector);
    const gapCoverage = this.calculateGapCoverage(project, userGapSkills);
    
    // Weighted KNN Score
    const knnScore = 
      (0.30 * similarity) +
      (0.40 * gapCoverage) +
      (0.15 * difficultyScore) +
      (0.15 * domainBonus);
      
    return { ...project, knn_score: knnScore };
  });
  return scoredProjects.sort((a, b) => b.knn_score - a.knn_score).slice(0, k);
}`;

slide7.addShape(pptx.ShapeType.rect, { 
  x: 0.4, y: 1.25, w: 9.2, h: 4.4, 
  fill: { type: 'solid', color: '1E293B' },
});
slide7.addText(knnCode, {
  x: 0.55, y: 1.35, w: 9, h: 4.2,
  fontSize: 9, color: 'E0E7FF',
  fontFace: 'Consolas',
});

slide7.addText('Algorithm: K-Nearest Neighbors with Cosine Similarity | Weights: Gap Coverage (40%) > Similarity (30%) > Difficulty (15%) > Domain (15%)', {
  x: 0.4, y: 5.7, w: 9.2, h: 0.3,
  fontSize: 9, color: '64748B',
  fontFace: 'Arial',
});

// ===== SLIDE 8: Code Snippet - Hybrid Recommendation =====
let slide8 = pptx.addSlide();
slide8.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.1, fill: { type: 'solid', color: colors.secondary } });
slide8.addText('Code Snippet: Hybrid Course Recommender', {
  x: 0.5, y: 0.3, w: '90%', h: 0.5,
  fontSize: 30, bold: true, color: 'FFFFFF',
  fontFace: 'Arial',
});

const hybridCode = `// TF-IDF + Hybrid Content-Based Filtering
const calculateTFIDF = (skillsArray, allSkillsVocab) => {
  const vector = new Array(allSkillsVocab.length).fill(0);
  skillsArray.forEach(skill => {
    const tf = skillCounts[normalized] / skillsArray.length;
    const idf = Math.log((coursesData.length + 1) / (docsWithSkill + 1)) + 1;
    vector[index] = tf * idf;
  });
  return vector;
};

const calculateHybridScore = (course, missingSkills, userPreferences) => {
  const skillMatch = skillMatchScore(course.skills, missingSkills);
  const contentSimilarity = cosineSimilarity(courseVector, targetVector);
  
  const weights = {
    skillMatch: 0.35,      // Direct skill matching
    contentSimilarity: 0.25, // TF-IDF cosine similarity
    rating: 0.15,          // Course quality
    popularity: 0.10,      // User engagement
    difficulty: 0.15       // Level alignment
  };
  
  return Object.entries(weights)
    .reduce((score, [key, w]) => score + w * scores[key], 0);
};`;

slide8.addShape(pptx.ShapeType.rect, { 
  x: 0.4, y: 1.25, w: 9.2, h: 4.4, 
  fill: { type: 'solid', color: '1E293B' },
});
slide8.addText(hybridCode, {
  x: 0.55, y: 1.35, w: 9, h: 4.2,
  fontSize: 9, color: 'E0E7FF',
  fontFace: 'Consolas',
});

slide8.addText('Algorithm: Hybrid Content-Based Filtering | TF-IDF for semantic matching + Multi-factor weighted scoring', {
  x: 0.4, y: 5.7, w: 9.2, h: 0.3,
  fontSize: 9, color: '64748B',
  fontFace: 'Arial',
});

// ===== SLIDE 9: Key Features Demo =====
let slide9 = pptx.addSlide();
slide9.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.1, fill: { type: 'solid', color: colors.success } });
slide9.addText('Key Features', {
  x: 0.5, y: 0.3, w: '90%', h: 0.5,
  fontSize: 30, bold: true, color: 'FFFFFF',
  fontFace: 'Arial',
});

const features = [
  { title: 'Smart Profile', desc: 'Skills with proficiency levels, projects, education & career goals', icon: '👤' },
  { title: 'Gap Analysis', desc: 'AI-driven skill gap identification with priority ranking', icon: '📊' },
  { title: 'KNN Projects', desc: 'ML-based project recommendations with match scores', icon: '🎯' },
  { title: 'Course Finder', desc: 'TF-IDF powered course recommendations', icon: '📚' },
  { title: 'Learning Roadmap', desc: 'Personalized 4-week skill development plan', icon: '🗺️' },
  { title: 'Admin Dashboard', desc: 'Framework, category & course management', icon: '⚙️' },
];

features.forEach((f, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const xPos = 0.4 + (col * 3.2);
  const yPos = 1.3 + (row * 2.2);
  
  slide9.addShape(pptx.ShapeType.rect, { 
    x: xPos, y: yPos, w: 3, h: 2.0, 
    fill: { type: 'solid', color: 'FFFFFF' },
    line: { color: colors.success, pt: 2 },
  });
  slide9.addText(f.icon, {
    x: xPos, y: yPos + 0.2, w: 3, h: 0.5,
    fontSize: 24,
    fontFace: 'Arial', align: 'center',
  });
  slide9.addText(f.title, {
    x: xPos + 0.1, y: yPos + 0.75, w: 2.8, h: 0.35,
    fontSize: 12, bold: true, color: colors.dark,
    fontFace: 'Arial', align: 'center',
  });
  slide9.addText(f.desc, {
    x: xPos + 0.1, y: yPos + 1.15, w: 2.8, h: 0.7,
    fontSize: 10, color: '64748B',
    fontFace: 'Arial', align: 'center',
  });
});

// ===== SLIDE 10: Future Scope =====
let slide10 = pptx.addSlide();
slide10.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.1, fill: { type: 'solid', color: colors.warning } });
slide10.addText('Future Scope', {
  x: 0.5, y: 0.3, w: '90%', h: 0.5,
  fontSize: 30, bold: true, color: 'FFFFFF',
  fontFace: 'Arial',
});

slide10.addText('Short Term (3-6 months)', {
  x: 0.5, y: 1.25, w: 4.3, h: 0.35,
  fontSize: 14, bold: true, color: colors.primary,
  fontFace: 'Arial',
});

const shortTerm = [
  'AI-powered Resume Builder',
  'Interview Preparation Module',
  'LinkedIn Profile Integration',
  'Mobile App (React Native)',
];

shortTerm.forEach((item, i) => {
  slide10.addText('→ ' + item, {
    x: 0.5, y: 1.65 + (i * 0.4), w: 4.3, h: 0.35,
    fontSize: 11, color: colors.dark,
    fontFace: 'Arial',
  });
});

slide10.addText('Long Term (6-12 months)', {
  x: 5.2, y: 1.25, w: 4.3, h: 0.35,
  fontSize: 14, bold: true, color: colors.secondary,
  fontFace: 'Arial',
});

const longTerm = [
  'Industry Mentor Matching',
  'LMS Integration (Moodle, Canvas)',
  'Enterprise B2B Platform',
  'Advanced Analytics Dashboard',
];

longTerm.forEach((item, i) => {
  slide10.addText('→ ' + item, {
    x: 5.2, y: 1.65 + (i * 0.4), w: 4.3, h: 0.35,
    fontSize: 11, color: colors.dark,
    fontFace: 'Arial',
  });
});

slide10.addShape(pptx.ShapeType.rect, { 
  x: 0.4, y: 3.5, w: 9.2, h: 2.0, 
  fill: { type: 'solid', color: 'FEF3C7' },
  line: { color: colors.warning, pt: 1 }
});

slide10.addText('Business Model & Market', {
  x: 0.6, y: 3.6, w: 8.8, h: 0.35,
  fontSize: 13, bold: true, color: colors.dark,
  fontFace: 'Arial',
});
slide10.addText('B2B SaaS: University partnerships, Ed-tech platform integrations\nB2C Premium: Advanced features, 1-on-1 mentoring, certification prep\nTarget Market: 40M+ students in India pursuing tech careers in emerging sectors', {
  x: 0.6, y: 4.0, w: 8.8, h: 1.2,
  fontSize: 11, color: '92400E',
  fontFace: 'Arial',
});

// ===== SLIDE 11: Referenced Repositories =====
let slide11 = pptx.addSlide();
slide11.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 1.1, fill: { type: 'solid', color: colors.accent } });
slide11.addText('Referenced Repositories & Resources', {
  x: 0.5, y: 0.3, w: '90%', h: 0.5,
  fontSize: 30, bold: true, color: 'FFFFFF',
  fontFace: 'Arial',
});

const references = [
  { category: 'ML Algorithms', items: ['scikit-learn KNN documentation', 'TF-IDF implementation patterns', 'Cosine similarity for recommendation systems'] },
  { category: 'Frameworks', items: ['SFIA Framework (sfia-online.org)', 'NICE Framework (niccs.cisa.gov)', 'O*NET Skills Database'] },
  { category: 'Libraries', items: ['React.js Official Docs', 'Express.js Guide', 'Mongoose ODM', 'TailwindCSS', 'Recharts'] },
  { category: 'Inspiration', items: ['Coursera skill mapping', 'LinkedIn Learning paths', 'Pluralsight skill assessments'] },
];

references.forEach((ref, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const xPos = 0.4 + (col * 4.8);
  const yPos = 1.3 + (row * 2.3);
  
  slide11.addShape(pptx.ShapeType.rect, { 
    x: xPos, y: yPos, w: 4.5, h: 2.1, 
    fill: { type: 'solid', color: 'F0F9FF' },
    line: { color: colors.accent, pt: 1 },
  });
  slide11.addText(ref.category, {
    x: xPos + 0.15, y: yPos + 0.1, w: 4.2, h: 0.35,
    fontSize: 12, bold: true, color: colors.accent,
    fontFace: 'Arial',
  });
  
  ref.items.forEach((item, j) => {
    slide11.addText('• ' + item, {
      x: xPos + 0.15, y: yPos + 0.5 + (j * 0.45), w: 4.2, h: 0.4,
      fontSize: 10, color: colors.dark,
      fontFace: 'Arial',
    });
  });
});

// ===== SLIDE 12: Thank You =====
let slide12 = pptx.addSlide();
slide12.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { type: 'solid', color: colors.primary } });
slide12.addShape(pptx.ShapeType.rect, { x: 0, y: 3.6, w: '100%', h: 2.0, fill: { type: 'solid', color: colors.secondary } });

slide12.addText('Thank You!', {
  x: 0.5, y: 1.3, w: '90%', h: 0.8,
  fontSize: 48, bold: true, color: 'FFFFFF',
  fontFace: 'Arial', align: 'center',
});
slide12.addText('SkillSphere - Empowering Careers Through Intelligent Skill Mapping', {
  x: 0.5, y: 2.2, w: '90%', h: 0.5,
  fontSize: 18, color: 'E0E7FF',
  fontFace: 'Arial', align: 'center',
});

slide12.addText('Questions & Demo', {
  x: 0.5, y: 3.8, w: '90%', h: 0.5,
  fontSize: 24, bold: true, color: 'FFFFFF',
  fontFace: 'Arial', align: 'center',
});

slide12.addText('GitHub: github.com/AU_Hackathon_SkillSphere', {
  x: 0.5, y: 4.4, w: '90%', h: 0.35,
  fontSize: 14, color: 'C4B5FD',
  fontFace: 'Arial', align: 'center',
});
slide12.addText('Team SkillSphere | AU Hackathon 2026', {
  x: 0.5, y: 4.85, w: '90%', h: 0.35,
  fontSize: 12, color: 'E0E7FF',
  fontFace: 'Arial', align: 'center',
});

// Save the presentation
pptx.writeFile({ fileName: 'SkillSphere_Hackathon_Presentation.pptx' })
  .then(fileName => {
    console.log(`Presentation created: ${fileName}`);
  })
  .catch(err => {
    console.error('Error creating presentation:', err);
  });
