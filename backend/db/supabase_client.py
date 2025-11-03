from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

supabase_url: str = os.getenv("SUPABASE_URL")
supabase_service_key: str = os.getenv("SUPABESE_SERVICE_KEY")

supabase: Client = create_client(supabase_url, supabase_service_key)