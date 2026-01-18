const puppeteer = require('puppeteer');
const fs = require('fs');

const architectureHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: white; padding: 30px; }
        .title { text-align: center; font-size: 28px; font-weight: bold; color: #1a1a2e; margin-bottom: 30px; }
        .container { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-bottom: 40px; }
        .box { padding: 20px; border-radius: 10px; min-width: 280px; }
        .box h3 { font-size: 16px; margin-bottom: 5px; }
        .box h4 { font-size: 13px; color: #666; margin-bottom: 15px; }
        .box ul { list-style: none; font-size: 13px; }
        .box li { margin: 8px 0; padding-left: 15px; position: relative; }
        .box li:before { content: "•"; position: absolute; left: 0; }
        .client { background: #e8f4fd; border: 3px solid #3498db; }
        .client h3 { color: #3498db; }
        .server { background: #fdf2e8; border: 3px solid #e67e22; }
        .server h3 { color: #e67e22; }
        .data { background: #e8fdf0; border: 3px solid #27ae60; }
        .data h3 { color: #27ae60; }
        .ml { background: #fde8f4; border: 3px solid #9b59b6; }
        .ml h3 { color: #9b59b6; }
        .flow-title { text-align: center; font-size: 20px; font-weight: bold; color: #1a1a2e; margin: 30px 0 20px; }
        .flow { display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 40px; }
        .flow-item { width: 90px; height: 90px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px; text-align: center; }
        .arrow { font-size: 24px; color: #888; }
        .tech-title { text-align: center; font-size: 18px; font-weight: bold; color: #2c3e50; margin-bottom: 15px; }
        .tech { display: flex; justify-content: center; gap: 15px; flex-wrap: wrap; }
        .tech-item { padding: 12px 25px; color: white; font-weight: bold; border-radius: 5px; font-size: 14px; }
        .footer { text-align: center; color: #888; font-size: 11px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="title">SkillSphere - Final System Architecture</div>
    <div class="container">
        <div class="box client">
            <h3>CLIENT SIDE</h3>
            <h4>React Frontend</h4>
            <ul>
                <li>User Interface (React)</li>
                <li>AuthContext (State)</li>
                <li>Axios (API Client)</li>
                <li>Tailwind CSS</li>
            </ul>
        </div>
        <div class="box server">
            <h3>SERVER SIDE</h3>
            <h4>Node.js/Express</h4>
            <ul>
                <li>server.js (Entry)</li>
                <li>Auth Routes</li>
                <li>Admin Routes</li>
                <li>Student Routes</li>
                <li>JWT Middleware</li>
            </ul>
        </div>
        <div class="box data">
            <h3>DATA LAYER</h3>
            <h4>MongoDB Atlas</h4>
            <ul>
                <li>Users Collection</li>
                <li>Student Profiles</li>
                <li>Courses/Resources</li>
                <li>Activity Logs</li>
            </ul>
        </div>
        <div class="box ml">
            <h3>ML ENGINE</h3>
            <h4>Custom KNN</h4>
            <ul>
                <li>Feature Vectorization</li>
                <li>Cosine Similarity</li>
                <li>Euclidean Distance</li>
                <li>Weighted Scoring</li>
            </ul>
        </div>
    </div>
    <div class="flow-title">Data Flow Architecture</div>
    <div class="flow">
        <div class="flow-item" style="background:#3498db">User</div>
        <div class="arrow">→</div>
        <div class="flow-item" style="background:#3498db">React UI</div>
        <div class="arrow">→</div>
        <div class="flow-item" style="background:#e67e22">Express API</div>
        <div class="arrow">→</div>
        <div class="flow-item" style="background:#27ae60">MongoDB</div>
        <div class="arrow">→</div>
        <div class="flow-item" style="background:#9b59b6">KNN Engine</div>
        <div class="arrow">→</div>
        <div class="flow-item" style="background:#e74c3c">Response</div>
    </div>
    <div class="tech-title">Key Technologies</div>
    <div class="tech">
        <div class="tech-item" style="background:#61dafb;color:#000">React</div>
        <div class="tech-item" style="background:#68a063">Node.js</div>
        <div class="tech-item" style="background:#333">Express</div>
        <div class="tech-item" style="background:#4db33d">MongoDB</div>
        <div class="tech-item" style="background:#d63aff">JWT Auth</div>
        <div class="tech-item" style="background:#ff6b6b">KNN ML</div>
    </div>
    <div class="footer">SkillSphere - AU Hackathon 2026</div>
</body>
</html>
`;

const pocHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: white; padding: 20px; }
        .title { text-align: center; font-size: 26px; font-weight: bold; color: #1a1a2e; margin-bottom: 25px; }
        .diagram { position: relative; width: 100%; }
        .actors { display: flex; justify-content: space-around; margin-bottom: 20px; }
        .actor { text-align: center; }
        .actor-box { background: #3498db; color: white; padding: 10px 20px; border-radius: 5px; font-weight: bold; font-size: 13px; }
        .actor-line { width: 2px; height: 580px; background: #3498db; margin: 0 auto; }
        .steps { position: absolute; top: 70px; left: 0; right: 0; }
        .step { display: flex; align-items: center; margin: 8px 0; font-size: 11px; height: 35px; }
        .step-label { position: absolute; font-weight: bold; white-space: nowrap; }
        .step-arrow { height: 2px; position: absolute; }
        .step-arrow.dashed { border-top: 2px dashed; background: none !important; }
        .legend { margin-top: 20px; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
        .legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; }
        .legend-color { width: 20px; height: 3px; }
        .footer { text-align: center; color: #888; font-size: 11px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="title">SkillSphere - Proof of Concept (POC) Flow</div>
    <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <tr style="background:#3498db;color:white;">
            <th style="padding:10px;width:5%">#</th>
            <th style="padding:10px;width:15%">From</th>
            <th style="padding:10px;width:15%">To</th>
            <th style="padding:10px;width:35%">Action</th>
            <th style="padding:10px;width:30%">Description</th>
        </tr>
        <tr style="background:#f8f9fa"><td style="padding:8px;text-align:center">1</td><td>Student</td><td>Frontend</td><td style="color:#27ae60;font-weight:bold">Register/Login</td><td>User initiates session</td></tr>
        <tr><td style="padding:8px;text-align:center">2</td><td>Frontend</td><td>Backend</td><td style="color:#3498db;font-weight:bold">POST /api/auth/login</td><td>Send credentials</td></tr>
        <tr style="background:#f8f9fa"><td style="padding:8px;text-align:center">3</td><td>Backend</td><td>MongoDB</td><td style="color:#9b59b6;font-weight:bold">Verify Credentials</td><td>Check user exists</td></tr>
        <tr><td style="padding:8px;text-align:center">4</td><td>MongoDB</td><td>Backend</td><td style="color:#9b59b6;font-weight:bold">User Data ←</td><td>Return user record</td></tr>
        <tr style="background:#f8f9fa"><td style="padding:8px;text-align:center">5</td><td>Backend</td><td>Frontend</td><td style="color:#3498db;font-weight:bold">JWT Token ←</td><td>Authentication token</td></tr>
        <tr><td style="padding:8px;text-align:center">6</td><td>Student</td><td>Frontend</td><td style="color:#27ae60;font-weight:bold">Complete Profile</td><td>Enter skills & interests</td></tr>
        <tr style="background:#f8f9fa"><td style="padding:8px;text-align:center">7</td><td>Frontend</td><td>Backend</td><td style="color:#3498db;font-weight:bold">POST /api/students/profile</td><td>Submit profile data</td></tr>
        <tr><td style="padding:8px;text-align:center">8</td><td>Backend</td><td>MongoDB</td><td style="color:#9b59b6;font-weight:bold">Save Profile</td><td>Persist to database</td></tr>
        <tr style="background:#e8f4fd"><td style="padding:8px;text-align:center">9</td><td>Student</td><td>Frontend</td><td style="color:#e67e22;font-weight:bold">Request Recommendations</td><td>Click "Get Recommendations"</td></tr>
        <tr style="background:#fff3e6"><td style="padding:8px;text-align:center">10</td><td>Frontend</td><td>Backend</td><td style="color:#3498db;font-weight:bold">GET /api/recommendations</td><td>API call for results</td></tr>
        <tr style="background:#fde8f4"><td style="padding:8px;text-align:center">11</td><td>Backend</td><td>KNN Engine</td><td style="color:#e74c3c;font-weight:bold">Run KNN Algorithm</td><td>ML processing starts</td></tr>
        <tr style="background:#fde8f4"><td style="padding:8px;text-align:center">12</td><td>KNN Engine</td><td>MongoDB</td><td style="color:#9b59b6;font-weight:bold">Fetch Course Data</td><td>Get all courses</td></tr>
        <tr style="background:#fde8f4"><td style="padding:8px;text-align:center">13</td><td>KNN Engine</td><td>Backend</td><td style="color:#e74c3c;font-weight:bold">Top N Results ←</td><td>Ranked recommendations</td></tr>
        <tr style="background:#e8fdf0"><td style="padding:8px;text-align:center">14</td><td>Backend</td><td>Frontend</td><td style="color:#3498db;font-weight:bold">JSON Response ←</td><td>Final response to user</td></tr>
    </table>
    <div class="legend">
        <div class="legend-item"><div class="legend-color" style="background:#27ae60"></div>User Action</div>
        <div class="legend-item"><div class="legend-color" style="background:#3498db"></div>API Call</div>
        <div class="legend-item"><div class="legend-color" style="background:#9b59b6"></div>Database</div>
        <div class="legend-item"><div class="legend-color" style="background:#e74c3c"></div>ML Processing</div>
    </div>
    <div style="margin-top:25px;padding:15px;background:#f8f9fa;border-radius:8px;">
        <div style="font-weight:bold;margin-bottom:10px;color:#1a1a2e;">POC Highlights:</div>
        <div style="display:flex;gap:20px;flex-wrap:wrap;font-size:12px;">
            <div style="flex:1;min-width:200px;padding:10px;background:#e8f4fd;border-radius:5px;"><b>Custom ML</b><br/>Pure JS KNN with Cosine & Euclidean similarity</div>
            <div style="flex:1;min-width:200px;padding:10px;background:#e8fdf0;border-radius:5px;"><b>Personalization</b><br/>Skill gap analysis + interest matching</div>
            <div style="flex:1;min-width:200px;padding:10px;background:#fdf2e8;border-radius:5px;"><b>Full Stack</b><br/>MERN + JWT secured authentication</div>
            <div style="flex:1;min-width:200px;padding:10px;background:#fde8f4;border-radius:5px;"><b>Admin Panel</b><br/>Dynamic CSV data management</div>
        </div>
    </div>
    <div class="footer">SkillSphere POC - AU Hackathon 2026</div>
</body>
</html>
`;

async function generateImages() {
    const browser = await puppeteer.launch({ 
        headless: 'new',
        channel: 'chrome'
    });
    
    const archPage = await browser.newPage();
    await archPage.setViewport({ width: 1400, height: 800 });
    await archPage.setContent(architectureHTML);
    await archPage.screenshot({ path: 'SYSTEM_ARCHITECTURE.png', type: 'png' });
    console.log('Created: SYSTEM_ARCHITECTURE.png');

    const pocPage = await browser.newPage();
    await pocPage.setViewport({ width: 1200, height: 900 });
    await pocPage.setContent(pocHTML);
    await pocPage.screenshot({ path: 'POC_FLOW.png', type: 'png' });
    console.log('Created: POC_FLOW.png');

    await browser.close();
    console.log('Done! Both images generated.');
}

generateImages().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
