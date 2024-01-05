function checkPassword() {
    var password = document.getElementById("password").value;
    var correctPassword = "yourPredefinedPassword"; // Replace with your predefined password

    if (password === correctPassword) {
        window.location.href = "index.html"; // Redirects to index.html if correct
    } else {
        document.getElementById("message").innerText = "Incorrect password, please try again.";
    }
}
