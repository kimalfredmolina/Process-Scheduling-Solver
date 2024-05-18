document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const sidebarClose = document.querySelector("#sidebar-close");
  const menuItems = document.querySelectorAll(".submenu-item");
  const subMenuTitles = document.querySelectorAll(".submenu .menu-title");
  const sidebarLinks = document.querySelectorAll(".sidebar a");
  const submenuLinks = document.querySelectorAll(".submenu .item a");

  // Toggle sidebar
  sidebarClose.addEventListener("click", () => {
    console.log("Sidebar toggle clicked");
    sidebar.classList.toggle("close");
    document.querySelector(".main").classList.toggle("full-width");
    document.querySelector(".navbar").classList.toggle("full-width");
  });

  // Open submenu
  menuItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      console.log("Submenu item clicked", index);
      item.classList.toggle("show-submenu");
      const submenu = item.querySelector('.submenu');
      if (submenu) {
        submenu.classList.toggle("show");
      }
    });
  });

  // Close submenu
  subMenuTitles.forEach((title) => {
    title.addEventListener("click", () => {
      console.log("Submenu title clicked");
      const submenuItem = title.closest('.submenu-item');
      if (submenuItem) {
        submenuItem.classList.remove("show-submenu");
        const submenu = submenuItem.querySelector('.submenu');
        if (submenu) {
          submenu.classList.remove("show");
        }
      }
    });
  });

  // Ensure all links within the sidebar and submenu are clickable
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      console.log("Sidebar link clicked", link.href);
      if (sidebar.classList.contains("close")) {
        e.preventDefault();
        sidebar.classList.remove("close");
        setTimeout(() => {
          window.location.href = link.href;
        }, 300);
      }
    });
  });

  submenuLinks.forEach((submenuLink) => {
    submenuLink.addEventListener("click", (e) => {
      console.log("Submenu link clicked", submenuLink.href);
      if (sidebar.classList.contains("close")) {
        e.preventDefault();
        sidebar.classList.remove("close");
        setTimeout(() => {
          window.location.href = submenuLink.href;
        }, 300);
      }
    });
  });
});
