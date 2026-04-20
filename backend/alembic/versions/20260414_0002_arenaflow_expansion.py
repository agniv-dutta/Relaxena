"""ArenaFlow feature expansion

Revision ID: 20260414_0002
Revises: 20260414_0001
Create Date: 2026-04-14 01:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260414_0002"
down_revision: Union[str, None] = "20260414_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    is_sqlite = op.get_bind().dialect.name == "sqlite"

    op.add_column("venues", sa.Column("weather_condition", sa.String(length=80), nullable=True))
    op.add_column("venues", sa.Column("crowd_weather_score", sa.Float(), nullable=False, server_default="0"))

    op.create_table(
        "floors",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("venue_id", sa.Integer(), sa.ForeignKey("venues.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(length=80), nullable=False),
        sa.Column("level", sa.Integer(), nullable=False),
    )
    op.create_index("ix_floors_venue_id", "floors", ["venue_id"])
    op.create_index("ix_floors_name", "floors", ["name"])
    op.create_index("ix_floors_level", "floors", ["level"])

    if is_sqlite:
        op.add_column("zones", sa.Column("floor_id", sa.Integer(), nullable=True))
    else:
        op.add_column("zones", sa.Column("floor_id", sa.Integer(), sa.ForeignKey("floors.id", ondelete="SET NULL"), nullable=True))
    op.add_column("zones", sa.Column("capacity", sa.Integer(), nullable=False, server_default="1000"))
    op.add_column("zones", sa.Column("current_count", sa.Integer(), nullable=False, server_default="0"))
    op.add_column("zones", sa.Column("density_score", sa.Float(), nullable=False, server_default="0"))
    op.add_column("zones", sa.Column("polygon_geojson", sa.Text(), nullable=True))
    op.create_index("ix_zones_density_score", "zones", ["density_score"])

    if is_sqlite:
        op.add_column("gates", sa.Column("floor_id", sa.Integer(), nullable=True))
    else:
        op.add_column("gates", sa.Column("floor_id", sa.Integer(), sa.ForeignKey("floors.id", ondelete="SET NULL"), nullable=True))
    op.add_column("gates", sa.Column("status", sa.String(length=20), nullable=False, server_default="open"))
    op.create_index("ix_gates_status", "gates", ["status"])

    if is_sqlite:
        op.add_column("sections", sa.Column("floor_id", sa.Integer(), nullable=True))
    else:
        op.add_column("sections", sa.Column("floor_id", sa.Integer(), sa.ForeignKey("floors.id", ondelete="SET NULL"), nullable=True))

    op.create_table(
        "stands",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("venue_id", sa.Integer(), sa.ForeignKey("venues.id", ondelete="CASCADE"), nullable=False),
        sa.Column("floor_id", sa.Integer(), sa.ForeignKey("floors.id", ondelete="SET NULL"), nullable=True),
        sa.Column("zone_id", sa.Integer(), sa.ForeignKey("zones.id", ondelete="SET NULL"), nullable=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("avg_service_time_seconds", sa.Integer(), nullable=False, server_default="90"),
    )
    op.create_index("ix_stands_venue_id", "stands", ["venue_id"])
    op.create_index("ix_stands_name", "stands", ["name"])

    op.create_table(
        "restrooms",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("venue_id", sa.Integer(), sa.ForeignKey("venues.id", ondelete="CASCADE"), nullable=False),
        sa.Column("floor_id", sa.Integer(), sa.ForeignKey("floors.id", ondelete="SET NULL"), nullable=True),
        sa.Column("zone_id", sa.Integer(), sa.ForeignKey("zones.id", ondelete="SET NULL"), nullable=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="open"),
    )
    op.create_index("ix_restrooms_venue_id", "restrooms", ["venue_id"])
    op.create_index("ix_restrooms_name", "restrooms", ["name"])
    op.create_index("ix_restrooms_status", "restrooms", ["status"])

    if is_sqlite:
        op.add_column("queue_entries", sa.Column("user_id", sa.Integer(), nullable=True))
    else:
        op.add_column("queue_entries", sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True))
    op.add_column("queue_entries", sa.Column("location_id", sa.String(length=80), nullable=True))
    op.add_column("queue_entries", sa.Column("position", sa.Integer(), nullable=False, server_default="1"))
    op.add_column("queue_entries", sa.Column("estimated_ready_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("queue_entries", sa.Column("status", sa.String(length=20), nullable=False, server_default="waiting"))
    op.add_column("queue_entries", sa.Column("service_time_seconds", sa.Integer(), nullable=False, server_default="90"))
    op.create_index("ix_queue_entries_user_id", "queue_entries", ["user_id"])
    op.create_index("ix_queue_entries_location_id", "queue_entries", ["location_id"])
    op.create_index("ix_queue_entries_position", "queue_entries", ["position"])
    op.create_index("ix_queue_entries_estimated_ready_at", "queue_entries", ["estimated_ready_at"])
    op.create_index("ix_queue_entries_status", "queue_entries", ["status"])

    op.add_column("incidents", sa.Column("severity_score", sa.Integer(), nullable=True))
    op.add_column("incidents", sa.Column("category", sa.String(length=60), nullable=True))
    op.add_column("incidents", sa.Column("ai_summary", sa.Text(), nullable=True))
    op.add_column("incidents", sa.Column("ai_action_plan", sa.Text(), nullable=True))
    op.create_index("ix_incidents_category", "incidents", ["category"])

    op.create_table(
        "incident_logs",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("incident_id", sa.Integer(), sa.ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("note", sa.Text(), nullable=False),
        sa.Column("created_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_incident_logs_incident_id", "incident_logs", ["incident_id"])
    op.create_index("ix_incident_logs_created_at", "incident_logs", ["created_at"])

    op.create_table(
        "ai_conversations",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("venue_id", sa.Integer(), sa.ForeignKey("venues.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("channel", sa.String(length=40), nullable=False, server_default="assistant"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_ai_conversations_venue_id", "ai_conversations", ["venue_id"])
    op.create_index("ix_ai_conversations_user_id", "ai_conversations", ["user_id"])
    op.create_index("ix_ai_conversations_channel", "ai_conversations", ["channel"])
    op.create_index("ix_ai_conversations_created_at", "ai_conversations", ["created_at"])

    op.create_table(
        "ai_messages",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("conversation_id", sa.Integer(), sa.ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False),
        sa.Column("role", sa.String(length=20), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_ai_messages_conversation_id", "ai_messages", ["conversation_id"])
    op.create_index("ix_ai_messages_role", "ai_messages", ["role"])
    op.create_index("ix_ai_messages_created_at", "ai_messages", ["created_at"])

    op.create_table(
        "staff_members",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("staff_code", sa.String(length=40), nullable=False),
        sa.Column("designation", sa.String(length=80), nullable=False),
    )
    op.create_index("ix_staff_members_user_id", "staff_members", ["user_id"], unique=True)
    op.create_index("ix_staff_members_staff_code", "staff_members", ["staff_code"], unique=True)
    op.create_index("ix_staff_members_designation", "staff_members", ["designation"])

    op.create_table(
        "shift_logs",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("staff_member_id", sa.Integer(), sa.ForeignKey("staff_members.id", ondelete="CASCADE"), nullable=False),
        sa.Column("venue_id", sa.Integer(), sa.ForeignKey("venues.id", ondelete="CASCADE"), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("ended_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="active"),
    )
    op.create_index("ix_shift_logs_staff_member_id", "shift_logs", ["staff_member_id"])
    op.create_index("ix_shift_logs_venue_id", "shift_logs", ["venue_id"])
    op.create_index("ix_shift_logs_started_at", "shift_logs", ["started_at"])
    op.create_index("ix_shift_logs_status", "shift_logs", ["status"])


def downgrade() -> None:
    op.drop_table("shift_logs")
    op.drop_table("staff_members")
    op.drop_table("ai_messages")
    op.drop_table("ai_conversations")
    op.drop_table("incident_logs")

    op.drop_index("ix_incidents_category", table_name="incidents")
    op.drop_column("incidents", "ai_action_plan")
    op.drop_column("incidents", "ai_summary")
    op.drop_column("incidents", "category")
    op.drop_column("incidents", "severity_score")

    op.drop_index("ix_queue_entries_status", table_name="queue_entries")
    op.drop_index("ix_queue_entries_estimated_ready_at", table_name="queue_entries")
    op.drop_index("ix_queue_entries_position", table_name="queue_entries")
    op.drop_index("ix_queue_entries_location_id", table_name="queue_entries")
    op.drop_index("ix_queue_entries_user_id", table_name="queue_entries")
    op.drop_column("queue_entries", "service_time_seconds")
    op.drop_column("queue_entries", "status")
    op.drop_column("queue_entries", "estimated_ready_at")
    op.drop_column("queue_entries", "position")
    op.drop_column("queue_entries", "location_id")
    op.drop_column("queue_entries", "user_id")

    op.drop_table("restrooms")
    op.drop_table("stands")

    op.drop_column("sections", "floor_id")

    op.drop_index("ix_gates_status", table_name="gates")
    op.drop_column("gates", "status")
    op.drop_column("gates", "floor_id")

    op.drop_index("ix_zones_density_score", table_name="zones")
    op.drop_column("zones", "polygon_geojson")
    op.drop_column("zones", "density_score")
    op.drop_column("zones", "current_count")
    op.drop_column("zones", "capacity")
    op.drop_column("zones", "floor_id")

    op.drop_table("floors")

    op.drop_column("venues", "crowd_weather_score")
    op.drop_column("venues", "weather_condition")
