import os
import logging
from ory_client import Configuration, ApiClient
from ory_client.api import relationship_api
from ory_client.models import CreateRelationshipBody

logger = logging.getLogger(__name__)

KETO_WRITE_URL = os.getenv("KETO_WRITE_URL", "http://keto-write.geo-ory.svc.cluster.local:4467")
KETO_READ_URL = os.getenv("KETO_READ_URL", "http://keto-read.geo-ory.svc.cluster.local:4466")

# Configure Keto clients
write_config = Configuration(host=KETO_WRITE_URL)
read_config = Configuration(host=KETO_READ_URL)

async def create_owner_relationship(user_id: str, report_id: int):
    """Grant user ownership of a report (includes view access)"""
    try:
        with ApiClient(write_config) as api_client:
            api = relationship_api.RelationshipApi(api_client)
            
            # Create owner relationship
            owner_relationship = CreateRelationshipBody(
                namespace="Report",
                object=str(report_id),
                relation="owner",
                subject_id=user_id
            )
            api.create_relationship(owner_relationship)
            
            # Also grant view access to the owner
            view_relationship = CreateRelationshipBody(
                namespace="Report",
                object=str(report_id),
                relation="view",
                subject_id=user_id
            )
            api.create_relationship(view_relationship)
            
            logger.info(f"Created ownership and view access: {user_id} owns Report:{report_id}")
    except Exception as e:
        logger.error(f"Failed to create Keto relationship: {e}")
        raise

async def grant_view_access(user_id: str, report_id: int):
    """Grant user view access to a report (for sharing)"""
    try:
        with ApiClient(write_config) as api_client:
            api = relationship_api.RelationshipApi(api_client)
            relationship = CreateRelationshipBody(
                namespace="Report",
                object=str(report_id),
                relation="view",
                subject_id=user_id
            )
            api.create_relationship(relationship)
            logger.info(f"Granted view access: {user_id} can view Report:{report_id}")
    except Exception as e:
        logger.error(f"Failed to grant view access: {e}")
        raise

async def revoke_access(user_id: str, report_id: int, relation: str = "view"):
    """Revoke user access to a report"""
    try:
        with ApiClient(write_config) as api_client:
            api = relationship_api.RelationshipApi(api_client)
            api.delete_relationships(
                namespace="Report",
                object=str(report_id),
                relation=relation,
                subject_id=user_id
            )
            logger.info(f"Revoked {relation} access: {user_id} from Report:{report_id}")
    except Exception as e:
        logger.error(f"Failed to revoke access: {e}")
        raise

async def delete_all_relationships(report_id: int):
    """Delete all relationships for a report (when report is deleted)"""
    try:
        with ApiClient(write_config) as api_client:
            api = relationship_api.RelationshipApi(api_client)
            # Delete all relationships for this report object
            api.delete_relationships(
                namespace="Report",
                object=str(report_id)
            )
            logger.info(f"Deleted all relationships for Report:{report_id}")
    except Exception as e:
        logger.error(f"Failed to delete relationships: {e}")
        raise

async def get_user_accessible_reports(user_id: str) -> list[int]:
    """Get all report IDs that the user can view (owned or shared)"""
    try:
        with ApiClient(read_config) as api_client:
            api = relationship_api.RelationshipApi(api_client)
            
            # Query for all reports where user has 'view' relation
            relationships = api.get_relationships(
                namespace="Report",
                relation="view",
                subject_id=user_id
            )
            
            # Extract report IDs from the relationships
            report_ids = [int(rel.object) for rel in relationships.relation_tuples]
            logger.info(f"User {user_id} has view access to {len(report_ids)} reports")
            return report_ids
    except Exception as e:
        logger.error(f"Failed to get user accessible reports: {e}")
        # Return empty list on error to avoid blocking the user
        return []

async def check_access(user_id: str, report_id: int, action: str = "view") -> bool:
    """Check if user has specific access to a report"""
    try:
        with ApiClient(read_config) as api_client:
            api = relationship_api.RelationshipApi(api_client)
            
            # Check if relationship exists by querying for it
            relationships = api.get_relationships(
                namespace="Report",
                object=str(report_id),
                relation=action,
                subject_id=user_id
            )
            
            # If any relationships exist, user has access
            return len(relationships.relation_tuples) > 0
    except Exception as e:
        logger.error(f"Failed to check access: {e}")
        return False

async def get_report_viewers(report_id: int) -> list[str]:
    """Get all user IDs who have view access to a report (excluding owners)"""
    try:
        with ApiClient(read_config) as api_client:
            api = relationship_api.RelationshipApi(api_client)
            
            # Query for all users with 'view' relation to this report
            relationships = api.get_relationships(
                namespace="Report",
                object=str(report_id),
                relation="view"
            )
            
            # Extract user IDs, excluding the owner
            user_ids = [rel.subject_id for rel in relationships.relation_tuples if rel.subject_id]
            logger.info(f"Report {report_id} has {len(user_ids)} viewers")
            return user_ids
    except Exception as e:
        logger.error(f"Failed to get report viewers: {e}")
        return []
