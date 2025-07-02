// -----------------------------------------------------------
// Patient Registration Form – Homework 3 (JS Validation)
// Author: Sara Saleem | Course: MIS 3371
// Version: 3.2 (Readable format with comments)
// -----------------------------------------------------------

// Shortcut for getElementById
function $(id) {
  return document.getElementById(id);
}

// Create a span element for error messages
function makeErrorSpan(el) {
  const span = document.createElement("span");
  span.className = "error";
  span.textContent = "";
  el.parentNode.appendChild(span);
  return span;
}

// Set and clear error message
function setError(span, msg) {
  span.textContent = msg;
}

function clearError(span) {
  span.textContent = "";
}

// Validation rules
const rules = {
  firstname: {
    test: v => /^[A-Za-z'\-]{1,30}$/.test(v),
    msg: "1–30 letters, apostrophes, or dashes"
  },
  midinitial: {
    optional: true,
    test: v => /^[A-Za-z]?$/.test(v),
    msg: "Single letter only"
  },
  lastname: {
    test: v => /^[A-Za-z0-9'\-]{1,30}$/.test(v),
    msg: "1–30 letters, numbers, apostrophes, or dashes"
  },
  dob: {
    test: v => {
      if (!v) return false;
      const date = new Date(v);
      return date < new Date();
    },
    msg: "Choose a valid birth date"
  },
  ssn: {
    optional: true,
    test: v => /^\d{3}-\d{2}-\d{4}$/.test(v),
    msg: "Format XXX-XX-XXXX"
  },
  email: {
    test: v => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v),
    transform: v => v.toLowerCase(),
    msg: "Use name@domain.tld"
  },
  phone: {
    optional: true,
    test: v => /^\d{3}-\d{3}-\d{4}$/.test(v),
    msg: "Format 000-000-0000"
  },
  address1: {
    test: v => v.trim().length > 0,
    msg: "Address Line 1 is required"
  },
  address2: {
    optional: true,
    test: () => true
  },
  city: {
    test: v => /^[A-Za-z'\-\s]{1,30}$/.test(v),
    msg: "Letters & spaces only (max 30)"
  },
  state: {
    test: v => v !== "",
    msg: "Please pick a state"
  },
  zip: {
    test: v => /^\d{5}$/.test(v),
    msg: "Exactly 5 digits"
  },
  userid: {
    test: v => /^[A-Za-z][A-Za-z0-9_-]{4,19}$/.test(v),
    msg: "5–20 chars, start with a letter, dash/underscore allowed"
  },
  password: {
    test: v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,30}$/.test(v),
    msg: "≥8 chars, upper, lower & digit"
  },
  confirmPassword: {
    test: () => true,
    msg: "Passwords must match"
  }
};

// Runtime logic
window.addEventListener("DOMContentLoaded", () => {
  const form = $("userInfo");
  const submitBtn = $("submitBtn");
  const reviewBtn = $("reviewBtn");

  const validators = {};

  Object.keys(rules).forEach(id => {
    const el = $(id);
    if (!el) return;

    const span = makeErrorSpan(el);
    validators[id] = { el, span, ...rules[id] };

    ["input", "blur"].forEach(evt => {
      el.addEventListener(evt, () => {
        checkField(id);
        toggleSubmit();
      });
    });
  });

  [ $("password"), $("confirmPassword") ].forEach(el => {
    el?.addEventListener("input", () => {
      checkField("confirmPassword");
      toggleSubmit();
    });
  });

  function checkField(id) {
    const v = validators[id];
    let value = v.el.value.trim();

    if (v.transform) value = v.transform(value);
    v.el.value = value;

    if (!v.optional && value === "") {
      markInvalid(v, "This field is required");
      return false;
    }

    if (v.optional && value === "") {
      clearMark(v);
      return true;
    }

    let ok = v.test(value);

    if (id === "password" && ok) {
      const uid = $("userid")?.value || "";
      if (value === uid) {
        ok = false;
        v.msg = "Password cannot equal User ID";
      }
    }

    if (!ok) {
      markInvalid(v, v.msg);
    } else {
      markValid(v);
    }

    if (id === "confirmPassword") {
      const match = value === $("password").value;
      if (!match) {
        markInvalid(v, rules.confirmPassword.msg);
        return false;
      }
    }

    return ok;
  }

  function markInvalid(v, message) {
    v.el.classList.add("invalid");
    v.el.classList.remove("valid");
    setError(v.span, message);
  }

  function markValid(v) {
    v.el.classList.add("valid");
    v.el.classList.remove("invalid");
    clearError(v.span);
  }

  function clearMark(v) {
    v.el.classList.remove("invalid", "valid");
    clearError(v.span);
  }

  function toggleSubmit() {
    const allGood = Object.keys(validators).every(checkField);
    submitBtn.disabled = !allGood;
  }

  form.addEventListener("submit", e => {
    if (!Object.keys(validators).every(checkField)) {
      e.preventDefault();
    }
  });

  reviewBtn?.addEventListener("click", () => {
    if (!Object.keys(validators).every(checkField)) return;
    window.reviewForm && window.reviewForm();
  });
});