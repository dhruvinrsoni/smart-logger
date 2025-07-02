/**
 * Smart Logger - Core Module (Simplified for Debug)
 */

// Global variables
let logContainer;
let allLogs = [];
let nextLogId = 1;
let currentSearchTerm = '';
let isDescendingSort = false;

// Expose variables to window for external access
window.allLogs = allLogs;
window.nextLogId = nextLogId;

/**
 * Initialize the core logging system
 */
function initializeCore() {
    console.log('🔄 Initializing core...');
    
    // Get DOM elements
    logContainer = document.getElementById('logContainer');
    
    if (!logContainer) {
        console.error('❌ Log container not found!');
        return;
    }
    
    console.log('✅ Log container found');
    
    // Load from localStorage or create test data
    loadLogs();
    
    // Display logs
    displayLogs();
    
    console.log('✅ Core initialized successfully');
}

/**
 * Load logs from localStorage or create test data
 */
function loadLogs() {
    try {
        const saved = localStorage.getItem('logs');
        if (saved) {
            allLogs = JSON.parse(saved);
            nextLogId = parseInt(localStorage.getItem('nextLogId')) || (allLogs.length + 1);        } else {
            // Create initial test data
            allLogs = [
                { 
                    id: 1, 
                    title: "Welcome to Smart Logger v2", 
                    content: "This is your first log entry. The app is working correctly!", 
                    timestamp: new Date().toLocaleString() 
                },
                { 
                    id: 2, 
                    title: "Test Entry", 
                    content: "This is a test entry to verify the display functionality.", 
                    timestamp: new Date().toLocaleString() 
                }
            ];
            nextLogId = 3;
            
            // Save to localStorage
            localStorage.setItem('logs', JSON.stringify(allLogs));
            localStorage.setItem('nextLogId', nextLogId.toString());
        }
        
        // Always sync with window
        window.allLogs = allLogs;
        window.nextLogId = nextLogId;
        
        console.log('📋 Loaded', allLogs.length, 'logs');
    } catch (error) {
        console.error('❌ Error loading logs:', error);
        allLogs = [];
        nextLogId = 1;
        window.allLogs = allLogs;
        window.nextLogId = nextLogId;
    }
}

/**
 * Display all logs
 */
function displayLogs() {
    console.log('🎨 Displaying logs...');
    
    if (!logContainer) {
        console.error('❌ Log container not available');
        return;
    }
    
    if (allLogs.length === 0) {
        logContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 2rem;">No logs available. Add your first log!</p>';
        return;
    }
    
    // Sort logs
    const sortedLogs = [...allLogs].sort((a, b) => {
        return isDescendingSort ? b.id - a.id : a.id - b.id;
    });
    
    // Clear container
    logContainer.innerHTML = '';
    
    // Add each log
    sortedLogs.forEach((log, index) => {
        const logElement = createLogElement(log, index, sortedLogs.length);
        logContainer.appendChild(logElement);
    });
    
    console.log('✅ Displayed', sortedLogs.length, 'logs');
}

/**
 * Create a log element
 */
/**
 * Highlight search terms in a string
 */
function highlightSearchTermInString(str, searchTerm) {
    if (!searchTerm || !str) return str;
    
    const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
    return str.replace(regex, '<span style="background-color: yellow;">$1</span>');
}

/**
 * Escape special regex characters
 */
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createLogElement(log, index, total) {
    const logDiv = document.createElement('div');
    logDiv.className = 'log-entry';
    logDiv.setAttribute('data-log-id', log.id); // Add log ID as data attribute
    
    const displayNumber = isDescendingSort ? total - index : index + 1;
    
    logDiv.innerHTML = `
        <div class="log-header" onclick="toggleLog(this)">
            <div class="log-title-section">
                <strong>${log.timestamp}</strong>
                ${log.title ? ` | <span class="log-entry-title">${log.title}</span>` : ''}
                <span class="log-counter">#${log.id}</span>
            </div>
            <div class="log-actions">
                <button onclick="event.stopPropagation(); copyLog(${log.id})" title="Copy">📋</button>
                <button onclick="event.stopPropagation(); deleteLog(${log.id})" title="Delete">🗑️</button>
                <span class="toggle-arrow">▼</span>
            </div>
        </div>
        <div class="log-content">
            ${log.content ? log.content.replace(/\n/g, '<br>') : '<em>No content</em>'}
        </div>
    `;
    
    return logDiv;
}

