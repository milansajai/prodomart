document.addEventListener('DOMContentLoaded', () => {
  /* EASTER EGG */
  const logo = document.querySelector('.manifesto-logo');
  logo.addEventListener('click', () => {
    document.documentElement.classList.toggle('night-mode');
  });

  /* SEARCH LOGIC */
  const searchInput = document.getElementById('global-search');
  const vessels = document.querySelectorAll('.product-vessel');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      vessels.forEach(node => {
        const textContent = node.textContent.toLowerCase();
        const tagContent = (node.dataset.tags || '').toLowerCase();
        const contentMatch = textContent.includes(term) || tagContent.includes(term);
        // Brutal display toggle
        node.style.display = contentMatch ? '' : 'none';
      });
    });
  }

  /* FORM VALIDATION */
  const validateField = (input, errorContainer, message) => {
    if (!input.value.trim() || (input.type === 'email' && !input.value.includes('@'))) {
      input.parentElement.classList.add('error-state');
      if (errorContainer) errorContainer.textContent = `ERR: ${message}`;
      return false;
    } else {
      input.parentElement.classList.remove('error-state');
      if (errorContainer) errorContainer.textContent = '';
      return true;
    }
  };

  const bindForm = (formId, fieldsData, originalButtonText, getMailtoUrl) => {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      let isValid = true;
      
      fieldsData.forEach(field => {
        const input = document.getElementById(field.id);
        const err = document.getElementById('err-' + field.id);
        if (!validateField(input, err, field.errMessage)) {
          isValid = false;
        }
      });
      
      if (isValid) {
        if (getMailtoUrl) {
          window.location.href = getMailtoUrl();
        }

        const btn = form.querySelector('.action-execute');
        btn.textContent = 'TRANSMITTED.';
        btn.style.backgroundColor = 'var(--color-primary)';
        btn.style.color = 'var(--color-base)';
        btn.style.pointerEvents = 'none';
        
        setTimeout(() => {
          form.reset();
          btn.textContent = originalButtonText;
          btn.style.pointerEvents = 'auto';
          btn.style.backgroundColor = 'var(--color-base)';
          btn.style.color = 'var(--color-primary)';
        }, 3000);
      }
    });

    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.parentElement.classList.remove('error-state');
        const err = document.getElementById('err-' + input.id);
        if(err) err.textContent = '';
      });
    });
  };

  bindForm('bunker-form', [
    { id: 'identifier', errMessage: 'MANDATORY NAME MISSING' },
    { id: 'comm-link', errMessage: 'INVALID EMAIL LINK' },
    { id: 'justification', errMessage: 'INSUFFICIENT DETAILS PROVIDED' }
  ], 'SUBMIT INQUIRY', () => {
    const name = document.getElementById('identifier').value;
    const email = document.getElementById('comm-link').value;
    const details = document.getElementById('justification').value;
    const subject = encodeURIComponent(`Orders/Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nDetails:\n${details}`);
    return `mailto:prodomartofficialmail@gmail.com?subject=${subject}&body=${body}`;
  });

  bindForm('product-form', [
    { id: 'prod-name', errMessage: 'PRODUCT NAME MISSING' },
    { id: 'prod-email', errMessage: 'INVALID CONTACT LINK' },
    { id: 'prod-desc', errMessage: 'INSUFFICIENT DESCRIPTION PROVIDED' }
  ], 'SUBMIT PRODUCT', () => {
    const name = document.getElementById('prod-name').value;
    const email = document.getElementById('prod-email').value;
    const details = document.getElementById('prod-desc').value;
    const subject = encodeURIComponent(`Product Submission: ${name}`);
    const body = encodeURIComponent(`Product: ${name}\nContact: ${email}\n\nDescription:\n${details}`);
    return `mailto:prodomartofficialmail@gmail.com?subject=${subject}&body=${body}`;
  });


  /* REVIEWS DATA */
  const PRODUCT_REVIEWS = {
    "VSL-A01": [
      { rating: 5, user: "OPERATOR_09", comment: "Absolute precision. The steel weight is perfect. Best timepiece in the archive." },
      { rating: 4, user: "UNIT_B4", comment: "Meets all operational requirements. Design is uncompromising and strict." }
    ],
    "VSL-A02": [
      { rating: 5, user: "LOGS_CHIEF", comment: "Isolates external frequency interference with 99% efficiency. Mandatory for deep operations." },
      { rating: 5, user: "USER_771", comment: "The build quality is industrial grade. No plastic. Just utility." }
    ],
    "VSL-A03": [
      { rating: 4, user: "RADIO_STATIC", comment: "Analog dials feel tactile. Signal reception is clear across standard bans." },
      { rating: 5, user: "VINTAGE_OP", comment: "A masterpiece of analog engineering. Fits the Prodomart standard perfectly." }
    ],
    "VSL-A04": [
      { rating: 5, user: "OPTIC_LENS", comment: "Zero distortion. Chromatic aberration is non-existent. Sourced for the serious." },
      { rating: 4, user: "CAPTURE_UNIT", comment: "Heavy, but reliable. The prime focal length is exactly what was indexed." }
    ],
    "VSL-A05": [
      { rating: 5, user: "INPUT_MASTER", comment: "Tactile feedback is unmatched. Each keystroke feels like a physical commitment." },
      { rating: 5, user: "CODE_RUNNER", comment: "Built for the long shifts. The anti-mass interface we needed." }
    ],
    "VSL-B01": [
      { rating: 5, user: "CORE_LOGIC", comment: "Handles high thermal loads without throttle. The silicon quality is tier 1." },
      { rating: 4, user: "THERMAL_OP", comment: "Requires serious cooling, but the throughput is undeniable." }
    ],
    "VSL-B02": [
      { rating: 5, user: "CLICK_CLACK", comment: "The sound of progress. Strictly mechanical. Strictly loud." },
      { rating: 5, user: "UNIT_99", comment: "Built to last a lifetime of inputs. No fatigue detected." }
    ],
    "VSL-B03": [
      { rating: 4, user: "FRAME_WORKS", comment: "Magnesium alloy body feels indestructible. A professional tool for the field." },
      { rating: 5, user: "ISO_SENSITIVE", comment: "Dynamic range is superior. Best body in Row B." }
    ],
    "VSL-B04": [
      { rating: 5, user: "FORGE_HAND", comment: "Direct forge hardware. Used it in the rig for 6 months. Zero wear." },
      { rating: 4, user: "TOOL_USER", comment: "Solid utility. Does exactly what the manifest says." }
    ]
  };

  /* REVIEW TERMINAL LOGIC */
  const terminal = document.getElementById('review-terminal');
  const terminalContent = document.getElementById('terminal-content');
  const terminalVesselId = document.getElementById('terminal-vessel-id');
  const closeBtn = document.getElementById('close-terminal');

  const getRatingBlocks = (rating) => {
    return '◆'.repeat(rating) + '◇'.repeat(5 - rating);
  };

  const openTerminal = (vesselId) => {
    const reviews = PRODUCT_REVIEWS[vesselId] || [];
    terminalVesselId.textContent = `${vesselId} // ARCHIVE_DATA`;
    
    terminalContent.innerHTML = reviews.map(rev => `
      <div class="review-item">
        <div class="review-meta">
          <span class="operator-id">${rev.user}</span>
          <span class="rating-blocks">${getRatingBlocks(rev.rating)}</span>
        </div>
        <div class="review-comment">
          "${rev.comment}"
        </div>
      </div>
    `).join('') || '<p class="body-mono">NO REVIEW DATA FOUND IN ARCHIVE.</p>';
    
    terminal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Lock scroll
  };

  const closeTerminal = () => {
    terminal.classList.add('hidden');
    document.body.style.overflow = ''; // Unlock scroll
  };

  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
  
  // Close on ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTerminal();
  });

  /* BIND VESSELS */
  vessels.forEach(vessel => {
    vessel.addEventListener('click', () => {
      const vesselId = vessel.dataset.vesselId;
      if (vesselId) openTerminal(vesselId);
    });
    // Add cursor style to imply interactivity
    vessel.style.cursor = 'pointer';
  });

  /* BACK TO TOP LOGIC */
  const backToTopBtn = document.getElementById('back-to-top');
  const manifesto = document.getElementById('manifesto');
  if (backToTopBtn && manifesto) {
    window.addEventListener('scroll', () => {
      const manifestoBottom = manifesto.offsetTop + manifesto.offsetHeight;
      if (window.scrollY > manifestoBottom - 100) {
        backToTopBtn.classList.remove('hidden');
      } else {
        backToTopBtn.classList.add('hidden');
      }
    });
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
