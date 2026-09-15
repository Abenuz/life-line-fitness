document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navbar Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 2. Tab Navigation for Workout Guide
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            const targetEl = document.getElementById(target);
            if (targetEl) targetEl.classList.add('active');
        });
    });

    // 3. Direct Google Sheets Form Submission
    const gymForm = document.getElementById('gymForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

// Replace with your NEW Web App URL from Step 1
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7J7pIPk9ASNgnCkUz18sYKr1T_35st681YeBS7g-k26BoXyW4TIGmY_I6pIwo_S4j/exec';

if (gymForm) {
    gymForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const plan = document.getElementById('planSelect').value;
        const goal = document.getElementById('goalSelect').value;

        if (!name || !phone) {
            showStatus('Please complete all required fields.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

        const payload = { name, phone, plan, goal };

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(() => {
            showStatus('✅ Registration successful! We will contact you soon.', 'success');
            gymForm.reset();
        })
        .catch(err => {
            console.error('Error saving data:', err);
            showStatus('❌ Registration failed. Please try again.', 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Registration';
        });
    });
}

    function showStatus(message, type) {
        if (!formStatus) return;
        formStatus.className = `form-status ${type}`;
        formStatus.innerHTML = message;
    }
});

// 4. Select Plan Helper Function
function selectPlan(planName) {
    const planSelect = document.getElementById('planSelect');
    if (planSelect) {
        planSelect.value = planName;
    }
}

// 5. BMI Calculator Function
function calculateBMI() {
    const weight = parseFloat(document.getElementById('calcWeight').value);
    const heightCm = parseFloat(document.getElementById('calcHeight').value);
    const resultDiv = document.getElementById('calcResult');

    if (!weight || !heightCm) {
        resultDiv.innerHTML = "<span style='color:#ff3b30;'>Please enter valid numbers.</span>";
        return;
    }

    const heightM = heightCm / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    let status = "";
    if (bmi < 18.5) status = "Underweight";
    else if (bmi < 24.9) status = "Normal weight (Healthy)";
    else if (bmi < 29.9) status = "Overweight";
    else status = "Obese";

    resultDiv.innerHTML = `Your BMI is <span style='color:#ff3b30;'>${bmi}</span> (${status})`;
}
