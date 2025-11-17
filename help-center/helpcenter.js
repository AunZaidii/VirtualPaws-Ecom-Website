 document.addEventListener('DOMContentLoaded', function() {
            const accordionHeaders = document.querySelectorAll('.accordion-header');
            
            accordionHeaders.forEach(header => {
                header.addEventListener('click', function() {
                    const accordionItem = this.parentElement;
                    const isActive = accordionItem.classList.contains('active');
                    
                    document.querySelectorAll('.accordion-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    if (!isActive) {
                        accordionItem.classList.add('active');
                    }
                });
            });

            const searchInput = document.getElementById('searchInput');
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                const accordionItems = document.querySelectorAll('.accordion-item');
                
                if (searchTerm === '') {
                    accordionItems.forEach(item => {
                        item.style.display = 'block';
                    });
                    return;
                }
                
                accordionItems.forEach(item => {
                    const question = item.querySelector('.accordion-header span').textContent.toLowerCase();
                    const answer = item.querySelector('.accordion-content-inner').textContent.toLowerCase();
                    
                    if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                        item.style.display = 'block';
                        item.classList.add('active');
                    } else {
                        item.style.display = 'none';
                    }
                });
            });

            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        });