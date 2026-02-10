// load-simple.js - SIMPLE AND RELIABLE
console.log('load-simple.js loaded');

function loadComponent(elementId, file) {
    console.log(`Loading ${file} into #${elementId}`);
    
    return fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} loading ${file}`);
            }
            return response.text();
        })
        .then(html => {
            const container = document.getElementById(elementId);
            if (!container) {
                console.warn(`Container #${elementId} not found`);
                return;
            }
            
            container.innerHTML = html;
            console.log(`Successfully loaded ${file}`);
            
            // Execute scripts in the loaded HTML
            const scripts = container.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                newScript.textContent = oldScript.textContent;
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });
        })
        .catch(error => {
            console.error(`Error loading ${file}:`, error);
            
            // Show simple fallback
            const container = document.getElementById(elementId);
            if (container) {
                if (file.includes('header')) {
                    container.innerHTML = `
                        <div style="background: white; padding: 20px; text-align: center; border-bottom: 1px solid #ddd;">
                            <a href="index.html" style="font-size: 1.5rem; font-weight: bold; text-decoration: none; color: #333;">
                                BlackTech<span style="color: #007bff;">Capital</span>
                            </a>
                        </div>
                    `;
                } else if (file.includes('footer')) {
                    container.innerHTML = `
                        <div style="background: #1a1a1a; color: white; padding: 30px 20px; text-align: center; margin-top: 40px;">
                            <p>© ${new Date().getFullYear()} BlackTech Capital</p>
                            <p style="color: #aaa; font-size: 0.9rem; margin-top: 10px;">
                                Contact: bduarte@blacktechcapital.com
                            </p>
                        </div>
                    `;
                }
            }
        });
}

// Load components
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting component load...');
    
    // Load both components
    loadComponent('header-container', 'header.html');
    loadComponent('footer-container', 'footer.html');
});