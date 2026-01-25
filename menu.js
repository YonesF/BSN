document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.getElementById('menuButton');
    const menuOverlay = document.getElementById('menuOverlay');
    const mainMenu = document.getElementById('main-menu');
    const menuLinks = mainMenu.querySelectorAll('a');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;

        // Toggle UI state
        menuButton.classList.toggle('is-active');
        menuButton.setAttribute('aria-expanded', isMenuOpen);

        if (isMenuOpen) {
            // Open Menu
            menuOverlay.classList.remove('opacity-0', 'pointer-events-none');
            mainMenu.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden'; // Scroll lock

            // Focus management
            menuLinks.forEach(link => link.setAttribute('tabindex', '0'));
            setTimeout(() => menuLinks[0].focus(), 100); // Wait for transition
        } else {
            // Close Menu
            menuOverlay.classList.add('opacity-0', 'pointer-events-none');
            mainMenu.classList.add('translate-x-full');
            document.body.style.overflow = ''; // Release scroll lock

            // Focus management
            menuLinks.forEach(link => link.setAttribute('tabindex', '-1'));
            menuButton.focus();
        }
    }

    function closeMenu() {
        if (isMenuOpen) toggleMenu();
    }

    // Event Listeners
    if (menuButton) {
        menuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }

    // Close on Link Click
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Keyboard Accessibility (ESC to close)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });

    // Trap Focus inside Menu (Basic implementation)
    if (mainMenu) {
        mainMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && isMenuOpen) {
                const firstElement = menuLinks[0];
                const lastElement = menuLinks[menuLinks.length - 1];

                if (e.shiftKey) { /* Shift + Tab */
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else { /* Tab */
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
});
