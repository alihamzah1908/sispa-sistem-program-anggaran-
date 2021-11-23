/*
 Navicat Premium Data Transfer

 Source Server         : localnew
 Source Server Type    : MySQL
 Source Server Version : 100414
 Source Host           : localhost:3306
 Source Schema         : sireda

 Target Server Type    : MySQL
 Target Server Version : 100414
 File Encoding         : 65001

 Date: 18/11/2021 08:51:18
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cashflow
-- ----------------------------
DROP TABLE IF EXISTS `cashflow`;
CREATE TABLE `cashflow`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NULL DEFAULT NULL,
  `rekeningId` int(11) NULL DEFAULT NULL,
  `kode_rekening` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `uraian` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `koefisien` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `satuan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `harga` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ppn` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `total` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `userId`(`userId`) USING BTREE,
  INDEX `rekeningId`(`rekeningId`) USING BTREE,
  CONSTRAINT `cashflow_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `cashflow_ibfk_2` FOREIGN KEY (`rekeningId`) REFERENCES `rekening` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of cashflow
-- ----------------------------
INSERT INTO `cashflow` VALUES (1, 7, 3, '9301001', 'bbm', '10', 'liter', '10000', NULL, '100000', '2021-11-15 04:51:55', '2021-11-15 04:51:55');
INSERT INTO `cashflow` VALUES (10, 7, 3, '', '12', '1', '', '1111', NULL, '1111', '2021-11-15 06:35:24', '2021-11-15 06:35:24');
INSERT INTO `cashflow` VALUES (11, 7, 3, '', '', '3', '', '13121', NULL, '39363', '2021-11-15 06:39:16', '2021-11-15 06:39:16');
INSERT INTO `cashflow` VALUES (12, 7, 3, '', '', '1', '', '1111', NULL, '1111', '2021-11-15 06:41:02', '2021-11-15 06:41:02');
INSERT INTO `cashflow` VALUES (13, 7, 3, '91301003001', 'Kegiatan A', '1', 'liter', '1000000', NULL, '1000000', '2021-11-16 04:30:59', '2021-11-16 04:30:59');

-- ----------------------------
-- Table structure for rekening
-- ----------------------------
DROP TABLE IF EXISTS `rekening`;
CREATE TABLE `rekening`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NULL DEFAULT NULL,
  `kode_rekening` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sub_kegiatan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `saldo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `userId`(`userId`) USING BTREE,
  CONSTRAINT `rekening_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of rekening
-- ----------------------------
INSERT INTO `rekening` VALUES (3, 7, NULL, 'Kegiatan A', '1581387', '2021-11-15 04:32:50', '2021-11-16 04:30:59');
INSERT INTO `rekening` VALUES (4, 8, NULL, 'Kegiatan Sekre', '180210301', '2021-11-15 06:14:17', '2021-11-15 06:14:52');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `role_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `createdAt` datetime(0) NULL DEFAULT NULL,
  `updatedAt` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'Diskominfo', 'diskominfo', '$2b$10$PGlX4V4oagO6Vlb8ljWVmu9ifndRcLBQFQ1UI8x5NUYfajGxBWDcC', 'super admin', NULL, NULL);
INSERT INTO `users` VALUES (7, 'Bidang Statistik', 'statistik', '$2b$10$PN3EpIIBetATnxHz7aPdKOWIVLe3ttXXf5ZDJ77hmcvrj/6SEv9Ty', 'admin', '2021-11-08 13:05:31', '2021-11-08 13:05:31');
INSERT INTO `users` VALUES (8, 'Sekertariat', 'sekertariat', '$2b$10$x3hnzOeIV1xgptEcs1UOselU3rXgloCehBLUBxxWZoh25SbigqMtC', 'admin', '2021-11-08 13:16:21', '2021-11-08 13:16:21');

SET FOREIGN_KEY_CHECKS = 1;
