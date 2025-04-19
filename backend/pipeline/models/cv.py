from sqlalchemy import BigInteger, Column, String, LargeBinary, Integer
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class CV(Base):
    __tablename__ = 'cvs'
    id = Column(Integer, primary_key=True, index=True)
    data = Column(BigInteger, nullable=False)
    size = Column(BigInteger, nullable=False)
    type = Column(String, nullable=False)

    