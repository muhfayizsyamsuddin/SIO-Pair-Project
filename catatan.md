# Tema project on Demand App : Restaurant SIO (SimpleOrder)

## aplikasi ini bertujuan untuk memudahkan orang untuk order makanan atau minuman disebuah restaurant dengan simple atau efisien

# ERD
1. tabel UserProfiles
- id (Serial)
- photoUrl (string)
- address (string)
- UserId (INTEGER)

2. tabel Users
- id (serial)
- username (string)
- email (string) unik opsional
- password (string)
- role (string)

3. tabel Orders
- id (serial)
- statusOrder (string)
- UserId (integer) foreign key

4. tabel Menus
- id (serial) 
- name (string) 
- price (integer) 
- description (text) 
- isAvailable (BOOLEAN) 

5. tabel junction OrderMenus
- id (serial) 
- quantity (integer) 
- priceAtOrder (integer) 
- OrderId (integer) foreign key
- MenuId (integer) foreign key

## Asosiasi
- one to one => Users dan UserProfiles  => User has one userProfile => userProfile belongs to User:
- 1 User hanya punya 1 userProfile

- one to many => Users dan Orders => User has many Order => Order belongs to User:
- 1 User punya banyak Order
- 1 Order cuma milik 1 User

- many to many => Orders dan Menus => junction OrderMenus => Orders belongs to many Menu => Menu belongs to many Orders:
- Order bisa punya banyak Menu dan Menu bisa ada di banyak Order

## Nama DB : sio_app

## Package
https://www.npmjs.com/package/easyinvoice
