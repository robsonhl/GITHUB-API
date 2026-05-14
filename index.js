// consumir api do github FEITO
// ler perfil digitado pelo usuario FEITO
// retornar os dados e salvar em json

// imports necessários
const readlinePromises = require("node:readline/promises");
const { stdin, stdout } = require("process");
const fs = require("fs");
const open = async (url) => {
  const { default: openApp } = await import("open");
  return openApp(url);
};
// const imageToAscii = require("image-to-ascii");
const terminalWidow = readlinePromises.createInterface(stdin, stdout);

//leitura inicial e conversão para objeto do DB (JSON)
const arquivo = fs.readFileSync("./profiles.json");
const arquivoJson = JSON.parse(arquivo);

// limpa e inicia o menu de opcoes
console.clear();
menu();

async function lerPerfilsGravados() {
  console.clear();
  retornaPerfis();
  const verPerfil = await terminalWidow.question(
    fundoVermelho(
      "Deseja ver algum perfil? digite o login dele ou 2 - para retornar ao menu ",
    ),
  );

  switch (verPerfil) {
    case "2":
      menu();
      break;
    default:
      const verificaPerfil = arquivoJson.profiles.find(
        (perfil) => perfil.login.toLowerCase() == verPerfil.toLowerCase(),
      );
      if (verificaPerfil) {
        await open(verificaPerfil.avatar_url);
      } else {
        console.log("Perfil não encontrado no arquivo");
      }

      setTimeout(() => {
        menu();
      }, 1000);

      break;
  }
}

async function deletarPerfilGravado(perfil) {
  retornaPerfis();
  const getLogin = await terminalWidow.question(
    fundoVermelho("Digite o login do perfil que deseja deletar: "),
  );
  const filtraPerfil = await arquivoJson.profiles.login;

  const a = arquivoJson.profiles.indexOf(getLogin);

  const deletar = arquivoJson.profiles.forEach((element) => {
    if (element.login.toLowerCase() === getLogin.toLowerCase()) {
      arquivoJson.profiles.splice(arquivoJson.profiles.indexOf(element), 1);
    }
  });
  fs.writeFileSync("./profiles.json", JSON.stringify(arquivoJson)); // escreveu no arquivo
  console.log(fundoVermelho(getLogin + " deletado! retornando ao menu"));
  setTimeout(() => {
    console.clear();
  }, 1000);
  setTimeout(() => {
    menu();
  }, 1500);
}
async function gravarPerfil(perfil) {
  arquivoJson.profiles.push(perfil); // adicionou ao array do objeto
  fs.writeFileSync("./profiles.json", JSON.stringify(arquivoJson)); // escreveu no arquivo
}
async function menu() {
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
        // menu();
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

async function consultarPerfil() {
  const nome = await terminalWidow.question("Digite o perfil do Github: ");
  const response = await fetch(`https://api.github.com/users/${nome}`);
  const perfil = await response.json();

  if (perfil.status !== "404") {
    console.log(perfil);
  } else {
    console.log("Pefil não encontrado! retornando ao menu");
    menu();
  }

  const desejaGravar = await terminalWidow.question(
    "Deseja salvar o perfil pesquisado? 1 - sim 2 - não\n",
  );

  const retorna = await terminalWidow.question(
    "Deseja retornar ao menu? 1 - sim 2 - não \n",
  );

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

// roda as opcoes (inicial)

// // function convertImgToAscii(img) {
//   imageToAscii(img, (err, converted) => {
//     console.log(err || converted);
//   });
// }
function fundoAmarelo(string) {
  return "\x1b[43m" + string + " \x1b[0m";
}
function fundoVermelho(string) {
  return "\x1b[31m" + string + " \x1b[0m";
}
function retornaPerfis() {
  arquivoJson.profiles.map((profile) => {
    console.log("Nome: ", profile.login);
  });
}