document.getElementById("icon").addEventListener("click", toggleDropdown);
document.getElementById('icon2').addEventListener("click", toggleWhisper);

function toggleDropdown() {
  var dropdown = document.getElementById("dropdown-content");
  var computedStyle = window.getComputedStyle(dropdown);

  if (computedStyle.display === "none") {
    dropdown.style.display = "inline-block";
    document.addEventListener("click", handleClickOutside);
  } else {
    dropdown.style.display = "none";
    document.removeEventListener("click", handleClickOutside);
  }

  event.stopPropagation(); // Prevent click event from propagating
}

function handleClickOutside(event) {
  var dropdown = document.getElementById("dropdown-content");
  var target = event.target;

  if (!dropdown.contains(target)) {
    dropdown.style.display = "none";
    document.removeEventListener("click", handleClickOutside);
  }
}

function toggleWhisper() {
    var dropdown2 = document.getElementById("whisper_dropdown");
    console.log('clicjasddfd')
    if (dropdown2.style.display === "none") {
      dropdown2.style.display = "flex";
    } else {
      dropdown2.style.display = "none";
    }
  }
