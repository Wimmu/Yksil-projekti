document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.product').forEach(item => {
        item.addEventListener('click', () => {
            const infoBox = item.querySelector('.infoBox');
            infoBox.style.display = infoBox.style.display === 'none' ? 'block' : 'none';
        });
    });
});