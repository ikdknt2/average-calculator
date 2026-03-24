const inputs = [
  document.getElementById("t1"),
  document.getElementById("t2"),
  document.getElementById("t3"),
  document.getElementById("t4"),
  document.getElementById("t5")
];

const result = document.getElementById("result");

// 入力イベント
inputs.forEach((input, index) => {
  input.addEventListener("input", calcAO5);

  // Enterで次へ
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    }
  });
});

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
