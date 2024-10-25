boot:
	npm install
	npx sequelize-cli db:migrate
	npx sequelize-cli db:seed:all

migrate:
	npx sequelize-cli db:migrate

roleback:
	npx sequelize-cli db:migrate:undo

seed:
	npx sequelize-cli db:seed:all

dev:
	serverless offline start --reloadHandler

create_migration:
	npx sequelize-cli migration:create --name create_booths_table

create_seeder:
	npx sequelize-cli seed:generate --name demo-user


deploy:
	sls deploy --region=us-west-1