document.addEventListener('DOMContentLoaded', () => {
    // Dom elements//
    // Sections
    const authSection = document.getElementById('auth-section');
    const mainApp = document.getElementById('main-app');
    const mainFooter = document.getElementById('main-footer');
    const logoutBtn = document.getElementById('logout-btn');

    // Auth
    const authForm = document.getElementById('auth-form');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const authSwitchBtn = document.getElementById('auth-switch-btn');
    const authSwitchText = document.getElementById('auth-switch-text');
    const signupFields = document.getElementById('signup-fields');
    
    // Auth Inputs
    const authName = document.getElementById('auth-name');
    const authEmail = document.getElementById('auth-email');
    const authPassword = document.getElementById('auth-password');
    const authGender = document.getElementById('auth-gender');
    const authAge = document.getElementById('auth-age');
    const authWeight = document.getElementById('auth-weight');

    // Dashboard
    const userGreeting = document.getElementById('user-greeting');
    const currentDateEl = document.getElementById('current-date');
    const resetTodayBtn = document.getElementById('reset-today-btn');
    const waterFill = document.getElementById('water-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    const dailyGoalText = document.getElementById('daily-goal-text');
    const currentIntakeText = document.getElementById('current-intake-text');
    const remainingText = document.getElementById('remaining-text');
    const motivationText = document.getElementById('motivation-text');

    // Controls
    const addBtns = document.querySelectorAll('.add-btn');
    const customAmount = document.getElementById('custom-amount');
    const customAddBtn = document.getElementById('custom-add-btn');
    const voiceBtn = document.getElementById('voice-btn');

    // BMI
    const bmiHeight = document.getElementById('bmi-height');
    const bmiWeightInput = document.getElementById('bmi-weight-input');
    const calcBmiBtn = document.getElementById('calc-bmi-btn');
    const bmiResult = document.getElementById('bmi-result');
    const bmiScore = document.getElementById('bmi-score');
    const bmiBadge = document.getElementById('bmi-badge');

    // Chart
    const chartBtns = document.querySelectorAll('.chart-btn');
    const chartCanvas = document.getElementById('hydrationChart');
    let hydrationChartInstance = null;

    // Chatbot
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatMessages = document.getElementById('chat-messages');

    // Feedback & Email
    const openFeedbackBtn = document.getElementById('open-feedback-btn');
    const feedbackPage = document.getElementById('feedback-page');
    const backToDashboardBtn = document.getElementById('back-to-dashboard-btn');
    const feedbackForm = document.getElementById('feedback-form');
    const starRatingIcons = document.querySelectorAll('#star-rating i');
    const emailReminderBtn = document.getElementById('email-reminder-btn');

    // Navigation
    const navDashboard = document.getElementById('nav-dashboard');
    const navHistory = document.getElementById('nav-history');
    const navResources = document.getElementById('nav-resources');

    const dashboardSection = document.getElementById('dashboard');
    const historySection = document.getElementById('history');
    const healthLinksSection = document.getElementById('health-links');
    const aboutSection = document.getElementById('about');

    // Globals
    const alertsContainer = document.getElementById('alerts-container');
    const quotesContainer = document.getElementById('quotes-container');
    const themeToggle = document.getElementById('theme-toggle');
    const successSound = document.getElementById('success-sound');

    // State
    let isLoginMode = false;
    let currentUser = null;
    let appData = {
        goal: 2000,
        currentIntake: 0,
        lastDate: new Date().toLocaleDateString(),
        history: []
    };

    const motivationalQuotes = [
        "Water is the driving force of all nature.",
        "Stay hydrated. Your future self will thank you.",
        "Drink your water and mind your business.",
        "Hydration is a daily necessity, not a choice.",
        "A well-hydrated body is a healthy body."
    ];

    const chatbotResponses = {
        "hello": "Hi there! How can I help you hydrate today?",
        "hi": "Hello! Need any hydration tips?",
        "goal": "Your daily goal is calculated based on your weight: Weight(kg) x 33ml.",
        "how much": "A general rule is 8 glasses a day, but it varies by body weight and activity.",
        "benefits": "Water improves skin health, boosts energy, aids digestion, and prevents headaches.",
        "default": "I'm not sure about that. Try asking about 'goal', 'how much' to drink, or 'benefits' of water!"
    };

    // Initialization
    function init() {
        initTheme();
        
        const loader = document.getElementById('loader');
        loader.style.display = 'flex';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);

        // Check if user is logged in
        const savedUser = localStorage.getItem('aquaTrack_currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            loadUserData();
            showMainApp();
        } else {
            showAuthSection();
        }

        updateDate();
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('aquaTrack_theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('aquaTrack_theme', next);
            updateThemeIcon(next);
        });
    }

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    //alerts
    function showAlert(message, type = 'success') {
        const alertBox = document.createElement('div');
        alertBox.className = `alert-box alert-${type}`;
        
        const icon = type === 'success' ? '<i class="fa-solid fa-check-circle" style="color: var(--success)"></i>' : '<i class="fa-solid fa-circle-exclamation" style="color: var(--danger)"></i>';
        
        alertBox.innerHTML = `${icon} <span>${message}</span>`;
        alertsContainer.appendChild(alertBox);

        setTimeout(() => {
            alertBox.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => alertBox.remove(), 300);
        }, 3000);
    }

    function showQuote() {
        // Clear previous quotes
        quotesContainer.innerHTML = '';
        const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        
        const quoteBox = document.createElement('div');
        quoteBox.className = 'quote-popup';
        quoteBox.innerHTML = `"${quote}"`;
        
        quotesContainer.appendChild(quoteBox);

        setTimeout(() => {
            quoteBox.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => quoteBox.remove(), 300);
        }, 4000);
    }

    // Authentication
    authSwitchBtn.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            authTitle.textContent = 'Welcome Back';
            authSubtitle.textContent = 'Login to continue your journey';
            authSubmitBtn.textContent = 'Login';
            authSwitchText.textContent = "Don't have an account?";
            authSwitchBtn.textContent = 'Sign Up';
            signupFields.style.display = 'none';
            // Remove required for hidden fields
            authName.required = false;
            authGender.required = false;
            authAge.required = false;
            authWeight.required = false;
        } else {
            authTitle.textContent = 'Welcome to HyrdroHabit';
            authSubtitle.textContent = 'Sign up to start your hydration journey';
            authSubmitBtn.textContent = 'Create Account';
            authSwitchText.textContent = 'Already have an account?';
            authSwitchBtn.textContent = 'Login';
            signupFields.style.display = 'block';
            // Add required
            authName.required = true;
            authGender.required = true;
            authAge.required = true;
            authWeight.required = true;
        }
    });

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = authEmail.value.trim();
        const password = authPassword.value.trim();

        if (isLoginMode) {
            // Login
            const users = JSON.parse(localStorage.getItem('aquaTrack_users')) || {};
            if (users[email] && users[email].password === password) {
                currentUser = users[email];
                localStorage.setItem('aquaTrack_currentUser', JSON.stringify(currentUser));
                showAlert('Login successful!', 'success');
                loadUserData();
                showMainApp();
            } else {
                showAlert('Invalid email or password', 'error');
            }
        } else {
            // Signup
            const users = JSON.parse(localStorage.getItem('aquaTrack_users')) || {};
            if (users[email]) {
                showAlert('Email already exists. Please login.', 'error');
                return;
            }

            const weight = parseInt(authWeight.value);
            // Calculate goal: Weight in kg * 33ml
            const calculatedGoal = weight * 33;

            currentUser = {
                name: authName.value.trim(),
                email: email,
                password: password,
                gender: authGender.value,
                age: parseInt(authAge.value),
                weight: weight,
                goal: calculatedGoal
            };

            users[email] = currentUser;
            localStorage.setItem('aquaTrack_users', JSON.stringify(users));
            localStorage.setItem('aquaTrack_currentUser', JSON.stringify(currentUser));
            
            showAlert('Account created successfully!', 'success');
            
            // Init appData for new user
            appData = {
                goal: calculatedGoal,
                currentIntake: 0,
                lastDate: new Date().toLocaleDateString(),
                history: []
            };
            saveAppData();
            
            loadUserData();
            showMainApp();
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('aquaTrack_currentUser');
        currentUser = null;
        showAuthSection();
        showAlert('Logged out successfully', 'success');
        authForm.reset();
    });

    function showAuthSection() {
        authSection.style.display = 'flex';
        mainApp.style.display = 'none';
        mainFooter.style.display = 'none';
        document.getElementById('chatbot-wrapper').style.display = 'none';
    }

    function showMainApp() {
        authSection.style.display = 'none';
        mainApp.style.display = 'block';
        mainFooter.style.display = 'block';
        document.getElementById('chatbot-wrapper').style.display = 'block';
    }

    // User data and tracking
    function loadUserData() {
        if (!currentUser) return;
        
        userGreeting.textContent = `Hello, ${currentUser.name.split(' ')[0]} 👋`;
        
        const savedData = localStorage.getItem(`aquaTrack_data_${currentUser.email}`);
        if (savedData) {
            appData = JSON.parse(savedData);
        } else {
            appData.goal = currentUser.goal || (currentUser.weight * 33);
        }

        checkNewDay();
        updateDashboardUI();
        initChart();
    }

    function saveAppData() {
        if (!currentUser) return;
        localStorage.setItem(`aquaTrack_data_${currentUser.email}`, JSON.stringify(appData));
    }

    function updateDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateEl.textContent = new Date().toLocaleDateString('en-US', options);
    }

    function checkNewDay() {
        const today = new Date().toLocaleDateString();
        if (appData.lastDate !== today) {
            // Save history
            appData.history.push({
                date: appData.lastDate,
                intake: appData.currentIntake,
                goal: appData.goal
            });
            
            // Keep last 30 days
            if (appData.history.length > 30) {
                appData.history.shift();
            }

            // Reset
            appData.currentIntake = 0;
            appData.lastDate = today;
            saveAppData();
        }
    }

    function addWater(amount) {
        const prevIntake = appData.currentIntake;
        appData.currentIntake += amount;
        saveAppData();
        updateDashboardUI();
        showQuote();

        // Check if goal just reached
        if (prevIntake < appData.goal && appData.currentIntake >= appData.goal) {
            triggerGoalReached();
        } else {
            showAlert(`Added ${amount}ml of water!`, 'success');
        }
        
        updateChartData();
    }

    function updateDashboardUI() {
        const percentage = Math.min((appData.currentIntake / appData.goal) * 100, 100).toFixed(0);
        const remaining = Math.max(appData.goal - appData.currentIntake, 0);

        dailyGoalText.textContent = `${appData.goal} ml`;
        currentIntakeText.textContent = `${appData.currentIntake} ml`;
        remainingText.textContent = `${remaining} ml`;
        progressPercentage.textContent = `${percentage}%`;

        // Bottle Animation
        waterFill.style.height = `${percentage}%`;

        // Motivation Text
        if (percentage == 0) motivationText.textContent = "Let's start hydrating! 💧";
        else if (percentage < 50) motivationText.textContent = "Good start! Keep it up! 👍";
        else if (percentage < 100) motivationText.textContent = "Almost there! Keep going! 🚀";
        else motivationText.textContent = "Goal reached! Amazing job! 🏆";
    }

    function triggerGoalReached() {
        showAlert("Daily Goal Reached! 🎉", "success");
        try {
            successSound.volume = 0.5;
            successSound.play().catch(e => console.log("Audio play prevented", e));
        } catch(e) {}
    }

    // Action Listeners
    addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const amount = parseInt(btn.getAttribute('data-amount'));
            addWater(amount);
        });
    });

    customAddBtn.addEventListener('click', () => {
        const amount = parseInt(customAmount.value);
        if (amount && amount > 0) {
            addWater(amount);
            customAmount.value = '';
        } else {
            showAlert('Please enter a valid amount', 'error');
        }
    });

    resetTodayBtn.addEventListener('click', () => {
        if(confirm("Reset today's intake?")) {
            appData.currentIntake = 0;
            saveAppData();
            updateDashboardUI();
            showAlert('Intake reset to 0', 'success');
        }
    });

    voiceBtn.addEventListener('click', () => {
        showAlert("Voice Input is coming in the next update!", "success");
    });

    //  BMI 
    calcBmiBtn.addEventListener('click', () => {
        const h = parseFloat(bmiHeight.value);
        const w = parseFloat(bmiWeightInput.value);

        if (!h || !w || h <= 0 || w <= 0) {
            showAlert('Please enter valid height and weight', 'error');
            return;
        }

        const bmi = w / Math.pow(h / 100, 2);
        bmiScore.textContent = bmi.toFixed(1);

        let category = '';
        let color = '';

        if (bmi < 18.5) { category = 'Underweight'; color = 'var(--warning)'; }
        else if (bmi < 24.9) { category = 'Normal'; color = 'var(--success)'; }
        else if (bmi < 29.9) { category = 'Overweight'; color = 'var(--warning)'; }
        else { category = 'Obese'; color = 'var(--danger)'; }

        bmiBadge.textContent = category;
        bmiBadge.style.backgroundColor = color;
        bmiResult.style.display = 'block';
    });

    
    function initChart() {
        if (!chartCanvas) return;
        const ctx = chartCanvas.getContext('2d');
        
        if (hydrationChartInstance) {
            hydrationChartInstance.destroy();
        }

        // Get Last 7 Days
        const labels = [];
        const data = [];
        const colors = [];

        
        let historyToUse = appData.history;
        if (historyToUse.length === 0) {
            for(let i=6; i>=0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                labels.push(d.toLocaleDateString('en-US', {weekday: 'short'}));
                data.push(0);
                colors.push('rgba(52, 152, 219, 0.5)');
            }
        } else {
            const recent = historyToUse.slice(-7);
            recent.forEach(day => {
                const dateObj = new Date(day.date);
                labels.push(dateObj.toLocaleDateString('en-US', {weekday: 'short'}));
                data.push(day.intake);
                colors.push(day.intake >= day.goal ? 'rgba(46, 204, 113, 0.8)' : 'rgba(52, 152, 219, 0.8)');
            });
        }

        hydrationChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Intake (ml)',
                    data: data,
                    backgroundColor: colors,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    function updateChartData() {
        if(hydrationChartInstance) {
            // Re-init for simplicity, a real app would append
            initChart(); 
        }
    }

    // Chart toggle view (mock implementation)
    chartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            chartBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showAlert(`Viewing ${btn.getAttribute('data-view')} stats`, 'success');
        });
    });

    chatbotToggle.addEventListener('click', () => {
        chatbotWindow.style.display = chatbotWindow.style.display === 'none' ? 'flex' : 'none';
    });

    closeChat.addEventListener('click', () => {
        chatbotWindow.style.display = 'none';
    });

    sendChatBtn.addEventListener('click', processChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') processChat();
    });

    function processChat() {
        const text = chatInput.value.trim().toLowerCase();
        if (!text) return;

        // User Message
        addChatMessage(chatInput.value, 'user');
        chatInput.value = '';

        // Bot Response
        setTimeout(() => {
            let reply = chatbotResponses['default'];
            for (const key in chatbotResponses) {
                if (text.includes(key)) {
                    reply = chatbotResponses[key];
                    break;
                }
            }
            addChatMessage(reply, 'bot');
        }, 500);
    }

    function addChatMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const platform = e.currentTarget.classList.contains('twitter') ? 'Twitter' : 
                             e.currentTarget.classList.contains('whatsapp') ? 'WhatsApp' : 'Facebook';
            const msg = encodeURIComponent(`I'm tracking my hydration on AquaTrack! I've reached ${progressPercentage.textContent} of my daily goal today. Join me! 💧`);
            let url = '';
            
            if (platform === 'Twitter') url = `https://twitter.com/intent/tweet?text=${msg}`;
            if (platform === 'WhatsApp') url = `https://api.whatsapp.com/send?text=${msg}`;
            if (platform === 'Facebook') url = `https://www.facebook.com/sharer/sharer.php?u=https://example.com`;
            
            window.open(url, '_blank');
        });
    });

    //navigation
    function showMainSections() {
        dashboardSection.style.display = 'block';
        historySection.style.display = 'block';
        healthLinksSection.style.display = 'block';
        if(aboutSection) aboutSection.style.display = 'block';
        feedbackPage.style.display = 'none';
    }

    [navDashboard, navHistory, navResources, backToDashboardBtn].forEach(btn => {
        if(btn) {
            btn.addEventListener('click', (e) => {
                showMainSections();
                // Let the native anchor jump happen, but ensure sections are visible
            });
        }
    });

    openFeedbackBtn.addEventListener('click', () => {
        dashboardSection.style.display = 'none';
        historySection.style.display = 'none';
        healthLinksSection.style.display = 'none';
        if(aboutSection) aboutSection.style.display = 'none';
        feedbackPage.style.display = 'block';
        window.scrollTo(0, 0);
    });

    
    if(emailReminderBtn) {
        emailReminderBtn.addEventListener('click', () => {
            if(!currentUser) return;
            
            // EmailJS Integration
            const templateParams = {
                to_name: currentUser.name,
                to_email: currentUser.email,
                message: `Hi ${currentUser.name},\n\nThis is your friendly AquaTrack reminder! You have currently consumed ${appData.currentIntake}ml of your ${appData.goal}ml daily goal.\n\nKeep hydrating!`
            };

            // Using dummy IDs since actual credentials aren't provided. 
            // emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            
            // Show realistic loading state
            emailReminderBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            emailReminderBtn.disabled = true;

            setTimeout(() => {
                showAlert(`Reminder sent to ${currentUser.email}! (Mock via EmailJS)`, 'success');
                emailReminderBtn.innerHTML = '<i class="fa-solid fa-envelope"></i> Send Gmail Reminder';
                emailReminderBtn.disabled = false;
            }, 1500);
        });
    }

    // feedback
    let selectedRating = 0;
    starRatingIcons.forEach(star => {
        star.addEventListener('click', (e) => {
            selectedRating = parseInt(e.target.getAttribute('data-value'));
            starRatingIcons.forEach(s => {
                if (parseInt(s.getAttribute('data-value')) <= selectedRating) {
                    s.style.color = '#f39c12'; // Filled star color
                } else {
                    s.style.color = 'var(--text-muted)'; // Empty star color
                }
            });
        });
    });

    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (selectedRating === 0) {
            showAlert('Please select a star rating.', 'error');
            return;
        }
        
        showAlert('Thank you for your feedback!', 'success');
        feedbackForm.reset();
        selectedRating = 0;
        starRatingIcons.forEach(s => s.style.color = 'var(--text-muted)');
        
        setTimeout(() => {
            showMainSections();
            window.scrollTo(0, 0);
        }, 1500);
    });

    // START
    init();
});