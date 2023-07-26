"""add user-characters and user-campaigns relationships

Revision ID: 6139fbceaa77
Revises: 034a7c543793
Create Date: 2023-07-25 12:58:58.486780

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6139fbceaa77'
down_revision = '034a7c543793'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('items', schema=None) as batch_op:
        batch_op.drop_column('rarity')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('items', schema=None) as batch_op:
        batch_op.add_column(sa.Column('rarity', sa.VARCHAR(), nullable=True))

    # ### end Alembic commands ###