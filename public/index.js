document.getElementById("icon").addEventListener("click", toggleDropdown);
document.getElementById("varslinger").addEventListener("click", toggleDropdown);
document.getElementById("hviskemeldinger").addEventListener("click", toggleDropdown);

function toggleDropdown() {
    var dropdown = document.getElementById("dropdown-content");
    console.log('clicjdfd')
    if (dropdown.style.display === "none") {
      dropdown.style.display = "inline-block";
    } else {
      dropdown.style.display = "none";
    }
  }