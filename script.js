// =======================================
// CONFIGURAÇÕES
// =======================================

const META = 600;

const USUARIO = "admin";
const SENHA = "DN@2026";

let metaAlcancada = false;

// =======================================
// BANCO LOCAL
// =======================================

let arrecadado =
Number(localStorage.getItem("arrecadado")) || 0;

let historico =
JSON.parse(localStorage.getItem("historico")) || [];

let ranking =
JSON.parse(localStorage.getItem("ranking")) || {};

let mensagens =
JSON.parse(localStorage.getItem("mensagens")) || [];

// =======================================
// LOGIN
// =======================================

function login(){

    const usuario =
    document.getElementById("usuario").value.trim();

    const senha =
    document.getElementById("senha").value.trim();

    if(
        usuario === USUARIO &&
        senha === SENHA
    ){

        localStorage.setItem(
            "adminLogado",
            "true"
        );

        document.getElementById(
            "loginTela"
        ).style.display = "none";

        document.getElementById(
            "painelAdmin"
        ).style.display = "block";

        atualizarTela();

    }else{

        document.getElementById(
            "erroLogin"
        ).innerText =
        "Usuário ou senha inválidos.";

    }

}

function logout(){

    localStorage.removeItem(
        "adminLogado"
    );

    location.reload();

}

// =======================================
// FOGOS DE ARTIFÍCIO
// =======================================

function dispararFogos(){

    confetti({
        particleCount:200,
        spread:180,
        origin:{ y:0.6 }
    });

    setTimeout(()=>{

        confetti({
            particleCount:150,
            angle:60,
            spread:80,
            origin:{ x:0 }
        });

        confetti({
            particleCount:150,
            angle:120,
            spread:80,
            origin:{ x:1 }
        });

    },300);

    setTimeout(()=>{

        confetti({
            particleCount:250,
            spread:360
        });

    },700);

}

// =======================================
// DOAÇÕES
// =======================================

function adicionarDoacao(){

    const nome =
    document.getElementById("nome")
    .value.trim();

    const valor =
    parseFloat(
        document.getElementById("valor")
        .value
    );

    if(
        nome === "" ||
        isNaN(valor) ||
        valor <= 0
    ){

        alert(
            "Informe nome e valor válidos."
        );

        return;

    }

    arrecadado += valor;

    historico.push({

        nome:nome,

        valor:valor,

        data:
        new Date()
        .toLocaleDateString(
            "pt-BR"
        )

    });

    ranking[nome] =
    (ranking[nome] || 0)
    + valor;

    salvar();

    atualizarTela();

    document.getElementById(
        "nome"
    ).value = "";

    document.getElementById(
        "valor"
    ).value = "";

}

function excluirDoacao(index){

    if(
        !confirm(
            "Deseja excluir esta doação?"
        )
    ){
        return;
    }

    const doacao =
    historico[index];

    arrecadado -= doacao.valor;

    ranking[doacao.nome] -= doacao.valor;

    if(
        ranking[doacao.nome] <= 0
    ){

        delete ranking[doacao.nome];

    }

    historico.splice(index,1);

    if(arrecadado < META){

        metaAlcancada = false;

    }

    salvar();

    atualizarTela();

}

// =======================================
// MURAL
// =======================================

function toggleMural(){

    const mural =
    document.getElementById(
        "conteudoMural"
    );

    const icone =
    document.getElementById(
        "iconeMural"
    );

    if(
        mural.style.display ===
        "none"
    ){

        mural.style.display =
        "block";

        icone.innerHTML =
        "▲";

    }
    else{

        mural.style.display =
        "none";

        icone.innerHTML =
        "▼";

    }

}

function adicionarMensagem(){

    const autor =
    document.getElementById(
        "autorMensagem"
    ).value.trim();

    const texto =
    document.getElementById(
        "textoMensagem"
    ).value.trim();

    if(
        autor === "" ||
        texto === ""
    ){
        return;
    }

    mensagens.push({

        autor,

        texto,

        data:
        new Date()
        .toLocaleDateString(
            "pt-BR"
        )

    });

    salvar();

    renderizarMensagens();

    document.getElementById(
        "autorMensagem"
    ).value = "";

    document.getElementById(
        "textoMensagem"
    ).value = "";

}

function excluirMensagem(index){

    if(
        !confirm(
            "Excluir mensagem?"
        )
    ){
        return;
    }

    mensagens.splice(index,1);

    salvar();

    renderizarMensagens();

}

