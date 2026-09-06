from pydantic import BaseModel
from pydantic import BaseModel

class LoginRequest(BaseModel):
    phone: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class SendOTPRequest(BaseModel):
    phone: str



class VerifyOTPRequest(BaseModel):
    phone: str
    code: str