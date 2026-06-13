resource "terraform_data" "mock_rds" {
    input = {
        endpoint = "local_rds:5432"
        db_name  = "app_database"
    }
}