// document.getElementById('register_link1').addEventListener('click', function(event) {
//     event.preventDefault(); // Prevent default link behavior
//     var form = document.getElementById('register_form');
//     if (form.style.display === "none" || form.style.display === "") {
//         form.style.display = "block"; // Show the form
//     } else {
//         form.style.display = "none"; // Hide the form
//     }
// });

document.querySelectorAll('.register_link').forEach(function(link) {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default button behavior
        var form = document.getElementById('register_form');
        if (form.style.display === "none" || form.style.display === "") {
            form.style.display = "block"; // Show the form
        } else {
            form.style.display = "none"; // Hide the form
        }
    });
});
document.getElementById('close_form').addEventListener('click', function() {
    var form = document.getElementById('register_form');
    form.style.display = "none"; // Hide the form
});