`CREATE DATABASE CCY_PROD;
USE CCY_PROD;

CREATE TABLE \`users\` (
	\`id_user\` BIGINT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	\`login\` VARCHAR(500) NULL DEFAULT NULL,
	\`password\` VARCHAR(500) NULL DEFAULT NULL,
	\`token\` VARCHAR(500) NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET=latin1;
INSERT INTO \`users\` (\`id_user\`, \`login\`, \`password\`, \`token\`) VALUES
(1, 'pedro', 'f71dbe52628a3f83a77ab494817525c6', 'mysupersecuredtoken');

CREATE TABLE \`platforms\` (
	\`id_platform\` BIGINT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	\`name\` VARCHAR(500) NULL DEFAULT NULL,
	\`status\` INT(2) NULL DEFAULT NULL,
	\`refresh_frequency\` INT(10) NULL DEFAULT NULL,
	\`refresh_max_requests\` INT(10) NULL DEFAULT NULL,
	\`refresh_nb_requests\` INT(10) NULL DEFAULT NULL,
	\`refresh_interval_end\` DATETIME NULL DEFAULT NULL,
	\`created_at\` DATETIME NULL DEFAULT NULL,
	\`updated_at\` DATETIME NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET=latin1;
INSERT INTO \`platforms\` (\`id_platform\`, \`name\`, \`refresh_frequency\`, \`refresh_max_requests\`, \`refresh_nb_requests\`, \`refresh_interval_end\`, \`created_at\`, \`updated_at\`) VALUES
(1, 'Binance', '60', '10', '0', '2018-01-01 00:00:00', '2018-01-01 00:00:00', '2018-01-01 00:00:00');

CREATE TABLE \`platform_markets\` (
	\`id_platform_market\` BIGINT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	\`platform_id\` BIGINT(10) NULL DEFAULT NULL,
	\`market_id\` BIGINT(10) NULL DEFAULT NULL,
	\`external_market_id\` INT(10) NULL DEFAULT NULL,
	\`external_market_code\` VARCHAR(20) NULL DEFAULT NULL,
	\`external_currency_code\` VARCHAR(10) NULL DEFAULT NULL,
	\`external_currency_base_code\` VARCHAR(10) NULL DEFAULT NULL,
	\`count_boll_short\` INT(10) NULL DEFAULT NULL,
	\`count_boll_long\` INT(10) NULL DEFAULT NULL,
	\`sum_highest\` INT(1) NULL DEFAULT NULL,
	\`sum_higher\` INT(1) NULL DEFAULT NULL,
	\`sum_lower\` INT(1) NULL DEFAULT NULL,
	\`sum_lowest\` INT(1) NULL DEFAULT NULL,
	\`status\` INT(2) NULL DEFAULT NULL,
	\`created_at\` DATETIME NULL DEFAULT NULL,
	\`updated_at\` DATETIME NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE \`current_values\` (
	\`id_current_value\` BIGINT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	\`platform_market_id\` BIGINT(10) NULL DEFAULT NULL,
	\`value\` DECIMAL(25,15) NULL DEFAULT NULL,
	\`bid\` DECIMAL(25,15) NULL DEFAULT NULL,
	\`ask\` DECIMAL(25,15) NULL DEFAULT NULL,
	\`created_at\` DATETIME NULL DEFAULT NULL,
	\`updated_at\` DATETIME NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE \`klines\` (
	\`id_kline\` BIGINT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	\`platform_market_id\` BIGINT(10) NULL DEFAULT NULL,
	\`open\` DECIMAL(25,15) NULL DEFAULT NULL,
	\`close\` DECIMAL(25,15) NULL DEFAULT NULL,
	\`high\` DECIMAL(25,15) NULL DEFAULT NULL,
	\`low\` DECIMAL(25,15) NULL DEFAULT NULL,
	\`volume\` DECIMAL(25,15) NULL DEFAULT NULL,
	\`buy_volume\` DECIMAL(25,15) NULL DEFAULT NULL,
	\`open_timestamp\` BIGINT(2) NULL DEFAULT NULL,
	\`close_timestamp\` BIGINT(2) NULL DEFAULT NULL,
	\`current_timestamp\` BIGINT(2) NULL DEFAULT NULL,
	\`closed\` INT(1) NULL DEFAULT NULL,
	\`bollup\` DECIMAL(25,15) NULL DEFAULT NULL,
	\`bolldown\` DECIMAL(25,15) NULL DEFAULT NULL,
	\`moyenne\` DECIMAL(25,15) NULL DEFAULT NULL,
	\`highest\` INT(1) NULL DEFAULT NULL,
	\`higher\` INT(1) NULL DEFAULT NULL,
	\`lower\` INT(1) NULL DEFAULT NULL,
	\`lowest\` INT(1) NULL DEFAULT NULL,
	\`created_at\` DATETIME NULL DEFAULT NULL,
	\`updated_at\` DATETIME NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE \`markets\` (
	\`id_market\` BIGINT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	\`currency_id\` BIGINT(10) NULL DEFAULT NULL,
	\`currency_base_id\` BIGINT(10) NULL DEFAULT NULL,
	\`status\` INT(2) NULL DEFAULT NULL,
	\`created_at\` DATETIME NULL DEFAULT NULL,
	\`updated_at\` DATETIME NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE \`currencies\` (
	\`id_currency\` BIGINT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	\`code\` VARCHAR(10) NULL DEFAULT NULL,
	\`name\` VARCHAR(255) NULL DEFAULT NULL,
	\`status\` INT(2) NULL DEFAULT NULL,
	\`created_at\` DATETIME NULL DEFAULT NULL,
	\`updated_at\` DATETIME NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE \`requests\` (
	\`id_request\` BIGINT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	\`platform_id\` BIGINT(10) NULL DEFAULT NULL,
	\`url\` VARCHAR(2000) NULL DEFAULT NULL,
	\`type\` INT(2) NULL DEFAULT NULL,
	\`code\` INT(2) NULL DEFAULT NULL,
	\`priority\` INT(2) NULL DEFAULT NULL,
	\`status\` INT(2) NULL DEFAULT NULL,
	\`refresh_frequency\` INT(10) NULL DEFAULT NULL,
	\`updated_until\` DATETIME NULL DEFAULT NULL,
	\`created_at\` DATETIME NULL DEFAULT NULL,
	\`updated_at\` DATETIME NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET=latin1;
INSERT INTO \`requests\` (\`id_request\`, \`platform_id\`, \`url\`, \`type\`, \`code\`, \`priority\`, \`status\`, \`refresh_frequency\`, \`updated_until\`, \`created_at\`, \`updated_at\`) VALUES
(1, 1, 'https://api.binance.com/api/v1/exchangeInfo', 0, 1, 0, 1, 60, '2018-01-01 00:00:00', '2018-01-01 00:00:00', '2018-01-01 00:00:00'),
(2, 1, 'https://api.binance.com/api/v3/ticker/bookTicker', 1, 1, 0, 1, 1, '2018-01-01 00:00:00', '2018-01-01 00:00:00', '2018-01-01 00:00:00');

CREATE TABLE \`transactions\` (
	\`id_transaction\` BIGINT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	\`platform_market_id\` BIGINT(10) NULL DEFAULT NULL,
	\`price\` DECIMAL(25,15) NULL DEFAULT NULL,
	\`volume\` DECIMAL(25,15) NULL DEFAULT NULL,
	\`timestamp\` BIGINT(2) NULL DEFAULT NULL,
	\`type\` INT(1) NULL DEFAULT NULL,
	\`status\` INT(1) NULL DEFAULT NULL,
	\`created_at\` DATETIME NULL DEFAULT NULL,
	\`updated_at\` DATETIME NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE \`robots\` (
	\`id_robot\` BIGINT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	\`current_history_value_id\` BIGINT(10) NULL DEFAULT NULL,
	\`status\` INT(1) NULL DEFAULT NULL,
	\`created_at\` DATETIME NULL DEFAULT NULL,
	\`updated_at\` DATETIME NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET=latin1;
INSERT INTO \`robots\` (\`id_robot\`, \`current_history_value_id\`, \`status\`, \`created_at\`, \`updated_at\`) VALUES
(1, 1, 0, '2018-01-01 00:00:00', '2018-01-01 00:00:00');

CREATE TABLE \`robot_histories\` (
	\`id_robot_history\` BIGINT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	\`robot_id\` BIGINT(10) NULL DEFAULT NULL,
	\`status\` INT(1) NULL DEFAULT NULL,
	\`created_at\` DATETIME NULL DEFAULT NULL,
	\`updated_at\` DATETIME NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET=latin1;
INSERT INTO \`robot_histories\` (\`id_robot_history\`, \`robot_id\`, \`status\`, \`created_at\`, \`updated_at\`) VALUES
(1, 1, 1, '2018-01-01 00:00:00', '2018-01-01 00:00:00');

CREATE TABLE \`robot_history_values\` (
	\`id_robot_history_value\` BIGINT(10) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	\`robot_history_id\` BIGINT(10) NULL DEFAULT NULL,
	\`currency_id\` BIGINT(10) NULL DEFAULT NULL,
	\`value\` DECIMAL(25,15) NULL DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET=latin1;
INSERT INTO \`robot_history_values\` (\`id_robot_history_value\`, \`robot_history_id\`, \`currency_id\`, \`value\`) VALUES
(1, 1, 1, 1.0),
(2, 1, 2, NULL),
(3, 1, 4, NULL);`.replace(/\n/g, " ").match(/CREATE\s*TABLE\s*`(\w+)`\s*\((.*?)\)\s*ENGINE/gm).forEach(e => {
	// console.log(e);
	(/\s*`(\S*)`\s*(.+)/).exec(e).forEach((e,i) =>
		i == 0 ? null :
		i == 1 ? console.log(`\n\t${e}`) :
		i == 2 ? /[(,]?\s*`\s*(\w*)\s*`\s*(\S*).*?/g.exec(e).forEach(e => console.log(`\t\t${e}`)) :
		null
	)
})


// .forEach((e,i) => {
// 	if (i == 0)
// 		return
// 	else if (i % 2 == 1)
// 		console.log(e)
// 	else {
// 		console.log(e)
// 	}
// })
