-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 10 Jun 2025 pada 08.40
-- Versi server: 10.4.21-MariaDB
-- Versi PHP: 7.3.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stampingdb`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `final_status`
--

CREATE TABLE `final_status` (
  `id_final_status` bigint(20) UNSIGNED NOT NULL,
  `id_status` int(10) UNSIGNED NOT NULL,
  `id_machine` varchar(255) NOT NULL,
  `id_problem` int(10) UNSIGNED NOT NULL,
  `power` int(10) NOT NULL,
  `duration` int(11) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `kanagata`
--

CREATE TABLE `kanagata` (
  `id_kanagata` varchar(255) NOT NULL,
  `actual_shot` bigint(20) NOT NULL,
  `limit_shot` bigint(20) NOT NULL,
  `cavity` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `log_maintenance_part`
--

CREATE TABLE `log_maintenance_part` (
  `id_log_maintenance_part` varchar(255) NOT NULL,
  `id_machine` varchar(255) NOT NULL,
  `part` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `log_status`
--

CREATE TABLE `log_status` (
  `id_log_status` bigint(20) UNSIGNED NOT NULL,
  `id_problem` int(10) UNSIGNED NOT NULL,
  `id_status` int(10) UNSIGNED NOT NULL,
  `id_machine` varchar(255) NOT NULL,
  `power` int(10) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `machine`
--

CREATE TABLE `machine` (
  `id_machine` varchar(255) NOT NULL,
  `shift` varchar(10) NOT NULL DEFAULT 'short',
  `actual_shot` bigint(20) NOT NULL,
  `limit_shot` bigint(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `address` varchar(255) NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `outgoing`
--

CREATE TABLE `outgoing` (
  `id` varchar(1) NOT NULL,
  `nama` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `pca`
--

CREATE TABLE `pca` (
  `id_pca` int(10) UNSIGNED NOT NULL,
  `id_machine` varchar(255) NOT NULL,
  `id_product` varchar(255) NOT NULL,
  `id_kanagata` varchar(255) NOT NULL,
  `speed` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `plan`
--

CREATE TABLE `plan` (
  `id_plan` int(11) NOT NULL,
  `id_pca` int(10) UNSIGNED NOT NULL,
  `qty` bigint(20) NOT NULL,
  `shift` int(11) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `time_plan` float NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `problem`
--

CREATE TABLE `problem` (
  `id_problem` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_stop` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `product`
--

CREATE TABLE `product` (
  `id_product` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` float NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `production`
--

CREATE TABLE `production` (
  `id_production` bigint(20) UNSIGNED NOT NULL,
  `date` datetime NOT NULL,
  `shift` int(11) NOT NULL,
  `id_pca` int(10) UNSIGNED NOT NULL,
  `id_plan` int(11) DEFAULT NULL,
  `ok` bigint(20) NOT NULL,
  `ng` bigint(20) NOT NULL,
  `reject_setting` bigint(20) NOT NULL,
  `dummy` bigint(20) NOT NULL,
  `production_time` bigint(20) NOT NULL,
  `stop_time` bigint(20) NOT NULL,
  `dandori_time` bigint(20) NOT NULL,
  `kanagata_shot` bigint(20) NOT NULL,
  `machine_shot` bigint(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `status`
--

CREATE TABLE `status` (
  `id_status` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id_user` int(10) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `roles` varchar(255) NOT NULL DEFAULT 'viewer',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `final_status`
--
ALTER TABLE `final_status`
  ADD PRIMARY KEY (`id_final_status`),
  ADD KEY `final_status_id_status_foreign` (`id_status`),
  ADD KEY `final_status_id_machine_foreign` (`id_machine`),
  ADD KEY `final_status_id_problem_foreign` (`id_problem`);

--
-- Indeks untuk tabel `kanagata`
--
ALTER TABLE `kanagata`
  ADD PRIMARY KEY (`id_kanagata`);

--
-- Indeks untuk tabel `log_maintenance_part`
--
ALTER TABLE `log_maintenance_part`
  ADD PRIMARY KEY (`id_log_maintenance_part`),
  ADD KEY `log_maintenance_part_id_machine_foreign` (`id_machine`);

--
-- Indeks untuk tabel `log_status`
--
ALTER TABLE `log_status`
  ADD PRIMARY KEY (`id_log_status`),
  ADD KEY `log_status_id_problem_foreign` (`id_problem`),
  ADD KEY `log_status_id_machine_foreign` (`id_machine`),
  ADD KEY `log_status_id_status_foreign` (`id_status`);

--
-- Indeks untuk tabel `machine`
--
ALTER TABLE `machine`
  ADD PRIMARY KEY (`id_machine`);

--
-- Indeks untuk tabel `outgoing`
--
ALTER TABLE `outgoing`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `pca`
--
ALTER TABLE `pca`
  ADD PRIMARY KEY (`id_pca`),
  ADD KEY `pca_id_kanagata_foreign` (`id_kanagata`),
  ADD KEY `pca_id_product_foreign` (`id_product`),
  ADD KEY `pca_id_machine_foreign` (`id_machine`);

--
-- Indeks untuk tabel `plan`
--
ALTER TABLE `plan`
  ADD PRIMARY KEY (`id_plan`),
  ADD KEY `plan_id_pca_foreign` (`id_pca`);

--
-- Indeks untuk tabel `problem`
--
ALTER TABLE `problem`
  ADD PRIMARY KEY (`id_problem`);

--
-- Indeks untuk tabel `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id_product`);

