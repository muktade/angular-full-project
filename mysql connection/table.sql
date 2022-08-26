create table user(
    id int primary key auto_increment,
    name varchar(250),
    contactNumber varchar(250),
    email varchar(150),
    password varchar(250),
    status varchar(50),
    role varchar(50),
    uniqe (email)
);

insert into user(name, contactNumber, email, password, status, role) values(
    'Admin', '1234567890', 'admin@gmail.com', 'admin', 'true', 'admin'
)

create table category(
    id int not null auto_increment,
    name varchar(200) not null,
    primary key(id)
);

create table product(
    id int not null auto_increment,
    name varchar(50) not null,
    categoryId integer not null,
    description varchar(300),
    price integer,
    status varchar(50),
    primary key(id)
);

create table bill(
    id int not null auto_increment,
    uuid varchar(200) not null,
    name varchar(250) not null,
    email varchar(255) not null,
    contactNumber varchar(50) not null,
    paymentMethod varchar(100) not null,
    total int not null,
    productDetails JSON DEFAULT NULL,
    createdBy varchar(255) not null,
    primary key(id)
);