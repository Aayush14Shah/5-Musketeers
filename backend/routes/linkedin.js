const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');

const skillKeywords = {
  healthcare: [
    'healthcare', 'medical', 'clinical', 'patient', 'ehr', 'hl7', 'fhir', 'hipaa',
    'telemedicine', 'health informatics', 'nursing', 'pharmacy', 'diagnosis',
    'epidemiology', 'biostatistics', 'public health', 'medical imaging',
    'electronic health records', 'healthcare analytics', 'clinical research'
  ],
  agriculture: [
    'agriculture', 'farming', 'crop', 'soil', 'irrigation', 'agtech', 'precision farming',
    'agronomy', 'livestock', 'sustainable agriculture', 'food science', 'biotechnology',
    'gis', 'remote sensing', 'drone', 'iot', 'smart farming', 'hydroponics',
    'agricultural data', 'farm management', 'supply chain'
  ],
  urban: [
    'urban', 'smart city', 'city planning', 'infrastructure', 'transportation',
    'traffic', 'urban analytics', 'gis', 'mapping', 'sustainability', 'energy',
    'waste management', 'water management', 'urban mobility', 'public transit',
    'building automation', 'iot', 'sensor networks', 'civic tech'
  ],
  technology: [
    'python', 'javascript', 'java', 'sql', 'react', 'node', 'machine learning',
    'data analysis', 'aws', 'azure', 'cloud', 'docker', 'kubernetes', 'api',
    'database', 'mongodb', 'postgresql', 'git', 'agile', 'scrum', 'devops',
    'artificial intelligence', 'deep learning', 'data science', 'analytics'
  ]
};

const extractSkillsFromText = (text) => {
  if (!text) return [];
  
  const textLower = text.toLowerCase();
  const extractedSkills = new Set();
  
  Object.values(skillKeywords).flat().forEach(keyword => {
    if (textLower.includes(keyword.toLowerCase())) {
      const formattedSkill = keyword
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      extractedSkills.add(formattedSkill);
    }
  });
  
  return Array.from(extractedSkills);
};

const determineDomain = (skills, experience, education) => {
  const allText = [
    ...skills,
    ...experience.map(e => `${e.title} ${e.company} ${e.description || ''}`),
    ...education.map(e => `${e.degree} ${e.field} ${e.school}`)
  ].join(' ').toLowerCase();
  
  const domainScores = {
    healthcare: 0,
    agriculture: 0,
    urban: 0
  };
  
  skillKeywords.healthcare.forEach(kw => {
    if (allText.includes(kw)) domainScores.healthcare += 1;
  });
  
  skillKeywords.agriculture.forEach(kw => {
    if (allText.includes(kw)) domainScores.agriculture += 1;
  });
  
  skillKeywords.urban.forEach(kw => {
    if (allText.includes(kw)) domainScores.urban += 1;
  });
  
  const maxScore = Math.max(...Object.values(domainScores));
  if (maxScore === 0) return null;
  
  return Object.entries(domainScores).find(([_, score]) => score === maxScore)?.[0] || null;
};

const determineSkillLevel = (skillName, yearsExperience, endorsements = 0) => {
  if (endorsements > 50 || yearsExperience > 5) return 'expert';
  if (endorsements > 20 || yearsExperience > 3) return 'advanced';
  if (endorsements > 5 || yearsExperience > 1) return 'intermediate';
  return 'beginner';
};

