var count = 0;

document.addEventListener('keydown',
    function(event) {
      if (count > 4) {
        return false;
      }
    count++;
    event.preventDefault();
    alert('keydown');
  },
  false);
