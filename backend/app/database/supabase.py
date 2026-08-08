import os
import httpx
from dotenv import load_dotenv
from supabase import create_client, ClientOptions

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# HTTP/2 has an intermittent issue on Windows (httpx.ReadError /
# WinError 10035) that surfaces as random 500s on otherwise-correct
# requests. Disabling it trades a small amount of connection reuse
# efficiency for reliability.
_http_client = httpx.Client(http2=False)

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    options=ClientOptions(httpx_client=_http_client),
)