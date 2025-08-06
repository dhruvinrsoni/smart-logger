/**
 * Smart Logger Notification System
 * Reusable notification component for displaying messages
 * Used across Smart Logger v1 and v2
 */

class SmartNotification {
    constructor() {
        this.notifications = new Map();
        this.notificationCounter = 0;
    }

    /**
     * Show a notification
     * @param {string} message - The message to display
     * @param {string} type - Type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in milliseconds (default: 4000)
     * @param {Object} options - Additional options
     * @returns {string} - Notification ID for manual removal
     */
    show(message, type = 'info', duration = 4000, options = {}) {
        const notificationId = `notification-${++this.notificationCounter}`;
        
        // Default options
        const config = {
            position: 'top-right', // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
            closable: false,
            persistent: false,
            maxWidth: '300px',
            offset: { top: 80, right: 20, bottom: 20, left: 20 },
            ...options
        };

        // Remove existing notification if persistent
        if (config.persistent) {
            this.clearAll();
        }

        // Create notification element
        const notification = this.createNotificationElement(message, type, config, notificationId);
        
        // Position notification
        this.positionNotification(notification, config);
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Store reference
        this.notifications.set(notificationId, {
            element: notification,
            config: config,
            timer: null
        });

        // Animate in
        this.animateIn(notification);

        // Auto-remove if not persistent
        if (!config.persistent && duration > 0) {
            const timer = setTimeout(() => {
                this.remove(notificationId);
            }, duration);
            
            this.notifications.get(notificationId).timer = timer;
        }

        // Add close button if closable
        if (config.closable) {
            this.addCloseButton(notification, notificationId);
        }

        return notificationId;
    }

    /**
     * Create notification element
     */
    createNotificationElement(message, type, config, notificationId) {
        const notification = document.createElement('div');
        notification.id = notificationId;
        notification.className = `smart-notification smart-notification-${type}`;
        
        // Create content
        const content = document.createElement('div');
        content.className = 'smart-notification-content';
        content.textContent = message;
        notification.appendChild(content);

        // Get colors for type
        const colors = this.getColorScheme(type);
        
        // Apply styles
        notification.style.cssText = `
            position: fixed;
            max-width: ${config.maxWidth};
            padding: 12px 16px;
            background: ${colors.bg};
            color: ${colors.color};
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10001;
            font-size: 14px;
            line-height: 1.4;
            opacity: 0;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            cursor: ${config.closable ? 'pointer' : 'default'};
            user-select: none;
            border: 1px solid ${colors.border || 'transparent'};
        `;

        return notification;
    }

    /**
     * Get color scheme for notification type
     */
    getColorScheme(type) {
        const schemes = {
            success: { 
                bg: '#10b981', 
                color: '#ffffff',
                border: '#059669'
            },
            error: { 
                bg: '#ef4444', 
                color: '#ffffff',
                border: '#dc2626'
            },
            warning: { 
                bg: '#f59e0b', 
                color: '#ffffff',
                border: '#d97706'
            },
            info: { 
                bg: '#3b82f6', 
                color: '#ffffff',
                border: '#2563eb'
            }
        };
        
        return schemes[type] || schemes.info;
    }

    /**
     * Position notification based on config
     */
    positionNotification(notification, config) {
        const { position, offset } = config;
        
        // Clear positioning
        notification.style.top = 'auto';
        notification.style.bottom = 'auto';
        notification.style.left = 'auto';
        notification.style.right = 'auto';
        
        switch (position) {
            case 'top-right':
                notification.style.top = `${offset.top}px`;
                notification.style.right = `${offset.right}px`;
                notification.style.transform = 'translateX(100%)';
                break;
            case 'top-left':
                notification.style.top = `${offset.top}px`;
                notification.style.left = `${offset.left}px`;
                notification.style.transform = 'translateX(-100%)';
                break;
            case 'bottom-right':
                notification.style.bottom = `${offset.bottom}px`;
                notification.style.right = `${offset.right}px`;
                notification.style.transform = 'translateX(100%)';
                break;
            case 'bottom-left':
                notification.style.bottom = `${offset.bottom}px`;
                notification.style.left = `${offset.left}px`;
                notification.style.transform = 'translateX(-100%)';
                break;
        }
    }

    /**
     * Animate notification in
     */
    animateIn(notification) {
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });
    }

    /**
     * Animate notification out
     */
    animateOut(notification, callback) {
        notification.style.opacity = '0';
        
        // Determine exit direction based on current position
        const rect = notification.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        
        if (rect.left > windowWidth / 2) {
            notification.style.transform = 'translateX(100%)';
        } else {
            notification.style.transform = 'translateX(-100%)';
        }
        
        setTimeout(callback, 300);
    }

    /**
     * Add close button to notification
     */
    addCloseButton(notification, notificationId) {
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 4px;
            right: 8px;
            background: none;
            border: none;
            color: inherit;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s;
            padding: 0;
            margin: 0;
            line-height: 1;
        `;
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.opacity = '1';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.opacity = '0.7';
        });
        
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.remove(notificationId);
        });
        
        notification.style.position = 'relative';
        notification.style.paddingRight = '32px';
        notification.appendChild(closeBtn);
        
        // Make notification clickable to close
        notification.addEventListener('click', () => {
            this.remove(notificationId);
        });
    }

    /**
     * Remove a specific notification
     */
    remove(notificationId) {
        const notificationData = this.notifications.get(notificationId);
        if (!notificationData) return;

        const { element, timer } = notificationData;
        
        // Clear timer if exists
        if (timer) {
            clearTimeout(timer);
        }
        
        // Animate out and remove
        this.animateOut(element, () => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            this.notifications.delete(notificationId);
        });
    }

    /**
     * Clear all notifications
     */
    clearAll() {
        for (const [id] of this.notifications) {
            this.remove(id);
        }
    }

    /**
     * Convenience methods
     */
    success(message, duration = 4000, options = {}) {
        return this.show(message, 'success', duration, options);
    }

    error(message, duration = 6000, options = {}) {
        return this.show(message, 'error', duration, options);
    }

    warning(message, duration = 5000, options = {}) {
        return this.show(message, 'warning', duration, options);
    }

    info(message, duration = 4000, options = {}) {
        return this.show(message, 'info', duration, options);
    }

    /**
     * Responsive adjustments
     */
    adjustForMobile() {
        if (window.innerWidth <= 768) {
            // Update existing notifications for mobile
            for (const [id, data] of this.notifications) {
                const element = data.element;
                element.style.maxWidth = '280px';
                element.style.fontSize = '13px';
                
                // Adjust positioning for mobile
                if (element.style.right) {
                    element.style.right = '10px';
                }
                if (element.style.left) {
                    element.style.left = '10px';
                }
            }
        }
    }
}

// Create global instance
window.smartNotification = new SmartNotification();

// Handle responsive adjustments
window.addEventListener('resize', () => {
    window.smartNotification.adjustForMobile();
});

// Export class for manual instantiation if needed
window.SmartNotification = SmartNotification;
