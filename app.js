const today = new Date()

const y = today.getFullYear()
const m = String(today.getMonth()+1).padStart(2,'0')
const d = String(today.getDate()).padStart(2,'0')

document.getElementById("tanggal").innerText =
today.toLocaleDateString("id-ID",{weekday:'long',year:'numeric',month:'long',day:'numeric'})

const url = `https://alkitab.mobi/2/renungan/roc/${y}/${m}/${d}/`

const proxy = "https://api.allorigins.win/raw?url="

fetch(proxy + encodeURIComponent(url))
.then(res=>res.text())
.then(html=>{

let parser = new DOMParser()
let doc = parser.parseFromString(html,"text/html")

let artikel = doc.querySelector("article")

if(artikel){
document.getElementById("renungan").innerHTML = artikel.innerHTML
}else{
document.getElementById("renungan").innerText = "Renungan belum tersedia."
}

})

/* QUOTES */

const quotes = [

"Iman bukan melihat jalan di depan, tetapi percaya bahwa Tuhan memimpin langkah.",
"Tuhan sering bekerja dalam diam, tetapi hasilnya tidak pernah sia-sia.",
"Doa bukan mengubah Tuhan, tetapi mengubah hati kita.",
"Ketaatan kecil setiap hari menghasilkan kemenangan besar.",
"Tuhan tidak pernah terlambat, manusia saja yang terlalu cepat putus asa.",
"Kesetiaan dalam perkara kecil membuka pintu perkara besar.",
"Kasih Tuhan tidak pernah gagal menjangkau hati yang mau kembali."

]

const dayIndex = today.getDate() % quotes.length

document.getElementById("quote").innerText = quotes[dayIndex]
