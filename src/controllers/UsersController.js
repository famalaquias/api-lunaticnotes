/* 
  Vai processar as requisições da nossa aplicação 
*/

/* hash: é a função que vai gerar a criptografia */
const { hash, compare } = require('bcryptjs');

const AppError = require('../utils/AppError'); 

/* importando a conexão com o BD */
const sqliteConnection = require('../database/sqlite');

class UsersController {
  /* 
    create: criando usuários;
    método GET;
  */
  async create(req, res) {
    const { name, email, password } = req.body;

    console.log(name, email, password);

    /* conectando com o BD */
    const database = await sqliteConnection();
    
    /* verificando se o usuário já existe no BD, através do email;
    GET: busca por informações */
    const checkUserExist = await database
    .get(
      "SELECT * FROM users WHERE email = (?)", [ email ]
    );

    if(checkUserExist) {
      throw new AppError("Este email já está em uso.");
    }

    /* hashPassword: é a senha criptografada. Pega a função de hash 
    e passa como parâmetro: a senha e o fator de complexidade do hash */
    const hashPassword = await hash(password, 8);

    /* run: executando uma inserção - cria um dado de usuário no 
    BD do beekepe: insira em usuários na coluna name, email, 
    password, os valores [ name, email, password ];
    */
    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [ name, email, hashPassword ]
    );

    return res.status(201).json({ message: "Usuário criado com sucesso!" });
  }

  /*  
    update: atualiza algum dado/registro do usuário;
    método PUT;
  */
  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    /* const { id } = req.params; */
    /* após criar o arquivo e a rota de autenticação do usuário,
    não se usa mais a conts acima(const { id } = req.params), vai
    usar o const user_id = req.user.id, pois agora já tem o Id 
    indorporado nas requisições; */
    const user_id = req.user.id;

    /* conectando com o BD */
    const database = await sqliteConnection();
    
    /* buscando pelo usuário existente no BD, através do id */
    const user = await database
    .get(
      "SELECT * FROM users WHERE id = (?)", [user_id]
    )

    if(!user) {
      throw new AppError("Usuário não encontrado.");
    }

    /* verifica se a pessoa está tentando mudar o email dela
    para um email que já existe no BD */
    const userWithUpdateEmail = await database
    .get(
      "SELECT * FROM users WHERE email = (?)", [ email ]
    )

    /* se encontrar um email & se esse email.id for diferente
    do id do usuário, significa que está tentando mudar o email
    para um email que já existe, logo retorne um erro */
    if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
      throw new AppError("Este email já está em uso.");
    }

    /* se estiver tudo ok: mude o nome e o email;
    Validando nome e e-mail: se existir conteúdo dentro de name, 
    o name será utilizado; se não, o que será utilizado será o 
    user.name, ou seja, o que já estava/antigo */
    user.name = name ?? user.name;  
    user.email = email ?? user.email;

    /* se a nova senha for informada, mas a senha antiga
    (old_password) não for informada, retorna a um erro */
    if(password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga.");
    }

    /* verifica se a senha antiga é igual a que está cadastrada 
    no BD; nesse caso usa-se o 'compare', pois tem que comparar
    com a senha criptografada cadastrada */
    if(password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      /* se for falso, a senha antiga não é igual a criptografada */
      if(!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      /* se for igual, atualize a senha, e já faça a criptografia dela */
      user.password = await hash(password, 8);
    }

    await database.run(`
      UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
        WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    );

    return res.status(200).json();
  }
}

module.exports = UsersController;
