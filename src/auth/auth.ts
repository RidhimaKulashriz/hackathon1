// Auth module for handling login and signup

export function initAuth() {
  // Get DOM elements
  const authModal = document.getElementById('authModal');
  const closeAuthModal = document.getElementById('closeAuthModal');
  const showSignUp = document.getElementById('showSignUp');
  const showSignIn = document.getElementById('showSignIn');
  const signInForm = document.getElementById('signInForm') as HTMLDivElement;
  const signUpForm = document.getElementById('signUpForm') as HTMLDivElement;
  const signInFormElement = document.getElementById('signInFormElement') as HTMLFormElement;
  const signUpFormElement = document.getElementById('signUpFormElement') as HTMLFormElement;
  const loginButton = document.querySelector('.login-btn');

  // Check if elements exist
  if (!authModal || !closeAuthModal || !showSignUp || !showSignIn || 
      !signInForm || !signUpForm || !signInFormElement || !signUpFormElement) {
    console.error('Auth elements not found');
    return;
  }

  // Show auth modal
  function showAuthModal() {
    authModal?.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  // Hide auth modal
  function hideAuthModal() {
    authModal?.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
  }

  // Switch to sign up form
  function showSignUpForm() {
    signInForm.style.display = 'none';
    signUpForm.style.display = 'block';
  }

  // Switch to sign in form
  function showSignInForm() {
    signUpForm.style.display = 'none';
    signInForm.style.display = 'block';
  }

  // Handle sign in form submission
  async function handleSignIn(e: Event) {
    e.preventDefault();
    
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    // Basic validation
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      // Here you would typically make an API call to your backend
      console.log('Signing in with:', { email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On successful login
      alert('Successfully signed in!');
      hideAuthModal();
      updateAuthUI(true);
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Failed to sign in. Please try again.');
    }
  }

  // Handle sign up form submission
  async function handleSignUp(e: Event) {
    e.preventDefault();
    
    const name = (document.getElementById('signupName') as HTMLInputElement).value;
    const email = (document.getElementById('signupEmail') as HTMLInputElement).value;
    const password = (document.getElementById('signupPassword') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Here you would typically make an API call to your backend
      console.log('Signing up with:', { name, email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On successful signup
      alert('Account created successfully! Please sign in.');
      showSignInForm();
    } catch (error) {
      console.error('Sign up error:', error);
      alert('Failed to create account. Please try again.');
    }
  }

  // Update UI based on authentication state
  function updateAuthUI(isAuthenticated: boolean) {
    // You can update UI elements based on auth state
    // For example, show/hide login button, show user info, etc.
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
      if (isAuthenticated) {
        loginBtn.textContent = 'Logout';
        loginBtn.classList.add('logged-in');
      } else {
        loginBtn.textContent = 'Login';
        loginBtn.classList.remove('logged-in');
      }
    }
  }

  // Event listeners
  closeAuthModal?.addEventListener('click', hideAuthModal);
  showSignUp?.addEventListener('click', (e) => {
    e.preventDefault();
    showSignUpForm();
  });
  showSignIn?.addEventListener('click', (e) => {
    e.preventDefault();
    showSignInForm();
  });
  signInFormElement?.addEventListener('submit', handleSignIn);
  signUpFormElement?.addEventListener('submit', handleSignUp);

  // Close modal when clicking outside the form
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
      hideAuthModal();
    }
  });

  // Add login button to header if it doesn't exist
  if (!document.querySelector('.login-btn') && document.querySelector('.app-header')) {
    const loginBtn = document.createElement('button');
    loginBtn.className = 'login-btn';
    loginBtn.textContent = 'Login';
    document.querySelector('.app-header')?.appendChild(loginBtn);
    
    loginBtn.addEventListener('click', () => {
      if (loginBtn.classList.contains('logged-in')) {
        // Logout
        updateAuthUI(false);
      } else {
        // Show login form
        showAuthModal();
        showSignInForm();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideAuthModal();
    }
  });

  // Initialize auth state
  updateAuthUI(false);
}
