-- CREATE TABLE "customers" (
--     "id" VARCHAR(10) NOT NULL,
--     "first_name" VARCHAR(50) NOT NULL,
--     "second_name" VARCHAR(50),
--     "first_last_name" VARCHAR(50) NOT NULL,
--     "second_last_name" VARCHAR(50),
--     "email" VARCHAR(255) NOT NULL,
--     "phone_number" VARCHAR(10),
--     "address" VARCHAR(200),
--     PRIMARY KEY ("id")
-- );

-- CREATE TABLE "tables" (
--     "id" SMALLINT NOT NULL,
--     "size" SMALLINT NOT NULL,
--     "availability" BOOLEAN NOT NULL,
--     PRIMARY KEY ("id")
-- );

-- CREATE TABLE "visits" (
--     "id" SERIAL NOT NULL,
--     "entry" TIMESTAMP WITHOUT TIME ZONE NOT NULL,
--     "exit" TIMESTAMP WITHOUT TIME ZONE,
--     "customer_id" VARCHAR(10),
--     "table_id" SMALLINT NOT NULL,
--     PRIMARY KEY ("id"),
--     FOREIGN KEY ("customer_id") REFERENCES "customers" ("id"),
--     FOREIGN KEY ("table_id") REFERENCES "tables" ("id")
-- );


-- CREATE TABLE "categories" (
--     "id" SMALLINT NOT NULL,
--     "name" VARCHAR(100) NOT NULL,
--     "description" VARCHAR(100),
--     PRIMARY KEY ("id")
-- );

-- CREATE TABLE  "products" (
--     "id" SMALLINT NOT NULL,
--     "name" VARCHAR(100) NOT NULL,   
--     "price" NUMERIC(4, 2) NOT NULL,
--     "category_id" SMALLINT NOT NULL,
--     "availability" BOOLEAN NOT NULL,
--     PRIMARY KEY ("id"),
--     FOREIGN KEY ("category_id") REFERENCES "categories" ("id")
-- );

-- CREATE TABLE "orders" (
--     "id" SERIAL NOT NULL,
--     "product_id" SMALLINT NOT NULL,
--     "product_state" VARCHAR(20) NOT NULL,
--     "visit_id" INT NOT NULL,
--     PRIMARY KEY ("id"),
--     FOREIGN KEY ("product_id") REFERENCES "products" ("id"),
--     FOREIGN KEY ("visit_id") REFERENCES "visits" ("id")
-- );

-- CREATE TABLE "employees" (
--     "id" VARCHAR(10) NOT NULL,
--     "first_name" VARCHAR(50) NOT NULL,
--     "second_name" VARCHAR(50),
--     "first_last_name" VARCHAR(50) NOT NULL,
--     "second_last_name" VARCHAR(50),
--     "email" VARCHAR(255) NOT NULL,
--     "phone_number" VARCHAR(10),
--     "address" VARCHAR(200),
--     "user" VARCHAR(50) NOT NULL,
--     "password" VARCHAR(50) NOT NULL,
--     "role" VARCHAR(50) NOT NULL,
--     PRIMARY KEY ("id")
-- );

-- CREATE TABLE "payment_methods" (
--     "id" SMALLINT NOT NULL,
--     "name" VARCHAR(50) NOT NULL,
--     "description" VARCHAR(200) NOT NULL,
--     PRIMARY KEY ("id")
-- );

-- CREATE TABLE "invoices" (
--     "id" SERIAL NOT NULL,
--     "total" NUMERIC(6, 2) NOT NULL,
--     "state" VARCHAR(20),
--     "employee_id" VARCHAR(10) NOT NULL,
--     "visit_id" INT NOT NULL,
--     "payment_method_id" SMALLINT NOT NULL,
--     PRIMARY KEY ("id"),
--     FOREIGN KEY ("employee_id") REFERENCES "employees" ("id"),
--     FOREIGN KEY ("visit_id") REFERENCES "visits" ("id"),
--     FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods" ("id")
-- );

