-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-12-2020 a las 18:57:32
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medals`
--

CREATE TABLE `medals` (
  `nick` varchar(20) NOT NULL,
  `type` varchar(10) NOT NULL,
  `text` varchar(50) NOT NULL,
  `number` int(255) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `question`
--

CREATE TABLE `question` (
  `id` int(255) NOT NULL,
  `nick` varchar(20) NOT NULL,
  `title` text NOT NULL,
  `text` text NOT NULL,
  `nVisit` int(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reply`
--

CREATE TABLE `reply` (
  `ID` int(255) NOT NULL,
  `nick` varchar(20) NOT NULL,
  `idQuestion` int(255) NOT NULL,
  `text` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stats`
--

CREATE TABLE `stats` (
  `nick` varchar(20) NOT NULL,
  `reputation` bigint(255) NOT NULL DEFAULT 0,
  `nQuestions` bigint(255) NOT NULL DEFAULT 0,
  `nAnswers` bigint(255) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tags`
--

CREATE TABLE `tags` (
  `IDquestion` int(255) NOT NULL,
  `tag` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `nick` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(16) NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `tag` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `visita`
--

CREATE TABLE `visit` (
  `nick` varchar(20) NOT NULL,
  `IDQuestion` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votequestion`
--

CREATE TABLE `votequestion` (
  `nick` varchar(20) NOT NULL,
  `IDQuestion` int(255) NOT NULL,
  `value` int(1) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votereply`
--

CREATE TABLE `votereply` (
  `Nick` varchar(20) NOT NULL,
  `IDreply` int(255) NOT NULL,
  `value` int(1) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `medals`
--
ALTER TABLE `medals`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nick` (`nick`);

--
-- Indices de la tabla `reply`
--
ALTER TABLE `reply`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `nick` (`nick`,`idQuestion`),
  ADD UNIQUE KEY `idQuestion` (`idQuestion`);

--
-- Indices de la tabla `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`nick`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`IDquestion`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`nick`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `visita`
--
ALTER TABLE `visita`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votequestion`
--
ALTER TABLE `votequestion`
  ADD PRIMARY KEY (`nick`,`IDQuestion`);

--
-- Indices de la tabla `votereply`
--
ALTER TABLE `votereply`
  ADD PRIMARY KEY (`IDreply`,`Nick`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reply`
--
ALTER TABLE `reply`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
