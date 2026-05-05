// consumir api do github FEITO
// ler perfil digitado pelo usuario FEITO
// retornar os dados e salvar em json

const readlinePromises = require("node:readline/promises");
const { stdin, stdout } = require("process"); // entrada e saida padrão do sistema
const fs = require("fs");

const arquivo = fs.readFileSync("./profiles.json");
const arquivoJson = JSON.parse(arquivo);

console.clear();
// console.log(arquivo.profiles)

function fundoAmarelo(string) {
  return "\x1b[43m" + string + " \x1b[0m";
}
function fundoVermelho(string) {
  return "\x1b[31m" + string + " \x1b[0m";
}

const terminalWidow = readlinePromises.createInterface(stdin, stdout);

function lerPerfilsGravados() {
// fazendo
console.clear();
  arquivoJson.profiles.map((profile)=>{
    console.log("Nome: ", profile.login)
  })
 
}
async function deletarPerfilGravado(perfil) {
  //fazendo
   lerPerfilsGravados();
   const getLogin = await terminalWidow.question(fundoVermelho("Digite o login do perfil que deseja deletar: "));
//    console.log(fundoVermelho("Digite o login do perfil que deseja apagar: \n"))
   const filtraPerfil = await arquivoJson.profiles.login
//    await arquivoJson.profiles.forEach(element => {
//     element.login === perfil ? arquivoJson.profiles.splice(arquivoJson.profiles.findIndex(getLogin), 1) : { }
//    });

    const a = arquivoJson.profiles.indexOf(getLogin);
  
    const deletar = arquivoJson.profiles.forEach(element => {
        if(element.login === getLogin){
            arquivoJson.profiles.splice(arquivoJson.profiles.indexOf(element), 1)
        }
        
        
    });
    fs.writeFileSync('./profiles.json', JSON.stringify(arquivoJson)); // escreveu no arquivo
    console.log(fundoVermelho(getLogin+ " deletado! retornando ao menu"))
    setTimeout(() => {
        console.clear();       
    }, 1000);
    setTimeout(() => {
        menu();   
    }, 1500)
     
    
  
}
async function gravarPerfil(perfil){ // feito perfeito
    arquivoJson.profiles.push(perfil) // adicionou ao array do objeto     
    fs.writeFileSync('./profiles.json', JSON.stringify(arquivoJson)); // escreveu no arquivo
}
async function menu() { // feito perfeito
  //ok falta ajustes ainda
  console.log(
    "\n",
    fundoAmarelo("Digite a opção desejada:"),
    "\n \n",
    "1 - Consultar perfil do GitHub\n",
    "2 - Ver perfis gravados \n",
    "3 - Deletar perfil gravado \n",
    "4 - Sair \n",
  );

  async function opcao() {
    const recebeOpcao = await terminalWidow.question("");

    switch (recebeOpcao) {
      case "1":
        consultarPerfil();
        break;

      case "2":
        lerPerfilsGravados();
         menu();
        break;

      case "3":
        deletarPerfilGravado();
        break;

      case "4":
        console.clear();
        process.exit();
        break;

      default:
        console.log("opcao invalida! ", menu());
        break;
    }
  }
  const escolha = opcao();

  opcao();
}

async function consultarPerfil() { // feito perfeito
  //falta add opcao registrar perfil apos consulta
  const nome = await terminalWidow.question("Digite o perfil do Github: ");
  const response = await fetch(`https://api.github.com/users/${nome}`);
  const perfil = await response.json();

  console.log(perfil);

  const desejaGravar = await terminalWidow.question("Deseja salvar o perfil pesquisado? 1 - sim 2 - não\n");

  const retorna = await terminalWidow.question("Deseja retornar ao menu? 1 - sim 2 - não \n");
  
    switch (desejaGravar) {
    case "1":
        gravarPerfil(perfil);
    break;
    case "2":
        
    break;
    default: 
    break;  
  }
  
  switch (retorna) {
    case "1":
        console.clear();
      menu();
      break;
    case "2":
      terminalWidow.close();
  }


    
}

menu(); // roda as opcoes (inicial)
