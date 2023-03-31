exports.up = (pgm) => {
    pgm.createTable("products", {
        id: {
            type: "VARCHAR(50)",
            primaryKey: true,
            notNull: true,
        },
        name_product: {
            type: "VARCHAR(50)",
            unique: true,
            index: true,
            notNull: true,
        },
        total_product: {
            type: "BIGINT",
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable("products");
};