-- CREATE TABLE "requests" (
--     "id" SERIAL NOT NULL,
--     "quantity" SMALLINT NOT NULL,
--     "product_id" SMALLINT NOT NULL,
--     "visit_id" INT NOT NULL,
--     PRIMARY KEY ("id"),
--     FOREIGN KEY ("product_id") REFERENCES "products" ("id"),
--     FOREIGN KEY ("visit_id") REFERENCES "visits" ("id")
-- );

-- CREATE TABLE "invoices_log" (
--     "total" NUMERIC(6, 2) NOT NULL,
--     "employee_id" VARCHAR(10) NOT NULL,
--     "invoice_id" INT NOT NULL,
--     "customer_id" VARCHAR(10) NOT NULL,
--     "date" TIMESTAMP WITHOUT TIME ZONE NOT NULL
-- );

-- CREATE TABLE "requests_log" (
--     "product_name" VARCHAR(100) NOT NULL,
--     "product_price" NUMERIC(4, 2) NOT NULL,
--     "quantity" SMALLINT NOT NULL,
--     "invoice_id" INT NOT NULL
-- );

INSERT INTO "customers" ("id", "first_name", "second_name", "first_last_name", "second_last_name", "email", "phone_number", "address") VALUES 
('0102030405', 'Juan', 'Pablo', 'Gomez', 'Vargas', 'juan.gomez@example.com', '0991234567', 'Av. Principal 123'),
('0607080910', 'Maria', 'Fernanda', 'Perez', 'Gutierrez', 'maria.perez@example.com', '0987654321', 'Calle Secundaria 45'),
('1112131415', 'Carlos', 'Andres', 'Rodriguez', 'Moreno', 'carlos.rodriguez@example.com', '0965432109', 'Vía Panamericana'),
('1617181920', 'Paola', 'Alejandra', 'Lopez', 'Velez', 'paola.lopez@example.com', '0956789012', 'Barrio Nuevo'),
('2122232425', 'Ricardo', 'Javier', 'Suarez', 'Castillo', 'ricardo.suarez@example.com', '0987123456', 'La Floresta 67'),
('2627282930', 'Ana', 'Gabriela', 'Garcia', 'Mendoza', 'ana.garcia@example.com', '0978901234', 'Av. de las Palmeras'),
('3132333435', 'Fernando', 'Miguel', 'Vera', 'Santos', 'fernando.vera@example.com', '0998765432', 'Calle de los Pinos'),
('3637383940', 'Diana', 'Carolina', 'Ramirez', 'Chavez', 'diana.ramirez@example.com', '0965432109', 'Av. de las Acacias'),
('4142434445', 'Eduardo', 'Alejandro', 'Cruz', 'Rojas', 'eduardo.cruz@example.com', '0987654321', 'Urbanización Los Olivos'),
('4647484950', 'Carla', 'Valeria', 'Alvarez', 'Ortiz', 'carla.alvarez@example.com', '0978901234', 'Callejon de los Sueños'),
('5152535455', 'Luis', 'Alberto', 'Guerrero', 'Villavicencio', 'luis.guerrero@example.com', '0998765432', 'Av. de las Rosas'),
('5657585950', 'Monica', 'Isabel', 'Torres', 'Narvaez', 'monica.torres@example.com', '0965432109', 'Calle del Rio'),
('6061636465', 'Andres', 'Felipe', 'Cordova', 'Arias', 'andres.cordova@example.com', '0987654321', 'Ruta del Sol'),
('6566676865', 'Carmen', 'Estefania', 'Paz', 'Benitez', 'carmen.paz@example.com', '0978901234', 'Av. de los Ceibos'),
('6970737475', 'Pablo', 'Emilio', 'Moreno', 'Delgado', 'pablo.moreno@example.com', '0998765432', 'Calle de las Orquideas'),
('7677787980', 'Laura', 'Elena', 'Guzman', 'Molina', 'laura.guzman@example.com', '0965432109', 'Av. de las Violetas'),
('8182838485', 'Gustavo', 'Antonio', 'Hidalgo', 'Silva', 'gustavo.hidalgo@example.com', '0987654321', 'Calle de las Estrellas'),
('8687888985', 'Isabel', 'Patricia', 'Aguilar', 'Aguirre', 'isabel.aguilar@example.com', '0978901234', 'Av. de los Girasoles'),
('9091929395', 'Roberto', 'Carlos', 'Nunez', 'Maldonado', 'roberto.nunez@example.com', '0998765432', 'Calle del Mar'),
('9495969790', 'Elena', 'Beatriz', 'Jimenez', 'Vera', 'elena.jimenez@example.com', '0965432109', 'Urbanización Los Pinos')
;

