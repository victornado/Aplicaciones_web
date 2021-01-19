-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-01-2021 a las 16:44:07
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `practica 1`
--
CREATE DATABASE IF NOT EXISTS `practica 1` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `practica 1`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medals`
--

DROP TABLE IF EXISTS `medals`;
CREATE TABLE IF NOT EXISTS `medals` (
  `nick` varchar(20) NOT NULL,
  `type` varchar(10) NOT NULL,
  `text` varchar(50) NOT NULL,
  `number` int(255) NOT NULL DEFAULT 0,
  PRIMARY KEY (`nick`,`type`,`text`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `question`
--

DROP TABLE IF EXISTS `question`;
CREATE TABLE IF NOT EXISTS `question` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `nick` varchar(20) NOT NULL,
  `title` text NOT NULL,
  `text` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `question`
--

INSERT INTO `question` (`id`, `nick`, `title`, `text`, `date`) VALUES
(1, 'Nico', '¿Cual es la diferencia entre position: relative, position: absolute y position: fixed?', 'Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página. Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página.', '2021-01-14 15:35:05'),
(2, 'Lucas', '¿Qué es la inyección SQL y cómo puedo evitarla?', 'He encontrado bastantes preguntas en StackOverflow sobre programas o formularios web que guardan información en una base de datos (especialmente en PHP y MySQL) y que contienen graves problemas de seguridad relacionados principalmente con la inyección SQL.\r\n\r\nNormalmente dejo un comentario y/o un enlace a una referencia externa, pero un comentario no da mucho espacio para mucho y sería positivo que hubiera una referencia interna en SOes sobre el tema así que decidí escribir esta pregunta.\r\n@mysql', '2021-01-14 15:36:40'),
(3, 'Roberto', '¿Cómo funciona exactamente nth-child?', 'No acabo de comprender muy bien que hace exactamente y qué usos prácticos puede tener.', '2021-01-14 15:38:20'),
(4, 'SFG', 'Diferencias entre == y === (comparaciones en JavaScript)', 'Siempre he visto que en JavaScript hay:\r\nasignaciones =\r\ncomparaciones == y ===\r\nCreo entender que == hace algo parecido a comparar el valor de la variable y el === también compara el tipo (como un equals de java).', '2021-01-14 15:39:57'),
(5, 'Marta', 'Problema con asincronismo en Node', 'Soy nueva en Node... Tengo una modulo que conecta a una BD de postgres por medio de pg-node. En eso no tengo problemas. Mi problema es que al llamar a ese modulo, desde otro modulo, y despues querer usar los datos que salieron de la BD me dice undefined... Estoy casi seguro que es porque la conexion a la BD devuelve una promesa, y los datos no estan disponibles al momento de usarlos.', '2021-01-14 15:41:53');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reply`
--

DROP TABLE IF EXISTS `reply`;
CREATE TABLE IF NOT EXISTS `reply` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `nick` varchar(20) NOT NULL,
  `idQuestion` int(255) NOT NULL,
  `text` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `reply`
--

INSERT INTO `reply` (`ID`, `nick`, `idQuestion`, `text`, `date`) VALUES
(1, 'Lucas', 1, 'La propiedad position sirve para posicionar un elemento dentro de la página. Sin embargo, dependiendo de cual sea la propiedad que usemos, el elemento tomará una referencia u otra para posicionarse respecto a ella.\r\n\r\nLos posibles valores que puede adoptar la propiedad position son: static | relative | absolute | fixed | inherit | initial.\r\n', '2021-01-14 15:35:56'),
(2, 'Emy', 3, 'La pseudoclase :nth-child() selecciona los hermanos que cumplan cierta condición definida en la fórmula an + b. a y b deben ser números enteros, n es un contador. El grupo an representa un ciclo, cada cuantos elementos se repite; b indica desde donde empezamos a contar.', '2021-01-14 15:39:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stats`
--

DROP TABLE IF EXISTS `stats`;
CREATE TABLE IF NOT EXISTS `stats` (
  `nick` varchar(20) NOT NULL,
  `reputation` bigint(255) NOT NULL DEFAULT 0,
  `nQuestions` bigint(255) NOT NULL DEFAULT 0,
  `nAnswers` bigint(255) NOT NULL DEFAULT 0,
  PRIMARY KEY (`nick`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `stats`
--

INSERT INTO `stats` (`nick`, `reputation`, `nQuestions`, `nAnswers`) VALUES
('Emy', 1, 0, 1),
('Lucas', 1, 1, 1),
('Marta', 1, 1, 0),
('Nico', 1, 1, 0),
('Roberto', 1, 1, 0),
('SFG', 1, 1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tags`
--

DROP TABLE IF EXISTS `tags`;
CREATE TABLE IF NOT EXISTS `tags` (
  `IDquestion` int(255) NOT NULL,
  `tag` varchar(20) NOT NULL,
  PRIMARY KEY (`tag`,`IDquestion`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tags`
--

INSERT INTO `tags` (`IDquestion`, `tag`) VALUES
(1, 'css'),
(3, 'css'),
(1, 'css3'),
(3, 'html'),
(4, 'javaScript\r\n'),
(2, 'mysql'),
(5, 'nodejs'),
(2, 'sql');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `nick` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(16) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `tag` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`nick`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`nick`, `email`, `password`, `icon`, `date`, `tag`) VALUES
('Emy', 'emy@404.es', '123456', '68253e01bc418430ab7e63edf408d33e', '2021-01-14 15:34:11', NULL),
('Lucas', 'lucas@404.es', '123456', 'ddfba0187c815398fa94cce141243beb', '2021-01-14 15:33:29', NULL),
('Marta', 'marta@404.es', '123456', 'd9fd397daf5f064298843dc35a957d15', '2021-01-14 15:33:08', NULL),
('Nico', 'nico@404.es', '123456', 'ee6f0cc314d66a581279e8fe15f5931c', '2021-01-14 15:31:32', NULL),
('Roberto', 'roberto@404.es', '123456', 'a171f85415f6478b97e0e92ace08d6f2', '2021-01-14 15:32:02', NULL),
('SFG', 'sfg@404.es', '123456', 'b5ae4311211c0033b3c0ba26fb119c92', '2021-01-14 15:32:44', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visit`
--

DROP TABLE IF EXISTS `visit`;
CREATE TABLE IF NOT EXISTS `visit` (
  `nick` varchar(20) NOT NULL,
  `IDQuestion` int(255) NOT NULL,
  PRIMARY KEY (`nick`,`IDQuestion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votequestion`
--

DROP TABLE IF EXISTS `votequestion`;
CREATE TABLE IF NOT EXISTS `votequestion` (
  `nick` varchar(20) NOT NULL,
  `IDQuestion` int(255) NOT NULL,
  `value` int(1) NOT NULL,
  PRIMARY KEY (`nick`,`IDQuestion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votereply`
--

DROP TABLE IF EXISTS `votereply`;
CREATE TABLE IF NOT EXISTS `votereply` (
  `Nick` varchar(20) NOT NULL,
  `IDreply` int(255) NOT NULL,
  `value` int(1) NOT NULL,
  PRIMARY KEY (`IDreply`,`Nick`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
