document.addEventListener("DOMContentLoaded", () => {
    console.log("Document loaded...");

    // [[ Grab all nav list items that contain links ]] \\
    const navLinks = document.querySelectorAll("nav ul li a");

    // [[ Smooth scroll and active animation ]] \\
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            // Remove active from all
            navLinks.forEach((l) => l.classList.remove("active"));

            // Add active to the clicked one
            link.classList.add("active");

            // Scroll smoothly to the target section
            const targetId = link.getAttribute("href").substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 50, // adjust offset for navbar height if needed
                    behavior: "smooth",
                });
            }
        });
    });

    // [[ Highlight current section on scroll ]] \\
    window.addEventListener("scroll", () => {
        let scrollPosition = window.scrollY + 60; // offset a bit

        document.querySelectorAll("section").forEach((section) => {
            if (
                scrollPosition >= section.offsetTop &&
                scrollPosition < section.offsetTop + section.offsetHeight
            ) {
                navLinks.forEach((link) => link.classList.remove("active"));
                const activeLink = document.querySelector(
                    `nav ul li a[href="#${section.id}"]`
                );
                if (activeLink) activeLink.classList.add("active");
            }
        });
    });
});
