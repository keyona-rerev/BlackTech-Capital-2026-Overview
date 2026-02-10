// load-components.js
class ComponentLoader {
    constructor() {
        this.components = {};
    }

    // Load a component and cache it
    async loadComponent(elementId, file) {
        try {
            // Check cache first
            if (this.components[file]) {
                this.insertComponent(elementId, this.components[file]);
                return;
            }

            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`Failed to load ${file}: ${response.status}`);
            }
            
            const html = await response.text();
            
            // Cache the component
            this.components[file] = html;
            
            // Insert the component
            this.insertComponent(elementId, html);
            
        } catch (error) {
            console.warn(`Could not load ${file}. Using fallback.`, error);
            this.showFallback(elementId, file);
        }
    }

    insertComponent(elementId, html) {
        const container = document.getElementById(elementId);
        if (!container) return;

        container.innerHTML = html;
        
        // Re-execute scripts in the loaded HTML
        container.querySelectorAll('script').forEach(oldScript => {
            const newScript = document.createElement('script');
            
            // Copy all attributes
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            
            // Copy text content
            newScript.textContent = oldScript.textContent;
            
            // Replace the old script
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
        
        // Update active link based on current page
        this.updateActiveLinks();
    }

    showFallback(elementId, file) {
        const container = document.getElementById(elementId);
        if (!container) return;

        if (file.includes('header')) {
            container.innerHTML = `
                <div style="padding: 20px; text-align: center; background: #f5f5f5;">
                    <p>Navigation could not be loaded. <a href="index.html">Go to Home</a></p>
                </div>
            `;
        } else if (file.includes('footer')) {
            container.innerHTML = `
                <footer style="background: #1a1a1a; color: white; padding: 20px; text-align: center;">
                    <p>© ${new Date().getFullYear()} BlackTech Capital</p>
                </footer>
            `;
        }
    }

    updateActiveLinks() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Update header active links
        document.querySelectorAll('.nav-links a').forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update footer active links
        document.querySelectorAll('.footer-links a').forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Load all components
    async loadAll() {
        await Promise.all([
            this.loadComponent('header-container', 'header.html'),
            this.loadComponent('footer-container', 'footer.html')
        ]);
    }
}

// Initialize and load components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    // Only load components if placeholders exist
    if (document.getElementById('header-container') || document.getElementById('footer-container')) {
        const loader = new ComponentLoader();
        await loader.loadAll();
    }
});