// Wait for the HTML document to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // 1. Connection Check
    // This will show up in your browser's "Console" (Press F12 to see it)
    console.log("Success: script.js is linked correctly.");

    // 2. Simple Interactivity Example
    // This logs the current date and time to the console
    const loadTime = new Date().toLocaleString();
    console.log("Site loaded at: " + loadTime);

    // 3. Placeholder for Future Logic
    // You can add functions here for data analysis, calculators, 
    // or interactive charts as your site grows.
    
    // Back to Top Button
    const backToTopBtn = document.getElementById("back-to-top-btn");

    window.onscroll = function() {
        scrollFunction();
    };

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            if(backToTopBtn) {
                backToTopBtn.style.display = "block";
            }
        } else {
            if(backToTopBtn) {
                backToTopBtn.style.display = "none";
            }
        }
    }

    if(backToTopBtn) {
        backToTopBtn.addEventListener("click", function() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        });
    }
});

function search() {
    let input = document.getElementById('search-input');
    let filter = input.value.toUpperCase();
    let ul = document.getElementById("post-list");
    let li = ul.getElementsByTagName('li');

    for (let i = 0; i < li.length; i++) {
        let a = li[i].getElementsByTagName("a")[0];
        let txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}