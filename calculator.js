const inputs = [
  document.getElementById("t1"),
  document.getElementById("t2"),
  document.getElementById("t3"),
  document.getElementById("t4"),
  document.getElementById("t5")
];

const result = document.getElementById("result");

// 入力ごとに自動更新
inputs.forEach(input => {
  input.addEventListener("input", calcAO5);
});

function calcAO5() {
  const values = inputs.map(input => parseFloat(input.value));

  // 未入力がある場合
  if (values.some(v => isNaN(v))) {
    result.textContent = "未確定";
    return;
  }

  // ソート
  values.sort((a, b) => a - b);

  // 最大と最小を除外
  const trimmed = values.slice(1, 4);

  // 平均
  const avg = trimmed.reduce((a, b) => a + b, 0) / 3;

  result.textContent = avg.toFixed(2);
}
