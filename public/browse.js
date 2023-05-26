var browse = document.getElementById('browse_clicked');
var browse_pressed = false;

browse.addEventListener ('click', function handleClick() {
    console.log('Submit button is clicked');
 if (browse_pressed) {
  console.log('Submit button has already clicked');
 }
 browse_pressed = true;
});

if (browse_pressed = true) {
    browse.style.color = 'red';
};
