"use strict";
const nav = document.querySelector(".nav");
const section1 = document.querySelector("#section-1");
const header = document.querySelector(".header");
const scrType = window.matchMedia("(max-width: 810px");

const handleHover = function (e) {
  if (e.target.classList.contains("nav_link")) {
    const link = e.target;
    const siblings = link.closest("nav").querySelectorAll(".nav_link");
    const logo = link.closest("nav").querySelector("img");
    siblings.forEach((element) => {
      if (element !== link) element.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));
nav.addEventListener("click", function (e) {
  if (e.target.classList.contains("nav_link")) {
    e.preventDefault();
    const id = e.target.getAttribute("href");
    const coords = document.querySelector(id);
    //REMOVED AN OLD WAY TO SCROLL VIEW
    // window.scrollTo({
    //   left: coords.left + window.pageXOffset,
    //   top: coords.top + window.pageYOffset,
    //   behavior: "smooth",
    // });
    coords.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

document.querySelectorAll(".articles").forEach((a) =>
  a.addEventListener("mousedown", (e) => {
    e.preventDefault();
    return false;
  })
);

const navShow = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const navObserve = new IntersectionObserver(navShow, {
  root: null,
  treshold: 0,
});
navObserve.observe(header);

// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener("scroll", function () {
//   if (this.scrollY >= initialCoords.top) {
//     nav.classList.add("sticky");
//   } else nav.classList.remove("sticky");
// });

const secShow = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  // observer.unobserve(entry);
};

const secObserver = new IntersectionObserver(secShow, {
  root: null,
  threshold: 0,
  rootMargin: "-90px",
});

const sections = document.querySelectorAll(".section");
sections.forEach((sec) => secObserver.observe(sec));

const switchMenu = function (scrT) {
  const navItem = document.querySelectorAll(".nav_item");
  const sideBarIcon = document.querySelector(".side_bar_icon");
  const socPanel = document.querySelector(".social_panel");
  if (scrT.matches) {
    navItem.forEach((el) => el.classList.add("hidden"));
    socPanel.classList.add("hidden");
    sideBarIcon.classList.remove("hidden");
  } else {
    navItem.forEach((el) => el.classList.remove("hidden"));
    socPanel.classList.remove("hidden");
    sideBarIcon.classList.add("hidden");
  }
};

switchMenu(scrType);
scrType.addEventListener("change", switchMenu);
