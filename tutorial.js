document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const sidebarClose = document.querySelector("#sidebar-close");
  const menu = document.querySelector(".menu-content");
  const menuItems = document.querySelectorAll(".submenu-item");
  const subMenuTitles = document.querySelectorAll(".submenu .menu-title");
  const sidebarLinks = document.querySelectorAll(".sidebar a");
  const submenuItems = document.querySelectorAll(".submenu .item");

  // Toggle sidebar
  sidebarClose.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    document.querySelector(".main").classList.toggle("full-width");
    document.querySelector(".navbar").classList.toggle("full-width");
  });

  // Open submenu
  menuItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      menu.classList.add("submenu-active");
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
      menu.classList.remove("submenu-active");
      menuItems.forEach((item) => {
        item.classList.remove("show-submenu");
      });
    });
  });

  // Ensure all links within the sidebar and submenu are clickable
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (sidebar.classList.contains("close")) {
        e.preventDefault();
        sidebar.classList.remove("close");
        setTimeout(() => {
          window.location.href = link.href;
        }, 300);
      }
    });
  });

  submenuItems.forEach((submenuLink) => {
    submenuLink.addEventListener("click", (e) => {
      if (sidebar.classList.contains("close")) {
        e.preventDefault();
        sidebar.classList.remove("close");
        setTimeout(() => {
          window.location.href = submenuLink.querySelector("a").href;
        }, 300);
      }
    });
  });
});
