document.addEventListener("DOMContentLoaded", function () {
  const tg = window.Telegram.WebApp;
  tg.expand();

  const user = tg.initDataUnsafe?.user;

  // Debug: Show full Telegram object on screen
  console.log("Telegram User:", user);
  document.body.innerHTML += `<pre style="margin-top:20px;">${JSON.stringify(user, null, 2)}</pre>`;

  if (user) {
    const fullName = user.first_name + (user.last_name ? " " + user.last_name : "");
    document.getElementById("username").innerText = fullName;

    const profilePic = document.getElementById("profile-pic");

    if (user.photo_url) {
      profilePic.src = user.photo_url;
    } else {
      profilePic.src = "https://via.placeholder.com/150/4CAF50/ffffff?text=" + encodeURIComponent(user.first_name[0]);
    }
  } else {
    document.getElementById("username").innerText = "Guest";
  }
});
