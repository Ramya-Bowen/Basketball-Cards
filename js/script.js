document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");
    const filterButtons = document.querySelectorAll(".filter-buttons button");
    const cardDeck = document.querySelector(".card-deck");
  
    // Assign base z-indexes and dataset index
    cards.forEach((card, i) => {
      // Set base z-index and store it
      card.dataset.index = 7 - i;
      card.style.zIndex = card.dataset.index;
    
      card.addEventListener("click", () => {
        const isActive = card.classList.contains("active");
    
        // Reset all cards
        cards.forEach(c => {
          c.classList.remove("active");
          c.style.zIndex = c.dataset.index;
        });
    
        // Re-activate only if it wasn't already active
        if (!isActive) {
          card.classList.add("active");
          card.style.zIndex = 10;
        }
      });
    });
    
  
    // Reassign z-index to visible cards
    function restackVisibleCards() {
      const visibleCards = Array.from(cards).filter(card => card.style.display !== "none");
      visibleCards.forEach((card, i) => {
        card.style.zIndex = visibleCards.length - i;
      });
    }
  
    // Flip to back
    document.querySelectorAll('.icon-next').forEach(icon => {
      icon.addEventListener('click', function (e) {
        e.stopPropagation();
        const cardInner = e.target.closest('.card').querySelector('.card-inner');
        cardInner.classList.add('flipped');
      });
    });
  
    // Flip to front
    document.querySelectorAll('.icon-back').forEach(icon => {
      icon.addEventListener('click', function (e) {
        e.stopPropagation();
        const cardInner = e.target.closest('.card').querySelector('.card-inner');
        cardInner.classList.remove('flipped');
      });
    });
  
    // Handle filtering
    filterButtons.forEach(button => {
      button.addEventListener("click", () => {
        const position = button.getAttribute("data-position");
        const isFiltered = position !== "All";
  
        cards.forEach(card => {
          const cardPosition = card.getAttribute("data-position");
          card.style.display = (position === "All" || cardPosition === position) ? "block" : "none";
        });
  
        cardDeck.classList.toggle("filtered", isFiltered);
        restackVisibleCards();
        resetSpread(); // Reset so the new set can spread on hover
      });
    });
  
    // Reassign z-index to visible cards
    function restackVisibleCards() {
      const visibleCards = Array.from(cards).filter(card => card.style.display !== "none");
      visibleCards.forEach((card, i) => {
        card.style.zIndex = visibleCards.length - i;
      });
    }
  
    // Spread logic on hover
    function applyDynamicSpread() {
      const visibleCards = Array.from(cards).filter(card => card.style.display !== "none");
      const total = visibleCards.length;
  
      if (total === 1) {
        visibleCards[0].style.setProperty('--spread-transform', `translateX(0px) rotate(0deg)`);
        return;
      }
  
      const spreadAmount = 80;
      const rotateAmount = 5;
      const middleIndex = Math.floor((total - 1) / 2);
  
      visibleCards.forEach((card, i) => {
        const offset = i - middleIndex;
        const translateX = offset * spreadAmount;
        const rotate = offset * rotateAmount;
        card.style.setProperty('--spread-transform', `translateX(${translateX}px) rotate(${rotate}deg)`);
      });
    }
  
    function resetSpread() {
      cards.forEach(card => {
        card.style.setProperty('--spread-transform', `translateX(0px) rotate(0deg)`);
      });
    }
  
    cardDeck.addEventListener("mouseenter", applyDynamicSpread);
    cardDeck.addEventListener("mouseleave", resetSpread);
  });
  