CREATE TABLE IF NOT EXISTS lol_version
(
  id         INT UNSIGNED AUTO_INCREMENT
    PRIMARY KEY,
  version    VARCHAR(30) NOT NULL,
  updated_at TIMESTAMP   NULL,
  created_at TIMESTAMP   NULL
)
  ENGINE = InnoDB
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lol_champions
(
  id         INT UNSIGNED AUTO_INCREMENT
    PRIMARY KEY,
  championId INT UNSIGNED NOT NULL,
  name       VARCHAR(30)  NOT NULL,
  title      VARCHAR(30)  NOT NULL,
  updated_at TIMESTAMP    NULL,
  created_at TIMESTAMP    NULL
)
  ENGINE = InnoDB
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lol_summoners
(
  id            INT UNSIGNED AUTO_INCREMENT
    PRIMARY KEY,
  accountId     INT UNSIGNED NOT NULL,
  summonerId    INT UNSIGNED NOT NULL,
  name          VARCHAR(30)  NOT NULL,
  summonerLevel INT UNSIGNED NOT NULL,
  updated_at    TIMESTAMP    NULL,
  created_at    TIMESTAMP    NULL,
  CONSTRAINT lol_summoners_accountId_unique
  UNIQUE (accountId),
  CONSTRAINT lol_summoners_summonerId_unique
  UNIQUE (summonerId)
)
  ENGINE = InnoDB
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lol_league
(
  id           INT UNSIGNED AUTO_INCREMENT
    PRIMARY KEY,
  summonerId   INT UNSIGNED NOT NULL,
  queueType    VARCHAR(30)  NOT NULL,
  wins         INT UNSIGNED NOT NULL,
  losses       INT UNSIGNED NOT NULL,
  rank         VARCHAR(30)  NOT NULL,
  tier         VARCHAR(30)  NOT NULL,
  leaguePoints INT UNSIGNED NOT NULL,
  updated_at   TIMESTAMP    NULL,
  created_at   TIMESTAMP    NULL,
  CONSTRAINT lol_league_summonerId_unique
  UNIQUE (summonerId),
  CONSTRAINT lol_league_summonerId_foreign
  FOREIGN KEY (summonerId) REFERENCES lol_summoners (summonerId)
    ON UPDATE CASCADE
    ON DELETE CASCADE
)
  ENGINE = InnoDB
  COLLATE = utf8mb4_unicode_ci;

