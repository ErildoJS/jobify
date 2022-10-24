"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const dbConfig_1 = require("./dbConfig");
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
const port = process.env.PORT || 3333;
app.get('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, dbConfig_1.openDb)();
    const categoriasDb = yield db.all('select * from categorias;');
    const vagas = yield db.all('select * from vagas;');
    const categorias = categoriasDb.map(categoria => {
        return Object.assign(Object.assign({}, categoria), { vagas: vagas.filter(vaga => vaga.categoria_id === categoria.id) });
    });
    response.render('home', {
        categorias
    });
}));
app.get('/vaga/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, dbConfig_1.openDb)();
    const vaga = yield db.get('select * from vagas where id = ' + request.params.id);
    response.render('vaga', {
        vaga
    });
}));
app.get('/admin', (request, response) => {
    response.render('admin/home');
});
app.get('/admin/vagas', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, dbConfig_1.openDb)();
    const vagas = yield db.all('select * from vagas;');
    response.render('admin/vagas', {
        vagas
    });
}));
app.get('/admin/vagas/delete/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, dbConfig_1.openDb)();
    yield db.run('delete from vagas where id = ' + request.params.id + '');
    response.redirect('/admin/vagas');
}));
app.get('/admin/vagas/nova', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    //const db = await openDb()
    const db = yield (0, dbConfig_1.openDb)();
    //await db.run('delete from vagas where id = ' + request.params.id + '')
    const categorias = yield db.all('select * from categorias');
    response.render('admin/nova-vaga', { categorias });
}));
app.post('/admin/vagas/nova', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { titulo, descricao, categoria_id } = request.body;
    const db = yield (0, dbConfig_1.openDb)();
    yield db.exec(`insert into vagas(categoria_id, titulo, descricao) values("${categoria_id}", "${titulo}", "${descricao}")`);
    return response.redirect('/admin/vagas');
}));
app.get('/admin/vagas/editar/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, dbConfig_1.openDb)();
    const categorias = yield db.all('select * from categorias');
    const vaga = yield db.get('select * from vagas where id = ' + request.params.id);
    response.render('admin/editar-vaga', { categorias, vaga });
}));
app.post('/admin/vagas/editar/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { titulo, descricao, categoria_id } = request.body;
    const { id } = request.params;
    const db = yield (0, dbConfig_1.openDb)();
    yield db.run(`update vagas set categoria_id = ${categoria_id}, titulo = '${titulo}', descricao = '${descricao}' where id = ${id}`);
    response.redirect('/admin/vagas');
}));
(0, dbConfig_1.openDb)().then(db => {
    //db.exec('create table if not exists categorias (id INTEGER PRIMARY KEY, name TEXT);')
    db.exec('create table if not exists vagas (id INTEGER PRIMARY KEY, categoria_id INTEGER, titulo TEXT, descricao TEXT);');
    //const categoryName = 'Marketing Team'
    //const vaga = 'Fullstack Developer (Remote)'
    //const vaga = 'Marketing Digital (San Francisco)'
    //const descricao = 'Vaga para marketing digital que fez o fullstack lab'
    //db.exec(`insert into categorias(name) values("${categoryName}")`)
    //db.exec(`insert into vagas(categoria_id, titulo, descricao) values(1, "${vaga}", "${descricao}")`)
});
app.listen(port, () => {
    console.log('running....');
});
