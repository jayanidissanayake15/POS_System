class NavigationView {
    constructor() {
        this.sections = {
            dashboard: $('#dashboard-section'),
            customers: $('#customers-section'),
            items: $('#items-section'),
            orders: $('#orders-section'),
            orderHistory: $('#order-history-section')
        };
    }

    showSection(sectionName) {
        // Hide all sections
        Object.values(this.sections).forEach(section => {
            section.addClass('hidden');
        });

        // Show requested section
        if (this.sections[sectionName]) {
            this.sections[sectionName].removeClass('hidden');
        }

        // Update active nav link
        $('.sidebar .nav-link').removeClass('active');
        $(`.sidebar .nav-link[data-section="${sectionName}"]`).addClass('active');
    }

    bindNavigation(handler) {
        $('.sidebar .nav-link[data-section]').on('click', function() {
            const section = $(this).data('section');
            handler(section);
        });
    }
}