import os
import logging
from ory_client import Configuration, ApiClient
from ory_client.api import identity_api
from fastapi import HTTPException

logger = logging.getLogger(__name__)

KRATOS_ADMIN_URL = os.getenv("KRATOS_ADMIN_URL", "http://kratos-admin.geo-ory.svc.cluster.local")

# Configure Kratos client
kratos_config = Configuration(host=KRATOS_ADMIN_URL)

async def lookup_user_by_email(email: str) -> str:
    """Look up Kratos user ID by email address"""
    try:
        with ApiClient(kratos_config) as api_client:
            api = identity_api.IdentityApi(api_client)
            
            # List identities with credentials identifier filter
            identities = api.list_identities(
                credentials_identifier=email
            )
            
            if not identities or len(identities) == 0:
                raise HTTPException(status_code=404, detail=f"User with email '{email}' not found")
            
            # Return the first matching identity's ID
            user_id = identities[0].id
            if not user_id:
                raise HTTPException(status_code=500, detail="Invalid identity response")
            
            logger.info(f"Found user ID {user_id} for email {email}")
            return user_id
    except HTTPException:
        # Re-raise HTTPExceptions as-is
        raise
    except Exception as e:
        logger.error(f"Error looking up user by email {email}: {e}")
        raise HTTPException(status_code=500, detail=f"Error looking up user: {str(e)}")
