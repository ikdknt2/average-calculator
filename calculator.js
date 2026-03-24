// ===== 要素取得 =====
const resultDiv = document.getElementById("result")
const needDiv = document.getElementById("need")
const wpaNeedDiv = document.getElementById("wpaNeed")
const bpaDiv = document.getElementById("bpa")
const wpaDiv = document.getElementById("wpa")

// ===== タイム取得 =====
function getTimes(){
  const times=[]
  for(let i=1;i<=5;i++){
    const val=document.getElementById("t"+i).value
    const penalty=document.getElementById("p"+i).value
    times.push({val,penalty})
  }
  return times
}

// ===== 値変換 =====
function getValue(t){
  if(!t.val) return null
  let v=parseFloat(t.val)
  if(t.penalty==="+2") v+=2
  if(t.penalty==="DNF") return Infinity
  return v
}

// ===== Mo3 =====
function calcMo3(times){
  const v=times.map(getValue).filter(x=>x!==null)
  if(v.length!==3) return "--"
  if(v.includes(Infinity)) return "DNF"
  return (v.reduce((a,b)=>a+b,0)/3).toFixed(2)
}

// ===== Ao5 =====
function calcAo5(times){
  const v=times.map(getValue).filter(x=>x!==null)
  if(v.length!==5) return "--"

  const s=v.sort((a,b)=>a-b)
  const mid=s.slice(1,-1)

  if(mid.includes(Infinity)) return "DNF"
  return (mid.reduce((a,b)=>a+b,0)/3).toFixed(2)
}

// ===== 必要Mo3 =====
function requiredMo3(times,target){
  const v=times.map(getValue).filter(x=>x!==null)
  if(v.length!==2) return "--"
  if(v.includes(Infinity)) return "IMPOSSIBLE"

  const x=3*target-(v[0]+v[1])
  return x<0?"OK":x.toFixed(2)
}

// ===== 必要Ao5 =====
function requiredAo5(times,target){
  const base=times.map(getValue).filter(x=>x!==null)
  if(base.length!==4) return "--"

  if(base.filter(v=>v===Infinity).length>=2) return "IMPOSSIBLE"

  for(let x=0;x<=60;x+=0.01){
    const arr=[...base,x].sort((a,b)=>a-b)
    const t=arr.slice(1,-1)
    const avg=(t[0]+t[1]+t[2])/3
    if(avg<=target) return x.toFixed(2)
  }
  return "IMPOSSIBLE"
}

// ===== WPA用（仮想4つ）=====
function calcWPA4(times,x){
  const base=times.map(getValue).filter(v=>v!==null)
  const arr=[...base,x].sort((a,b)=>a-b)
  const t=arr.slice(0,3)

  if(t.includes(Infinity)) return Infinity
  return (t[0]+t[1]+t[2])/3
}

// ===== 4回目必要（WPA目標）=====
function requiredWPA(times,target){
  const base=times.map(getValue).filter(x=>x!==null)
  if(base.length!==3) return "--"
  if(base.includes(Infinity)) return "CHECK"

  for(let x=0;x<=60;x+=0.01){
    const w=calcWPA4(times,x)
    if(w<=target) return x.toFixed(2)
  }
  return "IMPOSSIBLE"
}

// ===== BPA =====
function calcBPA(times){
  const v=times.map(getValue).filter(x=>x!==null)
  if(v.length!==4) return "--"

  const s=[...v].sort((a,b)=>a-b)
  const best3=s.slice(1)

  if(best3.includes(Infinity)) return "DNF"
  return (best3.reduce((a,b)=>a+b,0)/3).toFixed(2)
}

// ===== WPA =====
function calcWPA(times){
  const v=times.map(getValue).filter(x=>x!==null)
  if(v.length!==4) return "--"

  const s=[...v].sort((a,b)=>a-b)
  const worst3=s.slice(0,3)

  if(worst3.includes(Infinity)) return "DNF"
  return (worst3.reduce((a,b)=>a+b,0)/3).toFixed(2)
}

// ===== 更新 =====
function update(){
  const mode=document.getElementById("mode").value
  const times=getTimes()
  const target=parseFloat(document.getElementById("target").value)

  if(mode==="mo3"){
    resultDiv.textContent="Mo3: "+calcMo3(times)
    needDiv.textContent="必要: "+(isNaN(target)?"--":requiredMo3(times,target))
    wpaNeedDiv.textContent="4回目必要(WPA): --"
    bpaDiv.textContent="BPA: --"
    wpaDiv.textContent="WPA: --"
  }

  if(mode==="ao5"){
    resultDiv.textContent="Ao5: "+calcAo5(times)

    needDiv.textContent="5回目必要: "+(isNaN(target)?"--":requiredAo5(times,target))
    wpaNeedDiv.textContent="4回目必要(WPA): "+(isNaN(target)?"--":requiredWPA(times,target))

    bpaDiv.textContent="BPA: "+calcBPA(times)
    wpaDiv.textContent="WPA: "+calcWPA(times)
  }
}
