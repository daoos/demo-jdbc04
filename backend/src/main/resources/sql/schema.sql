-- drop sequence hibernate_sequence;
create sequence hibernate_sequence start 10 increment 1;
-- drop sequence AGENS_BASE_SEQUENCE;
create sequence AGENS_BASE_SEQUENCE start 10 increment 1;
-- drop sequence AGENS_PROJECTS_SEQUENCE;
create sequence AGENS_PROJECTS_SEQUENCE start 1001 increment 1;

-- drop table if exists AGENS_AUTHORITY;
create table AGENS_AUTHORITY(
	ID int8 not null, 
	NAME varchar(255), 
	primary key (ID)
);

-- drop table if exists AGENS_IP_WHITELIST;
create table AGENS_IP_WHITELIST(
	ID int8 not null, 
	DESCRIPTION varchar(500), 
	IP_ADDR varchar(255), 
	primary key (ID)
);

-- drop table if exists AGENS_USER;
create table AGENS_USER(
  ID int8 not null, 
  EMAIL varchar(255), 
  ENABLED boolean not null, 
  FIRSTNAME varchar(255), 
  LAST_PASSWORD_RESET_DATE date, 
  LASTNAME varchar(255), 
  PASSWORD varchar(255), 
  USERNAME varchar(100) not null, 
  constraint AGENS_USER_UK unique (USERNAME),
  primary key (ID)
);

-- drop table if exists AGENS_USER_AUTHORITIES;
create table AGENS_USER_AUTHORITIES(
	AGENS_USER_ID bigint not null,
	AUTHORITIES_ID bigint not null,
  primary key (AGENS_USER_ID, AUTHORITIES_ID)
);

-- drop table if exists AGENS_USER_PROJECTS;
create table AGENS_USER_PROJECTS(
  ID int8 not null, 
  USERNAME varchar(100) not null, 
  TITLE varchar(255) not null, 
  DESCRIPTION varchar(500),
  CREATE_DT timestamp default now(),
  UPDATE_DT timestamp default now(),
  SQL varchar(5000) null default '',
  IMAGE bytea null,  
  GRAPH text null default '{}',
  primary key (ID)
);
