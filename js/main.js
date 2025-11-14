document.addEventListener("DOMContentLoaded", function () {
  const mainContent = document.getElementById("main-content");
  const mainProjectsPage = document.getElementById("main-projects-page");

  function createProjectCard(project) {
    const liveLinkHTML =
      project.liveLink && project.liveLink !== "#"
        ? `<a href="${project.liveLink}" target="_blank" title="Ver demonstração ao vivo" class="text-slate-300 hover:text-accent transition-colors">
                        <i data-lucide="external-link" class="w-6 h-6"></i>
                    </a>`
        : "";

    return `
                    <div class="bg-slate-800 rounded-lg overflow-hidden flex flex-col group hover:-translate-y-2 transition-transform duration-300">
                        <img src="${project.imageUrl}" alt="Imagem do projeto ${project.title}" class="project-card-image">
                        <div class="p-6 flex flex-col flex-grow">
                            <h3 class="text-xl font-bold text-slate-100 mb-2">${project.title}</h3>
                            <p class="text-slate-400 mb-4 flex-grow">${project.description}</p>
                            <div class="mt-auto flex justify-end space-x-4">
                                <a href="${project.repoLink}" target="_blank" title="Ver código no GitHub" class="text-slate-300 hover:text-accent transition-colors">
                                    <i data-lucide="github" class="w-6 h-6"></i>
                                </a>
                                ${liveLinkHTML}
                            </div>
                        </div>
                    </div>
                `;
  }

  function populateAllProjects() {
    for (const category in projects) {
      const container = document.getElementById(`${category}-container`);
      if (container) {
        container.innerHTML = projects[category]
          .map(createProjectCard)
          .join("");
      }
    }
  }

  function populateMainProjects() {
    const container = document.getElementById("main-projects-container");
    const featuredProjects = [];
    for (const category in projects) {
      projects[category].forEach((project) => {
        if (project.isFeatured) {
          featuredProjects.push(project);
        }
      });
    }
    container.innerHTML = featuredProjects
      .map(createProjectCard)
      .join("");
  }

  function showMainContent() {
    mainContent.classList.remove("hidden");
    mainProjectsPage.classList.add("hidden");
    window.scrollTo(0, 0);
  }

  function showMainProjects() {
    mainContent.classList.add("hidden");
    mainProjectsPage.classList.remove("hidden");
    window.scrollTo(0, 0);
  }

  // --- Lógica Principal da Página ---
  populateAllProjects();
  populateMainProjects();
  lucide.createIcons();

  // Page toggle listeners
  document
    .getElementById("main-projects-link")
    .addEventListener("click", showMainProjects);
  document
    .getElementById("main-projects-link-mobile")
    .addEventListener("click", showMainProjects);
  document
    .getElementById("home-link")
    .addEventListener("click", showMainContent);
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault(); // Previne o comportamento padrão do link
      showMainContent();
      // Garante que o conteúdo principal esteja visível antes de rolar
      setTimeout(() => {
        const targetId = e.target.getAttribute("href");
        document
          .querySelector(targetId)
          .scrollIntoView({ behavior: "smooth" });
      }, 50); // Um pequeno delay pode ajudar
    });
  });

  // Mobile menu
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    const icon = mobileMenuButton.querySelector("i");
    icon.setAttribute(
      "data-lucide",
      mobileMenu.classList.contains("hidden") ? "menu" : "x"
    );
    lucide.createIcons();
  });

  // Typing effect
  const typingText = document.getElementById("typing-text");
  const words = ["web.", "futuro.", "inovação."];
  let wordIndex = 0,
    charIndex = 0,
    isDeleting = false;
  function type() {
    const currentWord = words[wordIndex];
    const typeSpeed = isDeleting ? 100 : 200;
    typingText.textContent = currentWord.substring(0, charIndex);
    if (!isDeleting && charIndex < currentWord.length) charIndex++;
    else if (isDeleting && charIndex > 0) charIndex--;
    else {
      isDeleting = !isDeleting;
      if (!isDeleting) wordIndex = (wordIndex + 1) % words.length;
    }
    setTimeout(type, isDeleting ? typeSpeed / 2 : typeSpeed);
  }
  type();

  // Scroll animations
  const faders = document.querySelectorAll(".fade-in-section");
  const appearOnScroll = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );
  faders.forEach((fader) => appearOnScroll.observe(fader));

  // Skills progress animation
  const skillsSection = document.getElementById("skills");
  const skillCards = document.querySelectorAll(".skill-card");
  const circumference = 2 * Math.PI * 45; // raio = 45

  function animateSkillProgress(card) {
    const skillValue = parseInt(card.getAttribute("data-skill"));
    const progressRing = card.querySelector(".progress-ring");
    const percentageText = card.querySelector(".skill-percentage");
    
    const offset = circumference - (skillValue / 100) * circumference;
    progressRing.style.strokeDashoffset = offset;
    
    // Animate percentage text
    let current = 0;
    const increment = skillValue / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= skillValue) {
        current = skillValue;
        clearInterval(timer);
      }
      percentageText.textContent = Math.round(current) + "%";
    }, 30);
  }

  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          skillCards.forEach((card, index) => {
            setTimeout(() => {
              animateSkillProgress(card);
            }, index * 100); // Stagger animation
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }

  // Header visibility
  let lastScrollTop = 0;
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    let scrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    header.style.top =
      scrollTop > lastScrollTop && scrollTop > 100 ? "-100px" : "0";
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
});