router.post('/parse-json', protect, async (req, res) => {
  try {
    const { linkedinData } = req.body;
    
    if (!linkedinData) {
      return res.status(400).json({ message: 'LinkedIn data is required' });
    }
    
    let parsedData;
    try {
      parsedData = typeof linkedinData === 'string' ? JSON.parse(linkedinData) : linkedinData;
    } catch (e) {
      return res.status(400).json({ message: 'Invalid JSON format' });
    }
    
    const skills = [];
    const experience = [];
    const education = [];
    const certifications = [];
    
    if (parsedData.skills || parsedData.Skills) {
      const skillsData = parsedData.skills || parsedData.Skills || [];
      skillsData.forEach(skill => {
        const skillName = typeof skill === 'string' ? skill : (skill.name || skill.Name || skill.skill);
        if (skillName) {
          skills.push({
            name: skillName,
            level: determineSkillLevel(skillName, 0, skill.endorsements || 0),
            endorsements: skill.endorsements || 0
          });
        }
      });
    }
    
    if (parsedData.positions || parsedData.experience || parsedData.Experience) {
      const expData = parsedData.positions || parsedData.experience || parsedData.Experience || [];
      expData.forEach(exp => {
        experience.push({
          title: exp.title || exp.Title || exp['Job Title'] || '',
          company: exp.company || exp.Company || exp['Company Name'] || '',
          location: exp.location || exp.Location || '',
          startDate: exp.startDate || exp['Start Date'] || exp.start_date || '',
          endDate: exp.endDate || exp['End Date'] || exp.end_date || '',
          description: exp.description || exp.Description || ''
        });
      });
    }
    
    if (parsedData.education || parsedData.Education) {
      const eduData = parsedData.education || parsedData.Education || [];
      eduData.forEach(edu => {
        education.push({
          school: edu.school || edu.School || edu['School Name'] || edu.institution || '',
          degree: edu.degree || edu.Degree || edu['Degree Name'] || '',
          field: edu.field || edu.Field || edu['Field of Study'] || edu.fieldOfStudy || '',
          startDate: edu.startDate || edu['Start Date'] || '',
          endDate: edu.endDate || edu['End Date'] || ''
        });
      });
    }
    
    if (parsedData.certifications || parsedData.Certifications) {
      const certData = parsedData.certifications || parsedData.Certifications || [];
      certData.forEach(cert => {
        certifications.push({
          name: cert.name || cert.Name || cert['Certification Name'] || '',
          authority: cert.authority || cert.Authority || cert['Issuing Organization'] || '',
          date: cert.date || cert.Date || cert['Issue Date'] || ''
        });
      });
    }
    
    const allTextForSkills = [
      ...experience.map(e => e.description),
      ...education.map(e => `${e.degree} ${e.field}`),
      ...certifications.map(c => c.name)
    ].join(' ');
    
    const additionalSkills = extractSkillsFromText(allTextForSkills);
    additionalSkills.forEach(skillName => {
      if (!skills.find(s => s.name.toLowerCase() === skillName.toLowerCase())) {
        skills.push({
          name: skillName,
          level: 'intermediate',
          endorsements: 0,
          extracted: true
        });
      }
    });
    
    const suggestedDomain = determineDomain(
      skills.map(s => s.name),
      experience,
      education
    );
    
    res.json({
      success: true,
      profile: {
        name: parsedData.name || parsedData.firstName + ' ' + parsedData.lastName || '',
        headline: parsedData.headline || parsedData.Headline || '',
        location: parsedData.location || parsedData.Location || '',
        summary: parsedData.summary || parsedData.Summary || parsedData.about || ''
      },
      skills,
      experience,
      education,
      certifications,
      suggestedDomain,
      totalExtracted: {
        skills: skills.length,
        experience: experience.length,
        education: education.length,
        certifications: certifications.length
      }
    });
  } catch (error) {
    console.error('Error parsing LinkedIn data:', error);
    res.status(500).json({ message: 'Error parsing LinkedIn data', error: error.message });
  }
});

router.post('/parse-url', protect, async (req, res) => {
  try {
    const { linkedinUrl } = req.body;
    
    if (!linkedinUrl) {
      return res.status(400).json({ message: 'LinkedIn URL is required' });
    }
    
    const urlPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
    if (!urlPattern.test(linkedinUrl)) {
      return res.status(400).json({ message: 'Invalid LinkedIn profile URL format' });
    }
    
    res.json({
      success: true,
      message: 'LinkedIn URL validated. Due to API restrictions, please use the JSON export method for full data import.',
      urlValid: true,
      suggestion: 'Download your LinkedIn data from Settings > Data Privacy > Get a copy of your data'
    });
  } catch (error) {
    console.error('Error parsing LinkedIn URL:', error);
    res.status(500).json({ message: 'Error processing LinkedIn URL', error: error.message });
  }
});

