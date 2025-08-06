/**
 * PWA Installer Module
 * Handles PWA installation prompt for Smart Logger
 * Works with both v1 (logger.html) and v2 (index.html)
 */

class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.installButton = null;
        this.init();
    }

    init() {
        // Check if already installed
        this.checkInstallationStatus();
        
        // Create install button
        this.createInstallButton();
        
        // Listen for PWA install prompt
        this.setupInstallPromptListener();
        
        // Listen for app installed event
        this.setupInstalledListener();
        
        // Check for updates
        this.checkForUpdates();
    }

    checkInstallationStatus() {
        // Check if running as installed PWA
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            console.log('📱 App is running as installed PWA');
        }
        
        // Check if installed via navigator
        if (navigator.standalone === true) {
            this.isInstalled = true;
            console.log('📱 App is running as installed (iOS)');
        }
        
        // Additional check for Chrome/Edge
        if (window.navigator && window.navigator.getInstalledRelatedApps) {
            window.navigator.getInstalledRelatedApps().then(apps => {
                if (apps.length > 0) {
                    this.isInstalled = true;
                    this.updateButtonState();
                }
            });
        }
    }

    createInstallButton() {
        // Remove existing button if present
        const existingButton = document.getElementById('pwa-install-btn');
        if (existingButton) {
            existingButton.remove();
        }

        // Create install button
        this.installButton = document.createElement('button');
        this.installButton.id = 'pwa-install-btn';
        this.installButton.className = 'pwa-install-button';
        this.installButton.title = 'Install Smart Logger as App';
        this.installButton.innerHTML = '📱';
        
        // Add styles
        this.installButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 90px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 2px solid #3b82f6;
            background: #ffffff;
            color: #3b82f6;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        `;

        // Hover effects
        this.installButton.addEventListener('mouseenter', () => {
            this.installButton.style.transform = 'scale(1.1)';
            this.installButton.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
        });

        this.installButton.addEventListener('mouseleave', () => {
            this.installButton.style.transform = 'scale(1)';
            this.installButton.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
        });

        // Click handler
        this.installButton.addEventListener('click', () => this.handleInstallClick());

        // Add to page
        document.body.appendChild(this.installButton);

        // Update initial state
        this.updateButtonState();
    }

    setupInstallPromptListener() {
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('📱 PWA install prompt available');
            // Prevent the mini-infobar from appearing
            e.preventDefault();
            // Store the event for later use
            this.deferredPrompt = e;
            // Update button visibility
            this.updateButtonState();
        });
    }

    setupInstalledListener() {
        window.addEventListener('appinstalled', (e) => {
            console.log('✅ PWA installed successfully');
            this.isInstalled = true;
            this.deferredPrompt = null;
            this.updateButtonState();
            window.smartNotification?.success('✅ Smart Logger installed successfully!');
        });
    }

    checkForUpdates() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.smartNotification?.info('🔄 App updated! Refresh to see changes.');
            });
        }
    }

    updateButtonState() {
        if (!this.installButton) return;

        if (this.isInstalled) {
            // App is installed
            this.installButton.innerHTML = '✅';
            this.installButton.title = 'Smart Logger is installed';
            this.installButton.style.background = '#10b981';
            this.installButton.style.color = '#ffffff';
            this.installButton.style.borderColor = '#10b981';
            this.installButton.style.cursor = 'default';
        } else if (this.deferredPrompt) {
            // Install prompt available
            this.installButton.innerHTML = '📱';
            this.installButton.title = 'Install Smart Logger as App';
            this.installButton.style.background = '#ffffff';
            this.installButton.style.color = '#3b82f6';
            this.installButton.style.borderColor = '#3b82f6';
            this.installButton.style.cursor = 'pointer';
            this.installButton.style.display = 'flex';
        } else {
            // Install not available
            this.installButton.style.display = 'none';
        }
    }

    async handleInstallClick() {
        if (this.isInstalled) {
            window.smartNotification?.info('📱 Smart Logger is already installed!');
            return;
        }

        if (!this.deferredPrompt) {
            this.showInstallInstructions();
            return;
        }

        try {
            // Show the install prompt
            this.installButton.style.opacity = '0.7';
            const { outcome } = await this.deferredPrompt.prompt();
            
            console.log(`📱 Install prompt outcome: ${outcome}`);
            
            if (outcome === 'accepted') {
                window.smartNotification?.info('📱 Installing Smart Logger...');
            } else {
                window.smartNotification?.warning('📱 Installation cancelled');
                this.installButton.style.opacity = '1';
            }
            
            // Clear the deferred prompt
            this.deferredPrompt = null;
            this.updateButtonState();
            
        } catch (error) {
            console.error('❌ Install prompt failed:', error);
            window.smartNotification?.error('❌ Installation failed. Try again later.');
            this.installButton.style.opacity = '1';
        }
    }

    showInstallInstructions() {
        const userAgent = navigator.userAgent.toLowerCase();
        let instructions = '';

        if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
            instructions = '📱 Chrome: Look for install icon in address bar, or use Chrome menu → "Install Smart Logger"';
        } else if (userAgent.includes('firefox')) {
            instructions = '📱 Firefox: This app can be bookmarked to home screen for quick access';
        } else if (userAgent.includes('safari')) {
            instructions = '📱 Safari: Tap Share → "Add to Home Screen" to install';
        } else if (userAgent.includes('edg')) {
            instructions = '📱 Edge: Look for install icon in address bar, or use Edge menu → "Apps" → "Install Smart Logger"';
        } else {
            instructions = '📱 To install: Look for "Add to Home Screen" or "Install" option in your browser menu';
        }

        window.smartNotification?.info(instructions, 8000);
    }

    // Responsive adjustments
    adjustForMobile() {
        if (window.innerWidth <= 768) {
            if (this.installButton) {
                this.installButton.style.top = '15px';
                this.installButton.style.right = '75px'; // Adjusted for mobile version switcher
                this.installButton.style.width = '45px';
                this.installButton.style.height = '45px';
                this.installButton.style.fontSize = '18px';
            }
        } else {
            // Desktop positioning
            if (this.installButton) {
                this.installButton.style.top = '20px';
                this.installButton.style.right = '90px'; // Side by side with version switcher
                this.installButton.style.width = '50px';
                this.installButton.style.height = '50px';
                this.installButton.style.fontSize = '20px';
            }
        }
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.pwaInstaller = new PWAInstaller();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            window.pwaInstaller.adjustForMobile();
        });
        
        // Initial mobile adjustment
        window.pwaInstaller.adjustForMobile();
    });
} else {
    window.pwaInstaller = new PWAInstaller();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        window.pwaInstaller.adjustForMobile();
    });
    
    // Initial mobile adjustment
    window.pwaInstaller.adjustForMobile();
}

// Export for manual initialization if needed
window.PWAInstaller = PWAInstaller;
