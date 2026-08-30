-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: flyeasy
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `airlines`
--

DROP TABLE IF EXISTS `airlines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `airlines` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL,
  `code` varchar(10) DEFAULT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airlines`
--

LOCK TABLES `airlines` WRITE;
/*!40000 ALTER TABLE `airlines` DISABLE KEYS */;
INSERT INTO `airlines` VALUES ('191c4406-e628-4283-ac6b-230be86dcd93','Singapore Airlines','SQ','/uploads/airline_singapore_airlines.png','Singapore',1,9,'2026-08-25 06:04:35','2026-08-25 06:15:30'),('2a7fd5a4-64f3-4966-a84e-ef4d128b230b','flydubai','FZ','/uploads/airline_flydubai.png','UAE',1,5,'2026-08-25 06:04:35','2026-08-25 06:15:29'),('426484a9-3ef4-4da8-8346-ea58e1fb0714','IndiGo','6E','/uploads/airline_indigo.png','India',1,6,'2026-08-25 06:04:35','2026-08-25 06:15:29'),('531b97d4-0c15-4c1b-832e-821debb50d16','Thai Airways','TG','/uploads/airline_thai_airways.png','Thailand',1,10,'2026-08-25 06:04:35','2026-08-25 06:15:31'),('5b96d4df-3af4-4a8c-917b-f2070a227d25','Emirates','EK','/uploads/airline_emirates.png','UAE',1,7,'2026-08-25 06:04:35','2026-08-25 06:15:30'),('76bd4750-b665-414b-80be-07c1ac790563','Novoair','VQ',NULL,'Bangladesh',1,3,'2026-08-25 06:04:35','2026-08-25 06:16:17'),('8cb75bd5-abf9-4909-99ec-e3967868ea68','Qatar Airways','QR','/uploads/airline_qatar_airways.png','Qatar',1,8,'2026-08-25 06:04:35','2026-08-25 06:15:30'),('95d50d28-dc90-4f71-8e9d-552732478516','Air Arabia','G9','/uploads/airline_air_arabia.png','UAE',1,4,'2026-08-25 06:04:35','2026-08-25 06:15:28'),('c861e676-df26-478b-b6bd-acbf393ac3e2','US-Bangla Airlines','US','/uploads/airline_us_bangla_airlines.png','Bangladesh',1,2,'2026-08-25 06:04:35','2026-08-25 06:15:27'),('ecfb8efc-6677-491e-aed1-8eab676c3c83','Biman Bangladesh Airlines','BG',NULL,'Bangladesh',1,1,'2026-08-25 06:04:35','2026-08-25 06:16:17');
/*!40000 ALTER TABLE `airlines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `announcements` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `title` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `type` enum('info','success','warning','promo') DEFAULT 'info',
  `link_url` varchar(500) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` VALUES ('82d3d2ac-a01b-11f1-bad2-a7e279b41c70','Welcome to FlyEasy!','Get 20% off on all summer flights when you book through our app.','info','/promotions',0,'2026-08-25 06:25:44','2026-08-29 02:13:39'),('82d40bf9-a01b-11f1-bad2-a7e279b41c70','New Route Alert!','Direct flights to Maldives are now available. Book now!','success','/flights',0,'2026-08-25 06:25:44','2026-08-29 02:13:44');
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookings` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) DEFAULT NULL,
  `package_id` char(36) DEFAULT NULL,
  `package_title` varchar(255) DEFAULT NULL,
  `item_type` enum('package','hotel','flight','guide') DEFAULT 'package',
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_phone` varchar(50) DEFAULT NULL,
  `travel_date` date DEFAULT NULL,
  `number_of_travelers` int(11) DEFAULT 1,
  `message` text DEFAULT NULL,
  `status` enum('pending','confirmed','paid','cancelled','completed') DEFAULT 'pending',
  `total_price` decimal(12,2) DEFAULT 0.00,
  `transaction_id` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `package_id` (`package_id`),
  KEY `idx_bookings_email` (`customer_email`),
  KEY `idx_bookings_status` (`status`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES ('0094003e-2345-4ee0-a6f2-bddc7f85c688','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','00912d5b-4dae-4a3b-80f5-ee3570070410','Kuakata Sunrise & Sunset','package','Test Client','client@flyeasy.com','01681160730','2026-09-04',1,'','pending',10000.00,NULL,'2026-08-29 02:40:25','2026-08-29 02:40:25'),('0e23f4bf-a016-4d32-b86c-e9642c371481','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','02676843-d188-4699-9dfe-3c7f6b268063','Bandarban Cloud Camping','package','Test Client','client@flyeasy.com','01681160730','2026-08-26',1,'','completed',14000.00,NULL,'2026-08-25 08:13:51','2026-08-25 08:50:34'),('21d1981a-867f-4cce-af1b-9419ad78d51e','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','68ea8483-bab7-4ccc-b1f5-3a4964957bee','Dubai City Tour & Desert Safari','package','Test Client','client@flyeasy.com','01681160730','2026-09-01',1,'','pending',85000.00,NULL,'2026-08-29 02:35:15','2026-08-29 02:35:15'),('2c387ce1-645a-477f-a9ce-5ce731defcb6','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','0527d7b1-3e86-4382-a030-29b7c23bfedc','Radisson Blu','hotel','Test Client','client@flyeasy.com','01681160730','0000-00-00',1,'','pending',15000.00,NULL,'2026-08-28 21:25:34','2026-08-28 21:25:34'),('388a18cb-8d49-452b-a6df-20b38949ddef',NULL,'test-123','Test Flight Booking','flight','Test User','test@example.com',NULL,NULL,1,NULL,'confirmed',1000.00,NULL,'2026-08-25 08:12:13','2026-08-25 08:15:53'),('4db11ecf-3954-4e81-bf73-f54f51dcabf0','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','30851ddb-5d72-4962-a239-ec33e1bcc537','V9 851','flight','Test Client','client@flyeasy.com','01681160730','2026-08-27',1,'','confirmed',4800.00,NULL,'2026-08-25 08:14:16','2026-08-25 08:15:47'),('53bd2ccb-9d23-4fb1-a76c-aaa39534217e','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','66eaa198-2811-4537-8c27-9054ce0788bd','BS 143','flight','Test Client','client@flyeasy.com','01681160730','2026-08-28',1,'','pending',3900.00,NULL,'2026-08-29 02:36:45','2026-08-29 02:36:45'),('63d67a7c-ae9a-4963-b1e9-0697720f2c5f','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','6e43dc8b-a865-49f4-bf8e-652d78ae924b','Ocean Paradise','hotel','Test Client','client@flyeasy.com','01681160730','0000-00-00',1,'','pending',9000.00,NULL,'2026-08-28 21:26:06','2026-08-28 21:26:06'),('6b72498e-d431-480d-ad16-36f62e1377ab','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','0527d7b1-3e86-4382-a030-29b7c23bfedc','Radisson Blu','hotel','Test Client','client@flyeasy.com','01681160730','0000-00-00',1,'','pending',15000.00,NULL,'2026-08-28 21:25:57','2026-08-28 21:25:57'),('703cdf41-eac0-49b2-8179-6805c5aa78bf','41b985a1-1cc0-4579-81bf-572493f9d508','02676843-d188-4699-9dfe-3c7f6b268063','Bandarban Cloud Camping','package','Super Admin','admin@flyeasy.com','01681160730','2026-08-27',1,'','pending',14000.00,NULL,'2026-08-29 00:25:55','2026-08-29 00:25:55'),('71e25331-447a-4efb-81ea-a7c48f945c4e','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','0527d7b1-3e86-4382-a030-29b7c23bfedc','Radisson Blu','hotel','Test Client','client@flyeasy.com','01681160730','0000-00-00',1,'','pending',15000.00,NULL,'2026-08-28 21:24:24','2026-08-28 21:24:24'),('794e39e2-5323-44ea-802b-703210350ecc','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','59c3eed5-214e-4559-80d9-a18c92e3a6be','The Peninsula Chittagong','hotel','Test Client','client@flyeasy.com','01681160730','0000-00-00',1,'','confirmed',8500.00,NULL,'2026-08-25 08:14:01','2026-08-25 08:15:50'),('9ea621d0-1397-4ac4-9440-a34836b43b49','ac6a9b01-0dd6-4d63-a085-3bd1aca40028',NULL,'MD Ashraf Uddin Noyon','guide','noyon','client@flyeasy.com','01681160730','2026-08-29',1,'sdf','pending',0.00,NULL,'2026-08-29 00:18:27','2026-08-29 00:18:27'),('b902859f-abd2-4fc6-bb5e-7ae7332574a8','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','02676843-d188-4699-9dfe-3c7f6b268063','Bandarban Cloud Camping','package','Test Client','client@flyeasy.com','01681160730','2026-08-31',1,'','pending',14000.00,NULL,'2026-08-29 02:19:37','2026-08-29 02:19:37'),('bb847e56-5b82-482e-929a-37a3ebcd4fe2','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','30851ddb-5d72-4962-a239-ec33e1bcc537','V9 851','flight','Test Client','client@flyeasy.com','01681160730','2026-09-04',1,'','pending',4800.00,NULL,'2026-08-29 02:46:54','2026-08-29 02:46:54'),('ec9a2e49-8941-4b06-9672-bd014de197dd','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','00912d5b-4dae-4a3b-80f5-ee3570070410','Kuakata Sunrise & Sunset','package','Test Client','client@flyeasy.com','01681160730','2026-08-27',5,'','pending',50000.00,NULL,'2026-08-29 02:40:07','2026-08-29 02:40:07');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certifications`
--

DROP TABLE IF EXISTS `certifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `certifications` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image_url` text DEFAULT NULL,
  `type` enum('certification','partner') DEFAULT 'partner',
  `sort_order` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certifications`
--

LOCK TABLES `certifications` WRITE;
/*!40000 ALTER TABLE `certifications` DISABLE KEYS */;
INSERT INTO `certifications` VALUES ('82d65201-a01b-11f1-bad2-a7e279b41c70','IATA Accredited','/images/cert_1.jpg','certification',0,1,'2026-08-25 00:25:44'),('82d670d8-a01b-11f1-bad2-a7e279b41c70','ATAB Member','/images/cert_2.jpg','certification',0,1,'2026-08-25 00:25:44'),('82d672b6-a01b-11f1-bad2-a7e279b41c70','TOAB Member','/images/cert_3.jpg','certification',0,1,'2026-08-25 00:25:44'),('82d6731e-a01b-11f1-bad2-a7e279b41c70','Emirates Partner','https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg','partner',0,1,'2026-08-25 00:25:44'),('b1c2d3e4-f5g6-7h8i-9j0k','IATA Member','/images/cert_1.jpg','partner',0,1,'2026-08-25 03:35:26'),('c1d2e3f4-g5h6-7i8j-9k0l','ATAB Member','/images/cert_2.jpg','partner',0,1,'2026-08-25 03:35:26'),('d1e2f3g4-h5i6-7j8k-9l0m','TOAB Member','/images/cert_3.jpg','partner',0,1,'2026-08-25 03:35:26');
/*!40000 ALTER TABLE `certifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `replied` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES (3,'noyon','noyon.cid@gmail.com','tes','Name: noyon\nEmail: noyon.cid@gmail.com\nMessage:\ntes','2026-08-29 02:16:33',0),(4,'noyon','noyon.cid@gmail.com','tes','Name: noyon\nEmail: noyon.cid@gmail.com\nMessage:\ntes','2026-08-29 02:16:36',0),(5,'noyon','noyon.cid@gmail.com','tes','Name: noyon\nEmail: noyon.cid@gmail.com\nMessage:\ntes','2026-08-29 02:18:20',0),(6,'noyon','noyon.cid@gmail.com','tes','Name: noyon\nEmail: noyon.cid@gmail.com\nMessage:\ntes','2026-08-29 02:18:22',0),(7,'noyon','noyon.cid@gmail.com','tes','Name: noyon\nEmail: noyon.cid@gmail.com\nMessage:\ntes','2026-08-29 02:18:26',0),(8,'noyon','noyon.cid+2@gmail.com','tes','Name: noyon\nEmail: noyon.cid+2@gmail.com\nMessage:\ntes','2026-08-29 02:26:55',0),(9,'noyon','noyon.cid+2@gmail.com','tes','Name: noyon\nEmail: noyon.cid+2@gmail.com\nMessage:\ntes','2026-08-29 02:26:58',0),(10,'noyon','noyon.cid+2@gmail.com','tes','Name: noyon\nEmail: noyon.cid+2@gmail.com\nMessage:\ntes','2026-08-29 02:26:58',0),(11,'noyon','noyon.cid+2@gmail.com','tes','Name: noyon\nEmail: noyon.cid+2@gmail.com\nMessage:\ntes','2026-08-29 02:26:59',0),(12,'noyon','noyon.cid+2@gmail.com','tes','Name: noyon\nEmail: noyon.cid+2@gmail.com\nMessage:\ntes','2026-08-29 02:26:59',0),(13,'noyon','noyon.cid+2@gmail.com','tes','Name: noyon\nEmail: noyon.cid+2@gmail.com\nMessage:\ntes','2026-08-29 02:26:59',0),(14,'noyon','noyon.cid+2@gmail.com','tes','Name: noyon\nEmail: noyon.cid+2@gmail.com\nMessage:\ntes','2026-08-29 02:26:59',0),(15,'noyon','noyon.cid+2@gmail.com','tes','Name: noyon\nEmail: noyon.cid+2@gmail.com\nMessage:\ntes','2026-08-29 02:26:59',0),(16,'noyon','noyon.cid+2@gmail.com','tes','Name: noyon\nEmail: noyon.cid+2@gmail.com\nMessage:\ntes','2026-08-29 02:27:00',0),(17,'noyon','noyon.cid+2@gmail.com','tes','Name: noyon\nEmail: noyon.cid+2@gmail.com\nMessage:\ntes','2026-08-29 02:27:00',0),(18,'noyon','noyon.cid+2@gmail.com','tes','Name: noyon\nEmail: noyon.cid+2@gmail.com\nMessage:\ntes','2026-08-29 02:27:00',0),(19,'noyon','noyon.cid+2@gmail.com','tes','Name: noyon\nEmail: noyon.cid+2@gmail.com\nMessage:\ntes','2026-08-29 02:27:00',0),(20,'noyon','noyon.cid@gmail.com','tes','Name: noyon\nEmail: noyon.cid@gmail.com\nMessage:\ntes','2026-08-29 02:34:27',0);
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_templates`
--

DROP TABLE IF EXISTS `email_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email_templates` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `body_html` text NOT NULL,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_templates`
--

LOCK TABLES `email_templates` WRITE;
/*!40000 ALTER TABLE `email_templates` DISABLE KEYS */;
INSERT INTO `email_templates` VALUES ('227b5457-6915-40a2-83a8-46c9749618fe','Booking Status Update','Your booking status is now [Status]','\n      <div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;\">\n        <div style=\"text-align: center; margin-bottom: 20px;\">\n          <!-- Replace with actual logo URL -->\n          <img src=\"https://via.placeholder.com/150x50?text=FlyEasy\" alt=\"FlyEasy Logo\" style=\"max-width: 150px;\" />\n        </div>\n        <h2 style=\"color: #0f172a; text-align: center;\">Booking Update: [Status]</h2>\n        <p style=\"color: #334155; font-size: 16px;\">Dear [Customer Name],</p>\n        <p style=\"color: #334155; font-size: 16px;\">Your booking <strong>[Booking ID]</strong> has been updated to: <strong style=\"color: #3b82f6;\">[Status]</strong>.</p>\n        \n        <div style=\"background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;\">\n          <h3 style=\"margin-top: 0; color: #0f172a;\">Booking Details</h3>\n          <p style=\"margin: 5px 0; color: #475569;\"><strong>Package:</strong> [Package Name]</p>\n          <p style=\"margin: 5px 0; color: #475569;\"><strong>Date:</strong> [Travel Date]</p>\n        </div>\n\n        <p style=\"color: #334155; font-size: 16px;\">If you have any questions, feel free to contact our support team.</p>\n        \n        <div style=\"text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;\">\n          <p style=\"margin-bottom: 10px; color: #64748b; font-size: 14px;\">Need help? WhatsApp us at: <strong>+880 1234 567 890</strong></p>\n          <div style=\"margin-top: 15px;\">\n            <a href=\"#\" style=\"text-decoration: none; margin: 0 10px; color: #3b82f6;\">Facebook</a>\n            <a href=\"#\" style=\"text-decoration: none; margin: 0 10px; color: #3b82f6;\">Instagram</a>\n            <a href=\"#\" style=\"text-decoration: none; margin: 0 10px; color: #3b82f6;\">Twitter</a>\n          </div>\n        </div>\n      </div>\n    ',1,'2026-08-25 01:17:19','2026-08-25 01:17:19');
/*!40000 ALTER TABLE `email_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faqs`
--

DROP TABLE IF EXISTS `faqs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `faqs` (
  `id` varchar(36) NOT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `category` varchar(255) DEFAULT 'General',
  `sort_order` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faqs`
--

LOCK TABLES `faqs` WRITE;
/*!40000 ALTER TABLE `faqs` DISABLE KEYS */;
INSERT INTO `faqs` VALUES ('','How do I book a flight?','You can book a flight directly from our homepage by entering your origin, destination, and travel dates in the search widget.','General',0,1,'2026-08-28 20:11:15'),('1d77c3af-9b76-45bc-a757-23094a9332ca','What is your cancellation policy?','Cancellations depend on the airline or hotel policy. Generally, a cancellation fee applies. Please read our Cancellation Policy page for details.','Cancellations',0,1,'2026-08-28 20:11:39'),('396ad25c-9bb1-4ea0-91bc-3822e144a015','Can I customize my tour package?','Absolutely! Our travel experts can tailor any package to suit your specific preferences and budget.','Packages',0,1,'2026-08-28 20:11:39'),('4f491f0b-91ba-4eca-aee8-3ba9415eed24','Do holiday packages include flights?','Yes, most of our holiday packages include return flights, but you can also opt for land-only packages.','Packages',0,1,'2026-08-28 20:11:39'),('52a6d207-9e63-4a9f-b376-790e74e5691b','How long does a refund take?','Refunds are typically processed within 7-14 working days, depending on your bank and the service provider.','Cancellations',0,1,'2026-08-28 20:11:39'),('730c7a7e-ae62-486f-b18d-dee33607b11b','What payment methods are accepted?','We accept major credit cards (Visa, MasterCard), Mobile Banking (bKash, Nagad), and bank transfers.','General',0,1,'2026-08-28 20:11:39'),('851109a0-035b-4e2b-94e2-e84371a22037','How do I book a flight?','You can book a flight directly from our homepage by entering your origin, destination, and travel dates in the search widget.','General',0,1,'2026-08-28 20:11:39'),('ab4bfa38-1503-4752-971a-048b05b80c21','How do I book a flight?','You can search for flights on our homepage and book directly. Our team will contact you to confirm the details.','General',1,1,'2026-08-23 22:22:26'),('ba1de035-7dda-4d44-bd1e-4a9897310ee1','What is your refund policy?','Refunds depend on the airline or hotel policy. We strive to provide transparent information before you book.','Booking',2,1,'2026-08-23 22:22:26'),('c2c192ee-925c-4796-99d8-342db8467c5f','Do you offer customized holiday packages?','Yes! Contact us via email or phone, and we will tailor a package specifically for you.','Packages',3,1,'2026-08-23 22:22:26');
/*!40000 ALTER TABLE `faqs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favorites` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) NOT NULL,
  `item_id` char(36) NOT NULL,
  `item_type` enum('package','hotel') NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_item_unique` (`user_id`,`item_id`,`item_type`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES ('9db5ee82-a30c-11f1-bad2-a7e279b41c70','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','3351fb30-5fa0-4da5-8828-aa1f9a153b83','package','2026-08-29 00:16:37'),('9f476d0d-a30c-11f1-bad2-a7e279b41c70','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','59f6cbd0-c51a-4016-ad4e-c67facbbcb9d','package','2026-08-29 00:16:40'),('a7810049-a30c-11f1-bad2-a7e279b41c70','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','1890081e-49eb-45a3-a916-a555078b3ae8','hotel','2026-08-29 00:16:53'),('ae795b3b-a30c-11f1-bad2-a7e279b41c70','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','00912d5b-4dae-4a3b-80f5-ee3570070410','package','2026-08-29 00:17:05');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flights`
--

DROP TABLE IF EXISTS `flights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `flights` (
  `id` char(36) NOT NULL,
  `airline_id` char(36) DEFAULT NULL,
  `airline_name` varchar(255) NOT NULL,
  `flight_code` varchar(100) NOT NULL,
  `origin` varchar(100) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `departure_time` datetime NOT NULL,
  `arrival_time` datetime NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stops` int(11) DEFAULT 0,
  `available` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flights`
--

LOCK TABLES `flights` WRITE;
/*!40000 ALTER TABLE `flights` DISABLE KEYS */;
INSERT INTO `flights` VALUES ('2cdb102e-88c0-4b62-8bbe-94de21a1ed28',NULL,'Biman Bangladesh','BG 671','DAC','CXB','2026-09-01 08:00:00','2026-09-01 09:05:00',4500.00,0,1,'2026-08-23 06:54:26','2026-08-23 06:54:26'),('30851ddb-5d72-4962-a239-ec33e1bcc537',NULL,'NOVOAIR','V9 851','DAC','CXB','2026-09-01 14:00:00','2026-09-01 15:05:00',4800.00,0,1,'2026-08-23 06:54:26','2026-08-23 06:54:26'),('4467c7a4-5df3-4f61-9991-ed4b17138a29',NULL,'NOVOAIR','V9 101','DAC','ZYL','2026-09-02 07:30:00','2026-09-02 08:15:00',2800.00,0,1,'2026-08-23 06:54:26','2026-08-23 06:54:26'),('509e05f5-9c88-4068-95c6-229152c203f8',NULL,'Biman Bangladesh','BG 673','DAC','CXB','2026-09-01 16:45:00','2026-09-01 17:50:00',4100.00,0,1,'2026-08-23 06:54:26','2026-08-23 06:54:26'),('66eaa198-2811-4537-8c27-9054ce0788bd',NULL,'US-Bangla Airlines','BS 143','DAC','CGP','2026-09-01 19:15:00','2026-09-01 20:20:00',3900.00,0,1,'2026-08-23 06:54:26','2026-08-23 06:54:26'),('86d877e8-b36e-4223-9fc8-b54ac126352c',NULL,'Biman Bangladesh','BG 201','DAC','CGP','2026-09-02 09:00:00','2026-09-02 10:10:00',3500.00,0,1,'2026-08-23 06:54:26','2026-08-23 06:54:26'),('9895d68e-6226-40ad-a107-ece49d3b8a94',NULL,'US-Bangla Airlines','BS 141','DAC','CXB','2026-09-01 10:30:00','2026-09-01 11:35:00',4200.00,0,1,'2026-08-23 06:54:26','2026-08-23 06:54:26');
/*!40000 ALTER TABLE `flights` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hotels`
--

DROP TABLE IF EXISTS `hotels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hotels` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `star_rating` int(11) DEFAULT 3,
  `price_per_night` decimal(12,2) NOT NULL DEFAULT 0.00,
  `image_url` varchar(500) DEFAULT NULL,
  `gallery` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gallery`)),
  `amenities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amenities`)),
  `description` text DEFAULT NULL,
  `reviews_count` int(11) DEFAULT 0,
  `rating` decimal(3,2) DEFAULT 0.00,
  `featured` tinyint(1) DEFAULT 0,
  `available` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_hotels_featured` (`featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels`
--

LOCK TABLES `hotels` WRITE;
/*!40000 ALTER TABLE `hotels` DISABLE KEYS */;
INSERT INTO `hotels` VALUES ('0527d7b1-3e86-4382-a030-29b7c23bfedc','Radisson Blu','SS Khaled Road','Chittagong',5,15000.00,'/images/hero.jpg',NULL,NULL,NULL,0,0.00,0,1,'2026-08-24 05:51:14','2026-08-24 05:51:14'),('1890081e-49eb-45a3-a916-a555078b3ae8','Sayeman Beach Resort','Marine Drive','Coxs Bazar',5,12000.00,'/images/coxs_bazar.jpg',NULL,NULL,NULL,0,0.00,0,1,'2026-08-24 05:51:14','2026-08-24 05:51:14'),('3b2dbaaa-419c-4d72-b70b-2f85850b3a4b','The Peninsula Chittagong','GEC Circle','Chittagong',4,8500.00,'/images/maldives.jpg',NULL,NULL,NULL,0,0.00,0,1,'2026-08-23 03:48:03','2026-08-23 03:48:03'),('46d8f4c7-9c9c-44db-882c-d300d3caafd0','Ocean Paradise','Kolatoli','Coxs Bazar',4,9000.00,'/images/maldives.jpg',NULL,NULL,NULL,0,0.00,0,1,'2026-08-23 03:48:03','2026-08-23 03:48:03'),('59c3eed5-214e-4559-80d9-a18c92e3a6be','The Peninsula Chittagong','GEC Circle','Chittagong',4,8500.00,'/images/maldives.jpg',NULL,NULL,NULL,0,0.00,0,1,'2026-08-24 05:51:14','2026-08-24 05:51:14'),('6e43dc8b-a865-49f4-bf8e-652d78ae924b','Ocean Paradise','Kolatoli','Coxs Bazar',4,9000.00,'/images/maldives.jpg',NULL,NULL,NULL,0,0.00,0,1,'2026-08-24 05:51:14','2026-08-24 05:51:14'),('c524ee84-221d-46d6-a7bf-de02aeccaaa9','Radisson Blu','SS Khaled Road','Chittagong',5,15000.00,'/images/hero.jpg',NULL,NULL,NULL,0,0.00,0,1,'2026-08-23 03:48:03','2026-08-23 03:48:03'),('f38bd035-3b8f-4394-a911-f1604bbbd610','Sayeman Beach Resort','Marine Drive','Coxs Bazar',5,12000.00,'/images/coxs_bazar.jpg',NULL,NULL,NULL,0,0.00,0,1,'2026-08-23 03:48:03','2026-08-23 03:48:03');
/*!40000 ALTER TABLE `hotels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsletter_subscribers`
--

DROP TABLE IF EXISTS `newsletter_subscribers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `newsletter_subscribers` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `status` enum('subscribed','unsubscribed') DEFAULT 'subscribed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletter_subscribers`
--

LOCK TABLES `newsletter_subscribers` WRITE;
/*!40000 ALTER TABLE `newsletter_subscribers` DISABLE KEYS */;
/*!40000 ALTER TABLE `newsletter_subscribers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_email` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `type` enum('booking','system','promo') DEFAULT 'system',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('3646e5e8-068c-41a1-b5ea-541d3d6e8c20','client@flyeasy.com','Booking Status Updated','Your booking for V9 851 is now confirmed.',0,'booking','2026-08-25 08:15:47','2026-08-25 08:15:47'),('8f68b98d-5276-49ed-b327-15127bc1f9dd','client@flyeasy.com','Booking Status Updated','Your booking for Bandarban Cloud Camping is now confirmed.',0,'booking','2026-08-25 08:15:51','2026-08-25 08:15:51'),('a30e045b-7e64-4464-a812-a5400ed03aba','client@flyeasy.com','Booking Status Updated','Your booking for The Peninsula Chittagong is now confirmed.',0,'booking','2026-08-25 08:15:50','2026-08-25 08:15:50'),('cc18cd7a-17bc-42ca-a957-db31c20ecbab','test@example.com','Booking Status Updated','Your booking for Test Flight Booking is now confirmed.',0,'booking','2026-08-25 08:15:53','2026-08-25 08:15:53');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packages`
--

DROP TABLE IF EXISTS `packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `packages` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'Bangladesh',
  `short_description` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `original_price` decimal(12,2) DEFAULT NULL,
  `duration_days` int(11) DEFAULT 3,
  `image_url` varchar(500) DEFAULT NULL,
  `gallery` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gallery`)),
  `itinerary` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`itinerary`)),
  `inclusions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`inclusions`)),
  `exclusions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`exclusions`)),
  `category` varchar(100) DEFAULT NULL,
  `featured` tinyint(1) DEFAULT 0,
  `rating` decimal(3,2) DEFAULT 0.00,
  `reviews_count` int(11) DEFAULT 0,
  `available` tinyint(1) DEFAULT 1,
  `max_travelers` int(11) DEFAULT 10,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_packages_slug` (`slug`),
  KEY `idx_packages_featured` (`featured`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packages`
--

LOCK TABLES `packages` WRITE;
/*!40000 ALTER TABLE `packages` DISABLE KEYS */;
INSERT INTO `packages` VALUES ('00912d5b-4dae-4a3b-80f5-ee3570070410','Kuakata Sunrise & Sunset','kuakata-beach','Kuakata','Bangladesh','The daughter of the sea','<p>Experience an unforgettable journey with this meticulously planned package. Contact us for the full detailed itinerary.</p>',10000.00,NULL,2,'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80',NULL,NULL,NULL,NULL,'Beach',0,0.00,0,1,10,'2026-08-24 01:42:46','2026-08-24 01:42:46'),('02676843-d188-4699-9dfe-3c7f6b268063','Bandarban Cloud Camping','bandarban-cloud','Bandarban','Bangladesh','Camp above the clouds','<p>Experience an unforgettable journey with this meticulously planned package. Contact us for the full detailed itinerary.</p>',14000.00,NULL,3,'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',NULL,NULL,NULL,NULL,'Mountain',0,5.00,1,1,10,'2026-08-24 01:42:46','2026-08-28 19:54:24'),('17b485b1-f53b-47ef-8139-dd746b1dd5c4','Maldives Honeymoon','maldives-honeymoon','Maldives','Bangladesh',NULL,NULL,120000.00,NULL,3,'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80',NULL,NULL,NULL,NULL,'Honeymoon',1,0.00,0,1,10,'2026-08-23 03:48:03','2026-08-24 03:50:36'),('3351fb30-5fa0-4da5-8828-aa1f9a153b83','Cox\'s Bazar Premium Getaway','coxs-bazar-premium','Cox\'s Bazar','Bangladesh','Enjoy the longest sea beach','<p>Experience an unforgettable journey with this meticulously planned package. Contact us for the full detailed itinerary.</p>',15000.00,NULL,3,'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',NULL,NULL,NULL,NULL,'Beach',0,0.00,0,1,10,'2026-08-24 01:42:46','2026-08-24 04:48:27'),('3e931d54-b00c-44ec-9cae-e5d89337f8a7','Singapore Family Adventure','singapore-family','Singapore','Singapore','Universal Studios & Gardens by the Bay','<p>Experience an unforgettable journey with this meticulously planned package. Contact us for the full detailed itinerary.</p>',75000.00,NULL,4,'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80',NULL,NULL,NULL,NULL,'Family',0,0.00,0,1,10,'2026-08-24 01:42:46','2026-08-24 01:42:46'),('59f6cbd0-c51a-4016-ad4e-c67facbbcb9d','Nepal Himalayan Trek','nepal-trek','Kathmandu','Nepal','Trek the majestic Himalayas','<p>Experience an unforgettable journey with this meticulously planned package. Contact us for the full detailed itinerary.</p>',45000.00,NULL,6,'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80',NULL,NULL,NULL,NULL,'Adventure',0,0.00,0,1,10,'2026-08-24 01:42:46','2026-08-24 01:42:46'),('68ea8483-bab7-4ccc-b1f5-3a4964957bee','Dubai City Tour & Desert Safari','dubai-city','Dubai','UAE','Modern architecture & desert thrills','<p>Experience an unforgettable journey with this meticulously planned package. Contact us for the full detailed itinerary.</p>',85000.00,NULL,5,'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80',NULL,NULL,NULL,NULL,'City',0,0.00,0,1,10,'2026-08-24 01:42:46','2026-08-24 01:42:46'),('6b3624d9-283a-416c-9025-c12dcd5cfa45','Bali Tropical Escape','bali-escape','Bali','Indonesia','Experience the magic of Bali','<p>Experience an unforgettable journey with this meticulously planned package. Contact us for the full detailed itinerary.</p>',95000.00,NULL,5,'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80',NULL,NULL,NULL,NULL,'International',0,0.00,0,1,10,'2026-08-24 01:42:46','2026-08-24 01:42:46'),('763b911b-3d82-49fc-a884-1b08571fd4be','Sundarbans Safari','sundarbans-safari','Sundarbans','Bangladesh','Thrilling mangrove forest safari','<p>Experience an unforgettable journey with this meticulously planned package. Contact us for the full detailed itinerary.</p>',18000.00,NULL,4,'https://images.unsplash.com/photo-1590767187868-b8e9efb71803?auto=format&fit=crop&q=80',NULL,NULL,NULL,NULL,'Adventure',0,0.00,0,1,10,'2026-08-24 01:42:46','2026-08-24 01:42:46'),('9ae160a5-301a-4ddd-82a5-d2e480ebe4a1','Bali Getaway','bali-getaway','Bali, Indonesia','Bangladesh',NULL,NULL,85000.00,NULL,3,'/images/hero.jpg',NULL,NULL,NULL,NULL,'International',1,0.00,0,1,10,'2026-08-23 03:48:03','2026-08-23 03:48:03'),('cf8a33e2-71f8-4a23-b420-c37158f3e169','Coxs Bazar Beach Holiday','coxs-bazar-holiday','Coxs Bazar','Bangladesh',NULL,'aADFSDFSDF',15000.00,0.00,3,'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800','null','null','null','null','Beach',1,0.00,0,1,10,'2026-08-23 03:48:03','2026-08-24 04:48:27'),('db28b733-52ac-48e3-a7cf-af2b436594d9','Sylhet Tea Gardens & Waterfalls','sylhet-tea-gardens','Sylhet','Bangladesh','Explore the natural beauty of Sylhet','<p>Experience an unforgettable journey with this meticulously planned package. Contact us for the full detailed itinerary.</p>',12000.00,NULL,3,'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&q=80',NULL,NULL,NULL,NULL,'Mountain',0,0.00,0,1,10,'2026-08-24 01:42:46','2026-08-24 01:42:46');
/*!40000 ALTER TABLE `packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pages` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `status` enum('published','draft') DEFAULT 'published',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES ('110bd746-9f46-11f1-a9f8-770fe551e380','Cancellation Policy','cancellation-policy','<h3>Cancellation & Refunds</h3><p>Refunds are processed within 14 days...</p>','published','2026-08-24 04:57:50','2026-08-24 04:57:50'),('6582f9d3-a318-11f1-bad2-a7e279b41c70','Cancellation & Refund Policy','cancellation','<h1>Cancellation & Refund Policy</h1><p>We understand that plans can change. Here is our cancellation and refund policy.</p><h2>1. Cancellation Process</h2><p>Cancellations must be submitted in writing via email to info@flyeasytourism.com or through our customer support.</p><h2>2. Refund Process</h2><p>Refunds will be processed within 7-14 working days after approval. Flight tickets are subject to the airline\'s own cancellation and refund policy.</p>','published','2026-08-29 01:40:57','2026-08-29 01:40:57'),('65868015-a318-11f1-bad2-a7e279b41c70','Cookie Policy','cookie-policy','<h1>Cookie Policy</h1><p>This Cookie Policy explains how FlyEasy Tourism uses cookies and similar technologies to recognize you when you visit our website.</p><h2>1. What are cookies?</h2><p>Cookies are small data files that are placed on your computer or mobile device when you visit a website.</p><h2>2. Why do we use cookies?</h2><p>We use cookies to ensure that our website functions properly, to analyze our traffic, and to provide personalized content and ads.</p>','published','2026-08-29 01:40:57','2026-08-29 01:40:57'),('82d7948e-a01b-11f1-bad2-a7e279b41c70','Terms & Conditions','terms','<h2>1. Agreement to Terms</h2><p>By accessing our services, you agree to these terms.</p><h2>2. Booking & Payment</h2><p>All bookings are subject to availability. Prices may change without notice.</p>','published','2026-08-25 06:25:44','2026-08-25 06:25:44'),('82d7cb49-a01b-11f1-bad2-a7e279b41c70','Privacy Policy','privacy','<h2>1. Data Collection</h2><p>We collect your information to provide better travel services.</p><h2>2. Security</h2><p>Your data is protected using industry standard security.</p>','published','2026-08-25 06:25:44','2026-08-25 06:25:44');
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partners`
--

DROP TABLE IF EXISTS `partners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `partners` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL,
  `logo_url` varchar(500) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partners`
--

LOCK TABLES `partners` WRITE;
/*!40000 ALTER TABLE `partners` DISABLE KEYS */;
INSERT INTO `partners` VALUES ('707b46ea-a30c-11f1-bad2-a7e279b41c70','Booking.com','http://localhost:4000/uploads/1787942039854-691316781.png',1,0,'2026-08-29 00:15:21','2026-08-29 00:34:14'),('70829206-a30c-11f1-bad2-a7e279b41c70','Expedia','http://localhost:4000/uploads/1787942008435-978624126.png',1,1,'2026-08-29 00:15:21','2026-08-29 00:33:31'),('7086179c-a30c-11f1-bad2-a7e279b41c70','Airbnb','http://localhost:4000/uploads/1787942023742-192151678.png',1,2,'2026-08-29 00:15:21','2026-08-29 00:33:45'),('7088990d-a30c-11f1-bad2-a7e279b41c70','Tripadvisor','http://localhost:4000/uploads/1787941983395-815584178.png',1,3,'2026-08-29 00:15:21','2026-08-29 00:33:07'),('708b2c0b-a30c-11f1-bad2-a7e279b41c70','Agoda','http://localhost:4000/uploads/1787942137203-375540958.png',1,4,'2026-08-29 00:15:21','2026-08-29 00:35:41'),('cdda7e60-a2f6-11f1-bad2-a7e279b41c70','Emirates','https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg',1,1,'2026-08-28 21:40:29','2026-08-28 21:40:29'),('cddb1ed8-a2f6-11f1-bad2-a7e279b41c70','Qatar Airways','https://upload.wikimedia.org/wikipedia/en/9/9b/Qatar_Airways_Logo.svg',1,2,'2026-08-28 21:40:29','2026-08-28 21:40:29');
/*!40000 ALTER TABLE `partners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment_methods` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `method_type` enum('bank','bkash','nagad','sslcommerz','other') NOT NULL,
  `label` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(100) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `branch` varchar(255) DEFAULT NULL,
  `routing_number` varchar(50) DEFAULT NULL,
  `mobile_number` varchar(30) DEFAULT NULL,
  `merchant_id` varchar(100) DEFAULT NULL,
  `store_id` varchar(100) DEFAULT NULL,
  `instructions` text DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `promotions` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `coupon_code` varchar(50) DEFAULT NULL,
  `discount_text` varchar(100) DEFAULT NULL,
  `link_url` varchar(500) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES ('03670994-22d6-4341-b730-b90e6e0a5f0d','Maldives Honeymoon Package - Buy 1 Get 1','Book our premium Maldives honeymoon package for two and pay only for one! Limited time offer.','/uploads/maldives_resort.jpg','LOVE2026','BOGO',NULL,1,0,'2026-08-25 06:01:11','2026-08-25 06:01:11'),('6278c203-5342-4622-8a3c-1e6e3e58346c','Eid Special: 20% off Domestic Flights','Book any domestic flight during the Eid holiday week and get 20% flat discount up to BDT 2000.','/uploads/promo_eid_flight.jpg','EID2026','20% OFF',NULL,1,0,'2026-08-25 06:01:11','2026-08-25 06:01:11'),('97193ea1-0b91-431a-8dfb-cff26a4052c2','Cox\'s Bazar Hotel Flash Sale','Get massive discounts on 5-star hotels in Cox\'s Bazar. Valid for bookings made this weekend.','/uploads/coxs_bazar_beach.jpg','','UP TO 50% OFF',NULL,1,0,'2026-08-25 06:01:11','2026-08-25 06:01:11');
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `item_id` char(36) NOT NULL,
  `item_type` varchar(50) DEFAULT 'package',
  `booking_id` char(36) DEFAULT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `text` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES ('cd55adb6-d0c8-4110-a3ae-20888c78fea8','ac6a9b01-0dd6-4d63-a085-3bd1aca40028','Test Client','02676843-d188-4699-9dfe-3c7f6b268063','package','0e23f4bf-a016-4d32-b86c-e9642c371481',5,'Excellent trip!','approved','2026-08-25 08:52:18','2026-08-28 19:47:27');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_content`
--

DROP TABLE IF EXISTS `site_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `site_content` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `hero_badge` varchar(255) DEFAULT NULL,
  `hero_headline` varchar(500) DEFAULT NULL,
  `hero_subheadline` varchar(500) DEFAULT NULL,
  `hero_image_url` varchar(500) DEFAULT NULL,
  `about_mission` text DEFAULT NULL,
  `site_domain` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `contact_whatsapp` varchar(50) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `support_email` varchar(255) DEFAULT NULL,
  `contact_address` varchar(500) DEFAULT NULL,
  `footer_about` text DEFAULT NULL,
  `developer_name` varchar(255) DEFAULT NULL,
  `developer_tagline` varchar(255) DEFAULT NULL,
  `developer_website` varchar(255) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `admin_url_slug` varchar(100) DEFAULT 'admin',
  `header_links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`header_links`)),
  `footer_links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`footer_links`)),
  `contact_hours` varchar(255) DEFAULT NULL,
  `contact_map_url` text DEFAULT NULL,
  `site_name` varchar(200) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `seo_keywords` text DEFAULT NULL,
  `favicon_url` varchar(500) DEFAULT NULL,
  `logo_light_url` varchar(500) DEFAULT NULL,
  `logo_dark_url` varchar(500) DEFAULT NULL,
  `social_facebook` varchar(500) DEFAULT NULL,
  `social_instagram` varchar(500) DEFAULT NULL,
  `social_twitter` varchar(500) DEFAULT NULL,
  `social_youtube` varchar(500) DEFAULT NULL,
  `social_linkedin` varchar(500) DEFAULT NULL,
  `cookie_banner_text` text DEFAULT NULL,
  `registration_open` tinyint(1) DEFAULT 1,
  `rewards_active` tinyint(1) DEFAULT 0,
  `smtp_host` varchar(255) DEFAULT NULL,
  `smtp_port` varchar(50) DEFAULT NULL,
  `smtp_user` varchar(255) DEFAULT NULL,
  `smtp_pass` varchar(255) DEFAULT NULL,
  `email_sender_name` varchar(255) DEFAULT NULL,
  `email_sender_email` varchar(255) DEFAULT NULL,
  `email_logo_url` varchar(500) DEFAULT NULL,
  `about_show_stats` tinyint(1) DEFAULT 1,
  `about_show_team` tinyint(1) DEFAULT 1,
  `about_show_certs` tinyint(1) DEFAULT 1,
  `about_show_faqs` tinyint(1) DEFAULT 1,
  `about_show_airlines` tinyint(1) DEFAULT 1,
  `about_show_partners` tinyint(1) DEFAULT 1,
  `services_headline` text DEFAULT NULL,
  `services_subheadline` text DEFAULT NULL,
  `services_card_title` varchar(255) DEFAULT NULL,
  `services_card_subtitle` varchar(255) DEFAULT NULL,
  `services_card_desc` text DEFAULT NULL,
  `services_img_left_1` varchar(255) DEFAULT NULL,
  `services_img_left_2` varchar(255) DEFAULT NULL,
  `services_img_right` varchar(255) DEFAULT NULL,
  `newsletter_bg_image_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_content`
--

LOCK TABLES `site_content` WRITE;
/*!40000 ALTER TABLE `site_content` DISABLE KEYS */;
INSERT INTO `site_content` VALUES ('bee3014b-607b-436e-9a6b-4931c0d34182','Bangladesh\'s effortless travel platform','Find flights, hotels & holidays in one place','Effortless booking, transparent pricing, and curated travel experiences — from Cox\'s Bazar to the Maldives.','','','','+880 1711 223344','+880 1711 223344','support@flyeasytourism.com','info@flyeasytourism.com','123 Travel Avenue, Agrabad, Chattogram, Bangladesh','FlyEasy Tourism is your trusted travel partner in Bangladesh, offering premium flight bookings, hotel reservations, and curated tour packages.','','','','2026-08-29 02:12:34','admin','[]','[{\"title\":\"SERVICES\",\"links\":[{\"label\":\"Flight Booking\",\"url\":\"/flights\"},{\"label\":\"Holiday Packages\",\"url\":\"/packages\"},{\"label\":\"International Trips\",\"url\":\"/packages\"},{\"label\":\"Visa Consultation\",\"url\":\"/contact\"}]},{\"title\":\"DESTINATIONS\",\"links\":[{\"label\":\"India\",\"url\":\"/packages\"},{\"label\":\"Dubai\",\"url\":\"/packages\"},{\"label\":\"Bali\",\"url\":\"/packages\"},{\"label\":\"Europe\",\"url\":\"/packages\"},{\"label\":\"Maldives\",\"url\":\"/packages\"},{\"label\":\"Singapore\",\"url\":\"/packages\"}]},{\"title\":\"COMPANY\",\"links\":[{\"label\":\"About Us\",\"url\":\"/about\"},{\"label\":\"Our Services\",\"url\":\"/about\"},{\"label\":\"Testimonials\",\"url\":\"/\"},{\"label\":\"Contact Us\",\"url\":\"/contact\"},{\"label\":\"Careers\",\"url\":\"/careers\"}]},{\"title\":\"SUPPORT\",\"links\":[{\"label\":\"FAQs\",\"url\":\"/faq\"},{\"label\":\"Cancellation Policy\",\"url\":\"/cancellation\"},{\"label\":\"Terms & Conditions\",\"url\":\"/terms\"},{\"label\":\"Privacy Policy\",\"url\":\"/privacy\"},{\"label\":\"Cookie Policy\",\"url\":\"/cookies\"},{\"label\":\"Customer Support\",\"url\":\"/customer-support\"}]}]','Saturday - Thursday: 9:00 AM - 8:00 PM','','FlyEasy','Effortless travel booking — flights, hotels, and holiday packages across Bangladesh and beyond.','flights, hotels, packages, travel, bangladesh, maldives','http://localhost:4000/uploads/1787945065728-17335742.jpeg','http://localhost:4000/images/logo-dark.png','http://localhost:4000/images/logo-light.png','#','#','#','#','#','We use cookies to enhance your browsing experience. By continuing, you accept our cookie policy.',1,0,'smtp.example.com','465','','','FlyEasy','info@flyeasy.com','http://localhost:4000/uploads/1787945065728-17335742.jpeg',1,1,1,1,1,1);
/*!40000 ALTER TABLE `site_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_members`
--

DROP TABLE IF EXISTS `team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `team_members` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `image_url` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_members`
--

LOCK TABLES `team_members` WRITE;
/*!40000 ALTER TABLE `team_members` DISABLE KEYS */;
INSERT INTO `team_members` VALUES ('82d599f9-a01b-11f1-bad2-a7e279b41c70','Jane Doe','CEO & Founder','/images/team_member_1.jpg','Over 15 years of experience in the aviation and tourism industry, Jane leads FlyEasy with a vision for effortless travel.',0,1,'2026-08-25 00:25:44'),('82d5b862-a01b-11f1-bad2-a7e279b41c70','John Smith','Head of Operations','/images/team_member_2.jpg','Ensuring that every booking and journey runs smoothly from start to finish.',0,1,'2026-08-25 00:25:44'),('82d5b99e-a01b-11f1-bad2-a7e279b41c70','Sara Lee','Customer Experience Lead','/images/team_member_3.jpg','Dedicated to providing 24/7 world-class support to all our travelers.',0,1,'2026-08-25 00:25:44'),('82d5b9cf-a01b-11f1-bad2-a7e279b41c70','David Chen','Tech Lead','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&h=500&fit=crop','Architect of the fast, seamless booking platform you use today.',0,1,'2026-08-25 00:25:44');
/*!40000 ALTER TABLE `team_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testimonials` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL,
  `trip` varchar(255) DEFAULT NULL,
  `text` text DEFAULT NULL,
  `rating` int(11) DEFAULT 5,
  `avatar_url` varchar(500) DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `video_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES ('1d038f65-5032-46ec-8bf2-91b10c013926','Imran Hossain','Kuala Lumpur Business','Great platform for frequent travelers. Everything is organized in one place. I appreciate the clean interface without the usual clutter of travel sites.',5,'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop',1,7,'2026-08-24 04:29:47','2026-08-24 04:29:47',NULL),('71085e96-1889-44c3-8cdd-640056d57612','Nadia Afrin','Saint Martin Island','Truly effortless travel! They managed our ferry tickets and resort bookings smoothly during peak season. Will definitely book with them again.',5,'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop',1,10,'2026-08-24 04:29:47','2026-08-24 04:29:47',NULL),('7a8c1b52-311e-4298-8909-37be17f2add0','Rakib Uddin','Bangkok Shopping','They gave us the best rates for our Bangkok trip. I compared with other agencies and FlyEasy was not only cheaper but much more professional.',4,'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop',1,9,'2026-08-24 04:29:47','2026-08-24 04:29:47',NULL),('7ded3054-7c4d-4950-a146-b59fa30d0827','Mehazabien Chowdhury','Sylhet Tea Gardens','The best part is how they curate their packages. It really takes the stress out of planning. Our trip to Sylhet was perfectly organized.',5,'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',1,8,'2026-08-24 04:29:47','2026-08-24 04:29:47',NULL),('968347e2-7bbc-4c1e-b212-389bcdd5fa6f','Tahmina Akter','Istanbul Exploration','I was amazed by the speed of their service. I booked my flight and hotel in under 5 minutes. The whole experience felt very premium.',5,'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',1,6,'2026-08-24 04:29:47','2026-08-24 04:29:47',NULL),('9e2b9b40-ef5c-460a-9cc1-96aa64086534','Sadia Rahman','Cox\'s Bazar Getaway','I loved the transparent pricing. No hidden fees at all! Our stay at the hotel they suggested was fantastic and the sea view was mesmerizing.',5,'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',1,2,'2026-08-24 04:29:47','2026-08-24 04:29:47',NULL),('b048b776-f359-4bb3-81a4-fd305e1b624a','Kamrul Hasan','Sajek Valley Adventure','Affordable and reliable. I have booked multiple domestic trips with them and they never disappoint. The web app is super easy to use.',4,'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',1,5,'2026-08-24 04:29:47','2026-08-24 04:29:47',NULL),('df293ee6-f986-47ff-b63e-b3acb14b6328','Abrar Chowdhury','Dubai City Tour','Exceptional service! The customer support team was available at 2 AM when we had a minor issue with our hotel check-in. They resolved it in minutes.',5,'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',1,3,'2026-08-24 04:29:47','2026-08-24 04:29:47',NULL),('e88e319c-7868-468b-8603-534c6e978aa8','Farhana Haque','Bali Retreat','This was our first international trip and FlyEasy made it a breeze. The curated itinerary was perfectly balanced between sightseeing and relaxation.',5,'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',1,4,'2026-08-24 04:29:47','2026-08-24 04:29:47',NULL),('f458ab94-e4d9-462d-bde5-f3cf35945320','Tanjim Islam','Maldives Honeymoon','The booking process was incredibly smooth. FlyEasy took care of everything from flights to resort transfers. Highly recommended for hassle-free travel!',5,'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',1,1,'2026-08-24 04:29:47','2026-08-24 04:29:47',NULL);
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','client') NOT NULL DEFAULT 'client',
  `reward_points` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `phone` varchar(50) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('1fe291f9-90d4-49b5-85cf-1c5fe081a037','Test User','testuser@flyeasy.com','$2a$10$wZU5KEtQIRvXcsp2mhBceehxJuINC7sIP5sMjDgGwEp0RBw7BeNG6','client',0,'2026-08-23 23:44:29','2026-08-23 23:44:29','01700000000',NULL),('41b985a1-1cc0-4579-81bf-572493f9d508','Super Admin','admin@flyeasy.com','$2a$10$9DhU/qm1EaVNSl7V.TQGhOVj.ZzVK4nvBJgdB87n/SsZRJNW00O8K','admin',0,'2026-08-23 00:46:11','2026-08-29 06:29:43',NULL,NULL),('ac6a9b01-0dd6-4d63-a085-3bd1aca40028','Test Client','client@flyeasy.com','$2a$10$JAGzSLPDRCGEMQpedX8UieceHc6kyhMJsbRtkZ2s610xr1rW3LtSu','client',0,'2026-08-24 01:17:58','2026-08-29 06:29:43','01681160730','/uploads/1787623370518-172076180.png'),('eb6be585-9e77-11f1-82b3-50fc00092ecc','Customer User','customer@example.com','$2a$10$QXLAZ7GScXpRooNwtzyOTOO/MGf7dRtUsoFhWk9SyEquAXRmbDsTG','',0,'2026-08-23 04:22:10','2026-08-23 07:02:23','01800000000',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-29  6:43:59
