-- ==========================================================
-- SCRIPT SQL DE CRÉATION DE LA BASE DE DONNÉES - McCANN BRIDGE
-- Pour déploiement sur Serveur Apache / MySQL (WAMP)
-- ==========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS `mccann_bridge` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mccann_bridge`;

-- ==========================================
-- 1. UTILISATEURS & ÉQUIPES
-- ==========================================

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('Directeur Conseil','Chef de Projet Digital','Community Manager','Directeur Artistique','Traffic Manager','Client') NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `status` enum('active','offline','vacation') DEFAULT 'active',
  `is_client` boolean DEFAULT FALSE,
  `client_company` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 2. PROJETS
-- ==========================================

CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `status` enum('En cours','En attente','Terminé','Annulé') NOT NULL DEFAULT 'En cours',
  `progress` int(11) DEFAULT 0,
  `start_date` date DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `description` text,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`client_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `project_members` (
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_in_project` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`project_id`, `user_id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 3. TÂCHES & TICKETS (KANBAN)
-- ==========================================

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `project_id` int(11) NOT NULL,
  `status` enum('à faire','en cours','en revue','terminé') NOT NULL DEFAULT 'à faire',
  `priority` enum('Basse','Moyenne','Haute','Urgente') NOT NULL DEFAULT 'Moyenne',
  `assigned_to` int(11) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `task_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 4. INFLUENCEURS
-- ==========================================

CREATE TABLE `influencers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(100) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `handle` varchar(100) NOT NULL UNIQUE,
  `real_name` varchar(255) NOT NULL,
  `followers` varchar(50) DEFAULT NULL,
  `engagement_rate` decimal(5,2) DEFAULT NULL,
  `average_views` varchar(50) DEFAULT NULL,
  `type` enum('Macro','Micro','Nano') NOT NULL,
  `city` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `niche` varchar(100) DEFAULT NULL,
  `categories` text DEFAULT NULL,
  `platform` varchar(50) DEFAULT 'Instagram',
  `status` enum('active','warning','new') DEFAULT 'new',
  `contract_status` enum('actif','en_revision','prospect') DEFAULT 'prospect',
  `contract_end_date` date DEFAULT NULL,
  `bio` text,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `secondary_phone` varchar(50) DEFAULT NULL,
  `social_links_json` text DEFAULT NULL,
  `languages` varchar(255) DEFAULT NULL,
  `is_exclusive` boolean DEFAULT FALSE,
  `base_fee` decimal(15,2) DEFAULT 0,
  `variable_fee` decimal(15,2) DEFAULT 0,
  `risk_score` int(11) DEFAULT 0,
  `reliability_score` decimal(3,1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des contrats d'influenceurs
CREATE TABLE `influencer_contracts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `influencer_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `type` enum('exclusif','ponctuel','ambassadeur','partenariat') NOT NULL DEFAULT 'ponctuel',
  `amount` decimal(15,2) NOT NULL DEFAULT 0,
  `payment_terms` text DEFAULT NULL,
  `status` enum('actif','en_negociation','expire','resilie') NOT NULL DEFAULT 'en_negociation',
  `document_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`influencer_id`) REFERENCES `influencers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des livrables (Cahier des charges)
CREATE TABLE `influencer_deliverables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `influencer_id` int(11) NOT NULL,
  `campaign_name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `deliverable_type` enum('video','story','post','live','autre') NOT NULL,
  `deadline` date NOT NULL,
  `status` enum('a_faire','en_cours','livre','valide') NOT NULL DEFAULT 'a_faire',
  `guidelines` text DEFAULT NULL,
  `product` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`influencer_id`) REFERENCES `influencers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des statistiques de publication
CREATE TABLE `influencer_publications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `influencer_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `platform` varchar(50) NOT NULL,
  `post_date` date DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  `likes` int(11) DEFAULT 0,
  `comments` int(11) DEFAULT 0,
  `shares` int(11) DEFAULT 0,
  `reach` int(11) DEFAULT 0,
  `impressions` int(11) DEFAULT 0,
  `engagement_rate` decimal(5,2) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`influencer_id`) REFERENCES `influencers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 5. CAMPAGNES D'INFLUENCE
-- ==========================================

CREATE TABLE `influence_campaigns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` enum('active','briefing','terminé') NOT NULL DEFAULT 'briefing',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `kpi_reach_target` int(11) DEFAULT NULL,
  `kpi_engagement_target` decimal(5,2) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `campaign_influencers` (
  `campaign_id` int(11) NOT NULL,
  `influencer_id` int(11) NOT NULL,
  `status` varchar(50) DEFAULT 'briefing',
  PRIMARY KEY (`campaign_id`, `influencer_id`),
  FOREIGN KEY (`campaign_id`) REFERENCES `influence_campaigns`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`influencer_id`) REFERENCES `influencers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 6. BRIEFS CLIENTS
-- ==========================================

CREATE TABLE `briefs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `client_id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `status` enum('nouveau','en_cours','valide','refuse') DEFAULT 'nouveau',
  `budget` decimal(15,2) DEFAULT NULL,
  `description` text,
  `kpis_expected` text,
  `deadline` date DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`client_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 7. SUIVI FINANCIER (FACTURES & BONS DE COMMANDE)
-- ==========================================

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reference` varchar(100) NOT NULL UNIQUE,
  `client_id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `amount_ht` decimal(15,2) NOT NULL,
  `amount_ttc` decimal(15,2) NOT NULL,
  `status` enum('Brouillon','Envoyée','Payée','En retard') NOT NULL DEFAULT 'Brouillon',
  `issue_date` date NOT NULL,
  `due_date` date NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`client_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `purchase_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reference` varchar(100) NOT NULL UNIQUE,
  `supplier_name` varchar(255) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('En attente','Validé','Payé','Annulé') NOT NULL DEFAULT 'En attente',
  `issue_date` date NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 8. DOCUMENTS & COLLABORATION
-- ==========================================

CREATE TABLE `documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `size_bytes` int(11) DEFAULT 0,
  `project_id` int(11) DEFAULT NULL,
  `uploaded_by` int(11) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`)
-- ==========================================
-- 9. PUBLICATIONS & WORKFLOW CM
-- ==========================================

CREATE TABLE `publications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `plateforme` enum('Facebook','Instagram','TikTok','LinkedIn','Twitter/X') NOT NULL,
  `format` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `date_target` date DEFAULT NULL,
  `heure_target` time DEFAULT '10:00:00',
  `statut` enum('Brouillon','En validation','À corriger','Validé','Programmé','Publié') NOT NULL DEFAULT 'Brouillon',
  `action` varchar(100) DEFAULT 'Éditer',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `validated_at` timestamp NULL DEFAULT NULL,
  `scheduled_at` timestamp NULL DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `calendar_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client` varchar(255) NOT NULL DEFAULT 'Orange Telco',
  `canal` varchar(100) NOT NULL,
  `type` varchar(100) NOT NULL,
  `format` varchar(100) NOT NULL DEFAULT 'Paysage',
  `time` time NOT NULL DEFAULT '10:00:00',
  `status` enum('PENDING','SCHEDULED','PUBLISHED','DRAFT') NOT NULL DEFAULT 'PENDING',
  `title` varchar(255) NOT NULL,
  `generation` enum('Manual','AI') NOT NULL DEFAULT 'Manual',
  `description` text DEFAULT NULL,
  `day` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial data for publications & calendar posts
INSERT INTO `publications` (`id`, `title`, `plateforme`, `format`, `statut`, `action`) VALUES
(1, 'Carousel produit mai', 'Instagram', 'Carrousel', 'Brouillon', 'Éditer'),
(2, 'Vidéo tuto #FastTips', 'TikTok', 'Reels', 'À corriger', 'Corriger'),
(3, 'Post annonce partenariat', 'LinkedIn', 'Image', 'Validé', 'Programmer'),
(4, 'Thread récap événement', 'Twitter/X', 'Thread', 'En validation', 'Relancer'),
(5, 'Story coulisses bureau', 'Instagram', 'Story', 'Brouillon', 'Éditer'),
(6, 'Infographie Q2 results', 'LinkedIn', 'Image', 'Validé', 'Programmer'),
(7, 'Reel tendance challenge', 'TikTok', 'Reels', 'Brouillon', 'Éditer'),
(8, 'Post promo flash', 'Facebook', 'Image', 'Programmé', 'Voir');

INSERT INTO `calendar_posts` (`id`, `client`, `canal`, `type`, `format`, `time`, `status`, `title`, `generation`, `description`, `day`, `image`) VALUES
(1, 'Orange Telco', 'Facebook', 'Feed', 'Paysage', '10:00:00', 'PUBLISHED', 'Facebook published local highlight', 'Manual', 'A published Facebook image sample post so the calendar feels active instead of empty.', 17, 'https://placehold.co/100x100/f39c12/white?text=FB'),
(2, 'Orange Money', 'Instagram', 'Feed', 'Portraits', '09:05:00', 'PUBLISHED', 'Instagram published update', 'Manual', 'A published Instagram image sample post so the calendar feels active instead of empty.', 18, 'https://placehold.co/100x100/9b59b6/white?text=IG'),
(3, 'Orange Business', 'Instagram', 'Carrousel', 'Portraits', '10:00:00', 'PENDING', 'Instagram queued promo', 'Manual', 'Queued Instagram text-only content prepared for an upcoming slot in the next few days.', 19, NULL),
(4, 'Orange Digital Center', 'X', 'Feed', 'Paysage', '08:30:00', 'PENDING', 'X queued campaign', 'Manual', 'Queued X image content prepared for an upcoming slot in the next few days.', 20, 'https://placehold.co/100x100/34495e/white?text=X'),
(5, 'Max it', 'Facebook', 'Carrousel', 'Paysage', '09:00:00', 'PENDING', 'Facebook queued product teaser', 'Manual', 'Queued Facebook image content prepared for an upcoming slot in the next few days.', 21, 'https://placehold.co/100x100/2980b9/white?text=FB'),
(6, 'Orange Telco', 'Instagram', 'Réels et Story', 'Portraits', '13:15:00', 'PUBLISHED', 'AI Instagram published recap', 'AI', 'AI-generated Instagram post already published to show a completed automation result.', 17, 'https://placehold.co/100x100/111111/ffffff?text=AI'),
(7, 'Site web', 'Facebook', 'Feed', 'Paysage', '11:30:00', 'PENDING', 'AI Facebook queued idea', 'AI', 'AI-generated Facebook preview copy queued for automatic publishing.', 21, 'https://placehold.co/100x100/ecf0f1/333333?text=Web');

COMMIT;

-- ==========================================================
-- INSTRUCTIONS DE DÉPLOIEMENT WAMP (APACHE + MYSQL)
-- ==========================================================
-- 1. Ouvrir phpMyAdmin sur WAMP (http://localhost/phpmyadmin)
-- 2. Importer ce fichier SQL pour générer la structure
-- 3. Côté React, créer une API (Node.js/PHP) pour interagir avec cette base de données
-- 4. Pour déployer le frontend, copier le contenu du dossier `dist/` dans `c:\wamp64\www\mccannbridge\dist`
-- 5. Le fichier `.htaccess` généré dans `dist` gérera correctement les routes React.
