const inputsDiv = document.getElementById("inputs")
const resultDiv = document.getElementById("result")
const needDiv = document.getElementById("need")
const wpaNeedDiv = document.getElementById("wpaNeed")
const bpaDiv = document.getElementById("bpa")
const wpaDiv = document.getElementById("wpa")

function createInputs(n){
  inputsDiv.innerHTML=""
  for(let i=0;i<n;i++){
    const row=document.createElement("div")
    row.className="row"

    row.innerHTML=`
      <input type="number" step="0.01" class="time">
      <button class="plus2">+2</button>
      <button class="dnf">DNF</button>
    `

    const plus2=row.querySelector(".plus2")
    const dnf=row.querySelector(".dnf")
    const input=row.querySelector(".time")

    plus2.onclick=()=>{
      plus2.classList.toggle("active")
      dnf.classList.remove("active")
      update()
    }

    dnf.onclick=()=>{
      dnf.classList.toggle("active")
      plus2.classList.remove("active")
      update()
    }

    input.oninput=update

    inputsDiv.appendChild(row)
  }
}

function getTimes(){
  return [...document.querySelectorAll(".row")].map(r=>{
    const time=parseFloat(r.querySelector(".time").value)
    const plus2=r.querySelector(".plus2").classList.contains("active")
    const dnf=r.querySelector(".dnf").classList.contains("active")
    return {time,plus2,dnf}
  })
}

function getValue(t){
  if(t.dnf) return Infinity
  if(isNaN(t.time)) return null
  return t.time + (t.plus2?2:0)
}

// ===== 平均 =====
function calcMo3(times){
  const v=times.map(getValue).filter(x=>x!==null)

  if(v.length===0) return "-"
  if(v.length<3) return v.join(", ")
  if(v.includes(Infinity)) return "DNF"

  return (v.reduce((a,b)=>a+b,0)/3).toFixed(2)
}

function calcAo5(times){
  const v=times.map(getValue).filter(x=>x!==null)

  if(v.length===0) return "-"
  if(v.length<=2) return v.join(", ")

  if(v.length===3){
    if(v.includes(Infinity)) return "DNF"
    return (v.reduce((a,b)=>a+b,0)/3).toFixed(2)
  }

  if(v.length===4){
    const s=[...v].sort((a,b)=>a-b)
    const t=s.slice(1,-1)
    if(t.includes(Infinity)) return "DNF"
    return ((t[0]+t[1])/2).toFixed(2)
  }

  if(v.length===5){
    if(v.filter(x=>x===Infinity).length>=2) return "DNF"
    const s=[...v].sort((a,b)=>a-b)
    const t=s.slice(1,-1)
    return (t.reduce((a,b)=>a+b,0)/3).toFixed(2)
  }
}

// ===== 目標 =====
function requiredMo3(times,target){
  const v=times.map(getValue).filter(x=>x!==null)
  if(v.length!==2) return ""
  if(v.includes(Infinity)) return "IMPOSSIBLE"

  const x=3*target-(v[0]+v[1])
  return x<0?"OK":x.toFixed(2)
}

function requiredAo5(times,target){
  const base=times.map(getValue).filter(x=>x!==null)
  if(base.length!==4) return ""

  if(base.filter(v=>v===Infinity).length>=2) return "IMPOSSIBLE"

  for(let x=0;x<=60;x+=0.01){
    const arr=[...base,x].sort((a,b)=>a-b)
    const t=arr.slice(1,-1)
    const avg=(t[0]+t[1]+t[2])/3
    if(avg<=target) return x.toFixed(2)
  }
  return "IMPOSSIBLE"
}

// ===== WPA必要 =====
function calcWPA4(times,x){
  const arr=[...times.map(getValue),x].sort((a,b)=>a-b)
  const t=arr.slice(1,-1)
  return (t[0]+t[1])/2
}

function requiredWPA(times,target){
  const base=times.map(getValue).filter(x=>x!==null)
  if(base.length!==3) return ""
  if(base.includes(Infinity)) return "CHECK"

  for(let x=0;x<=60;x+=0.01){
    const w=calcWPA4(times,x)
    if(w<=target) return x.toFixed(2)
  }
  return "IMPOSSIBLE"
}

// ===== BPA / WPA（正しい定義）=====
function calcBPA(times){
  const v=times.map(getValue).filter(x=>x!==null)
  if(v.length!==4) return ""

  const s=[...v].sort((a,b)=>a-b)
  const best3=s.slice(1)

  if(best3.includes(Infinity)) return "DNF"
  return (best3.reduce((a,b)=>a+b,0)/3).toFixed(2)
}

function calcWPA(times){
  const v=times.map(getValue).filter(x=>x!==null)
  if(v.length!==4) return ""

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
    needDiv.textContent=!isNaN(target)?"必要: "+requiredMo3(times,target):""
    wpaNeedDiv.textContent=""
    bpaDiv.textContent=""
    wpaDiv.textContent=""
  }

  if(mode==="ao5"){
    resultDiv.textContent="Ao5: "+calcAo5(times)

    needDiv.textContent=!isNaN(target)
      ?"5回目必要: "+requiredAo5(times,target)
      :""

    wpaNeedDiv.textContent=!isNaN(target)
      ?"4回目必要(WPA): "+requiredWPA(times,target)
      :""

    bpaDiv.textContent="BPA: "+calcBPA(times)
    wpaDiv.textContent="WPA: "+calcWPA(times)
  }
}

document.getElementById("mode").onchange=()=>{
  createInputs(document.getElementById("mode").value==="ao5"?5:3)
  update()
}

createInputs(5)
