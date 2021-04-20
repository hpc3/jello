module.exports = {
  purge: [],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        neumor: "20px 20px 60px #bebebe, -20px -20px 60px #ffffff",
        // neumorDark: "14px 14px 28px #252525,-14px -14px 28px #313131",
        neumorButton: "5px 5px 10px #b8bac2,-5px -5px 10px #ffffff",
      },
    },
    backgroundColor: (theme) => ({
      ...theme("colors"),
      lightBackground: "#eceff9",
      darkBackground: "#2b2b2b",
      // lightContainerBackground: "linear-gradient(225deg, #fdffff, #d4d7e0)",
      // darkContainerBackground: "linear-gradient(145deg, #2e2e2e, #272727)",
    }),
  },
  variants: {
    extend: {
      boxShadow: ["active"],
    },
  },
  plugins: [],
};