router.post('/import', protect, async (req, res) => {
  try {
    const { skills, experience, education, certifications, suggestedDomain } = req.body;
    
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills array is required' });
    }
    
    const formattedSkills = skills.map(skill => ({
      name: skill.name,
      level: skill.level || 'intermediate',
      source: 'linkedin'
    }));
    
    let studentProfile = await StudentProfile.findOne({ userId: req.user._id });
    
    if (!studentProfile) {
      studentProfile = await StudentProfile.create({
        userId: req.user._id,
        skills: formattedSkills,
        linkedinImport: {
          importedAt: new Date(),
          experience: experience || [],
          education: education || [],
          certifications: certifications || []
        }
      });
    } else {
      const existingSkillNames = studentProfile.skills.map(s => s.name.toLowerCase());
      const newSkills = formattedSkills.filter(
        s => !existingSkillNames.includes(s.name.toLowerCase())
      );
      
      studentProfile.skills = [...studentProfile.skills, ...newSkills];
      studentProfile.linkedinImport = {
        importedAt: new Date(),
        experience: experience || [],
        education: education || [],
        certifications: certifications || []
      };
      
      await studentProfile.save();
    }
    
    if (suggestedDomain) {
      const user = await User.findById(req.user._id);
      if (!user.domainInterest) {
        user.domainInterest = suggestedDomain;
        await user.save();
      }
    }
    
    res.json({
      success: true,
      message: 'LinkedIn data imported successfully',
      imported: {
        skills: formattedSkills.length,
        experience: experience?.length || 0,
        education: education?.length || 0,
        certifications: certifications?.length || 0
      },
      totalSkills: studentProfile.skills.length
    });
  } catch (error) {
    console.error('Error importing LinkedIn data:', error);
    res.status(500).json({ message: 'Error importing LinkedIn data', error: error.message });
  }
});

router.get('/sample-data', protect, (req, res) => {
  const sampleLinkedInExport = {
    "name": "John Doe",
    "headline": "Healthcare Data Analyst | Python | SQL",
    "location": "San Francisco, CA",
    "summary": "Experienced data analyst specializing in healthcare informatics and clinical data systems.",
    "skills": [
      { "name": "Python", "endorsements": 45 },
      { "name": "SQL", "endorsements": 38 },
      { "name": "Healthcare Analytics", "endorsements": 22 },
      { "name": "Data Visualization", "endorsements": 15 },
      { "name": "Machine Learning", "endorsements": 12 },
      { "name": "Tableau", "endorsements": 18 },
      { "name": "EHR Systems", "endorsements": 8 },
      { "name": "HIPAA Compliance", "endorsements": 5 }
    ],
    "experience": [
      {
        "title": "Senior Data Analyst",
        "company": "HealthTech Solutions",
        "location": "San Francisco, CA",
        "startDate": "2021-01",
        "endDate": "Present",
        "description": "Lead data analysis for clinical decision support systems. Implemented ML models for patient outcome prediction."
      },
      {
        "title": "Data Analyst",
        "company": "City Hospital Network",
        "location": "Oakland, CA",
        "startDate": "2018-06",
        "endDate": "2020-12",
        "description": "Analyzed EHR data to improve patient care workflows. Created dashboards for hospital performance metrics."
      }
    ],
    "education": [
      {
        "school": "University of California, Berkeley",
        "degree": "Master of Science",
        "field": "Health Informatics",
        "startDate": "2016",
        "endDate": "2018"
      },
      {
        "school": "UCLA",
        "degree": "Bachelor of Science",
        "field": "Computer Science",
        "startDate": "2012",
        "endDate": "2016"
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Data Analytics",
        "authority": "Amazon Web Services",
        "date": "2022-03"
      },
      {
        "name": "Healthcare Data Analyst Certificate",
        "authority": "AHIMA",
        "date": "2021-08"
      }
    ]
  };
  
  res.json({
    sampleData: sampleLinkedInExport,
    instructions: {
      step1: "Copy the sample JSON data above or use your own LinkedIn export",
      step2: "Paste it in the import form",
      step3: "Review extracted skills and experience",
      step4: "Click Import to add to your profile"
    }
  });
});

module.exports = router;