--
-- Indeks untuk tabel `production`
--
ALTER TABLE `production`
  ADD PRIMARY KEY (`id_production`),
  ADD KEY `production_id_pca_foreign` (`id_pca`),
  ADD KEY `production_id_plan_foreign` (`id_plan`);

--
-- Indeks untuk tabel `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id_status`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `final_status`
--
ALTER TABLE `final_status`
  MODIFY `id_final_status` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `log_status`
--
ALTER TABLE `log_status`
  MODIFY `id_log_status` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pca`
--
ALTER TABLE `pca`
  MODIFY `id_pca` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `plan`
--
ALTER TABLE `plan`
  MODIFY `id_plan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `problem`
--
ALTER TABLE `problem`
  MODIFY `id_problem` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `production`
--
ALTER TABLE `production`
  MODIFY `id_production` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `status`
--
ALTER TABLE `status`
  MODIFY `id_status` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `final_status`
--
ALTER TABLE `final_status`
  ADD CONSTRAINT `final_status_id_machine_foreign` FOREIGN KEY (`id_machine`) REFERENCES `machine` (`id_machine`),
  ADD CONSTRAINT `final_status_id_problem_foreign` FOREIGN KEY (`id_problem`) REFERENCES `problem` (`id_problem`),
  ADD CONSTRAINT `final_status_id_status_foreign` FOREIGN KEY (`id_status`) REFERENCES `status` (`id_status`);

--
-- Ketidakleluasaan untuk tabel `log_maintenance_part`
--
ALTER TABLE `log_maintenance_part`
  ADD CONSTRAINT `log_maintenance_part_id_machine_foreign` FOREIGN KEY (`id_machine`) REFERENCES `machine` (`id_machine`);

--
-- Ketidakleluasaan untuk tabel `log_status`
--
ALTER TABLE `log_status`
  ADD CONSTRAINT `log_status_id_machine_foreign` FOREIGN KEY (`id_machine`) REFERENCES `machine` (`id_machine`),
  ADD CONSTRAINT `log_status_id_problem_foreign` FOREIGN KEY (`id_problem`) REFERENCES `problem` (`id_problem`),
  ADD CONSTRAINT `log_status_id_status_foreign` FOREIGN KEY (`id_status`) REFERENCES `status` (`id_status`);

--
-- Ketidakleluasaan untuk tabel `pca`
--
ALTER TABLE `pca`
  ADD CONSTRAINT `pca_id_kanagata_foreign` FOREIGN KEY (`id_kanagata`) REFERENCES `kanagata` (`id_kanagata`),
  ADD CONSTRAINT `pca_id_machine_foreign` FOREIGN KEY (`id_machine`) REFERENCES `machine` (`id_machine`),
  ADD CONSTRAINT `pca_id_product_foreign` FOREIGN KEY (`id_product`) REFERENCES `product` (`id_product`);

--
-- Ketidakleluasaan untuk tabel `plan`
--
ALTER TABLE `plan`
  ADD CONSTRAINT `plan_id_pca_foreign` FOREIGN KEY (`id_pca`) REFERENCES `pca` (`id_pca`);

--
-- Ketidakleluasaan untuk tabel `production`
--
ALTER TABLE `production`
  ADD CONSTRAINT `production_id_pca_foreign` FOREIGN KEY (`id_pca`) REFERENCES `pca` (`id_pca`) ON UPDATE CASCADE,
  ADD CONSTRAINT `production_id_plan_foreign` FOREIGN KEY (`id_plan`) REFERENCES `plan` (`id_plan`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
