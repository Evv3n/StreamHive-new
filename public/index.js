document.getElementById("icon").addEventListener("click", toggleDropdown);
document.getElementById("icon2").addEventListener("click", toggleWhisper);

function toggleDropdown() {
  var dropdown = document.getElementById("dropdown-content");
  var whisperDropdown = document.getElementById("whisper_dropdown");
  
  if (dropdown.style.display === "none") {
    dropdown.style.display = "inline-block";
    whisperDropdown.style.display = "none";
    document.addEventListener("click", handleClickOutside);
  } else {
    dropdown.style.display = "none";
    document.removeEventListener("click", handleClickOutside);
  }
  event.stopPropagation();
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
  var dropdown = document.getElementById("dropdown-content");
  var whisperDropdown = document.getElementById("whisper_dropdown");
  
  if (whisperDropdown.style.display === "none") {
    whisperDropdown.style.display = "flex";
    dropdown.style.display = "none";
    document.addEventListener("click", handleClickOutsideWhisper);
  } else {
    whisperDropdown.style.display = "none";
    document.removeEventListener("click", handleClickOutsideWhisper);
  }
  event.stopPropagation();
}

function handleClickOutsideWhisper(event) {
  var whisperDropdown = document.getElementById("whisper_dropdown");
  if (!whisperDropdown.contains(event.target)) {
    whisperDropdown.style.display = "none";
    document.removeEventListener("click", handleClickOutsideWhisper);
  }
}