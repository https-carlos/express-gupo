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

// Rota GET para a página inicial
app.get('/', (req, res) => {
    res.render('index');
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
    if (dados.nome.length < 3) {
        error.nome = 'Por favor, insira um nome válido.';
    }

    // Validação do campo CPF
    if (isNaN(dados.cpf) || dados.cpf.length < 11) {
        error.cpf = 'Por favor, insira um CPF válido.';
    }

    // Validação da data de nascimento
    const dataAtual = new Date();
    const dataNascimento = new Date(dados.data_nascimento);

    if (isNaN(dataNascimento) || dataNascimento >= dataAtual) {
        error.data_nascimento = 'Por favor, insira uma data de nascimento válida.';
    }

    // Validação da renda mensal
    const regexRenda = /^\d+\.\d{2}$/;
    if (!regexRenda.test(dados.renda_mensal)) {
        error.renda_mensal = 'Por favor, insira apenas valores numéricos com casas decimais.';
    }

    // Validação do campo logradouro
    if (dados.logradouro.length < 3) {
        error.logradouro = 'Por favor, insira um logradouro válido.';
    }

    // Validação do campo número
    if (!Number.isInteger(parseFloat(dados.numero))) {
        error.numero = 'Por favor, insira um número válido.';
    }

    // Validação do campo cidade
    if (dados.cidade.length < 3) {
        error.cidade = 'Por favor, insira uma cidade válida.';
    }

    // Se houver erros, renderiza a página de registro com os erros e dados
    if (error.nome || error.cpf || error.data_nascimento || error.renda_mensal || error.logradouro || error.numero || error.cidade) {
        return res.render('registro', { error, dados });
    }

    // Se não houver erros, renderiza a página de sucesso com os dados do formulário
    else {
        return res.render('sucesso', { dados: dados });
    }
});

// Iniciando o servidor na porta 3000
app.listen(3000, () => console.log('Server ready'));
