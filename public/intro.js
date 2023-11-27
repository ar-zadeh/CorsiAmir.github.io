

let userId = 0;

//document.addEventListener('click', function() {
//  html2canvas(document.body).then(canvas => {
//      const imgDataUrl = canvas.toDataURL("image/png");
//
//      // Sending AJAX request to Flask backend
//      fetch('http://localhost:5000/upload', {
//          method: 'POST',
//          headers: {
//              'Content-Type': 'application/x-www-form-urlencoded',
//          },
//          body: `image=${encodeURIComponent(imgDataUrl)}`
//      })
//      .then(response => response.json())
//      .then(data => {
//          console.log('Image saved:', data);
//      })
//      .catch((error) => {
//          console.error('Error:', error);
//      });
//  });
//});




let startTestButton = document.getElementById('startTestButton');

startTestButton.addEventListener('click', (event) => {

    event.preventDefault();
    userId = document.getElementById('userId').value;
    if (userId) {
        localStorage.setItem('userId', userId);
        window.location.href = 'corsi_memory_test.html'; // Redirect to the test
    } else {
        alert('Please enter your ID');
    }
});



//const startTutorialButton = document.getElementById("start-tutorial-button");
//startTutorialButton.addEventListener("click", function () {
//    window.location.href = "corsi_memory_test/corsi_memory_test.html";
//});

