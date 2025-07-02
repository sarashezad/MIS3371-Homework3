
// -----------------------------------------------------------
// Patient Registration Form – Homework 3 (JS Validation)
// Author: Sara Saleem  |  Course: MIS 3371
// Version: 3.1 – live validation with auto submit enable
// -----------------------------------------------------------

function $(id) {
  return document.getElementById(id);
}

function makeErrorSpan(el) {
  const span = document.createElement("span");
  span.className = "error";
  span.textContent = "";
  el.parentNode.appendChild(span);
  return span;
}

function setError(span, msg) {
  span.textContent = msg;
}

function clearError(span) {
  span.textContent = "";
}

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
    msg: "1–30 letters, numbers 2‑5, apostrophes, or dashes"
  },
  dob: {
    test: v => {
      if (!v) return false;
      const date = new Date(v);
      const today = new Date();
      return date < today;
    },
    msg: "Please choose a valid birth date"
  },
  ssn: {
    optional: true,
    test: v => /^\d{3}-\d{2}-\d{4}$/.test(v),
    msg: "Format XXX‑XX‑XXXX"
  },
  email: {
    test: v => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(v),
    transform: v => v.toLowerCase(),
    msg: "Enter a valid email (name@example.com)"
  },
  phone: {
    optional: true,
    test: v => /^\d{3}-\d{3}-\d{4}$/.test(v),
    msg: "Format 000‑000‑0000"
  },
  address1: {
    test: v => v.trim().length > 0,
    msg: "Address Line 1 is required"
  },
  address2: {
    optional: true,
    test: () => true
  },
  city: {
    test: v => /^[A-Za-z'\-\s]{1,30}$/.test(v),
    msg: "Letters and spaces only (max 30)"
  },
  state: {
    test: v => v !== "",
    msg: "Please select a state"
  },
  zip: {
    test: v => /^\d{5}(-\d{4})?$/.test(v),
    msg: "Use 12345 or 12345‑6789"
  },
  userid: {
    test: v => /^[A-Za-z][A-Za-z0-9_]{4,29}$/.test(v),
    msg: "5‑30 chars, cannot start with number"
  },
  password: {
    test: v => /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,30}$/.test(v) && !/['"`]/.test(v),
    msg: "8‑30 chars, 1 uppercase, 1 number, 1 special, no quotes"
  },
  confirmPassword: {
    test: () => true,
    msg: "Passwords must match"
  }
};

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
        autoToggleSubmit();
      });
    });
  });

  [$("password"), $("confirmPassword")].forEach(el => {
    el.addEventListener("input", () => {
      checkField("confirmPassword");
      autoToggleSubmit();
    });
  });

  function checkField(id) {
    const v = validators[id];
    let value = v.el.value.trim();
    if (v.transform) value = v.transform(value);
    v.el.value = value;

    if (!v.optional && value === "") {
      v.el.classList.add("invalid");
      setError(v.span, "This field is required");
      return false;
    }

    if (v.optional && value === "") {
      v.el.classList.remove("invalid", "valid");
      clearError(v.span);
      return true;
    }

    const ok = v.test(value);
    if (!ok) {
      v.el.classList.add("invalid");
      v.el.classList.remove("valid");
      setError(v.span, v.msg);
    } else {
      v.el.classList.remove("invalid");
      v.el.classList.add("valid");
      clearError(v.span);
    }

    if (id === "confirmPassword") {
      const match = value === $("password").value;
      if (!match) {
        validators.confirmPassword.el.classList.add("invalid");
        setError(validators.confirmPassword.span, rules.confirmPassword.msg);
        return false;
      }
    }
    return ok;
  }

  function autoToggleSubmit() {
    const allGood = Object.keys(validators).every(checkField);
    submitBtn.disabled = !allGood;
  }

  form.addEventListener("submit", e => {
    const valid = Object.keys(validators).every(checkField);
    if (!valid) e.preventDefault();
  });

  if (reviewBtn) {
    reviewBtn.addEventListener("click", () => {
      const valid = Object.keys(validators).every(checkField);
      if (!valid) return;
      window.reviewForm && window.reviewForm();
    });
  }
});
