require("dotenv").config();

const Hapi = require("@hapi/hapi");
const { Pool } = require("pg");
const Lock = require('async-lock');

const init = async () => {
    const pg = new Pool();
    const lock = new Lock;

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ["*"],
            },
        },
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            console.log('waiting')
            const result = await lock.acquire('data', async () => {
                // Memastikan hanya satu thread yang dapat mengakses variabel data pada satu waktu
                const data = await getDataProduct();
                if (!data) return 'error'


                let totalProduct = parseInt(data.total_product);
                totalProduct++;


                await updateTotalProductById(data.id, totalProduct);

                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve('Sedang process')
                    }, 10000);
                })

                const result = await getDataProduct();

                await deleteProductById(data.id)
                return result;
            });

            console.log('done')
            return {
                status: 'success',
                result
            }
        }
    });

    async function getDataProduct() {
        const query = {
            text: 'SELECT * FROM products'
        };

        const result = await pg.query(query);
        return result.rows[0]
    }

    async function updateTotalProductById(id, product) {
        const query = {
            text: 'UPDATE products SET total_product = $2 WHERE id = $1',
            values: [id, product]
        };

        await pg.query(query);
    }

    async function deleteProductById(id) {
        const query = {
            text: 'DELETE FROM products WHERE id = $1',
            values: [id]
        };

        await pg.query(query);
    }

    await pg.query('DELETE FROM products')
    await pg.query(`INSERT INTO products(id, name_product, total_product) VALUES('product-001', 'laptop', 5)`)

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();
