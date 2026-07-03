
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // Example credentials
    let savedEmail = "admin@gmail.com";
    let savedPassword = "123456";

    if (email === savedEmail && password === savedPassword) {
        alert("Login Successful!");

        // Go to Home Page
        window.location.href = "AD-Anime.html";
    } else {
        document.getElementById("message").innerHTML =
            "Invalid Email or Password";
        document.getElementById("message").style.color = "red";
    }
    document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let savedEmail = localStorage.getItem("email");
    let savedPassword = localStorage.getItem("password");

    if (email === savedEmail && password === savedPassword) {
        alert("Login Successful!");

        // Remember user is logged in
        localStorage.setItem("isLoggedIn", "true");

        // Redirect to Home page
        window.location.href = "index.html";
    } else {
        alert("Incorrect Email or Password");
    }
});
});

}