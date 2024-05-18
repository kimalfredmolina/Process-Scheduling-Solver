document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const sidebarClose = document.querySelector("#sidebar-close");
  const menuItems = document.querySelectorAll(".submenu-item");
  const subMenuTitles = document.querySelectorAll(".submenu .menu-title");

  // Toggle sidebar
  sidebarClose.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    document.querySelector(".main").classList.toggle("full-width");
    document.querySelector(".navbar").classList.toggle("full-width");
  });

  // Open submenu
  menuItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      sidebar.classList.remove("close"); // Ensure sidebar is open when submenu is active
      item.classList.add("show-submenu");
      menuItems.forEach((item2, index2) => {
        if (index !== index2) {
          item2.classList.remove("show-submenu");
        }
      });
    });
  });

  // Close submenu
  subMenuTitles.forEach((title) => {
    title.addEventListener("click", () => {
      menuItems.forEach((item) => {
        item.classList.remove("show-submenu");
      });
    });
  });
});
