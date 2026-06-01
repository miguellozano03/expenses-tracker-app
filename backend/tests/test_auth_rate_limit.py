from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.modules.auth.dependencies import get_auth_service


client = TestClient(app)

def test_login_rate_limit():
    max_requests = int(settings.login_rate_limit.split("/")[0])
    
    payload = {
        "email": "fake_user23@email.com",
        "password": "fake_password24"
    }
    
    for _ in range(max_requests):
        response = client.post(
            "/api/v1/auth/login",
            json=payload
        )
    response = client.post("/api/v1/auth/login", json=payload)
    
    assert response.status_code == 429
    
def test_register_rate_limit():
    max_requests = int(settings.login_rate_limit.split("/")[0])
    payload = {
        "email": "testUser@example.com",
        "nickname": "test_user001",
        "password": "Test_password24"
    }
    
    for _ in range(max_requests):
        response = client.post(
            "/api/v1/auth/register",
            json=payload
        )
    response = client.post("/api/v1/auth/register", json=payload)
    
    assert response.status_code == 429
    
def test_refresh_token_limit(mocker):
    max_requests = int(settings.refresh_rate_limit.split("/")[0])
    
    mock_service = mocker.Mock()
    
    mock_service.refresh.return_value = {
        "access_token": "fake-access",
        "refresh_token": "fake-refresh",
        "type": "bearer"
    }
    
    app.dependency_overrides[get_auth_service] = (
        lambda: mock_service
    )
    
    payload = {
        "refresh_token": "fake-refresh-token"
    }
    
    for _ in range(max_requests):
        response = client.post(
            "/api/v1/auth/refresh",
            json=payload,
        )
    response = client.post(
            "/api/v1/auth/refresh",
            json=payload,
    )
    
    
    assert response.status_code == 429
    
    mock_service.refresh.assert_called()
    app.dependency_overrides.clear()