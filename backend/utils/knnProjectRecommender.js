const fs = require('fs');
const path = require('path');

class KNNProjectRecommender {
  constructor() {
    this.projects = [];
    this.skillVocabulary = [];
    this.domainMapping = {};
    this.loadProjectsData();
  }

  loadProjectsData() {
    try {
      const dataPath = path.join(__dirname, '../data/projects.json');
      const rawData = fs.readFileSync(dataPath, 'utf-8');
      const data = JSON.parse(rawData);
      
      this.projects = data.projects;
      this.skillVocabulary = data.skill_vocabulary.map(s => this.normalizeSkill(s));
      this.domainMapping = data.domain_mapping;
      
      console.log(`KNN Recommender loaded ${this.projects.length} projects`);
    } catch (error) {
      console.error('Error loading projects data:', error);
      this.projects = [];
    }
  }

  normalizeSkill(skill) {
    return skill
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s\-]/g, '')
      .replace(/\s+/g, ' ');
  }

  createFeatureVector(skills, domain = null, currentSkillLevels = {}) {
    const vector = [];
    
    const normalizedSkills = skills.map(s => this.normalizeSkill(s));
    
    this.skillVocabulary.forEach(vocabSkill => {
      let value = 0;
      
      if (normalizedSkills.some(s => s.includes(vocabSkill) || vocabSkill.includes(s))) {
        value = 1;
      }
      
      normalizedSkills.forEach(skill => {
        if (skill === vocabSkill) {
          value = 1;
        } else if (skill.includes(vocabSkill) || vocabSkill.includes(skill)) {
          value = Math.max(value, 0.7);
        } else if (this.getSkillSimilarity(skill, vocabSkill) > 0.5) {
          value = Math.max(value, 0.5);
        }
      });
      
      vector.push(value);
    });
    
    const domains = Object.keys(this.domainMapping);
    domains.forEach(d => {
      vector.push(domain && d === domain ? 1 : 0);
    });
    
    return vector;
  }

  getSkillSimilarity(skill1, skill2) {
    const s1 = skill1.split(' ');
    const s2 = skill2.split(' ');
    
    let matches = 0;
    s1.forEach(word => {
      if (s2.some(w => w === word || w.includes(word) || word.includes(w))) {
        matches++;
      }
    });
    
    return matches / Math.max(s1.length, s2.length);
  }

  createProjectVector(project) {
    return this.createFeatureVector(project.skills_taught, project.domain);
  }

  euclideanDistance(vec1, vec2) {
    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
      sum += Math.pow(vec1[i] - vec2[i], 2);
    }
    return Math.sqrt(sum);
  }

  cosineSimilarity(vec1, vec2) {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }
    
    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  calculateGapCoverage(project, gapSkills) {
    const normalizedGapSkills = gapSkills.map(s => this.normalizeSkill(s));
    const projectSkills = project.skills_taught.map(s => this.normalizeSkill(s));
    
    let covered = 0;
    const matchedSkills = [];
    
    normalizedGapSkills.forEach(gap => {
      const match = projectSkills.find(ps => 
        ps === gap || 
        ps.includes(gap) || 
        gap.includes(ps) ||
        this.getSkillSimilarity(ps, gap) > 0.5
      );
      
      if (match) {
        covered++;
        matchedSkills.push(project.skills_taught[projectSkills.indexOf(match)] || gap);
      }
    });
    
    return {
      coverage: gapSkills.length > 0 ? covered / gapSkills.length : 0,
      count: covered,
      matchedSkills
    };
  }

  getDifficultyScore(projectDifficulty, userLevel = 'intermediate') {
    const difficultyMap = {
      beginner: 1,
      intermediate: 2,
      advanced: 3
    };
    
    const projectLevel = difficultyMap[projectDifficulty] || 2;
    const userLevelNum = difficultyMap[userLevel] || 2;
    
    const diff = Math.abs(projectLevel - userLevelNum);
    
    if (diff === 0) return 1.0;
    if (diff === 1) return 0.7;
    return 0.4;
  }

  getDomainBonus(projectDomain, targetDomain) {
    if (!targetDomain) return 1.0;
    
    if (projectDomain === targetDomain) return 1.5;
    
    const domainKeywords = this.domainMapping[targetDomain] || [];
    if (domainKeywords.some(kw => projectDomain.includes(kw))) {
      return 1.3;
    }
    
    return 1.0;
  }

  recommend(userGapSkills, options = {}) {
    const {
      domain = null,
      difficulty = 'intermediate',
      k = 5,
      currentSkills = []
    } = options;

    if (!userGapSkills || userGapSkills.length === 0) {
      return {
        recommendations: [],
        algorithm: 'knn',
        message: 'No skill gaps provided'
      };
    }

    const userVector = this.createFeatureVector(userGapSkills, domain);
    
    let filteredProjects = [...this.projects];
    
    if (domain) {
      filteredProjects = filteredProjects.filter(p => {
        if (p.domain === domain) return true;
        const domainKeywords = this.domainMapping[domain] || [];
        return domainKeywords.some(kw => p.domain.includes(kw));
      });
      
      if (filteredProjects.length < k) {
        filteredProjects = [...this.projects];
      }
    }

    const scoredProjects = filteredProjects.map(project => {
      const projectVector = this.createProjectVector(project);
      
      const distance = this.euclideanDistance(userVector, projectVector);
      const similarity = this.cosineSimilarity(userVector, projectVector);
      
      const gapAnalysis = this.calculateGapCoverage(project, userGapSkills);
      
      const difficultyScore = this.getDifficultyScore(project.difficulty, difficulty);
      
      const domainBonus = this.getDomainBonus(project.domain, domain);
      
      const weights = {
        similarity: 0.30,
        gapCoverage: 0.40,
        difficulty: 0.15,
        domain: 0.15
      };
      
      const knnScore = 
        (weights.similarity * similarity) +
        (weights.gapCoverage * gapAnalysis.coverage) +
        (weights.difficulty * difficultyScore) +
        (weights.domain * (domainBonus - 1));
      
      return {
        ...project,
        knn_score: knnScore,
        match_percentage: Math.round(knnScore * 100),
        distance: distance.toFixed(3),
        similarity: (similarity * 100).toFixed(1),
        gaps_addressed: gapAnalysis.matchedSkills,
        gap_coverage: Math.round(gapAnalysis.coverage * 100),
        difficulty_match: Math.round(difficultyScore * 100),
        score_breakdown: {
          similarity: (similarity * 100).toFixed(1),
          gap_coverage: (gapAnalysis.coverage * 100).toFixed(1),
          difficulty_match: (difficultyScore * 100).toFixed(1),
          domain_bonus: ((domainBonus - 1) * 100).toFixed(1)
        },
        why_recommended: this.generateRecommendationReason(project, gapAnalysis, domain)
      };
    });

    const recommendations = scoredProjects
      .sort((a, b) => b.knn_score - a.knn_score)
      .slice(0, k);

    return {
      recommendations,
      total_projects: this.projects.length,
      filtered_count: filteredProjects.length,
      user_gaps: userGapSkills,
      algorithm: 'k-nearest-neighbors',
      k_value: k,
      model_info: {
        feature_dimensions: userVector.length,
        skill_vocabulary_size: this.skillVocabulary.length,
        distance_metric: 'euclidean',
        similarity_metric: 'cosine',
        weights: {
          similarity: '30%',
          gap_coverage: '40%',
          difficulty_match: '15%',
          domain_relevance: '15%'
        }
      }
    };
  }

  generateRecommendationReason(project, gapAnalysis, targetDomain) {
    const reasons = [];
    
    if (gapAnalysis.count > 0) {
      reasons.push(`Covers ${gapAnalysis.count} of your skill gaps`);
    }
    
    if (targetDomain && project.domain === targetDomain) {
      reasons.push(`Directly relevant to ${targetDomain.replace(/-/g, ' ')}`);
    }
    
    if (project.difficulty === 'beginner') {
      reasons.push('Great starting point');
    } else if (project.difficulty === 'advanced') {
      reasons.push('Advanced project for deeper learning');
    }
    
    if (reasons.length === 0) {
      reasons.push('Good match for your skill development');
    }
    
    return reasons.join(' | ');
  }

  getProjectById(id) {
    return this.projects.find(p => p.id === id);
  }

  getProjectsByDomain(domain) {
    return this.projects.filter(p => p.domain === domain);
  }

  getAllDomains() {
    return [...new Set(this.projects.map(p => p.domain))];
  }

  getStats() {
    const domains = this.getAllDomains();
    const difficulties = [...new Set(this.projects.map(p => p.difficulty))];
    
    return {
      total_projects: this.projects.length,
      domains: domains.map(d => ({
        name: d,
        count: this.projects.filter(p => p.domain === d).length
      })),
      difficulties: difficulties.map(d => ({
        level: d,
        count: this.projects.filter(p => p.difficulty === d).length
      })),
      skill_vocabulary_size: this.skillVocabulary.length
    };
  }
}

const recommender = new KNNProjectRecommender();

module.exports = recommender;
