/**
 * LuksusEiendom Theme Switcher
 * Handles Light/Dark mode toggling and persistence.
 */

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved preference
    const savedTheme = localStorage.getItem('theme');

    // Apply saved theme or default to light
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateIcon(true);
    } else {
        updateIcon(false);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');

            // Save preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            // Update icon
            updateIcon(isDark);
        });
    }

    function updateIcon(isDark) {
        if (!themeToggleBtn) return;

        // Simple SVG swap or text change. Requires specific HTML structure in the button.
        const sunIcon = themeToggleBtn.querySelector('.icon-sun');
        const moonIcon = themeToggleBtn.querySelector('.icon-moon');

        if (sunIcon && moonIcon) {
            if (isDark) {
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            } else {
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            }
        }
    }
});
