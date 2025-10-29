// JavaScript moderno para la página de upload
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file');
    const fileLabel = document.querySelector('.file-label');
    const fileName = document.getElementById('file-name');
    const uploadBtn = document.getElementById('upload-btn');
    const fileIcon = document.querySelector('.file-icon');

    // Función para mostrar notificación moderna
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        
        const messagesContainer = document.querySelector('.messages') || createMessagesContainer();
        messagesContainer.appendChild(notification);
        
        // Animación de entrada
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            notification.style.transition = 'all 0.3s ease';
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    function createMessagesContainer() {
        const container = document.createElement('div');
        container.className = 'messages';
        document.querySelector('.upload-section').prepend(container);
        return container;
    }

    // Manejar selección de archivo
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (file) {
            // Validar que sea un archivo Excel
            const validExtensions = ['xlsx', 'xls'];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            
            if (validExtensions.includes(fileExtension)) {
                const fileSize = (file.size / 1024 / 1024).toFixed(2);
                fileName.textContent = `✓ ${file.name}`;
                document.querySelector('.file-subtext').textContent = `Tamaño: ${fileSize} MB - Listo para procesar`;
                
                fileLabel.classList.add('has-file');
                uploadBtn.disabled = false;
                
                // Cambiar icono a check
                fileIcon.innerHTML = `
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.76489 14.1003 1.98232 16.07 2.86" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
                
                showNotification('✓ Archivo cargado correctamente', 'success');
            } else {
                showNotification('❌ Formato no válido. Solo se permiten archivos .xlsx o .xls', 'error');
                resetFileInput();
            }
        } else {
            resetFileInput();
        }
    });

    function resetFileInput() {
        fileInput.value = '';
        fileName.textContent = 'Arrastra tu archivo Excel aquí';
        document.querySelector('.file-subtext').textContent = 'o haz clic para seleccionar (.xlsx, .xls)';
        fileLabel.classList.remove('has-file');
        uploadBtn.disabled = true;
        
        // Restaurar icono original
        fileIcon.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }

    // Manejar drag and drop mejorado
    let dragCounter = 0;

    fileLabel.addEventListener('dragenter', function(e) {
        e.preventDefault();
        dragCounter++;
        fileLabel.classList.add('drag-over');
        fileName.textContent = '🎯 Suelta el archivo aquí';
    });

    fileLabel.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    fileLabel.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dragCounter--;
        if (dragCounter === 0) {
            fileLabel.classList.remove('drag-over');
            if (!fileLabel.classList.contains('has-file')) {
                fileName.textContent = 'Arrastra tu archivo Excel aquí';
            }
        }
    });

    fileLabel.addEventListener('drop', function(e) {
        e.preventDefault();
        fileLabel.style.backgroundColor = '#fafafa';
        fileLabel.style.borderColor = '#ccc';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            
            // Disparar evento change manualmente
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
        }
    });

    // Validación adicional en el envío del formulario
    document.querySelector('.upload-form').addEventListener('submit', function(e) {
        if (!fileInput.files[0]) {
            e.preventDefault();
            alert('Por favor selecciona un archivo antes de enviarlo.');
            return false;
        }
        
        // Mostrar loader
        uploadBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="spinning">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-dasharray="31.416" stroke-dashoffset="31.416" fill="none">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                    <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                </circle>
            </svg>
            Procesando...
        `;
        uploadBtn.disabled = true;
    });
});

// Añadir estilos para la animación de carga
const style = document.createElement('style');
style.textContent = `
    .spinning {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);