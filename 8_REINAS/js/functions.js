let contador = 0;
let reinas = []; // guardaremos {fila, col}
const solutions = [
    [0, 4, 7, 5, 2, 6, 1, 3],
    [0, 5, 7, 2, 6, 3, 1, 4],
    [1, 3, 5, 7, 2, 0, 6, 4]
];

coloresTablero();

function cellClick(celda, fila, col) {

    // Si está bloqueada y no tiene reina, NO hacer nada
    if (celda.classList.contains("bloqueada") && celda.textContent === "") {
        return;
    }

    // Si la celda está vacía -> poner reina
    if (celda.textContent === "") {
        if (contador < 8) {

            // si está atacada no permitir colocar
            if (estaAtacada(fila, col)) return;

            const reinaElegida = document.getElementById("queenStyle").value;
            celda.textContent = reinaElegida;
            contador++;

            reinas.push({ fila, col });
        }
    }
    // Si está ocupada -> quitar reina
    else {
        celda.textContent = "";
        contador--;

        reinas = reinas.filter(r => !(r.fila === fila && r.col === col));
    }

    actualizarBloqueos();
}


//colores del tablero
function coloresTablero() {
    const color1 = document.getElementById("color1");
    const color2 = document.getElementById("color2");

    color1.addEventListener("input", () => {
        document.documentElement.style.setProperty(
            "--color-celda1",
            color1.value
        );
    });

    color2.addEventListener("input", () => {
        document.documentElement.style.setProperty(
            "--color-celda2",
            color2.value
        );
    });
}

function reiniciarTablero() {
    const celdas = document.querySelectorAll("#tablero td");
    celdas.forEach(celda => {
        celda.textContent = "";
        celda.classList.remove("bloqueada");
    });
    contador = 0;
    reinas = [];
}

function cargarSolucion(index) {
    reiniciarTablero();

    const reina = document.getElementById("queenStyle").value;
    const tablero = document.getElementById("tablero");
    const solucion = solutions[index];

    reinas = [];
    for (let fila = 0; fila < 8; fila++) {
        const col = solucion[fila];
        const celda = tablero.rows[fila].cells[col];
        celda.textContent = reina;
        reinas.push({ fila, col });
    }

    contador = 8;
    actualizarBloqueos();
}

document.querySelectorAll(".solBtn").forEach(btn => {
    btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.sol);
        cargarSolucion(idx);
    });
});

function estaAtacada(fila, col) {
    return reinas.some(r => {
        const mismaFila = r.fila === fila;
        const mismaCol = r.col === col;
        const mismaDiag = Math.abs(r.fila - fila) === Math.abs(r.col - col);
        return mismaFila || mismaCol || mismaDiag;
    });
}

function actualizarBloqueos() {
    const tablero = document.getElementById("tablero");

    for (let fila = 0; fila < 8; fila++) {
        for (let col = 0; col < 8; col++) {
            const celda = tablero.rows[fila].cells[col];

            // limpiar primero
            celda.classList.remove("bloqueada");

            // si NO tiene reina y está atacada => bloquear
            const hayReinaAqui = reinas.some(r => r.fila === fila && r.col === col);

            if (!hayReinaAqui && estaAtacada(fila, col)) {
                celda.classList.add("bloqueada");
            }
        }
    }
}

//cambiar el color de las celdas de la fila, columna y diagonales seleccionada a rojo
function cambiar(r, c) {
    const tablero = document.getElementById("tablero");

    limpiar(); // quita resaltado anterior

    function resaltarCelda(fila, col) {
        const celda = tablero.rows[fila].cells[col];

        // 👇 si está bloqueada NO se resalta
        if (celda.classList.contains("bloqueada")) return;

        celda.classList.add("resaltada");
    }

    // fila y columna
    for (let i = 0; i < 8; i++) {
        resaltarCelda(r, i); // fila
        resaltarCelda(i, c); // columna
    }

    // diagonal principal (\)
    for (let i = -7; i <= 7; i++) {
        let rr = r + i;
        let cc = c + i;
        if (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) {
            resaltarCelda(rr, cc);
        }
    }

    // diagonal secundaria (/)
    for (let i = -7; i <= 7; i++) {
        let rr = r + i;
        let cc = c - i;
        if (rr >= 0 && rr < 8 && cc >= 0 && cc < 8) {
            resaltarCelda(rr, cc);
        }
    }
}

//limpiar los colores de las celdas
function limpiar() {
  const celdas = document.querySelectorAll("#tablero td");
  celdas.forEach(td => td.classList.remove("resaltada"));
}