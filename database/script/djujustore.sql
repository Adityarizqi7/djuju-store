-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 11, 2023 at 02:46 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `djujustore`
--

-- --------------------------------------------------------

--
-- Table structure for table `assets`
--

CREATE TABLE `assets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `purchase_amount` int(11) NOT NULL,
  `cost_total` int(11) NOT NULL,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `initial_price` int(11) DEFAULT NULL,
  `asset_time` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(4, '2023_03_12_041328_create_products_table', 1),
(5, '2023_03_15_003701_create_notes_table', 1),
(6, '2023_03_28_130519_create_assets_table', 1),
(7, '2023_03_30_123520_create_omzets_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `purchase_amount` int(11) NOT NULL,
  `code_record` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_session` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_saved` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_finished` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cost_total` int(11) DEFAULT 0,
  `cost_subtotal` int(11) DEFAULT 0,
  `transaction_order` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `created_transaction_at` date DEFAULT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `omzets`
--

CREATE TABLE `omzets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `omzet_amount` int(11) DEFAULT NULL,
  `omzet_time` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sell_price` int(11) NOT NULL,
  `initial_price` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `unit` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `product_code`, `sell_price`, `initial_price`, `stock`, `unit`, `created_at`, `updated_at`) VALUES
(1, 'Beras Kemasan Anak Gunung 3 KG', '23TVH31', 40000, 35000, 32, 'pcs', '2023-04-11 06:24:00', '2023-04-11 06:24:45'),
(2, 'Beras Kemasan Anak Gunung 5 KG', '23BDE31', 60000, 55000, 10, 'pcs', '2023-04-11 06:25:43', '2023-04-11 06:25:43'),
(3, 'Beras Kemasan Lima Lima 3 KG', '23EFC31', 42000, 37000, 10, 'pcs', '2023-04-11 06:26:32', '2023-04-11 06:26:32'),
(4, 'Beras Kemasan Lima Lima 5 KG', '23K1431', 62000, 57000, 10, 'pcs', '2023-04-11 06:27:09', '2023-04-11 06:27:09'),
(5, 'Tabung Elpiiji Ijo', '23OHM31', 17500, 15500, 15, 'pcs', '2023-04-11 06:28:28', '2023-04-11 06:28:28'),
(6, 'Minyak Goreng \'Minyak Kita\'', '23LYI31', 15000, 13500, 48, 'pcs', '2023-04-11 06:32:00', '2023-04-11 06:32:00'),
(7, 'Gula Curah', '23FTA31', 13000, 11800, 50, 'kg', '2023-04-11 06:33:14', '2023-04-11 06:33:14'),
(8, 'Indomie Goreng', '23BTH31', 3500, 2700, 80, 'pcs', '2023-04-11 06:34:28', '2023-04-11 06:35:44'),
(9, 'Tepung Terigu Segitiga', '23ECD31', 10000, 7800, 50, 'kg', '2023-04-11 06:35:15', '2023-04-11 06:35:15'),
(10, 'Indomie Soto', '23LLP31', 3500, 2700, 40, 'pcs', '2023-04-11 06:36:13', '2023-04-11 06:36:13'),
(11, 'Telur', '23HNB31', 24500, 23500, 10, 'kg', '2023-04-11 06:37:04', '2023-04-11 06:37:04'),
(12, 'Bihun Kering \'Padamu\'', '23NDX31', 7500, 6000, 36, 'pcs', '2023-04-11 06:38:32', '2023-04-11 06:38:32'),
(13, 'CLUB Gelas', '230YO31', 22000, 19500, 10, 'kotak', '2023-04-11 06:40:17', '2023-04-11 06:40:17'),
(14, 'CLUB Botol 600 ml', '23UXW31', 2500, 1400, 72, 'pcs', '2023-04-11 06:41:58', '2023-04-11 06:41:58'),
(15, 'Club Besar Botol 1 Liter', '23T0U31', 4000, 2500, 48, 'pcs', '2023-04-11 06:43:19', '2023-04-11 06:43:19'),
(16, 'Mentega Blueband 1/4 KG', '23AYC31', 6000, 4500, 10, 'pcs', '2023-04-11 06:45:04', '2023-04-11 06:45:26'),
(17, 'Masako Sapi', '23AOV31', 1000, 800, 100, 'pcs', '2023-04-11 06:46:20', '2023-04-11 06:46:20'),
(18, 'Minuman Larutan Cap Kaki Tiga', '23YRQ31', 7500, 5500, 20, 'pcs', '2023-04-11 06:47:40', '2023-04-11 06:47:40'),
(19, 'Kapur Semut', '232GO31', 3500, 2500, 20, 'pcs', '2023-04-11 06:48:23', '2023-04-11 06:48:23'),
(20, 'Rexona Perempuan', '23SG031', 3500, 2500, 24, 'pcs', '2023-04-11 06:48:51', '2023-04-11 06:49:14'),
(21, 'Rexona Lelaki', '232IH31', 3500, 2500, 20, 'pcs', '2023-04-11 06:49:41', '2023-04-11 06:49:41'),
(22, 'Odol Pepsodent 220 Gram', '23DJ931', 15000, 11500, 15, 'pcs', '2023-04-11 06:50:27', '2023-04-11 06:50:27'),
(23, 'Odol Pepsodent 170 Gram', '23I8M31', 8000, 6000, 15, 'pcs', '2023-04-11 06:50:49', '2023-04-11 06:50:49'),
(24, 'Sikat Gigi Formula', '23U0I31', 3000, 2000, 10, 'pcs', '2023-04-11 06:51:17', '2023-04-11 06:51:17'),
(25, 'Sabun Mandi Batangan Lifeboy', '23MI631', 3500, 2500, 10, 'pcs', '2023-04-11 06:51:52', '2023-04-11 06:52:37'),
(26, 'Sabun Mandi Batangan Nuvo', '23B5031', 3000, 2000, 10, 'pcs', '2023-04-11 06:52:13', '2023-04-11 06:52:13'),
(27, 'Soklin Renteng', '2367M31', 1000, 800, 48, 'pcs', '2023-04-11 06:53:30', '2023-04-11 06:53:30'),
(28, 'Soklin Kemasan', '23M1K31', 5000, 4500, 20, 'pcs', '2023-04-11 06:53:53', '2023-04-11 06:53:53'),
(29, 'Merica Bubuk Ladaku', '236D531', 1000, 800, 48, 'pcs', '2023-04-11 06:54:28', '2023-04-11 06:54:28'),
(30, 'Ketumbar Bubuk', '23JQ731', 1000, 800, 48, 'pcs', '2023-04-11 06:55:01', '2023-04-11 06:55:01'),
(31, 'Kunir Bubuk', '2396R31', 1000, 800, 48, 'pcs', '2023-04-11 06:55:14', '2023-04-11 06:55:14'),
(32, 'Bumbu Racik Renteng', '23ZAL31', 2000, 1800, 48, 'pcs', '2023-04-11 06:55:37', '2023-04-11 06:55:37'),
(33, 'Pembalut Wanita Loire', '2313L31', 10000, 8000, 10, 'pcs', '2023-04-11 06:56:49', '2023-04-11 06:56:49'),
(34, 'Pempes Bayi Renteng', '234VK31', 5000, 4000, 24, 'pcs', '2023-04-11 06:57:22', '2023-04-11 06:57:22'),
(35, 'Floridina', '23FGW31', 3500, 2500, 48, 'pcs', '2023-04-11 06:58:12', '2023-04-11 06:58:12'),
(36, 'Teh Pucuk', '23RZ431', 3500, 2500, 48, 'pcs', '2023-04-11 06:58:26', '2023-04-11 06:58:26'),
(37, 'Kopi \'Ya\' Renteng', '23NS431', 1500, 1000, 100, 'pcs', '2023-04-11 06:58:54', '2023-04-11 06:58:54'),
(38, 'Susu Dancow Renteng', '23COO31', 4000, 2500, 36, 'pcs', '2023-04-11 06:59:34', '2023-04-11 06:59:34'),
(39, 'Milo Renteng', '2359S31', 2500, 2000, 48, 'pcs', '2023-04-11 07:00:53', '2023-04-11 07:00:53'),
(40, 'Kecap Sedap Renteng', '23I5031', 2000, 1800, 50, 'pcs', '2023-04-11 07:01:57', '2023-04-11 07:01:57'),
(41, 'Sabun Cuci \'Mama Lemon\' Renteng', '236IK31', 2000, 1800, 40, 'pcs', '2023-04-11 07:02:36', '2023-04-11 07:02:36'),
(42, 'Sabun Cuci Piring \'Handmade\'', '23XP031', 4000, 2500, 20, 'pcs', '2023-04-11 07:03:03', '2023-04-11 07:03:03'),
(43, 'Kacang Mentah 1/4 Kg', '23N8V31', 8000, 7000, 20, 'pcs', '2023-04-11 07:04:20', '2023-04-11 07:04:20'),
(44, 'Garam cap kapal api saset', '23PFZ31', 2500, 2000, 40, 'pcs', '2023-04-11 07:06:13', '2023-04-11 07:06:13'),
(45, 'Garam cap kapal api besar', '23LOW31', 4500, 4000, 40, 'pcs', '2023-04-11 07:06:53', '2023-04-11 07:06:53'),
(46, 'Larutan Adem Sari saset', '23FMA31', 2500, 2000, 36, 'pcs', '2023-04-11 07:07:38', '2023-04-11 07:07:38'),
(47, 'Madu rasa saset', '23EYX31', 1500, 1000, 40, 'pcs', '2023-04-11 07:08:14', '2023-04-11 07:08:14'),
(48, 'Nutrisari Renteng', '23EXW31', 2000, 1500, 60, 'pcs', '2023-04-11 07:08:57', '2023-04-11 07:08:57'),
(49, 'Popice', '232WH31', 2000, 1500, 60, 'pcs', '2023-04-11 07:09:21', '2023-04-11 07:09:21'),
(50, 'Saos Indofood', '23N0X31', 6000, 4000, 12, 'pcs', '2023-04-11 07:09:51', '2023-04-11 07:09:51'),
(51, 'Sambal Indofood', '23YKB31', 6000, 4000, 12, 'pcs', '2023-04-11 07:10:04', '2023-04-11 07:10:04'),
(52, 'Minyak Wijen', '23M8E31', 7000, 5500, 12, 'pcs', '2023-04-11 07:10:32', '2023-04-11 07:10:32'),
(53, 'Tepung Kanji', '239HC31', 4000, 2500, 15, 'pcs', '2023-04-11 07:10:53', '2023-04-11 07:10:53'),
(54, 'Tensoplast', '23QC931', 1000, 500, 200, 'pcs', '2023-04-11 07:11:50', '2023-04-11 07:11:50'),
(55, 'Baterai ABC ukuran A4', '23J7K31', 4000, 3000, 15, 'pcs', '2023-04-11 07:12:27', '2023-04-11 07:12:27'),
(56, 'Beras Rojolele 3 KG', '233EF31', 45000, 39000, 24, 'pcs', '2023-04-11 07:13:44', '2023-04-11 07:13:44'),
(57, 'Kertas Minyak', '23FR631', 1000, 500, 100, 'pcs', '2023-04-11 07:14:36', '2023-04-11 07:14:36'),
(58, 'Minyak Tawon', '23O8V31', 25000, 20000, 5, 'pcs', '2023-04-11 07:14:55', '2023-04-11 07:14:55'),
(59, 'Minyak Kayu Putih', '232NR31', 10000, 8000, 5, 'pcs', '2023-04-11 07:15:12', '2023-04-11 07:15:12'),
(60, 'Santan Kara', '238ZR31', 4000, 3000, 30, 'pcs', '2023-04-11 07:16:01', '2023-04-11 07:16:01'),
(61, 'Vanish Renteng', '23YTB31', 4500, 3500, 20, 'pcs', '2023-04-11 07:17:14', '2023-04-11 07:17:14'),
(62, 'Proklin Renteng', '235WZ31', 1000, 500, 20, 'pcs', '2023-04-11 07:17:30', '2023-04-11 07:17:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `address`, `phone`, `role`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin Toko Djuju', 'djujustore@gmail.com', 'Jln. Pogot Baru', '083244532765', 'owner', '$2y$10$esoqoVQnM0Kt6xu00iyw.Owv509QLVxdc/sZ/7wzoKJTX4pKYSbbW', NULL, '2023-04-11 06:20:26', '2023-04-11 06:20:26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assets`
--
ALTER TABLE `assets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assets_product_id_foreign` (`product_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notes_product_id_foreign` (`product_id`);

--
-- Indexes for table `omzets`
--
ALTER TABLE `omzets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `omzets_omzet_time_unique` (`omzet_time`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_name_unique` (`name`),
  ADD UNIQUE KEY `products_product_code_unique` (`product_code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_phone_unique` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assets`
--
ALTER TABLE `assets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `omzets`
--
ALTER TABLE `omzets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assets`
--
ALTER TABLE `assets`
  ADD CONSTRAINT `assets_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
