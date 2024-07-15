import Sequelize from 'sequelize'

const hostname = '127.0.0.1'
const username = 'postgres'
const password = 'aaronfc20'
const database = 'pruebaFinal'
const dbPort = 5432
const dialect = 'postgres'

const sequelize = new Sequelize(database, username, password, {
    host: hostname,
    port: dbPort,
    dialect: dialect,
    operatorAliases: false
})

export { sequelize };
export default sequelize;
