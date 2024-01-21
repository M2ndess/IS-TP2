CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS POSTGIS;
CREATE EXTENSION IF NOT EXISTS POSTGIS_TOPOLOGY;

-- Teams Table
CREATE TABLE public.team (
    id   VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(250) NOT NULL
);

-- Players Table
CREATE TABLE public.players (
    id              VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(250) NOT NULL,
    last_name       VARCHAR(250) NOT NULL,
    gender          VARCHAR(50) NOT NULL,
    age             FLOAT,
    country         VARCHAR(250) NOT NULL,
    competitor_id   VARCHAR(50) NOT NULL,
    competitor_name VARCHAR(250) NOT NULL,
    height          VARCHAR(50) NOT NULL,
    weight          VARCHAR(50) NOT NULL,
    overall_rank    VARCHAR(50) NOT NULL,
    overall_score   VARCHAR(50) NOT NULL,
    year            VARCHAR(50) NOT NULL,
    competition     VARCHAR(250) NOT NULL,
    height_cm       VARCHAR(50) NOT NULL,
    weight_kg       VARCHAR(50) NOT NULL,
    team_id         VARCHAR(36) REFERENCES team(id) ON DELETE SET NULL,
    FOREIGN KEY (team_id) REFERENCES team(id) ON DELETE SET NULL
);

-- Countries Table
CREATE TABLE public.countries (
    id       VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    name     VARCHAR(250) UNIQUE NOT NULL,
    coords   GEOMETRY(Point, 4326)
);

-- Competition Table
CREATE TABLE public.competition (
    id              VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    year            VARCHAR(50) NOT NULL,
    competition_name VARCHAR(250) NOT NULL
);

-- CompetitionPlayers Table
CREATE TABLE public.competition_players (
    id              VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    competitor_id   VARCHAR(50) NOT NULL,
    competitor_name VARCHAR(250) NOT NULL,
    overall_rank    VARCHAR(50) NOT NULL,
    overall_score   VARCHAR(50) NOT NULL,
    competition_id  VARCHAR(36) REFERENCES competition(id) ON DELETE CASCADE,
    FOREIGN KEY (competition_id) REFERENCES competition(id) ON DELETE CASCADE
);
