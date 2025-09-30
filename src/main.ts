// main.ts
import { initThemeToggle } from './ui/theme-toggle';
import { seed, ClassData } from './data/curriculum';
import { initHeroScene } from './three/hero-scene';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize theme toggle
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    initThemeToggle(themeBtn);
  }

  // Initialize 3D scene
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    try {
      await initHeroScene(heroCanvas);
      console.log('3D scene initialized');
    } catch (error) {
      console.error('Failed to initialize 3D scene:', error);
    }
  }

  // Add scroll animations
  setupScrollAnimations();

  // Render class cards
  renderClassCards();

  // Set up event listeners
  setupEventListeners();

  // Log initialization
  console.log('RAAH Learning Platform initialized');
});

/**
 * Renders class cards in the class grid
 */
function renderClassCards(): void {
  const classGrid = document.getElementById('classGrid');
  if (!classGrid) return;

  // Clear existing content
  classGrid.innerHTML = '';

  // Create a card for each class
  seed.forEach((classData) => {
    const card = document.createElement('div');
    card.className = 'class-card';
    card.setAttribute('data-class-id', classData.id);
    
    // Count total subjects across all streams
    const totalSubjects = classData.streams.reduce(
      (sum, stream) => sum + stream.subjects.length, 0
    );

    card.innerHTML = `
      <h3>${classData.name}</h3>
      <p>${classData.streams.length} Stream${classData.streams.length !== 1 ? 's' : ''}</p>
      <p>${totalSubjects} Subject${totalSubjects !== 1 ? 's' : ''} Total</p>
      <button class="view-details" data-class-id="${classData.id}">View Details</button>
    `;

    classGrid.appendChild(card);
  });
}

/**
 * Sets up scroll animations using GSAP ScrollTrigger
 */
function setupScrollAnimations(): void {
  // Animate header on scroll
  const header = document.querySelector('.app-header');
  if (header) {
    ScrollTrigger.create({
      start: 'top -50',
      end: 'max',
      onUpdate: (self) => {
        if (self.direction === 1 && self.progress > 0.1) {
          header.classList.add('scrolled');
        } else if (self.direction === -1 && self.progress < 0.1) {
          header.classList.remove('scrolled');
        }
      }
    });
  }

  // Animate sections on scroll
  gsap.utils.toArray('section').forEach((section: any) => {
    if (section.id === 'hero') return;
    
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });
}

/**
 * Sets up event listeners for the application
 */
