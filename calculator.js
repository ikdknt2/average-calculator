function calcAO5() {
  const values = [
    parseFloat(document.getElementById("t1").value),
    parseFloat(document.getElementById("t2").value),
    parseFloat(document.getElementById("t3").value),
    parseFloat(document.getElementById("t4").value),
    parseFloat(document.getElementById("t5").value)
  ];

  // 未入力チェック
  if (values.some(v => isNaN(v))) {
    document.getElementById("result").textContent = "結果: 入力が足りません";
    return;
  }

  // ソート
  values.sort((a, b) => a - b);

  // 最大と最小を除く
  const trimmed = values.slice(1, 4);

  // 平均
  const avg = trimmed.reduce((a, b) => a + b, 0) / 3;

  // 小数点2桁表示
  document.getElementById("result").textContent = "結果: " + avg.toFixed(2);
}
