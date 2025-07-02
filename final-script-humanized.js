// -----------------------------------------------------------
// Patient Registration Form – Homework 3 (JS Validation)
// Author: Sara Saleem | Course: MIS 3371
// -----------------------------------------------------------

// Shortcut to get element by ID
function $(id) {
  return document.getElementById(id);
}

// Add an empty error message span after a field
function makeErrorSpan(el) {
  const span = document.createElement("span");
  span.className = "error";
  span.textContent = "";
  el.parentNode.appendChild(span);
  return span;
}

// Error message setters
function setError(span, msg) {
  span.textContent = msg;
}

function clearError(span) {
  span.textContent = "";
}

// Validation rules for each input field
const rules = {
  firstname: {
    test: value => /^[A-Za-z'\-]{1,30}$/.test(value),
    msg: "1–30 letters, apostrophes, or dashes"
  },
  midinitial: {
    optional: true,
    test: value => /^[A-Za-z]?$/.test(value),
    msg: "Single letter only"
  },
  lastname: {
    test: value => /^[A-Za-z0-9'\-]{1,30}$/.test(value),
    msg: "1–30 letters, numbers, apostrophes, or dashes"
  },
  dob: {
    test: value => {
      if (!value) return false;
      const inputDate = new Date(value);
      return inputDate < new Date();
    },
    msg: "Choose a valid birth date"
  },
  ssn: {
    optional: true,
    test: value => /^\d{3}-\d{2}-\d{4}$/.test(value),
    msg: "Format XXX‑XX‑XXXX"
  },
  email: {
    test: value => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value),
    transform: value => value.toLowerCase(),
    msg: "Use name@domain.tld"
  },
  phone: {
    optional: true,
    test: value => /^\d{3}-\d{3}-\d{4}$/.test(value),
    msg: "Format 000‑000‑0000"
  },
  address1: {
    test: value => value.trim().length > 0,
    msg: "Address Line 1 is required"
  },
  address2: {
    optional: true,
    test: () => true
  },
  city: {
    test: value => /^[A-Za-z'\-\s]{1,30}$/.test(value),
    msg: "Letters & spaces only (max 30)"
  },
  state: {
    test: value => value !== "",
    msg: "Please pick a state"
  },
  zip: {
    test: value => /^\d{5}$/.test(value),
    msg: "Exactly 5 digits"
  },
  userid: {
    test: value => /^[A-Za-z][A-Za-z0-9_-]{4,19}$/.test(value),
    msg: "5–20 chars, start with a letter, dash/underscore allowed"
  },
  password: {
    test: value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,30}$/.test(value),
    msg: "≥8 chars, upper, lower & digit"
  },
  confirmPassword: {
    test: () => true,
    msg: "Passwords must match"
  }
};

// Run once the page has loaded
window.addEventListener("DOMContentLoaded", () => {
  const form = $("userInfo");
  const submitBtn = $("submitBtn");
  const reviewBtn = $("reviewBtn");
  const validators = {};

  Object.keys(rules).forEach(fieldId => {
    const input = $(fieldId);
    if (!input) return;

    const span = makeErrorSpan(input);
    validators[fieldId] = { el: input, span, ...rules[fieldId] };

    ["input", "blur"].forEach(eventType => {
      input.addEventListener(eventType, () => {
        validateField(fieldId);
        updateSubmitState();
      });
    });
  });

  // Confirm password match
  ["password", "confirmPassword"].forEach(id => {
    const el = $(id);
    if (el) {
      el.addEventListener("input", () => {
        validateField("confirmPassword");
        updateSubmitState();
      });
    }
  });

  function validateField(id) {
    const field = validators[id];
    let value = field.el.value.trim();

    if (field.transform) {
      value = field.transform(value);
    }

    field.el.value = value;

    if (!field.optional && value === "") {
      markInvalid(field, "This field is required");
      return false;
    }

    if (field.optional && value === "") {
      clearMark(field);
      return true;
    }

    let valid = field.test(value);

    // Special case: password must not equal userid
    if (id === "password" && valid) {
      const useridValue = $("userid").value || "";
      if (value === useridValue) {
        valid = false;
        field.msg = "Password cannot equal User ID";
      }
    }

    if (!valid) {
      markInvalid(field, field.msg);
    } else {
      markValid(field);
    }

    // Confirm password logic
    if (id === "confirmPassword") {
      const match = value === $("password").value;
      if (!match) {
        markInvalid(field, rules.confirmPassword.msg);
        return false;
      }
    }

    return valid;
  }

  function markInvalid(field, message) {
    field.el.classList.add("invalid");
    field.el.classList.remove("valid");
    setError(field.span, message);
  }

  function markValid(field) {
    field.el.classList.add("valid");
    field.el.classList.remove("invalid");
    clearError(field.span);
  }

  function clearMark(field) {
    field.el.classList.remove("invalid", "valid");
    clearError(field.span);
  }

  function updateSubmitState() {
    const allValid = Object.keys(validators).every(validateField);
    submitBtn.disabled = !allValid;
  }

  // Final submit validation
  form.addEventListener("submit", e => {
    if (!Object.keys(validators).every(validateField)) {
      e.preventDefault();
    }
  });

  if (reviewBtn) {
    reviewBtn.addEventListener("click", () => {
      if (!Object.keys(validators).every(validateField)) return;
      if (window.reviewForm) window.reviewForm();
    });
  }
});