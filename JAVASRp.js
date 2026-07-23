function initPiggySaveApp() {
  const STORAGE_USERS = "piggy_users";
  const STORAGE_LOGGED_IN = "piggy_current_user";
  const STORAGE_APP_ACCOUNT = "piggy_app_account";
  const STORAGE_FEEDBACKS = "piggy_feedbacks";

  let users = JSON.parse(localStorage.getItem(STORAGE_USERS)) || [
    { name: "Admin", email: "admin@piggy.com", mobile: "0000000000", password: "adminpassword", balance: 0, goal: 0, transactions: [] }
  ];

  let feedbacks = JSON.parse(localStorage.getItem(STORAGE_FEEDBACKS)) || [
    { name: "Aarav Mehta", rating: 5, comment: "Amazing passbook app! Goal setting helps me save every month." },
    { name: "Priya Sharma", rating: 4, comment: "Clean design and very intuitive UI. UPI deposits are instant." }
  ];

  let currentUserEmail = localStorage.getItem(STORAGE_LOGGED_IN) || null;
  let appPenaltyBalance = parseFloat(localStorage.getItem(STORAGE_APP_ACCOUNT)) || 0;
  let selectedRating = 0;

  const squadSvg = document.getElementById("squadSvg");
  const pupilGroups = document.querySelectorAll(".pupil-group");
  const speechBubble = document.getElementById("speechBubble");

  /* CHARACTER-SPECIFIC PERSONALITY DIALOGUES */
  const squadDialogues = {
    piggy: [
      "Piggy: Master Saver at your service! 🐷💰",
      "Piggy: Big smiles for smart savings! 😁",
      "Piggy: Ready to add more money to the bank?"
    ],
    bunny: [
      "Bunny: Hop hop! Savings are jumpin' up! 🐰✨",
      "Bunny: Teehee, don't tickle my ears!"
    ],
    bear: [
      "Bear: Slow and steady wins the race. 🐻🛡️",
      "Bear: I'm protecting your goal fund!"
    ],
    kitty: [
      "Kitty: Purrrfect timing for a deposit! 🐱🐾",
      "Kitty: Smart choices bring sweet rewards!"
    ]
  };

  function getRandomPersonalityDialogue() {
    const keys = Object.keys(squadDialogues);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const pool = squadDialogues[randomKey];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function triggerSpeechBubble(targetBubble, text) {
    if (!targetBubble) return;
    targetBubble.textContent = text;
    targetBubble.classList.add("active");
    setTimeout(() => {
      targetBubble.classList.remove("active");
    }, 3200);
  }

  if (squadSvg) {
    squadSvg.addEventListener("click", () => {
      triggerSpeechBubble(speechBubble, getRandomPersonalityDialogue());
    });
  }

  /* FLOATING MASCOT SCROLL REACTIONS */
  const floatingMascot = document.getElementById("floatingMascot");
  const scrollSpeechBubble = document.getElementById("scrollSpeechBubble");

  if (floatingMascot) {
    floatingMascot.addEventListener("click", () => {
      const scrollComments = [
        "Great progress! 📈",
        "Keep up the savings! 💡",
        "Goal almost reached! 🎯",
        "Piggy power! 🐷"
      ];
      const randomText = scrollComments[Math.floor(Math.random() * scrollComments.length)];
      triggerSpeechBubble(scrollSpeechBubble, randomText);
    });
  }

  /* ALL ANIMALS CURSOR EYE TRACKING */
  document.addEventListener("mousemove", (e) => {
    if (!squadSvg || squadSvg.classList.contains("emotion-shy") || squadSvg.classList.contains("emotion-sad")) return;

    const rect = squadSvg.getBoundingClientRect();
    const svgCenterX = rect.left + rect.width / 2;
    const svgCenterY = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - svgCenterY, e.clientX - svgCenterX);
    const distance = Math.min(3.8, Math.hypot(e.clientX - svgCenterX, e.clientY - svgCenterY) / 38);

    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    pupilGroups.forEach(pupil => {
      pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  /* HOVER EMOTION & SPEECH TRIGGERS FOR SQUAD (SHY + PRIVATE SPEECH 🙈) */
  document.querySelectorAll(".input-password").forEach(input => {
    const triggerShy = () => {
      if (squadSvg) {
        squadSvg.classList.add("emotion-shy");
        triggerSpeechBubble(speechBubble, "Shh... It's private! 🙈");
      }
    };

    const removeShy = () => {
      if (squadSvg) {
        squadSvg.classList.remove("emotion-shy");
      }
    };

    input.addEventListener("mouseenter", triggerShy);
    input.addEventListener("focus", triggerShy);
    input.addEventListener("mouseleave", removeShy);
    input.addEventListener("blur", removeShy);
  });

  document.querySelectorAll(".btn-primary").forEach(btn => {
    btn.addEventListener("mouseenter", () => squadSvg && squadSvg.classList.add("emotion-excited"));
    btn.addEventListener("mouseleave", () => squadSvg && squadSvg.classList.remove("emotion-excited"));
  });

  const withdrawBtn = document.getElementById("btnWithdrawRequest");
  if (withdrawBtn) {
    withdrawBtn.addEventListener("mouseenter", () => squadSvg && squadSvg.classList.add("emotion-nervous"));
    withdrawBtn.addEventListener("mouseleave", () => squadSvg && squadSvg.classList.remove("emotion-nervous"));
  }

  /* Dark Mode Toggle Logic */
  const btnThemeToggle = document.getElementById("btnThemeToggle");
  if (btnThemeToggle) {
    btnThemeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      btnThemeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    });
  }

  const topnav = document.getElementById("topnav");
  const navUserName = document.getElementById("navUserName");
  const btnAdminToggle = document.getElementById("btnAdminToggle");
  const btnLogout = document.getElementById("btnLogout");

  const authScreen = document.getElementById("authScreen");
  const dashScreen = document.getElementById("dashScreen");
  const adminScreen = document.getElementById("adminScreen");

  const loginBlock = document.getElementById("loginBlock");
  const registerBlock = document.getElementById("registerBlock");
  const showRegister = document.getElementById("showRegister");
  const showLogin = document.getElementById("showLogin");

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginError = document.getElementById("loginError");
  const registerError = document.getElementById("registerError");

  const balanceFigure = document.getElementById("balanceFigure");
  const goalBarFill = document.getElementById("goalBarFill");
  const goalCaption = document.getElementById("goalCaption");
  const goalInput = document.getElementById("goalInput");
  const btnSetGoal = document.getElementById("btnSetGoal");

  const depositUpi = document.getElementById("depositUpi");
  const depositAmount = document.getElementById("depositAmount");
  const btnDeposit = document.getElementById("btnDeposit");
  const depositMsg = document.getElementById("depositMsg");

  const withdrawAmount = document.getElementById("withdrawAmount");
  const btnWithdrawRequest = document.getElementById("btnWithdrawRequest");
  const withdrawMsg = document.getElementById("withdrawMsg");

  const historyBody = document.getElementById("historyBody");
  const historyEmpty = document.getElementById("historyEmpty");

  const appAccountBalance = document.getElementById("appAccountBalance");
  const totalUsersFigure = document.getElementById("totalUsersFigure");
  const usersBody = document.getElementById("usersBody");

  const starRating = document.getElementById("starRating");
  const btnSubmitFeedback = document.getElementById("btnSubmitFeedback");
  const feedbackText = document.getElementById("feedbackText");
  const feedbackMsg = document.getElementById("feedbackMsg");
  const feedbackList = document.getElementById("feedbackList");

  setupEventListeners();
  renderApp();

  function renderApp() {
    if (!currentUserEmail) {
      authScreen.hidden = false;
      dashScreen.hidden = true;
      adminScreen.hidden = true;
      topnav.hidden = true;
      return;
    }

    topnav.hidden = false;
    const user = getCurrentUser();
    if (!user) { logout(); return; }

    navUserName.textContent = user.name;
    btnAdminToggle.hidden = (user.email !== "admin@piggy.com");

    if (dashScreen.dataset.activeView === "admin") {
      renderAdminScreen();
    } else {
      renderDashboard(user);
    }
  }

  function renderDashboard(user) {
    authScreen.hidden = true;
    dashScreen.hidden = false;
    adminScreen.hidden = true;

    balanceFigure.textContent = `₹ ${user.balance.toLocaleString("en-IN")}`;

    const goal = user.goal || 0;
    if (goal > 0) {
      const percentage = Math.min(Math.round((user.balance / goal) * 100), 100);
      goalBarFill.style.width = `${percentage}%`;
      goalCaption.textContent = `Target: ₹${goal.toLocaleString("en-IN")} (${percentage}% completed)`;
    } else {
      goalBarFill.style.width = "0%";
      goalCaption.textContent = "No goal set";
    }

    renderTransactionTable(user.transactions, historyBody, historyEmpty);
    renderFeedbacks();
  }

  function renderAdminScreen() {
    authScreen.hidden = true;
    dashScreen.hidden = true;
    adminScreen.hidden = false;

    appAccountBalance.textContent = `₹ ${appPenaltyBalance.toLocaleString("en-IN")}`;
    totalUsersFigure.textContent = users.filter(u => u.email !== "admin@piggy.com").length;

    usersBody.innerHTML = "";
    users.forEach(u => {
      if (u.email === "admin@piggy.com") return;
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${u.name}</td><td>${u.email}</td><td>${u.mobile}</td><td>₹ ${u.balance}</td>`;
      usersBody.appendChild(tr);
    });
  }

  function renderTransactionTable(transactions, targetBody, emptyElem) {
    targetBody.innerHTML = "";
    if (!transactions || transactions.length === 0) {
      if (emptyElem) emptyElem.hidden = false;
      return;
    }
    if (emptyElem) emptyElem.hidden = true;

    transactions.slice().reverse().forEach(t => {
      const tr = document.createElement("tr");
      let typeClass = t.type === "WITHDRAWAL" ? "type-withdrawal" : (t.type === "PENALTY" ? "type-penalty" : "type-deposit");
      tr.innerHTML = `<td>${t.date}</td><td class="${typeClass}">${t.type}</td><td>₹ ${t.amount}</td><td>${t.upiRef || "-"}</td><td>${t.details || "-"}</td>`;
      targetBody.appendChild(tr);
    });
  }

  function renderFeedbacks() {
    if (!feedbackList) return;
    feedbackList.innerHTML = "";
    feedbacks.slice().reverse().forEach(f => {
      const div = document.createElement("div");
      div.className = "feedback-item";
      div.innerHTML = `
        <div class="feedback-user">
          <span>${f.name}</span>
          <span class="feedback-stars">${"★".repeat(f.rating)}</span>
        </div>
        <div>${f.comment}</div>
      `;
      feedbackList.appendChild(div);
    });
  }

  /* TRIGGER BIG SMILES & HAPPY ANIMATION ON LOGIN */
  function triggerLoginHappyAnimation() {
    if (squadSvg) {
      squadSvg.classList.remove("emotion-sad", "emotion-shy");
      squadSvg.classList.add("emotion-excited");
      triggerSpeechBubble(speechBubble, "YAY! Big Smiles All Around! 😁🎉");
      setTimeout(() => {
        squadSvg.classList.remove("emotion-excited");
      }, 3800);
    }
  }

  function setupEventListeners() {
    if (showRegister) showRegister.addEventListener("click", () => { loginBlock.hidden = true; registerBlock.hidden = false; });
    if (showLogin) showLogin.addEventListener("click", () => { loginBlock.hidden = false; registerBlock.hidden = true; });

    if (starRating) {
      starRating.addEventListener("click", (e) => {
        if (e.target.dataset.star) {
          selectedRating = parseInt(e.target.dataset.star);
          Array.from(starRating.children).forEach((star, index) => {
            star.classList.toggle("active", index < selectedRating);
          });
        }
      });
    }

    if (btnSubmitFeedback) {
      btnSubmitFeedback.addEventListener("click", () => {
        const comment = feedbackText.value.trim();
        if (selectedRating === 0 || !comment) {
          feedbackMsg.style.color = "var(--accent-pink)";
          feedbackMsg.textContent = "Kripya rating aur comment dono bharein!";
          return;
        }

        const user = getCurrentUser();
        feedbacks.push({ name: user ? user.name : "Anonymous", rating: selectedRating, comment });
        localStorage.setItem(STORAGE_FEEDBACKS, JSON.stringify(feedbacks));

        feedbackMsg.style.color = "var(--accent-green)";
        feedbackMsg.textContent = "Aapka review submit ho gaya hai!";
        feedbackText.value = "";
        selectedRating = 0;
        Array.from(starRating.children).forEach(s => s.classList.remove("active"));
        renderFeedbacks();
      });
    }

    /* LOGIN FORM SUBMIT (TRIGGER HAPPY BIG SMILE 😄) */
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          currentUserEmail = user.email;
          localStorage.setItem(STORAGE_LOGGED_IN, currentUserEmail);
          triggerLoginHappyAnimation();
          renderApp();
        } else {
          loginError.textContent = "Invalid email or password.";
        }
      });
    }

    /* REGISTER FORM SUBMIT (TRIGGER HAPPY BIG SMILE 😄) */
    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const mobile = document.getElementById("regMobile").value.trim();
        const password = document.getElementById("regPassword").value;

        if (users.some(u => u.email === email)) {
          registerError.textContent = "Email is already registered.";
          return;
        }

        const newUser = { name, email, mobile, password, balance: 0, goal: 0, transactions: [] };
        users.push(newUser);
        saveUsers();
        currentUserEmail = newUser.email;
        localStorage.setItem(STORAGE_LOGGED_IN, currentUserEmail);
        triggerLoginHappyAnimation();
        renderApp();
      });
    }

    if (btnLogout) btnLogout.addEventListener("click", logout);
    if (btnAdminToggle) {
      btnAdminToggle.addEventListener("click", () => {
        dashScreen.dataset.activeView = dashScreen.dataset.activeView === "admin" ? "" : "admin";
        renderApp();
      });
    }

    if (btnSetGoal) {
      btnSetGoal.addEventListener("click", () => {
        const val = parseFloat(goalInput.value);
        if (val > 0) {
          const user = getCurrentUser();
          user.goal = val;
          saveUsers();
          goalInput.value = "";
          renderApp();
        }
      });
    }

    if (btnDeposit) {
      btnDeposit.addEventListener("click", () => {
        const upi = depositUpi.value.trim();
        const amt = parseFloat(depositAmount.value);
        if (!upi || isNaN(amt) || amt <= 0) return;

        const user = getCurrentUser();
        user.balance += amt;
        user.transactions.push({
          date: new Date().toLocaleDateString(),
          type: "DEPOSIT",
          amount: amt,
          upiRef: "UPI" + Math.floor(100000 + Math.random() * 900000),
          details: `UPI: ${upi}`
        });
        saveUsers();
        depositUpi.value = ""; depositAmount.value = "";
        renderApp();
      });
    }

    if (btnWithdrawRequest) {
      btnWithdrawRequest.addEventListener("click", () => {
        const amt = parseFloat(withdrawAmount.value);
        const user = getCurrentUser();
        if (isNaN(amt) || amt <= 0 || amt > user.balance) return;

        const isGoalMet = user.goal > 0 && user.balance >= user.goal;
        const penalty = isGoalMet ? 0 : amt * 0.20;
        const netPayout = amt - penalty;

        user.balance -= amt;
        user.transactions.push({
          date: new Date().toLocaleDateString(),
          type: "WITHDRAWAL",
          amount: netPayout,
          upiRef: "WD" + Math.floor(100000 + Math.random() * 900000),
          details: "Withdrawal payout"
        });

        if (penalty > 0) {
          user.transactions.push({
            date: new Date().toLocaleDateString(),
            type: "PENALTY",
            amount: penalty,
            upiRef: "-",
            details: "20% Early withdrawal penalty"
          });
          appPenaltyBalance += penalty;
          localStorage.setItem(STORAGE_APP_ACCOUNT, appPenaltyBalance);
        }

        saveUsers();
        withdrawAmount.value = "";
        renderApp();
      });
    }
  }

  function getCurrentUser() { return users.find(u => u.email === currentUserEmail); }
  function saveUsers() { localStorage.setItem(STORAGE_USERS, JSON.stringify(users)); }
  
  /* LOGOUT WITH SAD ANIMATION TRIGGER 🥺 */
  function logout() { 
    currentUserEmail = null; 
    localStorage.removeItem(STORAGE_LOGGED_IN); 
    renderApp();

    if (squadSvg) {
      squadSvg.classList.add("emotion-sad");
      triggerSpeechBubble(speechBubble, "Miss you! Come back soon... 🥺");
      setTimeout(() => {
        squadSvg.classList.remove("emotion-sad");
      }, 4500);
    }
  }
}

document.addEventListener("DOMContentLoaded", initPiggySaveApp);