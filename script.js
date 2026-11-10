
document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".card"));
  const filterButtons = document.querySelectorAll(
    ".filter-buttons button"
  );
  const cardDeck = document.querySelector(".card-deck");

  const isMobile = () => window.innerWidth <= 600;

  let activeCard = null;
  let mobileIndex = 0;

  function getVisibleCards() {
    return cards.filter(card => card.style.display !== "none");
  }

  function resetSpread() {
    cards.forEach(card => {
      card.style.setProperty(
        "--spread-transform",
        "translateX(0px) rotate(0deg)"
      );
    });
  }

  function restackVisibleCards() {
    const visibleCards = getVisibleCards();

    visibleCards.forEach((card, index) => {
      card.style.zIndex = visibleCards.length - index;
    });

    if (activeCard && visibleCards.includes(activeCard)) {
      activeCard.style.zIndex = visibleCards.length + 1;
    }
  }

  function setActiveCard(card) {
    cards.forEach(c => c.classList.remove("active"));

    activeCard = card;

    if (card) {
      card.classList.add("active");
    }

    restackVisibleCards();
  }

  function applyDynamicSpread() {
    if (isMobile()) return;

    const visibleCards = getVisibleCards();
    const total = visibleCards.length;

    if (total <= 1) return;

    const cardWidth = visibleCards[0].offsetWidth;

    // Keep the full card spread within the viewport
    const availableWidth = Math.max(
      0,
      window.innerWidth - cardWidth - 40
    );

    const spreadAmount = Math.min(
      80,
      availableWidth / (total - 1)
    );

    const middleIndex = (total - 1) / 2;

    visibleCards.forEach((card, index) => {
      const offset = index - middleIndex;

      const translateX = offset * spreadAmount;
      const rotate = offset * 2;

      card.style.setProperty(
        "--spread-transform",
        `translateX(${translateX}px) rotate(${rotate}deg)`
      );
    });
  }

  function showMobileCard(index) {
    const visibleCards = getVisibleCards();

    if (!visibleCards.length) return;

    mobileIndex =
      (index + visibleCards.length) % visibleCards.length;

    setActiveCard(visibleCards[mobileIndex]);
  }

  // Card selection
  cards.forEach(card => {
    card.addEventListener("click", () => {
      if (isMobile()) {
        const visibleCards = getVisibleCards();
        const index = visibleCards.indexOf(card);

        if (card === activeCard) {
          showMobileCard(mobileIndex + 1);
        } else {
          showMobileCard(index);
        }
      } else {
        setActiveCard(card === activeCard ? null : card);
      }
    });
  });

  // Flip to back
  document.querySelectorAll(".icon-next").forEach(icon => {
    icon.addEventListener("click", event => {
      event.stopPropagation();

      const card = event.target.closest(".card");
      card.querySelector(".card-inner").classList.add("flipped");

      setActiveCard(card);
    });
  });

  // Flip to front
  document.querySelectorAll(".icon-back").forEach(icon => {
    icon.addEventListener("click", event => {
      event.stopPropagation();

      const card = event.target.closest(".card");
      card.querySelector(".card-inner").classList.remove("flipped");

      setActiveCard(card);
    });
  });

  // Filter players
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const position = button.dataset.position;

      cards.forEach(card => {
        const matches =
          position === "All" ||
          card.dataset.position === position;

        card.style.display = matches ? "block" : "none";

        card.classList.remove("active");
        card.querySelector(".card-inner")
          .classList.remove("flipped");
      });

      filterButtons.forEach(btn => {
        btn.classList.toggle("active", btn === button);
      });

      activeCard = null;
      mobileIndex = 0;

      resetSpread();
      restackVisibleCards();

      if (isMobile()) {
        showMobileCard(0);
      }
    });
  });

  // Desktop hover spread
  cardDeck.addEventListener("mouseenter", () => {
    applyDynamicSpread();
  });

  cardDeck.addEventListener("mouseleave", () => {
    resetSpread();
  });

  // Adjust when resizing the screen
  window.addEventListener("resize", () => {
    resetSpread();

    if (isMobile()) {
      const visibleCards = getVisibleCards();
      const index = visibleCards.indexOf(activeCard);
      showMobileCard(index >= 0 ? index : 0);
    } else {
      restackVisibleCards();
    }
  });

  // Initial setup
  restackVisibleCards();

  if (isMobile()) {
    showMobileCard(0);
  }
});
