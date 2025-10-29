// JavaScript para la página de fichas
document.addEventListener('DOMContentLoaded', function() {
    const fichaCards = document.querySelectorAll('.ficha-card');
    
    // Añadir efectos de hover y click a las fichas
    fichaCards.forEach(card => {
        // Efecto de click con animación
        card.addEventListener('click', function(e) {
            // No navegar si se hizo click en el botón
            if (e.target.classList.contains('btn-view') || e.target.tagName === 'A') {
                return;
            }
            
            // Añadir efecto de click
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'translateY(-5px)';
            }, 100);
            
            // Navegar después de la animación
            setTimeout(() => {
                const fichaNum = card.getAttribute('data-ficha-num');
                if (fichaNum) {
                    window.location.href = `/ficha/${fichaNum}`;
                }
            }, 150);
        });
        
        // Mostrar información adicional en hover
        card.addEventListener('mouseenter', function() {
            const fichaInfo = card.querySelector('.ficha-info');
            if (fichaInfo) {
                fichaInfo.style.transform = 'translateY(-2px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const fichaInfo = card.querySelector('.ficha-info');
            if (fichaInfo) {
                fichaInfo.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Animación de aparición de las fichas
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    fichaCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
    
    // Estadísticas en tiempo real
    updateStats();
    
    // Funcionalidad de búsqueda por número de ficha
    const searchInput = document.getElementById('search-fichas');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim().toLowerCase();
            const fichaCards = document.querySelectorAll('.ficha-card');
            
            fichaCards.forEach(card => {
                const fichaNumber = card.getAttribute('data-ficha-num');
                const fichaTitle = card.querySelector('h3').textContent;
                
                // Buscar por número de ficha
                const matchesNumber = fichaNumber && fichaNumber.includes(searchTerm);
                const matchesTitle = fichaTitle && fichaTitle.toLowerCase().includes(searchTerm);
                
                if (searchTerm === '' || matchesNumber || matchesTitle) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
            
            // Mostrar mensaje si no hay resultados
            const visibleCards = document.querySelectorAll('.ficha-card[style*="display: block"], .ficha-card:not([style*="display: none"])');
            const noResults = document.getElementById('no-results-fichas');
            
            if (visibleCards.length === 0 && searchTerm !== '') {
                if (!noResults) {
                    const noResultsDiv = document.createElement('div');
                    noResultsDiv.id = 'no-results-fichas';
                    noResultsDiv.className = 'no-data';
                    noResultsDiv.innerHTML = `
                        <h3>No se encontraron fichas</h3>
                        <p>No hay fichas que coincidan con "${searchTerm}"</p>
                    `;
                    document.querySelector('.fichas-grid').appendChild(noResultsDiv);
                }
            } else if (noResults) {
                noResults.remove();
            }
        });
    }
});

function updateStats() {
    fetch('/api/stats')
        .then(response => response.json())
        .then(data => {
            // Actualizar contadores si existen elementos para mostrarlos
            const totalFichas = document.querySelector('[data-stat="total-fichas"]');
            const totalAprendices = document.querySelector('[data-stat="total-aprendices"]');
            const fichasActivas = document.querySelector('[data-stat="fichas-activas"]');
            
            if (totalFichas) totalFichas.textContent = data.total_fichas;
            if (totalAprendices) totalAprendices.textContent = data.total_aprendices;
            if (fichasActivas) fichasActivas.textContent = data.fichas_activas;
        })
        .catch(error => {
            console.log('Error actualizando estadísticas:', error);
        });
}

// Función para mostrar detalles de ficha en modal (opcional)
function showFichaDetails(fichaNum) {
    fetch(`/api/fichas`)
        .then(response => response.json())
        .then(data => {
            const ficha = data[fichaNum];
            if (ficha) {
                // Aquí podrías mostrar un modal con detalles de la ficha
                console.log('Detalles de ficha:', ficha);
            }
        })
        .catch(error => {
            console.error('Error cargando detalles de ficha:', error);
        });
}