function setupEventListeners(): void {
  // Handle class card clicks using event delegation
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    
    // Handle view details button click
    if (target.matches('.view-details') || target.closest('.view-details')) {
      const button = target.matches('.view-details') 
        ? target as HTMLButtonElement 
        : target.closest('.view-details') as HTMLButtonElement;
      
      const classId = button.getAttribute('data-class-id');
      if (classId) {
        showClassDetails(classId);
      }
    }

    // Handle modal close button
    if (target.matches('.close-modal') || target.closest('.close-modal')) {
      closeModal();
    }
  });

  // Close modal when clicking outside content
  document.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    const modalContent = document.querySelector('.modal-content');
    
    if (modal && modalContent && e.target === modal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Try demo button with animation
  const tryDemoBtn = document.getElementById('tryDemo');
  if (tryDemoBtn) {
    // Add pulse animation
    tryDemoBtn.classList.add('pulse');
    
    tryDemoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Button press animation
      gsap.to(tryDemoBtn, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          // Smooth scroll to classes section
          const classesSection = document.getElementById('classes');
          if (classesSection) {
            window.scrollTo({
              top: classesSection.offsetTop - 80,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }
}

/**
 * Shows details for a specific class with smooth animations
 * @param classId The ID of the class to show details for
 */
function showClassDetails(classId: string): void {
  const classData = seed.find(cls => cls.id === classId);
  if (!classData) return;

  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modalBody');
  
  if (!modal || !modalBody) return;

  // Create modal content
  let modalContent = `
    <h2>${classData.name} - Streams & Subjects</h2>
    <div class="streams-container">
  `;

  // Add content for each stream
  classData.streams.forEach((stream, streamIndex) => {
    modalContent += `
      <div class="stream-section" style="opacity: 0; transform: translateY(20px);">
        <h3>${stream.name}</h3>
        <div class="subjects-grid">
    `;

    // Add subjects for this stream
    stream.subjects.forEach((subject, subjectIndex) => {
      modalContent += `
        <div class="subject-card" style="opacity: 0; transform: translateY(10px);">
          <h4>${subject.name}</h4>
          <p>${subject.topics.length} topics</p>
        </div>
      `;
    });

    modalContent += `
        </div>
      </div>
    `;
  });

  modalContent += `
    </div>
    <div class="modal-actions" style="opacity: 0; transform: translateY(20px);">
      <button class="button primary" id="startLearning">Start Learning</button>
      <button class="button secondary" id="closeModal">Close</button>
    </div>
  `;

  // Update modal and show it
  modalBody.innerHTML = modalContent;
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Animate modal entrance
  gsap.to(modal, {
    opacity: 1,
    duration: 0.3,
    ease: 'power2.out'
  });

  // Animate modal content
  gsap.to('.modal-content', {
    y: 0,
    opacity: 1,
    duration: 0.5,
    ease: 'back.out(1.4)'
  });

  // Animate stream sections with stagger
  gsap.to('.stream-section', {
    opacity: 1,
    y: 0,
    duration: 0.4,
    stagger: 0.1,
    delay: 0.3,
    ease: 'power2.out'
  });

  // Animate subject cards with stagger
  gsap.to('.subject-card', {
    opacity: 1,
    y: 0,
    duration: 0.3,
    stagger: 0.05,
    delay: 0.5,
    ease: 'power2.out'
  });

  // Animate modal actions
  gsap.to('.modal-actions', {
    opacity: 1,
    y: 0,
    duration: 0.4,
    delay: 0.7,
    ease: 'power2.out'
  });

  // Add event listeners for modal buttons
  const closeModalBtn = document.getElementById('closeModal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  const startLearningBtn = document.getElementById('startLearning');
  if (startLearningBtn) {
    startLearningBtn.addEventListener('click', () => {
      // Add click animation
      gsap.to(startLearningBtn, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          showDemoAlert('Learning session will start here!');
        }
      });
    });
  }
}

/**
 * Closes the modal dialog with animation
 */
function closeModal(): void {
  const modal = document.getElementById('modal');
  if (!modal) return;

  // Animate modal exit
  gsap.to(modal, {
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });

  // Animate modal content exit
  gsap.to('.modal-content', {
    y: 50,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in'
  });
}

/**
 * Shows a styled toast notification instead of default alert
 */
function showDemoAlert(message: string = 'Demo feature coming soon!'): void {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  
  // Add to body
  document.body.appendChild(toast);
  
  // Animate in
  gsap.fromTo(toast, 
    { y: 20, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        // Auto-remove after delay
        setTimeout(() => {
          gsap.to(toast, {
            y: -20,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
              document.body.removeChild(toast);
            }
          });
        }, 3000);
      }
    }
  );
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    gsap.to(toast, {
      y: -20,
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        document.body.removeChild(toast);
      }
    });
  });
  
  toast.appendChild(closeBtn);
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .toast-notification {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--surface-elevated);
      color: var(--text);
      padding: 1rem 2.5rem 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      max-width: 300px;
      font-size: 0.95rem;
      border-left: 4px solid var(--accent);
      transform: translateY(20px);
      opacity: 0;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    
    .toast-close {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.2rem;
      line-height: 1;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    
    .toast-close:hover {
      color: var(--text);
      background: rgba(255, 255, 255, 0.1);
    }
  `;
  
  document.head.appendChild(style);
}

// Export types and functions that might be used in other modules
export type { ClassData };

// Make functions available globally for debugging if needed
declare global {
  interface Window {
    showClassDetails: (classId: string) => void;
    closeModal: () => void;
  }
}

// Add to window for debugging
if (typeof window !== 'undefined') {
  window.showClassDetails = showClassDetails;
  window.closeModal = closeModal;
}
