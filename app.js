// Importando o módulo Express para criar e configurar o servidor
const express = require('express');
const app = express();

// Configurando o EJS como mecanismo de visualização
app.set('view engine', 'ejs');

// Importando o módulo body-parser para analisar o corpo das requisições
const bodyParser = require('body-parser');

// Configurando o middleware do body-parser para analisar URL codificadas
app.use(bodyParser.urlencoded({ extended: true }));

// Configurando o middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(__dirname + '/public'));

var id = 1;
var users = [{
    id: id, nome: 'Isabela da Silva Santos', cpf: '123.456.789-01', data_nascimento: '15/08/1985', sexo: 'feminino', estado_civil: 'Solteira', renda_mensal: 3500.00,
    endereco: { logradouro: 'Rua das Flores', numero: 123, complemento: 'Apartamento 302', estado: 'São Paulo', cidade: 'São Paulo' }
}]

// Rota GET para a página inicial
app.get('/', (req, res) => {
    res.render('index', { users: users, id: id });
});


// Inicializando um objeto de erro vazio
var error = {};
// Rota GET para a página de registro
app.get('/registro', (req, res) => {
    var dados = {};
    res.render('registro', { dados: dados, error: error });
});

// Rota GET para a página de sucesso
app.get('/sucesso', (req, res) => {
    res.render('sucesso');
});

// Rota POST para validação dos dados do formulário
app.post('/validacao', (req, res) => {
    const dados = req.body;
    error = {}; // Limpa os erros para cada requisição

    // Validação do campo nome
    if (dados.nome.trim() === "" || dados.nome.length < 3) {
        error.nome = 'Por favor, insira um nome válido.';
    }

    // Validação do campo CPF
    if (dados.cpf.trim() === "" || isNaN(dados.cpf) || dados.cpf.length <= 11) {
        error.cpf = 'Por favor, insira um CPF válido.';
    }

   // Validação da data de nascimento
const dataAtual = new Date();
const dataNascimento = new Date(dados.data_nascimento);

if (isNaN(dataNascimento) || dataNascimento >= dataAtual) {
    error.data_nascimento = 'Por favor, insira uma data de nascimento válida.';
} else {
    // Convertendo a data de nascimento para o formato "dd/mm/aaaa"
    const dia = dataNascimento.getDate().toString().padStart(2, '0');
    const mes = (dataNascimento.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataNascimento.getFullYear();
    dados.data_nascimento_formatada = `${dia}/${mes}/${ano}`;
}
    // Validação da renda mensal
    const regexRenda = /^\d+\.\d{2}$/;
    if (!regexRenda.test(dados.renda_mensal)) {
        error.renda_mensal = 'Por favor, insira apenas valores numéricos com casas decimais.';
    }

    // Validação do campo logradouro
    if (dados.logradouro.trim() === "" || dados.logradouro.length < 3) {
        error.logradouro = 'Por favor, insira um logradouro válido.';
    }

    // Validação do campo número
    if (dados.numero.trim() === "" || !Number.isInteger(parseFloat(dados.numero))) {
        error.numero = 'Por favor, insira um número válido.';
    }

    // Validação do campo cidade
    if (dados.cidade.trim() === "" || dados.cidade.length < 3) {
        error.cidade = 'Por favor, insira uma cidade válida.';
    }

    if (dados.complemento.trim() === "") {
        error.complemento = 'Por favor, insira um complemento válido.';
    }

    // Se houver erros, renderiza a página de registro com os erros e dados
    if (error.nome || error.cpf || error.data_nascimento || error.renda_mensal || error.logradouro || error.numero || error.cidade || error.complemento) {
        return res.render('registro', { error, dados });
    }

    // Se não houver erros, renderiza a página de sucesso com os dados do formulário
    else {
        id++;
        users.push({
            id: id, nome: dados.nome, cpf: dados.cpf, data_nascimento: dados.data_nascimento_formatada, sexo: dados.sexo, estado_civil: dados.estado_civil, renda_mensal: dados.renda_mensal,
            endereco: { logradouro: dados.logradouro, numero: dados.numero, complemento: dados.complemento, estado: dados.estado, cidade: dados.cidade }
        });
        console.log(users)
        return res.render('sucesso', { dados: dados });
    }
});

app.post('/excluir/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    // Encontrar o índice do usuário no array com base no ID e quando encontrar deletar esse usuário
    const userIndex = users.findIndex(user => user.id === userId);
    users.splice(userIndex, 1);

    res.redirect('/');
});

// Iniciando o servidor na porta 3000
app.listen(3000, () => console.log('Server ready'));
