
docker exec -it terrific_travel_db mysql -u root -p

CREATE DATABASE IF NOT EXISTS terrific_travel;

GRANT ALL PRIVILEGES ON terrific_travel.* TO 'root'@'%';

FLUSH PRIVILEGES;

EXIT;