INSERT INTO "tables" ("id", "size", "availability") VALUES
(1, 2, FALSE), 
(2, 4, FALSE), 
(3, 6, FALSE), 
(4, 2, FALSE), 
(5, 4, FALSE), 
(6, 6, FALSE), 
(7, 2, FALSE), 
(8, 4, FALSE), 
(9, 6, FALSE), 
(10, 2, FALSE), 
(11, 4, TRUE), 
(12, 6, TRUE)
;

INSERT INTO "visits" ("entry", "exit", "table_id") VALUES
('01/01/2023 12:30:00', '01/01/2023 14:00:00', 1),
('02/01/2023 18:00:00', '02/01/2023 19:30:00', 2),
('03/01/2023 20:15:00', '03/01/2023 22:00:00', 3),
('04/01/2023 13:45:00', '04/01/2023 15:30:00', 4),
('05/01/2023 19:30:00', '05/01/2023 21:00:00', 5),
('06/01/2023 14:00:00', '06/01/2023 15:45:00', 6),
('07/01/2023 17:45:00', '07/01/2023 19:30:00', 7),
('08/01/2023 20:00:00', '08/01/2023 21:45:00', 8),
('09/01/2023 12:00:00', '09/01/2023 13:30:00', 9),
('10/01/2023 18:30:00', '10/01/2023 20:00:00', 10)
;

INSERT INTO "categories" ("id", "name") VALUES 
(1, 'Plato Principal'),
(2, 'Entrada'),
(3, 'Sopa'),
(4, 'Postre'),
(5, 'Bebida')
;

INSERT INTO "products" ("id", "name", "price", "category_id", "availability") VALUES
(1, 'Lomo Saltado', 18.99, 1, TRUE),
(2, 'Ceviche de Camarón', 15.50, 2, TRUE),
(3, 'Encebollado', 12.75, 3, TRUE),
(4, 'Pastel de Chocolate', 8.99, 4, TRUE),
(5, 'Camarones a la Diabla', 20.50, 1, TRUE),
(6, 'Helado de Vainilla', 5.99, 4, TRUE),
(7, 'Sopa de Tomate', 10.25, 3, TRUE),
(8, 'Pollo al Curry', 16.75, 1, TRUE),
(9, 'Tiramisú', 9.99, 4, TRUE),
(10, 'Margarita', 7.50, 5, TRUE),
(11, 'Pasta Alfredo', 14.25, 1, TRUE),
(12, 'Flan de Caramelo', 6.99, 4, TRUE),
(13, 'Sopa de Cebolla', 11.50, 3, TRUE),
(14, 'Sushi Variado', 22.99, 1, TRUE),
(15, 'Cheesecake de Fresa', 8.50, 4, TRUE),
(16, 'Hamburguesa Clásica', 13.75, 1, TRUE),
(17, 'Mousse de Chocolate', 7.99, 4, TRUE),
(18, 'Crema de Espárragos', 9.50, 3, TRUE),
(19, 'Pescado a la Parrilla', 19.50, 1, TRUE),
(20, 'Gelato de Limón', 6.50, 4, TRUE),
(21, 'Gazpacho', 10.75, 3, TRUE),
(22, 'Costillas BBQ', 18.25, 1, TRUE),
(23, 'Mousse de Frutas del Bosque', 8.75, 4, TRUE),
(24, 'Caldo de Pollo', 9.25, 3, TRUE),
(25, 'Pizza Margherita', 15.99, 1, TRUE),
(26, 'Crepas de Nutella', 7.25, 4, TRUE),
(27, 'Sopa de Lentejas', 11.99, 3, TRUE),
(28, 'Filete de Salmón', 20.75, 1, TRUE),
(29, 'Tarta de Manzana', 9.50, 4, TRUE),
(30, 'Crema de Champiñones', 8.99, 3, TRUE),
(31, 'Arroz con Pollo', 16.50, 1, TRUE),
(32, 'Chocolate Caliente', 4.99, 5, TRUE),
(33, 'Sopa de Fideos', 10.50, 3, TRUE),
(34, 'Tacos de Carne Asada', 14.75, 1, TRUE),
(35, 'Pudín de Pan', 6.25, 4, TRUE),
(36, 'Cóctel de Frutas', 6.99, 5, TRUE),
(37, 'Paella de Mariscos', 22.50, 1, TRUE),
(38, 'Tarta de Chocolate', 8.25, 4, TRUE),
(39, 'Sopa Minestrone', 11.25, 3, TRUE),
(40, 'Parrillada Mixta', 24.99, 1, TRUE),
(41, 'Mojito', 8.50, 5, TRUE),
(42, 'Helado de Chocolate', 5.99, 4, TRUE),
(43, 'Sopa de Guisantes', 10.75, 3, TRUE),
(44, 'Lasagna', 17.50, 1, TRUE),
(45, 'Café Americano', 3.99, 5, TRUE),
(46, 'Tarta de Queso', 7.75, 4, TRUE),
(47, 'Sopa de Calabaza', 9.25, 3, TRUE),
(48, 'Filete Mignon', 28.50, 1, TRUE),
(49, 'Piña Colada', 9.50, 5, TRUE),
(50, 'Mango Sticky Rice', 6.99, 4, TRUE)
;


