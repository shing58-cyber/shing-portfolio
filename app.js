const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const burgerBtn = document.getElementById('burgerBtn');
const mainNav = document.getElementById('main-nav');

if (burgerBtn && mainNav) {
  const navLinks = mainNav.querySelectorAll('a');

  const closeMenu = () => {
    mainNav.classList.remove('is-open');
    burgerBtn.classList.remove('is-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.setAttribute('aria-label', 'Ouvrir le menu');
    document.body.classList.remove('nav-open');
  };

  const openMenu = () => {
    mainNav.classList.add('is-open');
    burgerBtn.classList.add('is-open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    burgerBtn.setAttribute('aria-label', 'Fermer le menu');
    document.body.classList.add('nav-open');
  };

  burgerBtn.addEventListener('click', () => {
    const isOpen = mainNav.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
      closeMenu();
      burgerBtn.focus();
    }
  });
}

const typedRoleEl = document.getElementById('typedRole');
const roles = [
  'Développeur web junior',
  'Rigoureux sur la structure et la lisibilité',
  'Attentif au mobile et à l’accessibilité'
];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typedRoleEl && !reduceMotion) {
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const typeLoop = () => {
    const currentRole = roles[roleIndex];

    if (!deleting) {
      charIndex += 1;
      typedRoleEl.textContent = currentRole.slice(0, charIndex);
      if (charIndex === currentRole.length) {
        deleting = true;
        window.setTimeout(typeLoop, 1300);
        return;
      }
    } else {
      charIndex -= 1;
      typedRoleEl.textContent = currentRole.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    window.setTimeout(typeLoop, deleting ? 32 : 54);
  };

  typeLoop();
}

const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length) {
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('reveal-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach((el) => revealObserver.observe(el));
  }
}

const copyBtn = document.getElementById('copyEmailBtn');
const copyFeedback = document.getElementById('copyFeedback');

if (copyBtn && copyFeedback) {
  copyBtn.addEventListener('click', async () => {
    const email = copyBtn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      copyFeedback.textContent = `Adresse copiée : ${email}`;
    } catch (error) {
      copyFeedback.textContent = `Copie impossible : ${email}`;
    }

    window.setTimeout(() => {
      copyFeedback.textContent = '';
    }, 3500);
  });
}

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const formFeedback = document.getElementById('formFeedback');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setError = (input, errorEl, isValid, message) => {
    input.dataset.touched = 'true';
    errorEl.textContent = isValid ? '' : message;
    return isValid;
  };

  const validateName = () => setError(
    nameInput,
    nameError,
    nameInput.value.trim().length >= 2,
    'Merci de saisir un nom d’au moins 2 caractères.'
  );

  const validateEmail = () => setError(
    emailInput,
    emailError,
    emailPattern.test(emailInput.value.trim()),
    'Merci de renseigner une adresse e-mail valide.'
  );

  const validateMessage = () => setError(
    messageInput,
    messageError,
    messageInput.value.trim().length >= 10,
    'Votre message doit contenir au moins 10 caractères.'
  );

  [
    [nameInput, validateName],
    [emailInput, validateEmail],
    [messageInput, validateMessage]
  ].forEach(([input, validator]) => {
    input.addEventListener('blur', validator);
    input.addEventListener('input', () => {
      if (input.dataset.touched === 'true') {
        validator();
      }
    });
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMessageValid = validateMessage();

    if (isNameValid && isEmailValid && isMessageValid) {
      formFeedback.textContent = `Merci ${nameInput.value.trim()} ! Votre message a bien été validé côté interface.`;
      contactForm.reset();
      [nameInput, emailInput, messageInput].forEach((input) => {
        input.dataset.touched = 'false';
      });
      [nameError, emailError, messageError].forEach((el) => {
        el.textContent = '';
      });
    } else {
      formFeedback.textContent = 'Le formulaire contient encore des champs à corriger.';
    }
  });
}