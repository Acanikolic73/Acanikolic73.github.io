let a = [],A = [],errors = 0,kojiX = -1,kojiY = -1,level = 1;
let iter = 0;
const n = 9;
const k = 3;
function rndm(l,r) {
    return Math.floor(Math.random() * (r - l + 1)) + l;
}
function build() {
    for(let i = 0; i < n; i++) {
        a[i] = [];
        A[i] = [];
        for(let j = 0; j < n; j++) a[i][j] = 0;
    }
}
function mogu(b,i,j,val) {
    for(let Q = 0; Q < n; Q++) if(b[i][Q] == val || b[Q][j] == val) return false;
    let L = i - (i % k),R = j - (j % k);
    for(let Q = 0; Q < k; Q++) {
        for(let W = 0; W < k; W++) {
            if(b[L + Q][R + W] == val) return false;
        }
    }
    return true;
}
function nadji(b) {
    let ret = [];
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n; j++) {
            if(b[i][j] == 0) {
                ret[0] = i;
                ret[1] = j;
                return ret;
            }
        }
    }
    ret[0] = -1;
    return ret;
}
function resi(b) {
    let pos = nadji(b);
    if(pos[0] == -1) {
        for(let i = 0; i < n; i++) for(let j = 0; j < n; j++) a[i][j] = b[i][j],A[i][j] = b[i][j];
        iter += 1;
        return true;
    }
    let was = [];
    let vec = [];
    let N = 0;
    while(N < n) {
        let X = rndm(1,9);
        if(was[X] == true) continue;
        was[X] = true;
        vec[N++] = X;
    }
    for(let i = 0; i < N; i++) {
        let order = vec[i];
        if(mogu(b,pos[0],pos[1],order) == false) continue;
        b[pos[0]][pos[1]] = order;
        if(resi(b)) return true;
        b[pos[0]][pos[1]] = 0;
    }
    return false;
}
function check(b) {
    for(let i = 0; i < n; i++) {
        let was = [];
        for(let j = 0; j < n; j++) {
            if(b[i][j] == 0) return false;
            if(was[b[i][j]]) return false;
            was[b[i][j]] = true;
        }
    }
    for(let i = 0; i < n; i++) {
        let was = [];
        for(let j = 0; j < n; j++) {
            if(was[b[j][i]]) return false;
            was[b[j][i]] = true;
        }
    }
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n; j++) {
            let L = i - i % k,R = j - j % k;
            let was = [];
            for(let Q = 0; Q < k; Q++) {
                for(let W = 0; W < k; W++) {
                    if(was[b[L + Q][R + W]]) return false;
                    was[b[L + Q][R + W]] = true;
                }
            }
        }
    }
    return true;
}
function solve() {
    build();
    resi(a);
    console.log(A);
    /*brisi neka*/
    let probaj = 15 + level;
    let was = [],xx = [],yy = [],E = 0;
    for(let i = 0; i < n; i++) was[i] = [];
    while(probaj--) {
        let i = rndm(0,8),j = rndm(0,8);
        if(was[i][j] == true) {
            probaj += 1;
            continue;
        }
        let old = a[i][j];
        iter = 0;
        for(let ii = 0; ii < E; ii++) a[xx[ii]][yy[ii]] = 0;
        a[i][j] = 0;
        resi(a);
        if(iter == 1) {
            was[i][j] = true;
            xx[E] = i;
            yy[E++] = j;
        }else {
            a[i][j] = old;
            probaj += 1;
        }
    }
    for(let i = 0; i < E; i++) a[xx[i]][yy[i]] = 0;
    if(E != 15 + level) reset();
}

solve();

function reset() {
    errors = 0;
    for(let i = 0; i < n; i++) for(let j = 0; j < n; j++) a[i][j] = 0,A[i][j] = 0;
    solve();
    for(let i=0;i<9;i++) {
        for(let j=0;j<9;j++) {
            document.getElementById("cell"+i+j).innerHTML=(a[i][j] == 0 ? " " : a[i][j]);
            document.getElementById("cell" + i + j).contentEditable = (a[i][j] == 0 ? "true" : "false");
        }
    }
}

function clk(tt,i,j) {
    if(isNaN(tt)) {
        window.alert("Niste uneli broj");
        document.getElementById("cell" + i + j).innerHTML = "";
        return;
    }
    if(tt < 1 || tt > 9) {
        window.alert("Broj mora biti veci od 0 i manji od 10");
        document.getElementById("cell" + i + j).innerHTML = "";
        return;
    }
    if(tt == A[i][j]) {
        document.getElementById("cell" + i + j).innerHTML=A[i][j];
        document.getElementById("cell" + i + j).contentEditable = "false";
        a[i][j] = A[i][j];
        console.log(a);
        if(check(a)) {
            window.alert("Uspesno ste resili sudoku");
            level += 1;
            document.getElementById("lvl").innerHTML = "Level " + level;
            reset();
            return;
        }
    }else {
        document.getElementById("cell" + i + j).innerHTML = "";
        if(errors < 2) window.alert("Greska (Ukoliko imate 3 greske sistem Vas izbacuje)");
        errors += 1;
        if(errors == 3) {
            window.alert("Izgubio si igru");
            spusti();
            reset();
            return;
        }
    }
}

//0-ti red

for(let i = 0; i < n; i++) {
    for(let j = 0; j < n; j++) {
        document.getElementById("cell" + i + j).addEventListener("input",function() {
            if(a[i][j] > 0) return;
            let val = document.getElementById("cell" + i + j).innerText.trim();
            clk(val,i,j);
        });
    }
}

/************************************************************************************************************ */



for(let i=0;i<9;i++) {
    for(let j=0;j<9;j++) {
        document.getElementById("cell"+i+j).innerHTML=(a[i][j] == 0 ? " " : a[i][j]);
        document.getElementById("cell" + i + j).contentEditable = (a[i][j] == 0 ? "true" : "false");
    }
}

function move(k,l)
{
    for(let i=0;i<9;i++)
        for(let j=0;j<9;j++)
            document.getElementById("cell"+i+j).style.backgroundColor="rgb(213, 216, 231)"
    for(let i=0;i<9;i++)
        document.getElementById("cell"+i+l).style.backgroundColor="rgb(163, 166, 181)";
    for(let j=0;j<9;j++)
        document.getElementById("cell"+k+j).style.backgroundColor="rgb(163, 166, 181)"; 

    let maxI, maxJ, m = (k/3)*3, n = (l/3)*3;
    if(k>=0&&k<=2){    
        maxI=2;
        m=0;
    }
    else if(k>=3&&k<=5){    
        maxI=5;
        m=3;
    }
    else{   
        maxI=8;
        m=6;
    }

    if(l>=0&&l<=2){    
        maxJ=2;
        n=0;
    }
    else if(l>=3&&l<=5){    
        maxJ=5;
        n=3;
    }
    else{   
        maxJ=8;
        n=6;
    }
    
    for(let i=m;i<=maxI;i++)
        for(let j=n;j<=maxJ;j++)
                document.getElementById("cell"+i+j).style.backgroundColor="rgb(163, 166, 181)";
}

document.addEventListener("mouseout", (event) => {
    for(let i=0;i<9;i++)
        for(let j=0;j<9;j++)
            document.getElementById("cell"+i+j).style.backgroundColor="rgb(213, 216, 231)"
});