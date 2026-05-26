
docker exec -it terrific_travel_db mysql -u root -p

CREATE DATABASE IF NOT EXISTS terrific_travel;

GRANT ALL PRIVILEGES ON terrific_travel.* TO 'root'@'%';

FLUSH PRIVILEGES;

EXIT;

docker exec -it -u root terrific_travel_web sh -c "npm install prisma && npx prisma db push"