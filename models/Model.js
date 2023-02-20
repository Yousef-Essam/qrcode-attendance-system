const Client = require('./client');

class Model {
    constructor(tableName) {
        this.name = tableName;
    }

    createFilter (filter) {
        let filters = []
        for (let key in filter) {
            if (filter[key] !== undefined) {
                let value = filter[key]
                value = typeof value === 'string' ? `'${value}'` : value
                filters.push(`${key}=${value}`)
            }
        }
    
        return `${filters.length !== 0 ? ' WHERE ' : ''}${filters.join(
            ' AND '
        )}`
    }
    
    createInsertQuery (newRow) {
        let columns = []
        let values = []
    
        for (let key in newRow) {
            if (newRow[key] !== undefined) {
                columns.push(key)
                let value = newRow[key]
                value = typeof value === 'string' ? `'${value}'` : value
                values.push(value)
            }
        }
    
        return `INSERT INTO ${this.name} (${columns.join(', ')}) VALUES (${values.join(
            ', '
        )});`
    }
    
    createSelectQuery (cols = '*', filter) {
        return `SELECT ${
            cols == '*' ? '*' : cols.join(', ')
        } FROM ${this.name}${this.createFilter(filter)};`
    }
    
    createUpdateQuery (newVals, filter) {
        let newV = []
    
        for (let key in newVals) {
            if (newVals[key] !== undefined) {
                let value = newVals[key]
                value = typeof value === 'string' ? `'${value}'` : value
                newV.push(`${key}=${value}`)
            }
        }
        let filterString = this.createFilter(filter)
        return `UPDATE ${this.name} SET ${newV.join(', ')}${filterString};`
    }
    
    createDeleteQuery (filter) {
        return `DELETE FROM ${this.name}${this.createFilter(filter)};`
    }

    async create (newRow) {
        try {
            const conn = await Client.getConnection()
            const query = this.createInsertQuery(newRow)
            const [results, fields] = await conn.query(query);
            conn.release()
    
            return results;
        } catch (err) {
            throw new Error(
                `Can not add new row to Table ${this.name} ${err.message}`
            )
        }
    }
    
    async read (cols = '*', filter) {
        try {
            const conn = await Client.getConnection()
            const query = this.createSelectQuery(cols, filter)
            const [results, fields] = await conn.query(query)
            conn.release()
    
            return results;
        } catch (err) {
            throw new Error(
                `Can not read from Table ${this.name} ${err.message}`
            )
        }
    }
    
    async update (newVals, filter) {
        try {
            const conn = await Client.getConnection()
            const query = this.createUpdateQuery(newVals, filter)
            const [results, fields] = await conn.query(query);
            conn.release()
    
            return results;
        } catch (err) {
            throw new Error(
                `Can not update Table ${this.name} ${err.message}`
            )
        }
    }
    
    async del (filter) {
        try {
            const conn = await Client.getConnection()
            const query = this.createDeleteQuery(filter)
            const [results, fields] = await conn.query(query)
            conn.release()
    
            return results;
        } catch (err) {
            throw new Error(
                `Can not delete from Table ${this.name} ${err.message}`
            )
        }
    }
}

Model.query = async (query) => {
    try {
        const conn = await Client.getConnection()
        const [results, fields] = await conn.query(query)
        conn.release()

        return results;
    } catch (err) {
        throw new Error(
            `Can not make query ${err.message}`
        )
    }
}

module.exports = Model;