INSERT INTO "unit_orders" ("product_id", "product_state", "visit_id") VALUES
(1, 'PREPARANDO', 1),
(4, 'ESPERA', 1),
(10, 'LISTO', 1),
(2, 'PREPARANDO', 1),
(8, 'LISTO', 1),
(5, 'ESPERA', 2),
(12, 'LISTO', 2),
(28, 'PREPARANDO', 2),
(7, 'LISTO', 2),
(15, 'PREPARANDO', 2),
(21, 'PREPARANDO', 3),
(9, 'LISTO', 3),
(11, 'ESPERA', 3),
(3, 'LISTO', 3),
(17, 'PREPARANDO', 3),  
(22, 'PREPARANDO', 4),
(29, 'LISTO', 4),
(36, 'LISTO', 4),
(13, 'ESPERA', 4),
(5, 'PREPARANDO', 4), 
(1, 'PREPARANDO', 5),
(28, 'LISTO', 5),
(33, 'ESPERA', 5),
(11, 'LISTO', 5),
(6, 'PREPARANDO', 5),
(17, 'LISTO', 6),
(22, 'PREPARANDO', 6),
(29, 'LISTO', 6),
(36, 'ESPERA', 6),
(13, 'PREPARANDO', 6),
(5, 'LISTO', 7),
(21, 'PREPARANDO', 7),
(30, 'ESPERA', 7),
(8, 'PREPARANDO', 7),
(3, 'LISTO', 7),
(26, 'LISTO', 8),
(10, 'PREPARANDO', 8),
(31, 'ESPERA', 8),
(22, 'LISTO', 8),
(37, 'PREPARANDO', 8),
(13, 'ESPERA', 9),
(44, 'LISTO', 9),
(23, 'LISTO', 9),
(48, 'PREPARANDO', 9),
(37, 'ESPERA', 9),
(2, 'ESPERA', 10),
(40, 'PREPARANDO', 10),
(48, 'LISTO', 10),
(5, 'ESPERA', 10),
(21, 'LISTO', 10)
;


