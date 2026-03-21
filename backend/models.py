from enum import Enum
from uuid import UUID, uuid7
from pydantic import BaseModel, EmailStr, datetime, PhoneNumber


class BaseObject(BaseModel):
    id: UUID = uuid7()


class Types(BaseObject):
    name: str


class Role(Enum):
    ENTERPRISE_ADMIN = "Администратор предприятия"
    SPECIALIST = "Специалист"


class PositionPropertyType(Types):
    pass


class OrganizationPropertyType(Types):
    pass


class MeasureType(Types):
    min_value: float
    max_value: float


class Organization(BaseObject):
    name: str


class OrganizationProperty(BaseObject):
    organization: Organization
    type: OrganizationPropertyType
    value: str


class Position(BaseObject):
    name: str
    owner: Organization
    warehouse: Organization
    publication_datetime: datetime
    count: int
    measure: MeasureType


class PositionProperty(BaseObject):
    organization: Organization
    type: OrganizationPropertyType
    value: str


class Factor(BaseObject):
    position: Position
    measure: MeasureType
    value: int


class User(BaseObject):
    login: str
    password: str
    nickname: str
    role: Role
    email: EmailStr
    phone_number: PhoneNumber
    organization: Organization