// Search Box Functionality
document.addEventListener('DOMContentLoaded', function() {
    const searchToggle = document.getElementById('searchToggle');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // Open search overlay when clicking magnifying glass
    searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        searchOverlay.classList.add('active');
        // Focus on input after animation
        setTimeout(() => {
            searchInput.focus();
        }, 300);
    });

    // Close search overlay when clicking close button
    searchClose.addEventListener('click', function() {
        searchOverlay.classList.remove('active');
        searchInput.value = ''; // Clear input
    });

    // Close search overlay when clicking outside the search box
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
            searchInput.value = ''; // Clear input
        }
    });

    // Close search overlay when pressing ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            searchOverlay.classList.remove('active');
            searchInput.value = ''; // Clear input
        }
    });

    // Handle search button click
    searchBtn.addEventListener('click', function() {
        performSearch();
    });

    // Handle Enter key press in search input
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Search function - CORRECTED
    function performSearch() {
        const searchQuery = searchInput.value.trim();
        
        if (searchQuery !== '') {
            // Redirect to search results page - FIXED PATH
            window.location.href = `./search-results/search-results.html?q=${encodeURIComponent(searchQuery)}`;
        } else {
            // If search is empty, shake the input as feedback
            searchInput.style.animation = 'shake 0.5s';
            setTimeout(() => {
                searchInput.style.animation = '';
            }, 500);
        }
    }
});

// Optional: Shake animation for empty search
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);