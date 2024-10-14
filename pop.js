// pop.js

document.addEventListener('DOMContentLoaded', () => {
    // Get the elements
    const popupLayer = document.getElementById('popup-layer');
    const openPopupBtn = document.getElementById('open-popup-btn');
    const closePopupBtn = document.getElementById('close-popup-btn');
  
    // Function to open the pop-up
    function openPopup() {
      popupLayer.style.display = 'block';
    }
  
    // Function to close the pop-up
    function closePopup() {
      popupLayer.style.display = 'none';
    }
  
    // Event listeners
    openPopupBtn.addEventListener('click', openPopup);
    closePopupBtn.addEventListener('click', closePopup);
  
    // Close pop-up when clicking outside of the content
    window.addEventListener('click', (event) => {
      if (event.target === popupLayer) {
        closePopup();
      }
    });
  });
  