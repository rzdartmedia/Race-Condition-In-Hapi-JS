exports.up = (pgm) => {
    pgm.sql(`INSERT INTO products(id, name_product, total_product) VALUES('product-001', 'laptop', 5)`);
};

exports.down = (pgm) => {
    pgm.sql(`DELETE FROM products WHERE name_product = 'laptop'`);
};
