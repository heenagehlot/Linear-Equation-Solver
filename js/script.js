function goToLevel(level) {
    window.location.href = 'levels/' + level + '.html';
    console.log("Script loaded!");
}

//LEVEL 3 JS
function solveEquations() {
    const input = document.getElementById("equationInput").value.trim();
    const resultBox = document.getElementById("result");
    const solutionOutput = document.getElementById("solutionOutput");
  
    try {
      console.log("Input received:", input);
  
      if (!input || !input.includes("=")) throw "Invalid";
  
      const equations = input.split(",").map(eq => eq.trim());
      const variablesSet = new Set();
      const parsedEquations = [];
  
      // Regex fix: handle terms like x, +x, -x, 2x, -2x
      const termRegex = /^([+-]?[\d.]*)?([a-zA-Z]+)$/;
  
      for (let eq of equations) {
        const [lhs, rhs] = eq.split("=");
        if (!lhs || !rhs) throw "Invalid";
  
        const coeffs = {};
        const terms = lhs.replace(/-/g, "+-").split("+").filter(Boolean);
  
        for (let term of terms) {
          const match = term.trim().match(termRegex);
          if (!match) throw "Invalid format";
  
          let [ , coeff, variable ] = match;
          if (coeff === "" || coeff === "+" || coeff === undefined) coeff = 1;
          else if (coeff === "-") coeff = -1;
          else coeff = parseFloat(coeff);
  
          coeffs[variable] = (coeffs[variable] || 0) + coeff;
          variablesSet.add(variable);
        }
  
        parsedEquations.push({ coeffs, rhs: parseFloat(rhs.trim()) });
      }
  
      const variables = Array.from(variablesSet).sort();
      const A = parsedEquations.map(eq => variables.map(v => eq.coeffs[v] || 0));
      const b = parsedEquations.map(eq => eq.rhs);
  
      const result = math.lusolve(A, b);
  
      let output = '<ul style="list-style: none;">';
      result.forEach((val, i) => {
        output += `<li class="step"><strong>${variables[i]}</strong> = <span style="color: #00ffcc;">${val[0].toFixed(2)}</span></li>`;
      });
      output += "</ul>";
  
      solutionOutput.innerHTML = output;
      resultBox.style.display = "block";
  
    } catch (err) {
      resultBox.style.display = "block";
      solutionOutput.innerHTML = `<p style="color: red;">❌ Invalid equation format. Please enter equations like: <code>x+y=5, x-y=1</code></p>`;
      console.error("Error:", err);
    }
  }
  