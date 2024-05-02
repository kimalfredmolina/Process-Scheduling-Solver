document.addEventListener("DOMContentLoaded", function () {
    const scrollLinks = document.querySelectorAll('a[href^="#"]'); 

    for (let link of scrollLinks) {
        link.addEventListener('click', function (e) {
            e.preventDefault(); 
            let targetId = this.getAttribute('href'); 
            let targetSection = document.querySelector(targetId); 

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop, 
                    behavior: "smooth" 
                });
            }
        });
    }
});
