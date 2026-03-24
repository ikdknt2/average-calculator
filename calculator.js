const inputs = [
  document.getElementById("t1"),
  document.getElementById("t2"),
  document.getElementById("t3"),
  document.getElementById("t4"),
  document.getElementById("t5")
];

const result = document.getElementById("result");
const bpa = document.getElementById("bpa");

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

//更新呼び出し
function updateAll() {
  calcAO5();
  calcBPA();
}

//ao5計算
function calcAO5() {
  let values = [];

  for (let input of inputs) {
    const val = input.value.trim().toUpperCase();

    if (val === "") {
      result.textContent = "未確定";
      return;
    }

    if (val === "DNF") {
      values.push("DNF");
    } else {
      const num = parseFloat(val);
      if (isNaN(num)) {
        result.textContent = "未確定";
        return;
      }
      values.push(num);
    }
  }

  // DNFの数を数える
  const dnfCount = values.filter(v => v === "DNF").length;

  // DNFが2つ以上 → AO5はDNF
  if (dnfCount >= 2) {
    result.textContent = "DNF";
    return;
  }

  // 数値だけ取り出してソート
  let numeric = values
    .filter(v => v !== "DNF")
    .sort((a, b) => a - b);

  if (dnfCount === 1) {
    // DNF1つ → 最大扱いとして除外
    numeric = numeric.slice(0, 3);
  } else {
    // DNFなし → 最小と最大を除外
    numeric = numeric.slice(1, 4);
  }

  const avg = numeric.reduce((a, b) => a + b, 0) / 3;

  result.textContent = avg.toFixed(2);
}

function calcBPA() {
  let values = [];

  for (let input of inputs) {
    const val = input.value.trim().toUpperCase();

    if (val === "") continue;

    if (val === "DNF") {
      values.push("DNF");
    } else {
      const num = parseFloat(val);
      if (!isNaN(num)) values.push(num);
    }
  }

  // 4つ入力されてないと出さない
  if (values.length !== 4) {
    bpa.textContent = "未確定";
    return;
  }

  // DNF2つ以上 → BPAもDNF
  const dnfCount = values.filter(v => v === "DNF").length;
  if (dnfCount >= 2) {
    bpa.textContent = "DNF";
    return;
  }

  // 数値化（DNFは最大扱いのため一旦除外）
  let numeric = values.filter(v => v !== "DNF");

  // DNFが1つなら、それがWORSTなので除外される
  if (dnfCount === 1) {
    // 残り3つをそのまま平均
    const avg = numeric.reduce((a, b) => a + b, 0) / 3;
    bpa.textContent = avg.toFixed(2);
    return;
  }

  // DNFなし → 最大を除外
  numeric.sort((a, b) => a - b);

  // 最大を削除
  numeric.pop();

  const avg = numeric.reduce((a, b) => a + b, 0) / 3;

  bpa.textContent = avg.toFixed(2);
}