/**
 * Toggle log expansion
 */
function toggleLog(element) {
    const logEntry = element.closest('.log-entry');
    const content = logEntry.querySelector('.log-content');
    const arrow = logEntry.querySelector('.toggle-arrow');
    
    if (content.style.display === 'block') {
        content.style.display = 'none';
        arrow.textContent = '▼';
    } else {
        content.style.display = 'block';
        arrow.textContent = '▲';
    }
}

/**
 * Add a new log
 */
function addLog() {
    const titleInput = document.getElementById('logTitle');
    const contentInput = document.getElementById('logInput');
    
    if (!titleInput || !contentInput) {
        console.error('❌ Input elements not found');
        return;
    }
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    if (!title && !content) {
        alert('Please enter either a title or content for the log.');
        return;
    }
    
    const newLog = {
        id: nextLogId++,
        title: title,
        content: content,
        timestamp: new Date().toLocaleString()
    };
      allLogs.push(newLog);
    
    // Sync with window
    window.allLogs = allLogs;
    window.nextLogId = nextLogId;
    
    // Save to localStorage
    localStorage.setItem('logs', JSON.stringify(allLogs));
    localStorage.setItem('nextLogId', nextLogId.toString());
    
    // Clear inputs
    titleInput.value = '';
    contentInput.value = '';
    
    // Refresh display
    displayLogs();
    
    console.log('✅ Added new log:', newLog.id);
}

/**
 * Delete a log
 */
function deleteLog(logId) {
    if (!confirm('Are you sure you want to delete this log?')) {
        return;
    }
    
    allLogs = allLogs.filter(log => log.id !== logId);
    
    // Sync with window
    window.allLogs = allLogs;
    
    // Save to localStorage
    localStorage.setItem('logs', JSON.stringify(allLogs));
    
    // Refresh display
    displayLogs();
    
    console.log('🗑️ Deleted log:', logId);
}

/**
 * Copy log to clipboard
 */
function copyLog(logId) {
    const log = allLogs.find(l => l.id === logId);
    if (!log) return;
    
    let text = log.timestamp;
    if (log.title) text += ` | ${log.title}`;
    if (log.content) text += `\n${log.content}`;
    
    navigator.clipboard.writeText(text).then(() => {
        console.log('📋 Copied log to clipboard');
        // Visual feedback
        event.target.textContent = '✓';
        setTimeout(() => {
            event.target.textContent = '📋';
        }, 1000);
    }).catch(err => {
        console.error('❌ Copy failed:', err);
    });
}

/**
 * Expand all logs
 */
function expandAll() {
    const contents = document.querySelectorAll('.log-content');
    const arrows = document.querySelectorAll('.toggle-arrow');
    
    contents.forEach(content => content.style.display = 'block');
    arrows.forEach(arrow => arrow.textContent = '▲');
}

/**
 * Collapse all logs
 */
function collapseAll() {
    const contents = document.querySelectorAll('.log-content');
    const arrows = document.querySelectorAll('.toggle-arrow');
    
    contents.forEach(content => content.style.display = 'none');
    arrows.forEach(arrow => arrow.textContent = '▼');
}

/**
 * Toggle sort order
 */
function toggleSort() {
    isDescendingSort = !isDescendingSort;
    const sortBtn = document.getElementById('sortBtn');
    if (sortBtn) {
        sortBtn.textContent = `🔢 Sort: ${isDescendingSort ? 'Newest First' : 'Oldest First'}`;
    }
    displayLogs();
}

/**
 * Search logs
 */