function limparMensagens(){

    if(
        !confirm(
            "Deseja apagar todas as mensagens?"
        )
    ){
        return;
    }

    mensagens = [];

    salvar();

    renderizarMensagens();

}

function renderizarMensagens(){

    const container =
    document.getElementById(
        "listaMensagens"
    );

    if(!container) return;

    container.innerHTML = "";

    mensagens
    .slice()
    .reverse()
    .forEach(
    (msg,index)=>{

        container.innerHTML += `

        <div class="mensagem-card">

            <strong>
            ${msg.autor}
            </strong>

            <p>
            ${msg.texto}
            </p>

            <small>
            ${msg.data}
            </small>

            <br>

            <button
                class="excluir-msg"
                onclick="excluirMensagem(${mensagens.length - 1 - index})">

                Excluir

            </button>

        </div>

        `;

    });

}

// =======================================
// LOCAL STORAGE
// =======================================

function salvar(){

    localStorage.setItem(
        "arrecadado",
        arrecadado
    );

    localStorage.setItem(
        "historico",
        JSON.stringify(historico)
    );

    localStorage.setItem(
        "ranking",
        JSON.stringify(ranking)
    );

    localStorage.setItem(
        "mensagens",
        JSON.stringify(mensagens)
    );

}

// =======================================
// EXCEL
// =======================================

function exportarExcel(){

    const ws =
    XLSX.utils.json_to_sheet(
        historico
    );

    const wb =
    XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Doacoes"
    );

    XLSX.writeFile(
        wb,
        "Relatorio_Doacoes.xlsx"
    );

}

// =======================================
// ATUALIZAR DASHBOARD
// =======================================

function atualizarTela(){

    const percentual =
    (arrecadado / META) * 100;

    document.getElementById(
        "arrecadado"
    ).innerText =
    arrecadado.toLocaleString(
        "pt-BR",
        {
            style:"currency",
            currency:"BRL"
        }
    );

    document.getElementById(
        "percentual"
    ).innerText =
    percentual.toFixed(1) +
    "%";

    if(
        document.getElementById(
            "totalDoadores"
        )
    ){

        document.getElementById(
            "totalDoadores"
        ).innerText =
        Object.keys(
            ranking
        ).length;

    }

    document.getElementById(
        "barra"
    ).style.width =
    Math.min(
        percentual,
        100
    ) + "%";

    document.getElementById(
        "nivel"
    ).style.height =
    Math.min(
        percentual,
        100
    ) + "%";

    // META ALCANÇADA

    if(
        arrecadado >= META &&
        !metaAlcancada
    ){

        metaAlcancada = true;

        dispararFogos();

        const mensagem =
        document.getElementById(
            "mensagemMeta"
        );

        if(mensagem){

            mensagem.innerHTML =
            "🎉 META ALCANÇADA! 🎉";

        }

    }

    if(
        arrecadado < META
    ){

        metaAlcancada = false;

        const mensagem =
        document.getElementById(
            "mensagemMeta"
        );

        if(mensagem){

            mensagem.innerHTML = "";

        }

    }

    // RANKING

    const listaRanking =
    document.getElementById(
        "ranking"
    );

    if(listaRanking){

        listaRanking.innerHTML = "";

        Object.entries(ranking)

        .sort(
            (a,b)=>b[1]-a[1]
        )

        .forEach(item=>{

            listaRanking.innerHTML += `

            <li>

                ${item[0]}

                -

                ${item[1].toLocaleString(
                    "pt-BR",
                    {
                        style:"currency",
                        currency:"BRL"
                    }
                )}

            </li>

            `;

        });

    }

    // HISTÓRICO

    const listaHistorico =
    document.getElementById(
        "historico"
    );

    if(listaHistorico){

        listaHistorico.innerHTML = "";

        historico.forEach(
        (item,index)=>{

            listaHistorico.innerHTML +=

            `

            <li>

                <strong>
                ${item.nome}
                </strong>

                -

                ${item.valor.toLocaleString(
                    "pt-BR",
                    {
                        style:"currency",
                        currency:"BRL"
                    }
                )}

                <button
                    class="btn-excluir-doacao"
                    onclick="excluirDoacao(${index})">

                    🗑 Excluir

                </button>

            </li>

            `;

        });

    }

}

// =======================================
// INICIALIZAÇÃO
// =======================================

window.onload = function(){

    atualizarTela();

    renderizarMensagens();

    if(
        localStorage.getItem(
            "adminLogado"
        ) === "true"
    ){

        document.getElementById(
            "loginTela"
        ).style.display =
        "none";

        document.getElementById(
            "painelAdmin"
        ).style.display =
        "block";

    }

};