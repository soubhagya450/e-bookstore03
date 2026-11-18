import os
import uuid
from pathlib import Path
from werkzeug.utils import secure_filename
from flask import current_app

ALLOWED_EXTENSIONS = {'pdf', 'epub', 'jpg', 'jpeg', 'png', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class StorageManager:
    @staticmethod
    def get_upload_dir(subfolder=""):
        base = Path(current_app.config['UPLOAD_FOLDER'])
        target = base / subfolder if subfolder else base
        target.mkdir(parents=True, exist_ok=True)
        return target

    @staticmethod
    def save_file(file_storage, subfolder="books", custom_prefix=""):
        """
        Saves uploaded file.
        In production, if Cloudflare R2 / S3 environment variables are set,
        it can upload to R2. Otherwise, defaults seamlessly to local disk.
        """
        original_name = secure_filename(file_storage.filename or "file")
        ext = original_name.rsplit('.', 1)[-1].lower() if '.' in original_name else ''
        
        unique_name = f"{custom_prefix}_{uuid.uuid4().hex[:10]}.{ext}" if custom_prefix else f"{uuid.uuid4().hex[:12]}.{ext}"
        
        # Check if R2 configured
        r2_account = current_app.config.get('R2_ACCOUNT_ID')
        r2_key = current_app.config.get('R2_ACCESS_KEY_ID')
        r2_secret = current_app.config.get('R2_SECRET_ACCESS_KEY')
        r2_bucket = current_app.config.get('R2_BUCKET_NAME')
        
        if r2_account and r2_key and r2_secret and r2_bucket:
            try:
                import boto3
                endpoint = f"https://{r2_account}.r2.cloudflarestorage.com"
                s3 = boto3.client(
                    's3',
                    endpoint_url=endpoint,
                    aws_access_key_id=r2_key,
                    aws_secret_access_key=r2_secret,
                    region_name='auto'
                )
                r2_key_name = f"{subfolder}/{unique_name}"
                s3.upload_fileobj(file_storage, r2_bucket, r2_key_name)
                
                public_base = current_app.config.get('R2_PUBLIC_URL', '').rstrip('/')
                if public_base:
                    return f"{public_base}/{r2_key_name}"
                return f"/api/uploads/{subfolder}/{unique_name}"
            except Exception as e:
                current_app.logger.error(f"R2 upload error, falling back to local: {e}")
                # Reset file position if stream was read
                file_storage.seek(0)
        
        # Local filesystem storage
        target_dir = StorageManager.get_upload_dir(subfolder)
        file_path = target_dir / unique_name
        file_storage.save(str(file_path))
        
        # Return URL path accessible by public routes
        return f"/api/uploads/{subfolder}/{unique_name}"

    @staticmethod
    def format_size(num_bytes):
        for unit in ['B', 'KB', 'MB', 'GB']:
            if num_bytes < 1024.0:
                return f"{num_bytes:.1f} {unit}"
            num_bytes /= 1024.0
        return f"{num_bytes:.1f} TB"
