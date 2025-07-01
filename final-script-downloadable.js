
// Display today's date on page load
window.onload = function () {
    const today = new Date();
    document.getElementById("date").textContent = today.toDateString();
};

// Validate that password and confirm password fields match
function validatePasswords() {
    const password = document.querySelector('[name="password"]').value;
    const confirmPassword = document.querySelector('[name="confirmpass"]').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }
    return true;
}

// Review form data and display in the reviewBox
function reviewForm() {
    const form = document.getElementById('profileForm');
    let output = "<h3>Review Your Information</h3><ul>";

    const formData = new FormData(form);
    const seen = new Set();

    for (let [key, value] of formData.entries()) {
        if (seen.has(key)) continue;
        const values = formData.getAll(key);
        output += `<li><strong>${key}:</strong> ${values.join(", ")}</li>`;
        seen.add(key);
    }

    const painLevel = document.getElementById("painlevel").value;
    output += `<li><strong>Pain Level:</strong> ${painLevel}</li>`;

    document.getElementById("reviewBox").innerHTML = output + "</ul>";
}
