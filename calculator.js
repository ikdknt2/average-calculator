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

//////////////
//更新呼び出し
//////////////
function updateAll() {
  const values = getValues(); // ←共通で使う

  calcAO5(values);
  calcBPA(values);
  calcWPA(values);
  highlightBestWorst(values); // ←ここ！！
}

//////////
// 値獲得
//////////
function getValues() {
  let values = [];

  for (let input of inputs) {
    const val = input.value.trim().toUpperCase();

    if (val === "") return []; // 未確定扱い

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


//////////////
// 色付け表示
/////////////
function highlightBestWorst(values) {
  // 一旦リセット
  inputs.forEach(input => {
    input.style.backgroundColor = "";
  });

  // 5つ揃ってないなら何もしない
  if (values.length !== 5) return;

  const dnfCount = values.filter(v => v === "DNF").length;

  // DNF2つ以上なら全部無効
  if (dnfCount >= 2) return;

  // 数値とインデックスをセットで保持
  let indexed = values.map((v, i) => ({
    value: v,
    index: i
  }));

  // DNFを最大扱い
  indexed.sort((a, b) => {
    if (a.value === "DNF") return 1;
    if (b.value === "DNF") return -1;
    return a.value - b.value;
  });

  // 最小（BEST）
  const best = indexed[0];
  // 最大（WORST）
  const worst = indexed[indexed.length - 1];

  // 色付け
  inputs[best.index].style.backgroundColor = "lightgreen";
  inputs[worst.index].style.backgroundColor = "lightcoral";
}


/////////////
//ao5計算
/////////////
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

  let numeric = values
    .filter(v => v !== "DNF")
    .sort((a, b) => a - b);

  if (dnfCount === 1) {
    numeric = numeric.slice(0, 3);
  } else {
    numeric = numeric.slice(1, 4);
  }

  const avg = numeric.reduce((a, b) => a + b, 0) / 3;
  result.textContent = avg.toFixed(2);
}

////////
// BPA
////////
function calcBPA(values) {
  if (values.length !== 4) {
    bpa.textContent = "未確定";
    return;
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

////////
// WPA
////////
function calcWPA(values) {
  if (values.length !== 4) {
    wpa.textContent = "未確定";
    return;
  }

  const dnfCount = values.filter(v => v === "DNF").length;

  if (dnfCount >= 1) {
    wpa.textContent = "DNF";
    return;
  }

  let numeric = values.slice();

  numeric.sort((a, b) => a - b);
  numeric.shift();

  const avg = numeric.reduce((a, b) => a + b, 0) / 3;

  wpa.textContent = avg.toFixed(2);
}
