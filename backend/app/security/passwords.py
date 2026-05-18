from passlib.context import CryptContext

myctx = CryptContext(schemes=["bcrypt"], deprecated='auto')

def hash_password(plain_password: str) -> str:
    return myctx.hash(plain_password)

def verify_password(plain_password: str, hashed: str) -> bool:
    return myctx.verify(plain_password, hashed)