INSERT INTO "employees" ("id", "first_name", "second_name", "first_last_name", "second_last_name", "email", "phone_number", "address", "user", "password", "role") VALUES
('0102030405', 'Juan', 'Pablo', 'Gomez', 'Vargas', 'juan.gomez@example.com', '0991234567', 'Av. Principal 123, Quito', 'juanito', 'clave123', 'ADMINISTRADOR'),
('0607080910', 'Maria', 'Fernanda', 'Perez', 'Gutierrez', 'maria.perez@example.com', '0987654321', 'Calle Secundaria 45, Guayaquil', 'maria', 'password123', 'CHEF'),
('1112131415', 'Carlos', 'Andres', 'Rodriguez', 'Moreno', 'carlos.rodriguez@example.com', '0965432109', 'Vía Panamericana, Cuenca', 'carlosr', 'clave456', 'MESERO'),
('1617181920', 'Paola', 'Alejandra', 'Lopez', 'Velez', 'paola.lopez@example.com', '0956789012', 'Barrio Nuevo, Ambato', 'paolal', 'pass123', 'CAJERO'),
('2122232425', 'Ricardo', 'Javier', 'Suarez', 'Castillo', 'ricardo.suarez@example.com', '0987123456', 'La Floresta 67, Loja', 'ricardos', 'clave789', 'ADMINISTRADOR'),
('2627282930', 'Ana', 'Gabriela', 'Garcia', 'Mendoza', 'ana.garcia@example.com', '0978901234', 'Av. de las Palmeras, Portoviejo', 'anag', 'pass456', 'CHEF'),
('3132333435', 'Fernando', 'Miguel', 'Vera', 'Santos', 'fernando.vera@example.com', '0998765432', 'Calle de los Pinos, Machala', 'fernandov', 'password789', 'MESERO'),
('3637383940', 'Diana', 'Carolina', 'Ramirez', 'Chavez', 'diana.ramirez@example.com', '0965432109', 'Av. de las Acacias, Santo Domingo', 'dianar', 'clave101', 'CAJERO'),
('4142434445', 'Eduardo', 'Alejandro', 'Cruz', 'Rojas', 'eduardo.cruz@example.com', '0987654321', 'Urbanización Los Olivos, Manta', 'eduardoc', 'pass101', 'ADMINISTRADOR'),
('4647484950', 'Carla', 'Valeria', 'Alvarez', 'Ortiz', 'carla.alvarez@example.com', '0978901234', 'Callejon de los Sueños, Esmeraldas', 'carlav', 'clave112', 'CHEF')
;


INSERT INTO "invoices" ("total", "state", "employee_id", "visit_id", "payment_method", "customer_id") VALUES
(75.50, 'CANCELADO', '1617181920', 1, 'EFECTIVO', '0102030405'),
(120.75, 'PENDIENTE', '1617181920', 2, 'DEBITO', '0607080910'),
(95.25, 'CANCELADO', '1617181920', 3, 'EFECTIVO', '1112131415'),
(150.00, 'PENDIENTE', '1617181920', 4, 'TRANSFERENCIA', '1617181920'),
(80.50, 'CANCELADO', '3637383940', 5, 'EFECTIVO', '2122232425'),
(110.25, 'PENDIENTE', '3637383940', 6, 'DEBITO', '2627282930'),
(130.75, 'CANCELADO', '3637383940', 7, 'EFECTIVO', '3132333435'),
(98.99, 'CANCELADO', '3637383940', 8, 'TRANSFERENCIA', '3637383940'),
(75.00, 'CANCELADO', '1617181920', 9, 'EFECTIVO', '4142434445'),
(112.50, 'PENDIENTE', '1617181920', 10, 'EFECTIVO', '4647484950')
;

INSERT INTO "orders" ("quantity", "product_id", "visit_id") VALUES
(1, 1, 1),
(1, 4, 1),
(1, 10, 1),
(1, 2, 1),
(1, 8, 1),
(1, 5, 2),
(1, 12, 2),
(1, 28, 2),
(1, 7, 2),
(1, 15, 2),
(1, 21, 3),
(1, 9, 3),
(1, 11, 3),
(1, 3, 3),
(1, 17, 3),
(1, 22, 4),
(1, 29, 4),
(1, 36, 4),
(1, 13, 4),
(1, 5, 4),
(1, 1, 5),
(1, 28, 5),
(1, 33, 5),
(1, 11, 5),
(1, 6, 5),
(1, 17, 6),
(1, 22, 6),
(1, 29, 6),
(1, 36, 6),
(1, 13, 6),
(1, 5, 7),
(1, 21, 7),
(1, 30, 7),
(1, 8, 7),
(1, 3, 7),
(1, 26, 8),
(1, 10, 8),
(1, 31, 8),
(1, 22, 8),
(1, 37, 8),
(1, 13, 9),
(1, 44, 9),
(1, 23, 9),
(1, 48, 9),
(1, 37, 9),
(1, 2, 10),
(1, 40, 10),
(1, 48, 10),
(1, 5, 10),
(1, 21, 10)
;