CREATE TABLE IF NOT EXISTS tipo_empleado (id SERIAL PRIMARY KEY, descripcion varchar(50) NOT NULL);

CREATE TABLE IF NOT EXISTS cargo (id SERIAL PRIMARY KEY, nombre varchar(50) NOT NULL, tipo_empleado INT NOT NULL, FOREIGN KEY (tipo_empleado) REFERENCES tipo_empleado(id));

CREATE TABLE IF NOT EXISTS dependencia (id SERIAL PRIMARY KEY, nombre varchar(100) NOT NULL);

CREATE TABLE IF NOT EXISTS funcionario (id SERIAL,
									 cedula INT PRIMARY KEY UNIQUE,
									 primer_nombre varchar(25) NOT NULL,
									 segundo_nombre varchar(25),
									 primer_apellido varchar(25) NOT NULL,
									 segundo_apellido varchar(25) NOT NULL, 
									 id_dependencia INT NOT NULL,
									 id_cargo INT NOT NULL,
									 fecha_ingreso DATE NOT NULL,
									 FOREIGN KEY (id_dependencia) REFERENCES dependencia(id),
									 FOREIGN KEY (id_cargo) REFERENCES cargo(id)
									);

CREATE TYPE estado_usuario AS ENUM('ACTIVO', 'INACTIVO');

CREATE TABLE IF NOT EXISTS usuario (id SERIAL PRIMARY KEY,
									funcionario INT UNIQUE NOT NULL,
									nombre_usuario varchar(10) UNIQUE NOT NULL,
									contraseña varchar(255) NOT NULL,
									estado estado_usuario NOT NULL,
									FOREIGN KEY (funcionario) REFERENCES funcionario(cedula));
								  
CREATE TYPE estado_vacaciones AS ENUM('SOLICITADA', 'APROBADA', 'DISFRUTADA', 'REPROGRAMADA');

CREATE TABLE IF NOT EXISTS vacaciones (id SERIAL PRIMARY KEY,
									   funcionario INT NOT NULL,
									  fecha_salida DATE NOT NULL,
									  fecha_reincorporacion DATE NOT NULL,
									  año INT NOT NULL,
									  dias_disfrutar INT NOT NULL,
									  estatus estado_vacaciones NOT NULL,
									  aprobado_por INT,
									  observaciones TEXT,
									  fecha_finalizacion DATE NOT NULL
									  FOREIGN KEY (funcionario) REFERENCES funcionario(cedula),
									  FOREIGN KEY (aprobado_por) REFERENCES usuario(id)
									  );
CREATE TABLE IF NOT EXISTS permisos (id SERIAL PRIMARY KEY,
									funcionario INT NOT NULL,
									fecha_permiso DATE NOT NULL,
									motivo varchar(25) NOT NULL,
									observaciones varchar(255),
									FOREIGN KEY (funcionario) REFERENCES funcionario(cedula));

CREATE TABLE IF NOT EXISTS feriados (id SERIAL PRIMARY KEY,
									 titulo VARCHAR(100) NOT NULL,
									 fecha DATE NOT NULL);