function searchLogs() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    currentSearchTerm = searchTerm;
    
    const logEntries = document.querySelectorAll('.log-entry');
    let matchCount = 0;
    
    logEntries.forEach((entry) => {
        // Get the log ID from the data attribute
        const logId = parseInt(entry.getAttribute('data-log-id'));
        // Find the corresponding log in allLogs array by ID
        const log = allLogs.find(l => l.id === logId);
        
        if (!log) return;
        
        const titleText = (log.title || '').toLowerCase();
        const contentText = (log.content || '').toLowerCase();
        const timestampText = (log.timestamp || '').toLowerCase();
        
        const matches = titleText.includes(searchTerm) || 
                       contentText.includes(searchTerm) || 
                       timestampText.includes(searchTerm);
        
        if (!searchTerm || matches) {
            entry.style.display = 'block';
            matchCount++;
        } else {
            entry.style.display = 'none';
        }
    });
    
    // Update search results
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        if (searchTerm) {
            searchResults.textContent = `${matchCount} match${matchCount !== 1 ? 'es' : ''} found`;
        } else {
            searchResults.textContent = '';
        }
    }
}

/**
 * Clear search functionality
 */
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    if (searchResults) {
        searchResults.textContent = '';
    }
    
    currentSearchTerm = '';
    
    // Show all logs
    const logEntries = document.querySelectorAll('.log-entry');
    logEntries.forEach(entry => {
        entry.style.display = 'block';
    });
    
    console.log('🔍 Search cleared');
}

/**
 * Clear all logs (with confirmation)
 */
function clearAllLogs() {
    if (!confirm('Are you sure you want to delete ALL logs? This action cannot be undone.')) {
        return;
    }
    
    allLogs = [];
    nextLogId = 1;
    
    // Save to localStorage
    localStorage.setItem('logs', JSON.stringify(allLogs));
    localStorage.setItem('nextLogId', nextLogId.toString());
    
    // Refresh display
    displayLogs();
    
    console.log('🗑️ All logs cleared');
}

/**
 * Toggle auto-save functionality (placeholder)
 */
function toggleAutoSave() {
    const btn = document.getElementById('enableAutoSaveBtn');
    if (btn) {
        const isEnabled = btn.textContent.includes('Disable');
        if (isEnabled) {
            btn.innerHTML = '💾 Enable Auto-Save';
            console.log('🔄 Auto-save disabled');
        } else {
            btn.innerHTML = '💾 Disable Auto-Save';
            console.log('🔄 Auto-save enabled');
        }
    }
}

/**
 * Load logs from file (placeholder)
 */
function loadFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (Array.isArray(data)) {
                        allLogs = data;
                        nextLogId = Math.max(...allLogs.map(log => log.id)) + 1;
                        
                        // Save to localStorage
                        localStorage.setItem('logs', JSON.stringify(allLogs));
                        localStorage.setItem('nextLogId', nextLogId.toString());
                        
                        displayLogs();
                        console.log('📂 Loaded logs from file');
                    } else {
                        alert('Invalid file format. Please select a valid logs JSON file.');
                    }
                } catch (error) {
                    console.error('❌ Error loading file:', error);
                    alert('Error reading file. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

/**
 * Save logs to file
 */
function saveToFile() {
    const data = JSON.stringify(allLogs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-logger-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    console.log('💾 Logs saved to file');
}

/**
 * Export logs in various formats
 */
function exportLogs() {
    const format = prompt('Export format:\n1. JSON (default)\n2. Text\n3. CSV\n\nEnter number (1-3):', '1');
    
    let content, fileName, type;
    const date = new Date().toISOString().split('T')[0];
    
    switch (format) {
        case '2':
            // Text format
            content = allLogs.map(log => {
                let text = `${log.timestamp}`;
                if (log.title) text += ` | ${log.title}`;
                if (log.content) text += `\n${log.content}`;
                return text;
            }).join('\n\n---\n\n');
            fileName = `smart-logger-export-${date}.txt`;
            type = 'text/plain';
            break;
            
        case '3':
            // CSV format
            content = 'ID,Timestamp,Title,Content\n' + 
                     allLogs.map(log => 
                         `${log.id},"${log.timestamp}","${(log.title || '').replace(/"/g, '""')}","${(log.content || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
                     ).join('\n');
            fileName = `smart-logger-export-${date}.csv`;
            type = 'text/csv';
            break;
            
        default:
            // JSON format
            content = JSON.stringify(allLogs, null, 2);
            fileName = `smart-logger-export-${date}.json`;
            type = 'application/json';
    }
    
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    
    URL.revokeObjectURL(url);
    console.log('📤 Logs exported');
}

/**
 * Import logs from various formats
 */
function importLogs() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.txt,.csv';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const content = e.target.result;
                    let importedLogs = [];
                    
                    if (file.name.endsWith('.json')) {
                        importedLogs = JSON.parse(content);
                    } else if (file.name.endsWith('.csv')) {
                        // Simple CSV parsing
                        const lines = content.split('\n').slice(1); // Skip header
                        importedLogs = lines.filter(line => line.trim()).map((line, index) => {
                            const columns = line.split(',');
                            return {
                                id: nextLogId + index,
                                timestamp: columns[1]?.replace(/"/g, '') || new Date().toLocaleString(),
                                title: columns[2]?.replace(/"/g, '') || '',
                                content: columns[3]?.replace(/"/g, '') || ''
                            };
                        });
                    } else {
                        // Text format - split by separator
                        const entries = content.split('\n\n---\n\n');
                        importedLogs = entries.map((entry, index) => {
                            const lines = entry.split('\n');
                            const firstLine = lines[0] || '';
                            const content = lines.slice(1).join('\n').trim();
                            
                            return {
                                id: nextLogId + index,
                                timestamp: firstLine.includes('|') ? firstLine.split('|')[0].trim() : firstLine,
                                title: firstLine.includes('|') ? firstLine.split('|')[1]?.trim() || '' : '',
                                content: content
                            };
                        });
                    }
                    
                    if (importedLogs.length > 0) {
                        // Add to existing logs
                        allLogs = [...allLogs, ...importedLogs];
                        nextLogId = Math.max(...allLogs.map(log => log.id)) + 1;
                        
                        // Save to localStorage
                        localStorage.setItem('logs', JSON.stringify(allLogs));
                        localStorage.setItem('nextLogId', nextLogId.toString());
                        
                        displayLogs();
                        console.log(`📥 Imported ${importedLogs.length} logs`);
                    } else {
                        alert('No valid logs found in the file.');
                    }
                } catch (error) {
                    console.error('❌ Error importing file:', error);
                    alert('Error reading file. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

/**
 * Setup search clear button functionality
 */
function setupSearchClear() {
    const searchInput = document.getElementById('searchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');
    
    if (!searchInput || !searchClearBtn) return;
    
    // Show/hide clear button based on input content
    function toggleClearButton() {
        if (searchInput.value.trim().length > 0) {
            searchClearBtn.classList.add('visible');
        } else {
            searchClearBtn.classList.remove('visible');
        }
    }
    
    // Event listeners
    searchInput.addEventListener('input', toggleClearButton);
    searchClearBtn.addEventListener('click', () => {
        clearSearch();
        toggleClearButton();
        searchInput.focus();
    });
    
    // Initial state
    toggleClearButton();
}

// Make functions globally accessible
window.initializeCore = initializeCore;
window.addLog = addLog;
window.deleteLog = deleteLog;
window.toggleLog = toggleLog;
window.copyLog = copyLog;
window.expandAll = expandAll;
window.collapseAll = collapseAll;
window.toggleSort = toggleSort;
window.searchLogs = searchLogs;
window.displayLogs = displayLogs;
window.clearAllLogs = clearAllLogs;
window.clearSearch = clearSearch;
window.setupSearchClear = setupSearchClear;
window.toggleAutoSave = toggleAutoSave;
window.loadFromFile = loadFromFile;
window.saveToFile = saveToFile;
window.exportLogs = exportLogs;
window.importLogs = importLogs;

// Export for organized access
window.SmartLoggerCore = {
    initializeCore,
    addLog,
    deleteLog,
    toggleLog,
    copyLog,
    expandAll,
    collapseAll,
    toggleSort,
    searchLogs,
    displayLogs,
    clearAllLogs,
    clearSearch,
    setupSearchClear,
    toggleAutoSave,
    loadFromFile,
    saveToFile,
    exportLogs,
    importLogs
};
