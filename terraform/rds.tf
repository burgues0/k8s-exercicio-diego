resource "aws_db_instance" "postgres" {
    allocated_storage = 20
    engine = "postgres"
    engine_version = "15.4"
    instance_class = "db.t3.micro"
    db_name = "app_database"
    username = "postgres"
    password = "postgres"
    skip_final_snapshot = true

    tags = {
        Name = "api-database"
    }
}