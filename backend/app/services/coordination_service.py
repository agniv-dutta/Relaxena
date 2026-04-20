from datetime import datetime, timedelta, timezone

from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.alert import Alert
from app.models.crowd import CrowdSnapshot
from app.models.incident import Incident
from app.models.queue import QueueEntry
from app.schemas.coordination import AlertCreate, DashboardStats, IncidentCreate


async def create_staff_alert(db: AsyncSession, payload: AlertCreate) -> Alert:
    alert = Alert(
        venue_id=payload.venue_id,
        zone_id=payload.zone_id,
        severity=payload.severity,
        title=payload.title,
        message=payload.message,
    )
    db.add(alert)
    await db.commit()
    await db.refresh(alert)

    return alert


async def report_incident(db: AsyncSession, user_id: int, payload: IncidentCreate) -> Incident:
    severity = payload.severity.lower()
    escalated = severity in {"high", "critical"}

    incident = Incident(
        venue_id=payload.venue_id,
        zone_id=payload.zone_id,
        reported_by_user_id=user_id,
        title=payload.title,
        description=payload.description,
        severity=severity,
        escalated=escalated,
        status="open",
    )
    db.add(incident)

    if escalated:
        db.add(
            Alert(
                venue_id=payload.venue_id,
                zone_id=payload.zone_id,
                severity="critical",
                title="Incident Escalation",
                message=f"Incident '{payload.title}' has been escalated.",
            )
        )

    await db.commit()
    await db.refresh(incident)
    return incident


async def dashboard_stats(db: AsyncSession, venue_id: int) -> DashboardStats:
    one_hour_ago = datetime.now(timezone.utc) - timedelta(hours=1)

    active_incidents_stmt = select(func.count(Incident.id)).where(
        and_(Incident.venue_id == venue_id, Incident.status == "open")
    )
    critical_alerts_stmt = select(func.count(Alert.id)).where(
        and_(
            Alert.venue_id == venue_id,
            Alert.severity.in_(["high", "critical"]),
            Alert.created_at >= one_hour_ago,
        )
    )
    avg_density_stmt = select(func.avg(CrowdSnapshot.density_score)).where(CrowdSnapshot.venue_id == venue_id)
    active_queue_stmt = select(func.count(QueueEntry.id)).where(QueueEntry.venue_id == venue_id)

    active_incidents = (await db.execute(active_incidents_stmt)).scalar_one()
    critical_alerts = (await db.execute(critical_alerts_stmt)).scalar_one()
    avg_density = (await db.execute(avg_density_stmt)).scalar_one()
    active_queue_entries = (await db.execute(active_queue_stmt)).scalar_one()

    return DashboardStats(
        active_incidents=int(active_incidents),
        critical_alerts_last_hour=int(critical_alerts),
        avg_density=float(avg_density or 0.0),
        active_queue_entries=int(active_queue_entries),
    )
