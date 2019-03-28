DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(45) NULL,
price DECIMAL(10, 2) NULL,
stock_quantity INT(10),
PRIMARY KEY (item_id)
);
)