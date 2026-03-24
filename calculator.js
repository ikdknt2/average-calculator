const inputs = [
  document.getElementById("t1"),
  document.getElementById("t2"),
  document.getElementById("t3"),
  document.getElementById("t4"),
  document.getElementById("t5")
];

const result = document.getElementById("result");
const bpa = document.getElementById("bpa");
const wpa = document.getElementById("wpa");

// 入力イベント
inputs.forEach((input, index) => {
  input.addEventListener("input", updateAll);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    }
  });
});

////////////////
// 更新
////////////////
function updateAll() {
  const values = getValues();

  calcAO5(values);
  calcBPA();
  calcWPA();
  highlightBestWorst(values);
}

////////////////
// 値取得（5個全部）
////////////////
function getValues() {
  let values = [];

  for (let input of inputs) {
    const val = input.value.trim().toUpperCase();

    if (val === "") return [];

    if (val === "DNF") {
      values.push("DNF");
    } else {
      const num = parseFloat(val);
      if (isNaN(num)) return [];
      values.push(num);
    }
  }

  return values;
}

////////////////
// 色付け
////////////////
function highlightBestWorst(values) {
  inputs.forEach(input => input.style.backgroundColor = "");

  if (values.length !== 5) return;

  const dnfCount = values.filter(v => v === "DNF").length;
  if (dnfCount >= 2) return;

  let indexed = values.map((v, i) => ({ value: v, index: i }));

  indexed.sort((a, b) => {
    if (a.value === "DNF") return 1;
    if (b.value === "DNF") return -1;
    return a.value - b.value;
  });

  inputs[indexed[0].index].style.backgroundColor = "lightgreen";
  inputs[indexed[4].index].style.backgroundColor = "lightcoral";
}

////////////////
// AO5
////////////////
function calcAO5(values) {
  if (values.length !== 5) {
    result.textContent = "未確定";
    return;
  }

  const dnfCount = values.filter(v => v === "DNF").length;

  if (dnfCount >= 2) {
    result.textContent = "DNF";
    return;
  }

  let numeric = values.filter(v => v !== "DNF").sort((a, b) => a - b);

  if (dnfCount === 1) {
    numeric = numeric.slice(0, 3);
  } else {
    numeric = numeric.slice(1, 4);
  }

  const avg = numeric.reduce((a, b) => a + b, 0) / 3;
  result.textContent = avg.toFixed(2);
}

////////////////
// BPA（1〜4）
////////////////
function calcBPA() {
  if (inputs[3].value.trim() === "") {
    bpa.textContent = "未確定";
    return;
  }

  let values = [];

  for (let i = 0; i < 4; i++) {
    const val = inputs[i].value.trim().toUpperCase();

    if (val === "DNF") {
      values.push("DNF");
    } else {
      const num = parseFloat(val);
      if (isNaN(num)) {
        bpa.textContent = "未確定";
        return;
      }
      values.push(num);
    }
  }

  const dnfCount = values.filter(v => v === "DNF").length;

  if (dnfCount >= 2) {
    bpa.textContent = "DNF";
    return;
  }

  let numeric = values.filter(v => v !== "DNF");

  if (dnfCount === 1) {
    const avg = numeric.reduce((a, b) => a + b, 0) / 3;
    bpa.textContent = avg.toFixed(2);
    return;
  }

  numeric.sort((a, b) => a - b);
  numeric.pop();

  const avg = numeric.reduce((a, b) => a + b, 0) / 3;
  bpa.textContent = avg.toFixed(2);
}

////////////////
// WPA（1〜4）
////////////////
function calcWPA() {
  if (inputs[3].value.trim() === "") {
    wpa.textContent = "未確定";
    return;
  }

  let values = [];

  for (let i = 0; i < 4; i++) {
    const val = inputs[i].value.trim().toUpperCase();

    if (val === "DNF") {
      wpa.textContent = "DNF";
      return;
    }

    const num = parseFloat(val);
    if (isNaN(num)) {
      wpa.textContent = "未確定";
      return;
    }

    values.push(num);
  }

  values.sort((a, b) => a - b);
  values.shift();

  const avg = values.reduce((a, b) => a + b, 0) / 3;
  wpa.textContent = avg.toFixed(2);
}
