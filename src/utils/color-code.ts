const code = {
  Red: { code: "[0;31m", style: { color: "#b8312f" } },
  BoldRed: { code: "[1;31m", style: { color: "#b8312f", fontWeight: "bold" } },
  Green: { code: "[0;32m", style: { color: "#7c9202" } },
  BoldGreen: {
    code: "[1;32m",
    style: { color: "#7c9202", fontWeight: "bold" },
  },
  Yellow: { code: "[0;33m", style: { color: "#b48801" } },
  BoldYellow: {
    code: "[1;33m",
    style: { color: "#b48801", fontWeight: "bold" },
  },
  Blue: { code: "[0;34m", style: { color: "#3e9bda" } },
  BoldBlue: { code: "[1;34m", style: { color: "#3e9bda", fontWeight: "bold" } },
  Magenta: { code: "[0;35m", style: { color: "#b23576" } },
  BoldMagenta: {
    code: "[1;35m",
    style: { color: "#b23576", fontWeight: "bold" },
  },
  Cyan: { code: "[0;36m", style: { color: "#24948c" } },
  BoldCyan: { code: "[1;36m", style: { color: "#24948c", fontWeight: "bold" } },
  Reset: { code: "[0m" },
};

export default code;
