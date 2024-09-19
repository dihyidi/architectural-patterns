interface IQueryBuilder {
    select(fields: string[]): this;
    where(condition: string): this;
    limit(limit: number): this;
    getSQL(): string;
}

class PostgreSqlQueryBuilder implements IQueryBuilder {
    private query: string = '';

    public select(fields: string[]): this {
        this.query += `SELECT ${fields.join(', ')} FROM table_name `;
        return this;
    }

    public where(condition: string): this {
        this.query += `WHERE ${condition} `;
        return this;
    }

    public limit(limit: number): this {
        this.query += `LIMIT ${limit} `;
        return this;
    }

    public getSQL(): string {
        return this.query.trim() + ';';
    }
}

class MySqlQueryBuilder implements IQueryBuilder {
    private query: string = '';

    public select(fields: string[]): this {
        this.query += `SELECT ${fields.join(', ')} FROM table_name `;
        return this;
    }

    public where(condition: string): this {
        this.query += `WHERE ${condition} `;
        return this;
    }

    public limit(limit: number): this {
        this.query += `LIMIT ${limit} `;
        return this;
    }

    public getSQL(): string {
        return this.query.trim() + ';';
    }
}

// example
const postgresBuilder = new PostgreSqlQueryBuilder();
const postgresQuery = postgresBuilder
    .select(['id', 'name'])
    .where('id = 1')
    .limit(10)
    .getSQL();

console.log(postgresQuery); // Output: SELECT id, name FROM table_name WHERE id = 1 LIMIT 10;

const mysqlBuilder = new MySqlQueryBuilder();
const mysqlQuery = mysqlBuilder
    .select(['id', 'name'])
    .where('name = "John"')
    .limit(5)
    .getSQL();

console.log(mysqlQuery); // Output: SELECT id, name FROM table_name WHERE name = "John" LIMIT 5;
